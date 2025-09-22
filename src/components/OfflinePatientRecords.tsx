import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  savePatientOffline, 
  getAllPatientsOffline, 
  isOnline,
  syncWithServer
} from "@/lib/offline-service";
import { Cloud, CloudOff, Download, Upload } from "lucide-react";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  lastVisit: string;
  diagnosis: string;
}

const OfflinePatientRecords = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    gender: "",
    diagnosis: ""
  });

  // Check connection status
  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsConnected(isOnline());
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Initial check
    updateOnlineStatus();

    // Load patients from local storage
    loadPatients();

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const loadPatients = async () => {
    try {
      const offlinePatients = await getAllPatientsOffline();
      setPatients(offlinePatients);
    } catch (error) {
      console.error("Error loading patients:", error);
    }
  };

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const patient: any = {
      id: `patient_${Date.now()}`,
      name: newPatient.name,
      age: parseInt(newPatient.age),
      gender: newPatient.gender,
      lastVisit: new Date().toISOString(),
      diagnosis: newPatient.diagnosis
    };

    try {
      await savePatientOffline(patient);
      setPatients([...patients, patient]);
      
      // Reset form
      setNewPatient({
        name: "",
        age: "",
        gender: "",
        diagnosis: ""
      });
      
      alert("Patient record saved offline!");
    } catch (error) {
      console.error("Error saving patient:", error);
      alert("Failed to save patient record.");
    }
  };

  const handleSync = async () => {
    try {
      await syncWithServer();
      alert("Data synced with server successfully!");
    } catch (error) {
      console.error("Sync error:", error);
      alert("Failed to sync with server.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewPatient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Offline Patient Records</h2>
        <div className="flex items-center space-x-2">
          {isConnected ? (
            <>
              <Cloud className="h-5 w-5 text-green-500" />
              <span className="text-green-500">Online</span>
              <Button onClick={handleSync} variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Sync Data
              </Button>
            </>
          ) : (
            <>
              <CloudOff className="h-5 w-5 text-red-500" />
              <span className="text-red-500">Offline</span>
            </>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Patient Record</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddPatient} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Patient Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={newPatient.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={newPatient.age}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  name="gender"
                  value={newPatient.gender}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md bg-background"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Input
                  id="diagnosis"
                  name="diagnosis"
                  value={newPatient.diagnosis}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Save Patient Record Offline
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Saved Patient Records</CardTitle>
        </CardHeader>
        <CardContent>
          {patients.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Last Visit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>{patient.gender}</TableCell>
                    <TableCell>{patient.diagnosis}</TableCell>
                    <TableCell>
                      {new Date(patient.lastVisit).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No patient records found.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Add patient records to view them here, even when offline.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
        <h3 className="font-medium text-blue-800 dark:text-blue-200">Offline Access Information</h3>
        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
          Patient records are automatically saved to your device. When you're back online, 
          use the "Sync Data" button to upload your records to the server.
        </p>
      </div>
    </div>
  );
};

export default OfflinePatientRecords;