
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, Clock, Video, MapPin, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InterviewSchedulerProps {
  candidateName: string;
  position: string;
  companyName: string;
  onSchedule: (details: InterviewDetails) => void;
  onClose: () => void;
}

interface InterviewDetails {
  date: Date;
  time: string;
  type: 'video' | 'phone' | 'in-person';
  duration: number;
  interviewers: string[];
  location?: string;
  notes?: string;
}

const InterviewScheduler = ({ candidateName, position, companyName, onSchedule, onClose }: InterviewSchedulerProps) => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [interviewType, setInterviewType] = useState<'video' | 'phone' | 'in-person'>('video');
  const [duration, setDuration] = useState(30);
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [interviewers, setInterviewers] = useState<string[]>([]);

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
  ];

  const availableInterviewers = [
    "Sarah Johnson - Hiring Manager",
    "Mike Chen - Senior PM",
    "Emily Davis - VP Product",
    "Alex Rodriguez - Engineering Lead"
  ];

  const handleInterviewerToggle = (interviewer: string) => {
    setInterviewers(prev => 
      prev.includes(interviewer) 
        ? prev.filter(i => i !== interviewer)
        : [...prev, interviewer]
    );
  };

  const handleSchedule = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please select both date and time for the interview.",
        variant: "destructive"
      });
      return;
    }

    const interviewDetails: InterviewDetails = {
      date: selectedDate,
      time: selectedTime,
      type: interviewType,
      duration,
      interviewers,
      location: interviewType === 'in-person' ? location : undefined,
      notes
    };

    onSchedule(interviewDetails);
    
    toast({
      title: "Interview Scheduled!",
      description: `Interview with ${candidateName} has been scheduled for ${selectedDate.toLocaleDateString()} at ${selectedTime}.`
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2" />
            Schedule Interview
          </CardTitle>
          <CardDescription>
            Schedule interview with {candidateName} for {position} at {companyName}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date Selection */}
          <div>
            <Label className="text-base font-medium">Select Date</Label>
            <div className="mt-2">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                className="rounded-md border"
              />
            </div>
          </div>

          {/* Time Selection */}
          <div>
            <Label className="text-base font-medium">Select Time</Label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Choose time slot" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {time}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Interview Type */}
          <div>
            <Label className="text-base font-medium">Interview Type</Label>
            <div className="flex space-x-2 mt-2">
              <Button
                type="button"
                variant={interviewType === 'video' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setInterviewType('video')}
              >
                <Video className="h-4 w-4 mr-2" />
                Video Call
              </Button>
              <Button
                type="button"
                variant={interviewType === 'phone' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setInterviewType('phone')}
              >
                <Clock className="h-4 w-4 mr-2" />
                Phone Call
              </Button>
              <Button
                type="button"
                variant={interviewType === 'in-person' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setInterviewType('in-person')}
              >
                <MapPin className="h-4 w-4 mr-2" />
                In Person
              </Button>
            </div>
          </div>

          {/* Duration */}
          <div>
            <Label className="text-base font-medium">Duration</Label>
            <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="90">1.5 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location (if in-person) */}
          {interviewType === 'in-person' && (
            <div>
              <Label className="text-base font-medium">Location</Label>
              <Textarea
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter the interview location/address"
                className="mt-2"
                rows={2}
              />
            </div>
          )}

          {/* Interviewers */}
          <div>
            <Label className="text-base font-medium">
              <Users className="h-4 w-4 inline mr-2" />
              Interviewers
            </Label>
            <div className="mt-2 space-y-2">
              {availableInterviewers.map((interviewer) => (
                <div key={interviewer} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={interviewer}
                    checked={interviewers.includes(interviewer)}
                    onChange={() => handleInterviewerToggle(interviewer)}
                    className="rounded"
                  />
                  <label htmlFor={interviewer} className="text-sm">
                    {interviewer}
                  </label>
                </div>
              ))}
            </div>
            {interviewers.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {interviewers.map((interviewer) => (
                  <Badge key={interviewer} variant="secondary">
                    {interviewer}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <Label className="text-base font-medium">Interview Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any specific topics to cover or preparation notes..."
              className="mt-2"
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSchedule}>
              Schedule Interview
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewScheduler;
