[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![Unlicense License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">ElGrupos</h3>

  <p align="center">
    Transform your browser chaos into organized productivity with the ultimate tab management solution!
    <br />
    <br />
    <a href="https://github.com/JNikolo/ElGrupos/issues/new?labels=bug&template=bug_report.md">Report Bug</a>
    &middot;
    <a href="https://github.com/JNikolo/ElGrupos/issues/new?labels=enhancement&template=feature_request.md">Request Feature</a>
  </p>
</div>

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

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/JNikolo/ElGrupos.svg?style=for-the-badge
[contributors-url]: https://github.com/JNikolo/ElGrupos/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/JNikolo/ElGrupos.svg?style=for-the-badge
[forks-url]: https://github.com/JNikolo/ElGrupos/network/members
[stars-shield]: https://img.shields.io/github/stars/JNikolo/ElGrupos.svg?style=for-the-badge
[stars-url]: https://github.com/JNikolo/ElGrupos/stargazers
[issues-shield]: https://img.shields.io/github/issues/JNikolo/ElGrupos.svg?style=for-the-badge
[issues-url]: https://github.com/JNikolo/ElGrupos/issues
[license-shield]: https://img.shields.io/github/license/JNikolo/ElGrupos.svg?style=for-the-badge
[license-url]: https://github.com/JNikolo/ElGrupos/blob/main/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/jruizzz
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com
