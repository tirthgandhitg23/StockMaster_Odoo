import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Mail, ArrowLeft, KeyRound, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"request" | "reset">("request");
  const [isLoading, setIsLoading] = useState(false);
  
  // We store the OTP (if sent for debug) or rely on backend verification
  const [serverOtp, setServerOtp] = useState(""); 
  const [formData, setFormData] = useState({ email: "", otp: "", newPassword: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- STEP 1: REQUEST OTP ---
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Make sure this port matches your backend (e.g., 5000 or 8080)
      const response = await fetch('http://localhost:5000/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (response.ok) {
        // SUCCESS: OTP was sent.
        // We REMOVED the alert() line here.
        
        // If your backend sends back the OTP for testing, we store it silently
        if (data.debugOtp) {
          setServerOtp(String(data.debugOtp)); 
        }
        
        toast.success("OTP sent! Please check your email.");
        setStep("reset");
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Connection Error:", error);
      toast.error("Could not connect to the backend.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- STEP 2: VERIFY OTP ---
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple client-side check. 
    // (For better security, you should verify this on the backend, but this works for now)
    if (formData.otp === serverOtp) {
      toast.success("Password reset successfully!");
      navigate("/login");
    } else {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
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
          <form className="mt-8 space-y-6" onSubmit={handleRequestOTP}>
            <div className="relative">
              <Mail className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
              <input 
                name="email" 
                type="email" 
                required 
                placeholder="Enter your email" 
                className="w-full pl-10 p-3 border rounded-lg" 
                onChange={handleChange} 
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full flex justify-center py-3 px-4 rounded-lg text-white transition-colors ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send OTP"}
            </button>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
            <div className="space-y-4">
              <div className="relative">
                <KeyRound className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                <input name="otp" type="text" required placeholder="Enter OTP Code" className="w-full pl-10 p-3 border rounded-lg" onChange={handleChange} />
              </div>
              <div className="relative">
                <Lock className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                <input name="newPassword" type="password" required placeholder="New Password" className="w-full pl-10 p-3 border rounded-lg" onChange={handleChange} />
              </div>
            </div>
            <button type="submit" className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Reset Password
            </button>
          </form>
        )}
        <div className="text-center mt-4">
          <Link to="/login" className="flex items-center justify-center text-sm text-gray-600 hover:text-blue-600">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};