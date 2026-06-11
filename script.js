const OPENWEATHER_KEY = "7f0f1e8a7baf77fe2972a9d1ebbc137e";
const GEOAPIFY_KEY    = "aa18d40f48f64006975eb293c80a851b";

let selectedHotelPrice = 1200;
let currentHotelRate = "3star";
let liveHotelsList = [];
let globalDays = 3, globalDestination = "Jaipur", globalBudget = 10000;
let checkState = new Map();
let perActivityTimeMap = new Map();
let allPlaces = [];
let userStartTime = "09:00", userEndTime = "19:00";
let currentCoordinates = { lat: 26.9124, lon: 75.7873 };

// COMPREHENSIVE ATTRACTION DATABASE BY CITY
const attractionDatabase = {
  "Jaipur": [
    "Amber Fort (Amer Fort) - Majestic hilltop fort with elephant rides",
    "City Palace - Royal residence with museums and courtyards",
    "Hawa Mahal - Iconic 'Palace of Winds' with 953 windows",
    "Jantar Mantar - Ancient astronomical observatory (UNESCO)",
    "Nahargarh Fort - Sunset views over the Pink City",
    "Jal Mahal - Floating palace in Man Sagar Lake",
    "Albert Hall Museum - Oldest museum of Rajasthan",
    "Birla Mandir - White marble temple on a hilltop",
    "Jaigarh Fort - Home to world's largest cannon on wheels",
    "Galta Ji (Monkey Temple) - Natural springs & temples",
    "Central Park - Largest park with musical fountain",
    "Johari Bazaar - Traditional jewelry market",
    "Chokhi Dhani - Cultural village resort experience",
    "Panna Meena ka Kund - Ancient stepwell architecture"
  ],
  "Goa": [
    "Baga Beach - Famous beach with water sports",
    "Fort Aguada - 17th-century Portuguese fort",
    "Basilica of Bom Jesus - UNESCO World Heritage site",
    "Dudhsagar Falls - Majestic 4-tiered waterfall",
    "Anjuna Flea Market - Wednesday night market",
    "Palolem Beach - Crescent-shaped scenic beach",
    "Chapora Fort - Hilltop fort (known from Dil Chahta Hai)",
    "Spice Plantations - Authentic spice farm tours",
    "Se Cathedral - One of largest churches in Asia",
    "Mangeshi Temple - Famous Hindu temple",
    "Butterfly Beach - Hidden beach with dolphin sightings"
  ],
  "Delhi": [
    "Red Fort - Historic Mughal fort (UNESCO)",
    "Qutub Minar - World's tallest brick minaret",
    "India Gate - War memorial archway",
    "Humayun's Tomb - Precursor to Taj Mahal",
    "Lotus Temple - Bahá'í House of Worship",
    "Akshardham Temple - Modern architectural marvel",
    "Chandni Chowk - Busy street food and shopping",
    "Lodhi Garden - Heritage park with tombs",
    "Jama Masjid - Largest mosque in India",
    "National Museum - Rich Indian history exhibits",
    "Kingdom of Dreams - Live entertainment complex"
  ],
  "Mumbai": [
    "Gateway of India - Iconic arch monument",
    "Marine Drive - Queen's Necklace promenade",
    "Elephanta Caves - Ancient cave temples",
    "Juhu Beach - Popular beach with street food",
    "Chhatrapati Shivaji Terminus - Gothic architecture",
    "Haji Ali Dargah - Mosque on an islet",
    "Sanjay Gandhi National Park - Lion safari within city",
    "Bandra-Worli Sea Link - Cable-stayed bridge",
    "Colaba Causeway - Shopping street",
    "Mount Mary Church - Basilica in Bandra"
  ],
  "Bangalore": [
    "Lalbagh Botanical Garden - Glass house flower show",
    "Cubbon Park - Historic park in city center",
    "Bangalore Palace - Tudor-style architecture",
    "ISKCON Temple - Spiritual Krishna temple",
    "Wonderla - Amusement park",
    "Bannerghatta National Park - Safari & zoo",
    "Vidhana Soudha - Legislative building",
    "Ulsoor Lake - Boating facilities",
    "Commercial Street - Famous shopping district"
  ],
  "Chennai": [
    "Marina Beach - Second longest beach in world",
    "Kapaleeshwarar Temple - Dravidian architecture",
    "Fort St. George - First British fortress in India",
    "Breezy Beach - Quieter beach option",
    "Government Museum - Bronze art collection",
    "Valluvar Kottam - Memorial to poet Thiruvalluvar",
    "Elliot's Beach - Popular hangout spot"
  ]
};

