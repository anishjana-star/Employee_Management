import React, { useEffect, useState, useMemo } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar, 
  User, 
  ChevronRight, 
  Loader2, 
  Inbox,
  Filter
} from 'lucide-react';
import { getAllLeaves, decideLeave } from '../../services/leaveService';
import './LeavesAdmin.css'; // ADD THIS IMPORT

const LeavesAdmin = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getAllLeaves();
      setLeaves(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const decide = async (id, status) => {
    setProcessingId(id);
    try {
      await decideLeave(id, status);
      await load();
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  const filteredLeaves = useMemo(() => {
    if (activeTab === 'all') return leaves;
    return leaves.filter(l => l.status === activeTab);
  }, [leaves, activeTab]);

  const StatusBadge = ({ status }) => (
    <span className={`status-badge status-${status}`}>
      {status}
    </span>
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl">
        {/* Header Section */}
        <div className="header-section">
          <div>
            <h1 className="text-3xl">Leave Requests</h1>
            <p className="header-subtitle">Review and manage employee absence applications.</p>
          </div>
          
          {/* Tab Navigation */}
          <div className="tab-nav">
            {['pending', 'approved', 'declined'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`tab-btn ${activeTab === tab ? 'tab-active' : ''}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="loading-state">
            <Loader2 className="loading-icon" />
            <p className="loading-text">Fetching requests...</p>
          </div>
        ) : filteredLeaves.length > 0 ? (
          <div className="leaves-grid">
            {filteredLeaves.map((l) => (
              <div key={l._id} className="leave-card group">
                <div className="card-content">
                  {/* Employee & Date Info */}
                  <div className="employee-section">
                    <div className="avatar-placeholder">
                      <User size={24} />
                    </div>
                    <div className="employee-info">
                      <div className="employee-header">
                        <h3 className="employee-name">{l.employee?.name}</h3>
                        <StatusBadge status={l.status} />
                      </div>
                      <p className="employee-email">{l.employee?.email}</p>
                      
                      <div className="date-info">
                        <div className="date-range">
                          <Calendar size={16} />
                          <span>{new Date(l.startDate).toLocaleDateString()} — {new Date(l.endDate).toLocaleDateString()}</span>
                        </div>
                        <div className="applied-date">
                          <Clock size={16} />
                          <span>Applied {new Date(l.appliedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reason Section */}
                  <div className="reason-section">
                    <p className="reason-text">"{l.reason || 'No reason provided.'}"</p>
                  </div>

                  {/* Actions */}
                  <div className="actions-section">
                    {l.status === 'pending' ? (
                      <>
                        <button 
                          disabled={processingId === l._id}
                          onClick={() => decide(l._id, 'declined')}
                          className="btn-decline"
                        >
                          <XCircle size={18} />
                          Decline
                        </button>
                        <button 
                          disabled={processingId === l._id}
                          onClick={() => decide(l._id, 'approved')}
                          className="btn-approve"
                        >
                          {processingId === l._id ? (
                            <Loader2 className="animate-spin" size={18} />
                          ) : (
                            <CheckCircle size={18} />
                          )}
                          Approve
                        </button>
                      </>
                    ) : (
                      <div className="processed-text">
                        Processed <ChevronRight size={16} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <Inbox size={32} />
            </div>
            <h3 className="empty-title">No {activeTab} requests</h3>
            <p className="empty-subtitle">Everything is up to date in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeavesAdmin;
