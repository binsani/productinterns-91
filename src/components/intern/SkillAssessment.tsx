
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, Trophy, Clock, Play, CheckCircle } from "lucide-react";

interface Assessment {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  questions: number;
  category: string;
  completed: boolean;
  score?: number;
  lastAttempt?: string;
}

const SkillAssessment = () => {
  const [assessments] = useState<Assessment[]>([
    {
      id: "1",
      title: "Product Strategy Fundamentals",
      description: "Test your understanding of core product strategy concepts",
      difficulty: "Beginner",
      duration: "30 mins",
      questions: 25,
      category: "Strategy",
      completed: true,
      score: 85,
      lastAttempt: "2024-01-20"
    },
    {
      id: "2",
      title: "User Research & Analytics",
      description: "Evaluate your skills in user research methodologies and data analysis",
      difficulty: "Intermediate",
      duration: "45 mins",
      questions: 35,
      category: "Research",
      completed: true,
      score: 92,
      lastAttempt: "2024-01-18"
    },
    {
      id: "3",
      title: "Agile Product Management",
      description: "Advanced concepts in agile methodology and sprint planning",
      difficulty: "Advanced",
      duration: "60 mins",
      questions: 40,
      category: "Methodology",
      completed: false
    },
    {
      id: "4",
      title: "Market Analysis & Competitive Intelligence",
      description: "Learn to analyze market trends and competitive landscapes",
      difficulty: "Intermediate",
      duration: "40 mins",
      questions: 30,
      category: "Analysis",
      completed: false
    }
  ]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const completedAssessments = assessments.filter(a => a.completed);
  const averageScore = completedAssessments.length > 0 
    ? Math.round(completedAssessments.reduce((sum, a) => sum + (a.score || 0), 0) / completedAssessments.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{averageScore}%</div>
            <div className="text-sm text-gray-600">Average Score</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{completedAssessments.length}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{assessments.length - completedAssessments.length}</div>
            <div className="text-sm text-gray-600">Remaining</div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Skill Development Progress</CardTitle>
          <CardDescription>Track your learning journey across different PM skills</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {["Strategy", "Research", "Methodology", "Analysis"].map((skill) => {
              const skillAssessments = assessments.filter(a => a.category === skill);
              const completed = skillAssessments.filter(a => a.completed).length;
              const progress = (completed / skillAssessments.length) * 100;
              
              return (
                <div key={skill}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{skill}</span>
                    <span>{completed}/{skillAssessments.length} completed</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Assessment List */}
      <Card>
        <CardHeader>
          <CardTitle>Available Assessments</CardTitle>
          <CardDescription>Test and improve your product management skills</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assessments.map((assessment) => (
              <Card key={assessment.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{assessment.title}</CardTitle>
                    {assessment.completed && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Badge className={getDifficultyColor(assessment.difficulty)}>
                      {assessment.difficulty}
                    </Badge>
                    <Badge variant="outline">{assessment.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{assessment.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{assessment.duration} • {assessment.questions} questions</span>
                    </div>
                    
                    {assessment.completed && assessment.score && (
                      <div className="flex items-center justify-between">
                        <span>Last Score:</span>
                        <span className={`font-bold ${getScoreColor(assessment.score)}`}>
                          {assessment.score}%
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <Button 
                      className="w-full" 
                      variant={assessment.completed ? "outline" : "default"}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {assessment.completed ? "Retake Assessment" : "Start Assessment"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillAssessment;
