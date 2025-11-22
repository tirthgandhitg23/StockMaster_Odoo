import { useState } from "react";
import { User, Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export const ProfilePage = () => {
  const [profileData, setProfileData] = useState({
    loginId: "admin",
    email: "admin@stockmaster.com",
    name: "Admin User",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Profile updated:", profileData);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Password changed");
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings</p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-foreground">Account Information</CardTitle>
              <CardDescription className="text-muted-foreground">Update your profile details</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="loginId" className="text-foreground">Login ID</Label>
                <Input
                  id="loginId"
                  value={profileData.loginId}
                  onChange={(e) => setProfileData({ ...profileData, loginId: e.target.value })}
                  disabled
                  className="bg-muted border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">Full Name</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="bg-input border-border text-foreground"
                />
              </div>
            </div>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
              <Lock className="h-6 w-6 text-warning" />
            </div>
            <div>
              <CardTitle className="text-foreground">Change Password</CardTitle>
              <CardDescription className="text-muted-foreground">Update your password to keep your account secure</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-foreground">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="bg-input border-border text-foreground"
                />
              </div>
              <Separator className="bg-border" />
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-foreground">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="bg-input border-border text-foreground"
                />
              </div>
            </div>
            <Button type="submit" variant="outline" className="border-border">
              Change Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
