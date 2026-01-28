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
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-100',
          icon: <CheckCircle2 size={14} />
        };
      case 'declined':
        return {
          bg: 'bg-rose-50',
          text: 'text-rose-700',
          border: 'border-rose-100',
          icon: <XCircle size={14} />
        };
      default:
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          border: 'border-amber-100',
          icon: <Clock size={14} />
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Leaves</h1>
            <p className="text-slate-500 mt-1 font-medium">History and status of your time-off requests.</p>
          </div>
          <Link 
            to="/employee/leaves/apply" 
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95"
          >
            <Plus size={20} />
            Apply for Leave
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-32 bg-white rounded-3xl animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : leaves.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-12 text-center border border-slate-100 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Inbox size={40} className="text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">No leave requests yet</h2>
            <p className="text-slate-500 max-w-sm mx-auto mb-8 font-medium">
              When you apply for time off, your requests and their approval status will appear here.
            </p>
            <Link 
              to="/employee/leaves/apply" 
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-8 py-3.5 rounded-2xl font-bold transition-all"
            >
              Start First Request <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {leaves.map((l) => {
              const status = getStatusStyles(l.status);
              return (
                <div 
                  key={l._id} 
                  className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    {/* Left: Info */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-slate-50 text-slate-500 rounded-xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                          <CalendarDays size={20} />
                        </div>
                        <span className="text-lg font-bold text-slate-800">
                          {new Date(l.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          <span className="mx-2 text-slate-300">—</span>
                          {new Date(l.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      
                      {l.reason && (
                        <p className="text-slate-500 text-sm italic ml-1 line-clamp-1 max-w-md">
                          "{l.reason}"
                        </p>
                      )}
                    </div>

                    {/* Right: Status & Metadata */}
                    <div className="flex flex-col md:items-end gap-3">
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${status.bg} ${status.text} ${status.border}`}>
                        {status.icon}
                        {l.status}
                      </div>
                      
                      <div className="flex flex-col md:items-end gap-1">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                          <HelpCircle size={12} />
                          Applied {new Date(l.appliedAt).toLocaleDateString()}
                        </div>
                        
                        {l.decidedBy && (
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-500/70">
                            <UserCheck size={12} />
                            Reviewed by {l.decidedBy.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Re-apply Action for Declined Leaves */}
                  {l.status === 'declined' && (
                    <div className="mt-4 pt-4 border-t border-slate-50">
                      <Link 
                        to="/employee/leaves/apply" 
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
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
        <div className="mt-12 p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 flex items-start gap-4">
          <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
            <HelpCircle size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-indigo-900">Need help?</h4>
            <p className="text-xs text-indigo-700/70 mt-0.5 leading-relaxed">
              If your request is pending for more than 48 hours, please contact HR or your direct manager for a manual review.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveList;