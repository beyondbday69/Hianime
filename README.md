# Hianime - Premium Anime Experience

A high-performance, visually stunning anime streaming and discovery platform built with React 19, Vite, and Framer Motion. Hianime provides a seamless experience for discovering, tracking, and watching your favorite anime with multi-provider support.

## ✨ Features

- **Multi-Provider Engine**: Switch between multiple content sources including AniwatchTV, Aniwatch.co, and MAL.
- **Dynamic Discovery**: Real-time spotlight carousels, trending lists, and category-based browsing.
- **Personalized Library**: 
  - **Favorites**: Save your must-watch anime to your personal collection.
  - **Watch History**: Resume exactly where you left off with per-episode progress tracking.
- **Cinematic UI/UX**:
  - **Fluid Animations**: Powered by `motion` for smooth transitions and interactive feedback.
  - **Smooth Scroll**: Integrated with `Lenis` for a premium browsing feel.
  - **Responsive Design**: Fully optimized for mobile, tablet, and desktop viewing.
- **Advanced Search**: Intelligent search with support for different content providers and dubbed anime.
- **Hybrid Streaming**: Specialized watch pages that handle different streaming sources and iframe resolvers.

## 🚀 Tech Stack

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Motion](https://motion.dev/)
- **Routing**: [Wouter](https://github.com/molecula/wouter)
- **Database & Auth**: [Firebase](https://firebase.google.com/) (Firestore & Google Auth)
- **Proxy Server**: [Express](https://expressjs.com/) (for CORS bypass and API proxying)
- **Smooth Scroll**: [Lenis](https://lenis.darkroom.engineering/)

## 🛠️ Local Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Hianime
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your Firebase and API configurations:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Start the Development Server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## 📦 Deployment

The project is configured for seamless deployment on **Vercel** and **Firebase Hosting**.

- **Vercel**: Handled via `vercel.json` with automatic API proxying.
- **Firebase**: Handled via `firebase.json` with SPA rewrite rules.

### Build for Production
```bash
npm run build
```

## 🛡️ License
This project is licensed under the Apache-2.0 License.
