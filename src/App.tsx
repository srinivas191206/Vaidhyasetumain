import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import RuralCenterDashboard from "./components/RuralCenterDashboard";
import VideoCallTestPage from "./components/VideoCallTestPage";
import NotificationTestPage from "./components/NotificationTestPage";
import LanguageTest from "./components/LanguageTest";

const queryClient = new QueryClient();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState<"doctor" | "health-center" | "">("");
  const [language, setLanguage] = useState("english");
  const [showVideoTest, setShowVideoTest] = useState(false);
  const [showNotificationTest, setShowNotificationTest] = useState(false);
  const [showLanguageTest, setShowLanguageTest] = useState(false);

  // Check URL for test modes
  useEffect(() => {
    if (window.location.search.includes('video-test')) {
      setShowVideoTest(true);
    } else if (window.location.search.includes('notification-test')) {
      setShowNotificationTest(true);
    } else if (window.location.search.includes('language-test')) {
      setShowLanguageTest(true);
    }
  }, []);

  const handleLogin = (name: string, type: "doctor" | "health-center", lang: string) => {
    console.log("Login called with:", { name, type, lang });
    setUserName(name);
    setUserType(type);
    setLanguage(lang);
    setIsLoggedIn(true);
    console.log("State after login:", { isLoggedIn: true, userName: name, userType: type, language: lang });
  };

  const handleLogout = () => {
    console.log("Logout called");
    setIsLoggedIn(false);
    setUserName("");
    setUserType("");
  };

  const renderContent = () => {
    console.log("Rendering content with:", { isLoggedIn, userName, userType, language });
    
    if (!isLoggedIn) {
      console.log("Rendering Login component");
      return <Login onLogin={handleLogin} />;
    }

    console.log("User is logged in, checking userType:", userType);
    switch (userType) {
      case "doctor":
        console.log("Rendering Doctor Dashboard");
        return <Dashboard userName={userName} onLogout={handleLogout} language={language} />;
      case "health-center":
        console.log("Rendering Rural Center Dashboard");
        return (
          <RuralCenterDashboard 
            centerName="Rural Health Center - Nabha" 
            onLogout={handleLogout}
            language={language}
          />
        );
      default:
        console.log("Rendering default Doctor Dashboard, userType was:", userType);
        // Default to doctor portal if user type is not set
        return <Dashboard userName={userName} onLogout={handleLogout} language={language} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground">
          {showVideoTest ? (
            <VideoCallTestPage />
          ) : showNotificationTest ? (
            <NotificationTestPage />
          ) : showLanguageTest ? (
            <LanguageTest language={language} />
          ) : (
            renderContent()
          )}
        </div>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;