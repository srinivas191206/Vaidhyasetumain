import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PortalSelection from "./components/PortalSelection";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import RuralCenterDashboard from "./components/RuralCenterDashboard";
import VideoCallTestPage from "./components/VideoCallTestPage";
import NotificationTestPage from "./components/NotificationTestPage";

const queryClient = new QueryClient();

const App = () => {
  const [selectedPortal, setSelectedPortal] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [showVideoTest, setShowVideoTest] = useState(false);
  const [showNotificationTest, setShowNotificationTest] = useState(false);

  // Check URL for test modes
  useEffect(() => {
    if (window.location.search.includes('video-test')) {
      setShowVideoTest(true);
    } else if (window.location.search.includes('notification-test')) {
      setShowNotificationTest(true);
    }
  }, []);

  const handlePortalSelect = (portal: string) => {
    setSelectedPortal(portal);
  };

  const handleLogin = (name: string) => {
    setUserName(name);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName("");
    setSelectedPortal("");
  };

  const renderPortalContent = () => {
    if (!isLoggedIn) {
      return <Login onLogin={handleLogin} onBack={() => setSelectedPortal("")} />;
    }

    switch (selectedPortal) {
      case "specialist":
        return <Dashboard userName={userName} onLogout={handleLogout} />;
      case "rural-center":
        return (
          <RuralCenterDashboard 
            centerName="Rural Health Center - Andhra Pradesh" 
            onLogout={handleLogout}
          />
        );
      default:
        return <Dashboard userName={userName} onLogout={handleLogout} />;
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
          ) : !selectedPortal ? (
            <PortalSelection onPortalSelect={handlePortalSelect} />
          ) : (
            renderPortalContent()
          )}
        </div>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;