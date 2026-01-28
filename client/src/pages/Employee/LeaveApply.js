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
    <div className="min-h-screen bg-[#FBFBFE] p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        
        {/* Navigation Header */}
        <div className="mb-10">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-medium transition-colors mb-4"
          >
            <ArrowLeft size={18} /> Back to Leave History
          </button>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Request Time Off</h1>
          <p className="text-slate-500 mt-2">Submit your leave request for manager approval.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Request Form */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 md:p-10">
              
              {/* Feedback States */}
              {message && (
                <div className="mb-8 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-700 animate-in fade-in slide-in-from-top-2">
                  <CheckCircle2 size={20} />
                  <span className="text-sm font-bold">{message}</span>
                </div>
              )}
              
              {error && (
                <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle size={20} />
                  <span className="text-sm font-bold">{error}</span>
                </div>
              )}

              <div className="space-y-8">
                {/* Date Selection Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                      <Calendar size={14} className="text-indigo-500" /> Start Date
                    </label>
                    <input 
                      type="date" 
                      value={startDate} 
                      onChange={e => setStartDate(e.target.value)} 
                      className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                      <Calendar size={14} className="text-rose-400" /> End Date
                    </label>
                    <input 
                      type="date" 
                      value={endDate} 
                      onChange={e => setEndDate(e.target.value)} 
                      className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-600"
                    />
                  </div>
                </div>

                {/* Reason Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                    <FileText size={14} className="text-indigo-500" /> Reason for Leave
                  </label>
                  <textarea 
                    rows={4}
                    value={reason} 
                    onChange={e => setReason(e.target.value)} 
                    placeholder="Briefly describe the reason for your absence..." 
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none text-slate-600 font-medium"
                  />
                </div>

                {/* Submit Button */}
                <button 
                  onClick={submit} 
                  disabled={submitting} 
                  className={`w-full group flex items-center justify-center gap-3 bg-slate-900 hover:bg-black text-white p-5 rounded-2xl font-bold text-lg shadow-xl shadow-slate-200 transition-all active:scale-[0.98] ${
                    submitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {submitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  )}
                  {submitting ? 'Processing Request...' : 'Submit Request'}
                </button>
              </div>
            </div>
          </div>

          {/* Side Info Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-indigo-600 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-100">
              <CalendarDays className="mb-4 opacity-40" size={40} />
              <h3 className="text-xl font-bold mb-2">Request Summary</h3>
              <div className="space-y-4 mt-6">
                <div className="flex justify-between items-center py-3 border-b border-indigo-500/50">
                  <span className="text-indigo-100 text-sm font-medium">Total Duration</span>
                  <span className="text-2xl font-black">{calculateDays()} Days</span>
                </div>
                <div className="p-4 bg-white/10 rounded-xl flex gap-3">
                  <Info size={18} className="shrink-0 text-indigo-200" />
                  <p className="text-xs leading-relaxed text-indigo-100">
                    Your request will be sent to your immediate supervisor for approval. You'll receive a notification once a decision is made.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
              <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Info size={16} className="text-indigo-500" /> Quick Tips
              </h4>
              <ul className="text-sm text-slate-500 space-y-3">
                <li className="flex gap-2">
                  <span className="w-1 h-1 bg-indigo-500 rounded-full mt-2 shrink-0" />
                  Apply at least 2 days in advance.
                </li>
                <li className="flex gap-2">
                  <span className="w-1 h-1 bg-indigo-500 rounded-full mt-2 shrink-0" />
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