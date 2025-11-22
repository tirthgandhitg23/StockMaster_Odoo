import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Mail, KeyRound, Lock, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"request" | "reset">("request");
  const [isLoading, setIsLoading] = useState(false);
  
  // Store server OTP to verify
  const [serverOtp, setServerOtp] = useState(""); 
  
  const [formData, setFormData] = useState({ 
    email: "", 
    otp: "", 
    newPassword: "", 
    confirmPassword: "" 
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 1. Send OTP
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("OTP sent to your email!");
        if (data.debugOtp) setServerOtp(String(data.debugOtp)); 
        setStep("reset");
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Network Error:", error);
      toast.error("Connection failed. Is backend running?");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Verify OTP & Update Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation 1: Check OTP
    if (formData.otp !== serverOtp) {
      toast.error("Invalid OTP Code. Please check your email.");
      return;
    }

    // Validation 2: Check Passwords Match
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email, 
          newPassword: formData.newPassword 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Password Reset Successfully! Please Login.");
        navigate("/login");
      } else {
        toast.error(data.message || "Failed to update password");
      }

    } catch (error) {
      console.error("Reset Error:", error);
      toast.error("Connection failed");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "appearance-none block w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <Box className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            {step === "request" ? "Reset Password" : "Enter OTP"}
          </h2>
        </div>

        {step === "request" ? (
          // STEP 1 FORM
          <form className="mt-8 space-y-6" onSubmit={handleRequestOTP}>
            <div className="relative">
              <Mail className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
              <input name="email" type="email" required placeholder="Enter your email" className={inputClasses} onChange={handleChange} />
            </div>
            <button type="submit" disabled={isLoading} className="w-full py-3 px-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              {isLoading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          // STEP 2 FORM
          <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
            <div className="space-y-4">
              {/* OTP Input */}
              <div className="relative">
                <KeyRound className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                <input name="otp" type="text" required placeholder="Enter OTP Code" className={inputClasses} onChange={handleChange} />
              </div>
              
              {/* New Password */}
              <div className="relative">
                <Lock className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                <input name="newPassword" type="password" required placeholder="New Password" className={inputClasses} onChange={handleChange} />
              </div>

              {/* Confirm New Password */}
              <div className="relative">
                <CheckCircle className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                <input name="confirmPassword" type="password" required placeholder="Confirm New Password" className={inputClasses} onChange={handleChange} />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {isLoading ? "Updating..." : "Reset Password"}
            </button>
          </form>
        )}
        
        <div className="text-center mt-4">
          <Link to="/login" className="text-sm text-blue-600 hover:underline">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};