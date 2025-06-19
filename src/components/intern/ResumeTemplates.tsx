
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Download } from "lucide-react";

interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  preview: string;
}

interface ResumeTemplatesProps {
  onSelectTemplate: (templateId: string) => void;
}

const ResumeTemplates = ({ onSelectTemplate }: ResumeTemplatesProps) => {
  const templates: ResumeTemplate[] = [
    {
      id: "modern-pm",
      name: "Modern PM",
      description: "Clean, professional design perfect for product management roles",
      category: "Professional",
      preview: "/api/placeholder/300/400"
    },
    {
      id: "tech-focused",
      name: "Tech Focused",
      description: "Emphasizes technical skills and projects",
      category: "Technical",
      preview: "/api/placeholder/300/400"
    },
    {
      id: "creative-pm",
      name: "Creative PM",
      description: "Creative layout for design-focused PM roles",
      category: "Creative",
      preview: "/api/placeholder/300/400"
    },
    {
      id: "minimal-clean",
      name: "Minimal Clean",
      description: "Simple, ATS-friendly format",
      category: "Minimal",
      preview: "/api/placeholder/300/400"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Choose a Resume Template</h2>
        <p className="text-gray-600">Select a template that best fits your style and the PM roles you're targeting</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="p-4">
              <div className="aspect-[3/4] bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                <span className="text-gray-500">Preview</span>
              </div>
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
              <Badge variant="secondary" className="w-fit">{template.category}</Badge>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button 
                  size="sm"
                  className="flex-1"
                  onClick={() => onSelectTemplate(template.id)}
                >
                  Use Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ResumeTemplates;
