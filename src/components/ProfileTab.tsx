import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  User, 
  MapPin, 
  GraduationCap, 
  Heart, 
  Star, 
  Calendar, 
  Users, 
  Award,
  Stethoscope,
  Clock,
  TrendingUp,
  Check
} from "lucide-react";

interface ProfileTabProps {
  userName: string;
}

const ProfileTab = ({ userName }: ProfileTabProps) => {
  // State for off days selection
  const [selectedOffDays, setSelectedOffDays] = useState<string[]>([]);
  const [savedOffDays, setSavedOffDays] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const doctorProfile = {
    name: userName,
    specialization: "General Doctor",
    qualification: "MBBS, MD (General Medicine)",
    institution: "All India Institute of Medical Sciences (AIIMS), New Delhi",
    experience: "8 years",
    joinedMediConnect: "January 2022",
    totalConsultations: 2847,
    completionRate: 98.2,
    averageRating: 4.8,
    responseTime: "< 2 minutes",
    specializations: [
      "General Medicine",
      "Preventive Healthcare", 
      "Chronic Disease Management",
      "Emergency Care",
      "Health Education"
    ],
    achievements: [
      "Top Rated General Practitioner 2024",
      "Excellence in Rural Healthcare",
      "1000+ Successful Consultations",
      "Patient Choice Award"
    ],
    recentFeedback: [
      {
        patient: "Meera Reddy",
        rating: 5,
        comment: "Dr. Varun saved my father's life! His quick diagnosis and treatment plan were exceptional. Truly grateful for his expertise.",
        date: "2 days ago"
      },
      {
        patient: "Rajesh Kumar", 
        rating: 5,
        comment: "Excellent consultation! The doctor explained everything clearly and the follow-up care instructions were very helpful.",
        date: "1 week ago"
      },
      {
        patient: "Priya Sharma",
        rating: 4,
        comment: "Very professional and knowledgeable. The video consultation went smoothly and I felt comfortable throughout.",
        date: "2 weeks ago"
      },
      {
        patient: "Amit Singh",
        rating: 5,
        comment: "Outstanding service! Dr. Varun's quick response to my emergency case was life-saving. Highly recommend!",
        date: "3 weeks ago"
      },
      {
        patient: "Sunita Verma",
        rating: 5,
        comment: "Post-surgery consultation was thorough and reassuring. The doctor's caring approach made all the difference.",
        date: "1 month ago"
      }
    ]
  };

  const monthlyStats = [
    { month: "Jan", consultations: 245 },
    { month: "Feb", consultations: 268 },
    { month: "Mar", consultations: 287 },
    { month: "Apr", consultations: 312 },
    { month: "May", consultations: 298 },
    { month: "Jun", consultations: 334 }
  ];

  // Days of the week
  const daysOfWeek = [
    { id: "monday", name: "Monday" },
    { id: "tuesday", name: "Tuesday" },
    { id: "wednesday", name: "Wednesday" },
    { id: "thursday", name: "Thursday" },
    { id: "friday", name: "Friday" },
    { id: "saturday", name: "Saturday" },
    { id: "sunday", name: "Sunday" }
  ];

  // Handle off day selection
  const toggleOffDay = (dayId: string) => {
    if (selectedOffDays.includes(dayId)) {
      setSelectedOffDays(selectedOffDays.filter(day => day !== dayId));
    } else {
      setSelectedOffDays([...selectedOffDays, dayId]);
    }
  };

  // Save off days
  const saveOffDays = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSavedOffDays([...selectedOffDays]);
      setIsSaving(false);
      alert("Your off days have been saved successfully!");
    }, 500);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <User className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Professional Profile</h2>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          Verified Admin
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Profile Card */}
        <Card className="lg:col-span-2 glass-card shadow-medical">
          <CardHeader>
            <div className="flex items-start space-x-4">
              <div className="p-4 rounded-full bg-primary/10 text-primary">
                <Stethoscope className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl text-foreground">Dr. {doctorProfile.name}</CardTitle>
                <p className="text-lg text-primary font-semibold mt-1">{doctorProfile.specialization}</p>
                <p className="text-muted-foreground">{doctorProfile.qualification}</p>
                
                <div className="flex items-center space-x-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{doctorProfile.institution}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 mt-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{doctorProfile.experience} Experience</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Clinic Pro since {doctorProfile.joinedMediConnect}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Key Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground">{doctorProfile.totalConsultations.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Consultations</div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-center mb-2">
                  <Star className="w-6 h-6 text-warning fill-warning" />
                </div>
                <div className="text-2xl font-bold text-foreground">{doctorProfile.averageRating}</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-6 h-6 text-success" />
                </div>
                <div className="text-2xl font-bold text-foreground">{doctorProfile.completionRate}%</div>
                <div className="text-sm text-muted-foreground">Completion Rate</div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground">{doctorProfile.responseTime}</div>
                <div className="text-sm text-muted-foreground">Response Time</div>
              </div>
            </div>

            {/* Specializations */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Areas of Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {doctorProfile.specializations.map((spec, index) => (
                  <Badge key={index} variant="outline" className="px-3 py-1">
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Off Days Selection */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Weekly Off Days</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Select the days when you will be unavailable for consultations. This will help patients and health centers schedule appointments accordingly.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2 mb-4">
                {daysOfWeek.map((day) => (
                  <Button
                    key={day.id}
                    variant={selectedOffDays.includes(day.id) ? "default" : "outline"}
                    className={`h-12 flex flex-col items-center justify-center ${
                      selectedOffDays.includes(day.id) 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-background hover:bg-accent"
                    }`}
                    onClick={() => toggleOffDay(day.id)}
                  >
                    <span className="text-xs font-medium">{day.name.substring(0, 3)}</span>
                    {selectedOffDays.includes(day.id) && (
                      <Check className="w-3 h-3 mt-1" />
                    )}
                  </Button>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {selectedOffDays.length > 0 
                    ? `Selected: ${selectedOffDays.map(dayId => 
                        daysOfWeek.find(d => d.id === dayId)?.name
                      ).join(", ")}` 
                    : "No off days selected"}
                </div>
                <Button 
                  onClick={saveOffDays}
                  disabled={isSaving || selectedOffDays.length === 0}
                  className="medical-gradient"
                >
                  {isSaving ? "Saving..." : "Save Off Days"}
                </Button>
              </div>
              
              {savedOffDays.length > 0 && (
                <div className="mt-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    <strong>Saved:</strong> Your off days are set to: {
                      savedOffDays.map(dayId => 
                        daysOfWeek.find(d => d.id === dayId)?.name
                      ).join(", ")
                    }
                  </p>
                </div>
              )}
            </div>

            {/* Achievements */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Achievements & Recognition</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {doctorProfile.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 rounded-lg bg-muted/50">
                    <Award className="w-5 h-5 text-warning" />
                    <span className="text-sm font-medium">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Stats */}
        <div className="space-y-6">
          <Card className="glass-card shadow-medical">
            <CardHeader>
              <CardTitle className="text-lg">Performance Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Patient Satisfaction</span>
                  <span>{Math.round(doctorProfile.averageRating * 20)}%</span>
                </div>
                <Progress value={doctorProfile.averageRating * 20} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Consultation Completion</span>
                  <span>{doctorProfile.completionRate}%</span>
                </div>
                <Progress value={doctorProfile.completionRate} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>On-time Response</span>
                  <span>96%</span>
                </div>
                <Progress value={96} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card shadow-medical">
            <CardHeader>
              <CardTitle className="text-lg">Monthly Consultations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {monthlyStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{stat.month}</span>
                    <span className="font-medium">{stat.consultations}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Patient Feedback */}
      <Card className="glass-card shadow-medical">
        <CardHeader>
          <CardTitle className="text-lg">Recent Patient Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {doctorProfile.recentFeedback.map((feedback, index) => (
              <div key={index} className="p-4 rounded-lg bg-muted/50 border-l-4 border-primary">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-foreground">{feedback.patient}</span>
                    <div className="flex items-center space-x-1">
                      {[...Array(feedback.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">{feedback.date}</span>
                </div>
                <p className="text-sm text-muted-foreground italic">"{feedback.comment}"</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileTab;