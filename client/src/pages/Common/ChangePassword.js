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
  const [showPass, setShowPass] = useState(false);
  
  const navigate = useNavigate();

  const submit = async () => {
    setMsg({ type: '', text: '' });
    
    if (!oldPassword || !newPassword) {
      return setMsg({ type: 'error', text: 'All fields are required' });
    }
    if (newPassword !== confirm) {
      return setMsg({ type: 'error', text: 'Passwords do not match' });
    }
    if (newPassword.length < 6) {
      return setMsg({ type: 'error', text: 'New password must be at least 6 characters' });
    }

    try {
      setIsSubmitting(true);
      await changeMyPassword(oldPassword, newPassword);
      setMsg({ type: 'success', text: 'Security updated! Redirecting to home...' });
      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Verification failed' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const InputField = ({ label, placeholder, value, setter, id }) => (
    <div className="input-field-wrapper">
      <label htmlFor={id} className="input-label">
        {label}
      </label>
      <div className="input-container">
        <Lock className="input-icon" size={18} />
        <input 
          id={id}
          type={showPass ? "text" : "password"}
          placeholder={placeholder}
          value={value} 
          onChange={e => setter(e.target.value)} 
          className="input-field"
          autoComplete="new-password"
        />
        <button 
          type="button"
          onClick={() => setShowPass(!showPass)}
          className="password-toggle"
          aria-label="Toggle password visibility"
        >
          {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="change-password-container">
      <div className="change-password-card">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="back-btn"
          aria-label="Go back"
        >
          <ArrowLeft size={16} /> 
          Back
        </button>

        <div className="main-card">
          {/* Header Banner */}
          <div className="header-banner">
            <div className="shield-icon-bg">
              <ShieldCheck size={160} />
            </div>
            <div className="shield-icon-main">
              <ShieldCheck className="text-white" size={32} />
            </div>
            <h2 className="header-title">Security Update</h2>
            <p className="header-subtitle">Keep your account safe and secure</p>
          </div>

          <div className="content-area">
            {/* Alert Messages */}
            {msg.text && (
              <div className={`alert-message ${msg.type === 'error' ? 'alert-error' : 'alert-success'}`}>
                {msg.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
                <span>{msg.text}</span>
              </div>
            )}

            {/* INPUT GRID - Auto stacks vertically on all devices */}
            <div className="input-grid">
              <InputField 
                id="old-password"
                label="Current Password" 
                placeholder="••••••••" 
                value={oldPassword} 
                setter={setOldPassword} 
              />
              
              <div className="divider" />

              <InputField 
                id="new-password"
                label="New Password" 
                placeholder="Min. 6 characters" 
                value={newPassword} 
                setter={setNewPassword} 
              />

              <InputField 
                id="confirm-password"
                label="Confirm New Password" 
                placeholder="Repeat new password" 
                value={confirm} 
                setter={setConfirm} 
              />
            </div>

            {/* Submit Button */}
            <div className="submit-section">
              <button 
                onClick={submit} 
                disabled={isSubmitting} 
                className="submit-btn"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="loader-icon" />
                    Updating Security...
                  </>
                ) : (
                  'Update Password'
                )}
              </button>
            </div>
            
            {/* Footer */}
            <p className="footer-text">
              Logged in as admin. Last change: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
