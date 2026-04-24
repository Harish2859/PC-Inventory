# ⚡ PC/FORGE — Build & Component Tracker

> A full-stack inventory management system for custom PC builders — track parts, manage stock, and assemble builds in real time.

![Stack](https://img.shields.io/badge/Stack-PERN-00dcff?style=flat-square)
![Frontend](https://img.shields.io/badge/Frontend-Vanilla_JS-f7df1e?style=flat-square)
![Database](https://img.shields.io/badge/Database-PostgreSQL-336791?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-00ff9d?style=flat-square)

---

## 📌 Overview

**PC/FORGE** is a practical demonstration of full-stack development using the **PERN stack** (PostgreSQL · Express · Node.js) with a vanilla frontend (HTML5 · CSS3 · JavaScript ES6+).

The system lets warehouse operators:
- Browse and search a live component inventory
- Add new hardware with stock and wattage metadata
- Assemble a custom PC build with real-time cost and power tracking
- Finalize a build, which commits stock deductions to the database
- Delete components that are no longer carried

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | HTML5, CSS3, Vanilla JS (ES6+) | UI, search, build calculator |
| **Backend** | Node.js, Express.js | REST API server |
| **Database** | PostgreSQL | Persistent component & stock data |
| **Dev Tools** | pgAdmin 4, VS Code | DB management & editing |

---

## 📂 Project Structure

```
pc-forge/
├── frontend/
│   ├── index.html          # App shell & layout
│   ├── style.css           # Industrial terminal UI theme
│   └── script.js           # All frontend logic (fetch, render, build)
│
├── backend/
│   ├── server.js           # Express app entry point
│   ├── db.js               # PostgreSQL connection pool
│   └── routes/
│       └── components.js   # REST route handlers
│
├── database/
│   └── schema.sql          # Table definitions & seed data
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18+
- [PostgreSQL](https://www.postgresql.org/) v14+
- [pgAdmin 4](https://www.pgadmin.org/) *(optional, for DB GUI)*

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/pc-forge.git
cd pc-forge
```

### 2. Set Up the Database

Open pgAdmin (or `psql`) and run the schema file:

```sql
-- In psql:
\i database/schema.sql
```

This creates the `components` table and optionally seeds it with sample hardware data.

### 3. Configure the Backend

```bash
cd backend
npm install
```

Create a `.env` file in `/backend`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pc_forge
DB_USER=your_postgres_user
DB_PASSWORD=your_password
PORT=5000
```

### 4. Start the Server

```bash
node server.js
# → API running at http://localhost:5000
```

### 5. Open the Frontend

Simply open `frontend/index.html` in your browser. No build step needed.

---

## 🔌 API Reference

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/components` | Fetch all components |
| `POST` | `/components` | Add a new component |
| `DELETE` | `/components/:id` | Remove a component by ID |
| `POST` | `/build/finalize` | Commit a build (deduct stock) |

### Example — Add a Component

```bash
curl -X POST http://localhost:5000/api/components \
  -H "Content-Type: application/json" \
  -d '{
    "name": "RTX 4080 Super",
    "brand": "NVIDIA",
    "price": 89999,
    "wattage": 320,
    "stock": 5
  }'
```

### Example — Finalize a Build

```bash
curl -X POST http://localhost:5000/api/build/finalize \
  -H "Content-Type: application/json" \
  -d '{ "ids": [1, 3, 7, 12] }'
```

---

## ✨ Features

- **Live Inventory Grid** — cards render dynamically from the database with real-time stock counts
- **Search & Filter** — instant client-side filtering by component name or brand
- **Build Calculator** — tracks cumulative cost (₹) and total power draw (W) as parts are selected
- **600W Power Limit Guard** — wattage counter turns red and pulses when the build exceeds the PSU limit
- **Stock Management** — stock decrements on selection; `OUT OF STOCK` blocks further selection
- **Add / Delete Hardware** — full CRUD via the form panel and card delete buttons
- **Persistent Finalization** — `BUILD PC` posts selected IDs to the backend, committing stock changes to PostgreSQL

---

## 🗄️ Database Schema

```sql
CREATE TABLE components (
    component_id  SERIAL PRIMARY KEY,
    name          VARCHAR(100)   NOT NULL,
    brand         VARCHAR(50)    NOT NULL,
    price         NUMERIC(10,2)  NOT NULL,
    wattage       INT            DEFAULT 0,
    stock_qty     INT            NOT NULL DEFAULT 0,
    created_at    TIMESTAMP      DEFAULT NOW()
);
```

---

## 🔮 Planned Improvements

- [ ] JWT-based admin authentication
- [ ] Component category tagging (GPU, CPU, RAM, etc.) with filter tabs
- [ ] Build history log stored in a `builds` table
- [ ] Compatibility warnings (e.g. socket mismatch between CPU and motherboard)
- [ ] Export build as PDF quote / invoice
- [ ] Dark/light theme toggle

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push and open a PR

---

## 📄 License

MIT © 2025 — built as a full-stack learning project.
