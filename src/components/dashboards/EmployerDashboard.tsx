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
import StatsCard from "@/components/shared/StatsCard";
import WelcomeHero from "@/components/shared/WelcomeHero";
import JobCard from "@/components/shared/JobCard";
import ApplicationCard from "@/components/shared/ApplicationCard";

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

  const handleJobView = (id: number) => {
    setActiveTab("applicants");
  };

  const handleJobEdit = (id: number) => {
    console.log("Edit job:", id);
  };

  const handleApplicantReview = (id: number, name: string) => {
    console.log("Review applicant:", id, name);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <WelcomeHero
        name={user?.name || "User"}
        avatar={user?.avatar}
        title={`Welcome, ${user?.name}!`}
        subtitle={`Find the perfect product management interns for ${user?.companyName}`}
        gradient="from-green-600 to-blue-600"
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Active Postings"
          value="5"
          change="2 expiring soon"
          icon={Plus}
        />
        <StatsCard
          title="Applications"
          value="47"
          change="+12 this week"
          icon={FileText}
        />
        <StatsCard
          title="Interviews"
          value="8"
          change="3 today"
          icon={Calendar}
        />
        <StatsCard
          title="Hired"
          value="12"
          change="This quarter"
          icon={UserCheck}
        />
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
                id: 1,
                title: "Product Management Intern", 
                applications: 15, 
                views: 245, 
                posted: "2 weeks ago",
                status: "Active",
                location: "San Francisco, CA"
              },
              { 
                id: 2,
                title: "Junior PM Intern - Summer 2024", 
                applications: 23, 
                views: 187, 
                posted: "1 week ago",
                status: "Active",
                location: "Remote"
              },
              { 
                id: 3,
                title: "Associate Product Manager Intern", 
                applications: 9, 
                views: 156, 
                posted: "3 days ago",
                status: "Active",
                location: "New York, NY"
              },
            ].map((job) => (
              <JobCard
                key={job.id}
                id={job.id}
                title={job.title}
                location={job.location}
                type="Full-time"
                applications={job.applications}
                views={job.views}
                posted={job.posted}
                status={job.status}
                onView={handleJobView}
                onEdit={handleJobEdit}
                variant="posting"
              />
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
                id: 1,
                name: "Alex Johnson", 
                position: "Product Management Intern", 
                university: "Stanford University",
                skills: ["Product Strategy", "Data Analysis", "User Research"],
                applied: "2 hours ago",
                match: 94
              },
              { 
                id: 2,
                name: "Sarah Chen", 
                position: "Junior PM Intern", 
                university: "UC Berkeley",
                skills: ["Agile", "Figma", "SQL"],
                applied: "1 day ago",
                match: 87
              },
              { 
                id: 3,
                name: "Michael Rodriguez", 
                position: "Associate PM Intern", 
                university: "MIT",
                skills: ["Product Strategy", "Python", "A/B Testing"],
                applied: "2 days ago",
                match: 91
              },
            ].map((applicant) => (
              <ApplicationCard
                key={applicant.id}
                id={applicant.id}
                name={applicant.name}
                position={applicant.position}
                university={applicant.university}
                skills={applicant.skills}
                applied={applicant.applied}
                match={applicant.match}
                onReview={handleApplicantReview}
                variant="applicant"
              />
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
