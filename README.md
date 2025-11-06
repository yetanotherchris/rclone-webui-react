# Rclone Web UI - Modern React Edition

[![Google Summer of Code](https://img.shields.io/badge/Google%20Summer%20of%20Code-2019%202020-blue.svg)](https://summerofcode.withgoogle.com/projects/#5104629795258368)
[![CCExtractor](https://img.shields.io/badge/CCExtractor-org-red.svg)](https://www.ccextractor.org/)
[![RClone](https://img.shields.io/badge/RClone-org-blue.svg)](https://rclone.org/)

A modern, redesigned web interface for Rclone featuring React 18, Vite, Tailwind CSS, and Google Photos-style photo browsing.

## ✨ What's New in This Fork

This is a modernized version with significant improvements:

- **⚡ Vite Build System**: Lightning-fast development and optimized production builds
- **🎨 Tailwind CSS**: Modern, utility-first styling with responsive design
- **📸 Photo View Mode**: Google Photos-style infinite scroll gallery for images and videos
- **🔄 React 18**: Latest React features with improved performance
- **📱 Responsive Design**: Beautiful UI optimized for desktop and mobile
- **🎯 Modern Fonts**: Google Fonts (Inter & Roboto) for clean typography
- **📦 Docker Ready**: Easy deployment with Docker and docker-compose
- **🧪 Testing Setup**: Includes LocalStack for S3 testing

## 📋 Table of Contents

- [🎯 Three View Modes](#-three-view-modes)
- [🚀 Quick Start](#-quick-start)
- [📦 Development](#-development)
- [📸 Using Photo View Mode](#-using-photo-view-mode)
- [🐳 Docker Deployment](#-docker-deployment)
- [🧪 Testing Locally](#-testing-locally) ⭐ NEW
- [🎨 Customization](#-customization)
- [🔧 Rclone Configuration](#-rclone-configuration)
- [🐛 Troubleshooting](#-troubleshooting)

---

## 🎯 Three View Modes

1. **List View** - Traditional sortable table view
2. **Card View** - Grid-based card layout for files and folders
3. **Photo View** ⭐ NEW - Google Photos-style gallery with:
   - Automatic photo/video discovery across all folders
   - Infinite scroll for smooth browsing
   - Responsive grid layout
   - Full-screen lightbox preview
   - Support for JPG, PNG, GIF, WebP, MP4, MOV, and more

## 🚀 Quick Start

### Option 1: Using Docker Compose (Recommended for Testing)

The easiest way to get started with everything pre-configured:

```bash
# Clone the repository
git clone https://github.com/rclone/rclone-webui-react
cd rclone-webui-react

# Start all services (includes Rclone + LocalStack S3 + WebUI)
docker-compose up -d

# View logs
docker-compose logs -f

# Access the WebUI
open http://localhost:3000
```

**Default credentials**:
- Username: `admin`
- Password: `password`

**Available services**:
- WebUI: http://localhost:3000
- Rclone API: http://localhost:5572
- LocalStack S3: http://localhost:4566

> 💡 **Want to test the app?** See the comprehensive [🧪 Testing Locally](#-testing-locally) section below for unit tests, integration testing, and more!

### Option 2: Running with Rclone Standalone

If you have Rclone installed locally:

```bash
# Start Rclone with web GUI
rclone rcd --rc-web-gui --rc-addr :5572 --rc-user admin --rc-pass password

# In another terminal, start the dev server
npm install
npm run dev

# Access at http://localhost:3000
```

### Option 3: Using Official Rclone (Built-in Web GUI)

Rclone includes this WebUI by default:

```bash
rclone rcd --rc-web-gui --rc-user=<user> --rc-pass=<pass>
```

Access at http://localhost:5572

## 📦 Development

### Prerequisites

- Node.js 18+
- npm or yarn
- Rclone (for backend)

### Install Dependencies

```bash
npm install
```

### Available Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm start` - Alias for dev

### Project Structure

```
src/
├── views/
│   ├── Explorer/
│   │   └── FilesView/
│   │       ├── FilesView.js      # Main file browser
│   │       ├── PhotoView.jsx     # ⭐ NEW: Google Photos-style view
│   │       └── FileComponent.js  # Individual file/folder components
│   └── Base/
│       └── FileOperations/       # View mode toggle & operations
├── utils/
│   └── API/                      # Rclone API integration
├── actions/                      # Redux actions
├── reducers/                     # Redux reducers
└── index.jsx                     # React 18 entry point
```

## 📸 Using Photo View Mode

The Photo View automatically discovers and displays all photos and videos in your remote:

1. **Select a remote** from the dropdown menu
2. **Click the view toggle button** to cycle through: List → Card → Photo
3. **Wait for scanning** - The app will recursively scan folders for media
4. **Browse your photos** with smooth infinite scroll
5. **Click any item** to view fullscreen with video playback support

**Supported formats**:
- Images: JPG, JPEG, PNG, GIF, WebP, BMP, SVG, HEIC, HEIF
- Videos: MP4, MOV, AVI, MKV, WebM, M4V, 3GP, FLV, WMV

## 🐳 Docker Deployment

### Build the Docker Image

```bash
docker build -t rclone-webui-react .
```

### Run the Container

```bash
docker run -p 3000:80 rclone-webui-react
```

### Docker Compose with Full Stack

The included `docker-compose.yml` provides:

- **rclone**: Rclone daemon with RC API
- **localstack**: Mock S3 service for testing
- **webui**: This web interface
- **init-s3**: Initializes test S3 buckets

```bash
# Start everything
docker-compose up -d

# Add test photos via AWS CLI
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
aws --endpoint-url=http://localhost:4566 s3 cp photo.jpg s3://test-bucket/photos/

# Stop everything
docker-compose down
```

## 🧪 Testing Locally

This project includes comprehensive testing capabilities including unit tests, integration tests, and end-to-end testing with Docker.

### Quick Testing Overview

| Test Type | Command | What It Tests |
|-----------|---------|---------------|
| **Unit Tests** | `npm test` | React components, reducers, utilities |
| **Build Test** | `npm run build` | Production build validation |
| **Docker Integration** | `docker-compose up -d` | Full stack with LocalStack S3 |
| **Manual Testing** | `npm run dev` | Local development with live reload |

---

### 1. Unit Tests (Jest + Enzyme)

The project includes extensive unit tests for components, reducers, and utilities.

#### Running Unit Tests

```bash
# Install dependencies first
npm install

# Run all tests (once test script is configured)
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- FilesView.test.js
```

**Note**: The project uses Jest and Enzyme. Test files are located alongside source files with `.test.js` extension.

**Test Coverage Areas**:
- ✅ React Components (views, containers, widgets)
- ✅ Redux Reducers (state management)
- ✅ Utilities (API, tools, classes)
- ✅ File operations and explorers

---

### 2. Docker-Based Integration Testing

The recommended way to test the full application locally with all services.

#### Option A: Quick Start (Development Mode)

```bash
# Start all services (Rclone + LocalStack S3 + WebUI)
docker-compose up -d

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f rclone
docker-compose logs -f webui

# Stop all services
docker-compose down

# Stop and remove all data
docker-compose down -v
```

**Available Services**:
- WebUI: http://localhost:3000
- Rclone API: http://localhost:5572
- LocalStack S3: http://localhost:4566

**Default Credentials**:
- Username: `admin`
- Password: `password`

#### Option B: Test Configuration (CI-like)

Use the dedicated test compose file for a clean testing environment:

```bash
# Start test environment
docker-compose -f docker-compose.test.yml up -d

# Check all services are healthy
docker-compose -f docker-compose.test.yml ps

# Run tests against the stack
docker-compose -f docker-compose.test.yml logs

# Cleanup
docker-compose -f docker-compose.test.yml down -v
```

---

### 3. Testing with LocalStack S3

LocalStack provides a mock S3 service for testing without AWS costs.

#### Initial Setup

The `docker-compose.yml` automatically:
1. ✅ Starts LocalStack S3 service
2. ✅ Creates `test-bucket` bucket
3. ✅ Creates `photos/` and `documents/` folders
4. ✅ Configures Rclone with `s3-local` remote

#### Adding Test Data

**Upload Sample Photos**:
```bash
# Configure AWS CLI for LocalStack
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test

# Upload a single photo
aws --endpoint-url=http://localhost:4566 s3 cp /path/to/photo.jpg s3://test-bucket/photos/

# Upload entire folder
aws --endpoint-url=http://localhost:4566 s3 sync /path/to/photos/ s3://test-bucket/photos/

# Upload with folder structure
aws --endpoint-url=http://localhost:4566 s3 cp /path/to/vacation.jpg s3://test-bucket/photos/vacation2024/beach.jpg
```

**Create Folder Structure**:
```bash
# Create folders
aws --endpoint-url=http://localhost:4566 s3api put-object --bucket test-bucket --key vacation2024/
aws --endpoint-url=http://localhost:4566 s3api put-object --bucket test-bucket --key documents/invoices/

# List bucket contents
aws --endpoint-url=http://localhost:4566 s3 ls s3://test-bucket --recursive
```

**Quick Test Data Setup**:
```bash
# Create sample test files locally
mkdir -p test-data/photos
echo "Sample image" > test-data/photos/test1.jpg
echo "Another image" > test-data/photos/test2.jpg

# Upload to S3
aws --endpoint-url=http://localhost:4566 s3 sync test-data/photos/ s3://test-bucket/photos/
```

#### Verify in WebUI

1. Open http://localhost:3000
2. Login with `admin` / `password`
3. Select "s3-local" from the remote dropdown
4. Click the view toggle to switch to "Photo View"
5. You should see your uploaded images!

---

### 4. Manual Testing (Development Mode)

For rapid development and testing without Docker:

#### Prerequisites
- Rclone installed locally
- Node.js 18+

#### Steps

```bash
# 1. Start Rclone daemon in one terminal
rclone rcd \
  --rc-addr :5572 \
  --rc-user admin \
  --rc-pass password \
  --rc-allow-origin "*" \
  --log-level INFO

# 2. Start dev server in another terminal
npm install
npm run dev

# 3. Access at http://localhost:3000
```

**Development Benefits**:
- ⚡ Hot module replacement (instant updates)
- 🔍 React DevTools integration
- 📝 Console logging and debugging
- 🎯 Test individual features quickly

---

### 5. API Testing

Test the Rclone API directly to debug backend issues.

#### Test Rclone Connection

```bash
# Check Rclone version
curl -X POST -u admin:password http://localhost:5572/core/version

# List remotes
curl -X POST -u admin:password http://localhost:5572/config/listremotes

# List files in a remote
curl -X POST -u admin:password \
  -H "Content-Type: application/json" \
  -d '{"fs":"s3-local:test-bucket","remote":"photos/"}' \
  http://localhost:5572/operations/list
```

#### Test LocalStack S3

```bash
# Check LocalStack health
curl http://localhost:4566/_localstack/health

# List S3 buckets
aws --endpoint-url=http://localhost:4566 s3 ls

# Check bucket contents
aws --endpoint-url=http://localhost:4566 s3 ls s3://test-bucket --recursive
```

---

### 6. Build Testing

Ensure production builds work correctly:

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Access at http://localhost:4173
```

**Verify Build Output**:
```bash
# Check build directory
ls -la build/

# Expected output:
# - build/index.html
# - build/assets/ (JS, CSS bundles)
# - build/static/ (images, fonts)
```

---

### 7. Testing Different Scenarios

#### Scenario A: Test Photo View Mode

```bash
# 1. Start services
docker-compose up -d

# 2. Add test images
for i in {1..10}; do
  echo "Test image $i" > /tmp/test$i.jpg
  aws --endpoint-url=http://localhost:4566 s3 cp /tmp/test$i.jpg s3://test-bucket/photos/test$i.jpg
done

# 3. Open WebUI, select s3-local remote, switch to Photo View
# 4. Verify infinite scroll and lightbox work
```

#### Scenario B: Test File Operations

```bash
# 1. Upload test files
echo "Document content" > /tmp/document.txt
aws --endpoint-url=http://localhost:4566 s3 cp /tmp/document.txt s3://test-bucket/documents/

# 2. Test in WebUI:
#    - List view shows the file
#    - Download works
#    - Delete works
#    - Create folder works
```

#### Scenario C: Test Multiple Remotes

Edit `rclone.conf` to add another remote:
```ini
[s3-local]
type = s3
provider = Other
access_key_id = test
secret_access_key = test
endpoint = http://localstack:4566
force_path_style = true

[local-files]
type = local
```

Then test switching between remotes in the WebUI.

---

### 8. Continuous Integration Testing

The project includes GitHub Actions workflows:

- **Node CI** (`.github/workflows/nodejs.yml`): Tests builds on multiple Node versions
- **Docker Test** (`.github/workflows/docker-test.yml`): Full integration testing

**Run CI tests locally using Act**:
```bash
# Install act (GitHub Actions runner)
# https://github.com/nektos/act

# Run Node CI workflow
act -j build

# Run Docker test workflow
act -j docker-test
```

---

### 9. Troubleshooting Tests

#### Tests won't run
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node version (should be 18+)
node --version
```

#### Docker services won't start
```bash
# Reset everything
docker-compose down -v
docker system prune -f

# Rebuild from scratch
docker-compose build --no-cache
docker-compose up -d

# Check logs
docker-compose logs
```

#### LocalStack S3 not accessible
```bash
# Verify LocalStack is running
docker-compose ps
docker-compose logs localstack

# Test LocalStack directly
curl http://localhost:4566/_localstack/health

# Common fix: ensure force_path_style = true in rclone.conf
```

#### Rclone API errors
```bash
# Check Rclone is responding
curl -X POST -u admin:password http://localhost:5572/core/version

# View Rclone logs
docker-compose logs rclone

# Common issue: ensure --rc-allow-origin "*" is set
```

#### WebUI not loading
```bash
# Check if build exists
ls -la build/

# Rebuild WebUI
npm run build
docker-compose build webui
docker-compose up -d webui

# Check nginx logs
docker-compose logs webui
```

#### Photos not appearing in Photo View
1. Verify files are uploaded to S3
2. Check browser console for errors
3. Ensure remote supports directory listing
4. For LocalStack, verify `force_path_style = true` in rclone.conf
5. Check file extensions are supported (JPG, PNG, MP4, etc.)

---

### 10. Performance Testing

**Test with large datasets**:
```bash
# Generate 1000 test files
for i in {1..1000}; do
  echo "File $i" > /tmp/file$i.txt
done

# Upload to S3
for i in {1..1000}; do
  aws --endpoint-url=http://localhost:4566 s3 cp /tmp/file$i.txt s3://test-bucket/files/file$i.txt
done

# Test WebUI:
# - List view pagination
# - Search/filter performance
# - Scroll performance
```

**Monitor performance**:
```bash
# Check Docker resource usage
docker stats

# Check Rclone performance
docker-compose logs rclone | grep -i "error\|warn"
```

## 🎨 Customization

### Tailwind Configuration

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Customize your brand colors
      }
    }
  }
}
```

### Photo Grid Layout

Modify `src/index.css`:

```css
.photo-grid {
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 4px;
}
```

## 🔧 Rclone Configuration

Edit `rclone.conf` to add your remotes:

```ini
[myremote]
type = s3
provider = AWS
access_key_id = YOUR_KEY
secret_access_key = YOUR_SECRET
region = us-east-1

[gdrive]
type = drive
client_id = YOUR_CLIENT_ID
client_secret = YOUR_SECRET
```

Run Rclone with the config:

```bash
rclone --config ./rclone.conf rcd --rc-web-gui --rc-addr :5572
```

## 📝 Migration from Original Version

This version includes significant changes:

| Feature | Old | New |
|---------|-----|-----|
| Build Tool | Create React App | Vite |
| React | 16.12.0 | 18.2.0 |
| Styling | CoreUI + Bootstrap + SCSS | Tailwind CSS |
| State | Redux + Thunk | Redux Toolkit |
| Router | React Router 5 | React Router 6 |
| Entry | src/index.js | src/index.jsx |
| HTML | public/index.html | index.html (root) |

### Breaking Changes

- Removed IE 11 support and polyfills
- Removed node-sass dependency
- Updated to React 18 patterns (createRoot)
- Removed deprecated Bootstrap/CoreUI components

## 🐛 Troubleshooting

Having issues? Check the **[Troubleshooting Tests](#9-troubleshooting-tests)** section in the Testing guide above for detailed solutions.

**Quick Fixes**:

```bash
# Reset Docker environment
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d

# Clear Node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Test Rclone connection
curl -X POST -u admin:password http://localhost:5572/core/version

# Check all logs
docker-compose logs
```

**Common Issues**:
- **Can't connect to Rclone**: Ensure `--rc-allow-origin "*"` is set and Rclone is running
- **Photos not loading**: Verify `force_path_style = true` in rclone.conf for S3/LocalStack
- **WebUI not accessible**: Check if build directory exists: `ls -la build/`
- **LocalStack errors**: Verify health: `curl http://localhost:4566/_localstack/health`

See the [Testing section](#-testing-locally) for comprehensive troubleshooting guides.

## 📚 Original Project Info

This project was developed as part of Google Summer of Code 2019 and 2020 under [ccextractor.org](https://ccextractor.org) and [rclone.org](https://rclone.org) by [negative0](https://github.com/negative0).

**Official hosted version**: https://rclone.github.io/rclone-webui-react

**Original repository**: https://github.com/rclone/rclone-webui-react

## 📜 License

MIT

## 🙏 Acknowledgments

- Original WebUI by [negative0](https://github.com/negative0)
- Rclone team for the excellent cloud sync tool
- React, Vite, and Tailwind CSS communities
- Google Summer of Code program

## 🔗 Useful Links

- [Rclone Documentation](https://rclone.org/docs/)
- [Rclone RC API](https://rclone.org/rc/)
- [LocalStack Documentation](https://docs.localstack.cloud/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite Documentation](https://vitejs.dev/)
