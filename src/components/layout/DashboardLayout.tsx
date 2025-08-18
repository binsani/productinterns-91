
import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LogOut, Settings, User, Menu, X } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import NotificationBell from "@/components/shared/NotificationBell";

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface DashboardLayoutProps {
  title: string;
  navigationItems: NavigationItem[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: ReactNode;
}

const DashboardLayout = ({ 
  title, 
  navigationItems, 
  activeTab, 
  onTabChange, 
  children 
}: DashboardLayoutProps) => {
  const { profile, logout } = useAuthStore();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleProfileSettings = () => {
    console.log("Opening profile settings...");
    // In a real app, this would open a profile settings modal or navigate to settings page
    alert("Profile settings functionality will be available soon!");
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "intern":
        return "bg-blue-100 text-blue-800";
      case "employer":
        return "bg-green-100 text-green-800";
      case "admin":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const NavigationItems = ({ onItemClick }: { onItemClick?: () => void }) => (
    <div className="space-y-1">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => {
              onTabChange(item.id);
              onItemClick?.();
            }}
            className={cn(
              "w-full flex items-center space-x-3 px-3 py-3 text-left rounded-lg transition-colors touch-manipulation",
              activeTab === item.id
                ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
            )}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            <span className="font-medium truncate">{item.label}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
            {/* Mobile Menu Trigger */}
            {isMobile && (
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0">
                  <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">PI</span>
                      </div>
                      <span className="font-semibold text-gray-900">Navigation</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <NavigationItems onItemClick={() => setMobileMenuOpen(false)} />
                  </div>
                </SheetContent>
              </Sheet>
            )}
            
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">PI</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">{title}</h1>
              <p className="text-xs sm:text-sm text-gray-600 truncate hidden sm:block">
                Welcome back, {profile?.name || "User"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            {/* Notifications */}
            <NotificationBell />
            
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full">
                  <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                    <AvatarImage src={profile?.avatar_url} alt={profile?.name} />
                    <AvatarFallback className="text-xs sm:text-sm">
                      {profile?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none truncate">{profile?.name || "User"}</p>
                  <p className="text-xs leading-none text-muted-foreground truncate">{profile?.email}</p>
                  <Badge className={cn("w-fit mt-1", getRoleColor(profile?.role || ""))} variant="secondary">
                    {profile?.role || "user"}
                  </Badge>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleProfileSettings}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar Navigation */}
        {!isMobile && (
          <nav className="w-64 bg-white border-r border-gray-200 min-h-screen flex-shrink-0">
            <div className="p-4">
              <NavigationItems />
            </div>
          </nav>
        )}

        {/* Main Content */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
