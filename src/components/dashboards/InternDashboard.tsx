
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Search, 
  Bookmark, 
  FileText, 
  Target, 
  Bell, 
  MessageSquare, 
  BookOpen,
  TrendingUp,
  Calendar,
  Award,
  Building2,
  MapPin,
  Clock,
  Star
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuthStore } from "@/stores/authStore";

const InternDashboard = () => {
  const { user } = useAuthStore();
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
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 border-4 border-white/20">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">Welcome back, {user?.name}!</h2>
            <p className="text-blue-100">Ready to take the next step in your product management journey?</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">2 upcoming</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skill Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">+5% from last test</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Jobs</CardTitle>
            <Bookmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">3 new matches</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
          <CardDescription>Track your application progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { company: "TechCorp", position: "Product Management Intern", status: "Interview Scheduled", date: "2 days ago" },
              { company: "StartupX", position: "Junior PM Intern", status: "Under Review", date: "1 week ago" },
              { company: "BigTech Inc", position: "PM Summer Intern", status: "Application Sent", date: "1 week ago" },
            ].map((app, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Building2 className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="font-medium">{app.position}</p>
                    <p className="text-sm text-gray-600">{app.company}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={app.status === "Interview Scheduled" ? "default" : "secondary"}>
                    {app.status}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">{app.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommended Internships */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended for You</CardTitle>
          <CardDescription>Internships matching your profile and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { 
                company: "InnovateTech", 
                position: "Product Management Intern",
                location: "San Francisco, CA",
                type: "3 months",
                match: 95,
                description: "Join our product team to work on cutting-edge mobile applications."
              },
              { 
                company: "GrowthCo", 
                position: "Associate Product Manager Intern",
                location: "New York, NY",
                type: "6 months",
                match: 88,
                description: "Help drive product strategy for our B2B SaaS platform."
              },
            ].map((job, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{job.position}</h3>
                  <Badge className="bg-green-100 text-green-800">{job.match}% match</Badge>
                </div>
                <p className="text-blue-600 font-medium mb-2">{job.company}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                  <span className="flex items-center"><MapPin className="h-3 w-3 mr-1" />{job.location}</span>
                  <span className="flex items-center"><Clock className="h-3 w-3 mr-1" />{job.type}</span>
                </div>
                <p className="text-sm text-gray-700 mb-3">{job.description}</p>
                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1">Apply Now</Button>
                  <Button size="sm" variant="outline">Save</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Manage your personal information and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{user?.name}</h3>
              <p className="text-gray-600">{user?.email}</p>
              <Button variant="outline" size="sm" className="mt-2">Change Photo</Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Skills</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {["Product Strategy", "User Research", "Data Analysis", "Agile", "Figma"].map((skill) => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Preferred Locations</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {["San Francisco", "New York", "Remote"].map((location) => (
                  <Badge key={location} variant="outline">{location}</Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resume & Documents</CardTitle>
          <CardDescription>Upload and manage your documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Upload your resume</p>
            <Button variant="outline">Choose File</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "profile":
        return renderProfile();
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
