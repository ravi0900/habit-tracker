import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

export default function NotFound() {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div
      className={darkMode ? "dark-mode" : ""}
      style={{
        textAlign: "center",
        marginTop: 100,
        background: 'var(--bg-color)',
        color: 'var(--text-color)',
        borderRadius: 16,
        boxShadow: darkMode
          ? '0 4px 32px rgba(0,0,0,0.4)'
          : '0 4px 32px rgba(68,102,238,0.08)',
        padding: 40,
        maxWidth: 480,
        marginLeft: 'auto',
        marginRight: 'auto',
        transition: 'background 0.3s, color 0.3s'
      }}
    >
      <h1 style={{ fontSize: 64, color: darkMode ? '#00f2fe' : '#4facfe', marginBottom: 0 }}>404</h1>
      <h2 style={{ marginTop: 0 }}>Page Not Found</h2>
      <p style={{ color: darkMode ? '#9ca3af' : '#888', margin: '24px 0' }}>
        Oops! The page you are looking for does not exist.<br />
        It might have been moved or deleted.
      </p>
      <Link
        to="/"
        style={{
          display: 'inline-block',
          padding: '12px 32px',
          background: darkMode ? '#00f2fe' : '#4facfe',
          color: darkMode ? '#23272f' : '#fff',
          borderRadius: 8,
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: 18,
          boxShadow: darkMode
            ? '0 2px 8px rgba(0,242,254,0.08)'
            : '0 2px 8px rgba(68,102,238,0.12)'
        }}
      >
        ← Back to Dashboard
      </Link>
    </div>
  );
}
