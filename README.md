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

## 🧪 Testing with LocalStack S3

The project includes a complete testing setup:

1. Start the stack: `docker-compose up -d`
2. LocalStack creates a mock S3 endpoint
3. Upload test photos using AWS CLI (see above)
4. Select the "s3-local" remote in the WebUI
5. Switch to Photo View to see your test images

### Adding Test Data

```bash
# Upload a single photo
aws --endpoint-url=http://localhost:4566 s3 cp /path/to/photo.jpg s3://test-bucket/photos/

# Upload multiple photos
aws --endpoint-url=http://localhost:4566 s3 sync /path/to/photos/ s3://test-bucket/photos/

# Create folders
aws --endpoint-url=http://localhost:4566 s3api put-object --bucket test-bucket --key vacation2024/
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

### Can't Connect to Rclone

```bash
# Test Rclone is running
curl http://localhost:5572/core/version

# Ensure CORS is enabled
rclone rcd --rc-allow-origin "*"
```

### Photos Not Loading

1. Check browser console for errors
2. Verify remote supports file listing
3. For S3/LocalStack, ensure `force_path_style = true` in rclone.conf
4. Check Rclone logs: `docker-compose logs rclone`

### Docker Issues

```bash
# Reset everything
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d

# Check logs
docker-compose logs -f
```

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
