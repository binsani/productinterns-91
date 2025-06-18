
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
  Clock,
  Settings
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ApplicantManagement from "@/components/employer/ApplicantManagement";
import { useAuthStore } from "@/stores/authStore";
import InternshipPostingModal from "@/components/employer/InternshipPostingModal";
import InternshipPostingsManagement from "@/components/employer/InternshipPostingsManagement";
import InterviewScheduling from "@/components/employer/InterviewScheduling";
import AnalyticsReporting from "@/components/employer/AnalyticsReporting";
import BillingManagement from "@/components/employer/BillingManagement";
import Messages from "@/components/employer/Messages";
import CompanyProfileEditor from "@/components/employer/CompanyProfileEditor";
import EmployerProfileSettings from "@/components/employer/EmployerProfileSettings";
import StatsCard from "@/components/shared/StatsCard";
import WelcomeHero from "@/components/shared/WelcomeHero";
import InternshipCard from "@/components/shared/InternshipCard";
import ApplicationCard from "@/components/shared/ApplicationCard";
import ScheduleInterviewModal from "@/components/employer/ScheduleInterviewModal";

const EmployerDashboard = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("overview");
  const [isInternshipPostingModalOpen, setIsInternshipPostingModalOpen] = useState(false);
  const [isScheduleInterviewModalOpen, setIsScheduleInterviewModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<{name: string, position: string} | null>(null);

  const navigationItems = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "company", label: "Company Profile", icon: Building2 },
    { id: "postings", label: "PM Internships", icon: Plus },
    { id: "applicants", label: "Applicants", icon: Users },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "interviews", label: "Interviews", icon: Calendar },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleInternshipView = (id: number) => {
    setActiveTab("applicants");
  };

  const handleInternshipEdit = (id: number) => {
    console.log("Edit PM internship:", id);
  };

  const handleApplicantReview = (id: number, name: string) => {
    console.log("Review applicant:", id, name);
  };

  const handleScheduleInterview = (candidateName: string, position: string) => {
    setSelectedCandidate({ name: candidateName, position });
    setIsScheduleInterviewModalOpen(true);
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
          title="Active PM Internships"
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

      {/* Active PM Internship Postings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Active PM Internship Postings</CardTitle>
            <CardDescription>Manage your current product management internship listings</CardDescription>
          </div>
          <Button onClick={() => setIsInternshipPostingModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Post New PM Internship
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
            ].map((internship) => (
              <InternshipCard
                key={internship.id}
                id={internship.id}
                title={internship.title}
                location={internship.location}
                type="Internship"
                applications={internship.applications}
                views={internship.views}
                posted={internship.posted}
                status={internship.status}
                onView={handleInternshipView}
                onEdit={handleInternshipEdit}
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
          <CardDescription>New candidates for your PM internship consideration</CardDescription>
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
                onScheduleInterview={() => handleScheduleInterview(applicant.name, applicant.position)}
                variant="applicant"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCompanyProfile = () => <CompanyProfileEditor />;

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "company":
        return renderCompanyProfile();
      case "postings":
        return <InternshipPostingsManagement />;
      case "applicants":
        return <ApplicantManagement />;
      case "messages":
        return <Messages />;
      case "interviews":
        return <InterviewScheduling />;
      case "analytics":
        return <AnalyticsReporting />;
      case "billing":
        return <BillingManagement />;
      case "settings":
        return <EmployerProfileSettings />;
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
      
      <InternshipPostingModal 
        isOpen={isInternshipPostingModalOpen} 
        onClose={() => setIsInternshipPostingModalOpen(false)} 
      />
      
      <ScheduleInterviewModal
        isOpen={isScheduleInterviewModalOpen}
        onClose={() => {
          setIsScheduleInterviewModalOpen(false);
          setSelectedCandidate(null);
        }}
        candidateName={selectedCandidate?.name}
        position={selectedCandidate?.position}
      />
    </>
  );
};

export default EmployerDashboard;
