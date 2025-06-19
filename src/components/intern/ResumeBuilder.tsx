
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ResumePreviewModal from "./ResumePreviewModal";
import ResumeTemplates from "./ResumeTemplates";
import PersonalInfoSection from "./resume/PersonalInfoSection";
import ExperienceSection from "./resume/ExperienceSection";
import ProjectsSection from "./resume/ProjectsSection";
import SkillsSection from "./resume/SkillsSection";
import EducationSection from "./resume/EducationSection";
import ProfessionalSummarySection from "./resume/ProfessionalSummarySection";

interface Experience {
  id: string;
  title: string;
  company: string;
  duration: string;
  description: string;
  achievements: string[];
}

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  impact: string;
}

interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    linkedin: string;
    location: string;
  };
  summary: string;
  experience: Experience[];
  projects: Project[];
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

const ResumeBuilder = () => {
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(false);
  const [showTemplates, setShowTemplates] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      linkedin: "",
      location: ""
    },
    summary: "",
    experience: [],
    projects: [],
    skills: {
      technical: [],
      product: [],
      soft: []
    },
    education: {
      degree: "",
      school: "",
      graduation: "",
      gpa: ""
    }
  });

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      title: "",
      company: "",
      duration: "",
      description: "",
      achievements: []
    };
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, newExp]
    }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: "",
      description: "",
      technologies: [],
      impact: ""
    };
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(project =>
        project.id === id ? { ...project, [field]: value } : project
      )
    }));
  };

  const removeProject = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(project => project.id !== id)
    }));
  };

  const addSkill = (category: keyof typeof resumeData.skills, skill: string) => {
    if (skill.trim()) {
      setResumeData(prev => ({
        ...prev,
        skills: {
          ...prev.skills,
          [category]: [...prev.skills[category], skill.trim()]
        }
      }));
    }
  };

  const removeSkill = (category: keyof typeof resumeData.skills, index: number) => {
    setResumeData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].filter((_, i) => i !== index)
      }
    }));
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setShowTemplates(false);
    toast({
      title: "Template Selected",
      description: "You can now customize your resume with the selected template."
    });
  };

  const handleBackToTemplates = () => {
    setShowTemplates(true);
    setSelectedTemplate(null);
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleDownload = () => {
    toast({
      title: "Resume Downloaded",
      description: "Your PM-focused resume has been downloaded as PDF.",
    });
  };

  if (showTemplates) {
    return (
      <div className="space-y-6">
        <ResumeTemplates onSelectTemplate={handleTemplateSelect} />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Button variant="ghost" size="sm" onClick={handleBackToTemplates} className="mr-2">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                PM Resume Builder
              </CardTitle>
              <CardDescription>Create a product management focused resume that highlights your PM skills and experience</CardDescription>
            </div>
            <Badge variant="secondary">Template: {selectedTemplate}</Badge>
          </CardHeader>
        </Card>

        <PersonalInfoSection
          personalInfo={resumeData.personalInfo}
          onUpdate={(field, value) => setResumeData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, [field]: value }
          }))}
        />

        <ProfessionalSummarySection
          summary={resumeData.summary}
          onUpdate={(summary) => setResumeData(prev => ({ ...prev, summary }))}
        />

        <ExperienceSection
          experience={resumeData.experience}
          onAdd={addExperience}
          onUpdate={updateExperience}
          onRemove={removeExperience}
        />

        <ProjectsSection
          projects={resumeData.projects}
          onAdd={addProject}
          onUpdate={updateProject}
          onRemove={removeProject}
        />

        <SkillsSection
          skills={resumeData.skills}
          onAddSkill={addSkill}
          onRemoveSkill={removeSkill}
        />

        <EducationSection
          education={resumeData.education}
          onUpdate={(field, value) => setResumeData(prev => ({
            ...prev,
            education: { ...prev.education, [field]: value }
          }))}
        />

        <Card>
          <CardContent className="pt-6">
            <div className="flex space-x-4">
              <Button onClick={handlePreview} variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview Resume
              </Button>
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" onClick={handleBackToTemplates}>
                Change Template
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <ResumePreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        resumeData={resumeData}
      />
    </>
  );
};

export default ResumeBuilder;
