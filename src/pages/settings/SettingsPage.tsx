import { Settings, Database, Bell, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const SettingsPage = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure application preferences</p>
      </div>

      <div className="grid gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Settings className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-foreground">General Settings</CardTitle>
                <CardDescription className="text-muted-foreground">Basic application configuration</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">General settings configuration will be available here.</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Database className="h-5 w-5 text-success" />
              </div>
              <div>
                <CardTitle className="text-foreground">Database Settings</CardTitle>
                <CardDescription className="text-muted-foreground">Configure database connection and backup</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Database configuration will be available when MongoDB is integrated.</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Bell className="h-5 w-5 text-warning" />
              </div>
              <div>
                <CardTitle className="text-foreground">Notifications</CardTitle>
                <CardDescription className="text-muted-foreground">Manage notification preferences</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Notification settings will be configured here.</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <CardTitle className="text-foreground">Security Settings</CardTitle>
                <CardDescription className="text-muted-foreground">Manage security and access control</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Security and role management settings will be available here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
