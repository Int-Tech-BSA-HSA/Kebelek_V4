/* import React, { useState } from "react";

function Stoichiometry() {
  const [molesReactant, setMolesReactant] = useState("");
  const [stoichiometricRatio, setStoichiometricRatio] = useState("");
  const [result, setResult] = useState(null);

  const calculateTheoreticalYield = () => {  
    if (molesReactant && stoichiometricRatio) {
      const theoreticalYield = molesReactant * stoichiometricRatio;  
      setResult(theoreticalYield);
    }
  };

  return (
    <div>
      <h2>Stoichiometry Calculator</h2>
      <input
        type="number"
        placeholder="Moles of Reactant"
        value={molesReactant}
        onChange={(e) => setMolesReactant(e.target.value)}
      />
      <input
        type="number"
        placeholder="Stoichiometric Ratio"
        value={stoichiometricRatio}
        onChange={(e) => setStoichiometricRatio(e.target.value)}
      />
      <button onClick={calculateTheoreticalYield}>Calculate Theoretical Yield</button>
      {result && <p>Theoretical Yield: {result} moles</p>}
    </div>
  );
}

export default Stoichiometry;  */

// Stoichiometry.jsx
import React, { useState } from "react";
import "./Stoichiometry.css"; // Import the CSS file

function Stoichiometry() {
  const [molesReactant, setMolesReactant] = useState("");
  const [stoichiometricRatio, setStoichiometricRatio] = useState("");
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

  const calculateTheoreticalYield = () => {
    if (molesReactant === "" || stoichiometricRatio === "") {
      setError("All fields are required.");
      setResult(null);
      return;
    }

    const [moles, ratio] = [parseFloat(molesReactant), parseFloat(stoichiometricRatio)];

    if (isNaN(moles) || isNaN(ratio)) {
      setError("Please enter valid numbers.");
      setResult(null);
      return;
    }

    const theoreticalYield = moles * ratio;
    setResult(theoreticalYield.toFixed(4)); // Rounded to 4 decimal places
    setError("");
  };

  return (
    <div className="calculator-container">
      <h2>Stoichiometry Calculator</h2>

      <div className="form-group">
        <label htmlFor="molesReactant">Moles of Reactant</label>
        <input
          id="molesReactant"
          type="text" // Use text to handle controlled input with validation
          placeholder="Enter moles of reactant"
          value={molesReactant}
          onChange={handleInputChange(setMolesReactant)}
        />
        <span className="unit-label">mol</span>
      </div>

      <div className="form-group">
        <label htmlFor="stoichiometricRatio">Stoichiometric Ratio</label>
        <input
          id="stoichiometricRatio"
          type="text"
          placeholder="Enter stoichiometric ratio"
          value={stoichiometricRatio}
          onChange={handleInputChange(setStoichiometricRatio)}
        />
        <span className="unit-label">mol/mol</span>
      </div>

      {error && <div className="error-message">{error}</div>}

      <button
        className="calculate-button"
        onClick={calculateTheoreticalYield}
        disabled={
          molesReactant === "" ||
          stoichiometricRatio === "" ||
          error !== ""
        }
      >
        Calculate Theoretical Yield
      </button>

      {result && (
        <div className="result">
          Theoretical Yield: {result} mol
        </div>
      )}
    </div>
  );
}

export default Stoichiometry;
