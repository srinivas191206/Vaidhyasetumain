import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, MapPin, Clock, User, Heart, AlertCircle, Video } from "lucide-react";
import VideoConsultation from "./VideoConsultation";

const MessagesTab = () => {
  const [newMessage, setNewMessage] = useState("");
  const [selectedChat, setSelectedChat] = useState(0);
  const [videoConsultation, setVideoConsultation] = useState<{
    isOpen: boolean;
    patient: any;
  }>({ isOpen: false, patient: null });

  const healthCenters = [
    {
      name: "Rural Health Center - Rajasthan",
      location: "Jaipur District",
      lastMessage: "Patient Meera needs urgent cardiac consultation",
      time: "2 min ago",
      unread: 3,
      online: true
    },
    {
      name: "PHC Haryana",
      location: "Gurugram District", 
      lastMessage: "Thank you for the ECG analysis, patient is stable now",
      time: "15 min ago",
      unread: 0,
      online: true
    },
    {
      name: "Community Health Center - UP",
      location: "Lucknow District",
      lastMessage: "We have 2 patients waiting for cardiology screening",
      time: "1 hour ago",
      unread: 1,
      online: false
    },
    {
      name: "Rural Clinic Maharashtra",
      location: "Pune District",
      lastMessage: "Patient Rajesh Kumar's follow-up reports are ready",
      time: "3 hours ago",
      unread: 0,
      online: true
    }
  ];

  const conversations = [
    {
      messages: [
        {
          sender: "Rural Health Center - Rajasthan",
          message: "Good morning Dr. Sahib! We have an urgent case here.",
          time: "09:30 AM",
          isDoctor: false
        },
        {
          sender: "Rural Health Center - Rajasthan", 
          message: "45-year-old female Meera Devi presenting with severe chest pain and shortness of breath. BP: 160/95, HR: 95 bpm",
          time: "09:32 AM",
          isDoctor: false
        },
        {
          sender: "Dr. Varun",
          message: "Thank you for the update. Can you please get an ECG done immediately? Also check her oxygen saturation levels.",
          time: "09:35 AM", 
          isDoctor: true
        },
        {
          sender: "Rural Health Center - Rajasthan",
          message: "ECG shows ST elevation in leads II, III, aVF. O2 sat is 92% on room air. What should we do next?",
          time: "09:40 AM",
          isDoctor: false
        },
        {
          sender: "Dr. Varun",
          message: "This looks like an acute MI. Please start her on oxygen, give aspirin 300mg stat, and prepare for immediate transfer to nearest cardiac center. I'll coordinate with the referral hospital.",
          time: "09:42 AM",
          isDoctor: true
        },
        {
          sender: "Rural Health Center - Rajasthan",
          message: "Patient Meera needs urgent cardiac consultation. Can we schedule a video call in 10 minutes?",
          time: "Just now",
          isDoctor: false
        }
      ]
    }
  ];

  const sendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message
      setNewMessage("");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Rural Health Communications</h2>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Heart className="w-4 h-4" />
          <span>Connecting Rural India</span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 h-[600px]">
        {/* Health Centers List */}
        <Card className="glass-card shadow-medical">
          <CardHeader>
            <CardTitle className="text-lg">Health Centers</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              {healthCenters.map((center, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedChat(index)}
                  className={`p-4 border-b cursor-pointer transition-colors hover:bg-muted/50 ${
                    selectedChat === index ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-sm">{center.name}</h3>
                        {center.online && (
                          <div className="w-2 h-2 bg-success rounded-full"></div>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{center.location}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                        {center.lastMessage}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">{center.time}</span>
                        {center.unread > 0 && (
                          <Badge variant="destructive" className="text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center">
                            {center.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Messages */}
        <Card className="md:col-span-2 glass-card shadow-medical">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-lg">{healthCenters[selectedChat].name}</CardTitle>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{healthCenters[selectedChat].location}</span>
                    {healthCenters[selectedChat].online && (
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span>Online</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Button 
                size="sm" 
                className="medical-gradient"
                onClick={() => setVideoConsultation({
                  isOpen: true,
                  patient: {
                    name: "Emergency Patient - Meera Devi",
                    age: 45,
                    condition: "Acute Chest Pain",
                    time: "Emergency",
                    urgent: true,
                    bloodPressure: "160/95",
                    heartRate: "95 bpm",
                    symptoms: "Severe chest pain and shortness of breath"
                  }
                })}
              >
                <Video className="w-4 h-4 mr-2" />
                Emergency Call
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col h-[450px]">
            {/* Messages */}
            <ScrollArea className="flex-1 mb-4">
              <div className="space-y-4 p-2">
                {conversations[selectedChat]?.messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.isDoctor ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.isDoctor
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <div className={`flex items-center justify-between mt-2 text-xs ${
                        msg.isDoctor ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}>
                        <span>{msg.isDoctor ? 'You' : msg.sender}</span>
                        <span>{msg.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Type your message to the health center..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1"
              />
              <Button 
                onClick={sendMessage}
                size="icon"
                className="medical-gradient"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
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

export default MessagesTab;