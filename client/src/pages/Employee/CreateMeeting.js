import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Video, 
  Calendar, 
  Link as LinkIcon, 
  AlignLeft, 
  Users, 
  Search, 
  CheckCircle2, 
  Loader2, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { createMeetingAsUser } from '../../services/meetingService';
import { getAllEmployeesForUser as getAllEmployees } from '../../services/adminService';
import './CreateMeeting.css';

const CreateMeetingEmployee = () => {
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
        setEmployees(data || []);
      } catch (err) {
        setMsg({ type: 'error', text: 'Could not load teammates.' });
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
      return setMsg({ type: 'error', text: 'Please provide a title and time.' });
    }
    
    try {
      setMsg({ type: '', text: '' });
      setIsSubmitting(true);
      await createMeetingAsUser({ 
        title, 
        description, 
        url, 
        scheduledAt: new Date(scheduledAt), 
        participants: Array.from(selected) 
      });
      
      setMsg({ type: 'success', text: 'Meeting scheduled! Redirecting...' });
      setTimeout(() => navigate('/employee/meetings'), 1000);
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Failed to create meeting' });
      setIsSubmitting(false);
    }
  };

  const InputWrapper = ({ label, icon: Icon, children }) => (
    <div className="input-wrapper">
      <label className="input-label">
        <Icon size={14} className="input-icon" />
        {label}
      </label>
      {children}
    </div>
  );

  return (
    <div className="meeting-container">
      <div className="meeting-content">
        
        {/* Header */}
        <header className="header-section">
          <button 
            onClick={() => navigate(-1)}
            className="back-button"
          >
            <ArrowLeft size={16} /> Back to Calendar
          </button>
          <div className="header-content">
            <h1 className="page-title">
              New Session <Sparkles className="sparkle-icon" size={28} />
            </h1>
            <p className="page-subtitle">Collaborate with your team in real-time.</p>
          </div>
        </header>

        {/* Messages */}
        {msg.text && (
          <div className={`message-alert ${msg.type === 'error' ? 'alert-error' : 'alert-success'}`}>
            {msg.type === 'success' ? <CheckCircle2 size={20} /> : <Users size={20} />}
            <span>{msg.text}</span>
          </div>
        )}

        <div className="main-grid">
          
          {/* Form Area */}
          <section className="form-section">
            <div className="form-card">
              <InputWrapper label="What's the topic?" icon={Video}>
                <input 
                  type="text"
                  placeholder="e.g. Brainstorming Session" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  className="form-input title-input"
                />
              </InputWrapper>

              <div className="input-grid">
                <InputWrapper label="When?" icon={Calendar}>
                  <input 
                    type="datetime-local" 
                    value={scheduledAt} 
                    onChange={e => setScheduledAt(e.target.value)} 
                    className="form-input"
                  />
                </InputWrapper>
                
                <InputWrapper label="Join Link" icon={LinkIcon}>
                  <input 
                    placeholder="Meet / Zoom URL" 
                    value={url} 
                    onChange={e => setUrl(e.target.value)} 
                    className="form-input"
                  />
                </InputWrapper>
              </div>

              <InputWrapper label="Context / Agenda" icon={AlignLeft}>
                <textarea 
                  rows={4}
                  placeholder="Share a brief agenda..." 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  className="form-textarea"
                />
              </InputWrapper>
            </div>

            <button 
              onClick={submit} 
              disabled={isSubmitting} 
              className="submit-button"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="loader-spin" size={24} />
                  Finalizing...
                </>
              ) : (
                'Launch Meeting'
              )}
            </button>
          </section>

          {/* Teammates */}
          <aside className="teammates-section">
            <div className="teammates-card">
              <div className="teammates-header">
                <h3 className="teammates-title">Invite Teammates</h3>
                <div className="selected-badge">
                  {selected.size} ADDED
                </div>
              </div>
              
              <div className="search-wrapper">
                <Search className="search-icon" size={18} />
                <input 
                  type="text"
                  placeholder="Search name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="employees-container">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map(emp => (
                    <div 
                      key={emp._id}
                      onClick={() => toggle(emp._id)}
                      className={`employee-card ${selected.has(emp._id) ? 'selected' : ''}`}
                      role="button"
                      tabIndex={0}
                    >
                      <div className={`avatar ${selected.has(emp._id) ? 'selected' : ''}`}>
                        {emp.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="employee-details">
                        <span className="employee-name">{emp.name}</span>
                        <span className="employee-email">{emp.email}</span>
                      </div>
                      <div className="check-circle">
                        {selected.has(emp._id) && <CheckCircle2 size={14} />}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <Users size={48} className="empty-icon" />
                    <p>No teammates found</p>
                  </div>
                )}
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default CreateMeetingEmployee;
