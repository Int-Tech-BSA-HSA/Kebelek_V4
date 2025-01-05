/*import React, { useState } from "react";

function EnzymeKinetics() {
  const [substrateConcentration, setSubstrateConcentration] = useState("");
  const [maxVelocity, setMaxVelocity] = useState("");
  const [km, setKm] = useState("");
  const [reactionVelocity, setReactionVelocity] = useState(null);

  const calculateReactionVelocity = () => {
    if (substrateConcentration && maxVelocity && km) {
      // Michaelis-Menten equation: v = (Vmax * [S]) / (Km + [S])
      const v = (maxVelocity * substrateConcentration) / (km + substrateConcentration);
      setReactionVelocity(v);
    }
  };

  return (
    <div>
      <h2>Enzyme Kinetics (Michaelis-Menten Equation)</h2>
      
      <input
        type="number"
        placeholder="Substrate Concentration [S]"
        value={substrateConcentration}
        onChange={(e) => setSubstrateConcentration(e.target.value)}
      />
      
      <input
        type="number"
        placeholder="Maximum Velocity (Vmax)"
        value={maxVelocity}
        onChange={(e) => setMaxVelocity(e.target.value)}
      />
      
      <input
        type="number"
        placeholder="Michaelis Constant (Km)"
        value={km}
        onChange={(e) => setKm(e.target.value)}
      />
      
      <button onClick={calculateReactionVelocity}>Calculate Reaction Velocity</button>
      
      {reactionVelocity !== null && (
        <p>Reaction Velocity: {reactionVelocity.toFixed(2)} units/s</p>
      )}
    </div>
  );
}

export default EnzymeKinetics; */


// EnzymeKinetics.jsx
import React, { useState } from "react";
import "./EnzymeKinetics.css"; // Import the CSS file

function EnzymeKinetics() {
  const [substrateConcentration, setSubstrateConcentration] = useState("");
  const [maxVelocity, setMaxVelocity] = useState("");
  const [km, setKm] = useState("");
  const [reactionVelocity, setReactionVelocity] = useState(null);
  const [error, setError] = useState("");

  const handleInputChange = (setter) => (e) => {
    const value = e.target.value;
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value)) {
      setter(value);
      setError("");
    } else {
      setError("Please enter a valid number.");
    }
  };

  const calculateReactionVelocity = () => {
    if (
      substrateConcentration === "" ||
      maxVelocity === "" ||
      km === ""
    ) {
      setError("All fields are required.");
      setReactionVelocity(null);
      return;
    }

    const [S, Vmax, Km] = [
      parseFloat(substrateConcentration),
      parseFloat(maxVelocity),
      parseFloat(km),
    ];

    if (Km + S === 0) {
      setError("The sum of Km and [S] must be greater than zero.");
      setReactionVelocity(null);
      return;
    }

    const v = (Vmax * S) / (Km + S);
    setReactionVelocity(v.toFixed(2)); // Rounded to 2 decimal places
    setError("");
  };

  return (
    <div className="calculator-container">
      <h2>Enzyme Kinetics (Michaelis-Menten Equation)</h2>
      
      <div className="form-group">
        <label htmlFor="substrateConcentration">Substrate Concentration [S]</label>
        <input
          id="substrateConcentration"
          type="text" // Use text to handle controlled input with validation
          placeholder="Enter [S] in μM"
          value={substrateConcentration}
          onChange={handleInputChange(setSubstrateConcentration)}
        />
        <span className="unit-label">μM</span>
      </div>

      <div className="form-group">
        <label htmlFor="maxVelocity">Maximum Velocity (V<sub>max</sub>)</label>
        <input
          id="maxVelocity"
          type="text"
          placeholder="Enter Vmax in μM/s"
          value={maxVelocity}
          onChange={handleInputChange(setMaxVelocity)}
        />
        <span className="unit-label">μM/s</span>
      </div>

      <div className="form-group">
        <label htmlFor="km">Michaelis Constant (K<sub>m</sub>)</label>
        <input
          id="km"
          type="text"
          placeholder="Enter Km in μM"
          value={km}
          onChange={handleInputChange(setKm)}
        />
        <span className="unit-label">μM</span>
      </div>

      {error && <div className="error-message">{error}</div>}

      <button
        className="calculate-button"
        onClick={calculateReactionVelocity}
        disabled={
          substrateConcentration === "" ||
          maxVelocity === "" ||
          km === "" ||
          error !== ""
        }
      >
        Calculate Reaction Velocity
      </button>

      {reactionVelocity !== null && (
        <div className="result">
          Reaction Velocity (v): {reactionVelocity} μM/s
        </div>
      )}
    </div>
  );
}

export default EnzymeKinetics;
