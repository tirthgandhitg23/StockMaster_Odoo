import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Frontend validation only - no backend
    if (loginId && password) {
      navigate("/dashboard");
    }
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
            <CardTitle className="text-2xl font-bold text-foreground">Welcome to StockMaster</CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in to manage your inventory
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
                placeholder="Enter your login ID"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                required
                className="bg-input border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-input border-border text-foreground"
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <Link to="/forgot-password" className="text-primary hover:underline">
                Forgot Password?
              </Link>
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Sign In
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Sign Up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
