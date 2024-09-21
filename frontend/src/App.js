import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [altitude, setAltitude] = useState('');
  const [his, setHis] = useState('');
  const [adi, setAdi] = useState('');
  const [latestMetric, setLatestMetric] = useState(null);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false); // For "+" button form
  const [showText, setShowText] = useState(false); // For "TEXT" button
  const [showVisual, setShowVisual] = useState(false); // For "VISUAL" button

  const API_URL = "http://localhost:5038/api/metrics";

  const fetchLatestMetric = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      if (data.length > 0) {
        setLatestMetric(data[data.length - 1]); // Get the most recent metric (all data saved in MongoDB)
      } else {
        setLatestMetric(null); // No data saved yet
      }
    } catch (err) {
      console.error("Error fetching metrics:", err);
    }
  };

  useEffect(() => {
    fetchLatestMetric(); // Fetch latest metric on component load
  }, []);

  const handleSubmit = async () => {
    setError(''); // Clear previous errors
    const data = { altitude: parseInt(altitude), his: parseInt(his), adi: parseInt(adi) };

    // Validate before sending to the server
    if (isNaN(data.altitude) || isNaN(data.his) || isNaN(data.adi)) {
      setError('Please enter valid numbers.');
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        setAltitude('');
        setHis('');
        setAdi('');
        fetchLatestMetric(); // Fetch the latest metric after adding new data
      } else {
        setError(result.message || 'An error occurred.');
      }
    } catch (error) {
      console.error("Error saving metrics:", error);
      setError('An error occurred while saving the metrics.');
    }
  };

  const renderVisual = () => {
    const heightPercentage = ((latestMetric?.altitude / 3000) * 100 || 0) + 6; 
  
    // Determine horizon circle color based on ADI value
    let horizonColor;
    if (latestMetric?.adi === 100) {
      horizonColor = 'blue'; // Full blue
    } else if (latestMetric?.adi === -100) {
      horizonColor = 'green'; // Full green
    } else if (latestMetric?.adi === 0) {
      horizonColor = 'linear-gradient(to bottom, blue 50%, green 50%)'; // Half blue, half green
    } else if (latestMetric?.adi > 0) {
      const bluePercentage = (latestMetric.adi)/2 + 50; // Calculate between -100 to 100
      const greenPercentage = 100 - bluePercentage;
      horizonColor = `linear-gradient(to bottom, blue ${bluePercentage}%, green ${greenPercentage}%)`;
    } else { // ADI <= 0
      const greenPercentage = (-latestMetric.adi)/2 + 50; // Calculate between -100 to 100
      const bluePercentage = 100 - greenPercentage;
      horizonColor = `linear-gradient(to bottom, blue ${bluePercentage}%, green ${greenPercentage}%)`;
    }
  
    return (
      <div className="visual-section">
        <div className="guide">
          <div className="guide-marker" style={{ top: `${100 - heightPercentage}%` }}>
            <div className="black-line"></div>
            <span>{latestMetric?.altitude}</span>
          </div>
          <div className="guide-labels">
            <span className="label-0">0</span>
            <span className="label-1000">1000</span>
            <span className="label-2000">2000</span>
            <span className="label-3000">3000</span>
          </div>
        </div>
        <div className="compass-section" >
          <div className="compass" style={{transform: `rotate(${-latestMetric.his}deg)`}}>
            {/* Degree labels */}
            <div className="degree-label degree-0">0</div>
            <div className="degree-label degree-90">90</div>
            <div className="degree-label degree-180">180</div>
            <div className="degree-label degree-270">270</div>
          </div>
          <div className="compass-arrow-shaft"></div>
          <div className="compass-arrowhead"></div>
        </div>
        <div className="horizon-section">
          <div className="horizon-circle" style={{ background: horizonColor }}>
            {/* Horizon circle without an arrow */}
          </div>
        </div>
      </div>
    );
  };
  

  return (
    <div className="App">
      <h1>Dashboard Pilot Project</h1>

      {/* Buttons Section */}
      <div className="button-section">
        <button onClick={() => { setShowForm(false); setShowText(true); setShowVisual(false); }}>TEXT</button>
        <button onClick={() => { setShowForm(false); setShowText(false); setShowVisual(true); }}>VISUAL</button>
        <button onClick={() => { setShowForm(true); setShowText(false); setShowVisual(false); }}>+</button>
      </div>

      {/* Form Section */}
      {showForm && (
        <div className="input-section">
          <div>
            <label>Altitude: </label>
            <input
              type="number"
              value={altitude}
              onChange={(e) => setAltitude(e.target.value)}
              placeholder="0 - 3000"
            />
          </div>
          <div>
            <label>HIS: </label>
            <input
              type="number"
              value={his}
              onChange={(e) => setHis(e.target.value)}
              placeholder="0 - 360"
            />
          </div>
          <div>
            <label>ADI: </label>
            <input
              type="number"
              value={adi}
              onChange={(e) => setAdi(e.target.value)}
              placeholder="-100 to 100"
            />
          </div>
          <button onClick={handleSubmit}>Submit</button>
          {error && <p className="error">{error}</p>}
        </div>
      )}

      {/* Text Section */}
      {showText && latestMetric && (
        <div className="metrics-display">
        <div className="metric-item">
          <strong>Altitude:</strong>
          <div>{latestMetric.altitude}</div>
        </div>
        <div className="metric-item">
          <strong>HIS:</strong>
          <div>{latestMetric.his}</div>
        </div>
        <div className="metric-item">
          <strong>ADI:</strong>
          <div>{latestMetric.adi}</div>
        </div>
      </div>
      )}

      {/* Visual Section */}
      {showVisual && latestMetric && renderVisual()}
    </div>
  );
}

export default App;
