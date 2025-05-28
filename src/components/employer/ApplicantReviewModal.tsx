
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Applicant {
  id: string;
  name: string;
  email: string;
  university: string;
  major: string;
  gpa: number;
  skills: string[];
  experience: string;
  appliedDate: string;
  status: string;
  position: string;
  match: number;
  avatar: string;
}

interface ApplicantReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicant: Applicant | null;
  onStatusUpdate: (applicantId: string, newStatus: string) => void;
}

const ApplicantReviewModal = ({ isOpen, onClose, applicant, onStatusUpdate }: ApplicantReviewModalProps) => {
  const { toast } = useToast();
  const [newStatus, setNewStatus] = useState("");
  const [notes, setNotes] = useState("");

  const handleStatusUpdate = () => {
    if (!applicant || !newStatus) return;

    onStatusUpdate(applicant.id, newStatus);
    
    toast({
      title: "Status Updated",
      description: `${applicant.name}'s application status has been updated to ${newStatus}.`,
    });
    
    setNewStatus("");
    setNotes("");
    onClose();
  };

  if (!applicant) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle>Review Application</DialogTitle>
          <DialogDescription>
            Review and update the status of this application.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Applicant Info */}
          <div className="flex items-start space-x-4 p-4 border rounded-lg">
            <Avatar className="h-12 w-12">
              <AvatarImage src={applicant.avatar} alt={applicant.name} />
              <AvatarFallback>{applicant.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold text-lg">{applicant.name}</h3>
                <Badge className="bg-blue-100 text-blue-800">
                  {applicant.match}% match
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">{applicant.email}</p>
              <p className="text-sm text-gray-600 mb-2">{applicant.university} • {applicant.major}</p>
              <p className="text-sm text-gray-600 mb-2">GPA: {applicant.gpa} • {applicant.experience} experience</p>
              <Badge variant="outline">{applicant.position}</Badge>
            </div>
          </div>

          {/* Skills */}
          <div>
            <Label className="text-sm font-medium">Skills</Label>
            <div className="flex flex-wrap gap-1 mt-1">
              {applicant.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Status Update */}
          <div>
            <Label htmlFor="status">Update Status</Label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="reviewing">Reviewing</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="interviewed">Interviewed</SelectItem>
                <SelectItem value="offered">Offered</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this applicant..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleStatusUpdate} disabled={!newStatus}>
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicantReviewModal;
