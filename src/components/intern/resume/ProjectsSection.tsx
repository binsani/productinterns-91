
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  impact: string;
}

interface ProjectsSectionProps {
  projects: Project[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof Project, value: any) => void;
  onRemove: (id: string) => void;
}

const ProjectsSection = ({ projects, onAdd, onUpdate, onRemove }: ProjectsSectionProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Projects</CardTitle>
          <CardDescription>Showcase projects that demonstrate PM skills</CardDescription>
        </div>
        <Button onClick={onAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <Input
                placeholder="Project Name"
                value={project.name}
                onChange={(e) => onUpdate(project.id, 'name', e.target.value)}
                className="flex-1 mr-3"
              />
              <Button variant="outline" size="sm" onClick={() => onRemove(project.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Textarea
              placeholder="Project description focusing on problem solved, your role, and methodologies used..."
              value={project.description}
              onChange={(e) => onUpdate(project.id, 'description', e.target.value)}
              rows={2}
            />
            <Input
              placeholder="Impact/Results (e.g., Increased user engagement by 25%)"
              value={project.impact}
              onChange={(e) => onUpdate(project.id, 'impact', e.target.value)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ProjectsSection;
