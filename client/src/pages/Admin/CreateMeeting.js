import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Link, AlignLeft, Users, Search, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import { createMeeting } from '../../services/meetingService';
import { getAllEmployees } from '../../services/adminService';
import './CreateMeeting.css';

const CreateMeeting = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState(new Set());
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllEmployees();
        setEmployees(data);
      } catch (err) {
        setMsg({ type: 'error', text: 'Failed to load employees' });
      }
    })();
  }, []);

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  const toggle = (id) => {
    const s = new Set(selected);
    if (s.has(id)) s.delete(id); else s.add(id);
    setSelected(s);
  };

  const submit = async () => {
    if (!title || !scheduledAt) {
      return setMsg({ type: 'error', text: 'Title and scheduled time are required' });
    }
    
    try {
      setMsg({ type: '', text: '' });
      setIsSubmitting(true);
      await createMeeting({ 
        title, 
        description, 
        url, 
        scheduledAt: new Date(scheduledAt), 
        participants: Array.from(selected) 
      });
      
      setMsg({ type: 'success', text: 'Meeting scheduled successfully! Redirecting...' });
      setTimeout(() => navigate('/admin/meetings'), 1200);
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Something went wrong' });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl">
        {/* Header */}
        <div className="header-section">
          <button 
            onClick={() => navigate(-1)}
            className="back-btn"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div>
            <h1 className="text-3xl">Schedule Meeting</h1>
            <p className="text-slate-500">Set up a new session with your team members.</p>
          </div>
        </div>

        {/* Status Messaging */}
        {msg.text && (
          <div className={`status-message ${msg.type}`}>
            {msg.type === 'success' && <CheckCircle2 size={18} />}
            <span>{msg.text}</span>
          </div>
        )}

        {/* Main Grid */}
        <div className="main-grid">
          {/* Left Column: Details */}
          <div className="form-card">
            <div className="form-field">
              <label className="form-label">
                <CheckCircle2 size={16} />
                Meeting Title
              </label>
              <input 
                placeholder="e.g. Q1 Strategy Sync" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                className="form-input"
              />
            </div>

            <div className="form-field">
              <label className="form-label">
                <Link size={16} />
                Meeting Link
              </label>
              <input 
                placeholder="https://meet.google.com/..." 
                value={url} 
                onChange={e => setUrl(e.target.value)} 
                className="form-input"
              />
            </div>

            <div className="date-grid">
              <div className="form-field">
                <label className="form-label">
                  <Calendar size={16} />
                  Scheduled Date & Time
                </label>
                <input 
                  type="datetime-local" 
                  value={scheduledAt} 
                  onChange={e => setScheduledAt(e.target.value)} 
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">
                <AlignLeft size={16} />
                Description
              </label>
              <textarea 
                rows={4}
                placeholder="What is this meeting about?" 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                className="form-textarea"
              />
            </div>
          </div>

          {/* Right Column: Participants */}
          <div className="participants-panel">
            <div className="panel-header">
              <div className="panel-title">
                <Users size={18} />
                Participants
              </div>
              <span className="participant-count">
                {selected.size} selected
              </span>
            </div>
            
            <div className="search-container">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="employee-list">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map(emp => (
                  <div 
                    key={emp._id} 
                    className={`employee-item ${selected.has(emp._id) ? 'selected' : ''}`}
                    onClick={() => toggle(emp._id)}
                  >
                    <input 
                      type="checkbox" 
                      checked={selected.has(emp._id)} 
                      onChange={() => toggle(emp._id)}
                      className="checkbox"
                    />
                    <div className="employee-info">
                      <div className="employee-name">{emp.name}</div>
                      <div className="employee-email">{emp.email}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-employees">
                  <div className="empty-icon">
                    <Users size={32} />
                  </div>
                  <p>No employees found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button 
            onClick={() => navigate(-1)}
            className="btn-cancel"
          >
            Cancel
          </button>
          <button 
            onClick={submit} 
            disabled={isSubmitting} 
            className="btn-primary"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Scheduling...
              </>
            ) : (
              'Create Meeting'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateMeeting;
