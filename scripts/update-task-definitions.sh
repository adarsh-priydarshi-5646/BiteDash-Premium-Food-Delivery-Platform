#!/bin/bash

# Update task definition files with your AWS Account ID
# Usage: ./update-task-definitions.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Get AWS Account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

if [ -z "$AWS_ACCOUNT_ID" ]; then
    echo "Error: Could not get AWS Account ID. Make sure AWS CLI is configured."
    exit 1
fi

echo -e "${GREEN}AWS Account ID: ${AWS_ACCOUNT_ID}${NC}\n"

# Update backend task definition
echo -e "${YELLOW}Updating backend-task-definition.json...${NC}"
sed -i.bak "s/<YOUR_AWS_ACCOUNT_ID>/${AWS_ACCOUNT_ID}/g" backend-task-definition.json
rm backend-task-definition.json.bak 2>/dev/null || true

# Update frontend task definition
echo -e "${YELLOW}Updating frontend-task-definition.json...${NC}"
sed -i.bak "s/<YOUR_AWS_ACCOUNT_ID>/${AWS_ACCOUNT_ID}/g" frontend-task-definition.json
rm frontend-task-definition.json.bak 2>/dev/null || true

echo -e "${GREEN}Task definitions updated successfully!${NC}\n"

# Register task definitions
read -p "Do you want to register these task definitions now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Registering backend task definition...${NC}"
    aws ecs register-task-definition --cli-input-json file://backend-task-definition.json --region us-east-1
    
    echo -e "${YELLOW}Registering frontend task definition...${NC}"
    aws ecs register-task-definition --cli-input-json file://frontend-task-definition.json --region us-east-1
    
    echo -e "${GREEN}Task definitions registered successfully!${NC}"
fi
