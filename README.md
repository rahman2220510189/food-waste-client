# 🍱 FoodShare — Client

![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Tailwind](https://img.shields.io/badge/TailwindCSS-3-38BDF8?style=flat-square&logo=tailwindcss)
![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=flat-square&logo=firebase)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square&logo=vercel)

> **Share food. Reduce waste. Support local cooks.**

FoodShare is a community-driven local food marketplace where people can share surplus food for free, sell home-cooked meals, and discover affordable food nearby — all based on real-time location.

---

## 🌐 Live Demo

🔗 **Live Site:** [https://food-waste-client-one.vercel.app](https://food-waste-client-one.vercel.app)

🎥 **Demo Video:** [Watch on Google Drive](https://drive.google.com/file/d/1a1vPxLpbj7Uwqtwl0L_E9UHFZIC59ibG/view?usp=drive_link)

### 🔑 Test Credentials

| Role  | Email | Password |
|-------|-------|----------|
| User  | riyad@gmail.com | riyad#1gmail.coM |
| Admin | fahmida@gmail.com | fahmida@1gmail.coM |

---

## 🎯 Problem Solved

Every day, tons of food goes to waste while many people struggle to find affordable meals nearby. At the same time, talented home cooks have no platform to sell their food locally.

**FoodShare bridges this gap** by connecting food providers (free or paid) with people nearby — in real time.

---

## ✨ Features

### 👤 For Users
- 📍 **Location-based feed** — see food posts sorted by distance
- 🆓 **Book free food** — request surplus food from nearby users
- 💰 **Order paid food** — buy home-cooked meals from local cooks
- 💳 **Stripe payment** — secure online payment integration
- 💬 **Real-time chat** — chat opens automatically after request is accepted
- 🔔 **Live notifications** — instant badge updates via Socket.io
- 📜 **History** — track all past orders and bookings

### 🏪 For Sellers / Home Cooks
- 📤 **Post food** — upload food with image, price, quantity & location
- 📊 **Seller Dashboard** — track earnings, orders received, active posts
- ✅ **Accept / Cancel** requests from buyers

### 🛡️ For Admins
- 👥 **User management** — view, promote to admin, or delete users
- 🍱 **Food management** — monitor and delete all food listings
- 💹 **Order & Payment tracking** — see who ordered from whom with full details
- 📈 **Revenue overview** — total earnings and online payment stats

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS |
| Auth | Firebase Authentication |
| Routing | React Router DOM v6 |
| Real-time | Socket.io Client |
| Payment | Stripe.js |
| Icons | React Icons (Feather) |
| HTTP | Fetch API |

---

## 📁 Folder Structure

```
food-waste-client/
├── public/
│   └── food-icon.png
├── src/
│   ├── components/
│   │   ├── NavBar/
│   │   │   └── NavBar.jsx          # Navbar with real-time badges
│   │   └── ChatWindow.jsx          # Live chat component
│   ├── firebase/
│   │   └── Provider/
│   │       └── AuthProviders.jsx   # Firebase auth context
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Browse.jsx
│   │   ├── Post.jsx
│   │   ├── Messages.jsx            # Chat list + socket
│   │   ├── Notifications.jsx       # Request management
│   │   ├── History.jsx
│   │   ├── Dashboard.jsx           # User dashboard
│   │   ├── SellerDashboard.jsx     # Seller earnings & stats
│   │   └── AdminPanel.jsx          # Admin management panel
│   ├── Routes/
│   │   └── Router.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## ⚙️ Installation

### Prerequisites
- Node.js v18+
- npm or yarn
- Firebase project
- Backend server running (see [server repo](https://github.com/rahman2220510189/food-waste-server))

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/rahman2220510189/food-waste-client.git

# 2. Navigate to project directory
cd food-waste-client

# 3. Install dependencies
npm install

# 4. Create environment file
cp .env.example .env.local

# 5. Add your environment variables (see below)

# 6. Start development server
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

---

## 🚀 Usage Guide

### Running the app
```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Key Pages

| Route | Description |
|-------|-------------|
| `/` | Home — recent food posts |
| `/browse` | Browse all food with location filter |
| `/post` | Upload a new food listing |
| `/notifications` | Manage incoming requests |
| `/messages` | Real-time chat |
| `/dashboard` | User dashboard |
| `/seller-dashboard` | Seller earnings & stats |
| `/admin` | Admin panel (admin only) |
| `/history` | Order & booking history |

---

## 🤝 Contributing

Contributions are welcome!

```bash
# Fork the repo, then:
git checkout -b feature/your-feature-name
git commit -m "Add: your feature description"
git push origin feature/your-feature-name
# Open a Pull Request
```

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**MD. Naymur Rahman**
- 🐙 GitHub: [@rahman2220510189](https://github.com/rahman2220510189)
- 🌐 Live: [food-waste-client-one.vercel.app](https://food-waste-client-one.vercel.app)

---

<p align="center">Made with ❤️ to reduce food waste and empower local cooks</p>