// Dynamic attraction generator based on destination
function getAttractionsForDestination(city) {
  // Check if city exists in database
  for (let [key, attractions] of Object.entries(attractionDatabase)) {
    if (city.toLowerCase().includes(key.toLowerCase())) {
      return [...attractions];
    }
  }
  
  // Generate dynamic attractions for any city
  const cityName = city;
  return [
    `${cityName} Heritage Fort & Palace`,
    `${cityName} Central Market Square`,
    `${cityName} Riverside Promenade`,
    `${cityName} Grand Temple or Mosque`,
    `${cityName} Art & Culture Museum`,
    `${cityName} Scenic Garden & Park`,
    `${cityName} Local Food Street`,
    `${cityName} Historical Monument`,
    `${cityName} Sunset Viewpoint`,
    `${cityName} Traditional Bazaar`,
    `${cityName} Lake or Waterfront`,
    `${cityName} Cultural Performance Center`,
    `${cityName} Craft & Handicraft Village`,
    `${cityName} Adventure Activity Zone`
  ];
}

async function fetchNearbyAttractionsRobust(city, lat, lon) {
  // Return curated attractions immediately (fast & reliable)
  console.log("Generating attractions for:", city);
  const attractions = getAttractionsForDestination(city);
  
  // Also try to fetch live data in background, but don't block
  setTimeout(async () => {
    try {
      // Try OpenStreetMap Nominatim for nearby places
      const nomRes = await fetch(`https://nominatim.openstreetmap.org/search.php?q=tourist+attraction+in+${encodeURIComponent(city)}&format=jsonv2&limit=15`);
      if (nomRes.ok) {
        const data = await nomRes.json();
        if (data && data.length > 0) {
          const liveAttractions = data.slice(0, 10).map(place => ({
            name: place.display_name.split(',')[0],
            lat: parseFloat(place.lat),
            lon: parseFloat(place.lon)
          }));
          if (liveAttractions.length > 0) {
            console.log("Found live attractions:", liveAttractions.length);
            // Update UI if we got better data
            if (window.allPlaces && window.allPlaces.length > 0) {
              const combined = [...liveAttractions.map(a => ({ name: a.name })), ...attractions.map(a => ({ name: a }))];
              window.allPlaces = combined.slice(0, 30);
              window.fullRefresh();
            }
          }
        }
      }
    } catch(e) { console.log("Background fetch failed:", e); }
  }, 100);
  
  return attractions.map(name => ({ name: name }));
}

