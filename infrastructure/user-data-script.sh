#!/bin/bash
# Update system
sudo yum update -y

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
    git clone git@github.com:your-repo/backend-app.git /home/ec2-user/app
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
