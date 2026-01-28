import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      closeMobileMenu();
    }
  };

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-brand" onClick={closeMobileMenu}>
            CollegeReviewZ EMS
          </Link>
          
          <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
            <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`} />
            <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`} />
            <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`} />
          </button>

          <div className={`nav-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            {user && (
              <>
                <div className="nav-links">
                  {user.role === 'admin' && (
                    <>
                      <Link 
                        to="/admin/employees" 
                        className="nav-link" 
                        onClick={closeMobileMenu}
                      >
                        Employees
                      </Link>
                      <Link 
                        to="/admin/tasks" 
                        className="nav-link" 
                        onClick={closeMobileMenu}
                      >
                        Tasks
                      </Link>
                      <Link 
                        to="/admin/leaves" 
                        className="nav-link" 
                        onClick={closeMobileMenu}
                      >
                        Leaves
                      </Link>
                      <Link 
                        to="/admin/meetings" 
                        className="nav-link" 
                        onClick={closeMobileMenu}
                      >
                        Meetings
                      </Link>
                    </>
                  )}
                  {user.role === 'employee' && (
                    <>
                      <Link 
                        to="/employee/dashboard" 
                        className="nav-link" 
                        onClick={closeMobileMenu}
                      >
                        Dashboard
                      </Link>
                      <Link 
                        to="/employee/tasks" 
                        className="nav-link" 
                        onClick={closeMobileMenu}
                      >
                        My Tasks
                      </Link>
                      <Link 
                        to="/employee/leaves" 
                        className="nav-link" 
                        onClick={closeMobileMenu}
                      >
                        Leaves
                      </Link>
                      <Link 
                        to="/employee/meetings" 
                        className="nav-link" 
                        onClick={closeMobileMenu}
                      >
                        Meetings
                      </Link>
                    </>
                  )}
                </div>

                <div className="nav-right">
                  <Link 
                    to="/me/change-password" 
                    className="nav-link" 
                    onClick={closeMobileMenu}
                  >
                    Change Password
                  </Link>
                  <span className="nav-user">Welcome, {user.name}</span>
                  <button onClick={handleLogout} className="nav-link btn-logout">
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
      <main className="main-content">{children}</main>
    </div>
  );
};

export default Layout;