
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  User, 
  Search, 
  Bookmark, 
  FileText, 
  Target, 
  MessageSquare, 
  BookOpen,
  TrendingUp,
  PenTool,
  Calendar,
  Edit
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ApplicationTracker from "@/components/intern/ApplicationTracker";
import SkillAssessment from "@/components/intern/SkillAssessment";
import WelcomeSection from "@/components/intern/WelcomeSection";
import StatsCards from "@/components/intern/StatsCards";
import RecentApplications from "@/components/intern/RecentApplications";
import RecommendedJobs from "@/components/intern/RecommendedJobs";
import ProfileSection from "@/components/intern/ProfileSection";
import InternshipBrowser from "@/components/intern/InternshipBrowser";
import SavedJobs from "@/components/intern/SavedJobs";
import Messages from "@/components/intern/Messages";
import Learning from "@/components/intern/Learning";
import ResumeBuilder from "@/components/intern/ResumeBuilder";
import CoverLetterTemplates from "@/components/intern/CoverLetterTemplates";
import InterviewScheduling from "@/components/intern/InterviewScheduling";

const InternDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const navigationItems = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "profile", label: "Profile", icon: User },
    { id: "internships", label: "Internships", icon: Search },
    { id: "applications", label: "Applications", icon: FileText },
    { id: "interviews", label: "Interviews", icon: Calendar },
    { id: "resume", label: "Resume Builder", icon: Edit },
    { id: "cover-letter", label: "Cover Letters", icon: PenTool },
    { id: "saved", label: "Saved", icon: Bookmark },
    { id: "skills", label: "Skill Tests", icon: Target },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "learning", label: "Learning", icon: BookOpen },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <WelcomeSection />
      <StatsCards />
      <RecentApplications />
      <RecommendedJobs />
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "profile":
        return <ProfileSection />;
      case "internships":
        return <InternshipBrowser />;
      case "applications":
        return <ApplicationTracker />;
      case "interviews":
        return <InterviewScheduling />;
      case "resume":
        return <ResumeBuilder />;
      case "cover-letter":
        return <CoverLetterTemplates />;
      case "saved":
        return <SavedJobs />;
      case "skills":
        return <SkillAssessment />;
      case "messages":
        return <Messages />;
      case "learning":
        return <Learning />;
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
    <DashboardLayout
      title="Intern Dashboard"
      navigationItems={navigationItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default InternDashboard;
