import clinicProLogo from "/favicon.png";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Stethoscope, 
  Search, 
  MessageCircle, 
  User, 
  Calendar, 
  Users, 
  FileText, 
  Pill,
  Clock,
  Activity,
  Star,
  Home,
  ArrowLeft
} from "lucide-react";
import RealTimeNotificationDropdown from "./RealTimeNotificationDropdown";
import AppointmentsTab from "./AppointmentsTab";
import PatientsTab from "./PatientsTab";
import FeedbackTab from "./FeedbackTab";
import PrescriptionsTab from "./PrescriptionsTab";
import MessagesTab from "./MessagesTab";
import ProfileTab from "./ProfileTab";
import VideoConsultation from "./VideoConsultation";

interface DashboardProps {
  userName: string;
  onLogout?: () => void;
}

const Dashboard = ({ userName, onLogout }: DashboardProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [videoConsultation, setVideoConsultation] = useState<{
    isOpen: boolean;
    patient: any;
  }>({ isOpen: false, patient: null });
  
  // Doctor configuration - in real app this would come from authentication
  const doctorId = "doctor_001";
  const doctorName = `Dr. ${userName}`;

  const quickActions = [
    { name: "Appointments", icon: Calendar, color: "bg-medical-blue/10 text-medical-blue", key: "appointments" },
    { name: "Patients", icon: Users, color: "bg-success/10 text-success", key: "patients" },
    { name: "Feedback", icon: Star, color: "bg-warning/10 text-warning", key: "feedback" },
    { name: "Prescriptions", icon: Pill, color: "bg-destructive/10 text-destructive", key: "prescriptions" }
  ];

  // Bottom navigation items
  const bottomNavItems = [
    { id: "dashboard", name: "Home", icon: Home },
    { id: "appointments", name: "Appointments", icon: Calendar },
    { id: "patients", name: "Patients", icon: Users },
    { id: "messages", name: "Messages", icon: MessageCircle },
    { id: "profile", name: "Profile", icon: User }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <button 
            onClick={() => setActiveTab("dashboard")}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <img 
              src={clinicProLogo} 
              alt="Clinic Pro Logo" 
              className="h-10 w-auto"
            />
            <span className="text-xl font-bold text-foreground">Clinic Pro</span>
          </button>


          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 bg-muted/50"
              />
            </div>
            
            <RealTimeNotificationDropdown 
              userId={doctorId}
              userRole="doctor"
              userName={doctorName}
            />
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setActiveTab("messages")}
              className={activeTab === "messages" ? "bg-primary/10 text-primary" : ""}
            >
              <MessageCircle className="w-5 h-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setActiveTab("profile")}
              className={activeTab === "profile" ? "bg-primary/10 text-primary" : ""}
            >
              <User className="w-5 h-5" />
            </Button>
            
            {/* Back to Portal Selection Button - Desktop */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={onLogout}
              className="hidden md:flex items-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Portal Selection</span>
            </Button>
            
            {/* Logout Button */}
            {onLogout && (
              <Button variant="outline" onClick={onLogout} className="md:hidden">
                Logout
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6 pb-28">
        {activeTab === "dashboard" && (
          <>
            {/* Welcome Card */}
            <Card className="glass-card shadow-medical animate-fade-in-up">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">
                      Welcome back, Dr. {userName}!
                    </h1>
                    <p className="text-muted-foreground">
                      You have <span className="font-semibold text-primary">5 appointments</span> scheduled for today.
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <div className="p-4 rounded-full bg-primary/10 text-primary">
                      <Activity className="w-8 h-8" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              {quickActions.map((action, index) => (
                <Button
                  key={action.name}
                  variant="outline"
                  onClick={() => setActiveTab(action.key)}
                  className="h-20 flex-col space-y-2 glass-card hover:glass-button transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                >
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <span className="font-medium">{action.name}</span>
                </Button>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid md:grid-cols-2 gap-6 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              {/* Today's Schedule */}
              <Card className="glass-card shadow-medical">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <span>Today's Schedule</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { 
                      time: "10:00 AM", 
                      patient: "Rajesh Kumar", 
                      info: "Chest Pain Evaluation", 
                      urgent: true,
                      age: 45,
                      condition: "Coronary Artery Disease",
                      bloodPressure: "140/90",
                      heartRate: "82 bpm",
                      symptoms: "Sharp chest pain, shortness of breath during physical activity"
                    },
                    { 
                      time: "11:30 AM", 
                      patient: "Priya Sharma", 
                      info: "Hypertension Follow-up", 
                      urgent: false,
                      age: 52,
                      condition: "Hypertension",
                      bloodPressure: "155/95",
                      heartRate: "76 bpm",
                      symptoms: "Mild headaches, occasional dizziness"
                    },
                    { 
                      time: "2:00 PM", 
                      patient: "Amit Singh", 
                      info: "Arrhythmia Assessment", 
                      urgent: true,
                      age: 38,
                      condition: "Arrhythmia",
                      bloodPressure: "130/85",
                      heartRate: "105 bpm",
                      symptoms: "Irregular heartbeat, palpitations, fatigue"
                    },
                    { 
                      time: "3:30 PM", 
                      patient: "Sunita Verma", 
                      info: "Post-Surgery Check", 
                      urgent: false,
                      age: 61,
                      condition: "Heart Valve Disease",
                      bloodPressure: "125/80",
                      heartRate: "68 bpm",
                      symptoms: "Mild chest discomfort at incision site"
                    }
                  ].filter(item => 
                    item.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.info.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.condition.toLowerCase().includes(searchQuery.toLowerCase())
                  ).map((appointment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-primary">{appointment.time}</span>
                          {appointment.urgent && (
                            <span className="px-2 py-1 text-xs bg-destructive/10 text-destructive rounded-full">
                              Urgent
                            </span>
                          )}
                        </div>
                        <p className="font-semibold text-foreground">{appointment.patient}</p>
                        <p className="text-sm text-muted-foreground">{appointment.info}</p>
                      </div>
                      <Button 
                        size="sm" 
                        className="medical-gradient shadow-button hover:shadow-lg transition-all duration-300"
                        onClick={() => setVideoConsultation({
                          isOpen: true,
                          patient: {
                            name: appointment.patient,
                            age: appointment.age,
                            condition: appointment.condition || appointment.info,
                            time: appointment.time,
                            urgent: appointment.urgent,
                            bloodPressure: appointment.bloodPressure,
                            heartRate: appointment.heartRate,
                            symptoms: appointment.symptoms
                          }
                        })}
                      >
                        Start Consultation
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="glass-card shadow-medical">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-primary" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { activity: "Consultation completed with Meera Reddy", time: "2 hours ago", type: "consultation" },
                    { activity: "5-star feedback from Vikram Patel", time: "4 hours ago", type: "message" },
                    { activity: "ECG results uploaded for Rajesh Kumar", time: "6 hours ago", type: "results" },
                    { activity: "Cardiac medications sent to Rural Health Center", time: "1 day ago", type: "prescription" }
                  ].filter(activity => 
                    activity.activity.toLowerCase().includes(searchQuery.toLowerCase())
                  ).map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                    >
                      <div className="p-2 rounded-full bg-primary/10 text-primary mt-0.5">
                        {activity.type === "consultation" && <Users className="w-4 h-4" />}
                        {activity.type === "message" && <MessageCircle className="w-4 h-4" />}
                        {activity.type === "results" && <FileText className="w-4 h-4" />}
                        {activity.type === "prescription" && <Pill className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{activity.activity}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Tab Content */}
        {activeTab === "appointments" && <AppointmentsTab searchQuery={searchQuery} />}
        {activeTab === "patients" && <PatientsTab searchQuery={searchQuery} />}
        {activeTab === "feedback" && <FeedbackTab searchQuery={searchQuery} />}
        {activeTab === "prescriptions" && <PrescriptionsTab searchQuery={searchQuery} />}
        {activeTab === "messages" && <MessagesTab searchQuery={searchQuery} />}
        {activeTab === "profile" && <ProfileTab userName={userName} />}

      </main>

      {/* Bottom Navigation Bar - Perfectly aligned on all screen sizes */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t z-50">
        <div className="grid grid-cols-5 h-16 w-full">
          {bottomNavItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={`flex flex-col items-center justify-center h-full w-full rounded-none ${
                activeTab === item.id 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Video Consultation Modal */}
      <VideoConsultation
        isOpen={videoConsultation.isOpen}
        onClose={() => setVideoConsultation({ isOpen: false, patient: null })}
        patient={videoConsultation.patient || {}}
      />
    </div>
  );
};

export default Dashboard;