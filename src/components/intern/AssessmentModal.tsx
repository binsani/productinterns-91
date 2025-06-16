
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Clock, CheckCircle } from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface AssessmentModalProps {
  assessment: any;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (assessmentId: string, score: number) => void;
}

const AssessmentModal = ({ assessment, isOpen, onClose, onComplete }: AssessmentModalProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds

  const questions: Question[] = [
    {
      id: 1,
      question: "What is the primary goal of product strategy?",
      options: [
        "To increase revenue",
        "To define the product vision and roadmap",
        "To manage development teams",
        "To conduct user research"
      ],
      correctAnswer: 1,
      explanation: "Product strategy defines the product vision, target market, and roadmap to achieve business objectives."
    },
    {
      id: 2,
      question: "Which framework is commonly used for prioritizing features?",
      options: [
        "RICE (Reach, Impact, Confidence, Effort)",
        "SWOT Analysis", 
        "5 Forces Analysis",
        "BCG Matrix"
      ],
      correctAnswer: 0,
      explanation: "RICE framework helps product managers prioritize features based on Reach, Impact, Confidence, and Effort."
    },
    {
      id: 3,
      question: "What does MVP stand for in product management?",
      options: [
        "Most Valuable Player",
        "Minimum Viable Product",
        "Maximum Value Proposition",
        "Multi-Version Platform"
      ],
      correctAnswer: 1,
      explanation: "MVP (Minimum Viable Product) is a version of a product with just enough features to satisfy early customers."
    }
  ];

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateResults = () => {
    const correctAnswers = questions.filter(q => 
      answers[q.id] === q.correctAnswer
    ).length;
    
    const score = Math.round((correctAnswers / questions.length) * 100);
    setShowResults(true);
    
    setTimeout(() => {
      onComplete(assessment.id, score);
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showResults) {
    const correctAnswers = questions.filter(q => 
      answers[q.id] === q.correctAnswer
    ).length;
    const score = Math.round((correctAnswers / questions.length) * 100);

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <CheckCircle className="h-6 w-6 mr-2 text-green-500" />
              Assessment Complete!
            </DialogTitle>
          </DialogHeader>
          
          <div className="text-center py-8">
            <div className="text-6xl font-bold text-blue-600 mb-4">{score}%</div>
            <p className="text-lg text-gray-600 mb-6">
              You got {correctAnswers} out of {questions.length} questions correct
            </p>
            
            <div className="space-y-4">
              {score >= 80 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">🎉 Congratulations! You've earned a certificate!</p>
                </div>
              )}
              
              {score >= 70 ? (
                <p className="text-green-600">Excellent work! You have a strong understanding of this topic.</p>
              ) : score >= 60 ? (
                <p className="text-yellow-600">Good job! Consider reviewing the material and retaking the assessment.</p>
              ) : (
                <p className="text-red-600">Keep studying! Review the material and try again when you're ready.</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{assessment.title}</DialogTitle>
          <DialogDescription>
            Question {currentQuestion + 1} of {questions.length}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress and Timer */}
          <div className="flex items-center justify-between">
            <div className="flex-1 mr-4">
              <Progress value={progress} className="h-2" />
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-1" />
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* Question */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">{question.question}</h3>
              
              <RadioGroup
                value={answers[question.id]?.toString()}
                onValueChange={(value) => handleAnswerSelect(question.id, parseInt(value))}
              >
                {question.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={answers[question.id] === undefined}
            >
              {currentQuestion === questions.length - 1 ? "Complete Assessment" : "Next"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssessmentModal;
