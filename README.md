# E-Healthcare Web Application

A full-stack E-Healthcare web application designed to help users search doctors, book appointments, purchase consultation plans, and join online video consultations.

## Source Code

GitHub Repository: https://github.com/assiantadarsh/e-healthcare

## Project Overview

E-Healthcare is a web-based healthcare management system that provides a simple and user-friendly platform for patients to connect with doctors online. The project includes doctor search, appointment booking, subscription plans, emergency assistance, and video consultation features.

This project is built as a college project to demonstrate full-stack web development using frontend technologies, backend APIs, database management, and third-party API integration.

## Key Features

- User registration and login
- Secure password hashing using bcrypt
- Doctor search and filtering
- Doctor profile details
- Appointment booking system
- Appointment history page
- Cancel appointment option
- Subscription plans for video consultation
- Credit-based video call system
- Online video consultation using Jitsi Meet
- Emergency help page with AI-style chatbot
- Responsive and professional UI design
- MySQL database integration
- REST API based backend architecture

## Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

- Node.js
- Express.js

### Database

- MySQL

### Other Tools / Libraries

- bcrypt
- cors
- dotenv
- mysql2
- Jitsi Meet External API
- GitHub
- VS Code

## Folder Structure

```txt
e-healthcare/
│
├── backend/
│   ├── node_modules/
│   ├── routes/
│   ├── .env
│   ├── .gitignore
│   ├── db.js
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── script.js
│   │   ├── payment.js
│   │   ├── plan-payment.js
│   │   ├── appointments.js
│   │   ├── video.js
│   │   └── emergency.js
│   │
│   ├── index.html
│   ├── doctor.html
│   ├── payment.html
│   ├── plan-payment.html
│   ├── appointments.html
│   ├── video.html
│   └── emergency.html
│
└── README.md
