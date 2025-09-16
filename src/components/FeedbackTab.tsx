import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, MessageCircle, ThumbsUp, Heart } from "lucide-react";

const FeedbackTab = () => {
  const feedbacks = [
    {
      patient: "Rajesh Kumar",
      rating: 5,
      comment: "Dr. helped me understand my heart condition very well. The telemedicine consultation was very convenient for someone living in a remote area.",
      date: "2024-09-12",
      initials: "RK",
      condition: "Coronary Artery Disease"
    },
    {
      patient: "Priya Sharma",
      rating: 4,
      comment: "Very professional and thorough consultation. The doctor explained my blood pressure medication clearly and answered all my questions.",
      date: "2024-09-10",
      initials: "PS",
      condition: "Hypertension"
    },
    {
      patient: "Amit Singh", 
      rating: 5,
      comment: "Excellent diagnosis of my irregular heartbeat. The remote consultation saved me a 4-hour journey to the city. Very grateful for this service.",
      date: "2024-09-08",
      initials: "AS",
      condition: "Arrhythmia"
    },
    {
      patient: "Sunita Verma",
      rating: 5,
      comment: "Post-surgery follow-up was perfect. Doctor monitored my recovery well through video call and adjusted my medications as needed.",
      date: "2024-09-06",
      initials: "SV",
      condition: "Post Heart Surgery"
    },
    {
      patient: "Vikram Patel",
      rating: 4,
      comment: "Good advice on lifestyle changes for managing cholesterol. The doctor was patient and gave practical tips I can follow in my village.",
      date: "2024-09-04",
      initials: "VP",
      condition: "High Cholesterol"
    }
  ];

  const averageRating = (feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) / feedbacks.length).toFixed(1);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Patient Feedback</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{averageRating} Average Rating</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <ThumbsUp className="w-4 h-4" />
            <span>{feedbacks.length} Total Reviews</span>
          </div>
        </div>
      </div>

      {/* Overall Stats Card */}
      <Card className="glass-card shadow-medical">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-2">
                {renderStars(5)}
              </div>
              <p className="text-2xl font-bold text-primary">{averageRating}</p>
              <p className="text-sm text-muted-foreground">Overall Rating</p>
            </div>
            <div className="text-center">
              <Heart className="w-8 h-8 mx-auto mb-2 text-destructive" />
              <p className="text-2xl font-bold text-foreground">{feedbacks.length}</p>
              <p className="text-sm text-muted-foreground">Happy Patients</p>
            </div>
            <div className="text-center">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold text-foreground">98%</p>
              <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Feedback Cards */}
      <div className="space-y-4">
        {feedbacks.map((feedback, index) => (
          <Card 
            key={index} 
            className="glass-card shadow-medical hover:shadow-lg transition-all duration-300"
          >
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {feedback.initials}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-foreground">{feedback.patient}</h4>
                      <p className="text-xs text-muted-foreground">{feedback.condition}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        {renderStars(feedback.rating)}
                      </div>
                      <p className="text-xs text-muted-foreground">{feedback.date}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground italic">"{feedback.comment}"</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeedbackTab;