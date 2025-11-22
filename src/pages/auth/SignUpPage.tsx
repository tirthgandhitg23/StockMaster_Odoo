import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Box, Lock, Mail, User, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export const SignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // PDF Req[cite: 14]: Redirected to Inventory Dashboard
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    toast.success("Account created successfully!");
    navigate("/dashboard");
  };

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
            <div className="relative">
              <User className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
              <input name="name" type="text" required placeholder="Full Name" className="w-full pl-10 p-3 border rounded-lg" onChange={handleChange} />
            </div>
            <div className="relative">
              <Mail className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
              <input name="email" type="email" required placeholder="Email address" className="w-full pl-10 p-3 border rounded-lg" onChange={handleChange} />
            </div>
            <div className="relative">
              <Lock className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
              <input name="password" type="password" required placeholder="Password" className="w-full pl-10 p-3 border rounded-lg" onChange={handleChange} />
            </div>
            <div className="relative">
              <Lock className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
              <input name="confirmPassword" type="password" required placeholder="Confirm Password" className="w-full pl-10 p-3 border rounded-lg" onChange={handleChange} />
            </div>
          </div>

          <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700">
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <ArrowRight className="h-4 w-4 text-blue-300 group-hover:text-white" />
            </span>
            Create Account
          </button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account? <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">Sign in instead</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};