# 📊 Lead Management Dashboard (Mini CRM)

A full-stack **CRM-style Lead Management Dashboard** built using **React, Node.js, Express, and MongoDB**, featuring server-side search, filters, pagination, analytics, and a responsive UI.  
The application is deployed using **free hosting providers** and uses **MongoDB Atlas (Free Tier)**.

---

---

## 🌐 Deployed URLs

- Frontend: https://lead-management-frontend-j06o.onrender.com  
- Backend API: https://lead-management-backend-t2qa.onrender.com

---

## 🚀 Features

### 🔐 Authentication
- Basic login & signup flow
- Protected routes using React Router

### 📋 Lead Management
- View leads with **pagination**
- **Server-side search** (name, email, company)
- **Filters** by status and source
- **Sorting** by creation date
- Lead details page with full information

### 📊 Analytics
- Total leads
- Converted leads
- Conversion rate
- Leads grouped by status
- Analytics shown inside a **responsive animated modal**

### 🧪 Data Seeding
- Automatically seed **300–1000 dummy leads**
- Uses `@faker-js/faker` for realistic data

### 📱 Responsive UI
- Fully responsive for mobile, tablet, and desktop
- Built using **Tailwind CSS**
- Clean dashboard-style layout

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- React Router
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB (Atlas Free Tier)
- Mongoose

### Deployment
- Frontend: **Vercel / Netlify**
- Backend: **Render**
- Database: **MongoDB Atlas**

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

```env
PORT=8000
MONGODB_URL=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key

```


## 🧪 Seeding Dummy Leads

```bash
cd backend
node seed/seedLeads.js
```

---

## ▶️ Running the Project Locally

```bash
git clone https://github.com/your-username/lead-management-dashboard.git
cd lead-management-dashboard
```

```bash
cd backend
npm install
npm start
```

```bash
cd frontend
npm install
npm run dev
```



## 🔑 Demo Credentials

Email: p@gmail.com  
Password: 123456  

---

## 👨‍💻 Author

**Manish Kumar**  
Full Stack Developer (MERN)
