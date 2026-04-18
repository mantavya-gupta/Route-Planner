import { useState } from 'react';
import './App.css';

const CITIES = {
  'Bhuj': { x: 80, y: 150 }, 'Gandhidham': { x: 200, y: 150 },
  'Jamnagar': { x: 100, y: 350 }, 'Rajkot': { x: 280, y: 400 },
  'Dwarka': { x: 40, y: 350 }, 'Porbandar': { x: 80, y: 500 },
  'Ahmedabad': { x: 500, y: 200 }, 'Gandhinagar': { x: 550, y: 130 },
  'Mehsana': { x: 480, y: 100 }, 'Palanpur': { x: 450, y: 40 },
  'Deesa': { x: 400, y: 30 }, 'Patan': { x: 420, y: 80 },
  'Himmatnagar': { x: 580, y: 80 }, 'Dahod': { x: 850, y: 250 },
  'Nadiad': { x: 580, y: 280 }, 'Anand': { x: 630, y: 330 },
  'Vadodara': { x: 680, y: 380 }, 'Bharuch': { x: 710, y: 480 },
  'Surat': { x: 750, y: 580 }, 'Valsad': { x: 780, y: 650 },
  'Vapi': { x: 820, y: 720 }, 'Daman': { x: 730, y: 720 },
  'Bhavnagar': { x: 400, y: 650 }, 'Diu': { x: 250, y: 750 },
  'Junagadh': { x: 250, y: 500 }, 'Somnath': { x: 240, y: 600 },
  'Morbi': { x: 300, y: 320 }, 'Surendranagar': { x: 400, y: 300 },
  'Amreli': { x: 330, y: 520 },
  'Navsari': { x: 760, y: 620 }, 'Ankleshwar': { x: 720, y: 510 },
  'Saputara': { x: 850, y: 650 },
  'Mandvi': { x: 70, y: 250 }, 'Mundra': { x: 140, y: 240 },
  'Dhordo': { x: 90, y: 50 },
  'Kevadia': { x: 780, y: 420 }, 'Godhra': { x: 680, y: 280 },
  'Chhota Udaipur': { x: 800, y: 350 },
  'Ambaji': { x: 460, y: 10 }, 'Modhera': { x: 450, y: 120 }
};

const ROAD_DETAILS = {
  'Bhuj-Ahmedabad': { dist: 330, speed: 70, name: 'NH27' },
  'Bhuj-Rajkot': { dist: 230, speed: 65, name: 'SH42' },
  'Jamnagar-Rajkot': { dist: 90, speed: 60, name: 'NH151A' },
  'Rajkot-Ahmedabad': { dist: 215, speed: 70, name: 'NH47' },
  'Rajkot-Bhavnagar': { dist: 175, speed: 65, name: 'SH' },
  'Ahmedabad-Gandhinagar': { dist: 30, speed: 50, name: 'G-Road' },
  'Ahmedabad-Vadodara': { dist: 110, speed: 90, name: 'Expressway' },
  'Ahmedabad-Bhavnagar': { dist: 170, speed: 60, name: 'NH51' },
  'Vadodara-Surat': { dist: 150, speed: 80, name: 'NH48' },
  'Surat-Vapi': { dist: 110, speed: 75, name: 'NH48' },
  'Vapi-Daman': { dist: 12, speed: 40, name: 'Coastal' },
  'Jamnagar-Dwarka': { dist: 130, speed: 55, name: 'NH947' },
  'Rajkot-Porbandar': { dist: 180, speed: 60, name: 'NH27' },
  'Porbandar-Dwarka': { dist: 100, speed: 50, name: 'Coastal SH' },
  'Bhavnagar-Diu': { dist: 200, speed: 50, name: 'Coastal Hwy' },
  'Ahmedabad-Mehsana': { dist: 75, speed: 60, name: 'SH41' },
  'Mehsana-Palanpur': { dist: 75, speed: 65, name: 'SH41' },
  'Palanpur-Deesa': { dist: 30, speed: 55, name: 'NH27' },
  'Mehsana-Patan': { dist: 50, speed: 50, name: 'SH7' },
  'Ahmedabad-Himmatnagar': { dist: 80, speed: 65, name: 'NH48' },
  'Ahmedabad-Nadiad': { dist: 55, speed: 75, name: 'NE1' },
  'Nadiad-Anand': { dist: 20, speed: 70, name: 'NE1' },
  'Anand-Vadodara': { dist: 45, speed: 75, name: 'NE1' },
  'Vadodara-Bharuch': { dist: 80, speed: 80, name: 'NH48' },
  'Bharuch-Surat': { dist: 75, speed: 80, name: 'NH48' },
  'Surat-Valsad': { dist: 95, speed: 75, name: 'NH48' },
  'Valsad-Vapi': { dist: 30, speed: 60, name: 'NH48' },
  'Bhuj-Gandhidham': { dist: 60, speed: 60, name: 'NH41' },
  'Gandhidham-Ahmedabad': { dist: 300, speed: 70, name: 'NH27' },
  'Ahmedabad-Dahod': { dist: 210, speed: 60, name: 'NH47' },
  'Rajkot-Junagadh': { dist: 100, speed: 60, name: 'NH151' },
  'Junagadh-Somnath': { dist: 90, speed: 60, name: 'NH151' },
  'Rajkot-Morbi': { dist: 65, speed: 65, name: 'NH27' },
  'Ahmedabad-Surendranagar': { dist: 120, speed: 65, name: 'NH47' },
  'Surendranagar-Rajkot': { dist: 110, speed: 65, name: 'NH47' },
  'Rajkot-Amreli': { dist: 120, speed: 60, name: 'SH' },
  'Amreli-Bhavnagar': { dist: 115, speed: 60, name: 'SH' },
  'Surat-Navsari': { dist: 40, speed: 70, name: 'NH48' },
  'Navsari-Valsad': { dist: 45, speed: 70, name: 'NH48' },
  'Bharuch-Ankleshwar': { dist: 15, speed: 60, name: 'NH48' },
  'Ankleshwar-Surat': { dist: 60, speed: 80, name: 'NH48' },
  'Navsari-Saputara': { dist: 120, speed: 45, name: 'SH' },
  'Bhuj-Mandvi': { dist: 60, speed: 60, name: 'SH' },
  'Bhuj-Mundra': { dist: 60, speed: 60, name: 'SH' },
  'Gandhidham-Mundra': { dist: 65, speed: 60, name: 'SH' },
  'Bhuj-Dhordo': { dist: 85, speed: 60, name: 'SH' },
  'Vadodara-Kevadia': { dist: 90, speed: 70, name: 'SH' },
  'Nadiad-Godhra': { dist: 85, speed: 60, name: 'SH' },
  'Godhra-Dahod': { dist: 70, speed: 60, name: 'NH47' },
  'Vadodara-Chhota Udaipur': { dist: 105, speed: 60, name: 'SH' },
  'Palanpur-Ambaji': { dist: 50, speed: 55, name: 'SH' },
  'Mehsana-Modhera': { dist: 25, speed: 55, name: 'SH' },
  'Ahmedabad-Surat': { dist: 280, speed: 120, name: 'Super Express' }
};

