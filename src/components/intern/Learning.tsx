import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Play, Clock, Award, Star, GraduationCap, Target, Trophy } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CourseLearning from "./learning/CourseLearning";
import Assessments from "./learning/Assessments";
import Certifications from "./learning/Certifications";

const Learning = () => {
  const [activeSubPage, setActiveSubPage] = useState("overview");

  const courses = [
    {
      id: 1,
      title: "Product Management Fundamentals",
      description: "Learn the basics of product management, from strategy to execution",
      duration: "4 hours",
      progress: 75,
      rating: 4.8,
      level: "Beginner",
      topics: ["Product Strategy", "User Research", "Roadmapping"]
    },
    {
      id: 2,
      title: "Data-Driven Product Decisions",
      description: "Master analytics and metrics for better product decisions",
      duration: "3 hours", 
      progress: 30,
      rating: 4.9,
      level: "Intermediate",
      topics: ["Analytics", "A/B Testing", "KPIs"]
    },
    {
      id: 3,
      title: "User Experience for PMs",
      description: "Understand UX principles and design thinking",
      duration: "5 hours",
      progress: 0,
      rating: 4.7,
      level: "Beginner",
      topics: ["UX Design", "User Testing", "Wireframing"]
    }
  ];

  const achievements = [
    {
      title: "First Course Completed",
      description: "Finished your first learning module",
      earned: true,
      icon: BookOpen
    },
    {
      title: "Analytics Expert",
      description: "Completed all data analysis courses",
      earned: false,
      icon: Award
    },
    {
      title: "Learning Streak",
      description: "7 days of continuous learning",
      earned: true,
      icon: Star
    }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Progress</CardTitle>
          <CardDescription>Track your product management education journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">3</div>
              <p className="text-sm text-gray-600">Courses Enrolled</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">12</div>
              <p className="text-sm text-gray-600">Hours Completed</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">2</div>
              <p className="text-sm text-gray-600">Certificates Earned</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">85%</div>
              <p className="text-sm text-gray-600">Average Score</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveSubPage("courses")}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
              Courses
            </CardTitle>
            <CardDescription>Interactive learning modules</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">View Courses</Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveSubPage("assessments")}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-green-600" />
              Assessments
            </CardTitle>
            <CardDescription>Test your PM knowledge</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Take Assessments</Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveSubPage("certifications")}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-purple-600" />
              Certifications
            </CardTitle>
            <CardDescription>Earn professional certificates</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">View Certifications</Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Learning Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <Award className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Completed "Product Strategy Fundamentals"</p>
                <p className="text-sm text-gray-600">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <Play className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Started "Data-Driven Product Decisions"</p>
                <p className="text-sm text-gray-600">1 day ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeSubPage) {
      case "courses":
        return <CourseLearning />;
      case "assessments":
        return <Assessments />;
      case "certifications":
        return <Certifications />;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Hub</CardTitle>
          <CardDescription>Enhance your product management skills</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeSubPage} onValueChange={setActiveSubPage}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="assessments">Assessments</TabsTrigger>
              <TabsTrigger value="certifications">Certifications</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dynamic Content */}
      {renderContent()}
    </div>
  );
};

export default Learning;
