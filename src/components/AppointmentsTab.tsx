import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Clock, User, Heart, Star, CheckCircle2, Eye, RotateCcw, ChevronLeft, ChevronRight, Video } from "lucide-react";
import { format, parseISO, differenceInMinutes, addDays, isBefore, isAfter, isToday, isTomorrow, isSameDay, getDay, isSameMonth, addWeeks, subWeeks, startOfMonth, endOfMonth } from "date-fns";
import VideoConsultation from "./VideoConsultation";

interface AppointmentsTabProps {
  searchQuery?: string;
}

const AppointmentsTab = ({ searchQuery = "" }: AppointmentsTabProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [rescheduleDialog, setRescheduleDialog] = useState<{ open: boolean; appointmentIndex: number }>({ open: false, appointmentIndex: -1 });
  const [calendarSelectedDate, setCalendarSelectedDate] = useState<Date | undefined>(new Date());
  const [videoConsultation, setVideoConsultation] = useState<{
    isOpen: boolean;
    patient: any;
  }>({ isOpen: false, patient: null });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Function to check if a date is an off day (Sunday = 0, Wednesday = 3)
  const isOffDay = (date: Date) => {
    const dayOfWeek = getDay(date);
    return dayOfWeek === 0 || dayOfWeek === 3; // Sunday or Wednesday
  };

  // Generate more appointments for different dates
  const generateAppointmentsForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const patientNames = ["Rajesh Kumar", "Priya Sharma", "Amit Singh", "Sunita Verma", "Vikram Patel", "Arjun Reddy", "Meera Joshi", "Ravi Gupta", "Anita Kapoor", "Deepak Nair"];
    const conditions = ["Chest Pain Evaluation", "Hypertension Follow-up", "Arrhythmia Assessment", "Post-Surgery Check", "Cardiac Risk Assessment", "Stress Test", "Pacemaker Check"];
    const types = ["Initial Consultation", "Follow-up", "Emergency", "Post-Op", "Screening", "Diagnostic"];
    
    const numAppointments = Math.floor(Math.random() * 4) + 1; // 1-4 appointments per day
    const appointments = [];
    
    for (let i = 0; i < numAppointments; i++) {
      const hour = 9 + i * 2; // Start at 9 AM, every 2 hours
      const time = `${hour > 12 ? hour - 12 : hour}:${i % 2 === 0 ? '00' : '30'} ${hour >= 12 ? 'PM' : 'AM'}`;
      
      appointments.push({
        time,
        date: dateStr,
        patient: patientNames[Math.floor(Math.random() * patientNames.length)],
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        urgent: Math.random() > 0.7,
        type: types[Math.floor(Math.random() * types.length)],
        completed: isBefore(date, new Date()) && Math.random() > 0.3,
        rating: Math.random() > 0.5 ? (4 + Math.random()).toFixed(1) : undefined,
        age: 25 + Math.floor(Math.random() * 60),
        duration: `${Math.floor(Math.random() * 12) + 1} ${Math.random() > 0.5 ? 'months' : 'weeks'}`,
        bloodPressure: `${120 + Math.floor(Math.random() * 40)}/${70 + Math.floor(Math.random() * 30)}`,
        heartRate: `${60 + Math.floor(Math.random() * 40)} bpm`,
        symptoms: "Various cardiac symptoms and concerns",
        medicalHistory: "Previous medical history and family background"
      });
    }
    
    return appointments;
  };

  const appointments = [
    { 
      time: "10:00 AM",
      date: format(new Date(), "yyyy-MM-dd"),
      patient: "Rajesh Kumar", 
      condition: "Chest Pain Evaluation", 
      urgent: true,
      type: "Initial Consultation",
      completed: true,
      rating: 4.5,
      age: 45,
      duration: "3 months",
      bloodPressure: "140/90",
      heartRate: "82 bpm",
      symptoms: "Sharp chest pain, shortness of breath during physical activity",
      medicalHistory: "Family history of heart disease, smoker for 15 years"
    },
    { 
      time: "11:30 AM",
      date: format(new Date(), "yyyy-MM-dd"),
      patient: "Priya Sharma", 
      condition: "Hypertension Follow-up", 
      urgent: false,
      type: "Follow-up",
      completed: true,
      rating: 5.0,
      age: 52,
      duration: "2 years",
      bloodPressure: "155/95",
      heartRate: "76 bpm",
      symptoms: "Mild headaches, occasional dizziness",
      medicalHistory: "Diabetes type 2, taking Metformin"
    },
    { 
      time: "2:00 PM",
      date: format(new Date(), "yyyy-MM-dd"),
      patient: "Amit Singh", 
      condition: "Arrhythmia Assessment", 
      urgent: true,
      type: "Emergency",
      completed: false,
      age: 38,
      duration: "1 week",
      bloodPressure: "130/85",
      heartRate: "105 bpm",
      symptoms: "Irregular heartbeat, palpitations, fatigue",
      medicalHistory: "No prior cardiac issues, high stress job"
    },
    { 
      time: "3:30 PM",
      date: format(new Date(), "yyyy-MM-dd"),
      patient: "Sunita Verma", 
      condition: "Post-Surgery Check", 
      urgent: false,
      type: "Post-Op",
      completed: false,
      age: 61,
      duration: "6 weeks post-surgery",
      bloodPressure: "125/80",
      heartRate: "68 bpm",
      symptoms: "Mild chest discomfort at incision site",
      medicalHistory: "Recent cardiac bypass surgery, recovering well"
    },
    { 
      time: "4:30 PM",
      date: format(new Date(), "yyyy-MM-dd"),
      patient: "Vikram Patel", 
      condition: "Cardiac Risk Assessment", 
      urgent: false,
      type: "Screening",
      completed: false,
      age: 48,
      duration: "Preventive check",
      bloodPressure: "135/88",
      heartRate: "74 bpm",
      symptoms: "No current symptoms, family history concern",
      medicalHistory: "Father had heart attack at 55, high cholesterol"
    },
    // Tomorrow's appointments
    {
      time: "9:00 AM",
      date: format(addDays(new Date(), 1), "yyyy-MM-dd"),
      patient: "Arjun Reddy",
      condition: "Cardiac Stress Test",
      urgent: false,
      type: "Diagnostic",
      completed: false,
      age: 42,
      duration: "2 weeks",
      bloodPressure: "145/92",
      heartRate: "78 bpm",
      symptoms: "Chest tightness during exercise",
      medicalHistory: "High cholesterol, family history of CAD"
    },
    {
      time: "11:00 AM",
      date: format(addDays(new Date(), 1), "yyyy-MM-dd"),
      patient: "Meera Joshi",
      condition: "Pacemaker Follow-up",
      urgent: false,
      type: "Device Check",
      completed: false,
      age: 67,
      duration: "6 months post-implant",
      bloodPressure: "120/75",
      heartRate: "72 bpm (paced)",
      symptoms: "No current symptoms, routine check",
      medicalHistory: "Complete heart block, pacemaker implanted"
    }
  ];

  // Filter appointments based on search query
  const filteredAppointments = appointments.filter(apt => 
    apt.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
    apt.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
    apt.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTimeStatus = (appointment: any) => {
    if (appointment.completed) return null;
    
    const [time, period] = appointment.time.split(' ');
    const [hours, minutes] = time.split(':');
    let hour24 = parseInt(hours);
    
    if (period === 'PM' && hour24 !== 12) hour24 += 12;
    if (period === 'AM' && hour24 === 12) hour24 = 0;
    
    const appointmentDateTime = new Date();
    appointmentDateTime.setHours(hour24, parseInt(minutes), 0, 0);
    
    // If appointment is in the future (tomorrow), add a day
    if (appointment.date !== format(new Date(), "yyyy-MM-dd")) {
      appointmentDateTime.setDate(appointmentDateTime.getDate() + 1);
    }
    
    const minutesUntil = differenceInMinutes(appointmentDateTime, currentTime);
    
    if (minutesUntil < 0) {
      return { status: 'overdue', text: 'Time passed', color: 'text-destructive' };
    } else if (minutesUntil < 15) {
      return { status: 'starting', text: `Starting in ${minutesUntil} min`, color: 'text-warning' };
    } else if (minutesUntil < 60) {
      return { status: 'soon', text: `Starts in ${minutesUntil} min`, color: 'text-primary' };
    } else {
      const hours = Math.floor(minutesUntil / 60);
      const mins = minutesUntil % 60;
      return { status: 'scheduled', text: `Starts in ${hours}h ${mins}m`, color: 'text-muted-foreground' };
    }
  };

  const todayAppointments = filteredAppointments.filter(apt => isToday(parseISO(apt.date)));
  const tomorrowAppointments = filteredAppointments.filter(apt => isTomorrow(parseISO(apt.date)));

  // Get appointments for selected calendar date
  const getAppointmentsForDate = (date: Date) => {
    if (isOffDay(date)) return [];
    
    // Check if we have predefined appointments for this date
    const existingAppointments = filteredAppointments.filter(apt => isSameDay(parseISO(apt.date), date));
    if (existingAppointments.length > 0) {
      return existingAppointments;
    }
    
    // For other dates in current month, generate dummy appointments
    if (isSameMonth(date, new Date())) {
      return generateAppointmentsForDate(date);
    }
    
    return [];
  };

  const selectedDateAppointments = calendarSelectedDate ? getAppointmentsForDate(calendarSelectedDate) : [];

  const appointmentDates = [...new Set(filteredAppointments.map(apt => apt.date))];
  const markedDates = appointmentDates.map(date => parseISO(date));
  
  // Generate off days for the current month
  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const offDays = [];
  
  for (let date = new Date(monthStart); date <= monthEnd; date.setDate(date.getDate() + 1)) {
    if (isOffDay(date)) {
      offDays.push(new Date(date));
    }
  }

  const renderAppointmentCard = (appointment: any, index: number) => {
    const timeStatus = getTimeStatus(appointment);
    
    return (
      <Card 
        key={index} 
        className="glass-card shadow-medical hover:shadow-lg transition-all duration-300"
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-primary text-lg">{appointment.time}</span>
                </div>
                {appointment.urgent && (
                  <span className="px-3 py-1 text-xs bg-destructive/10 text-destructive rounded-full font-medium">
                    Urgent
                  </span>
                )}
                <span className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full font-medium">
                  {appointment.type}
                </span>
              </div>
              
              <div className="flex items-center space-x-2 mb-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="font-semibold text-foreground text-lg">{appointment.patient}</span>
              </div>
              
              <p className="text-muted-foreground mb-2">{appointment.condition}</p>
              
              {timeStatus && (
                <div className={`text-sm font-medium ${timeStatus.color}`}>
                  {timeStatus.text}
                </div>
              )}
            </div>
            
            <div className="flex flex-col space-y-2">
              {appointment.completed ? (
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span className="text-sm font-medium text-success">Completed</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-warning text-warning" />
                    <span className="text-sm font-medium">{appointment.rating}</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Button 
                    variant="outline"
                    onClick={() => setRescheduleDialog({ open: true, appointmentIndex: index })}
                    className="text-primary border-primary hover:bg-primary/10"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Reschedule
                  </Button>
                  
                  <Button 
                    onClick={() => setVideoConsultation({
                      isOpen: true,
                      patient: {
                        name: appointment.patient,
                        age: appointment.age,
                        condition: appointment.condition,
                        time: appointment.time,
                        urgent: appointment.urgent,
                        bloodPressure: appointment.bloodPressure,
                        heartRate: appointment.heartRate,
                        symptoms: appointment.symptoms
                      }
                    })}
                    className="medical-gradient text-white"
                  >
                    <Video className="w-4 h-4 mr-1" />
                    Start Consultation
                  </Button>
                </div>
              )}
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                      <User className="w-5 h-5 text-primary" />
                      <span>Patient Details - {appointment.patient}</span>
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-muted/50">
                        <h4 className="font-semibold text-foreground mb-2">Basic Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Age:</span>
                            <span className="font-medium">{appointment.age} years</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Appointment Time:</span>
                            <span className="font-medium">{appointment.time}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Type:</span>
                            <Badge variant="secondary">{appointment.type}</Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-muted/50">
                        <h4 className="font-semibold text-foreground mb-2">Vital Signs</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Blood Pressure:</span>
                            <span className="font-medium">{appointment.bloodPressure}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Heart Rate:</span>
                            <span className="font-medium">{appointment.heartRate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-muted/50">
                        <h4 className="font-semibold text-foreground mb-2">Condition Details</h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Primary Concern:</span>
                            <p className="font-medium mt-1">{appointment.condition}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Duration:</span>
                            <p className="font-medium mt-1">{appointment.duration}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-muted/50">
                        <h4 className="font-semibold text-foreground mb-2">Symptoms</h4>
                        <p className="text-sm">{appointment.symptoms}</p>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-muted/50">
                        <h4 className="font-semibold text-foreground mb-2">Medical History</h4>
                        <p className="text-sm">{appointment.medicalHistory}</p>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header with Calendar */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          {/* Today's Appointments */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Today's Appointments</h2>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Heart className="w-4 h-4" />
                <span>Cardiology Department</span>
              </div>
            </div>
            
            <div className="grid gap-4">
              {todayAppointments.map((appointment, index) => 
                renderAppointmentCard(appointment, index)
              )}
            </div>
          </div>

          {/* Tomorrow's Appointments */}
          {tomorrowAppointments.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <ChevronRight className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-bold text-foreground">Tomorrow's Appointments</h3>
              </div>
              
              <div className="grid gap-4">
                {tomorrowAppointments.map((appointment, index) => 
                  renderAppointmentCard(appointment, todayAppointments.length + index)
                )}
              </div>
            </div>
          )}
        </div>

        {/* Calendar Sidebar */}
        <div className="lg:w-80 space-y-4">
          <Card className="p-4">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-lg">Appointment Calendar</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <Calendar
                mode="single"
                selected={calendarSelectedDate}
                onSelect={(date) => {
                  if (date) {
                    setCalendarSelectedDate(date);
                  }
                }}
                className="w-full"
                modifiers={{
                  hasAppointment: markedDates,
                  offDay: offDays,
                }}
                modifiersStyles={{
                  hasAppointment: {
                    backgroundColor: 'hsl(var(--primary))',
                    color: 'hsl(var(--primary-foreground))',
                    borderRadius: '6px'
                  },
                  offDay: {
                    position: 'relative'
                  }
                }}
                modifiersClassNames={{
                  offDay: 'off-day-with-circle'
                }}
              />
              <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-3 h-3 rounded bg-primary"></div>
                  <span className="text-muted-foreground">Appointment scheduled</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-3 h-3 rounded bg-success"></div>
                  <span className="text-muted-foreground">Off day</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Date Appointments */}
          {calendarSelectedDate && (
            <Card className="p-4">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-lg">
                  {format(calendarSelectedDate, 'MMM dd, yyyy')}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                {isOffDay(calendarSelectedDate) ? (
                  <div className="text-center py-8">
                    <div className="text-4xl font-bold text-success mb-2">OFF DAY</div>
                    <p className="text-muted-foreground">Doctor is on leave today</p>
                  </div>
                ) : !isSameMonth(calendarSelectedDate, new Date()) ? (
                  <div className="text-center py-8">
                    <div className="text-lg font-semibold text-muted-foreground mb-2">
                      Schedule to be assigned
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Appointments for this month are not yet scheduled
                    </p>
                  </div>
                ) : selectedDateAppointments.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDateAppointments.map((appointment, index) => (
                      <div key={index} className="p-3 rounded-lg bg-muted/30 border">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-sm">{appointment.time}</div>
                            <div className="text-sm text-muted-foreground">{appointment.patient}</div>
                            <div className="text-xs text-muted-foreground">{appointment.condition}</div>
                          </div>
                          <div className="text-right">
                            <Badge variant={appointment.urgent ? "destructive" : "secondary"} className="text-xs">
                              {appointment.type}
                            </Badge>
                            {appointment.completed && (
                              <div className="text-xs text-success mt-1">✓ Completed</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">No appointments scheduled</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Reschedule Dialog */}
      <Dialog open={rescheduleDialog.open} onOpenChange={(open) => setRescheduleDialog({ ...rescheduleDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {rescheduleDialog.appointmentIndex >= 0 && (
              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-semibold mb-2">Current Appointment</h4>
                <p className="text-sm">
                  <strong>Patient:</strong> {filteredAppointments[rescheduleDialog.appointmentIndex]?.patient}
                </p>
                <p className="text-sm">
                  <strong>Time:</strong> {filteredAppointments[rescheduleDialog.appointmentIndex]?.time}
                </p>
                <p className="text-sm">
                  <strong>Condition:</strong> {filteredAppointments[rescheduleDialog.appointmentIndex]?.condition}
                </p>
              </div>
            )}
            
            <div className="space-y-3">
              <label className="text-sm font-medium">Quick Options</label>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">Start Now</Button>
                <Button variant="outline" size="sm">+15 minutes</Button>
                <Button variant="outline" size="sm">+30 minutes</Button>
                <Button variant="outline" size="sm">+1 hour</Button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Custom Time</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select new time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                  <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                  <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                  <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                  <SelectItem value="1:00 PM">1:00 PM</SelectItem>
                  <SelectItem value="2:00 PM">2:00 PM</SelectItem>
                  <SelectItem value="3:00 PM">3:00 PM</SelectItem>
                  <SelectItem value="4:00 PM">4:00 PM</SelectItem>
                  <SelectItem value="5:00 PM">5:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setRescheduleDialog({ open: false, appointmentIndex: -1 })}
              >
                Cancel
              </Button>
              <Button>Confirm Reschedule</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Consultation Modal */}
      <VideoConsultation
        isOpen={videoConsultation.isOpen}
        onClose={() => setVideoConsultation({ isOpen: false, patient: null })}
        patient={videoConsultation.patient || {}}
      />
    </div>
  );
};

export default AppointmentsTab;