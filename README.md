### snrn

### User Data Script for AWS EC2

The `user-data-script.sh` script automatically configures an EC2 instance after it is launched.

#### Steps to use:
1. Copy the contents of the `infrastructure/user-data-script.sh` file.
2. Paste it into the **User Data** field when creating a new EC2 instance through the AWS Management Console.
3. Make sure the **"User data has already been base64 encoded"** checkbox is not selected.

The script will automatically install Docker, Docker Compose, clone the project, and run Docker containers.