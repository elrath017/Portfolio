# 🚀 Data Science & AI Engineer Portfolio Website

A visually striking, modern "Dark Tech Editorial" portfolio website designed specifically for Data Scientists, AI Engineers, and MLOps Specialists. Built using **Python Flask**, **SQLite**, and **vanilla HTML/CSS/JS** with zero heavy frontend frameworks or Tailwind dependencies.

Features an **integrated Gemini AI Assistant**, an **Admin Control Drawer** for dynamic content management, **category filtering**, **light/dark theme toggle**, and **responsive glassmorphic UI design**.

---

## ✨ Key Features

- **Dark Tech Editorial Aesthetic**:
  - Deep near-black background (`#0b0d12`) with animated ambient glows and subtle CSS grid backgrounds.
  - Electric indigo to cyan gradient accents.
  - Distinctive typography using **Space Grotesk** (headings), **Inter** (body), and **JetBrains Mono** (tags/code).
  - Light/Dark theme toggle with `localStorage` persistence.
- **Dynamic Content & SQLite Database**:
  - Auto-seeds on first run with realistic AI/DS profile data, categories, skills, and projects.
  - Fully dynamic rendering from SQLite.
- **Glassmorphic Project Cards & Filter Tabs**:
  - Category filtering with smooth scale/fade transitions.
  - Glassmorphic cards with glowing border animations on hover.
  - Monospace tech stack pills, project demo links, GitHub links, and auto-generated gradient placeholders for projects missing custom thumbnails.
- **AI Chatbot (Powered by Gemini)**:
  - Floating "Ask My AI" glass panel with suggested questions, typing indicators, and auto-scrolling.
  - Connected to `POST /api/chat` using the official `google-genai` Python SDK.
  - Grounded strictly in stored portfolio data (profile, projects, skills) with prompt injection defenses and per-IP rate limiting (15 msgs/min).
- **Admin Management Panel**:
  - Discreet "Admin" link in the footer opening a password-authenticated drawer.
  - Edit profile bio, headline, links, and contact info.
  - Add, edit, or delete projects with confirmation modals.
  - Manage categories (with protection preventing deletion of categories containing active projects).
  - Add and remove technical skills.
  - Toast notifications system for feedback.
- **Security & Best Practices**:
  - Password verification using `hmac.compare_digest`.
  - Secure session cookies (`HttpOnly`, `SameSite=Lax`).
  - Custom `X-Requested-With: fetch` header enforcement on state-changing API endpoints.
  - Parameterized SQL queries preventing SQL injection.
  - Input sanitization and URL validation (`http://`, `https://`, `mailto:`).

---

## 🛠️ Tech Stack

- **Backend**: Python 3.10+, Flask, SQLite3, `google-genai` SDK
- **Frontend**: Vanilla HTML5, Modern CSS3 (CSS Variables, Flexbox/Grid, Glassmorphism), Vanilla JavaScript (ES6+)
- **Production Server**: Gunicorn

---

## 📁 Repository Structure

```
├── app.py              # Main Flask application, routes, SQLite DB, admin auth & Gemini API
├── templates/
│   └── index.html      # Jinja2 template for the portfolio website & admin UI
├── static/
│   ├── style.css       # Complete design system, glassmorphism, animations & dark/light themes
│   └── app.js          # Interactive features, category filters, theme toggle & admin drawer JS
├── requirements.txt    # Python package dependencies
├── .env.example        # Environment variables template
├── .gitignore          # Git ignore rules
└── README.md           # Application documentation
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `TURSO_DATABASE_URL` | Turso Cloud SQLite database URL | `libsql://portfolio-db.....` |
| `TURSO_AUTH_TOKEN` | Turso Auth Token for cloud access | `eyJhbGci...` |
| `SECRET_KEY` | Flask session signing key | `random-secure-string-here` |
| `ADMIN_PASSWORD` | Password to unlock Admin Control Drawer | `admin123` |
| `GEMINI_API_KEY` | Google Gemini API Key (from Google AI Studio) | `AIzaSy...` |
| `GEMINI_MODEL` | Gemini Model identifier | `gemini-2.5-flash` |
| `APP_ENV` | Environment mode (`production` or `development`) | `production` |
| `FLASK_PORT` | Port for local dev server | `5000` |

---

## 📋 Render Deployment Checklist (100% Free Persistent Hosting)

Follow this exact checklist when deploying on Render:

1. **Set Environment Variables on Render**:
   In the Render dashboard, open your service $\rightarrow$ **Environment** $\rightarrow$ add these exact key names:
   - `TURSO_DATABASE_URL`: `libsql://portfolio-db-elrath017.aws-ap-south-1.turso.io`
   - `TURSO_AUTH_TOKEN`: *(your Turso database auth token)*
   - `SECRET_KEY`: *(your secure random string)*
   - `ADMIN_PASSWORD`: *(your admin password)*
   - `GEMINI_API_KEY`: *(your Gemini API key)*
   - `GEMINI_MODEL`: `gemini-2.5-flash`
   *(Do NOT rely on `.env` on Render, because `.env` is ignored by Git and not uploaded).*

2. **Git & Token Security**:
   - Confirm `.env` is listed in `.gitignore`.
   - Never commit tokens or secret keys to Git.

3. **Verify Deployment & Persistence**:
   - Check Render build logs for the startup confirmation line:  
     `Using Turso database: portfolio-db-elrath017.aws-ap-south-1.turso.io | Projects count: 5`
   - Health check endpoint: `https://your-app.onrender.com/healthz` (returns `ok`).
   - Admin database status endpoint: `https://your-app.onrender.com/admin/db-status` (shows database backend and live table row counts).

---

## 🧪 Database Persistence Verification

Run the automated persistence test script to verify database read/write persistence across separate connections:

```bash
python test_persistence.py
```
If configured correctly, the script connects to Turso, inserts a test project, verifies it using a new connection, cleans it up, and prints **`PASS`**.