async function fetchLiveHotels(city) {
  try {
    // Try Geoapify first
    const geoRes = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(city)}&apiKey=${GEOAPIFY_KEY}&limit=1`);
    if (geoRes.ok) {
      const geoData = await geoRes.json();
      if (geoData.features?.length) {
        const [lon, lat] = geoData.features[0].geometry.coordinates;
        currentCoordinates = { lat, lon };
        const hotelsRes = await fetch(`https://api.geoapify.com/v2/places?categories=accommodation.hotel&filter=circle:${lon},${lat},10000&limit=12&apiKey=${GEOAPIFY_KEY}`);
        if (hotelsRes.ok) {
          const hotelsData = await hotelsRes.json();
          if (hotelsData.features?.length) {
            return hotelsData.features.slice(0, 8).map(f => ({
              name: f.properties.name || "Hotel Stay",
              estimated_night: currentHotelRate === "3star" ? Math.floor(Math.random() * 1000) + 800 : Math.floor(Math.random() * 3000) + 4000
            }));
          }
        }
      }
    }
  } catch(e) { console.log("Hotel API error, using fallback:", e); }
  
  // Fallback hotel list
  let fallback = [];
  const hotelNames = ["Grand Heritage", "Royal Plaza", "Luxury Inn", "City Palace Hotel", "Golden Retreat", "Comfort Stay", "Elite Suites", "Tranquil Resort"];
  for(let i = 0; i < 6; i++) {
    fallback.push({ 
      name: `${city} ${hotelNames[i % hotelNames.length]}`, 
      estimated_night: currentHotelRate === "3star" ? 1200 + (i * 80) : 4800 - (i * 150)
    });
  }
  return fallback;
}

async function updateHotelPanel(city) {
  const container = document.getElementById("liveHotelContainer");
  const suggestionSpan = document.getElementById("hotelSuggestText");
  container.innerHTML = `<span>⏳ Fetching live hotels...</span>`;
  try {
    const hotels = await fetchLiveHotels(city);
    liveHotelsList = hotels;
    container.innerHTML = "";
    hotels.forEach(hotel => {
      const chip = document.createElement("div");
      chip.className = "live-hotel-chip";
      chip.innerHTML = `🏨 ${hotel.name.substring(0, 24)} • ₹${Math.round(hotel.estimated_night)}/nt`;
      chip.addEventListener("click", () => {
        document.querySelectorAll(".live-hotel-chip").forEach(c => c.classList.remove("selected-live"));
        chip.classList.add("selected-live");
        selectedHotelPrice = hotel.estimated_night;
        suggestionSpan.innerHTML = `✅ Selected: ${hotel.name} @ ₹${selectedHotelPrice}/night → budget updated.`;
        updateBudgetAndCostUI();
      });
      container.appendChild(chip);
    });
    suggestionSpan.innerHTML = `✨ ${hotels.length} hotels available. Click any to customize stay cost.`;
  } catch(e) {
    container.innerHTML = `<span class="hotel-suggestion">🏨 Smart hotel options ready</span>`;
    suggestionSpan.innerHTML = `✨ Click on hotel options above to set custom stay budget.`;
  }
}

function calcBudgetWithHotel(days, hotelRate) {
  const hotel = hotelRate * days;
  const food = Math.round(700 * days);
  const transport = Math.round(500 * days);
  const activities = Math.round(400 * days);
  return { hotel, food, transport, activities, total: hotel + food + transport + activities };
}

function updateBudgetAndCostUI() {
  const b = calcBudgetWithHotel(globalDays, selectedHotelPrice);
  document.getElementById('estimatedCost').innerHTML = b.total.toLocaleString();
  const pct = Math.min(100, Math.round((b.total / globalBudget) * 100));
  document.getElementById('budgetProgressBar').style.width = pct + '%';
  document.getElementById('budgetTable').innerHTML = `
    <tbody>
      <tr><td>🏨 Stay (Hotel)</td><td>₹${b.hotel.toLocaleString()}</td></tr>
      <tr><td>🍽️ Food & Dining</td><td>₹${b.food.toLocaleString()}</td></tr>
      <tr><td>🚗 Transport</td><td>₹${b.transport.toLocaleString()}</td></tr>
      <tr><td>🎟️ Attractions</td><td>₹${b.activities.toLocaleString()}</td></tr>
      <tr style="font-weight:bold"><td>Total Estimate</td><td>₹${b.total.toLocaleString()}</td></tr>
    </tbody>`;
}

async function fetchPlacesFromGeoapify(city) {
  // Use our comprehensive attraction database
  return getAttractionsForDestination(city).map(name => ({ name: name }));
}

