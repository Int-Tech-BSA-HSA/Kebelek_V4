//rate = k[A]^n[B]^m

/*import React, { useState } from "react";

function RateLaws() {
  const [rate1, setRate1] = useState("");
  const [concentrationA1, setConcentrationA1] = useState("");
  const [concentrationB1, setConcentrationB1] = useState("");
  const [rate2, setRate2] = useState("");
  const [concentrationA2, setConcentrationA2] = useState("");
  const [concentrationB2, setConcentrationB2] = useState("");
  const [result, setResult] = useState(null);

  const calculateRateConstant = () => {
    if (
      rate1 &&
      concentrationA1 &&
      concentrationB1 &&
      rate2 &&
      concentrationA2 &&
      concentrationB2
    ) {
      // Using the rate law formula: (rate1/rate2) = (concentrationA1^n * concentrationB1^m) / (concentrationA2^n * concentrationB2^m)
      const rateRatio = rate1 / rate2;
      const concentrationRatio =
        (concentrationA1 * concentrationB1) / (concentrationA2 * concentrationB2);
      const k = rateRatio / concentrationRatio; // This is a simplified formula for two experiments with rate law
      setResult(k);
    }
  };

  return (
    <div>
      <h2>Rate Law and Kinetics Calculator</h2>
      <input
        type="number"
        placeholder="Rate 1"
        value={rate1}
        onChange={(e) => setRate1(e.target.value)}
      />
      <input
        type="number"
        placeholder="Concentration of A1"
        value={concentrationA1}
        onChange={(e) => setConcentrationA1(e.target.value)}
      />
      <input
        type="number"
        placeholder="Concentration of B1"
        value={concentrationB1}
        onChange={(e) => setConcentrationB1(e.target.value)}
      />
      <input
        type="number"
        placeholder="Rate 2"
        value={rate2}
        onChange={(e) => setRate2(e.target.value)}
      />
      <input
        type="number"
        placeholder="Concentration of A2"
        value={concentrationA2}
        onChange={(e) => setConcentrationA2(e.target.value)}
      />
      <input
        type="number"
        placeholder="Concentration of B2"
        value={concentrationB2}
        onChange={(e) => setConcentrationB2(e.target.value)}
      />
      <button onClick={calculateRateConstant}>Calculate Rate Constant</button>
      {result && <p>Rate Constant (k): {result}</p>}
    </div>
  );
}

export default RateLaws;  */


// RateLaws.jsx
import React, { useState } from "react";
import "./RateLaws.css"; // Import the CSS file

function RateLaws() {
  const [rate1, setRate1] = useState("");
  const [concentrationA1, setConcentrationA1] = useState("");
  const [concentrationB1, setConcentrationB1] = useState("");
  const [rate2, setRate2] = useState("");
  const [concentrationA2, setConcentrationA2] = useState("");
  const [concentrationB2, setConcentrationB2] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // Handler to ensure only numbers and decimal points are entered
  const handleInputChange = (setter) => (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setter(value);
      setError("");
    } else {
      setError("Please enter a valid number.");
    }
  };

  const calculateRateConstant = () => {
    if (
      rate1 === "" ||
      concentrationA1 === "" ||
      concentrationB1 === "" ||
      rate2 === "" ||
      concentrationA2 === "" ||
      concentrationB2 === ""
    ) {
      setError("All fields are required.");
      setResult(null);
      return;
    }

    const [r1, a1, b1, r2, a2, b2] = [
      parseFloat(rate1),
      parseFloat(concentrationA1),
      parseFloat(concentrationB1),
      parseFloat(rate2),
      parseFloat(concentrationA2),
      parseFloat(concentrationB2),
    ];

    // Prevent division by zero
    if (r2 === 0 || a2 === 0 || b2 === 0) {
      setError("Rate 2 and concentrations A₂ & B₂ must be greater than zero.");
      setResult(null);
      return;
    }

    // Calculate rate constant using the simplified formula
    const rateRatio = r1 / r2;
    const concentrationRatio = (a1 * b1) / (a2 * b2);
    const k = rateRatio / concentrationRatio;

    setResult(k.toFixed(4)); // Rounded to 4 decimal places
    setError("");
  };

  return (
    <div className="calculator-container">
      <h2>Rate Law and Kinetics Calculator</h2>

      <div className="form-group">
        <label htmlFor="rate1">Rate 1 (r₁)</label>
        <input
          id="rate1"
          type="text" // Use text to handle controlled input with validation
          placeholder="Enter Rate 1"
          value={rate1}
          onChange={handleInputChange(setRate1)}
        />
        <span className="unit-label">units/s</span>
      </div>

      <div className="form-group">
        <label htmlFor="concentrationA1">Concentration of A₁</label>
        <input
          id="concentrationA1"
          type="text"
          placeholder="Enter [A₁] in μM"
          value={concentrationA1}
          onChange={handleInputChange(setConcentrationA1)}
        />
        <span className="unit-label">μM</span>
      </div>

      <div className="form-group">
        <label htmlFor="concentrationB1">Concentration of B₁</label>
        <input
          id="concentrationB1"
          type="text"
          placeholder="Enter [B₁] in μM"
          value={concentrationB1}
          onChange={handleInputChange(setConcentrationB1)}
        />
        <span className="unit-label">μM</span>
      </div>

      <div className="form-group">
        <label htmlFor="rate2">Rate 2 (r₂)</label>
        <input
          id="rate2"
          type="text"
          placeholder="Enter Rate 2"
          value={rate2}
          onChange={handleInputChange(setRate2)}
        />
        <span className="unit-label">units/s</span>
      </div>

      <div className="form-group">
        <label htmlFor="concentrationA2">Concentration of A₂</label>
        <input
          id="concentrationA2"
          type="text"
          placeholder="Enter [A₂] in μM"
          value={concentrationA2}
          onChange={handleInputChange(setConcentrationA2)}
        />
        <span className="unit-label">μM</span>
      </div>

      <div className="form-group">
        <label htmlFor="concentrationB2">Concentration of B₂</label>
        <input
          id="concentrationB2"
          type="text"
          placeholder="Enter [B₂] in μM"
          value={concentrationB2}
          onChange={handleInputChange(setConcentrationB2)}
        />
        <span className="unit-label">μM</span>
      </div>

      {error && <div className="error-message">{error}</div>}

      <button
        className="calculate-button"
        onClick={calculateRateConstant}
        disabled={
          rate1 === "" ||
          concentrationA1 === "" ||
          concentrationB1 === "" ||
          rate2 === "" ||
          concentrationA2 === "" ||
          concentrationB2 === "" ||
          error !== ""
        }
      >
        Calculate Rate Constant
      </button>

      {result && (
        <div className="result">
          Rate Constant (k): {result} units<sup>-1</sup> s<sup>-1</sup>
        </div>
      )}
    </div>
  );
}

export default RateLaws;


