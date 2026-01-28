import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Video, 
  Calendar, 
  Clock, 
  Plus, 
  ExternalLink, 
  Search, 
  Inbox, 
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import { getMyMeetings } from '../../services/meetingService';
import './Meetings.css';

const Meetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getMyMeetings();
        setMeetings(data || []);
      } catch (err) {
        console.error("Failed to fetch meetings:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredMeetings = meetings.filter(m => 
    m.title.toLowerCase().includes(filter.toLowerCase())
  );

  const isLive = (date) => {
    const scheduled = new Date(date);
    const now = new Date();
    const diff = now - scheduled;
    return diff >= 0 && diff < 3600000; // Live if started in the last hour
  };

  const getStatusStyles = (live) => ({
    container: live ? 'live-container' : 'normal-container',
    dateChip: live ? 'live-date-chip' : 'normal-date-chip',
    joinBtn: live ? 'live-join-btn' : 'normal-join-btn',
    liveBadge: live ? 'live-badge' : ''
  });

  const dateObj = (meeting) => new Date(meeting.scheduledAt);

  return (
    <div className="meetings-container">
      <div className="meetings-content">
        {/* Header */}
        <header className="meetings-header">
          <div className="header-text">
            <h1 className="header-title">My Meetings</h1>
            <p className="header-subtitle">Stay on top of your schedule and collaborations.</p>
          </div>
          <Link to="/employee/meetings/create" className="schedule-btn">
            <Plus size={20} />
            Schedule Meeting
          </Link>
        </header>

        {/* Search */}
        <div className="search-section">
          <Search className="search-icon" size={20} />
          <input 
            type="text" 
            placeholder="Search by title or topic..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Content */}
        {loading ? (
          <div className="skeletons">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton" />
            ))}
          </div>
        ) : filteredMeetings.length > 0 ? (
          <div className="meetings-grid">
            {filteredMeetings.map((m) => {
              const live = isLive(m.scheduledAt);
              const status = getStatusStyles(live);
              const d = dateObj(m);

              return (
                <article key={m._id} className={`meeting-card ${status.container}`}>
                  <div className="meeting-content">
                    {/* Date Chip */}
                    <div className={`date-chip ${status.dateChip}`}>
                      <span className="date-month">
                        {d.toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                      <span className="date-day">
                        {d.getDate()}
                      </span>
                    </div>

                    {/* Main Content */}
                    <div className="meeting-main">
                      <div className="meeting-header">
                        {live && (
                          <span className={`status-badge ${status.liveBadge}`}>
                            <span className="live-dot" />
                            Live Now
                          </span>
                        )}
                        <h3 className="meeting-title">{m.title}</h3>
                      </div>

                      <div className="meeting-meta">
                        <div className="meta-item">
                          <Clock size={16} />
                          {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="meta-item">
                          <Video size={16} />
                          {m.url ? 'Video Call' : 'In-person'}
                        </div>
                      </div>

                      {m.description && (
                        <p className="meeting-desc">{m.description}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="meeting-actions">
                      <button className="more-btn" aria-label="More options">
                        <MoreHorizontal size={20} />
                      </button>
                      {m.url ? (
                        <a 
                          href={m.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className={`join-btn ${status.joinBtn}`}
                        >
                          Join <ExternalLink size={16} />
                        </a>
                      ) : (
                        <div className="no-link">No link</div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <Inbox size={48} />
            </div>
            <h2 className="empty-title">No meetings found</h2>
            <p className="empty-subtitle">
              Your schedule is clear! If you're looking for something specific, try adjusting your search.
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className="meetings-footer">
          <Calendar size={16} />
          <span>All times are shown in your local timezone</span>
        </footer>
      </div>
    </div>
  );
};

export default Meetings;