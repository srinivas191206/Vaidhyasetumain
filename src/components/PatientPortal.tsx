import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  User, 
  Calendar, 
  Heart, 
  Pill, 
  FileText, 
  Phone,
  Video,
  Clock,
  MapPin,
  Activity,
  Download,
  MessageCircle,
  Bell,
  Star
} from "lucide-react";

interface PatientPortalProps {
  patientName: string;
  onLogout: () => void;
}

const PatientPortal = ({ patientName, onLogout }: PatientPortalProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  const upcomingAppointments = [
    {
      date: "2024-09-20",
      time: "11:00 AM",
      doctor: "Dr. Varun Sharma",
      specialty: "Cardiology",
      type: "Follow-up Consultation",
      status: "Confirmed"
    },
    {
      date: "2024-10-01",
      time: "2:00 PM",
      doctor: "Dr. Priya Mehta",
      specialty: "Cardiology",
      type: "Regular Check-up",
      status: "Pending"
    }
  ];

  const recentConsultations = [
    {
      date: "2024-09-10",
      doctor: "Dr. Varun Sharma",
      diagnosis: "Hypertension - well controlled",
      prescription: "Continue current medications",
      rating: 5,
      notes: "Blood pressure readings are stable. Continue lifestyle modifications."
    },
    {
      date: "2024-08-15",
      doctor: "Dr. Varun Sharma", 
      diagnosis: "Initial hypertension diagnosis",
      prescription: "Amlodipine 5mg once daily",
      rating: 5,
      notes: "Started on blood pressure medication. Follow-up in 4 weeks."
    }
  ];

  const currentMedications = [
    {
      name: "Amlodipine",
      dosage: "5mg",
      frequency: "Once daily",
      prescribedBy: "Dr. Varun Sharma",
      startDate: "2024-08-15",
      refillDate: "2024-10-15"
    },
    {
      name: "Aspirin",
      dosage: "75mg", 
      frequency: "Once daily",
      prescribedBy: "Dr. Varun Sharma",
      startDate: "2024-08-15",
      refillDate: "2024-10-15"
    }
  ];

  const labResults = [
    {
      date: "2024-09-08",
      test: "Blood Pressure Monitoring",
      result: "Average: 128/82 mmHg",
      status: "Normal",
      doctor: "Dr. Varun Sharma"
    },
    {
      date: "2024-08-10",
      test: "Basic Metabolic Panel",
      result: "All values within normal range",
      status: "Normal",
      doctor: "Dr. Varun Sharma"
    }
  ];

  const healthReminders = [
    {
      type: "Medication",
      message: "Take Amlodipine 5mg - Due in 2 hours",
      time: "9:00 AM",
      icon: Pill
    },
    {
      type: "Appointment",
      message: "Follow-up with Dr. Varun Sharma in 3 days",
      time: "Sept 20",
      icon: Calendar
    },
    {
      type: "Health Tip",
      message: "Monitor blood pressure - Record twice daily",
      time: "Daily",
      icon: Heart
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-purple-500/10 text-purple-600">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Welcome, {patientName}</h1>
              <p className="text-xs text-muted-foreground">Patient Portal - Vaidhya Setu</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="outline" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Health Overview Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4 text-center">
              <div className="p-2 rounded-full bg-blue-500 text-white mx-auto mb-2 w-fit">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">Blood Pressure</h3>
              <p className="text-lg font-bold text-blue-700 dark:text-blue-300">128/82</p>
              <p className="text-xs text-blue-600 dark:text-blue-400">Normal Range</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
            <CardContent className="p-4 text-center">
              <div className="p-2 rounded-full bg-green-500 text-white mx-auto mb-2 w-fit">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-green-900 dark:text-green-100">Heart Rate</h3>
              <p className="text-lg font-bold text-green-700 dark:text-green-300">72 bpm</p>
              <p className="text-xs text-green-600 dark:text-green-400">Healthy</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
            <CardContent className="p-4 text-center">
              <div className="p-2 rounded-full bg-purple-500 text-white mx-auto mb-2 w-fit">
                <Pill className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-purple-900 dark:text-purple-100">Medications</h3>
              <p className="text-lg font-bold text-purple-700 dark:text-purple-300">{currentMedications.length}</p>
              <p className="text-xs text-purple-600 dark:text-purple-400">Active</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
            <CardContent className="p-4 text-center">
              <div className="p-2 rounded-full bg-orange-500 text-white mx-auto mb-2 w-fit">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-orange-900 dark:text-orange-100">Next Appointment</h3>
              <p className="text-lg font-bold text-orange-700 dark:text-orange-300">Sept 20</p>
              <p className="text-xs text-orange-600 dark:text-orange-400">3 days</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Upcoming Appointments */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span>Upcoming Appointments</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingAppointments.map((appointment, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{appointment.doctor}</h4>
                      <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="w-3 h-3 text-primary" />
                        <span className="text-xs text-primary">{appointment.date} at {appointment.time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{appointment.type}</p>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <Badge variant={appointment.status === "Confirmed" ? "default" : "secondary"}>
                      {appointment.status}
                    </Badge>
                    <div className="space-y-1">
                      <Button size="sm" className="w-full">
                        <Video className="w-3 h-3 mr-1" />
                        Join Call
                      </Button>
                      <Button size="sm" variant="outline" className="w-full">
                        Reschedule
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button className="w-full" variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Book New Appointment
              </Button>
            </CardContent>
          </Card>

          {/* Health Reminders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-yellow-600" />
                <span>Health Reminders</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {healthReminders.map((reminder, index) => {
                const IconComponent = reminder.icon;
                return (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                    <div className="p-1 rounded bg-primary/10 text-primary">
                      <IconComponent className="w-3 h-3" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{reminder.message}</p>
                      <div className="flex items-center justify-between mt-1">
                        <Badge variant="outline" className="text-xs">{reminder.type}</Badge>
                        <span className="text-xs text-muted-foreground">{reminder.time}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Recent Consultations & Medications */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Consultations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-primary" />
                <span>Recent Consultations</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentConsultations.map((consultation, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-foreground">{consultation.doctor}</h4>
                      <p className="text-sm text-muted-foreground">{consultation.date}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[...Array(consultation.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-foreground">Diagnosis: </span>
                      <span className="text-sm text-muted-foreground">{consultation.diagnosis}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-foreground">Prescription: </span>
                      <span className="text-sm text-muted-foreground">{consultation.prescription}</span>
                    </div>
                    <p className="text-xs text-muted-foreground italic">{consultation.notes}</p>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <Button size="sm" variant="outline">
                      <Download className="w-3 h-3 mr-1" />
                      Download Report
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageCircle className="w-3 h-3 mr-1" />
                      Message Doctor
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Current Medications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Pill className="w-5 h-5 text-blue-600" />
                <span>Current Medications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentMedications.map((medication, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-foreground">{medication.name}</h4>
                    <Badge variant="outline" className="text-xs">Active</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Dosage: </span>
                      <span className="font-medium">{medication.dosage}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Frequency: </span>
                      <span className="font-medium">{medication.frequency}</span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <p>Prescribed by: {medication.prescribedBy}</p>
                    <p>Started: {medication.startDate}</p>
                    <p>Next refill: {medication.refillDate}</p>
                  </div>
                  <Button size="sm" variant="outline" className="w-full mt-2">
                    <Phone className="w-3 h-3 mr-1" />
                    Request Refill
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Lab Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-green-600" />
              <span>Lab Results & Reports</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {labResults.map((result, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-foreground">{result.test}</h4>
                    <Badge variant={result.status === "Normal" ? "default" : "secondary"}>
                      {result.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{result.result}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{result.date}</span>
                    <span>{result.doctor}</span>
                  </div>
                  <Button size="sm" variant="outline" className="w-full mt-2">
                    <Download className="w-3 h-3 mr-1" />
                    Download Report
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PatientPortal;