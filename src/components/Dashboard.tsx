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
  ArrowLeft,
  Globe
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
  language?: string;
}

// Translation object
const translations = {
  english: {
    welcome: "Welcome back, Dr.",
    appointmentsToday: "You have",
    appointmentsTodayCount: "appointments scheduled for today.",
    home: "Home",
    appointments: "Appointments",
    patients: "Patients",
    feedback: "Feedback",
    prescriptions: "Prescriptions",
    messages: "Messages",
    profile: "Profile",
    backToPortal: "Back to Portal Selection",
    logout: "Logout",
    todaySchedule: "Today's Schedule",
    recentActivity: "Recent Activity",
    urgent: "Urgent",
    startConsultation: "Start Consultation",
    consultationCompleted: "Consultation completed with",
    feedbackFrom: "5-star feedback from",
    ecgResults: "ECG results uploaded for",
    medicationsSent: "Cardiac medications sent to Rural Health Center"
  },
  hindi: {
    welcome: "वापसी पर स्वागत है, डॉ.",
    appointmentsToday: "आपके पास है",
    appointmentsTodayCount: "आज के लिए निर्धारित अपैंटमेंट।",
    home: "होम",
    appointments: "अपॉइंटमेंट",
    patients: "मरीज़",
    feedback: "प्रतिक्रिया",
    prescriptions: "नुस्खे",
    messages: "संदेश",
    profile: "प्रोफ़ाइल",
    backToPortal: "पोर्टल चयन पर वापस जाएं",
    logout: "लॉगआउट",
    todaySchedule: "आज का अनुसूची",
    recentActivity: "हाल की गतिविधि",
    urgent: "तत्काल",
    startConsultation: "परामर्श शुरू करें",
    consultationCompleted: "के साथ परामर्श पूर्ण हुआ",
    feedbackFrom: "से 5-स्टार प्रतिक्रिया",
    ecgResults: "के लिए ईसीजी परिणाम अपलोड किए गए",
    medicationsSent: "ग्रामीण स्वास्थ्य केंद्र को कार्डियक दवाएं भेजी गईं"
  },
  telugu: {
    welcome: "తిరిగి రావడం సంతోషంగా ఉంది, డాక్టర్",
    appointmentsToday: "మీకు ఉంది",
    appointmentsTodayCount: "ఈ రోజు షెడ్యూల్ చేయబడిన అపాయింట్‌మెంట్‌లు.",
    home: "హోమ్",
    appointments: "అపాయింట్‌మెంట్‌లు",
    patients: "రోగులు",
    feedback: "అభిప్రాయం",
    prescriptions: "ప్రిస్క్రిప్షన్లు",
    messages: "సందేశాలు",
    profile: "ప్రొఫైల్",
    backToPortal: "పోర్టల్ ఎంపికకు తిరిగి వెళ్ళండి",
    logout: "లాగౌట్",
    todaySchedule: "ఈ రోజు షెడ్యూల్",
    recentActivity: "ఇటీవలి కార్యాచరణ",
    urgent: "తుర్తు",
    startConsultation: "కన్సల్టేషన్ ప్రారంభించండి",
    consultationCompleted: "తో కన్సల్టేషన్ పూర్తయింది",
    feedbackFrom: "నుండి 5-స్టార్ అభిప్రాయం",
    ecgResults: "కోసం ECG ఫలితాలు అప్‌లోడ్ చేయబడ్డాయి",
    medicationsSent: "గ్రామీణ ఆరోగ్య కేంద్రానికి హృదయ మందులు పంపబడ్డాయి"
  },
  tamil: {
    welcome: "மீண்டும் வருகைக்கு நல்வரவு, டாக்டர்",
    appointmentsToday: "உங்களிடம் உள்ளது",
    appointmentsTodayCount: "இன்று திட்டமிடப்பட்டுள்ள நியமனங்கள்.",
    home: "முகப்பு",
    appointments: "நியமனங்கள்",
    patients: "நோயாளிகள்",
    feedback: "கருத்து",
    prescriptions: "மருந்து விதிப்புகள்",
    messages: "செய்திகள்",
    profile: "சுயவிவரம்",
    backToPortal: "போர்டல் தேர்வுக்குத் திரும்பு",
    logout: "வெளியேறு",
    todaySchedule: "இன்றைய அட்டவணை",
    recentActivity: "சமீபத்திய செயல்பாடு",
    urgent: "அவசரம்",
    startConsultation: "ஆலோசனையைத் தொடங்கவும்",
    consultationCompleted: "உடன் ஆலோசனை முடிந்தது",
    feedbackFrom: "இலிருந்து 5-ஸ்டார் கருத்து",
    ecgResults: "க்கான ஈசிசி முடிவுகள் பதிவேற்றப்பட்டன",
    medicationsSent: "கிராமிய சுகாதார மையத்திற்கு இதய மருந்துகள் அனுப்பப்பட்டன"
  },
  kannada: {
    welcome: "ಮರು ಬಂದಿದ್ದಕ್ಕೆ ಸುಸ್ವಾಗತ, ಡಾಕ್ಟರ್",
    appointmentsToday: "ನಿಮಗೆ ಇದೆ",
    appointmentsTodayCount: "ಇಂದು ನಿಗದಿಪಡಿಸಲಾದ ಭೇಟಿಗಳು.",
    home: "ಮುಖಪುಟ",
    appointments: "ಭೇಟಿಗಳು",
    patients: "ರೋಗಿಗಳು",
    feedback: "ಪ್ರತಿಕ್ರಿಯೆ",
    prescriptions: "ಪ್ರಿಸ್ಕ್ರಿಪ್ಶನ್‌ಗಳು",
    messages: "ಸಂದೇಶಗಳು",
    profile: "ಪ್ರೊಫೈಲ್",
    backToPortal: "ಪೋರ್ಟಲ್ ಆಯ್ಕೆಗೆ ಹಿಂತಿರುಗಿ",
    logout: "ಲಾಗ್ ಔಟ್",
    todaySchedule: "ಇಂದಿನ ವೇಳಾಪಟ್ಟಿ",
    recentActivity: "ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ",
    urgent: "ತುರ್ತು",
    startConsultation: "ಸಲಹೆ ಪ್ರಾರಂಭಿಸಿ",
    consultationCompleted: "ಜೊತೆ ಸಲಹೆ ಪೂರ್ಣಗೊಂಡಿದೆ",
    feedbackFrom: "ನಿಂದ 5-ಸ್ಟಾರ್ ಪ್ರತಿಕ್ರಿಯೆ",
    ecgResults: "ಗಾಗಿ ಇಸಿಜಿ ಫಲಿತಾಂಶಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಲಾಗಿದೆ",
    medicationsSent: "ಗ್ರಾಮೀಣ ಆರೋಗ್ಯ ಕೇಂದ್ರಕ್ಕೆ ಹೃದಯ ಮಾತ್ರೆಗಳನ್ನು ಕಳುಹಿಸಲಾಗಿದೆ"
  },
  punjabi: {
    welcome: "ਵਾਪਸੀ ਲਈ ਜੀ ਆਇਆਂ ਨੂੰ, ਡਾਕਟਰ",
    appointmentsToday: "ਤੁਹਾਡੇ ਕੋਲ ਹੈ",
    appointmentsTodayCount: "ਅੱਜ ਲਈ ਨਿਰਧਾਰਤ ਐਪੋਇੰਟਮੈਂਟ।",
    home: "ਘਰ",
    appointments: "ਐਪੋਇੰਟਮੈਂਟ",
    patients: "ਮਰੀਜ਼",
    feedback: "ਫੀਡਬੈਕ",
    prescriptions: "ਪ੍ਰੀਸਕ੍ਰਿਪਸ਼ਨ",
    messages: "ਸੁਨੇਹੇ",
    profile: "ਪ੍ਰੋਫਾਈਲ",
    backToPortal: "ਪੋਰਟਲ ਚੋਣ ਵਾਪਸ ਜਾਓ",
    logout: "ਲਾਗਆਉਟ",
    todaySchedule: "ਅੱਜ ਦਾ ਸ਼ੈਡਿਊਲ",
    recentActivity: "ਹਾਲ ਹੀ ਦੀ ਗਤੀਵਿਧੀ",
    urgent: "ਐਮਰਜੈਂਸੀ",
    startConsultation: "ਸਲਾਹ ਸ਼ੁਰੂ ਕਰੋ",
    consultationCompleted: "ਨਾਲ ਸਲਾਹ ਪੂਰੀ ਹੋਈ",
    feedbackFrom: "ਤੋਂ 5-ਸਟਾਰ ਫੀਡਬੈਕ",
    ecgResults: "ਲਈ ECG ਨਤੀਜੇ ਅਪਲੋਡ ਕੀਤੇ ਗਏ",
    medicationsSent: "ਗ੍ਰਾਮੀਣ ਸਿਹਤ ਕੇਂਦਰ ਨੂੰ ਕਾਰਡੀਏਕ ਦਵਾਈਆਂ ਭੇਜੀਆਂ ਗਈਆਂ"
  }
};

