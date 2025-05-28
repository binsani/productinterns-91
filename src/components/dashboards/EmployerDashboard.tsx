import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Building2, 
  Plus, 
  Users, 
  FileText, 
  MessageSquare, 
  Calendar,
  TrendingUp,
  CreditCard,
  BarChart3,
  UserCheck,
  MapPin,
  Eye,
  Clock
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ApplicantManagement from "@/components/employer/ApplicantManagement";
import { useAuthStore } from "@/stores/authStore";
import JobPostingModal from "@/components/employer/JobPostingModal";
import JobPostingsManagement from "@/components/employer/JobPostingsManagement";
import InterviewScheduling from "@/components/employer/InterviewScheduling";
import AnalyticsReporting from "@/components/employer/AnalyticsReporting";
import BillingManagement from "@/components/employer/BillingManagement";

const EmployerDashboard = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("overview");
  const [isJobPostingModalOpen, setIsJobPostingModalOpen] = useState(false);

  const navigationItems = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "company", label: "Company Profile", icon: Building2 },
    { id: "postings", label: "Job Postings", icon: Plus },
    { id: "applicants", label: "Applicants", icon: Users },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "interviews", label: "Interviews", icon: Calendar },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "billing", label: "Billing", icon: CreditCard },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 border-4 border-white/20">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">Welcome, {user?.name}!</h2>
            <p className="text-green-100">Find the perfect product management interns for {user?.companyName}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Postings</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">2 expiring soon</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">+12 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">3 today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hired</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">This quarter</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Job Postings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Active Job Postings</CardTitle>
            <CardDescription>Manage your current internship listings</CardDescription>
          </div>
          <Button onClick={() => setIsJobPostingModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { 
                title: "Product Management Intern", 
                applications: 15, 
                views: 245, 
                posted: "2 weeks ago",
                status: "Active",
                location: "San Francisco, CA"
              },
              { 
                title: "Junior PM Intern - Summer 2024", 
                applications: 23, 
                views: 187, 
                posted: "1 week ago",
                status: "Active",
                location: "Remote"
              },
              { 
                title: "Associate Product Manager Intern", 
                applications: 9, 
                views: 156, 
                posted: "3 days ago",
                status: "Active",
                location: "New York, NY"
              },
            ].map((job, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold">{job.title}</h3>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      {job.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center"><MapPin className="h-3 w-3 mr-1" />{job.location}</span>
                    <span className="flex items-center"><Eye className="h-3 w-3 mr-1" />{job.views} views</span>
                    <span className="flex items-center"><Users className="h-3 w-3 mr-1" />{job.applications} applications</span>
                    <span className="flex items-center"><Clock className="h-3 w-3 mr-1" />Posted {job.posted}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">View Applications</Button>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
          <CardDescription>New candidates for your consideration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { 
                name: "Alex Johnson", 
                position: "Product Management Intern", 
                university: "Stanford University",
                skills: ["Product Strategy", "Data Analysis", "User Research"],
                applied: "2 hours ago",
                match: 94
              },
              { 
                name: "Sarah Chen", 
                position: "Junior PM Intern", 
                university: "UC Berkeley",
                skills: ["Agile", "Figma", "SQL"],
                applied: "1 day ago",
                match: 87
              },
              { 
                name: "Michael Rodriguez", 
                position: "Associate PM Intern", 
                university: "MIT",
                skills: ["Product Strategy", "Python", "A/B Testing"],
                applied: "2 days ago",
                match: 91
              },
            ].map((applicant, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${applicant.name}`} />
                    <AvatarFallback>{applicant.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold">{applicant.name}</h3>
                      <Badge className="bg-blue-100 text-blue-800">{applicant.match}% match</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{applicant.university} • Applied to {applicant.position}</p>
                    <div className="flex space-x-1 mt-1">
                      {applicant.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{applicant.applied}</span>
                  <Button size="sm">Review</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCompanyProfile = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Showcase your company to attract top talent</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">{user?.companyName?.charAt(0)}</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold">{user?.companyName}</h3>
              <p className="text-gray-600">Technology • 500-1000 employees</p>
              <Button variant="outline" size="sm" className="mt-2">Update Logo</Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Industry</label>
              <p className="text-gray-700">Technology & Software</p>
            </div>
            <div>
              <label className="text-sm font-medium">Company Size</label>
              <p className="text-gray-700">500-1000 employees</p>
            </div>
            <div>
              <label className="text-sm font-medium">Location</label>
              <p className="text-gray-700">San Francisco, CA</p>
            </div>
            <div>
              <label className="text-sm font-medium">Founded</label>
              <p className="text-gray-700">2015</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Company Culture & Values</CardTitle>
          <CardDescription>Help candidates understand your work environment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Company Description</label>
              <p className="text-gray-700 mt-1">
                We're a fast-growing technology company focused on building innovative products 
                that solve real-world problems. Our team values collaboration, innovation, and 
                continuous learning.
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Benefits & Perks</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {["Health Insurance", "Flexible Hours", "Remote Work", "Learning Budget", "Free Lunch"].map((benefit) => (
                  <Badge key={benefit} variant="secondary">{benefit}</Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "company":
        return renderCompanyProfile();
      case "postings":
        return <JobPostingsManagement />;
      case "applicants":
        return <ApplicantManagement />;
      case "interviews":
        return <InterviewScheduling />;
      case "analytics":
        return <AnalyticsReporting />;
      case "billing":
        return <BillingManagement />;
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>{navigationItems.find(item => item.id === activeTab)?.label}</CardTitle>
              <CardDescription>This section is under development</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Content for {activeTab} will be available soon.</p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <>
      <DashboardLayout
        title="Employer Dashboard"
        navigationItems={navigationItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        {renderContent()}
      </DashboardLayout>
      
      <JobPostingModal 
        isOpen={isJobPostingModalOpen} 
        onClose={() => setIsJobPostingModalOpen(false)} 
      />
    </>
  );
};

export default EmployerDashboard;
