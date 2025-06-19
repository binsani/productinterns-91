import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Download, Eye, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ResumePreviewModal from "./ResumePreviewModal";
import ResumeTemplates from "./ResumeTemplates";

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

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Full Name"
                value={resumeData.personalInfo.name}
                onChange={(e) => setResumeData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, name: e.target.value }
                }))}
              />
              <Input
                placeholder="Email"
                value={resumeData.personalInfo.email}
                onChange={(e) => setResumeData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, email: e.target.value }
                }))}
              />
              <Input
                placeholder="Phone"
                value={resumeData.personalInfo.phone}
                onChange={(e) => setResumeData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, phone: e.target.value }
                }))}
              />
              <Input
                placeholder="LinkedIn Profile"
                value={resumeData.personalInfo.linkedin}
                onChange={(e) => setResumeData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, linkedin: e.target.value }
                }))}
              />
            </div>
            <Input
              placeholder="Location"
              value={resumeData.personalInfo.location}
              onChange={(e) => setResumeData(prev => ({
                ...prev,
                personalInfo: { ...prev.personalInfo, location: e.target.value }
              }))}
            />
          </CardContent>
        </Card>

        {/* Professional Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Summary</CardTitle>
            <CardDescription>A compelling summary highlighting your PM aspirations and relevant experience</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Write a compelling summary that highlights your passion for product management, relevant experience, and career goals..."
              value={resumeData.summary}
              onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Experience */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Experience</CardTitle>
              <CardDescription>Include internships, part-time jobs, and relevant volunteer work</CardDescription>
            </div>
            <Button onClick={addExperience}>
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {resumeData.experience.map((exp) => (
              <div key={exp.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                    <Input
                      placeholder="Job Title"
                      value={exp.title}
                      onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                    />
                    <Input
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="sm" onClick={() => removeExperience(exp.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  placeholder="Duration (e.g., Jun 2023 - Aug 2023)"
                  value={exp.duration}
                  onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)}
                />
                <Textarea
                  placeholder="Describe your responsibilities and achievements, focusing on PM-relevant skills like data analysis, user research, cross-functional collaboration..."
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                  rows={3}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Projects</CardTitle>
              <CardDescription>Showcase projects that demonstrate PM skills</CardDescription>
            </div>
            <Button onClick={addProject}>
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {resumeData.projects.map((project) => (
              <div key={project.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <Input
                    placeholder="Project Name"
                    value={project.name}
                    onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                    className="flex-1 mr-3"
                  />
                  <Button variant="outline" size="sm" onClick={() => removeProject(project.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea
                  placeholder="Project description focusing on problem solved, your role, and methodologies used..."
                  value={project.description}
                  onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                  rows={2}
                />
                <Input
                  placeholder="Impact/Results (e.g., Increased user engagement by 25%)"
                  value={project.impact}
                  onChange={(e) => updateProject(project.id, 'impact', e.target.value)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
            <CardDescription>Categorize your skills to highlight PM competencies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(resumeData.skills).map(([category, skills]) => (
              <div key={category}>
                <h4 className="font-medium mb-2 capitalize">
                  {category === 'technical' ? 'Technical Skills' : 
                   category === 'product' ? 'Product Management Skills' : 
                   'Soft Skills'}
                </h4>
                <div className="flex flex-wrap gap-2 mb-2">
                  {skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-1"
                        onClick={() => removeSkill(category as keyof typeof resumeData.skills, index)}
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
                      addSkill(category as keyof typeof resumeData.skills, e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Education */}
        <Card>
          <CardHeader>
            <CardTitle>Education</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Degree"
                value={resumeData.education.degree}
                onChange={(e) => setResumeData(prev => ({
                  ...prev,
                  education: { ...prev.education, degree: e.target.value }
                }))}
              />
              <Input
                placeholder="School/University"
                value={resumeData.education.school}
                onChange={(e) => setResumeData(prev => ({
                  ...prev,
                  education: { ...prev.education, school: e.target.value }
                }))}
              />
              <Input
                placeholder="Graduation Date"
                value={resumeData.education.graduation}
                onChange={(e) => setResumeData(prev => ({
                  ...prev,
                  education: { ...prev.education, graduation: e.target.value }
                }))}
              />
              <Input
                placeholder="GPA (optional)"
                value={resumeData.education.gpa}
                onChange={(e) => setResumeData(prev => ({
                  ...prev,
                  education: { ...prev.education, gpa: e.target.value }
                }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
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

      {/* Resume Preview Modal */}
      <ResumePreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        resumeData={resumeData}
      />
    </>
  );
};

export default ResumeBuilder;
