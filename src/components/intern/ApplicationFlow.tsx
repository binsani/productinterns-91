
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Send, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ApplicationFlowProps {
  internshipId: number;
  internshipTitle: string;
  companyName: string;
  onClose: () => void;
}

const ApplicationFlow = ({ internshipId, internshipTitle, companyName, onClose }: ApplicationFlowProps) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    coverLetter: "",
    resume: null as File | null,
    portfolio: "",
    availability: "",
    questions: ""
  });

  const steps = [
    { id: 1, title: "Application Details", description: "Tell us about yourself" },
    { id: 2, title: "Upload Documents", description: "Resume and portfolio" },
    { id: 3, title: "Final Review", description: "Review and submit" },
    { id: 4, title: "Confirmation", description: "Application submitted" }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, resume: file }));
      toast({
        title: "Resume Uploaded",
        description: `${file.name} has been uploaded successfully.`
      });
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Application Submitted!",
      description: `Your application for ${internshipTitle} at ${companyName} has been submitted successfully.`
    });
    setCurrentStep(4);
    setTimeout(() => {
      onClose();
    }, 3000);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="coverLetter">Cover Letter *</Label>
              <Textarea
                id="coverLetter"
                value={formData.coverLetter}
                onChange={(e) => setFormData(prev => ({ ...prev, coverLetter: e.target.value }))}
                placeholder="Write a compelling cover letter explaining why you're interested in this PM internship..."
                rows={6}
                required
              />
            </div>
            <div>
              <Label htmlFor="portfolio">Portfolio/Website URL</Label>
              <Input
                id="portfolio"
                value={formData.portfolio}
                onChange={(e) => setFormData(prev => ({ ...prev, portfolio: e.target.value }))}
                placeholder="https://your-portfolio.com"
              />
            </div>
            <div>
              <Label htmlFor="availability">Availability</Label>
              <Textarea
                id="availability"
                value={formData.availability}
                onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                placeholder="When are you available to start? Any scheduling constraints?"
                rows={3}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label>Resume Upload *</Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Upload your resume (PDF, DOC, DOCX)</p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <Button type="button" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Choose File
                    </Button>
                  </label>
                  {formData.resume && (
                    <div className="mt-2">
                      <Badge variant="secondary">
                        {formData.resume.name}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="questions">Additional Information</Label>
              <Textarea
                id="questions"
                value={formData.questions}
                onChange={(e) => setFormData(prev => ({ ...prev, questions: e.target.value }))}
                placeholder="Any questions or additional information you'd like to share?"
                rows={4}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Application Summary</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Position:</strong> {internshipTitle}</p>
                <p><strong>Company:</strong> {companyName}</p>
                <p><strong>Resume:</strong> {formData.resume?.name || "Not uploaded"}</p>
                <p><strong>Portfolio:</strong> {formData.portfolio || "Not provided"}</p>
              </div>
            </div>
            <div>
              <Label>Cover Letter Preview</Label>
              <div className="mt-2 p-4 border rounded-lg bg-gray-50 max-h-32 overflow-y-auto">
                <p className="text-sm whitespace-pre-wrap">{formData.coverLetter}</p>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Application Submitted!</h3>
            <p className="text-gray-600 mb-4">
              Your application for {internshipTitle} at {companyName} has been submitted successfully.
            </p>
            <p className="text-sm text-gray-500">
              You'll receive an email confirmation and updates on your application status.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Apply for {internshipTitle}</CardTitle>
        <CardDescription>at {companyName}</CardDescription>
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Step {currentStep} of {steps.length}</span>
            <span className="text-sm text-gray-500">{Math.round((currentStep / steps.length) * 100)}% Complete</span>
          </div>
          <Progress value={(currentStep / steps.length) * 100} className="h-2" />
        </div>
        <div className="flex justify-between mt-4">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= step.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step.id}
              </div>
              <div className="text-xs text-center mt-1">
                <div className="font-medium">{step.title}</div>
                <div className="text-gray-500">{step.description}</div>
              </div>
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {renderStep()}
        
        {currentStep < 4 && (
          <div className="flex justify-between mt-6">
            <Button 
              variant="outline" 
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              Back
            </Button>
            {currentStep === 3 ? (
              <Button onClick={handleSubmit}>
                <Send className="h-4 w-4 mr-2" />
                Submit Application
              </Button>
            ) : (
              <Button 
                onClick={handleNext}
                disabled={currentStep === 1 && !formData.coverLetter}
              >
                Next
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApplicationFlow;
