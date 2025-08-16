# Rakshaa - AI Healthcare Platform

> **Empowering Healthcare with AI, Real-Time Collaboration, and Seamless Patient Experience**

🌐 **Live Website:** [rakshaa.xyz](https://rakshaa.xyz)

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Usage](#usage)
- [AI & ML Capabilities](#ai--ml-capabilities)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 Overview
Rakshaa is a comprehensive, full-stack AI-powered healthcare platform designed to revolutionize the way patients, doctors, path labs, and pharmacies interact. The platform harnesses advanced machine learning to predict diseases based on symptoms, streamlines appointment and lab booking, and enables real-time communication between all stakeholders. With a focus on accessibility, security, and user experience, Rakshaa delivers a seamless digital healthcare journey for everyone.

---

## 🚀 Features
- **AI Disease Prediction:**
    - Enter your symptoms and let Rakshaa's intelligent backend predict possible diseases using a trained machine learning model. Instantly receive recommendations for medications, diets, and necessary precautions tailored to your condition.
- **Multi-role System:**
    - The platform provides dedicated dashboards and workflows for Patients, Doctors, Path Labs, and Pharmacies, ensuring each user type has access to the tools and information they need.
- **Real-Time Chat:**
    - Communicate securely and instantly with healthcare professionals using a robust, socket-based chat system. Patients and doctors can discuss symptoms, treatments, and follow-ups in real time.
- **Appointment & Lab Booking:**
    - Effortlessly schedule doctor consultations and book lab tests online. The intuitive interface makes managing your healthcare appointments simple and efficient.
- **E-Prescriptions & Reports:**
    - Receive and download digital prescriptions and lab reports in PDF format, making it easy to keep track of your medical history and share documents when needed.
- **OCR medicine scanner:**
    - Scan medicine images and upload them directly to the platform for getting all the
    details about that particular medicine.
- **Pharmacy Integration:**
    - Order prescribed medicines directly from the platform and track your orders from placement to delivery, all in one place.
- **Authentication & Authorization:**
    - Secure, role-based access using JWT ensures that your data is protected and only accessible to authorized users.
- **Modern UI:**
    - Enjoy a clean, responsive, and user-friendly interface built with Next.js and Tailwind CSS, optimized for both desktop and mobile devices.
- **Admin Controls:**
    - Platform administrators can efficiently manage users, doctors, labs, and medicines, maintaining a high standard of service and security.

---

## 🏗️ Architecture
```
[Next.js Frontend]  <---->  [Node.js/Express API]  <---->  [MongoDB]
         |                                 |
         |                                 |
         +----> [Flask ML Backend] <--------+
         |                                 |
         +----> [Socket.IO Server] <--------+
```
- **Frontend:** Built with Next.js (React) for fast, scalable, and SEO-friendly user interfaces. Styled using Tailwind CSS and ShadCN UI for a modern look and feel.
- **Backend:** Node.js and Express power the RESTful API, handling authentication, business logic, and integration with external services. Real-time features are enabled via Socket.IO.
- **ML Backend:** A dedicated Flask server (Python) runs the machine learning models, leveraging scikit-learn and pandas for data processing and prediction. Model artifacts are managed with pickle.
- **Database:** MongoDB, accessed via Mongoose ODM, stores all user, appointment, and medical data securely and efficiently.

---

## 🛠️ Tech Stack
- **Frontend:** Next.js, React, Tailwind CSS, ShadCN UI — Delivers a dynamic, responsive, and visually appealing user experience.
- **Backend:** Node.js, Express, Socket.IO, JWT, Mongoose — Provides robust APIs, secure authentication, and real-time communication.
- **ML/AI:** Flask, scikit-learn, pandas, pickle — Powers the disease prediction and recommendation engine.
- **Database:** MongoDB — Stores all application data with high performance and scalability.
- **Other Integrations:** Cloudinary (media management), Razorpay (payments), Nodemailer (email notifications), React-PDF (PDF generation and viewing).

---

## 💡 Usage
- **For Patients:** Register, log in, and access your personalized dashboard. Book appointments with doctors, schedule lab tests, chat with healthcare professionals, and order medicines. Download your prescriptions and lab reports anytime.
- **For Doctors:** Manage your appointments, consult with patients via chat, upload prescriptions, and view patient histories. Stay organized with a dedicated doctor dashboard.
- **For Path Labs:** Receive and manage lab test bookings, upload test results, and communicate with patients and doctors as needed.
- **For Pharmacies:** View and process medicine orders, update order statuses, and manage inventory efficiently.
- **For Admins:** Oversee the entire platform, manage all users and resources, and ensure smooth operation and security.

---


## 🤖 AI & ML Capabilities
- **Disease Prediction:**
    - Rakshaa uses a Support Vector Classifier (SVC) model, trained on a comprehensive dataset, to predict diseases based on user-reported symptoms. The model is integrated into the platform via a Flask API for fast and accurate predictions.
- **Recommendations:**
    - For each predicted disease, the system provides evidence-based recommendations for medications, dietary adjustments, and necessary precautions, helping users take informed next steps.
- **Data Sources:**
    - The ML engine utilizes curated CSV datasets containing symptom severity, disease descriptions, medication lists, dietary guidelines, and more, ensuring reliable and up-to-date recommendations.

---

## 🤝 Contributing
We welcome contributions from the community! To contribute:
1. **Fork the repository** and create your feature branch: `git checkout -b feature/your-feature`
2. **Commit your changes** with clear, descriptive messages: `git commit -m 'Add new feature'`
3. **Push to your branch:** `git push origin feature/your-feature`
4. **Open a Pull Request** describing your changes and why they improve the project.
5. Our team will review your submission and work with you to get it merged!

---

## 📄 License
This project is licensed under the MIT License. You are free to use, modify, and distribute this software with proper attribution.

---

> **Crafted with ❤️ by the Rakshaa Team**
