import React, { useState, useEffect } from 'react';
import { getAllEmployees } from '../../services/adminService';
import EmployeeCard from './EmployeeCard';
import CreateEmployeeModal from './CreateEmployeeModal';
import './EmployeeList.css';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await getAllEmployees();
      setEmployees(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeCreated = () => {
    setShowModal(false);
    loadEmployees();
  };

  if (loading) {
    return <div className="loading">Loading employees...</div>;
  }

  return (
    <div className="employee-list">
      <div className="page-header">
        <h1>Employee Management</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          Add Employee
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="employee-grid">
        {employees.map((employee) => (
          <EmployeeCard
            key={employee._id}
            employee={employee}
            onUpdate={loadEmployees}
          />
        ))}
      </div>

      {showModal && (
        <CreateEmployeeModal
          onClose={() => setShowModal(false)}
          onSuccess={handleEmployeeCreated}
        />
      )}
    </div>
  );
};

export default EmployeeList;