// Language options
const languageOptions = [
  { value: "english", label: "English" },
  { value: "telugu", label: "తెలుగు" },
  { value: "hindi", label: "हिन्दी" },
  { value: "tamil", label: "தமிழ்" },
  { value: "kannada", label: "ಕನ್ನಡ" },
  { value: "punjabi", label: "ਪੰਜਾਬੀ" }
];

// Helper function to get translated text
const t = (language: string, key: string) => {
  return translations[language as keyof typeof translations]?.[key] || translations.english[key] || key;
};

const Dashboard = ({ userName, onLogout, language = "english" }: DashboardProps) => {
  const [currentLanguage, setCurrentLanguage] = useState(language);
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
    { name: t(currentLanguage, "appointments"), icon: Calendar, color: "bg-medical-blue/10 text-medical-blue", key: "appointments" },
    { name: t(currentLanguage, "patients"), icon: Users, color: "bg-success/10 text-success", key: "patients" },
    { name: t(currentLanguage, "feedback"), icon: Star, color: "bg-warning/10 text-warning", key: "feedback" },
    { name: t(currentLanguage, "prescriptions"), icon: Pill, color: "bg-destructive/10 text-destructive", key: "prescriptions" }
  ];

  // Bottom navigation items
  const bottomNavItems = [
    { id: "dashboard", name: t(currentLanguage, "home"), icon: Home },
    { id: "appointments", name: t(currentLanguage, "appointments"), icon: Calendar },
    { id: "patients", name: t(currentLanguage, "patients"), icon: Users },
    { id: "messages", name: t(currentLanguage, "messages"), icon: MessageCircle },
    { id: "profile", name: t(currentLanguage, "profile"), icon: User }
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
            {/* Language Selector */}
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <select 
                value={currentLanguage} 
                onChange={(e) => {
                  const value = e.target.value;
                  console.log("Language changed to:", value);
                  setCurrentLanguage(value);
                }}
                className="p-1 border rounded text-xs bg-background"
              >
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
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
              <span>{t(currentLanguage, "backToPortal")}</span>
            </Button>
            
            {/* Logout Button */}
            {onLogout && (
              <Button variant="outline" onClick={onLogout} className="md:hidden">
                {t(currentLanguage, "logout")}
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
                      {t(currentLanguage, "welcome")} {userName}!
                    </h1>
                    <p className="text-muted-foreground">
                      {t(currentLanguage, "appointmentsToday")} <span className="font-semibold text-primary">5 {t(currentLanguage, "appointments")}</span> {t(currentLanguage, "appointmentsTodayCount")}
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
                    <span>{t(currentLanguage, "todaySchedule")}</span>
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
                              {t(currentLanguage, "urgent")}
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
                        {t(currentLanguage, "startConsultation")}
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
                    <span>{t(currentLanguage, "recentActivity")}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { activity: `${t(currentLanguage, "consultationCompleted")} Meera Reddy`, time: "2 hours ago", type: "consultation" },
                    { activity: `${t(currentLanguage, "feedbackFrom")} Vikram Patel`, time: "4 hours ago", type: "message" },
                    { activity: `${t(currentLanguage, "ecgResults")} Rajesh Kumar`, time: "6 hours ago", type: "results" },
                    { activity: `${t(currentLanguage, "medicationsSent")}`, time: "1 day ago", type: "prescription" }
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