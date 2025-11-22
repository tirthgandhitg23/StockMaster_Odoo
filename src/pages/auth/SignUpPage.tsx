import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Box, Lock, Mail, User, ArrowRight, Loader2, Briefcase } from "lucide-react";
import { toast } from "sonner";

export const SignUpPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "manager" 
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setIsLoading(true);

    try {
      // Ensure this URL matches your backend port (5000 or 8080)
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Account created! Please login.");
        navigate("/login");
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (error) {
      toast.error("Server error. Is backend running?");
    } finally {
      setIsLoading(false);
    }
  };

  // SHARED STYLES: Ensures text is Dark Gray (gray-900) and background is White
  const inputClasses = "appearance-none block w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <Box className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Create Account</h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            
            {/* Role Selection Dropdown */}
            <div className="relative">
              {/* Made icon darker (text-gray-900) */}
              <Briefcase className="absolute top-3 left-3 h-5 w-5 text-gray-900" />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                // Added text-black explicitly
                className="w-full pl-10 p-3 border rounded-lg bg-white text-black font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="manager">Inventory Manager</option>
                <option value="staff">Warehouse Staff</option>
              </select>
            </div>

            {/* Name Input */}
            <div className="relative">
              <User className="absolute top-3 left-3 h-5 w-5 text-gray-900" />
              <input 
                name="name" 
                type="text" 
                required 
                placeholder="Full Name" 
                // Added text-black and placeholder-gray-500
                className="w-full pl-10 p-3 border rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none" 
                onChange={handleChange} 
              />
            </div>

            {/* Email Input */}
            <div className="relative">
              <Mail className="absolute top-3 left-3 h-5 w-5 text-gray-900" />
              <input 
                name="email" 
                type="email" 
                required 
                placeholder="Email address" 
                // Added text-black and placeholder-gray-500
                className="w-full pl-10 p-3 border rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none" 
                onChange={handleChange} 
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock className="absolute top-3 left-3 h-5 w-5 text-gray-900" />
              <input 
                name="password" 
                type="password" 
                required 
                placeholder="Password" 
                // Added text-black and placeholder-gray-500
                className="w-full pl-10 p-3 border rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none" 
                onChange={handleChange} 
              />
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <Lock className="absolute top-3 left-3 h-5 w-5 text-gray-900" />
              <input 
                name="confirmPassword" 
                type="password" 
                required 
                placeholder="Confirm Password" 
                // Added text-black and placeholder-gray-500
                className="w-full pl-10 p-3 border rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none" 
                onChange={handleChange} 
              />
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700">
             <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : <ArrowRight className="h-4 w-4 text-blue-300 group-hover:text-white" />}
            </span>
            {isLoading ? "Creating..." : "Create Account"}
          </button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};