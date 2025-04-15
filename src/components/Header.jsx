import React, { useContext } from 'react';
import { FaPlus, FaDownload, FaUpload, FaSignOutAlt } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const Header = ({ onAddClick, onExport, onImport }) => {
  const { user, logout } = useContext(AuthContext);

  const handleImportClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = onImport;
    input.click();
  };

  return (
    <header className="header">
      <h1>Habit Tracker</h1>
      <div className="header-actions">
        {user && (
          <>
            <button className="btn" onClick={onExport}>
              <FaDownload /> Export
            </button>
            <button className="btn" onClick={handleImportClick}>
              <FaUpload /> Import
            </button>
            <button className="btn" onClick={onAddClick}>
              <FaPlus /> Add Habit
            </button>
            <div className="user-info">
              <span>Welcome, {user.name}!</span>
              <button className="btn btn-logout" onClick={logout}>
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
