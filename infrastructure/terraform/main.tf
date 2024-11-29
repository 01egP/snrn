terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

resource "aws_instance" "snrn_server" {
  ami           = var.ami_id
  instance_type = var.instance_type
  tags = {
    Name = var.instance_name
  }

  user_data = <<-EOF
    #!/bin/bash
    # Update system
    sudo yum update -y
    
    # Setup swap
    if [ ! -f /swapfile ]; then
        fallocate -l 1G /swapfile
        chmod 600 /swapfile
        mkswap /swapfile
        swapon /swapfile
        echo '/swapfile swap swap defaults 0 0' >> /etc/fstab
    fi

    # Install Docker
    sudo amazon-linux-extras install docker -y
    sudo service docker start
    sudo usermod -a -G docker ec2-user

    # Install Docker Compose
    sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose

    # Create .ssh directory, if it does not exist
    if [ ! -d /home/ec2-user/.ssh ]; then
        mkdir -p /home/ec2-user/.ssh
        sudo chown ec2-user:ec2-user /home/ec2-user/.ssh
        chmod 700 /home/ec2-user/.ssh
    fi

    # Check SSH key
    if [ -f /home/ec2-user/.ssh/id_rsa ]; then
        echo "SSH key exists, cloning repository using SSH..."
        git clone ${var.git_repository} /home/ec2-user/app
    else
        echo "SSH key not found, skipping repository cloning..."
    fi

    # Move to directory with application, if repository is cloned
    if [ -d /home/ec2-user/app ]; then
        cd /home/ec2-user/app
        echo "Building and running Docker containers..."
        # Build and run containers
        sudo docker-compose up -d
    else
        echo "App directory not found. Please ensure SSH key is configured and clone the repository manually."
    fi

    # Setup Docker to start on boot
    sudo systemctl enable docker

    echo "User Data script finished."
  EOF
  user_data_replace_on_change = false
}

resource "aws_s3_bucket" "snrn_bucket" {
  bucket = var.s3_bucket_name
  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_lb" "snrn_alb" {
  name               = "snrn-alb"
  internal           = false
  load_balancer_type = "application"
  enable_cross_zone_load_balancing = true
  enable_http2                = true
  idle_timeout                = 60
  ip_address_type             = "ipv4"
  security_groups             = [var.security_group_id]

  subnet_mapping {
    subnet_id = var.subnet_id_1
  }

  subnet_mapping {
    subnet_id = var.subnet_id_2
  }

  tags = {
    Name = "snrn-alb"
  }
}

resource "aws_cloudfront_distribution" "snrn_distribution" {
  enabled             = true
  default_root_object = "index.html"
  is_ipv6_enabled = true

  lifecycle {
    ignore_changes = [
      default_cache_behavior[0].cache_policy_id,
      ordered_cache_behavior[0].cache_policy_id,
      ordered_cache_behavior[0].origin_request_policy_id,
      origin
    ]
  }

  # First Origin for S3 bucket (frontend)
  origin {
    domain_name = var.s3_origin_domain_name
    origin_id   = var.s3_origin_id
  }

  # Second Origin for backend (e.g. ALB)
  origin {
    domain_name = var.alb_origin_domain_name
    origin_id   = var.alb_origin_id
  }

  # Rules for S3 (frontend)
  default_cache_behavior {
    target_origin_id       = var.s3_origin_id
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true
  }

  # Rules for backend (API)
  ordered_cache_behavior {
    path_pattern           = "/api/*"
    target_origin_id       = var.alb_origin_id
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD", "OPTIONS", "POST", "PUT", "PATCH", "DELETE"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true
  }
  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 10
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}
