
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
  TrendingUp
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ApplicationTracker from "@/components/intern/ApplicationTracker";
import SkillAssessment from "@/components/intern/SkillAssessment";
import WelcomeSection from "@/components/intern/WelcomeSection";
import StatsCards from "@/components/intern/StatsCards";
import RecentApplications from "@/components/intern/RecentApplications";
import RecommendedJobs from "@/components/intern/RecommendedJobs";
import ProfileSection from "@/components/intern/ProfileSection";

const InternDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const navigationItems = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "profile", label: "Profile", icon: User },
    { id: "internships", label: "Internships", icon: Search },
    { id: "applications", label: "Applications", icon: FileText },
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
      case "applications":
        return <ApplicationTracker />;
      case "skills":
        return <SkillAssessment />;
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
