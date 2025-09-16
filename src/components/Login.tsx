import vaidhyaSetuLogo from "@/assets/vaidhya-setu-logo.png";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope } from "lucide-react";

interface LoginProps {
  onLogin: (name: string) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt:", formData);
    onLogin(formData.name);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
              src={vaidhyaSetuLogo} 
              alt="Vaidhya Setu Logo" 
              className="h-16 w-auto"
            />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Vaidhya Setu
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              Specialist Login Portal
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Dr. John Smith"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="transition-smooth focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Vaidhya Setu Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="doctor@vaidhyasetu.health"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="transition-smooth focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your secure password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="transition-smooth focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full medical-gradient shadow-button hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] mt-6"
            >
              Access Dashboard
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;