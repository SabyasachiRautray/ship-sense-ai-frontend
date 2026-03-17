# 🚢 ShipSense AI – Frontend

A modern, responsive frontend for **ShipSense AI**, a smart logistics monitoring system that tracks shipments, predicts delays, and visualizes routes in real-time.

---

## 🌟 Features

* 📦 View all shipments with real-time status
* 🗺️ Interactive shipment tracking on map
* ⏱️ ETA & SLA deadline visualization
* ⚠️ Delay alerts and risk indicators
* 🔐 Authentication (User/Admin roles)
* 📊 Dashboard with analytics insights
* 🔄 Auto-refresh shipment updates

---

## 🛠️ Tech Stack

* **Framework:** React (Vite)
* **Styling:** Tailwind CSS
* **State Management:** Redux Toolkit
* **Icons:** Lucide React
* **Maps:** (e.g., Leaflet / Google Maps)
* **API Integration:** REST (FastAPI backend)

---



## 🚀 Getting Started

### 1. Clone the repo

```
git clone https://github.com/YOUR_USERNAME/ship-sense-ai.git
```

### 2. Install dependencies

```
npm install
```

### 3. Run the app

```
npm run dev
```

---

## 🔗 Backend Connection

Make sure your backend is running (FastAPI):

```
http://localhost:8000
```

Update API base URL in your config if needed.

---


## ⚡ Future Improvements

* 📱 Mobile responsiveness improvements
* 🔔 Push notifications
* 🌐 Deployment

---



---

## 📄 License

This project is built for a hackathon and is open for learning purposes.

```
shipsense
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ public
│  ├─ favicon.svg
│  └─ icons.svg
├─ README.md
├─ src
│  ├─ App.css
│  ├─ App.jsx
│  ├─ components
│  │  ├─ AddShipmentModal.jsx
│  │  ├─ AlertPanel.jsx
│  │  ├─ Dropdown.jsx
│  │  ├─ Navbar.jsx
│  │  ├─ RiskBadge.jsx
│  │  ├─ RiskChart.jsx
│  │  ├─ ShipmentDetail.jsx
│  │  ├─ ShipmentMap.jsx
│  │  ├─ ShipmentTable.jsx
│  │  └─ SimulateButton.jsx
│  ├─ index.css
│  ├─ main.jsx
│  ├─ pages
│  │  ├─ Dashboard.jsx
│  │  ├─ LandingPage.jsx
│  │  ├─ LoginPage.jsx
│  │  └─ UserDashboard.jsx
│  └─ redux
│     ├─ api
│     │  └─ shipApi.js
│     ├─ store.js
│     └─ useAuth.js
└─ vite.config.js

```

to run do

npm install

npm run dev# ship-sense-ai-frontend
