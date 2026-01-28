import React, { useState } from 'react';
import { updateEmployeeSalary, updateEmployeeWorkHours } from '../../services/adminService';
import { formatCurrency } from '../../utils/format';
import './EmployeeCard.css';

const EmployeeCard = ({ employee, onUpdate }) => {
  const [salary, setSalary] = useState(employee.salary);
  const [workHours, setWorkHours] = useState(employee.workHours);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  const handleUpdateSalary = async () => {
    try {
      setUpdating(true);
      setError('');
      await updateEmployeeSalary(employee._id, parseFloat(salary));
      onUpdate();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateWorkHours = async () => {
    try {
      setUpdating(true);
      setError('');
      await updateEmployeeWorkHours(employee._id, parseFloat(workHours));
      onUpdate();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="employee-card">
      <div className="employee-header">
        <h3>{employee.name}</h3>
        <span className="employee-email">{employee.email}</span>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="employee-details">
        <div className="detail-group">
          <label>Salary</label>
          <div className="input-group">
            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              disabled={updating}
            />
            <button
              onClick={handleUpdateSalary}
              disabled={updating || salary === employee.salary}
              className="btn-update"
            >
              Update
            </button>
          </div>
          <span className="current-value">
            Current: {formatCurrency(employee.salary)}
          </span>
        </div>

        <div className="detail-group">
          <label>Work Hours (per day)</label>
          <div className="input-group">
            <input
              type="number"
              value={workHours}
              onChange={(e) => setWorkHours(e.target.value)}
              disabled={updating}
              step="0.5"
            />
            <button
              onClick={handleUpdateWorkHours}
              disabled={updating || workHours === employee.workHours}
              className="btn-update"
            >
              Update
            </button>
          </div>
          <span className="current-value">
            Current: {employee.workHours} hrs/day
          </span>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;
