#!/bin/bash

# BiteDash AWS Setup Script
# This script automates the AWS infrastructure setup for the BiteDash application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
AWS_REGION="us-east-1"
CLUSTER_NAME="bitedash-cluster"
BACKEND_REPO="bitedash-backend"
FRONTEND_REPO="bitedash-frontend"

echo -e "${GREEN}=== BiteDash AWS Setup ===${NC}\n"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}AWS CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if user is logged in
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}Not authenticated with AWS. Please run 'aws configure' first.${NC}"
    exit 1
fi

AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo -e "${GREEN}AWS Account ID: ${AWS_ACCOUNT_ID}${NC}\n"

# Function to create ECR repository
create_ecr_repo() {
    local repo_name=$1
    echo -e "${YELLOW}Creating ECR repository: ${repo_name}${NC}"
    
    if aws ecr describe-repositories --repository-names ${repo_name} --region ${AWS_REGION} &> /dev/null; then
        echo -e "${GREEN}Repository ${repo_name} already exists${NC}"
    else
        aws ecr create-repository \
            --repository-name ${repo_name} \
            --region ${AWS_REGION} \
            --image-scanning-configuration scanOnPush=true \
            --encryption-configuration encryptionType=AES256
        echo -e "${GREEN}Created repository: ${repo_name}${NC}"
    fi
}

# Function to create CloudWatch log group
create_log_group() {
    local log_group=$1
    echo -e "${YELLOW}Creating CloudWatch log group: ${log_group}${NC}"
    
    if aws logs describe-log-groups --log-group-name-prefix ${log_group} --region ${AWS_REGION} | grep -q ${log_group}; then
        echo -e "${GREEN}Log group ${log_group} already exists${NC}"
    else
        aws logs create-log-group --log-group-name ${log_group} --region ${AWS_REGION}
        echo -e "${GREEN}Created log group: ${log_group}${NC}"
    fi
}

# Step 1: Create ECR Repositories
echo -e "\n${GREEN}Step 1: Creating ECR Repositories${NC}"
create_ecr_repo ${BACKEND_REPO}
create_ecr_repo ${FRONTEND_REPO}

# Step 2: Create ECS Cluster
echo -e "\n${GREEN}Step 2: Creating ECS Cluster${NC}"
if aws ecs describe-clusters --clusters ${CLUSTER_NAME} --region ${AWS_REGION} | grep -q ${CLUSTER_NAME}; then
    echo -e "${GREEN}Cluster ${CLUSTER_NAME} already exists${NC}"
else
    aws ecs create-cluster \
        --cluster-name ${CLUSTER_NAME} \
        --capacity-providers FARGATE FARGATE_SPOT \
        --region ${AWS_REGION}
    
    # Enable Container Insights
    aws ecs update-cluster-settings \
        --cluster ${CLUSTER_NAME} \
        --settings name=containerInsights,value=enabled \
        --region ${AWS_REGION}
    
    echo -e "${GREEN}Created cluster: ${CLUSTER_NAME}${NC}"
fi

# Step 3: Create CloudWatch Log Groups
echo -e "\n${GREEN}Step 3: Creating CloudWatch Log Groups${NC}"
create_log_group "/ecs/bitedash-backend"
create_log_group "/ecs/bitedash-frontend"

# Step 4: Create IAM Roles
echo -e "\n${GREEN}Step 4: Setting up IAM Roles${NC}"

# Check if ecsTaskExecutionRole exists
if aws iam get-role --role-name ecsTaskExecutionRole &> /dev/null; then
    echo -e "${GREEN}ecsTaskExecutionRole already exists${NC}"
else
    echo -e "${YELLOW}Creating ecsTaskExecutionRole${NC}"
    
    # Create trust policy
    cat > /tmp/trust-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
    
    aws iam create-role \
        --role-name ecsTaskExecutionRole \
        --assume-role-policy-document file:///tmp/trust-policy.json
    
    # Attach policies
    aws iam attach-role-policy \
        --role-name ecsTaskExecutionRole \
        --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
    
    aws iam attach-role-policy \
        --role-name ecsTaskExecutionRole \
        --policy-arn arn:aws:iam::aws:policy/SecretsManagerReadWrite
    
    echo -e "${GREEN}Created ecsTaskExecutionRole${NC}"
fi

# Step 5: Display next steps
echo -e "\n${GREEN}=== Setup Complete ===${NC}\n"
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "1. Store your secrets in AWS Secrets Manager:"
echo -e "   aws secretsmanager create-secret --name bitedash/mongodb-url --secret-string 'your-mongodb-url'"
echo -e "   aws secretsmanager create-secret --name bitedash/jwt-secret --secret-string 'your-jwt-secret'"
echo -e "   (Repeat for all required secrets)"
echo -e ""
echo -e "2. Update task definition files with your AWS Account ID:"
echo -e "   Replace <YOUR_AWS_ACCOUNT_ID> with: ${AWS_ACCOUNT_ID}"
echo -e ""
echo -e "3. Create VPC, subnets, and security groups (or use existing ones)"
echo -e ""
echo -e "4. Create Application Load Balancer and target groups"
echo -e ""
echo -e "5. Register task definitions and create ECS services"
echo -e ""
echo -e "6. Set up GitHub secrets for CI/CD:"
echo -e "   AWS_ACCESS_KEY_ID"
echo -e "   AWS_SECRET_ACCESS_KEY"
echo -e ""
echo -e "${GREEN}ECR Repository URIs:${NC}"
echo -e "Backend:  ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${BACKEND_REPO}"
echo -e "Frontend: ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${FRONTEND_REPO}"
echo -e ""
echo -e "${GREEN}For detailed instructions, see: aws-setup-guide.md${NC}"
