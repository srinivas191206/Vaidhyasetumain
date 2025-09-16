import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, Star, MessageCircle, Pill, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NotificationDropdown = () => {
  const [unreadCount] = useState(5);

  const notifications = [
    {
      type: "appointment",
      icon: Calendar,
      title: "New Appointment Booked",
      message: "Rajesh Kumar scheduled for cardiac consultation tomorrow at 10:30 AM",
      time: "5 minutes ago",
      unread: true
    },
    {
      type: "feedback", 
      icon: Star,
      title: "Patient Feedback Received",
      message: "Priya Sharma rated your consultation 5 stars with positive feedback",
      time: "1 hour ago", 
      unread: true
    },
    {
      type: "consultation",
      icon: Users,
      title: "Consultation Completed",
      message: "Successfully completed telemedicine session with Amit Singh - Arrhythmia follow-up",
      time: "2 hours ago",
      unread: true
    },
    {
      type: "prescription",
      icon: Pill,
      title: "Prescription Dispensed",
      message: "Sunita Verma's cardiac medications have been dispensed at Rural Health Center",
      time: "4 hours ago",
      unread: false
    },
    {
      type: "feedback",
      icon: MessageCircle, 
      title: "Rural Center Message",
      message: "Gandhinagar Health Center requests cardiology consultation for emergency case",
      time: "6 hours ago",
      unread: true
    },
    {
      type: "appointment",
      icon: Calendar,
      title: "Appointment Reminder", 
      message: "Vikram Patel's cholesterol follow-up scheduled for 3:30 PM today",
      time: "1 day ago",
      unread: false
    }
  ];

  const getIconColor = (type: string) => {
    switch (type) {
      case "appointment": return "text-primary";
      case "feedback": return "text-yellow-500";
      case "consultation": return "text-success";
      case "prescription": return "text-purple-500";
      default: return "text-muted-foreground";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full text-xs flex items-center justify-center text-destructive-foreground font-medium">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 glass-card" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          <span className="text-xs text-muted-foreground">{unreadCount} unread</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="max-h-80 overflow-y-auto">
          {notifications.map((notification, index) => (
            <DropdownMenuItem 
              key={index}
              className={`p-3 cursor-pointer ${notification.unread ? 'bg-primary/5' : ''}`}
            >
              <div className="flex items-start space-x-3 w-full">
                <div className={`p-2 rounded-full bg-muted/50 ${getIconColor(notification.type)}`}>
                  <notification.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {notification.title}
                    </p>
                    {notification.unread && (
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {notification.time}
                  </p>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </div>
        
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-center text-primary hover:text-primary/80">
          View All Notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;