function generateTimeSlotsForDay(numActivities, startTimeStr, endTimeStr, dayNumber) {
  const slots = [];
  const startHourMin = startTimeStr.split(":").map(Number);
  const endHourMin = endTimeStr.split(":").map(Number);
  let startTotal = startHourMin[0] * 60 + startHourMin[1];
  let endTotal = endHourMin[0] * 60 + endHourMin[1];
  if (endTotal <= startTotal) endTotal = startTotal + 480;
  const durationMinutes = endTotal - startTotal;
  const interval = durationMinutes / (numActivities - 1);
  
  for (let i = 0; i < numActivities; i++) {
    const key = `${dayNumber}_${i}`;
    if (perActivityTimeMap.has(key)) {
      slots.push(perActivityTimeMap.get(key));
    } else {
      let minutes = startTotal + i * interval;
      let h = Math.floor(minutes / 60) % 24;
      let m = Math.floor(minutes % 60);
      const defaultTime = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`;
      slots.push(defaultTime);
    }
  }
  return slots;
}

function buildItineraryHTML() {
  let html = "";
  const activitiesPerDay = 5;
  for (let day = 1; day <= globalDays; day++) {
    const startIdx = (day-1) * activitiesPerDay;
    let placesSlice = allPlaces.slice(startIdx, startIdx + activitiesPerDay);
    while(placesSlice.length < activitiesPerDay) {
      placesSlice.push({ name: `✨ Explore ${globalDestination} Cultural Gem` });
    }
    const timeSlots = generateTimeSlotsForDay(activitiesPerDay, userStartTime, userEndTime, day);
    
    let actsHTML = "";
    placesSlice.forEach((place, idx) => {
      const key = `${day}_${idx}`;
      const checked = checkState.get(key) ? "checked" : "";
      const title = place.name || "Cultural Spot";
      const timeDisplay = timeSlots[idx];
      actsHTML += `<div class="timeline-item" data-day="${day}" data-idx="${idx}">
        <div class="time-picker-sm">
          <input type="time" class="time-input-custom" data-day="${day}" data-idx="${idx}" value="${timeDisplay}" step="60">
        </div>
        <div class="activity">
          <div class="checklist-row">
            <input type="checkbox" class="act-chk" data-day="${day}" data-idx="${idx}" ${checked}>
            <div><h4>📍 ${title.substring(0, 55)}</h4><p>Must-visit attraction • ${globalDestination} highlights</p></div>
            <button class="options-btn" data-day="${day}" data-idx="${idx}">⚙️</button>
          </div>
        </div>
      </div>`;
    });
    
    const extraStart = (day-1) * 2 % allPlaces.length;
    const extraPlaces = allPlaces.slice(extraStart, Math.min(extraStart+4, allPlaces.length));
    const geoHTML = `<div class="geo-places-panel"><div class="geo-tags">${extraPlaces.map(p => `<span class="geo-tag">🌟 ${p.name.substring(0, 28)}</span>`).join("")}</div><small style="display:block; margin-top:6px;">✨ Click any tag for inspiration | Per-timing editable below</small></div>`;
    
    html += `<div class="day-card" data-day="${day}">
      <div class="day-header"><h2>🌟 Day ${day} — ${globalDestination} (${activitiesPerDay} experiences)</h2><small>⏰ Custom schedule: Click on any time to edit per-activity timing</small></div>
      <div class="timeline">${actsHTML}</div>
      ${geoHTML}
      <div class="day-progress-panel">
        <div class="progress-ring">0%</div>
        <button class="check-all-btn" data-day="${day}">✓ Mark All</button>
        <button class="clear-all-btn" data-day="${day}">✗ Clear All</button>
      </div>
    </div>`;
  }
  return html;
}

function attachItineraryEvents() {
  const container = document.getElementById('itineraryContainer');
  container.addEventListener('change', (e) => {
    if(e.target.classList.contains('act-chk')) {
      const day = e.target.dataset.day, idx = e.target.dataset.idx;
      const key = `${day}_${idx}`;
      checkState.set(key, e.target.checked);
      const card = e.target.closest('.day-card');
      if(card) updateProgressForCard(card);
    }
    if(e.target.classList.contains('time-input-custom')) {
      const day = parseInt(e.target.dataset.day), idx = parseInt(e.target.dataset.idx);
      const newTime = e.target.value;
      if(newTime) {
        const key = `${day}_${idx}`;
        perActivityTimeMap.set(key, newTime);
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = 'position:fixed; bottom:20px; right:20px; background:#213D54; color:white; padding:8px 16px; border-radius:40px; z-index:1000; font-size:12px;';
        messageDiv.innerHTML = '✓ Time updated!';
        document.body.appendChild(messageDiv);
        setTimeout(() => messageDiv.remove(), 1500);
      }
    }
  });
  
  container.addEventListener('click', (e) => {
    if(e.target.classList.contains('check-all-btn')) {
      const card = e.target.closest('.day-card');
      card.querySelectorAll('.act-chk').forEach(cb => { 
        cb.checked = true; 
        checkState.set(`${cb.dataset.day}_${cb.dataset.idx}`, true); 
      });
      updateProgressForCard(card);
    }
    if(e.target.classList.contains('clear-all-btn')) {
      const card = e.target.closest('.day-card');
      card.querySelectorAll('.act-chk').forEach(cb => { 
        cb.checked = false; 
        checkState.set(`${cb.dataset.day}_${cb.dataset.idx}`, false); 
      });
      updateProgressForCard(card);
    }
    if(e.target.classList.contains('options-btn')) {
      alert("✨ Customize activity details coming soon! Click on the time to adjust visit timing.");
    }
  });
}

function updateProgressForCard(card) {
  const total = card.querySelectorAll('.act-chk').length;
  const done = [...card.querySelectorAll('.act-chk')].filter(cb => cb.checked).length;
  const pct = total ? Math.round((done/total)*100) : 0;
  const ring = card.querySelector('.progress-ring');
  if(ring) ring.innerHTML = `${pct}%`;
}

async function displayNearbyAttractions() {
  const attractions = getAttractionsForDestination(globalDestination);
  const listDiv = document.getElementById('attractionsList');
  listDiv.innerHTML = attractions.slice(0, 12).map(attr => `<div class="osm-place"><strong>📍 ${attr}</strong><br><span style="font-size:0.65rem;">Popular attraction • Must visit spot</span></div>`).join('');
}

async function loadMap(city){
  try{
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`);
    const data = await res.json();
    if(data.length && window.L){
      const lat = parseFloat(data[0].lat), lon = parseFloat(data[0].lon);
      currentCoordinates = { lat, lon };
      if(window.mapInstance) window.mapInstance.remove();
      const map = L.map('mapContainer').setView([lat, lon], 12.8);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);
      L.marker([lat, lon]).addTo(map).bindPopup(`✨ ${city} - Explore amazing attractions!`);
      window.mapInstance = map;
    }
  } catch(e){ console.warn(e); }
}

