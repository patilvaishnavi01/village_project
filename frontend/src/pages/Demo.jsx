import { useState } from "react";
import Autocomplete from "../components/Autocomplete";

function Demo() {
  const [address, setAddress] = useState({});

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "sans-serif"
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "12px",
          width: "400px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Contact Form</h2>

        <input placeholder="Name" style={inputStyle} />
        <input placeholder="Email" style={inputStyle} />
        <input placeholder="Phone" style={inputStyle} />

        <h4 style={{ marginTop: "10px" }}>Search Address</h4>
        <Autocomplete onSelect={(data) => setAddress(data)} />

        <div style={{ marginTop: "15px", fontSize: "14px", color: "#555" }}>
          <p><b>Village:</b> {address?.hierarchy?.village}</p>
          <p><b>District:</b> {address?.hierarchy?.district}</p>
          <p><b>State:</b> {address?.hierarchy?.state}</p>
        </div>

        <button style={buttonStyle}>Submit</button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  outline: "none"
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "10px",
  background: "#4f46e5",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};

export default Demo;