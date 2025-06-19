
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Education {
  degree: string;
  school: string;
  graduation: string;
  gpa: string;
}

interface EducationSectionProps {
  education: Education;
  onUpdate: (field: keyof Education, value: string) => void;
}

const EducationSection = ({ education, onUpdate }: EducationSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Education</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Degree"
            value={education.degree}
            onChange={(e) => onUpdate('degree', e.target.value)}
          />
          <Input
            placeholder="School/University"
            value={education.school}
            onChange={(e) => onUpdate('school', e.target.value)}
          />
          <Input
            placeholder="Graduation Date"
            value={education.graduation}
            onChange={(e) => onUpdate('graduation', e.target.value)}
          />
          <Input
            placeholder="GPA (optional)"
            value={education.gpa}
            onChange={(e) => onUpdate('gpa', e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default EducationSection;
