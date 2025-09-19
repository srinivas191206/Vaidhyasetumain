import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Heart, Calendar, FileText, Activity, Pill, TestTube, User, Stethoscope, Eye } from "lucide-react";

interface PatientsTabProps {
  searchQuery?: string;
}

const PatientsTab = ({ searchQuery = "" }: PatientsTabProps) => {
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  const patients = [
    {
      name: "Rajesh Kumar",
      age: 45,
      condition: "Coronary Artery Disease",
      lastVisit: "2024-09-10",
      status: "Active Treatment",
      consultations: 8,
      initials: "RK"
    },
    {
      name: "Priya Sharma", 
      age: 52,
      condition: "Hypertension",
      lastVisit: "2024-09-12",
      status: "Follow-up Required",
      consultations: 5,
      initials: "PS"
    },
    {
      name: "Amit Singh",
      age: 38,
      condition: "Arrhythmia",
      lastVisit: "2024-09-08",
      status: "Monitoring",
      consultations: 12,
      initials: "AS"
    },
    {
      name: "Sunita Verma",
      age: 60,
      condition: "Heart Valve Disease",
      lastVisit: "2024-09-05",
      status: "Post-Surgery",
      consultations: 15,
      initials: "SV"
    },
    {
      name: "Vikram Patel",
      age: 35,
      condition: "High Cholesterol",
      lastVisit: "2024-09-14",
      status: "Lifestyle Management",
      consultations: 3,
      initials: "VP"
    },
    {
      name: "Meera Reddy",
      age: 48,
      condition: "Cardiomyopathy",
      lastVisit: "2024-09-11",
      status: "Stable",
      consultations: 20,
      initials: "MR"
    }
  ];

  // Filter patients based on search query
  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active Treatment": return "bg-destructive/10 text-destructive";
      case "Follow-up Required": return "bg-warning/10 text-warning";
      case "Monitoring": return "bg-primary/10 text-primary";
      case "Post-Surgery": return "bg-secondary/50 text-secondary-foreground";
      case "Lifestyle Management": return "bg-success/10 text-success";
      case "Stable": return "bg-success/10 text-success";
      default: return "bg-muted/50 text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">My Patients</h2>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Heart className="w-4 h-4" />
          <span>{filteredPatients.length} Cardiology Patients</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filteredPatients.map((patient, index) => (
          <Card 
            key={index} 
            className="glass-card shadow-medical hover:shadow-lg transition-all duration-300"
          >
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {patient.initials}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground text-lg">{patient.name}</h3>
                    <span className="text-sm text-muted-foreground">Age {patient.age}</span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">{patient.condition}</p>
                  
                  <div className="flex items-center space-x-4 mb-3 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>Last visit: {patient.lastVisit}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FileText className="w-3 h-3" />
                      <span>{patient.consultations} consultations</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(patient.status)}`}>
                      {patient.status}
                    </span>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedPatient(patient)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View Records
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh]">
                        <DialogHeader>
                          <DialogTitle className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                {patient.initials}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="text-xl">Medical Records - {patient.name}</span>
                              <div className="text-sm text-muted-foreground font-normal">
                                {patient.age} years • {patient.condition}
                              </div>
                            </div>
                          </DialogTitle>
                        </DialogHeader>
                        
                        <ScrollArea className="h-[600px] mt-4">
                          <div className="space-y-6">
                            {/* Patient Overview */}
                            <div className="grid md:grid-cols-2 gap-4">
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-sm flex items-center space-x-2">
                                    <User className="w-4 h-4 text-primary" />
                                    <span>Patient Information</span>
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <span className="text-muted-foreground">Age:</span>
                                      <p className="font-medium">{patient.age} years</p>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Status:</span>
                                      <Badge className="text-xs">{patient.status}</Badge>
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Primary Condition:</span>
                                    <p className="font-medium">{patient.condition}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Last Visit:</span>
                                    <p className="font-medium">{patient.lastVisit}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Total Consultations:</span>
                                    <p className="font-medium">{patient.consultations}</p>
                                  </div>
                                </CardContent>
                              </Card>

                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-sm flex items-center space-x-2">
                                    <Activity className="w-4 h-4 text-green-600" />
                                    <span>Recent Vitals</span>
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <span className="text-muted-foreground">Blood Pressure:</span>
                                      <p className="font-medium">120/80 mmHg</p>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Heart Rate:</span>
                                      <p className="font-medium">72 bpm</p>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Temperature:</span>
                                      <p className="font-medium">98.6°F</p>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">O2 Sat:</span>
                                      <p className="font-medium">98%</p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>

                            {/* Recent Consultations */}
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-sm flex items-center space-x-2">
                                  <Stethoscope className="w-4 h-4 text-primary" />
                                  <span>Recent Consultations</span>
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                {[
                                  {
                                    date: patient.lastVisit,
                                    type: "Follow-up",
                                    doctor: "Dr. Varun Sharma",
                                    diagnosis: `${patient.condition} - stable on current therapy`,
                                    notes: "Patient responding well to treatment. Continue current medications."
                                  },
                                  {
                                    date: "2024-08-15",
                                    type: "Initial Consultation",
                                    doctor: "Dr. Varun Sharma",
                                    diagnosis: `Initial diagnosis of ${patient.condition}`,
                                    notes: "Comprehensive evaluation completed. Treatment plan initiated."
                                  }
                                ].map((consultation, idx) => (
                                  <div key={idx} className="p-3 border rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center space-x-2">
                                        <Badge variant="outline" className="text-xs">{consultation.type}</Badge>
                                        <span className="text-sm text-muted-foreground">{consultation.date}</span>
                                      </div>
                                      <span className="text-sm font-medium">{consultation.doctor}</span>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-sm font-medium">{consultation.diagnosis}</p>
                                      <p className="text-xs text-muted-foreground">{consultation.notes}</p>
                                    </div>
                                  </div>
                                ))}
                              </CardContent>
                            </Card>

                            {/* Current Medications */}
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-sm flex items-center space-x-2">
                                  <Pill className="w-4 h-4 text-blue-600" />
                                  <span>Current Medications</span>
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-2">
                                {[
                                  { name: "Atorvastatin", dosage: "20mg", frequency: "Once daily", startDate: "2024-08-15" },
                                  { name: "Metoprolol", dosage: "50mg", frequency: "Twice daily", startDate: "2024-08-15" },
                                  { name: "Aspirin", dosage: "75mg", frequency: "Once daily", startDate: "2024-08-15" }
                                ].map((med, idx) => (
                                  <div key={idx} className="p-2 bg-muted/30 rounded text-sm">
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium">{med.name}</span>
                                      <span className="text-muted-foreground">{med.startDate}</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {med.dosage} - {med.frequency}
                                    </div>
                                  </div>
                                ))}
                              </CardContent>
                            </Card>

                            {/* Lab Results */}
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-sm flex items-center space-x-2">
                                  <TestTube className="w-4 h-4 text-purple-600" />
                                  <span>Recent Lab Results</span>
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-2">
                                {[
                                  { date: "2024-09-08", test: "Lipid Profile", result: "Total Cholesterol: 180 mg/dL", status: "Normal" },
                                  { date: "2024-09-08", test: "HbA1c", result: "6.8%", status: "Controlled" },
                                  { date: "2024-08-25", test: "ECG", result: "Normal sinus rhythm", status: "Normal" }
                                ].map((lab, idx) => (
                                  <div key={idx} className="p-2 border rounded text-sm">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="font-medium">{lab.test}</span>
                                      <div className="flex items-center space-x-2">
                                        <Badge 
                                          variant={lab.status === "Normal" ? "default" : "secondary"}
                                          className="text-xs"
                                        >
                                          {lab.status}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">{lab.date}</span>
                                      </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{lab.result}</p>
                                  </div>
                                ))}
                              </CardContent>
                            </Card>
                          </div>
                        </ScrollArea>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PatientsTab;