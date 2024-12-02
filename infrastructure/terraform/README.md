# Terraform Infrastructure Setup

This project contains Terraform configurations for provisioning and managing the infrastructure required for the **SNRN application**. Below is a comprehensive guide for setting up and maintaining the infrastructure.

---

## Table of Contents

1. [Requirements](#requirements)
2. [Folder Structure](#folder-structure)
3. [Setup and Initialization](#setup-and-initialization)
4. [Variables](#variables)
5. [Commands](#commands)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

---

## Requirements

### Prerequisites
- **Terraform**: Version `1.0.0` or later. Install it from the [Terraform website](https://www.terraform.io/downloads).
- **AWS CLI**: Installed and configured with appropriate credentials. Use `aws configure` to set up.
- **Git**: To manage version control for this repository.
- **Access to AWS Free Tier**: Ensure your AWS account has sufficient permissions for creating EC2, S3, ALB, and CloudFront resources.

---

## Folder Structure

```plaintext
/infrastructure/
├── terraform/
│   ├── main.tf              # Main configuration file
│   ├── variables.tf         # Variable definitions
│   ├── outputs.tf           # Output values for Terraform
│   ├── terraform.tfvars     # Environment-specific variable values (not committed)
│   ├── backend.tf           # Remote backend configuration (if used)
│   ├── provider.tf          # AWS provider configuration
│   ├── README.md            # This documentation
└── .gitignore               # Ignore sensitive files
```
## Setup and Initialization

### 1. Clone the Repository

```bash
git clone git@github.com:01egP/snrn.git
cd infrastructure/terraform
```

### 2. Initialize Terraform
Download required providers and set up the Terraform environment:

```bash
terraform init
```
### 3. Configure Environment Variables
Define values for required variables in terraform.tfvars (this file is not committed to the repository):

```bash
aws_region           = "eu-central-1"
ami_id               = "ami-xxxxxxxxxxxxxxxxx"
git_repository       = "git@github.com:01egP/snrn.git"
security_group_id    = "sg-xxxxxxxxxxxx"
subnet_id_1          = "subnet-xxxxxxxxxxxx"
subnet_id_2          = "subnet-xxxxxxxxxxxx"
```
Alternatively, use CLI flags or environment variables to provide these values.

## Variables

The following variables are used in this Terraform project:

| Variable                  | Description                             | Default         | Required |
|---------------------------|-----------------------------------------|-----------------|----------|
| `aws_region`              | AWS region for resource provisioning   | `eu-central-1`  | Yes      |
| `ami_id`                  | AMI ID for the EC2 instance            | N/A             | Yes      |
| `instance_type`           | Instance type for EC2                  | `t2.micro`      | No       |
| `instance_name`           | Name tag for the EC2 instance          | `snrn_server`   | No       |
| `git_repository`          | Repository URL for application code    | N/A             | Yes      |
| `s3_bucket_name`          | Name of the S3 bucket                  | `snrn-bucket`   | No       |
| `security_group_id`       | Security Group ID for ALB              | N/A             | Yes      |
| `subnet_id_1`             | First subnet ID                        | N/A             | Yes      |
| `subnet_id_2`             | Second subnet ID                       | N/A             | Yes      |
| `s3_origin_domain_name`   | Domain name for S3 bucket origin       | Predefined      | No       |
| `alb_origin_domain_name`  | Domain name for ALB origin             | Predefined      | No       |

### Notes:
- **Required**: Variables marked as "Yes" under the Required column must be defined in the `terraform.tfvars` file or passed as arguments when running Terraform commands.
- **Default**: Variables with default values are optional, but you can override them if needed.


## Commands
### Plan the Infrastructure
Preview the changes Terraform will make:
```bash
terraform plan
```
### Apply the Configuration
Provision or update the infrastructure:
```bash
terraform apply
```
### Destroy the Infrastructure
Tear down all resources managed by Terraform:
```bash
terraform destroy
```

## Best Practices

Follow these best practices to ensure secure, efficient, and manageable Terraform configurations:

### 1. Environment Separation
- Use separate state files or workspaces for different environments such as **staging** and **production**.
- This ensures that changes in one environment do not accidentally impact another.

### 2. Sensitive Data Management
- Do not commit sensitive variable files (e.g., `terraform.tfvars`) to version control.
- Add such files to `.gitignore` to prevent accidental exposure.
- Use environment variables or a secure secrets management tool (e.g., AWS Secrets Manager) for sensitive values.

### 3. State Management
- Use a **remote backend** such as AWS S3 for managing the Terraform state file.
- Enable **DynamoDB locking** to prevent concurrent state file modifications and ensure consistency.

### 4. Lifecycle Rules
- Use `lifecycle` blocks in Terraform configurations to prevent accidental resource destruction or replacement.
- Example:
  ```hcl
  resource "aws_instance" "example" {
    ami           = "ami-12345678"
    instance_type = "t2.micro"

    lifecycle {
      prevent_destroy = true
    }
  }
  ```
By adhering to these practices, you can reduce risks, ensure security, and streamline the management of your Terraform-based infrastructure.


## Troubleshooting

Common issues and solutions to ensure smooth operation of the Terraform infrastructure:

### Issue: Locked State File
**Error**:  
`Error: Lock table already exists`

**Fix**:  
Manually delete the lock file from the backend. For example, if using an S3 bucket as the backend:
1. Navigate to the S3 bucket in the AWS Management Console.
2. Locate and delete the `.terraform.lock` file.

---

### Issue: Resource Already Exists
**Error**:  
`Resource already managed by Terraform`

**Fix**:  
Use the `terraform import` command to bring the existing resource under Terraform's management:
1. Identify the resource's details (e.g., its ARN or ID in AWS).
2. Run the command:
   
    ```bash
   terraform import <resource_type>.<resource_name> <resource_identifier>
    ```

### Instance or Application Unreachable

**Fix**:  
Use the `terraform import` command to bring the existing resource under Terraform's management:
1. Verify Security Group Rules:
Ensure that the Security Group attached to the instance or ALB allows incoming traffic on the required ports.
2. Check Application Logs:
Use Docker logs to diagnose the application:

   ```bash
   docker logs <container_id>
  
   ```

3. Verify Target Group Health:
In the AWS Management Console:
- Go to the ALB Target Group.
- Confirm that the health checks are passing and the instances are healthy. consistency.

By addressing these common issues proactively, you can minimize downtime and maintain reliable infrastructure.

## Contributing
Feel free to contribute by creating issues or pull requests for any improvements or bug fixes.

## License
This project is licensed under the **MIT License**.