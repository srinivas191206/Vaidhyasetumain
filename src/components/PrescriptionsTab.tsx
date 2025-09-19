import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Pill, Calendar, User, FileText, Heart } from "lucide-react";

interface PrescriptionsTabProps {
  searchQuery?: string;
}

const PrescriptionsTab = ({ searchQuery = "" }: PrescriptionsTabProps) => {
  const prescriptions = [
    {
      patient: "Rajesh Kumar",
      age: 45,
      condition: "Coronary Artery Disease",
      date: "2024-09-12",
      initials: "RK",
      medications: [
        { name: "Atorvastatin", dosage: "20mg", frequency: "Once daily", duration: "3 months" },
        { name: "Metoprolol", dosage: "50mg", frequency: "Twice daily", duration: "3 months" },
        { name: "Aspirin", dosage: "75mg", frequency: "Once daily", duration: "Ongoing" }
      ]
    },
    {
      patient: "Priya Sharma",
      age: 52, 
      condition: "Hypertension",
      date: "2024-09-10",
      initials: "PS",
      medications: [
        { name: "Amlodipine", dosage: "5mg", frequency: "Once daily", duration: "2 months" },
        { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", duration: "2 months" }
      ]
    },
    {
      patient: "Amit Singh",
      age: 38,
      condition: "Arrhythmia", 
      date: "2024-09-08",
      initials: "AS",
      medications: [
        { name: "Amiodarone", dosage: "200mg", frequency: "Twice daily", duration: "1 month" },
        { name: "Warfarin", dosage: "5mg", frequency: "Once daily", duration: "6 months" }
      ]
    },
    {
      patient: "Sunita Verma",
      age: 60,
      condition: "Post Heart Surgery",
      date: "2024-09-06", 
      initials: "SV",
      medications: [
        { name: "Clopidogrel", dosage: "75mg", frequency: "Once daily", duration: "6 months" },
        { name: "Pantoprazole", dosage: "40mg", frequency: "Once daily", duration: "1 month" },
        { name: "Furosemide", dosage: "20mg", frequency: "Twice daily", duration: "2 weeks" }
      ]
    },
    {
      patient: "Vikram Patel",
      age: 35,
      condition: "High Cholesterol",
      date: "2024-09-04",
      initials: "VP", 
      medications: [
        { name: "Rosuvastatin", dosage: "10mg", frequency: "Once daily", duration: "3 months" },
        { name: "Omega-3", dosage: "1000mg", frequency: "Twice daily", duration: "3 months" }
      ]
    }
  ];

  // Filter prescriptions based on search query
  const filteredPrescriptions = prescriptions.filter(prescription => 
    prescription.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prescription.condition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Pill className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Recent Prescriptions</h2>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Heart className="w-4 h-4" />
          <span>Cardiology Medications</span>
        </div>
      </div>

      <div className="space-y-6">
        {filteredPrescriptions.map((prescription, index) => (
          <Card 
            key={index} 
            className="glass-card shadow-medical hover:shadow-lg transition-all duration-300"
          >
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Patient Info */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                        {prescription.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">{prescription.patient}</h3>
                      <p className="text-sm text-muted-foreground">Age {prescription.age}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Heart className="w-4 h-4 text-destructive" />
                      <span className="font-medium text-foreground">{prescription.condition}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Prescribed: {prescription.date}</span>
                    </div>
                  </div>
                </div>

                {/* Medications */}
                <div className="md:col-span-2">
                  <div className="flex items-center space-x-2 mb-4">
                    <Pill className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold text-foreground">Prescribed Medications</h4>
                  </div>
                  
                  <div className="space-y-3">
                    {prescription.medications.map((med, medIndex) => (
                      <div 
                        key={medIndex}
                        className="p-3 rounded-lg bg-muted/30 border border-border/50"
                      >
                        <div className="grid md:grid-cols-4 gap-2 text-sm">
                          <div>
                            <p className="font-semibold text-foreground">{med.name}</p>
                            <p className="text-xs text-muted-foreground">Medication</p>
                          </div>
                          <div>
                            <p className="font-medium text-primary">{med.dosage}</p>
                            <p className="text-xs text-muted-foreground">Dosage</p>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{med.frequency}</p>
                            <p className="text-xs text-muted-foreground">Frequency</p>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{med.duration}</p>
                            <p className="text-xs text-muted-foreground">Duration</p>
                          </div>
                        </div>
                      </div>
                    ))}
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

export default PrescriptionsTab;