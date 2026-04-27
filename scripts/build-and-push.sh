#!/bin/bash

# Build and Push Docker Images to ECR
# Usage: ./build-and-push.sh [backend|frontend|all]

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
AWS_REGION="us-east-1"
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
BACKEND_REPO="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/bitedash-backend"
FRONTEND_REPO="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/bitedash-frontend"
IMAGE_TAG=$(git rev-parse --short HEAD)

# Login to ECR
echo -e "${YELLOW}Logging in to Amazon ECR...${NC}"
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

build_backend() {
    echo -e "\n${GREEN}Building backend image...${NC}"
    cd backend
    docker build -t bitedash-backend .
    docker tag bitedash-backend:latest ${BACKEND_REPO}:${IMAGE_TAG}
    docker tag bitedash-backend:latest ${BACKEND_REPO}:latest
    
    echo -e "${GREEN}Pushing backend image...${NC}"
    docker push ${BACKEND_REPO}:${IMAGE_TAG}
    docker push ${BACKEND_REPO}:latest
    
    echo -e "${GREEN}Backend image pushed successfully!${NC}"
    echo -e "Image: ${BACKEND_REPO}:${IMAGE_TAG}"
    cd ..
}

build_frontend() {
    echo -e "\n${GREEN}Building frontend image...${NC}"
    cd frontend
    docker build -t bitedash-frontend .
    docker tag bitedash-frontend:latest ${FRONTEND_REPO}:${IMAGE_TAG}
    docker tag bitedash-frontend:latest ${FRONTEND_REPO}:latest
    
    echo -e "${GREEN}Pushing frontend image...${NC}"
    docker push ${FRONTEND_REPO}:${IMAGE_TAG}
    docker push ${FRONTEND_REPO}:latest
    
    echo -e "${GREEN}Frontend image pushed successfully!${NC}"
    echo -e "Image: ${FRONTEND_REPO}:${IMAGE_TAG}"
    cd ..
}

# Main logic
case "${1:-all}" in
    backend)
        build_backend
        ;;
    frontend)
        build_frontend
        ;;
    all)
        build_backend
        build_frontend
        ;;
    *)
        echo "Usage: $0 [backend|frontend|all]"
        exit 1
        ;;
esac

echo -e "\n${GREEN}All images pushed successfully!${NC}"
