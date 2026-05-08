#!/bin/bash

###############################################################################
# LWO Deployment Script
# For deploying updates to admin site and Strapi CMS on DigitalOcean droplet
###############################################################################

set -e  # Exit on error

echo "🚀 LWO Deployment Script"
echo "======================="
echo ""

# Configuration
REPO_DIR="/home/lwo/lwo"
BRANCH="main"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if running in correct directory
if [ ! -d "$REPO_DIR" ]; then
    print_error "Repository directory not found: $REPO_DIR"
    exit 1
fi

cd "$REPO_DIR"
print_success "Changed to repository directory"

# Pull latest code
echo ""
echo "📥 Pulling latest code from $BRANCH..."
git fetch origin
git pull origin "$BRANCH"
print_success "Code updated"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
pnpm install
print_success "Dependencies installed"

# Run database migrations (if any)
echo ""
echo "🗄️  Running database migrations..."
if pnpm --filter=@lwo/database db:push; then
    print_success "Database migrations applied"
else
    print_warning "No migrations to apply or migration failed"
fi

# Build packages
echo ""
echo "🔨 Building packages..."

echo "  Building database package..."
pnpm --filter=@lwo/database build
print_success "Database package built"

echo "  Building admin site..."
pnpm --filter=admin-site build
print_success "Admin site built"

echo "  Building Strapi CMS..."
pnpm --filter=cms build
print_success "Strapi CMS built"

# Restart PM2 processes
echo ""
echo "🔄 Restarting applications..."
pm2 restart all
print_success "Applications restarted"

# Wait for apps to start
echo ""
echo "⏳ Waiting for applications to start..."
sleep 5

# Check PM2 status
echo ""
echo "📊 Application Status:"
pm2 status

# Health checks
echo ""
echo "🏥 Health Checks:"

# Check admin site
if curl -f -s -o /dev/null -w "%{http_code}" http://localhost:3001 | grep -q "200\|301\|302"; then
    print_success "Admin site is responding"
else
    print_warning "Admin site may not be responding correctly"
fi

# Check CMS
if curl -f -s -o /dev/null -w "%{http_code}" http://localhost:1337 | grep -q "200\|301\|302"; then
    print_success "CMS is responding"
else
    print_warning "CMS may not be responding correctly"
fi

echo ""
echo "============================================"
print_success "Deployment complete!"
echo "============================================"
echo ""
echo "View logs with:"
echo "  pm2 logs lwo-admin"
echo "  pm2 logs lwo-cms"
echo ""
echo "Monitor apps with:"
echo "  pm2 monit"
echo ""
