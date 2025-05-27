
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Star, 
  Calendar, 
  MessageSquare, 
  Download,
  Eye,
  CheckCircle,
  X,
  Clock,
  GraduationCap,
  MapPin,
  UserCheck
} from "lucide-react";

interface Applicant {
  id: string;
  name: string;
  email: string;
  university: string;
  major: string;
  gpa: number;
  skills: string[];
  experience: string;
  appliedDate: string;
  status: "new" | "reviewing" | "shortlisted" | "interviewed" | "offered" | "rejected";
  position: string;
  match: number;
  avatar: string;
  resumeUrl?: string;
}

const ApplicantManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [positionFilter, setPositionFilter] = useState("all");

  const [applicants] = useState<Applicant[]>([
    {
      id: "1",
      name: "Alex Johnson",
      email: "alex.johnson@university.edu",
      university: "Stanford University",
      major: "Computer Science",
      gpa: 3.8,
      skills: ["Product Strategy", "Data Analysis", "User Research", "Figma"],
      experience: "2 years",
      appliedDate: "2024-01-20",
      status: "new",
      position: "Product Management Intern",
      match: 94,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex"
    },
    {
      id: "2",
      name: "Sarah Chen",
      email: "sarah.chen@university.edu",
      university: "UC Berkeley",
      major: "Business Administration",
      gpa: 3.9,
      skills: ["Agile", "Market Research", "SQL", "Python"],
      experience: "1 year",
      appliedDate: "2024-01-19",
      status: "shortlisted",
      position: "Junior PM Intern",
      match: 87,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah"
    },
    {
      id: "3",
      name: "Michael Rodriguez",
      email: "michael.r@university.edu",
      university: "MIT",
      major: "Engineering",
      gpa: 3.7,
      skills: ["Product Strategy", "A/B Testing", "Analytics"],
      experience: "1.5 years",
      appliedDate: "2024-01-18",
      status: "interviewed",
      position: "Associate PM Intern",
      match: 91,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-800";
      case "reviewing": return "bg-yellow-100 text-yellow-800";
      case "shortlisted": return "bg-purple-100 text-purple-800";
      case "interviewed": return "bg-green-100 text-green-800";
      case "offered": return "bg-emerald-100 text-emerald-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new": return <Clock className="h-3 w-3" />;
      case "shortlisted": return <Star className="h-3 w-3" />;
      case "interviewed": return <Calendar className="h-3 w-3" />;
      case "offered": return <CheckCircle className="h-3 w-3" />;
      case "rejected": return <X className="h-3 w-3" />;
      default: return <Eye className="h-3 w-3" />;
    }
  };

  const filteredApplicants = applicants.filter(applicant => {
    const matchesSearch = applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         applicant.university.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || applicant.status === statusFilter;
    const matchesPosition = positionFilter === "all" || applicant.position === positionFilter;
    
    return matchesSearch && matchesStatus && matchesPosition;
  });

  const positions = [...new Set(applicants.map(a => a.position))];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: "Total Applications", value: applicants.length, color: "text-blue-600" },
          { label: "New", value: applicants.filter(a => a.status === "new").length, color: "text-blue-600" },
          { label: "Shortlisted", value: applicants.filter(a => a.status === "shortlisted").length, color: "text-purple-600" },
          { label: "Interviewed", value: applicants.filter(a => a.status === "interviewed").length, color: "text-green-600" },
          { label: "Offered", value: applicants.filter(a => a.status === "offered").length, color: "text-emerald-600" }
        ].map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Applicant Management</CardTitle>
          <CardDescription>Review and manage candidate applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search applicants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="reviewing">Reviewing</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="interviewed">Interviewed</SelectItem>
                <SelectItem value="offered">Offered</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={positionFilter} onValueChange={setPositionFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Position" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All Positions</SelectItem>
                {positions.map(position => (
                  <SelectItem key={position} value={position}>{position}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Applicant List */}
          <div className="space-y-4">
            {filteredApplicants.map((applicant) => (
              <div key={applicant.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={applicant.avatar} alt={applicant.name} />
                      <AvatarFallback>{applicant.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-lg">{applicant.name}</h3>
                        <Badge className="bg-blue-100 text-blue-800">
                          {applicant.match}% match
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{applicant.email}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <span className="flex items-center">
                          <GraduationCap className="h-3 w-3 mr-1" />
                          {applicant.university}
                        </span>
                        <span>{applicant.major}</span>
                        <span>GPA: {applicant.gpa}</span>
                        <span>{applicant.experience} experience</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm text-gray-600">Applied to:</span>
                        <Badge variant="outline">{applicant.position}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {applicant.skills.slice(0, 4).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {applicant.skills.length > 4 && (
                          <Badge variant="secondary" className="text-xs">
                            +{applicant.skills.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={getStatusColor(applicant.status)}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(applicant.status)}
                        <span className="capitalize">{applicant.status}</span>
                      </div>
                    </Badge>
                    <span className="text-xs text-gray-500">
                      Applied {new Date(applicant.appliedDate).toLocaleDateString()}
                    </span>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <MessageSquare className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <Calendar className="h-3 w-3" />
                      </Button>
                    </div>
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

export default ApplicantManagement;
