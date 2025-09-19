import vaidhyaSetuLogo from "@/assets/vaidhya-setu-logo.png";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Stethoscope, 
  Building2, 
  UserCheck, 
  Activity,
  MapPin,
  Phone,
  Clock,
  ArrowRight
} from "lucide-react";

interface PortalSelectionProps {
  onPortalSelect: (portal: string) => void;
}

const PortalSelection = ({ onPortalSelect }: PortalSelectionProps) => {
  const [selectedPortal, setSelectedPortal] = useState<string>("");

  const portals = [
    {
      id: "specialist",
      title: "Doctor Portal",
      description: "General doctors providing remote consultations to rural patients",
      icon: Stethoscope,
      color: "bg-blue-500",
      features: [
        "Video consultations with rural patients",
        "Patient medical records management",
        "Prescription and treatment planning",
        "Rural health center communication",
        "Appointment scheduling and management"
      ],
      userTypes: ["General Doctors", "Medical Officers", "Healthcare Providers"],
      bgGradient: "from-blue-600 to-blue-800"
    },
    {
      id: "rural-center",
      title: "Rural Health Center Portal",
      description: "Primary health centers connecting patients with urban general doctors",
      icon: Building2,
      color: "bg-green-500",
      features: [
        "Request general doctor consultations",
        "Patient registration and basic records",
        "Vital signs monitoring and reporting",
        "Emergency consultation requests",
        "Local patient management"
      ],
      userTypes: ["Rural Doctors", "Nurses", "Health Workers", "PHC Staff"],
      bgGradient: "from-green-600 to-green-800"
    }
  ];

  const handlePortalSelect = (portalId: string) => {
    setSelectedPortal(portalId);
    setTimeout(() => {
      onPortalSelect(portalId);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
      
      {/* Floating Medical Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-primary/5 rounded-full blur-xl animate-pulse-glow" />
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-accent/5 rounded-full blur-2xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <img 
              src={vaidhyaSetuLogo} 
              alt="Vaidhya Setu Logo" 
              className="h-16 w-auto"
            />
            <h1 className="text-4xl font-bold text-foreground">Vaidhya Setu</h1>
          </div>
          <p className="text-xl text-muted-foreground mb-2">
            Bridging Healthcare Through Technology
          </p>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose your portal to access the comprehensive telemedicine platform connecting 
            urban general doctors with rural healthcare centers across India
          </p>
        </div>

        {/* Portal Selection Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {portals.map((portal) => {
            const IconComponent = portal.icon;
            const isSelected = selectedPortal === portal.id;
            
            return (
              <Card 
                key={portal.id}
                className={`glass-card shadow-medical hover:shadow-lg transition-all duration-500 cursor-pointer transform hover:scale-[1.02] ${
                  isSelected ? 'ring-4 ring-primary/50 shadow-2xl' : ''
                }`}
                onClick={() => handlePortalSelect(portal.id)}
              >
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${portal.bgGradient} text-white shadow-lg`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-bold text-foreground">
                          {portal.title}
                        </CardTitle>
                        {isSelected && (
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        )}
                      </div>
                      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                        {portal.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* User Types */}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center space-x-2">
                      <UserCheck className="w-4 h-4 text-primary" />
                      <span>User Types</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {portal.userTypes.map((userType, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {userType}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Key Features */}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-primary" />
                      <span>Key Features</span>
                    </h4>
                    <ul className="space-y-2">
                      {portal.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Access Button */}
                  <Button 
                    className={`w-full ${
                      isSelected 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-gradient-to-r ' + portal.bgGradient + ' text-white'
                    } shadow-button hover:shadow-lg transition-all duration-300`}
                    size="lg"
                    disabled={isSelected}
                  >
                    {isSelected ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Loading Portal...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>Access {portal.title.split(' ')[0]} Portal</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="text-center mt-12 space-y-4">
          <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Serving Rural India</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Real-time Consultations</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Powered by Medivine • Connecting general doctors with rural healthcare
          </p>
        </div>
      </div>
    </div>
  );
};

export default PortalSelection;