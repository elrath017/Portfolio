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

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `SECRET_KEY` | Flask session signing key | `random-secure-string-here` |
| `ADMIN_PASSWORD` | Password to unlock Admin Control Drawer | `admin123` |
| `GEMINI_API_KEY` | Google Gemini API Key (from Google AI Studio) | `AIzaSy...` |
| `GEMINI_MODEL` | Gemini Model identifier | `gemini-2.5-flash` |
| `FLASK_PORT` | Port for local dev server | `5000` |

---

## 📦 Quick Start (Local Setup)

### 1. Clone the repository & set up environment
```bash
cd "Portfolio v1"
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure `.env`
```bash
cp .env.example .env
# Edit .env and supply your ADMIN_PASSWORD and GEMINI_API_KEY
```

### 4. Run the Flask application
```bash
python app.py
```
Open your browser and navigate to: **`http://127.0.0.1:5000`**

On initial startup, `portfolio.db` will automatically be created and seeded with placeholder data.

---

## 🔐 Admin Usage

1. Scroll to the footer of the page and click the discreet **"Admin"** text link.
2. Enter your `ADMIN_PASSWORD` (default `admin123` unless specified in `.env`).
3. The **Admin Control Panel** drawer will slide in from the right.
4. From here you can:
   - Update your profile details.
   - Add new projects with custom tech tags and project URLs.
   - Delete existing projects.
   - Create new project categories.
   - Add/Remove technical skills pills.

---

## 🤖 Gemini AI Integration

The AI chatbot uses the latest `google-genai` Python SDK (`from google import genai`). When a user sends a question, the backend fetches all profile, skills, and project data from SQLite and dynamically constructs a context-bounded system prompt.

If `GEMINI_API_KEY` is omitted from `.env`, the chat trigger button is hidden gracefully on the frontend.

---

## 🚀 Production Deployment (Gunicorn & SQLite)

When deploying to platforms like **Render**, **Railway**, **Fly.io**, or an **AWS EC2 / VPS**:

### 1. Production Command
Run the application with Gunicorn:
```bash
gunicorn --bind 0.0.0.0:5000 --workers 4 app:app
```

### 2. Persistent Storage for SQLite
Ensure that `portfolio.db` is stored on a **persistent disk mount** so your added projects, categories, and profile edits persist across server restarts or container redeployments.

### 3. Environment Configuration
Ensure production environment variables (`SECRET_KEY`, `ADMIN_PASSWORD`, `GEMINI_API_KEY`) are set securely in your hosting dashboard.
