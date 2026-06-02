# ✈️ Tripza

An intelligent travel planning web application that generates personalized itineraries, real-time weather forecasts, budget estimates, and nearby attractions based on user input like *"3 days in Jaipur under ₹10,000"*.

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-2.0+-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

---

## 📋 Table of Contents

- [Features](#features)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Getting API Keys](#getting-api-keys)
- [Running the Application](#running-the-application)
- [Usage Examples](#usage-examples)
- [Troubleshooting](#troubleshooting)
- [Future Enhancements](#future-enhancements)
- [License](#license)

---

## ✨ Features

- **Natural Language Input** – Type something like *"4 days in Goa under ₹15,000"* and the app understands.
- **Real-time Weather** – Fetches current temperature, humidity, and conditions via OpenWeather API.
- **Smart Itinerary** – Generates day-by-day plans with morning, afternoon, and evening activities (city‑specific for Jaipur, Goa, Manali).
- **Budget Breakdown** – Estimates costs for accommodation, food, transport, and activities. Shows progress bar and savings.
- **Nearby Attractions** – Lists top 5 places to visit using Google Places API.
- **Tabbed Interface** – Clean, professional UI with separate tabs for Itinerary, Weather, Budget, and Attractions.
- **Responsive Design** – Works on desktop, tablet, and mobile.
- **Secure API Key Management** – Keys stored in `.env` file, never exposed to the browser.

---

## ⚙️ How It Works

1. User enters a trip description (e.g., *"3 days in Jaipur under ₹10,000"*).
2. Frontend extracts **destination**, **number of days**, and **budget**.
3. Frontend sends a POST request to the Flask backend (`/api/plan-trip`).
4. Backend calls:
   - **OpenWeather API** for current weather.
   - **Google Places API** for attractions.
5. Backend calculates budget and generates a day‑wise itinerary.
6. Backend returns a JSON response with all data.
7. Frontend displays the results in a tabbed, card-based layout.

---

## 🛠️ Tech Stack

| Layer       | Technology                                 |
|-------------|--------------------------------------------|
| **Frontend**| HTML5, CSS3, JavaScript (ES6)              |
| **Backend** | Python 3.8+ with Flask                     |
| **APIs**    | OpenWeather API, Google Places API         |
| **HTTP Client** | `requests` (Python) + `fetch` (JS)     |
| **Environment** | `python-dotenv` for `.env` management  |

---

## 📁 Project Structure
Tripza/
│
├── app.py # Flask backend (main server)
├── requirements.txt # Python dependencies
├── .env # API keys (not committed)
├── .gitignore # Ignore sensitive files
├── README.md # This file
│
└── templates/
└── index.html # Frontend UI

text

---

## 🔧 Prerequisites

- **Python 3.8+** – [Download Python](https://python.org)
- **pip** – Usually comes with Python
- **Git** (optional) – For version control

---

## 📦 Installation & Setup

### 1. Clone or create the project folder

```bash
mkdir Tripza
cd Tripza
2. Create a virtual environment (recommended)
bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac / Linux
python3 -m venv venv
source venv/bin/activate
3. Install dependencies
bash
pip install flask requests python-dotenv flask-cors
Or use requirements.txt:

bash
pip install -r requirements.txt
4. Create .env file
Create a file named .env in the root folder and add your API keys:

env
OPENWEATHER_API_KEY=your_openweather_api_key_here
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
⚠️ Never commit .env to GitHub! It is already ignored via .gitignore.

5. Create templates/ folder and add index.html
bash
mkdir templates
Then copy the provided index.html into the templates/ folder.

🔑 Getting API Keys
OpenWeather API
Go to OpenWeather Sign Up

Create a free account

Verify your email

Log in → API Keys tab

Copy the default key (or create a new one)

Google Places API
Go to Google Cloud Console

Create a new project (e.g., "TravelPlanner")

Enable Places API from the library

Go to Credentials → Create Credentials → API Key

Copy the key

(Recommended) Restrict the key to Places API only to prevent misuse

🚀 Running the Application
Start the Flask backend
bash
python app.py
You should see:

text
==================================================
✈️ Tripza - Server Running
==================================================
📍 Backend: http://localhost:5000
🌐 Open in browser: http://localhost:5000
==================================================
Open the app
Go to http://localhost:5000 in your browser.