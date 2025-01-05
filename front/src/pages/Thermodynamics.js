//ΔG=ΔH−TΔS

/*import React, { useState } from "react";

function Thermodynamics() {
  const [deltaH, setDeltaH] = useState("");
  const [deltaS, setDeltaS] = useState("");
  const [temperature, setTemperature] = useState("");
  const [result, setResult] = useState(null);

  const calculateGibbsFreeEnergy = () => {
    if (deltaH && deltaS && temperature) {
      const deltaG = deltaH - temperature * deltaS;
      setResult(deltaG);
    }
  };

  return (
    <div>
      <h2>Gibbs Free Energy Calculator</h2>
      <input
        type="number"
        placeholder="ΔH (Enthalpy in J/mol)"
        value={deltaH}
        onChange={(e) => setDeltaH(e.target.value)}
      />
      <input
        type="number"
        placeholder="ΔS (Entropy in J/mol·K)"
        value={deltaS}
        onChange={(e) => setDeltaS(e.target.value)}
      />
      <input
        type="number"
        placeholder="Temperature (K)"
        value={temperature}
        onChange={(e) => setTemperature(e.target.value)}
      />
      <button onClick={calculateGibbsFreeEnergy}>Calculate</button>
      {result && <p>Gibbs Free Energy (ΔG): {result} J/mol</p>}
    </div>
  );
}
 
export default Thermodynamics;    */

// Thermodynamics.jsx
import React, { useState } from "react";
import "./Thermodynamics.css"; // Import the CSS file

function Thermodynamics() {
  const [deltaH, setDeltaH] = useState("");
  const [deltaS, setDeltaS] = useState("");
  const [temperature, setTemperature] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // Handler to ensure only numbers and decimal points are entered
  const handleInputChange = (setter) => (e) => {
    const value = e.target.value;
    // Allow negative numbers, decimals, and ensure only valid numerical inputs
    if (/^-?\d*\.?\d*$/.test(value)) {
      setter(value);
      setError("");
    } else {
      setError("Please enter a valid number.");
    }
  };

  const calculateGibbsFreeEnergy = () => {
    if (deltaH === "" || deltaS === "" || temperature === "") {
      setError("All fields are required.");
      setResult(null);
      return;
    }

    const [h, s, t] = [
      parseFloat(deltaH),
      parseFloat(deltaS),
      parseFloat(temperature),
    ];

    if (isNaN(h) || isNaN(s) || isNaN(t)) {
      setError("Please enter valid numbers.");
      setResult(null);
      return;
    }

    const gibbsFreeEnergy = h - t * s;
    setResult(gibbsFreeEnergy.toFixed(4)); // Rounded to 4 decimal places
    setError("");
  };

  return (
    <div className="calculator-container">
      <h2>Gibbs Free Energy Calculator</h2>

      <div className="form-group">
        <label htmlFor="deltaH">ΔH (Enthalpy)</label>
        <input
          id="deltaH"
          type="text" // Use text to handle controlled input with validation
          placeholder="Enter ΔH in J/mol"
          value={deltaH}
          onChange={handleInputChange(setDeltaH)}
        />
        <span className="unit-label">J/mol</span>
      </div>

      <div className="form-group">
        <label htmlFor="deltaS">ΔS (Entropy)</label>
        <input
          id="deltaS"
          type="text"
          placeholder="Enter ΔS in J/mol·K"
          value={deltaS}
          onChange={handleInputChange(setDeltaS)}
        />
        <span className="unit-label">J/mol·K</span>
      </div>

      <div className="form-group">
        <label htmlFor="temperature">Temperature (T)</label>
        <input
          id="temperature"
          type="text"
          placeholder="Enter Temperature in K"
          value={temperature}
          onChange={handleInputChange(setTemperature)}
        />
        <span className="unit-label">K</span>
      </div>

      {error && <div className="error-message">{error}</div>}

      <button
        className="calculate-button"
        onClick={calculateGibbsFreeEnergy}
        disabled={
          deltaH === "" ||
          deltaS === "" ||
          temperature === "" ||
          error !== ""
        }
      >
        Calculate ΔG
      </button>

      {result !== null && (
        <div className="result">
          Gibbs Free Energy (ΔG): {result} J/mol
        </div>
      )}
    </div>
  );
}

export default Thermodynamics;

