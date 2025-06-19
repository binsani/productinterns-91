
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";

interface Skills {
  technical: string[];
  product: string[];
  soft: string[];
}

interface SkillsSectionProps {
  skills: Skills;
  onAddSkill: (category: keyof Skills, skill: string) => void;
  onRemoveSkill: (category: keyof Skills, index: number) => void;
}

const SkillsSection = ({ skills, onAddSkill, onRemoveSkill }: SkillsSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
        <CardDescription>Categorize your skills to highlight PM competencies</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(skills).map(([category, skillList]) => (
          <div key={category}>
            <h4 className="font-medium mb-2 capitalize">
              {category === 'technical' ? 'Technical Skills' : 
               category === 'product' ? 'Product Management Skills' : 
               'Soft Skills'}
            </h4>
            <div className="flex flex-wrap gap-2 mb-2">
              {skillList.map((skill, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1"
                    onClick={() => onRemoveSkill(category as keyof Skills, index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <Input
              placeholder={`Add ${category} skill and press Enter`}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  onAddSkill(category as keyof Skills, e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SkillsSection;
