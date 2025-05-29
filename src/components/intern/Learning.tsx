
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Play, Clock, Award, Star } from "lucide-react";

const Learning = () => {
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

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Progress</CardTitle>
          <CardDescription>Track your product management education journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          </div>
        </CardContent>
      </Card>

      {/* Course Library */}
      <Card>
        <CardHeader>
          <CardTitle>Course Library</CardTitle>
          <CardDescription>Continue your learning journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {courses.map((course) => (
              <div key={course.id} className="border rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold">{course.title}</h3>
                      <Badge variant="outline">{course.level}</Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{course.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {course.duration}
                      </span>
                      <span className="flex items-center">
                        <Star className="h-4 w-4 mr-1 text-yellow-500" />
                        {course.rating}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {course.topics.map((topic) => (
                        <Badge key={topic} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress: {course.progress}%</span>
                    <span>{course.progress > 0 ? "Continue" : "Start"} Learning</span>
                  </div>
                  <Progress value={course.progress} className="w-full" />
                  <Button className="w-full" variant={course.progress > 0 ? "default" : "outline"}>
                    <Play className="h-4 w-4 mr-2" />
                    {course.progress > 0 ? "Continue Course" : "Start Course"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
          <CardDescription>Your learning milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={index}
                  className={`p-4 border rounded-lg text-center ${
                    achievement.earned ? "bg-green-50 border-green-200" : "bg-gray-50"
                  }`}
                >
                  <Icon
                    className={`h-8 w-8 mx-auto mb-2 ${
                      achievement.earned ? "text-green-600" : "text-gray-400"
                    }`}
                  />
                  <h4 className="font-medium mb-1">{achievement.title}</h4>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                  {achievement.earned && (
                    <Badge className="mt-2 bg-green-100 text-green-800">Earned</Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Learning;
