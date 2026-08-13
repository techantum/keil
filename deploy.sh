#!/bin/bash

# KK Engineering Deployment Script
# This script automates the deployment process

set -e  # Exit on error

echo "🚀 Starting deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="/var/www/kk-engineering"
APP_NAME="kk-engineering"
NODE_VERSION="18"  # Adjust based on your Node.js version

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then 
    print_error "Please run with sudo"
    exit 1
fi

# Navigate to app directory
cd $APP_DIR || exit

print_warning "Pulling latest changes from repository..."
git pull origin main

print_warning "Installing dependencies..."
npm ci --production=false

print_warning "Building application..."
npm run build

print_warning "Creating logs directory if it doesn't exist..."
mkdir -p logs

print_warning "Restarting application with PM2..."
pm2 restart $APP_NAME || pm2 start ecosystem.config.js

print_warning "Saving PM2 configuration..."
pm2 save

print_success "Deployment completed successfully!"

echo ""
echo "📊 Application Status:"
pm2 status $APP_NAME

echo ""
echo "📝 View logs with: pm2 logs $APP_NAME"
echo "🔄 Restart with: pm2 restart $APP_NAME"
echo "⏹️  Stop with: pm2 stop $APP_NAME"
