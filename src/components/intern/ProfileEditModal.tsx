
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { skills: string[]; locations: string[] }) => void;
  initialData: {
    skills: string[];
    locations: string[];
  };
}

const ProfileEditModal = ({ isOpen, onClose, onSave, initialData }: ProfileEditModalProps) => {
  const { toast } = useToast();
  const [skills, setSkills] = useState<string[]>(initialData.skills);
  const [locations, setLocations] = useState<string[]>(initialData.locations);
  const [newSkill, setNewSkill] = useState("");
  const [newLocation, setNewLocation] = useState("");

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const addLocation = () => {
    if (newLocation.trim() && !locations.includes(newLocation.trim())) {
      setLocations([...locations, newLocation.trim()]);
      setNewLocation("");
    }
  };

  const removeLocation = (locationToRemove: string) => {
    setLocations(locations.filter(location => location !== locationToRemove));
  };

  const handleSave = () => {
    onSave({ skills, locations });
    toast({
      title: "Profile Updated",
      description: "Your profile preferences have been saved successfully.",
    });
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your skills and location preferences.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Skills Section */}
          <div>
            <Label className="text-sm font-medium">Skills</Label>
            <div className="flex space-x-2 mt-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
                onKeyPress={(e) => handleKeyPress(e, addSkill)}
              />
              <Button type="button" onClick={addSkill} size="sm">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-red-600" 
                    onClick={() => removeSkill(skill)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Locations Section */}
          <div>
            <Label className="text-sm font-medium">Preferred Locations</Label>
            <div className="flex space-x-2 mt-2">
              <Input
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="Add a location"
                onKeyPress={(e) => handleKeyPress(e, addLocation)}
              />
              <Button type="button" onClick={addLocation} size="sm">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {locations.map((location) => (
                <Badge key={location} variant="outline" className="flex items-center gap-1">
                  {location}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-red-600" 
                    onClick={() => removeLocation(location)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditModal;
