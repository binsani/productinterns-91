
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    linkedin: string;
    location: string;
  };
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    impact: string;
  }>;
  skills: {
    technical: string[];
    product: string[];
    soft: string[];
  };
  education: {
    degree: string;
    school: string;
    graduation: string;
    gpa: string;
  };
}

interface ResumePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeData: ResumeData;
}

const ResumePreviewModal = ({ isOpen, onClose, resumeData }: ResumePreviewModalProps) => {
  const { toast } = useToast();

  const handleDownloadPDF = () => {
    // In a real implementation, this would generate and download a PDF
    toast({
      title: "PDF Downloaded",
      description: "Your resume has been downloaded as a PDF file.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Resume Preview</span>
            <div className="flex space-x-2">
              <Button onClick={handleDownloadPDF} size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="bg-white border rounded-lg p-8 space-y-6 text-sm">
          {/* Header */}
          <div className="text-center border-b pb-4">
            <h1 className="text-2xl font-bold text-gray-900">{resumeData.personalInfo.name}</h1>
            <div className="flex justify-center space-x-4 text-gray-600 mt-2">
              <span>{resumeData.personalInfo.email}</span>
              <span>•</span>
              <span>{resumeData.personalInfo.phone}</span>
              <span>•</span>
              <span>{resumeData.personalInfo.location}</span>
            </div>
            {resumeData.personalInfo.linkedin && (
              <div className="text-blue-600 mt-1">{resumeData.personalInfo.linkedin}</div>
            )}
          </div>

          {/* Summary */}
          {resumeData.summary && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Professional Summary</h2>
              <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
            </div>
          )}

          {/* Education */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Education</h2>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="font-medium">{resumeData.education.degree}</span>
                <span>{resumeData.education.graduation}</span>
              </div>
              <div className="text-gray-600">{resumeData.education.school}</div>
              {resumeData.education.gpa && (
                <div className="text-gray-600">GPA: {resumeData.education.gpa}</div>
              )}
            </div>
          </div>

          {/* Experience */}
          {resumeData.experience.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Experience</h2>
              <div className="space-y-4">
                {resumeData.experience.map((exp, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{exp.title}</h3>
                        <p className="text-gray-600">{exp.company}</p>
                      </div>
                      <span className="text-gray-500 text-sm">{exp.duration}</span>
                    </div>
                    <p className="text-gray-700 mt-1">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {resumeData.projects.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Projects</h2>
              <div className="space-y-3">
                {resumeData.projects.map((project, index) => (
                  <div key={index}>
                    <h3 className="font-medium">{project.name}</h3>
                    <p className="text-gray-700">{project.description}</p>
                    {project.impact && (
                      <p className="text-gray-600 italic">Impact: {project.impact}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Skills</h2>
            <div className="space-y-2">
              {resumeData.skills.technical.length > 0 && (
                <div>
                  <span className="font-medium">Technical: </span>
                  <span className="text-gray-700">{resumeData.skills.technical.join(", ")}</span>
                </div>
              )}
              {resumeData.skills.product.length > 0 && (
                <div>
                  <span className="font-medium">Product Management: </span>
                  <span className="text-gray-700">{resumeData.skills.product.join(", ")}</span>
                </div>
              )}
              {resumeData.skills.soft.length > 0 && (
                <div>
                  <span className="font-medium">Soft Skills: </span>
                  <span className="text-gray-700">{resumeData.skills.soft.join(", ")}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResumePreviewModal;
