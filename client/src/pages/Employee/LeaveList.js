import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CalendarDays, 
  Plus, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  UserCheck, 
  ArrowRight,
  Inbox
} from 'lucide-react';
import { getMyLeaves } from '../../services/leaveService';
import './LeaveList.css';

const LeaveList = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getMyLeaves();
        setLeaves(data);
      } catch (err) {
        console.error("Failed to fetch leaves", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getStatusStyles = (status) => {
    switch (status) {
      case 'approved':
        return {
          bg: 'status-approved',
          text: 'text-emerald-700',
          border: 'border-emerald-100',
          icon: <CheckCircle2 size={14} />
        };
      case 'declined':
        return {
          bg: 'status-declined',
          text: 'text-rose-700',
          border: 'border-rose-100',
          icon: <XCircle size={14} />
        };
      default:
        return {
          bg: 'status-pending',
          text: 'text-amber-700',
          border: 'border-amber-100',
          icon: <Clock size={14} />
        };
    }
  };

  return (
    <div className="leave-list-container">
      <div className="leave-list-content">
        
        {/* Header */}
        <div className="leave-header">
          <div>
            <h1 className="header-title">My Leaves</h1>
            <p className="header-subtitle">History and status of your time-off requests.</p>
          </div>
          <Link 
            to="/employee/leaves/apply" 
            className="apply-btn"
          >
            <Plus size={20} />
            Apply for Leave
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="leaves-grid">
            {[1, 2, 3].map((n) => (
              <div key={n} className="loading-skeleton" />
            ))}
          </div>
        ) : leaves.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Inbox size={40} />
            </div>
            <h2 className="empty-title">No leave requests yet</h2>
            <p className="empty-subtitle">
              When you apply for time off, your requests and their approval status will appear here.
            </p>
            <Link 
              to="/employee/leaves/apply" 
              className="apply-btn empty-cta"
            >
              Start First Request <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="leaves-grid">
            {leaves.map((l) => {
              const status = getStatusStyles(l.status);
              return (
                <div key={l._id} className="leave-card">
                  <div className="card-content">
                    
                    {/* Left: Info */}
                    <div className="date-info">
                      <div className="date-header">
                        <div className="date-icon">
                          <CalendarDays size={20} />
                        </div>
                        <span className="date-text">
                          {new Date(l.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          <span className="date-range">—</span>
                          {new Date(l.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      
                      {l.reason && (
                        <p className="reason-text">
                          "{l.reason}"
                        </p>
                      )}
                    </div>

                    {/* Right: Status & Metadata */}
                    <div className="right-section">
                      <div className={`status-badge ${status.bg}`}>
                        {status.icon}
                        {l.status}
                      </div>
                      
                      <div className="metadata">
                        <div className="metadata-item">
                          <HelpCircle size={12} />
                          Applied {new Date(l.appliedAt).toLocaleDateString()}
                        </div>
                        
                        {l.decidedBy && (
                          <div className="metadata-item metadata-reviewed">
                            <UserCheck size={12} />
                            Reviewed by {l.decidedBy.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Re-apply Action for Declined Leaves */}
                  {l.status === 'declined' && (
                    <div className="reapply-section">
                      <Link 
                        to="/employee/leaves/apply" 
                        className="reapply-link"
                      >
                        Modify & Re-apply <ArrowRight size={14} />
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Info */}
        <div className="footer-info">
          <div className="footer-icon">
            <HelpCircle size={18} />
          </div>
          <div className="footer-content">
            <h4>Need help?</h4>
            <p>
              If your request is pending for more than 48 hours, please contact HR or your direct manager for a manual review.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveList;
