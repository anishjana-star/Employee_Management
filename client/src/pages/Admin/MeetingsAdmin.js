import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { 
  Video, 
  Plus, 
  Calendar, 
  Clock, 
  User, 
  ExternalLink, 
  Search,
  MoreVertical,
  ChevronRight
} from 'lucide-react';
import { getAllMeetings } from '../../services/meetingService';
import './MeetingsAdmin.css';

const MeetingsAdmin = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getAllMeetings();
        setMeetings(data || []);
      } catch (err) {
        console.error('Error fetching meetings:', err);
        setMeetings([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredMeetings = meetings.filter(m => 
    m?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper to determine meeting status for styling
  const getMeetingStatus = (dateString) => {
    if (!dateString) return 'past';
    const scheduled = new Date(dateString);
    const now = new Date();
    const diff = scheduled.getTime() - now.getTime();
    
    if (Math.abs(diff) < 3600000 && diff < 0) return 'live'; // Within last hour
    if (diff < 0) return 'past';
    return 'upcoming';
  };

  return (
    <div className="meetings-admin-container">
      <div className="meetings-admin-content">
        {/* Header Section */}
        <header className="admin-header">
          <div className="header-content">
            <h1 className="admin-title">Meetings</h1>
            <p className="admin-subtitle">Manage corporate syncs and virtual huddles</p>
          </div>
          
          <button 
            onClick={() => navigate('/admin/meetings/create')}
            className="create-meeting-btn"
            aria-label="Schedule new meeting"
          >
            <Plus size={20} />
            <span>Schedule New Meeting</span>
          </button>
        </header>

        {/* Stats & Filter Bar */}
        <div className="stats-filter-bar">
          <div className="search-wrapper">
            <Search className="search-icon" size={20} />
            <input 
              type="text"
              placeholder="Search by meeting title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              aria-label="Search meetings"
            />
          </div>
          
          <div className="stats-display">
            <span className="stats-label">Total:</span>
            <span className="stats-count">{meetings.length}</span>
          </div>
        </div>

        {/* Meetings Content */}
        <main className="meetings-main">
          {loading ? (
            <div className="skeleton-grid">
              {[1, 2, 3, 4].map(i => (
                <div key={`skeleton-${i}`} className="meeting-skeleton" />
              ))}
            </div>
          ) : filteredMeetings.length > 0 ? (
            <div className="meetings-grid">
              {filteredMeetings.map((meeting) => {
                const status = getMeetingStatus(meeting.scheduledAt);
                return (
                  <article key={meeting._id} className="meeting-card">
                    <div className="card-inner">
                      <div className="card-top">
                        <div className={`status-indicator status-${status}`}>
                          <Video size={20} />
                        </div>
                        
                        <div className="card-actions">
                          {status === 'live' && (
                            <span className="live-indicator">
                              <span className="live-dot" />
                              Live Now
                            </span>
                          )}
                          <button className="action-btn more-action" aria-label="More options">
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </div>

                      <h3 className="meeting-name">{meeting.title}</h3>
                      <p className="meeting-summary">
                        {meeting.description || "No description provided for this session."}
                      </p>

                      <div className="meeting-meta">
                        <div className="meta-item">
                          <Calendar size={16} className="meta-icon" />
                          <span className="meta-value">
                            {meeting.scheduledAt ? new Date(meeting.scheduledAt).toLocaleDateString(undefined, { 
                              dateStyle: 'long' 
                            }) : 'Date not set'}
                          </span>
                        </div>
                        <div className="meta-item">
                          <Clock size={16} className="meta-icon" />
                          <span className="meta-value">
                            {meeting.scheduledAt ? new Date(meeting.scheduledAt).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            }) : 'Time not set'}
                          </span>
                        </div>
                        <div className="meta-item">
                          <User size={14} className="meta-icon" />
                          <span className="meta-value">
                            Organized by <span className="organizer">{meeting.createdBy?.name || 'Admin'}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <footer className="card-footer">
                      {meeting.url ? (
                        <a 
                          href={meeting.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="join-meeting"
                          aria-label="Join meeting"
                        >
                          Join Discussion <ExternalLink size={16} />
                        </a>
                      ) : (
                        <span className="no-meeting-link">No meeting link available</span>
                      )}
                      
                      <button className="action-btn chevron-action" aria-label="View details">
                        <ChevronRight size={20} />
                      </button>
                    </footer>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="no-meetings">
              <div className="no-meetings-icon">
                <Calendar size={48} />
              </div>
              <h2 className="no-meetings-title">No meetings found</h2>
              <p className="no-meetings-text">
                {searchTerm ? 'Try a different search term' : 'No meetings scheduled yet'}
                . Create your first meeting to get started.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MeetingsAdmin;
