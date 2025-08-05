# ElGrupos

**Transform your browser chaos into organized productivity with the ultimate tab management solution.**

A powerful Chrome extension that helps you organize, manage, and share your tab groups with ease. Never lose track of your browsing sessions again!

## ✨ Features

### 📁 Smart Tab Organization

- **Create & Edit Groups**: Organize your tabs into custom-named groups with color coding
- **Real-time Sync**: Automatically syncs with Chrome's native tab groups
- **Quick Actions**: Add current tab to existing groups, duplicate entire groups, or ungroup tabs instantly

### 🎨 Visual Management

- **Color-coded Groups**: Assign colors to groups for easy visual identification
- **Expandable View**: Click to expand/collapse groups and see all tabs within
- **Clean Interface**: Modern, Material Design-inspired UI that's easy on the eyes

### 📤 Share & Export

- **Multiple Export Formats**: Share groups as Markdown links or structured JSON
- **Copy to Clipboard**: One-click copying for instant sharing
- **Download Files**: Save your tab collections as files for backup or sharing

### 📥 Import & Restore

- **Import from Multiple Sources**: Restore tab groups from JSON or Markdown format
- **Bulk Import**: Import multiple groups at once
- **Smart Parsing**: Automatically detects and handles different import formats

### ⚡ Productivity Features

- **Keyboard Shortcuts**: Use Ctrl+Enter to save, Esc to cancel in dialogs
- **Duplicate Groups**: Instantly duplicate entire tab groups for different projects
- **Add Current Tab**: Quickly add your active tab to any existing group
- **Live Updates**: Extension automatically refreshes when you make changes in browser

## 🎯 Perfect For

- ✅ **Researchers** organizing multiple sources and references
- ✅ **Developers** managing different project tabs and documentation
- ✅ **Students** keeping track of study materials across subjects
- ✅ **Professionals** organizing work-related browsing sessions
- ✅ **Anyone** who wants to tame their tab chaos

## 🛠 Tech Stack

- **React 19** with TypeScript for the UI
- **Vite** for fast development and building
- **TailwindCSS** for styling with Material Design principles
- **Lucide React** for consistent iconography
- **Chrome Extensions API** for tab management

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Google Chrome browser

### Installation & Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/JNikolo/extension-tabs.git
   cd extension-tabs
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Build for production**

   ```bash
   npm run build
   ```

5. **Load extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the `dist` folder
   - The extension icon should appear in your toolbar

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run lint` - Run ESLint for code quality
- `npm run preview` - Preview the production build

## 🔧 Project Structure

```
src/
├── components/          # React components
│   ├── groups/         # Tab group related components
│   ├── import/         # Import functionality components
│   ├── layout/         # Layout components
│   ├── modals/         # Modal wrapper components
│   ├── share/          # Sharing functionality
│   ├── tabs/           # Individual tab components
│   └── ui/             # Reusable UI components
├── hooks/              # Custom React hooks
├── services/           # Business logic and API services
└── utils/              # Utility functions
```

## 🤝 Contributing

🙋 We’d love your help! Whether it’s coding, testing, design, or ideas — check out our [Contributing Guide](CONTRIBUTING.md) and open your first PR!

## 🔒 Privacy & Security

- **Local Processing**: All operations happen locally in your browser
- **No Data Collection**: We don't track, store, or send your browsing data anywhere
- **Minimal Permissions**: Only requests necessary permissions for tab management

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to the Chrome Extensions team for the robust APIs
- Inspired by the need for better tab organization and quick share with my buddies
- Built with modern web technologies and best practices

## 📞 Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/JNikolo/extension-tabs/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/JNikolo/extension-tabs/discussions)
- 📧 **Email**: [Contact us](mailto:jaircoto007@gmail.com)

---

**Download now and take control of your browsing experience!**

_Compatible with Chrome's native tab groups. Works seamlessly with your existing browser workflow._
