
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, Trophy, Clock, Play, CheckCircle, Award, BookOpen, Brain } from "lucide-react";
import AssessmentModal from "@/components/intern/AssessmentModal";
import CaseStudyModal from "@/components/intern/CaseStudyModal";
import CertificateModal from "@/components/intern/CertificateModal";

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
  type: "quiz" | "case-study";
}

const SkillAssessment = () => {
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [showCertificate, setShowCertificate] = useState<string | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([
    {
      id: "1",
      title: "Product Strategy Fundamentals",
      description: "Test your understanding of core product strategy concepts, market analysis, and competitive positioning",
      difficulty: "Beginner",
      duration: "30 mins",
      questions: 25,
      category: "Strategy",
      completed: true,
      score: 85,
      lastAttempt: "2024-01-20",
      type: "quiz"
    },
    {
      id: "2",
      title: "User Research & Analytics",
      description: "Evaluate your skills in user research methodologies, data analysis, and metrics interpretation",
      difficulty: "Intermediate",
      duration: "45 mins",
      questions: 35,
      category: "Research",
      completed: true,
      score: 92,
      lastAttempt: "2024-01-18",
      type: "quiz"
    },
    {
      id: "3",
      title: "Agile Product Management",
      description: "Advanced concepts in agile methodology, sprint planning, and cross-functional team leadership",
      difficulty: "Advanced",
      duration: "60 mins",
      questions: 40,
      category: "Methodology",
      completed: false,
      type: "quiz"
    },
    {
      id: "4",
      title: "Market Analysis Case Study",
      description: "Analyze a real market scenario and develop a comprehensive product strategy",
      difficulty: "Intermediate",
      duration: "90 mins",
      questions: 1,
      category: "Analysis",
      completed: true,
      score: 88,
      lastAttempt: "2024-01-15",
      type: "case-study"
    },
    {
      id: "5",
      title: "Product Launch Strategy",
      description: "Design a go-to-market strategy for a new product in a competitive landscape",
      difficulty: "Advanced",
      duration: "120 mins",
      questions: 1,
      category: "Strategy",
      completed: false,
      type: "case-study"
    },
    {
      id: "6",
      title: "Data-Driven Decision Making",
      description: "Use analytics and user feedback to make product decisions and prioritize features",
      difficulty: "Intermediate",
      duration: "75 mins",
      questions: 1,
      category: "Analytics",
      completed: true,
      score: 95,
      lastAttempt: "2024-01-22",
      type: "case-study"
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

  const certificates = completedAssessments.filter(a => (a.score || 0) >= 80);

  const handleAssessmentComplete = (assessmentId: string, score: number) => {
    setAssessments(prev => prev.map(a => 
      a.id === assessmentId 
        ? { ...a, completed: true, score, lastAttempt: new Date().toISOString().split('T')[0] }
        : a
    ));
    setSelectedAssessment(null);
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{certificates.length}</div>
            <div className="text-sm text-gray-600">Certificates</div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Skill Development Progress</CardTitle>
          <CardDescription>Track your learning journey across different PM competencies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {["Strategy", "Research", "Methodology", "Analysis", "Analytics"].map((skill) => {
              const skillAssessments = assessments.filter(a => a.category === skill);
              const completed = skillAssessments.filter(a => a.completed).length;
              const progress = skillAssessments.length > 0 ? (completed / skillAssessments.length) * 100 : 0;
              const avgScore = skillAssessments.filter(a => a.completed && a.score).length > 0
                ? Math.round(skillAssessments.filter(a => a.completed && a.score).reduce((sum, a) => sum + (a.score || 0), 0) / skillAssessments.filter(a => a.completed && a.score).length)
                : 0;
              
              return (
                <div key={skill}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{skill}</span>
                    <span>{completed}/{skillAssessments.length} completed {avgScore > 0 && `• Avg: ${avgScore}%`}</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Certificates */}
      {certificates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-purple-500" />
              Your Certificates
            </CardTitle>
            <CardDescription>Earned certificates for outstanding performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {certificates.map((cert) => (
                <Card key={cert.id} className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowCertificate(cert.id)}>
                  <CardContent className="p-4 text-center">
                    <Award className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <h4 className="font-medium text-sm">{cert.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">Score: {cert.score}%</p>
                    <Badge className="mt-2 bg-purple-100 text-purple-800 text-xs">Certified</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assessment List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2 text-blue-500" />
              Skill Assessments
            </CardTitle>
            <CardDescription>Interactive quizzes to test your PM knowledge</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assessments.filter(a => a.type === "quiz").map((assessment) => (
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
                        onClick={() => setSelectedAssessment(assessment)}
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-green-500" />
              Case Studies
            </CardTitle>
            <CardDescription>Real-world scenarios to test your PM skills</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assessments.filter(a => a.type === "case-study").map((assessment) => (
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
                        <span>{assessment.duration} • Case study</span>
                      </div>
                      
                      {assessment.completed && assessment.score && (
                        <div className="flex items-center justify-between">
                          <span>Score:</span>
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
                        onClick={() => setSelectedAssessment(assessment)}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        {assessment.completed ? "Review Case Study" : "Start Case Study"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      {selectedAssessment && selectedAssessment.type === "quiz" && (
        <AssessmentModal
          assessment={selectedAssessment}
          isOpen={!!selectedAssessment}
          onClose={() => setSelectedAssessment(null)}
          onComplete={handleAssessmentComplete}
        />
      )}

      {selectedAssessment && selectedAssessment.type === "case-study" && (
        <CaseStudyModal
          assessment={selectedAssessment}
          isOpen={!!selectedAssessment}
          onClose={() => setSelectedAssessment(null)}
          onComplete={handleAssessmentComplete}
        />
      )}

      {showCertificate && (
        <CertificateModal
          assessment={assessments.find(a => a.id === showCertificate)!}
          isOpen={!!showCertificate}
          onClose={() => setShowCertificate(null)}
        />
      )}
    </div>
  );
};

export default SkillAssessment;
