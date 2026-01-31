import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Eye, EyeOff, Loader2, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { changeMyPassword } from '../../services/authService';
import './ChangePassword.css';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPass, setShowPass] = useState({ old: false, new: false, confirm: false }); // Individual toggles
  
  const navigate = useNavigate();

  const submit = async () => {
    setMsg({ type: '', text: '' });
    
    if (!oldPassword || !newPassword || !confirm) {
      return setMsg({ type: 'error', text: 'Please fill Current, New, and Retype Password' });
    }
    if (newPassword !== confirm) {
      return setMsg({ type: 'error', text: 'New Password and Retype Password do not match' });
    }
    if (newPassword.length < 6) {
      return setMsg({ type: 'error', text: 'New Password must be at least 6 characters' });
    }

    try {
      setIsSubmitting(true);
      await changeMyPassword(oldPassword, newPassword);
      setMsg({ type: 'success', text: 'Password changed! Redirecting to home...' });
      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Password change failed' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const InputField = ({ label, placeholder, value, setter, id, showKey }) => (
    <div className="input-field-wrapper">
      <label htmlFor={id} className="input-label">{label}</label>
      <div className="input-container">
        <Lock className="input-icon" size={18} />
        <input 
          id={id}
          type={showPass[showKey] ? "text" : "password"}
          placeholder={placeholder}
          value={value} 
          onChange={e => setter(e.target.value)} 
          className="input-field"
          autoComplete={id.includes('old') ? "current-password" : "new-password"}
        />
        <button 
          type="button"
          onClick={() => setShowPass(prev => ({ ...prev, [showKey]: !prev[showKey] }))}
          className="password-toggle"
          aria-label={`Toggle ${label} visibility`}
        >
          {showPass[showKey] ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="change-password-container">
      <div className="change-password-card">
        <button onClick={() => navigate(-1)} className="back-btn" aria-label="Go back">
          <ArrowLeft size={16} /> Back
        </button>

        <div className="main-card">
          <div className="header-banner">
            <div className="shield-icon-bg"><ShieldCheck size={140} /></div>
            <div className="shield-icon-main"><ShieldCheck className="text-white" size={28} /></div>
            <h2 className="header-title">Change Password</h2>
            <p className="header-subtitle">Current, New & Retype Password</p>
          </div>

          <div className="content-area">
            {msg.text && (
              <div className={`alert-message ${msg.type === 'error' ? 'alert-error' : 'alert-success'}`}>
                {msg.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
                <span>{msg.text}</span>
              </div>
            )}

            <div className="input-grid">
              <InputField 
                id="current-password"
                label="Current Password" 
                placeholder="Enter current password"
                value={oldPassword} 
                setter={setOldPassword}
                showKey="old"
              />
              <div className="divider" />

              <InputField 
                id="new-password"
                label="New Password" 
                placeholder="Minimum 6 characters"
                value={newPassword} 
                setter={setNewPassword}
                showKey="new"
              />

              <InputField 
                id="retype-password"
                label="Retype Password" 
                placeholder="Confirm new password"
                value={confirm} 
                setter={setConfirm}
                showKey="confirm"
              />
            </div>

            <div className="submit-section">
              <button 
                onClick={submit} 
                disabled={isSubmitting}
                className="submit-btn"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="loader-icon" />
                    Changing Password...
                  </>
                ) : (
                  'Change Password'
                )}
              </button>
            </div>
            
            <p className="footer-text">
              Secure update • {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
