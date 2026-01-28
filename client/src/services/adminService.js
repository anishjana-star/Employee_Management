import apiRequest from './api';

/**
 * Create new employee
 */
export const createEmployee = async (employeeData) => {
  return await apiRequest('/admin/employees', {
    method: 'POST',
    body: JSON.stringify(employeeData),
  });
};

/**
 * Get all employees
 */
export const getAllEmployees = async () => {
  return await apiRequest('/admin/employees');
};

export const getAllEmployeesForUser = async () => {
  return await apiRequest('/employee/peers');
};

/**
 * Update employee salary
 */
export const updateEmployeeSalary = async (employeeId, salary) => {
  return await apiRequest(`/admin/employees/${employeeId}/salary`, {
    method: 'PUT',
    body: JSON.stringify({ salary }),
  });
};

/**
 * Update employee work hours
 */
export const updateEmployeeWorkHours = async (employeeId, workHours) => {
  return await apiRequest(`/admin/employees/${employeeId}/work-hours`, {
    method: 'PUT',
    body: JSON.stringify({ workHours }),
  });
};

/**
 * Assign task to employee
 */
export const assignTask = async (taskData) => {
  return await apiRequest('/admin/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData),
  });
};

/**
 * Get all tasks
 */
export const getAllTasks = async () => {
  return await apiRequest('/admin/tasks');
};

/**
 * Get employee time entries
 */
export const getEmployeeTimeEntries = async (employeeId, month, year) => {
  const params = new URLSearchParams();
  if (month) params.append('month', month);
  if (year) params.append('year', year);
  
  return await apiRequest(`/admin/employees/${employeeId}/time-entries?${params.toString()}`);
};

export const changeUserPassword = async (userId, password) => {
  return await apiRequest(`/admin/users/${userId}/password`, {
    method: 'PUT',
    body: JSON.stringify({ password })
  });
};
