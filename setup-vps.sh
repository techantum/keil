#!/bin/bash

# KK Engineering VPS Setup Script for Hostinger
# This script sets up the complete environment for deployment

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

echo "=========================================="
echo "  KK Engineering VPS Setup"
echo "=========================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    print_error "Please run with sudo"
    exit 1
fi

# Update system
print_warning "Updating system packages..."
apt update && apt upgrade -y
print_success "System updated"

# Install Node.js 18.x
print_warning "Installing Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs
print_success "Node.js installed: $(node -v)"
print_success "NPM installed: $(npm -v)"

# Install PM2 globally
print_warning "Installing PM2 process manager..."
npm install -g pm2
print_success "PM2 installed: $(pm2 -v)"

# Install MongoDB
print_warning "Installing MongoDB..."
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list
apt update
apt install -y mongodb-org
systemctl start mongod
systemctl enable mongod
print_success "MongoDB installed and started"

# Install Nginx
print_warning "Installing Nginx..."
apt install -y nginx
systemctl start nginx
systemctl enable nginx
print_success "Nginx installed and started"

# Create application directory
APP_DIR="/var/www/kk-engineering"
print_warning "Creating application directory at $APP_DIR..."
mkdir -p $APP_DIR
print_success "Application directory created"

# Set up firewall
print_warning "Configuring firewall..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
print_success "Firewall configured"

# Create logs directory
mkdir -p $APP_DIR/logs
print_success "Logs directory created"

echo ""
echo "=========================================="
print_success "VPS Setup Complete!"
echo "=========================================="
echo ""
print_info "Next steps:"
echo "1. Clone your repository to $APP_DIR"
echo "2. Copy .env.example to .env and configure environment variables"
echo "3. Run: npm install"
echo "4. Run: npm run seed (to populate MongoDB)"
echo "5. Run: npm run build"
echo "6. Configure Nginx (copy nginx.conf to /etc/nginx/sites-available/)"
echo "7. Start application: pm2 start ecosystem.config.js"
echo "8. Save PM2 configuration: pm2 save && pm2 startup"
echo ""
