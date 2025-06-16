
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Users, Calendar, Globe, Award, Heart, Coffee, Gamepad2 } from "lucide-react";

interface CompanyProfileModalProps {
  companyId: number;
  isOpen: boolean;
  onClose: () => void;
}

const CompanyProfileModal = ({ companyId, isOpen, onClose }: CompanyProfileModalProps) => {
  const companyData = {
    1: {
      name: "Google",
      logo: "G",
      size: "10000+",
      founded: "1998",
      location: "Mountain View, CA",
      website: "google.com",
      description: "Google's mission is to organize the world's information and make it universally accessible and useful. We build products that help create opportunities for everyone, whether down the street or across the globe.",
      culture: "We believe that great products come from great teams. We foster a culture of innovation, collaboration, and continuous learning.",
      values: ["Focus on the user", "It's best to do one thing really well", "Fast is better than slow", "Democracy on the web works"],
      benefits: ["Health Insurance", "Free Meals", "Flexible Hours", "20% Time", "Learning Budget", "Gym Access"],
      techStack: ["React", "Python", "TensorFlow", "Kubernetes", "Go"],
      offices: ["Mountain View, CA", "New York, NY", "London, UK", "Bangalore, India"],
      pmInternProgram: {
        duration: "12 weeks",
        startDate: "June 2024",
        mentorship: "1:1 weekly mentoring with senior PMs",
        projects: "Work on real products used by millions",
        perks: ["Housing stipend", "Relocation assistance", "Full-time offer potential"]
      }
    },
    2: {
      name: "Meta",
      logo: "M",
      size: "10000+",
      founded: "2004",
      location: "Menlo Park, CA",
      website: "meta.com",
      description: "Meta builds technologies that help people connect, find communities, and grow businesses. We're moving beyond 2D screens toward immersive experiences in the metaverse.",
      culture: "Move fast, be bold, focus on impact, be open, and build social value. We believe in giving people the power to build community and bring the world closer together.",
      values: ["Move Fast", "Be Bold", "Focus on Impact", "Be Open", "Build Social Value"],
      benefits: ["Health Insurance", "Free Meals", "Flexible PTO", "Mental Health Support", "Family Leave", "Wellness Programs"],
      techStack: ["React", "GraphQL", "PyTorch", "Hack", "JavaScript"],
      offices: ["Menlo Park, CA", "Seattle, WA", "New York, NY", "Austin, TX"],
      pmInternProgram: {
        duration: "16 weeks",
        startDate: "May 2024",
        mentorship: "Cross-functional team integration",
        projects: "End-to-end product development",
        perks: ["$8000/month", "Housing assistance", "Return offer consideration"]
      }
    }
  };

  const company = companyData[companyId as keyof typeof companyData];

  if (!company) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">{company.logo}</span>
            </div>
            <div>
              <DialogTitle className="text-2xl">{company.name}</DialogTitle>
              <DialogDescription className="flex items-center space-x-4 mt-1">
                <span className="flex items-center"><MapPin className="h-4 w-4 mr-1" />{company.location}</span>
                <span className="flex items-center"><Users className="h-4 w-4 mr-1" />{company.size} employees</span>
                <span className="flex items-center"><Calendar className="h-4 w-4 mr-1" />Founded {company.founded}</span>
                <span className="flex items-center"><Globe className="h-4 w-4 mr-1" />{company.website}</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Company Description */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">About {company.name}</h3>
              <p className="text-gray-700">{company.description}</p>
            </CardContent>
          </Card>

          {/* Culture & Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-red-500" />
                  Culture
                </h3>
                <p className="text-gray-700 text-sm">{company.culture}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-yellow-500" />
                  Core Values
                </h3>
                <ul className="space-y-1">
                  {company.values.map((value, index) => (
                    <li key={index} className="text-sm text-gray-700">• {value}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* PM Internship Program */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3 text-blue-800">Product Management Internship Program</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-blue-700 mb-2">Program Details</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Duration:</strong> {company.pmInternProgram.duration}</p>
                    <p><strong>Start Date:</strong> {company.pmInternProgram.startDate}</p>
                    <p><strong>Mentorship:</strong> {company.pmInternProgram.mentorship}</p>
                    <p><strong>Projects:</strong> {company.pmInternProgram.projects}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-blue-700 mb-2">Program Perks</h4>
                  <div className="flex flex-wrap gap-1">
                    {company.pmInternProgram.perks.map((perk, index) => (
                      <Badge key={index} className="bg-blue-100 text-blue-800 text-xs">{perk}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Benefits & Tech Stack */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Coffee className="h-5 w-5 mr-2 text-brown-500" />
                  Benefits & Perks
                </h3>
                <div className="flex flex-wrap gap-1">
                  {company.benefits.map((benefit, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">{benefit}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Gamepad2 className="h-5 w-5 mr-2 text-purple-500" />
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-1">
                  {company.techStack.map((tech, index) => (
                    <Badge key={index} variant="outline" className="text-xs">{tech}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Office Locations */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-green-500" />
                Office Locations
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {company.offices.map((office, index) => (
                  <div key={index} className="text-sm text-gray-700 bg-gray-50 p-2 rounded text-center">
                    {office}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button>
              View Open Positions
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyProfileModal;
