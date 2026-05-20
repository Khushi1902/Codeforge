# 🔥 CodeForge — AI-Powered Code Assistant (MERN Stack)

A premium full-stack AI coding assistant built with MongoDB, Express.js, React.js, and Node.js. Features JWT authentication, Monaco Editor, OpenAI integration, and a dark glassmorphism UI.

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure login with bcrypt-hashed passwords
- 💻 **Monaco Editor** — VS Code-quality editor with syntax highlighting
- 🤖 **AI Processing** — Fix, Explain, and Optimize code via OpenAI GPT-4o-mini
- 📜 **History** — Persistent session history saved to MongoDB
- 🎨 **Premium Dark UI** — Glassmorphism, smooth animations, fully responsive
- 🌐 **10 Languages** — JavaScript, TypeScript, Python, C++, Java, Go, Rust, PHP, Ruby, SQL

---

## 📁 Project Structure

```
codeforge/
├── server/                  # Express + Node.js backend
│   ├── config/
│   │   └── db.js            # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   └── aiController.js
│   ├── middleware/
│   │   └── auth.js          # JWT middleware
│   ├── models/
│   │   ├── User.js
│   │   └── History.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── ai.js
│   ├── index.js             # Server entry point
│   ├── seed.js              # DB seed script (creates Khushi user)
│   ├── .env.example
│   └── package.json
│
├── client/                  # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   └── ProtectedRoute.js
│   │   │   ├── editor/
│   │   │   │   ├── EditorPanel.js
│   │   │   │   ├── OutputPanel.js
│   │   │   │   └── HistoryPanel.js
│   │   │   └── layout/
│   │   │       └── Sidebar.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── LoginPage.js
│   │   │   └── DashboardPage.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
│
├── package.json             # Root scripts
└── README.md
```

---

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** v18+ — [nodejs.org](https://nodejs.org)
- **MongoDB** — Local install or [MongoDB Atlas](https://cloud.mongodb.com) (free tier)
- **OpenAI API Key** — [platform.openai.com](https://platform.openai.com/api-keys)

---

### Step 1 — Clone / Open the project

```bash
cd codeforge
```

---

### Step 2 — Configure environment variables

```bash
cd server
cp .env.example .env
```

Open `server/.env` and fill in:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/codeforge
JWT_SECRET=change_this_to_a_long_random_string_abc123xyz
OPENAI_API_KEY=sk-proj-your-openai-key-here
```

> **MongoDB Atlas (cloud):** Replace `MONGODB_URI` with your Atlas connection string, e.g.:
> `mongodb+srv://username:password@cluster.mongodb.net/codeforge`

---

### Step 3 — Install dependencies

```bash
# From project root:
cd server && npm install
cd ../client && npm install
```

Or from root (if concurrently installed):
```bash
npm install        # installs concurrently
npm run install:all
```

---

### Step 4 — Seed the database (creates Khushi user)

```bash
cd server
node seed.js
```

You should see:
```
✅ MongoDB Connected: localhost
✅ User created successfully:
   Username: khushi
   Password: 1234@pp
   ID: 64abc...
🔌 Database connection closed.
```

---

### Step 5 — Run the application

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# → Server running on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm start
# → App running on http://localhost:3000
```

Or from root with one command:
```bash
npm run dev
```

---

### Step 6 — Open the app

Visit **http://localhost:3000**

Login with:
- **Username:** `khushi`
- **Password:** `1234@pp`

---

## 🔑 API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/login` | ❌ | Login, returns JWT |
| GET | `/api/auth/me` | ✅ | Get current user |
| POST | `/api/ai/process` | ✅ | Fix / Explain / Optimize code |
| GET | `/api/ai/history` | ✅ | Get user's code history |
| DELETE | `/api/ai/history/:id` | ✅ | Delete history item |
| GET | `/api/health` | ❌ | Server health check |

### POST /api/ai/process — Request body:
```json
{
  "code": "your code here",
  "language": "javascript",
  "action": "fix"
}
```

### Response:
```json
{
  "fixedCode": "...",
  "explanation": "...",
  "techStack": "..."
}
```

---

## 🛠️ Troubleshooting

### "Invalid OpenAI API key"
- Ensure your `OPENAI_API_KEY` in `server/.env` starts with `sk-`
- Make sure the key has available credits at [platform.openai.com](https://platform.openai.com)

### "MongoDB connection error"
- Make sure MongoDB is running: `mongod` (local) or check Atlas network access
- Check your `MONGODB_URI` in `.env`

### Login fails with correct credentials
- Re-run `node seed.js` to recreate the user
- Make sure your server is running on port 5000

### CORS errors
- Make sure the React app is on port 3000 (default)
- The `"proxy": "http://localhost:5000"` in `client/package.json` handles proxying

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router 6 |
| Editor | Monaco Editor (@monaco-editor/react) |
| Styling | Inline styles + CSS animations |
| State | React Context API |
| HTTP | Axios |
| Notifications | React Hot Toast |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| AI | OpenAI GPT-4o-mini |

---

## 🎨 UI Highlights

- **Dark glassmorphism** login card with animated gradient orbs
- **Collapsible sidebar** with smooth width transitions
- **Monaco Editor** with JetBrains Mono font and custom dark theme
- **Tabbed output panel** — Fixed Code, Explanation, Tech Stack
- **History panel** with expandable cards and delete support
- **Loading states** everywhere — spinners, pulsing dots, disabled buttons
- **Copy-to-clipboard** on all code blocks

---

## 📝 License

MIT — build freely.
