# ✈️ TRIPZA – Travel Buddy

TRIPZA is a smart travel itinerary planner that helps users create personalized travel plans based on destination, trip duration, budget, hotel preferences, weather conditions, and nearby attractions.

## 🌟 Features

- 📍 Generate travel itineraries for any destination
- 🗓️ Customizable trip duration (1–10 days)
- 💰 Budget estimation and breakdown
- 🏨 Hotel selection (Budget & Luxury)
- 🌤️ Live weather forecast using OpenWeather API
- 🗺️ Interactive destination map using Leaflet.js
- 🎯 Smart attraction recommendations
- ⏰ Editable activity timings
- ✅ Progress tracking with checklists
- 📄 Download itinerary
- 📤 Share trip plan

---

## 🛠️ Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript (ES6)

### APIs
- OpenWeather API
- Geoapify API
- OpenStreetMap Nominatim API

### Libraries
- Leaflet.js

---

## 📂 Project Structure

```
TRIPZA/
│
├── index.html      # Main webpage
├── style.css       # Styling and UI design
├── script.js       # Application logic and API integration
└── README.md
```

---

## 🚀 How It Works

1. Enter trip details:

```
3 Days in Jaipur under ₹10,000
```

2. Click **Generate Trip**

3. TRIPZA will:
   - Generate attractions
   - Fetch weather forecast
   - Show hotel suggestions
   - Calculate budget
   - Create a day-wise itinerary

---

## 🔑 API Setup

### OpenWeather API

Get API key from:

https://openweathermap.org/api

Replace:

```javascript
const OPENWEATHER_KEY = "YOUR_API_KEY";
```

---

### Geoapify API

Get API key from:

https://www.geoapify.com/

Replace:

```javascript
const GEOAPIFY_KEY = "YOUR_API_KEY";
```

---

## 📊 Main Modules

### Weather Module
Fetches live weather forecast for selected destination.

### Hotel Module
Provides hotel suggestions and updates trip budget dynamically.

### Budget Module
Calculates:

- Hotel Cost
- Food Cost
- Transport Cost
- Attraction Cost

### Itinerary Module
Creates:

- Day-wise plan
- Activity checklist
- Editable timings

### Map Module
Displays destination on an interactive map using Leaflet.

---

## 🎯 Sample Input

```
5 Days in Goa under ₹15000
```

### Generated Output

- Day-wise itinerary
- Weather forecast
- Nearby attractions
- Hotel suggestions
- Budget estimate
- Interactive map

---

## 👥 Team Contributions

This project was developed collaboratively by the TRIPZA team.

Key development areas included:

- Frontend UI Design
- API Integration
- Itinerary Generation
- Budget Calculation
- Weather Forecasting
- Hotel Recommendation System
- Interactive Map Integration

---

## 🔮 Future Enhancements

- User Authentication
- Save Trip History
- PDF Export
- AI-Based Recommendations
- Multi-City Planning
- Real Hotel Pricing Integration
- Flight Booking Integration

---

## 📸 Project Preview

TRIPZA provides an all-in-one travel planning experience by combining itinerary generation, budgeting, weather forecasting, hotel suggestions, and attraction discovery in a single web application.

---

## 📄 License

This project is developed for educational and learning purposes.

---

### Made with ❤️ by Team TRIPZA