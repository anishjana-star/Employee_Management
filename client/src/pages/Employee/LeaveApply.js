import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  FileText, 
  Send, 
  ArrowLeft, 
  Info, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  CalendarDays
} from 'lucide-react';
import { applyLeave } from '../../services/leaveService';
import './LeaveApply.css';

const LeaveApply = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const navigate = useNavigate();

  // Logic to calculate days for the UI
  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 0;
  };

  const submit = async () => {
    setError(null);
    setMessage(null);

    if (!startDate || !endDate) {
      return setError('Please select both start and end dates');
    }
    if (new Date(startDate) > new Date(endDate)) {
      return setError('Start date cannot be later than end date');
    }

    try {
      setSubmitting(true);
      await applyLeave({ startDate, endDate, reason });
      setMessage('Your request has been submitted successfully!');
      
      // Reset form
      setStartDate(''); setEndDate(''); setReason('');
      
      setTimeout(() => navigate('/employee/leaves'), 1200);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="leave-apply-container">
      <div className="leave-apply-content">
        
        {/* Navigation Header */}
        <div className="nav-header">
          <button 
            onClick={() => navigate(-1)}
            className="back-btn"
          >
            <ArrowLeft size={18} /> Back to Leave History
          </button>
          <div className="page-header">
            <h1 className="header-title">Request Time Off</h1>
            <p className="header-subtitle">Submit your leave request for manager approval.</p>
          </div>
        </div>

        <div className="main-grid">
          
          {/* Main Request Form */}
          <div className="main-form-section">
            <div className="main-form-card">
              
              {/* Feedback States */}
              {message && (
                <div className="alert-message alert-success">
                  <CheckCircle2 size={20} />
                  <span>{message}</span>
                </div>
              )}
              
              {error && (
                <div className="alert-message alert-error">
                  <AlertCircle size={20} />
                  <span>{error}</span>
                </div>
              )}

              <div className="form-content">
                {/* Date Selection Row */}
                <div className="date-grid">
                  <div className="input-field-wrapper">
                    <label className="input-label">
                      <Calendar size={14} /> Start Date
                    </label>
                    <input 
                      type="date" 
                      value={startDate} 
                      onChange={e => setStartDate(e.target.value)} 
                      className="input-field date-input"
                    />
                  </div>

                  <div className="input-field-wrapper">
                    <label className="input-label">
                      <Calendar size={14} /> End Date
                    </label>
                    <input 
                      type="date" 
                      value={endDate} 
                      onChange={e => setEndDate(e.target.value)} 
                      className="input-field date-input"
                    />
                  </div>
                </div>

                {/* Reason Field */}
                <div className="input-field-wrapper">
                  <label className="input-label">
                    <FileText size={14} /> Reason for Leave
                  </label>
                  <textarea 
                    rows={4}
                    value={reason} 
                    onChange={e => setReason(e.target.value)} 
                    placeholder="Briefly describe the reason for your absence..." 
                    className="textarea-field"
                  />
                </div>

                {/* Submit Button */}
                <div className="submit-section">
                  <button 
                    onClick={submit} 
                    disabled={submitting} 
                    className="submit-btn"
                  >
                    {submitting ? (
                      <Loader2 className="loader-icon" size={20} />
                    ) : (
                      <Send size={20} />
                    )}
                    {submitting ? 'Processing Request...' : 'Submit Request'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Side Info Panel */}
          <div className="side-panel">
            <div className="summary-panel">
              <CalendarDays size={40} />
              <h3 className="summary-title">Request Summary</h3>
              <div className="summary-content">
                <div className="duration-display">
                  <span className="duration-label">Total Duration</span>
                  <span className="duration-value">{calculateDays()} Days</span>
                </div>
                <div className="info-box">
                  <Info size={18} />
                  <p>
                    Your request will be sent to your immediate supervisor for approval. You'll receive a notification once a decision is made.
                  </p>
                </div>
              </div>
            </div>

            <div className="tips-panel">
              <h4 className="tips-header">
                <Info size={16} /> Quick Tips
              </h4>
              <ul className="tips-list">
                <li className="tip-item">
                  <span className="tip-dot" />
                  Apply at least 2 days in advance.
                </li>
                <li className="tip-item">
                  <span className="tip-dot" />
                  Include a specific reason for faster approval.
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LeaveApply;
