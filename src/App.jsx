import { useState } from 'react';
import './App.css';

const CITIES = {
  'Jamnagar': { x: 100, y: 350 }, 'Rajkot': { x: 280, y: 400 },
  'Ahmedabad': { x: 500, y: 200 }, 'Gandhinagar': { x: 550, y: 130 },
  'Vadodara': { x: 680, y: 380 }, 'Surat': { x: 750, y: 580 }, 
  'Bhavnagar': { x: 400, y: 650 }, 'Vapi': { x: 820, y: 720 },
  'Daman': { x: 730, y: 720 }, 'Bhuj': { x: 80, y: 150 }
};

const ROAD_DETAILS = {
  'Rajkot-Ahmedabad': { dist: 215, speed: 70, name: 'NH47' },
  'Rajkot-Jamnagar': { dist: 90, speed: 60, name: 'NH151A' },
  'Rajkot-Bhavnagar': { dist: 175, speed: 65, name: 'State Hwy' },
  'Ahmedabad-Vadodara': { dist: 110, speed: 90, name: 'Expressway' },
  'Vadodara-Surat': { dist: 150, speed: 80, name: 'NH48' },
  'Ahmedabad-Bhavnagar': { dist: 170, speed: 60, name: 'NH51' },
  'Ahmedabad-Gandhinagar': { dist: 30, speed: 50, name: 'G-Road' },
  'Surat-Vapi': { dist: 110, speed: 75, name: 'NH48' },
  'Vapi-Daman': { dist: 12, speed: 40, name: 'Coastal Rd' },
  'Bhuj-Rajkot': { dist: 230, speed: 65, name: 'SH42' },
  'Bhuj-Ahmedabad': { dist: 330, speed: 70, name: 'NH27' }
};

const ROADS = Object.keys(ROAD_DETAILS).map(pair => pair.split('-'));

export default function App() {
  // SET TO EMPTY STRINGS FOR NO PRE-SELECTION
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
          {/* REMOVED "SMART" FROM HEADING */}
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
        <svg viewBox="0 0 1000 850" className="svg-map">
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