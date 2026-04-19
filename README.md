# 🎌 Hianime

An open-source anime streaming web app built with **React**, **TypeScript**, **Vite**, and **Firebase** — deployed on Vercel.

🔗 **Live Demo**: [hianime-phi.vercel.app](https://hianime-phi.vercel.app)

---

## ✨ Features

- 🎬 Stream anime episodes directly in the browser
- 🔍 Browse and search anime titles
- 🔥 Firebase + Firestore backend for real-time data
- ⚡ Blazing fast with Vite
- 📱 Fully responsive UI
- 🚀 Deployed and hosted on Vercel

---

## 🛠️ Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React + TypeScript                |
| Build Tool | Vite                              |
| Backend    | Firebase (Firestore)              |
| Deployment | Vercel                            |

---

## 📁 Project Structure

```
Hianime/
├── src/                    # Application source code
├── index.html              # App entry point
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── firebase-blueprint.json # Firebase project blueprint
├── firestore.rules         # Firestore security rules
├── vercel.json             # Vercel deployment config
└── package.json            # Dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [Firebase](https://firebase.google.com/) project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/beyondbday69/Hianime.git
   cd Hianime
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**

   Create a `.env` file in the root and add your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be running at `http://localhost:5173`.

---

## 📦 Build for Production

```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

---

## 🔐 Firestore Security Rules

Security rules are defined in `firestore.rules`. To deploy them to your Firebase project:

```bash
firebase deploy --only firestore:rules
```

---

## ☁️ Deploying to Vercel

This project is pre-configured for Vercel via `vercel.json`.

**One-click deploy:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/beyondbday69/Hianime)

Or manually:
```bash
npm install -g vercel
vercel
```

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## ⚠️ Disclaimer

This project is open source and intended for educational purposes only. All anime content is sourced from third-party providers and belongs to their respective owners. This project is not affiliated with or endorsed by HiAnime or any content provider.

---

## 📄 License

This project is open source. See the [LICENSE](./LICENSE) file for details.

---

<p align="center">Made with ❤️ by <a href="https://github.com/beyondbday69">beyondbday69</a></p>
