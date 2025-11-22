import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const SignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    loginId: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validatePassword = (password: string) => {
    const rules = {
      length: password.length >= 8 && password.length <= 16,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      digit: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    if (!rules.length) return "Password must be 8-16 characters";
    if (!rules.lowercase) return "Password must include a lowercase letter";
    if (!rules.uppercase) return "Password must include an uppercase letter";
    if (!rules.digit) return "Password must include a digit";
    if (!rules.special) return "Password must include a special character";
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.loginId) newErrors.loginId = "Login ID is required";
    if (!formData.email) newErrors.email = "Email is required";
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      navigate("/login");
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">Create Account</CardTitle>
            <CardDescription className="text-muted-foreground">
              Get started with StockMaster
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="loginId" className="text-foreground">Login ID</Label>
              <Input
                id="loginId"
                type="text"
                placeholder="Choose a unique login ID"
                value={formData.loginId}
                onChange={(e) => handleChange("loginId", e.target.value)}
                className="bg-input border-border text-foreground"
              />
              {errors.loginId && <p className="text-xs text-destructive">{errors.loginId}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="bg-input border-border text-foreground"
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="bg-input border-border text-foreground"
              />
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              <p className="text-xs text-muted-foreground">
                8-16 characters with uppercase, lowercase, digit, and special character
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                className="bg-input border-border text-foreground"
              />
              {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
            </div>

            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Create Account
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign In
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
