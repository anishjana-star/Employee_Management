import React, { useState, useEffect } from 'react';
import { getDashboard, recordLoginTime, recordLogoutTime } from '../../services/employeeService';
import { formatCurrency, formatHours } from '../../utils/format';
import { formatDate, formatTime } from '../../utils/format';
import './EmployeeDashboard.css';

const EmployeeDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [clocking, setClocking] = useState(false);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [showSalary, setShowSalary] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false); // 🆕 Controls modal visibility
  const [salaryPassword, setSalaryPassword] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await getDashboard();
      setDashboardData(data);
      if (data && data.activeEntry && !data.activeEntry.logoutTime) {
        setIsClockedIn(true);
      } else {
        setIsClockedIn(false);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClockIn = async () => {
    try {
      setClocking(true);
      setError('');
      await recordLoginTime();
      setIsClockedIn(true);
      loadDashboard();
    } catch (err) {
      setError(err.message);
    } finally {
      setClocking(false);
    }
  };

  const handleClockOut = async () => {
    try {
      setClocking(true);
      setError('');
      await recordLogoutTime();
      setIsClockedIn(false);
      loadDashboard();
    } catch (err) {
      setError(err.message);
    } finally {
      setClocking(false);
    }
  };

  // 🆕 Show password modal when eye icon clicked
  const handleRevealSalary = () => {
    setShowPasswordModal(true);
  };

  // 🆕 Hide salary when eye hide icon clicked
  const handleHideSalary = () => {
    setShowSalary(false);
  };

  // 🆕 Salary password verification
  const handleSalaryPasswordSubmit = (e) => {
    e.preventDefault();
    const correctPassword = '123'; // Demo password
    if (salaryPassword === correctPassword) {
      setShowSalary(true);
      setShowPasswordModal(false);
      setSalaryPassword('');
      setError('');
    } else {
      setError('❌ Incorrect password');
      setSalaryPassword('');
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (!dashboardData) {
    return <div className="error-message">Failed to load dashboard data</div>;
  }

  const { employee, monthlyStats, tasks } = dashboardData;

  return (
    <div className="employee-dashboard">
      <h1>Employee Dashboard</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-grid">
        <div className="dashboard-card info-card">
          <h2>Personal Information</h2>
          <div className="info-item">
            <span className="info-label">Name:</span>
            <span className="info-value">{employee.name}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Email:</span>
            <span className="info-value">{employee.email}</span>
          </div>
          <div className="info-item salary-item">
            <span className="info-label">Salary:</span>
            {showSalary ? (
              <div className="salary-revealed">
                <span className="info-value salary-value">
                  {formatCurrency(employee.salary)}
                </span>
                <button 
                  className="salary-eye-btn hide"
                  onClick={handleHideSalary}
                  aria-label="Hide salary"
                  title="Hide Salary"
                >
                  👁️
                </button>
              </div>
            ) : (
              <button 
                className="salary-eye-btn reveal"
                onClick={handleRevealSalary}
                aria-label="Reveal salary"
                title="Reveal Salary"
              >
                👁️ Reveal Salary
              </button>
            )}
          </div>
          <div className="info-item">
            <span className="info-label">Work Hours/Day:</span>
            <span className="info-value">{employee.workHours} hrs</span>
          </div>
        </div>

        <div className="dashboard-card clock-card">
          <h2>Time Tracking</h2>
          <div className="clock-status">
            {isClockedIn ? (
              <div className="clocked-in">
                <p className="status-text">You are currently clocked in</p>
                <button
                  onClick={handleClockOut}
                  disabled={clocking}
                  className="btn-clock-out"
                >
                  {clocking ? 'Clocking out...' : 'Clock Out'}
                </button>
              </div>
            ) : (
              <div className="clocked-out">
                <p className="status-text">You are currently clocked out</p>
                <button
                  onClick={handleClockIn}
                  disabled={clocking}
                  className="btn-clock-in"
                >
                  {clocking ? 'Clocking in...' : 'Clock In'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-card stats-card">
          <h2>Monthly Statistics</h2>
          <div className="stat-item">
            <span className="stat-label">Total Hours Worked:</span>
            <span className="stat-value">{formatHours(monthlyStats.totalHours)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Days Worked:</span>
            <span className="stat-value">{monthlyStats.daysWorked} days</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Month:</span>
            <span className="stat-value">
              {new Date(monthlyStats.currentYear, monthlyStats.currentMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>

        <div className="dashboard-card tasks-card">
          <h2>Recent Tasks</h2>
          {tasks && tasks.length > 0 ? (
            <ul className="tasks-list">
              {tasks.slice(0, 5).map((task) => (
                <li key={task._id} className="task-item">
                  <div className="task-title">{task.title}</div>
                  <div className="task-meta">
                    <span className={`task-status status-₹{task.status}`}>
                      {task.status}
                    </span>
                    {task.dueDate && (
                      <span className="task-due">
                        Due: {formatDate(task.dueDate)}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-tasks">No tasks assigned</p>
          )}
        </div>
      </div>

      {/* 🆕 FIXED: Salary Password Modal - Shows ONLY when eye clicked */}
      {showPasswordModal && (
        <div className="salary-password-modal">
          <div className="salary-password-content">
            <h3>🔒 Salary Verification</h3>
            <p>Enter password to reveal salary</p>
            <form onSubmit={handleSalaryPasswordSubmit}>
              <input
                type="password"
                value={salaryPassword}
                onChange={(e) => setSalaryPassword(e.target.value)}
                placeholder="Enter password"
                className="salary-password-input"
                autoFocus
              />
              <div className="salary-password-actions">
                <button type="submit" className="btn-salary-submit">
                  Reveal Salary
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowPasswordModal(false);
                    setSalaryPassword('');
                  }}
                  className="btn-salary-cancel"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
