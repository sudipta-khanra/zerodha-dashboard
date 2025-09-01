import React from "react";
import { FaCalculator, FaChartLine, FaCalendarAlt, FaEnvelope } from "react-icons/fa";

const appsList = [
  { name: "Calculator", icon: <FaCalculator />, description: "Perform calculations quickly." },
  { name: "Analytics", icon: <FaChartLine />, description: "View stock analytics and charts." },
  { name: "Calendar", icon: <FaCalendarAlt />, description: "Manage your trading schedule." },
  { name: "Mail", icon: <FaEnvelope />, description: "Send and receive notifications." },
];

const Apps = () => {
  const styles = {
    container: {
      padding: "20px",
      fontFamily: "Arial, sans-serif",
    },
    heading: {
      marginBottom: "10px",
    },
    subtitle: {
      marginBottom: "20px",
      color: "#555",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      gap: "20px",
    },
    card: {
      backgroundColor: "#f0f2f5",
      padding: "20px",
      borderRadius: "12px",
      textAlign: "center",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      transition: "transform 0.2s ease, boxShadow 0.2s ease",
      cursor: "pointer",
    },
    cardHover: {
      transform: "translateY(-5px)",
      boxShadow: "0 8px 12px rgba(0,0,0,0.15)",
    },
    icon: {
      fontSize: "36px",
      color: "#007bff",
      marginBottom: "10px",
    },
    cardTitle: {
      margin: "10px 0",
    },
    cardDesc: {
      fontSize: "14px",
      color: "#555",
      marginBottom: "15px",
    },
    button: {
      padding: "8px 16px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "background-color 0.2s ease",
    },
    buttonHover: {
      backgroundColor: "#0056b3",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Apps Dashboard</h1>
      <p style={styles.subtitle}>Access all your tools and apps from here:</p>
      <div style={styles.grid}>
        {appsList.map((app, index) => (
          <div
            key={index}
            style={styles.card}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0px)")}
          >
            <div style={styles.icon}>{app.icon}</div>
            <h3 style={styles.cardTitle}>{app.name}</h3>
            <p style={styles.cardDesc}>{app.description}</p>
            <button
              style={styles.button}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
            >
              Open
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Apps;
