# Health Stack Optimizer

A React-based health supplement timing optimizer with 24-hour biological pathway visualization.

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Deploy to GitHub Pages

1. **Create a GitHub repository** named `health-stack-optimizer` (or update `vite.config.js` if using a different name)

2. **Push this code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/health-stack-optimizer.git
   git push -u origin main
   ```

3. **Enable GitHub Pages:**
   - Go to your repo → Settings → Pages
   - Under "Build and deployment", select **GitHub Actions** as the source
   - The workflow will run automatically on push

4. **Access your site:**
   - After the workflow completes, visit: `https://YOUR_USERNAME.github.io/health-stack-optimizer/`

## ⚙️ Configuration

### Change Repository Name
If your repo name differs from `health-stack-optimizer`, update `vite.config.js`:

```js
export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/',  // ← Change this
})
```

### Custom Domain
To use a custom domain:
1. Add a `CNAME` file to the `public/` folder with your domain
2. Update `vite.config.js` to `base: '/'`

## 📁 Project Structure

```
├── index.html           # HTML entry point
├── package.json         # Dependencies & scripts
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS config
├── postcss.config.js    # PostCSS config
├── src/
│   ├── main.jsx         # React entry point (mounts App)
│   ├── App.jsx          # Health Stack Optimizer component
│   └── index.css        # Tailwind imports
└── .github/
    └── workflows/
        └── deploy.yml   # GitHub Actions workflow
```

## 🛠 Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Recharts** - Charts & visualization
- **GitHub Actions** - CI/CD

## 📝 License

MIT
