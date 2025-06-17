
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Clock, MapPin, Video } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName?: string;
  position?: string;
}

const ScheduleInterviewModal = ({ isOpen, onClose, candidateName, position }: ScheduleInterviewModalProps) => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("45");
  const [type, setType] = useState("video");
  const [location, setLocation] = useState("");
  const [interviewer, setInterviewer] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !time || !interviewer) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Interview Scheduled",
      description: `Interview with ${candidateName || 'candidate'} has been scheduled for ${format(date, 'PPP')} at ${time}.`,
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Schedule Interview</DialogTitle>
          <DialogDescription>
            {candidateName && position 
              ? `Schedule an interview with ${candidateName} for the ${position} position.`
              : "Schedule a new interview with a candidate."
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
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
            
            <div className="space-y-2">
              <Label htmlFor="type">Interview Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video Call</SelectItem>
                  <SelectItem value="phone">Phone Call</SelectItem>
                  <SelectItem value="in-person">In-Person</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="interviewer">Interviewer *</Label>
            <Input
              id="interviewer"
              value={interviewer}
              onChange={(e) => setInterviewer(e.target.value)}
              placeholder="Enter interviewer name"
              required
            />
          </div>

          {type !== "video" && (
            <div className="space-y-2">
              <Label htmlFor="location">
                {type === "phone" ? "Phone Number" : "Location"}
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={type === "phone" ? "Enter phone number" : "Enter meeting location"}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes for the interview"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Schedule Interview
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleInterviewModal;
