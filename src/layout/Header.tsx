import { Menu, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-md hover:bg-accent text-foreground"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex-1" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <span className="hidden md:inline text-foreground">Admin User</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-popover border-border">
          <DropdownMenuLabel className="text-foreground">My Account</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-border" />
          <DropdownMenuItem
            onClick={() => navigate("/profile")}
            className="text-foreground hover:bg-accent cursor-pointer"
          >
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleLogout}
            className="text-foreground hover:bg-accent cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};
