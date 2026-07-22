# 🚀 TaskFlow

<div align="center">

A modern full-stack daily task management application built with **Next.js**, **Laravel**, and **PostgreSQL**.

Organize your daily workflow with colorful categories, secure authentication, and an elegant dark-mode interface.

![Laravel](https://img.shields.io/badge/Laravel-12-red?style=for-the-badge&logo=laravel)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-blue?style=for-the-badge&logo=postgresql)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38BDF8?style=for-the-badge&logo=tailwindcss)

</div>

---

# 📖 About

TaskFlow is a modern productivity application designed to help users manage their daily tasks in a clean and intuitive way.

Unlike traditional todo applications, TaskFlow focuses on **daily task organization**, allowing users to easily identify, categorize, and complete tasks through an elegant user interface.

The application combines a modern React-based frontend with a secure Laravel REST API and a PostgreSQL database hosted on Neon.

---

# ✨ Features

## 🔐 Authentication

- User Registration
- Secure Login
- Laravel Sanctum Authentication
- Protected API Routes
- Logout

---

## ✅ Todo Management

- Create Tasks
- Edit Tasks
- Delete Tasks
- Mark Tasks as Completed
- Restore Completed Tasks
- Search Tasks
- Status Filtering

---

## 🎨 Category Management

Create your own custom categories to better organize your work.

Examples

- 🔴 Urgent
- 🔵 Work
- 🟢 Personal
- 🟡 Study
- 🟣 Health

Each category includes a custom color making tasks instantly recognizable.

---

## 📅 Daily Workflow

TaskFlow is designed around daily productivity.

Users can

- Create daily tasks
- Track completed work
- Organize today's workload
- Review previous tasks
- Filter tasks based on creation date

---

## 🌙 Modern User Interface

- Responsive Design
- Dark Mode
- Landing Page
- Animated Dashboard
- Glassmorphism Effects
- Mobile Friendly

---

# 🏗 Architecture

```
                Next.js Frontend
                        │
                  Axios HTTP Client
                        │
                Laravel REST API
                        │
              Laravel Sanctum Auth
                        │
                PostgreSQL Database
                     (Neon Cloud)
```

---

# 🛠 Technology Stack

## Frontend

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- Axios
- Lucide Icons

---

## Backend

- Laravel 12
- Laravel Sanctum
- Eloquent ORM
- REST API

---

## Database

- PostgreSQL
- Neon Cloud Database

---

# 📂 Project Structure

```
TaskFlow
│
├── backend
│   ├── app
│   ├── routes
│   ├── database
│   └── ...
│
├── frontend
│   ├── app
│   ├── components
│   ├── lib
│   └── ...
│
└── README.md
```

---

# ⚙ Backend Setup

Move into the backend directory

```bash
cd backend
```

Install dependencies

```bash
composer install
```

Create the environment file

```bash
cp .env.example .env
```

Generate the application key

```bash
php artisan key:generate
```

Configure your PostgreSQL database inside

```
.env
```

Run the migrations

```bash
php artisan migrate
```

Start the backend

```bash
composer run dev
```

The backend will typically run on

```
http://127.0.0.1:8000
```

---

# ⚙ Frontend Setup

Move into the frontend directory

```bash
cd frontend
```

Install dependencies

```bash
npm install
```

Create

```
.env.local
```

Add

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

Run the frontend

```bash
npm run dev
```

Open

```
http://localhost:3000
```

---

# 🚀 Production Build

Frontend

```bash
npm run build
npm run start
```

Backend

```bash
php artisan optimize
```

---

# 🔑 API Overview

Authentication

```
POST /api/register
POST /api/login
POST /api/logout
```

Users

```
GET /api/user
```

Todos

```
GET /api/todos
POST /api/todos
PUT /api/todos/{id}
DELETE /api/todos/{id}
```

Categories

```
GET /api/categories
POST /api/categories
PUT /api/categories/{id}
DELETE /api/categories/{id}
```

---

# 🎯 Future Improvements

- Calendar View
- Drag & Drop Tasks
- Task Priority Levels
- Notifications
- Recurring Tasks
- Pomodoro Timer
- Analytics Dashboard
- Team Collaboration
- File Attachments
- Mobile Application

---

# 📸 Screenshots

Landing Page

```
(Add Screenshot Here)
```

Dashboard

```
(Add Screenshot Here)
```

Categories

```
(Add Screenshot Here)
```

Authentication

```
(Add Screenshot Here)
```

---

# 👨‍💻 Author

Developed by **Ayesh Ranawaka**

GitHub

```
https://github.com/CYBER-CONQUEROR
```

---

# 📄 License

This project is available for educational and portfolio purposes.