const ROADS = Object.keys(ROAD_DETAILS).map(pair => pair.split('-'));

export default function App() {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [optimize, setOptimize] = useState('time'); 
  const [routeData, setRouteData] = useState(null);

  const fetchRoute = async () => {
    if (!source || !destination || source === destination) return;
    try {
      const res = await fetch(`/api/route?source=${source}&destination=${destination}&optimize=${optimize}`);
      const data = await res.json();
      if (data.path) setRouteData({ ...data, optimize });
    } catch (e) { console.error(e); }
  };

  const getRoadInfo = (c1, c2) => ROAD_DETAILS[`${c1}-${c2}`] || ROAD_DETAILS[`${c2}-${c1}`];

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="header-brand">
          <h1>ROUTE PLANNER</h1>
        </div>

        <div className="section-label">ROUTE CONFIGURATION</div>
        
        <div className="input-group">
          <label>SOURCE CITY</label>
          <select value={source} onChange={e => setSource(e.target.value)}>
            <option value="">-- Select Origin --</option>
            {Object.keys(CITIES).sort().map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div className="input-group">
          <label>DESTINATION CITY</label>
          <select value={destination} onChange={e => setDestination(e.target.value)}>
            <option value="">-- Select Destination --</option>
            {Object.keys(CITIES).sort().map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div className="section-label">OPTIMIZE FOR</div>
        <div className="toggle-group">
          <button className={`toggle-btn ${optimize === 'time' ? 'active' : ''}`} onClick={() => setOptimize('time')}>
            ⚡ FASTEST
          </button>
          <button className={`toggle-btn ${optimize === 'distance' ? 'active' : ''}`} onClick={() => setOptimize('distance')}>
            📏 SHORTEST
          </button>
        </div>

        <button className="find-btn" onClick={fetchRoute} disabled={!source || !destination}>
          FIND ROUTE
        </button>

        {routeData && (
          <div className="results-container fade-in">
            <div className="section-label">ROUTE RESULTS</div>
            <div className="summary-header">
              <div className="big-stat">{routeData.totalDistance} km <span>DISTANCE</span></div>
              <div className="big-stat">{routeData.totalTime}h <span>TIME</span></div>
            </div>
            <div className="itinerary-list">
              {routeData.path.map((city, idx) => {
                if (idx === routeData.path.length - 1) return null;
                const nextCity = routeData.path[idx+1];
                const info = getRoadInfo(city, nextCity);
                return (
                  <div key={idx} className="itinerary-step">
                    <div className="step-number">{idx + 1}</div>
                    <div className="step-details">
                      <div className="step-cities">{city} ➔ {nextCity}</div>
                      {info && <div className="step-meta">{info.name} • {info.dist}km • {info.speed}km/h</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="map-area">
        <svg viewBox="-50 -100 1100 1050" preserveAspectRatio="xMidYMid meet" className="svg-map">
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {ROADS.map(([c1, c2], i) => (
            <line key={i} x1={CITIES[c1].x} y1={CITIES[c1].y} x2={CITIES[c2].x} y2={CITIES[c2].y} className="road-base" />
          ))}
          
          {routeData && routeData.path.map((city, idx) => {
            if (idx === routeData.path.length - 1) return null;
            return <line key={`a-${idx}`} x1={CITIES[city].x} y1={CITIES[city].y} x2={CITIES[routeData.path[idx+1]].x} y2={CITIES[routeData.path[idx+1]].y} className="road-active" />;
          })}
          
          {Object.entries(CITIES).map(([city, pos]) => {
             const isActive = routeData?.path.includes(city);
             return (
              <g key={city}>
                {isActive && <circle cx={pos.x} cy={pos.y} r="18" className="node-glow" />}
                <circle cx={pos.x} cy={pos.y} r={isActive ? "8" : "6"} className={isActive ? "node-active-mid" : "node-base"} />
                <text x={pos.x} y={pos.y - 20} textAnchor="middle" className={`city-label ${isActive ? 'active-label' : ''}`}>{city}</text>
              </g>
             );
          })}
        </svg>
      </div>
    </div>
  );
}