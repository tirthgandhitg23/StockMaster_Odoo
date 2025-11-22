import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Box, Lock, Mail, ArrowRight, Loader2 } from "lucide-react"; 
import { toast } from "sonner";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); 
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Welcome back!");
        if (data.token) {
          localStorage.setItem('token', data.token);
          // This now saves 'role' inside the user object
          localStorage.setItem('user', JSON.stringify(data.user)); 
          navigate("/dashboard");
        }
      } else {
        toast.error(data.message || "Invalid email or password");
      }
    } catch (error) {
      toast.error("Server connection failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <Box className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome back</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
              <input name="email" type="email" required className="w-full pl-10 p-3 border rounded-lg" placeholder="Email address" onChange={handleChange} />
            </div>
            <div className="relative">
              <Lock className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
              <input name="password" type="password" required className="w-full pl-10 p-3 border rounded-lg" placeholder="Password" onChange={handleChange} />
            </div>
          </div>
          <div className="flex justify-end text-sm"><Link to="/forgot-password" className="text-blue-600">Forgot password?</Link></div>
          <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            {isLoading ? <Loader2 className="animate-spin" /> : "Sign in"}
          </button>
          <div className="text-center mt-4"><Link to="/signup" className="text-blue-600">Create free account</Link></div>
        </form>
      </div>
    </div>
  );
};