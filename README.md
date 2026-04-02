# 🔬 AMBER: AI-Powered Milk Quality Analysis System

<p align="center">
  A high-scale, production-ready SaaS platform that performs real-time classification of milk samples using Convolutional Neural Networks (CNN) to detect adulteration, contamination, and purity levels.
</p>

## ✨ Key Features
- **Dual Inference Engine**: Upload individual `.jpg/.png` files or attach a microscopy feed hardware folder for real-time live scanning.
- **Deep Learning Accuracy**: Employs an optimized Keras CNN architecture with 86.81% validation accuracy across 4 categorical classes:
  - ✅ **Pure Milk**
  - ⚠️ **Glucose Adulterated**
  - ❌ **Chemical Adulterated**
  - 🦠 **Pathogen Contaminated**
- **Modern 3D Interface**: A fully responsive frontend built with **React, Vite, Three.js, and TailwindCSS**, featuring glassmorphism micro-animations.
- **Secure Backend System**: A lightning-fast **FastAPI** backend with military-grade JWT authentication, IP Rate-limiting, brute-force lockout mechanics, and magic-byte image evaluation.

---

## 🛠️ Architecture Setup
This project transitioned from a basic Python script into a fully containerized microservice monolith.

- **Frontend**: React 19 + Vite (Deployed on [Vercel](https://vercel.com))
- **Backend Core**: Python 3.10 + FastAPI (Deployed on [Render.com](https://render.com))
- **Machine Learning**: TensorFlow / Keras models
- **Database**: Secure local SQLite3 relational schemas
- **Storage**: Real-time processed image volumes

### Production Security Parameters (Enabled)
- 🔒 **CSP Headers**: Prevents remote XSS scaling by restricting `connect-src` and `frame-ancestors`.
- ⏳ **Rate Limiter**: Implemented a Token-Bucket algorithm limiting authentication and image-processing DOS attempts.
- 🛡️ **LFI / Path Traversal Prevention**: Stripped string rendering on image fetch API.
- 🔑 **Strict Password Policies**: SHA-256 BCrypt hashing (12 rounds) matching strict alphanumeric rules.

---

## 🚀 Running The Project Locally

We have designed a single-click environment bootstrapping script for Windows developers.

### Prerequisites:
- Python 3.10+
- Node.js v20+

### Step-by-Step Launch:
1. Clone the repository to your local machine.
2. Initialize your backend Python virtual environment:
   ```bash
   python -m venv venv
   call venv\Scripts\activate.bat
   pip install -r requirements.txt
   ```
3. **Boot Everything in One Click:**
   Double click the **`run_local.bat`** file in the root folder.
   
This script will automatically:
- Inject a local `JWT_SECRET_KEY` so your security middleware doesn't crash.
- Install any missing React frontend Node dependencies.
- Open **two** parallel terminal windows (FastAPI Server on `localhost:8000` & Vite React Server on `localhost:5173`).

---

## 📈 ML Model Architecture 
- **Input Shape**: (128, 128, 3) RGB normalized arrays
- **Blocks**: 3 Convolutional Neural layers, max-pooling scaling, and dropout stabilization to prevent overfitting.
- **Weights**: Checkpointed at `models/milk_classifier_cnn.keras`.
- **Params**: ~17 Million optimized weights.

---

## 👥 Meet The Team
This platform was engineered and built by:

- **Nithin R Poojary**
- **Vikas Pawar**
- **Rahul Vasnt Gunaga**
- **Mahendra Kummar P**

---
*AMBER Biotech Security. Advancing global food supply chain safety through automated, edge-deployment AI.*