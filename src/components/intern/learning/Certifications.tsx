
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Award, Download, Share, Calendar, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Certification {
  id: string;
  title: string;
  description: string;
  issuer: string;
  earnedDate?: string;
  expiryDate?: string;
  credentialId?: string;
  status: "earned" | "in_progress" | "available";
  progress?: number;
  requirements: string[];
}

const Certifications = () => {
  const { toast } = useToast();

  const certifications: Certification[] = [
    {
      id: "1",
      title: "Product Management Fundamentals",
      description: "Demonstrates basic understanding of PM principles",
      issuer: "PM Academy",
      earnedDate: "2024-01-15",
      credentialId: "PMF-2024-001234",
      status: "earned",
      requirements: [
        "Complete PM Fundamentals course",
        "Pass assessment with 80% or higher",
        "Submit a product strategy project"
      ]
    },
    {
      id: "2",
      title: "Data-Driven Product Management",
      description: "Advanced certification in product analytics and metrics",
      issuer: "PM Academy",
      status: "in_progress",
      progress: 65,
      requirements: [
        "Complete Data Analysis course",
        "Pass advanced metrics assessment",
        "Complete A/B testing practical",
        "Submit analytics dashboard project"
      ]
    },
    {
      id: "3",
      title: "User Experience for Product Managers",
      description: "Certification in UX principles and user research",
      issuer: "UX Institute",
      status: "available",
      requirements: [
        "Complete UX Design course",
        "Pass user research assessment",
        "Complete user interview practical",
        "Submit UX improvement project"
      ]
    },
    {
      id: "4",
      title: "Agile Product Management",
      description: "Certification in agile methodologies for PMs",
      issuer: "Agile Alliance",
      status: "available",
      requirements: [
        "Complete Agile PM course",
        "Pass agile methodologies assessment",
        "Participate in sprint planning simulation",
        "Submit agile transformation case study"
      ]
    }
  ];

  const handleDownloadCertificate = (certId: string) => {
    toast({
      title: "Certificate Downloaded",
      description: "Your certificate has been downloaded as a PDF.",
    });
  };

  const handleShareCertificate = (certId: string) => {
    toast({
      title: "Certificate Shared",
      description: "Certificate link copied to clipboard.",
    });
  };

  const handleStartCertification = (certId: string) => {
    toast({
      title: "Certification Started",
      description: "Begin with the required courses and assessments.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "earned": return "bg-green-100 text-green-800";
      case "in_progress": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const earnedCertifications = certifications.filter(c => c.status === "earned");
  const inProgressCertifications = certifications.filter(c => c.status === "in_progress");

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{earnedCertifications.length}</div>
            <div className="text-sm text-gray-600">Earned</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{inProgressCertifications.length}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {certifications.filter(c => c.status === "available").length}
            </div>
            <div className="text-sm text-gray-600">Available</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{certifications.length}</div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
      </div>

      {/* Earned Certifications */}
      {earnedCertifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-green-600" />
              Earned Certifications
            </CardTitle>
            <CardDescription>Your completed certifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {earnedCertifications.map((cert) => (
                <div key={cert.id} className="border rounded-lg p-4 bg-green-50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-green-900">{cert.title}</h3>
                      <p className="text-sm text-green-700">{cert.issuer}</p>
                    </div>
                    <Award className="h-6 w-6 text-green-600" />
                  </div>
                  
                  <p className="text-sm text-green-800 mb-3">{cert.description}</p>
                  
                  <div className="space-y-2 text-xs text-green-700">
                    <div>Earned: {cert.earnedDate}</div>
                    {cert.credentialId && (
                      <div>ID: {cert.credentialId}</div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2 mt-3">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDownloadCertificate(cert.id)}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleShareCertificate(cert.id)}
                    >
                      <Share className="h-3 w-3 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Certifications */}
      <Card>
        <CardHeader>
          <CardTitle>All Certifications</CardTitle>
          <CardDescription>Available certification pathways</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {certifications.map((cert) => (
              <div key={cert.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold">{cert.title}</h3>
                      <Badge className={getStatusColor(cert.status)}>
                        {cert.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm mb-1">{cert.description}</p>
                    <p className="text-gray-500 text-xs">Issued by {cert.issuer}</p>
                  </div>
                </div>

                {cert.status === "in_progress" && cert.progress && (
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{cert.progress}%</span>
                    </div>
                    <Progress value={cert.progress} className="h-2" />
                  </div>
                )}

                <div className="mb-4">
                  <h4 className="font-medium text-sm mb-2">Requirements:</h4>
                  <ul className="space-y-1">
                    {cert.requirements.map((req, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <CheckCircle className={`h-3 w-3 mt-0.5 mr-2 flex-shrink-0 ${
                          cert.status === "earned" ? "text-green-600" : "text-gray-400"
                        }`} />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-between items-center">
                  {cert.earnedDate && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      Earned {cert.earnedDate}
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    {cert.status === "available" && (
                      <Button 
                        onClick={() => handleStartCertification(cert.id)}
                        size="sm"
                      >
                        Start Certification
                      </Button>
                    )}
                    {cert.status === "in_progress" && (
                      <Button 
                        onClick={() => handleStartCertification(cert.id)}
                        size="sm"
                      >
                        Continue
                      </Button>
                    )}
                    {cert.status === "earned" && (
                      <div className="flex space-x-2">
                        <Button 
                          onClick={() => handleDownloadCertificate(cert.id)}
                          variant="outline"
                          size="sm"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                        <Button 
                          onClick={() => handleShareCertificate(cert.id)}
                          variant="outline"
                          size="sm"
                        >
                          <Share className="h-3 w-3 mr-1" />
                          Share
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Certifications;
