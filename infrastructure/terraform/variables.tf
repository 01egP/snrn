variable "aws_region" {
  default = "eu-central-1"
}

variable "ami_id" {
  description = "AMI ID for EC2 instance"
}

variable "instance_type" {
  default = "t2.micro"
}

variable "instance_name" {
  default = "snrn_server"
}

variable "git_repository" {
  description = "Git repository URL"
}

variable "s3_bucket_name" {
  default = "snrn-bucket"
}

variable "security_group_id" {
  description = "Security group ID for ALB"
}

variable "subnet_id_1" {
  description = "First subnet ID"
}

variable "subnet_id_2" {
  description = "Second subnet ID"
}

# Origin variables
variable "s3_origin_domain_name" {
  description = "Domain name for S3 bucket origin"
}

variable "s3_origin_id" {
  description = "Origin ID for S3 bucket"
}

variable "alb_origin_domain_name" {
  description = "Domain name for ALB origin"
}

variable "alb_origin_id" {
  description = "Origin ID for ALB"
}
