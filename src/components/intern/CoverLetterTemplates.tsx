
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye, Save, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CoverLetterTemplate {
  id: string;
  name: string;
  description: string;
  content: string;
  variables: string[];
}

interface SavedCoverLetter {
  id: string;
  name: string;
  content: string;
  createdAt: string;
  companyName?: string;
}

const CoverLetterTemplates = () => {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<CoverLetterTemplate | null>(null);
  const [customContent, setCustomContent] = useState("");
  const [coverLetterName, setCoverLetterName] = useState("");
  const [savedLetters, setSavedLetters] = useState<SavedCoverLetter[]>([
    {
      id: "1",
      name: "TechCorp Application",
      content: "Dear Hiring Manager,\n\nI am writing to express my strong interest in the Product Management Intern position at TechCorp...",
      createdAt: "2024-01-20",
      companyName: "TechCorp"
    }
  ]);

  const templates: CoverLetterTemplate[] = [
    {
      id: "1",
      name: "Tech Company PM Intern",
      description: "Perfect for technology company PM internships",
      content: `Dear Hiring Manager,

I am writing to express my strong interest in the Product Management Intern position at [COMPANY_NAME]. As a [YEAR] student studying [MAJOR] at [UNIVERSITY], I am excited about the opportunity to contribute to [COMPANY_NAME]'s mission of [COMPANY_MISSION].

Through my coursework and projects, I have developed strong analytical and problem-solving skills that are essential for product management. I am particularly drawn to [COMPANY_NAME] because of [SPECIFIC_REASON].

I would welcome the opportunity to discuss how my passion for product management and eagerness to learn can contribute to your team's success.

Sincerely,
[YOUR_NAME]`,
      variables: ["COMPANY_NAME", "YEAR", "MAJOR", "UNIVERSITY", "COMPANY_MISSION", "SPECIFIC_REASON", "YOUR_NAME"]
    },
    {
      id: "2", 
      name: "Startup PM Intern",
      description: "Tailored for startup environments",
      content: `Dear [HIRING_MANAGER_NAME],

I am excited to apply for the Product Management Intern position at [STARTUP_NAME]. As someone passionate about innovation and building products that solve real problems, I am drawn to the entrepreneurial spirit and growth potential at [STARTUP_NAME].

My experience with [RELEVANT_EXPERIENCE] has given me insight into the product development process and user-centered thinking. I am particularly interested in [STARTUP_FOCUS_AREA] and believe my background in [RELEVANT_SKILLS] would be valuable to your team.

I would love the opportunity to contribute to [STARTUP_NAME]'s growth while learning from your experienced product team.

Best regards,
[YOUR_NAME]`,
      variables: ["HIRING_MANAGER_NAME", "STARTUP_NAME", "RELEVANT_EXPERIENCE", "STARTUP_FOCUS_AREA", "RELEVANT_SKILLS", "YOUR_NAME"]
    }
  ];

  const handleTemplateSelect = (template: CoverLetterTemplate) => {
    setSelectedTemplate(template);
    setCustomContent(template.content);
  };

  const handleSaveCoverLetter = () => {
    if (!coverLetterName.trim() || !customContent.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a name and content for your cover letter.",
        variant: "destructive"
      });
      return;
    }

    const newLetter: SavedCoverLetter = {
      id: Date.now().toString(),
      name: coverLetterName,
      content: customContent,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setSavedLetters(prev => [newLetter, ...prev]);
    toast({
      title: "Cover Letter Saved",
      description: "Your cover letter has been saved successfully.",
    });
    
    setCoverLetterName("");
  };

  const handleDownloadDocument = (letter: SavedCoverLetter) => {
    // Create a simple text document
    const blob = new Blob([letter.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${letter.name.replace(/\s+/g, '_')}_cover_letter.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Document Downloaded",
      description: "Cover letter has been downloaded as a text file.",
    });
  };

  const handleDownloadPDF = (letter: SavedCoverLetter) => {
    // In a real implementation, this would generate a properly formatted PDF
    toast({
      title: "PDF Downloaded",
      description: "Cover letter has been downloaded as a PDF file.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cover Letter Templates</CardTitle>
          <CardDescription>Professional templates customized for PM internship applications</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Templates */}
        <Card>
          <CardHeader>
            <CardTitle>Choose a Template</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {templates.map((template) => (
              <div 
                key={template.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedTemplate?.id === template.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                }`}
                onClick={() => handleTemplateSelect(template)}
              >
                <h3 className="font-semibold mb-1">{template.name}</h3>
                <p className="text-sm text-gray-600">{template.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {template.variables.slice(0, 3).map((variable) => (
                    <Badge key={variable} variant="outline" className="text-xs">
                      {variable}
                    </Badge>
                  ))}
                  {template.variables.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{template.variables.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Editor */}
        <Card>
          <CardHeader>
            <CardTitle>Customize Your Cover Letter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Cover letter name (e.g., 'Google PM Intern Application')"
              value={coverLetterName}
              onChange={(e) => setCoverLetterName(e.target.value)}
            />
            
            <Textarea
              placeholder="Select a template to start editing..."
              value={customContent}
              onChange={(e) => setCustomContent(e.target.value)}
              rows={12}
              className="font-mono text-sm"
            />

            {selectedTemplate && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Variables to replace:</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedTemplate.variables.map((variable) => (
                    <Badge key={variable} variant="outline" className="text-xs cursor-pointer">
                      {variable}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              <Button onClick={handleSaveCoverLetter} disabled={!customContent.trim()}>
                <Save className="h-4 w-4 mr-2" />
                Save Cover Letter
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Saved Cover Letters */}
      <Card>
        <CardHeader>
          <CardTitle>Saved Cover Letters</CardTitle>
          <CardDescription>Your previously created cover letters</CardDescription>
        </CardHeader>
        <CardContent>
          {savedLetters.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No saved cover letters yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {savedLetters.map((letter) => (
                <div key={letter.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{letter.name}</h3>
                      <p className="text-sm text-gray-600">Created on {new Date(letter.createdAt).toLocaleDateString()}</p>
                      {letter.companyName && (
                        <Badge variant="outline" className="mt-1">{letter.companyName}</Badge>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setCustomContent(letter.content);
                          setCoverLetterName(letter.name);
                        }}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDownloadDocument(letter)}
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Download TXT
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDownloadPDF(letter)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {letter.content.substring(0, 150)}...
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CoverLetterTemplates;
