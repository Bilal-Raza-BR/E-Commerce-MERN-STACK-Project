import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const OtpVerification = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); // Start with 0 until OTP is sent
  const [otpSent, setOtpSent] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (!otpSent) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [otpSent]);

  // Format time as mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResendOtp = async () => {
    if (!email) {
      Swal.fire({
        title: 'Error!',
        text: 'Please enter your email address',
        icon: 'error'
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/forgot-password', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        setTimeLeft(300); // Reset timer to 5 minutes
        setOtpSent(true);

        await Swal.fire({
          title: 'Success!',
          text: data.message,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        await Swal.fire({
          title: 'Error!',
          text: data.message,
          icon: 'error'
        });
      }
    } catch (err) {
      await Swal.fire({
        title: 'Error!',
        text: 'Server se connect nahi ho saka',
        icon: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    if (!email) {
      Swal.fire({
        title: 'Error!',
        text: 'Please enter your email address',
        icon: 'error'
      });
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Swal.fire({
        title: 'Error!',
        text: 'Please enter a valid email address',
        icon: 'error'
      });
      return false;
    }

    if (!otp) {
      Swal.fire({
        title: 'Error!',
        text: 'Please enter the OTP sent to your email',
        icon: 'error'
      });
      return false;
    }

    if (!newPassword) {
      Swal.fire({
        title: 'Error!',
        text: 'Please enter a new password',
        icon: 'error'
      });
      return false;
    }

    if (newPassword.length < 6) {
      Swal.fire({
        title: 'Error!',
        text: 'Password must be at least 6 characters long',
        icon: 'error'
      });
      return false;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire({
        title: 'Error!',
        text: 'Passwords do not match',
        icon: 'error'
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/verify-otp', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          otp,
          newPassword: newPassword || undefined
        })
      });

      const data = await response.json();

      if (data.success) {
        await Swal.fire({
          title: 'Success!',
          text: data.message,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
        navigate('/login');
      } else {
        await Swal.fire({
          title: 'Error!',
          text: data.message,
          icon: 'error'
        });
      }
    } catch (err) {
      await Swal.fire({
        title: 'Error!',
        text: 'Server se connect nahi ho saka',
        icon: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Reset Password</h1>
          <p>Enter your email, OTP and new password to reset your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="otp">OTP Code</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP sent to your email"
              required
            />
            {otpSent && (
              <div className="otp-timer">
                {timeLeft > 0 ? (
                  <span>OTP expires in: {formatTime(timeLeft)}</span>
                ) : (
                  <span className="expired">OTP expired. Please resend.</span>
                )}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="auth-button secondary"
              onClick={handleResendOtp}
              disabled={isLoading}
              style={{ flex: 1 }}
            >
              {isLoading && !otpSent ? 'Sending OTP...' : 'Send OTP'}
            </button>

            <button
              type="submit"
              className="auth-button"
              disabled={isLoading || !otpSent}
              style={{ flex: 2 }}
            >
              {isLoading && otpSent ? 'Verifying...' : 'Verify & Reset Password'}
            </button>
          </div>
        </form>

        <div className="auth-footer">
          Remember your password? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
