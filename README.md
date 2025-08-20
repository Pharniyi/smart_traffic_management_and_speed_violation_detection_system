# Smart Traffic Management and Speed Violation Detection System

A Next.js-based traffic monitoring application with real-time data visualization and violation tracking.

## 🚀 Deployment

This project is configured for dual deployment:

### GitHub Pages (Static Site)
- **URL**: `https://pharniyii.github.io/smart_traffic_management_and_speed_violation_detection_system/`
- **Branch**: `gh-pages` (auto-generated)
- **Deployment**: Automatic via GitHub Actions on push to `main`

### Vercel (Full-Stack)
- **URL**: Custom Vercel domain
- **Branch**: `main`
- **Deployment**: Automatic via Vercel integration

## 🛠️ Setup Instructions

### 1. Enable GitHub Pages
1. Go to your repository settings
2. Navigate to "Pages" section
3. Set source to "Deploy from a branch"
4. Select `gh-pages` branch
5. Click Save

### 2. Connect to Vercel
1. Visit [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Vercel will automatically detect Next.js and configure deployment
4. Set environment variables if needed

### 3. Local Development
\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Build for GitHub Pages
npm run build:github
\`\`\`

## 📁 Project Structure

\`\`\`
├── app/                    # Next.js app directory
├── components/            # React components
├── lib/                   # Utilities and API services
├── .github/workflows/     # GitHub Actions
├── next.config.mjs        # Next.js configuration
└── vercel.json           # Vercel configuration
\`\`\`

## 🔧 Configuration Files

- `next.config.mjs`: Handles static export and GitHub Pages paths
- `.github/workflows/deploy.yml`: Automates GitHub Pages deployment
- `vercel.json`: Configures Vercel deployment settings

## 🌐 Environment Variables

For Vercel deployment, set these in your Vercel dashboard:
- `NEXT_PUBLIC_API_BASE_URL`: Your API base URL
- `MONGODB_URI`: MongoDB connection string (if using)

## 📱 Features

- Real-time traffic density monitoring
- Speed violation tracking
- Mobile-responsive design
- Dark/light theme support
- Interactive charts and graphs

## 🔄 Deployment Workflow

1. Push changes to `main` branch
2. GitHub Actions automatically builds and deploys to GitHub Pages
3. Vercel automatically deploys the full-stack version
4. Both deployments are independent and fully functional
