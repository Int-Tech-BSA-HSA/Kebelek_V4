/*import React, { useState } from "react";

function ChemicalEquilibrium() {
  const [concentrationA, setConcentrationA] = useState("");
  const [concentrationB, setConcentrationB] = useState("");
  const [concentrationC, setConcentrationC] = useState("");
  const [concentrationD, setConcentrationD] = useState("");
  const [result, setResult] = useState(null);

  const calculateEquilibriumConstant = () => {
    if (
      concentrationA &&
      concentrationB &&
      concentrationC &&
      concentrationD
    ) {
      const K_eq =
        (concentrationC * concentrationD) / (concentrationA * concentrationB);
      setResult(K_eq);
    }
  };

  return (
    <div>
      <h2>Chemical Equilibrium Calculator</h2>
      <input
        type="number"
        placeholder="Concentration of A"
        value={concentrationA}
        onChange={(e) => setConcentrationA(e.target.value)}
      />
      <input
        type="number"
        placeholder="Concentration of B"
        value={concentrationB}
        onChange={(e) => setConcentrationB(e.target.value)}
      />
      <input
        type="number"
        placeholder="Concentration of C"
        value={concentrationC}
        onChange={(e) => setConcentrationC(e.target.value)}
      />
      <input
        type="number"
        placeholder="Concentration of D"
        value={concentrationD}
        onChange={(e) => setConcentrationD(e.target.value)}
      />
      <button onClick={calculateEquilibriumConstant}>Calculate</button>
      {result && <p>Equilibrium Constant (K): {result}</p>}
    </div>
  );
}

export default ChemicalEquilibrium; */

// ChemicalEquilibrium.jsx
import React, { useState } from "react";
import "./ChemicalEquilibrium.css"; // Import the CSS file

function ChemicalEquilibrium() {
  const [concentrationA, setConcentrationA] = useState("");
  const [concentrationB, setConcentrationB] = useState("");
  const [concentrationC, setConcentrationC] = useState("");
  const [concentrationD, setConcentrationD] = useState("");
  const [result, setResult] = useState(null);
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

  const calculateEquilibriumConstant = () => {
    if (
      concentrationA === "" ||
      concentrationB === "" ||
      concentrationC === "" ||
      concentrationD === ""
    ) {
      setError("All fields are required.");
      setResult(null);
      return;
    }

    const a = parseFloat(concentrationA);
    const b = parseFloat(concentrationB);
    const c = parseFloat(concentrationC);
    const d = parseFloat(concentrationD);

    if (a === 0 || b === 0) {
      setError("Concentrations of A and B must be greater than zero.");
      setResult(null);
      return;
    }

    const K_eq = (c * d) / (a * b);
    setResult(K_eq.toFixed(4)); // Rounded to 4 decimal places
    setError("");
  };

  return (
    <div className="calculator-container">
      <h2>Chemical Equilibrium Calculator</h2>
      
      <div className="form-group">
        <label htmlFor="concentrationA">Concentration of A</label>
        <input
          id="concentrationA"
          type="text" // Use text to handle controlled input with validation
          placeholder="Enter concentration of A"
          value={concentrationA}
          onChange={handleInputChange(setConcentrationA)}
        />
        <span className="unit-label">mol/L</span>
      </div>

      <div className="form-group">
        <label htmlFor="concentrationB">Concentration of B</label>
        <input
          id="concentrationB"
          type="text"
          placeholder="Enter concentration of B"
          value={concentrationB}
          onChange={handleInputChange(setConcentrationB)}
        />
        <span className="unit-label">mol/L</span>
      </div>

      <div className="form-group">
        <label htmlFor="concentrationC">Concentration of C</label>
        <input
          id="concentrationC"
          type="text"
          placeholder="Enter concentration of C"
          value={concentrationC}
          onChange={handleInputChange(setConcentrationC)}
        />
        <span className="unit-label">mol/L</span>
      </div>

      <div className="form-group">
        <label htmlFor="concentrationD">Concentration of D</label>
        <input
          id="concentrationD"
          type="text"
          placeholder="Enter concentration of D"
          value={concentrationD}
          onChange={handleInputChange(setConcentrationD)}
        />
        <span className="unit-label">mol/L</span>
      </div>

      {error && <div className="error-message">{error}</div>}

      <button className="calculate-button" onClick={calculateEquilibriumConstant}>
        Calculate
      </button>

      {result && (
        <div className="result">
          Equilibrium Constant (K<sub>eq</sub>): {result}
        </div>
      )}
    </div>
  );
}

export default ChemicalEquilibrium;