async function displayWeather(city, days) { 
  try { 
    const r = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${OPENWEATHER_KEY}&units=metric`); 
    const d = await r.json(); 
    if(d.cod != 200) throw new Error(); 
    const dailyMap = new Map(); 
    d.list.forEach(item => { 
      const date = new Date(item.dt*1000).toLocaleDateString(); 
      if(!dailyMap.has(date)) dailyMap.set(date, {tMax: item.main.temp_max, tMin: item.main.temp_min, weather: item.weather[0]}); 
      else { 
        let ex = dailyMap.get(date); 
        ex.tMax = Math.max(ex.tMax, item.main.temp_max); 
        ex.tMin = Math.min(ex.tMin, item.main.temp_min);
      }
    }); 
    const arr = [...dailyMap.values()].slice(0, days); 
    document.getElementById('dynamicWeather').innerHTML = arr.map(w => `<div class="weather-day-card"><div>${w.weather.icon === '01d' ? '☀️' : w.weather.icon === '02d' ? '⛅' : '🌧️'}</div><div>${Math.round(w.tMax)}°/${Math.round(w.tMin)}°</div><div>${w.weather.description}</div></div>`).join(''); 
  } catch(e){ 
    document.getElementById('dynamicWeather').innerHTML = '<div class="weather-day-card">☀️ Perfect weather for exploring!</div>'; 
  } 
}

async function fullRefresh() {
  document.getElementById('destName').innerHTML = globalDestination;
  document.getElementById('durationDays').innerHTML = globalDays;
  document.getElementById('dayCountValue').innerHTML = globalDays;
  document.getElementById('totalBudgetSpan').innerHTML = globalBudget.toLocaleString();
  
  allPlaces = await fetchPlacesFromGeoapify(globalDestination);
  const neededTotal = globalDays * 5;
  if(allPlaces.length < neededTotal) {
    const fallbackPool = getAttractionsForDestination(globalDestination);
    while(allPlaces.length < neededTotal) {
      allPlaces.push({ name: fallbackPool[allPlaces.length % fallbackPool.length] });
    }
  }
  
  document.getElementById('itineraryContainer').innerHTML = buildItineraryHTML();
  attachItineraryEvents();
  updateBudgetAndCostUI();
  displayWeather(globalDestination, globalDays);
  await loadMap(globalDestination);
  await updateHotelPanel(globalDestination);
  await displayNearbyAttractions();
}

function updateTimesAndRebuild() {
  userStartTime = document.getElementById('startTimeInput').value;
  userEndTime = document.getElementById('endTimeInput').value;
  fullRefresh();
}

// Initialize event listeners
document.getElementById('hotel3starOpt').addEventListener('click', () => { 
  currentHotelRate = "3star"; 
  selectedHotelPrice = 1200; 
  document.getElementById('hotel3starOpt').classList.add('selected'); 
  document.getElementById('hotel5starOpt').classList.remove('selected'); 
  updateBudgetAndCostUI(); 
  updateHotelPanel(globalDestination); 
});

document.getElementById('hotel5starOpt').addEventListener('click', () => { 
  currentHotelRate = "5star"; 
  selectedHotelPrice = 4800; 
  document.getElementById('hotel5starOpt').classList.add('selected'); 
  document.getElementById('hotel3starOpt').classList.remove('selected'); 
  updateBudgetAndCostUI(); 
  updateHotelPanel(globalDestination); 
});

document.getElementById('generateBtn').addEventListener('click', async () => {
  const input = document.getElementById('destinationInput').value;
  const daysMatch = input.match(/(\d+)\s*Days?/i); 
  if(daysMatch) globalDays = Math.min(10, parseInt(daysMatch[1]));
  const destMatch = input.match(/in\s+([a-zA-Z\s]+?)(?:\s+under|$)/i); 
  if(destMatch) globalDestination = destMatch[1].trim();
  const budgetMatch = input.match(/under\s*₹?(\d[\d,]*)/i); 
  if(budgetMatch) globalBudget = parseInt(budgetMatch[1].replace(/,/g,''));
  selectedHotelPrice = currentHotelRate === "3star" ? 1200 : 4800;
  perActivityTimeMap.clear();
  checkState.clear();
  await fullRefresh();
});

document.getElementById('addDayBtn').onclick = () => { if(globalDays < 10) { globalDays++; fullRefresh(); } };
document.getElementById('removeDayBtn').onclick = () => { if(globalDays > 1) { globalDays--; fullRefresh(); } };
document.getElementById('applyTimeBtn').onclick = () => { updateTimesAndRebuild(); };
document.getElementById('downloadBtn').onclick = () => { window.print(); };
document.getElementById('shareBtn').onclick = () => { 
  if(navigator.share) {
    navigator.share({title:"TRIPZA Travel Plan", text: `${globalDays} days in ${globalDestination} with custom itinerary!`});
  } else {
    alert("📱 Copy your trip details to share!");
  }
};

// Start the app
fullRefresh();
