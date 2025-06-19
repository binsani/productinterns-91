
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  location: string;
}

interface PersonalInfoSectionProps {
  personalInfo: PersonalInfo;
  onUpdate: (field: keyof PersonalInfo, value: string) => void;
}

const PersonalInfoSection = ({ personalInfo, onUpdate }: PersonalInfoSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Full Name"
            value={personalInfo.name}
            onChange={(e) => onUpdate('name', e.target.value)}
          />
          <Input
            placeholder="Email"
            value={personalInfo.email}
            onChange={(e) => onUpdate('email', e.target.value)}
          />
          <Input
            placeholder="Phone"
            value={personalInfo.phone}
            onChange={(e) => onUpdate('phone', e.target.value)}
          />
          <Input
            placeholder="LinkedIn Profile"
            value={personalInfo.linkedin}
            onChange={(e) => onUpdate('linkedin', e.target.value)}
          />
        </div>
        <Input
          placeholder="Location"
          value={personalInfo.location}
          onChange={(e) => onUpdate('location', e.target.value)}
        />
      </CardContent>
    </Card>
  );
};

export default PersonalInfoSection;
