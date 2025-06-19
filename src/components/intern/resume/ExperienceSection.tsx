
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

interface Experience {
  id: string;
  title: string;
  company: string;
  duration: string;
  description: string;
  achievements: string[];
}

interface ExperienceSectionProps {
  experience: Experience[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof Experience, value: any) => void;
  onRemove: (id: string) => void;
}

const ExperienceSection = ({ experience, onAdd, onUpdate, onRemove }: ExperienceSectionProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Experience</CardTitle>
          <CardDescription>Include internships, part-time jobs, and relevant volunteer work</CardDescription>
        </div>
        <Button onClick={onAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {experience.map((exp) => (
          <div key={exp.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                <Input
                  placeholder="Job Title"
                  value={exp.title}
                  onChange={(e) => onUpdate(exp.id, 'title', e.target.value)}
                />
                <Input
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) => onUpdate(exp.id, 'company', e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm" onClick={() => onRemove(exp.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Input
              placeholder="Duration (e.g., Jun 2023 - Aug 2023)"
              value={exp.duration}
              onChange={(e) => onUpdate(exp.id, 'duration', e.target.value)}
            />
            <Textarea
              placeholder="Describe your responsibilities and achievements, focusing on PM-relevant skills like data analysis, user research, cross-functional collaboration..."
              value={exp.description}
              onChange={(e) => onUpdate(exp.id, 'description', e.target.value)}
              rows={3}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ExperienceSection;
