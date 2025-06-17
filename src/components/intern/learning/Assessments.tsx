
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, Award, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Assessment {
  id: string;
  title: string;
  description: string;
  duration: string;
  questions: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  status: "not_started" | "in_progress" | "completed";
  score?: number;
  category: string;
}

const Assessments = () => {
  const { toast } = useToast();
  const [assessments, setAssessments] = useState<Assessment[]>([
    {
      id: "1",
      title: "Product Strategy Fundamentals",
      description: "Test your understanding of product strategy concepts",
      duration: "30 min",
      questions: 25,
      difficulty: "Beginner",
      status: "completed",
      score: 85,
      category: "Product Strategy"
    },
    {
      id: "2", 
      title: "Data Analysis for PMs",
      description: "Assess your data analysis and interpretation skills",
      duration: "45 min",
      questions: 30,
      difficulty: "Intermediate",
      status: "in_progress",
      category: "Analytics"
    },
    {
      id: "3",
      title: "User Research Methods",
      description: "Evaluate your knowledge of user research techniques",
      duration: "35 min",
      questions: 20,
      difficulty: "Beginner",
      status: "not_started",
      category: "User Research"
    },
    {
      id: "4",
      title: "Advanced Product Metrics",
      description: "Deep dive into complex product metrics and KPIs",
      duration: "60 min",
      questions: 40,
      difficulty: "Advanced",
      status: "not_started",
      category: "Analytics"
    }
  ]);

  const handleStartAssessment = (assessmentId: string) => {
    toast({
      title: "Assessment Started",
      description: "Good luck! Remember to read each question carefully.",
    });
    
    setAssessments(prev => 
      prev.map(assessment => 
        assessment.id === assessmentId 
          ? { ...assessment, status: "in_progress" as const }
          : assessment
      )
    );
  };

  const handleResumeAssessment = (assessmentId: string) => {
    toast({
      title: "Resuming Assessment",
      description: "Continuing where you left off.",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "in_progress": return <Clock className="h-5 w-5 text-yellow-600" />;
      default: return <Play className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in_progress": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-blue-100 text-blue-800";
      case "Intermediate": return "bg-orange-100 text-orange-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const completedAssessments = assessments.filter(a => a.status === "completed");
  const averageScore = completedAssessments.length > 0 
    ? Math.round(completedAssessments.reduce((acc, a) => acc + (a.score || 0), 0) / completedAssessments.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{assessments.length}</div>
            <div className="text-sm text-gray-600">Total Assessments</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{completedAssessments.length}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {assessments.filter(a => a.status === "in_progress").length}
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{averageScore}%</div>
            <div className="text-sm text-gray-600">Average Score</div>
          </CardContent>
        </Card>
      </div>

      {/* Assessments List */}
      <Card>
        <CardHeader>
          <CardTitle>Skill Assessments</CardTitle>
          <CardDescription>Test and validate your PM knowledge</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assessments.map((assessment) => (
              <div key={assessment.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      {getStatusIcon(assessment.status)}
                      <h3 className="font-semibold">{assessment.title}</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{assessment.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{assessment.duration}</span>
                      <span>•</span>
                      <span>{assessment.questions} questions</span>
                      <span>•</span>
                      <span>{assessment.category}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={getStatusColor(assessment.status)}>
                      {assessment.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <Badge className={getDifficultyColor(assessment.difficulty)}>
                      {assessment.difficulty}
                    </Badge>
                  </div>
                </div>

                {assessment.status === "completed" && assessment.score && (
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Score</span>
                      <span>{assessment.score}%</span>
                    </div>
                    <Progress value={assessment.score} className="h-2" />
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    {assessment.status === "completed" && (
                      <Badge variant="outline" className="bg-green-50">
                        <Award className="h-3 w-3 mr-1" />
                        Certified
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    {assessment.status === "not_started" && (
                      <Button 
                        onClick={() => handleStartAssessment(assessment.id)}
                        size="sm"
                      >
                        Start Assessment
                      </Button>
                    )}
                    {assessment.status === "in_progress" && (
                      <Button 
                        onClick={() => handleResumeAssessment(assessment.id)}
                        size="sm"
                      >
                        Resume
                      </Button>
                    )}
                    {assessment.status === "completed" && (
                      <Button 
                        onClick={() => handleStartAssessment(assessment.id)}
                        variant="outline"
                        size="sm"
                      >
                        Retake
                      </Button>
                    )}
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

export default Assessments;
