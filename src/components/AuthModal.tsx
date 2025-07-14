
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore, UserRole } from "@/stores/authStore";
import { useToast } from "@/hooks/use-toast";
import { Users, Building2, Shield, Loader2, AlertCircle } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "signin" | "signup";
  onModeChange: (mode: "signin" | "signup") => void;
}

const AuthModal = ({ isOpen, onClose, mode, onModeChange }: AuthModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("intern");
  const [companyName, setCompanyName] = useState("");
  const { login, signup, isLoading, error } = useAuthStore();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear any previous errors
    useAuthStore.getState().clearError();
    
    // Enhanced client-side validation
    if (!email.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    if (!password || password.length < 6) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      let result;
      if (mode === "signin") {
        result = await login(email.trim(), password);
      } else {
        // Enhanced signup validation
        if (!name.trim() || name.trim().length < 2) {
          toast({
            title: "Validation Error",
            description: "Please enter your full name (at least 2 characters).",
            variant: "destructive",
          });
          return;
        }
        
        if (role === "employer" && (!companyName.trim() || companyName.trim().length < 2)) {
          toast({
            title: "Validation Error", 
            description: "Please enter your company name (at least 2 characters).",
            variant: "destructive",
          });
          return;
        }
        
        result = await signup(email.trim(), password, name.trim(), role, companyName.trim() || undefined);
      }
      
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
        return;
      }
      
      // Success handling
      const successMessage = mode === "signin" 
        ? "You've successfully signed in." 
        : result.error?.includes('confirmation') 
          ? "Registration successful! Please check your email for a confirmation link."
          : "Your account has been created successfully. You can now start using the platform.";
      
      toast({
        title: mode === "signin" ? "Welcome back!" : "Account created successfully!",
        description: successMessage,
      });
      
      // Only close modal if no email confirmation is needed
      if (!result.error?.includes('confirmation')) {
        onClose();
        resetForm();
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setRole("intern");
    setCompanyName("");
  };

  const roleOptions = [
    {
      value: "intern" as UserRole,
      label: "Intern",
      description: "Looking for internship opportunities",
      icon: Users
    },
    {
      value: "employer" as UserRole,
      label: "Employer",
      description: "Hiring interns for your company",
      icon: Building2
    },
    {
      value: "admin" as UserRole,
      label: "Administrator",
      description: "Platform administration",
      icon: Shield
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {mode === "signin" ? "Welcome Back" : "Join Product Interns"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {mode === "signin" 
              ? "Sign in to access your account and manage your internship applications" 
              : "Create your account to start your internship journey"
            }
          </DialogDescription>
        </DialogHeader>
        
        {/* Enhanced error display */}
        {error && (
          <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
        
        <Tabs value={mode} onValueChange={(value) => onModeChange(value as "signin" | "signup")} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin" className="mt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  minLength={6}
                  disabled={isLoading}
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup" className="mt-6">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {roleOptions.map((option) => (
                  <Card 
                    key={option.value}
                    className={`cursor-pointer border-2 transition-all ${
                      role === option.value 
                        ? "border-blue-500 bg-blue-50" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => !isLoading && setRole(option.value)}
                  >
                    <CardContent className="p-3 text-center">
                      <option.icon className={`h-6 w-6 mx-auto mb-1 ${
                        role === option.value ? "text-blue-600" : "text-gray-500"
                      }`} />
                      <div className={`text-sm font-medium ${
                        role === option.value ? "text-blue-900" : "text-gray-700"
                      }`}>
                        {option.label}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    minLength={2}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                  />
                </div>
                
                {role === "employer" && (
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input
                      id="company-name"
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Enter your company name"
                      required
                      minLength={2}
                      disabled={isLoading}
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password (min. 6 characters)"
                    required
                    minLength={6}
                    disabled={isLoading}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
