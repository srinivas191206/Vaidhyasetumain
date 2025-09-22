import clinicProLogo from "/favicon.png";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";

interface LoginProps {
  onLogin: (name: string, type: "doctor" | "health-center", language: string) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [userType, setUserType] = useState<"doctor" | "health-center">("doctor");
  const [language, setLanguage] = useState("english");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt:", { ...formData, userType, language });
    
    // For demo purposes, we'll just use a generic name
    // In a real app, this would come from the backend after authentication
    const userName = userType === "doctor" ? "Dr. Srinivas" : "Srinivas";
    console.log("Calling onLogin with:", { userName, userType, language });
    onLogin(userName, userType, language);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  console.log("Current user type:", userType);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
      
      {/* Floating Medical Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-primary/5 rounded-full blur-xl animate-pulse-glow" />
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-accent/5 rounded-full blur-2xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
      
      <Card className="w-full max-w-md glass-card shadow-glass animate-scale-in relative z-10">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <img 
              src={clinicProLogo} 
              alt="Clinic Pro Logo" 
              className="h-16 w-auto"
            />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Clinic Pro
            </CardTitle>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Language Selector */}
            <div className="space-y-2">
              <Label htmlFor="language" className="text-sm font-medium">
                Language
              </Label>
              <select 
                value={language} 
                onChange={(e) => {
                  const value = e.target.value;
                  console.log("Language changed to:", value);
                  setLanguage(value);
                }}
                className="w-full p-2 border rounded-md bg-background"
              >
                <option value="english">English</option>
                <option value="telugu">తెలుగు</option>
                <option value="hindi">हिन्दी</option>
                <option value="tamil">தமிழ்</option>
                <option value="kannada">ಕನ್ನಡ</option>
                <option value="punjabi">ਪੰਜਾਬੀ</option>
              </select>
            </div>
            
            {/* User Type Selector */}
            <div className="space-y-2">
              <Label htmlFor="userType" className="text-sm font-medium">
                Login as
              </Label>
              <select 
                value={userType} 
                onChange={(e) => {
                  const value = e.target.value as "doctor" | "health-center";
                  console.log("User type changed to:", value);
                  setUserType(value);
                }}
                className="w-full p-2 border rounded-md bg-background"
              >
                <option value="doctor">Doctor</option>
                <option value="health-center">Health Care Centre</option>
              </select>
            </div>
            
            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email ID / Mobile Number
              </Label>
              <Input
                id="email"
                type="text"
                placeholder="Email ID / Mobile Number"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="transition-smooth focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            {/* Password Input with Eye Icon */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="transition-smooth focus:ring-2 focus:ring-primary/20 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            {/* Login Button */}
            <Button 
              type="submit" 
              className="w-full medical-gradient shadow-button hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] mt-6"
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;