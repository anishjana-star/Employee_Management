import api from './api';
//import './leaveService.css';

export const applyLeave = async ({ startDate, endDate, reason }) => {
  return await api('/employee/leaves', {
    method: 'POST',
    body: JSON.stringify({ startDate, endDate, reason })
  });
};

export const getMyLeaves = async () => {
  return await api('/employee/leaves');
};

export const getAllLeaves = async () => {
  return await api('/admin/leaves');
};

export const decideLeave = async (leaveId, status) => {
  return await api(`/admin/leaves/${leaveId}/decision`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  });
};
