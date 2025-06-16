
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle, FileText } from "lucide-react";

interface CaseStudyModalProps {
  assessment: any;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (assessmentId: string, score: number) => void;
}

const CaseStudyModal = ({ assessment, isOpen, onClose, onComplete }: CaseStudyModalProps) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [responses, setResponses] = useState<{ [key: string]: string }>({});
  const [showResults, setShowResults] = useState(false);

  const caseStudy = {
    title: "Music Streaming App Growth Strategy",
    background: `You are the PM for a music streaming app called "TuneFlow" that has 500K monthly active users. 
    The app offers both free (ad-supported) and premium subscriptions. Current metrics:
    - 500K MAU (Monthly Active Users)
    - 15% premium conversion rate
    - 60% monthly retention rate
    - Average session length: 25 minutes
    
    The company wants to double its user base in the next 12 months while improving key metrics.`,
    
    sections: [
      {
        title: "Market Analysis",
        questions: [
          "What are the key market trends in music streaming that TuneFlow should consider?",
          "Who are the main competitors and what are their strengths/weaknesses?",
          "What market opportunities do you see for growth?"
        ]
      },
      {
        title: "User Research",
        questions: [
          "What user research methods would you use to understand why users churn?",
          "How would you segment TuneFlow's user base for targeted growth strategies?",
          "What metrics would you track to measure user engagement and satisfaction?"
        ]
      },
      {
        title: "Product Strategy",
        questions: [
          "What product features would you prioritize to improve retention?",
          "How would you improve the free-to-premium conversion rate?",
          "Design a user acquisition strategy for the next 6 months."
        ]
      }
    ]
  };

  const handleResponseChange = (sectionIndex: number, questionIndex: number, value: string) => {
    const key = `${sectionIndex}-${questionIndex}`;
    setResponses(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleNext = () => {
    if (currentSection < caseStudy.sections.length - 1) {
      setCurrentSection(prev => prev + 1);
    } else {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    }
  };

  const calculateResults = () => {
    // Simple scoring based on response completeness and length
    const totalQuestions = caseStudy.sections.reduce((sum, section) => sum + section.questions.length, 0);
    const answeredQuestions = Object.values(responses).filter(response => response.trim().length > 50).length;
    const score = Math.round((answeredQuestions / totalQuestions) * 100);
    
    setShowResults(true);
    
    setTimeout(() => {
      onComplete(assessment.id, score);
    }, 3000);
  };

  const currentSectionData = caseStudy.sections[currentSection];
  const progress = ((currentSection + 1) / caseStudy.sections.length) * 100;
  const allQuestionsAnswered = currentSectionData.questions.every((_, index) => {
    const key = `${currentSection}-${index}`;
    return responses[key]?.trim().length > 0;
  });

  if (showResults) {
    const totalQuestions = caseStudy.sections.reduce((sum, section) => sum + section.questions.length, 0);
    const answeredQuestions = Object.values(responses).filter(response => response.trim().length > 50).length;
    const score = Math.round((answeredQuestions / totalQuestions) * 100);

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <CheckCircle className="h-6 w-6 mr-2 text-green-500" />
              Case Study Complete!
            </DialogTitle>
          </DialogHeader>
          
          <div className="text-center py-8">
            <div className="text-6xl font-bold text-blue-600 mb-4">{score}%</div>
            <p className="text-lg text-gray-600 mb-6">
              You provided comprehensive answers to {answeredQuestions} out of {totalQuestions} questions
            </p>
            
            <div className="space-y-4">
              {score >= 80 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">🎉 Outstanding strategic thinking! Certificate earned!</p>
                </div>
              )}
              
              <p className="text-sm text-gray-600">
                Your responses demonstrate {score >= 80 ? "excellent" : score >= 60 ? "good" : "developing"} 
                product management skills in strategic analysis and problem-solving.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            {assessment.title}
          </DialogTitle>
          <DialogDescription>
            Section {currentSection + 1} of {caseStudy.sections.length}: {currentSectionData.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress */}
          <div className="flex items-center justify-between">
            <div className="flex-1 mr-4">
              <Progress value={progress} className="h-2" />
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-1" />
              {assessment.duration}
            </div>
          </div>

          {/* Background (only show on first section) */}
          {currentSection === 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Case Study Background</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-700 whitespace-pre-line">{caseStudy.background}</p>
              </CardContent>
            </Card>
          )}

          {/* Current Section Questions */}
          <Card>
            <CardHeader>
              <CardTitle>{currentSectionData.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentSectionData.questions.map((question, index) => {
                const key = `${currentSection}-${index}`;
                return (
                  <div key={index}>
                    <label className="text-sm font-medium mb-2 block">
                      {index + 1}. {question}
                    </label>
                    <Textarea
                      value={responses[key] || ""}
                      onChange={(e) => handleResponseChange(currentSection, index, e.target.value)}
                      placeholder="Provide a detailed response..."
                      className="min-h-[100px]"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {responses[key]?.length || 0} characters
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentSection === 0}
            >
              Previous Section
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!allQuestionsAnswered}
            >
              {currentSection === caseStudy.sections.length - 1 ? "Submit Case Study" : "Next Section"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CaseStudyModal;
