
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, SkipForward, BookOpen, Clock } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  type: "video" | "reading" | "quiz";
}

interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
  lessons: Lesson[];
}

const CourseLearning = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const courses: Course[] = [
    {
      id: "1",
      title: "Product Management Fundamentals",
      description: "Learn the basics of product management",
      progress: 75,
      lessons: [
        { id: "1-1", title: "Introduction to Product Management", duration: "15 min", completed: true, type: "video" },
        { id: "1-2", title: "Understanding User Needs", duration: "20 min", completed: true, type: "video" },
        { id: "1-3", title: "Product Strategy Framework", duration: "25 min", completed: false, type: "video" },
        { id: "1-4", title: "Quiz: PM Fundamentals", duration: "10 min", completed: false, type: "quiz" },
      ]
    },
    {
      id: "2", 
      title: "Data-Driven Product Decisions",
      description: "Master analytics and metrics",
      progress: 30,
      lessons: [
        { id: "2-1", title: "Introduction to Product Analytics", duration: "18 min", completed: true, type: "video" },
        { id: "2-2", title: "Key Metrics and KPIs", duration: "22 min", completed: false, type: "reading" },
        { id: "2-3", title: "A/B Testing Fundamentals", duration: "30 min", completed: false, type: "video" },
      ]
    }
  ];

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setCurrentLesson(course.lessons[0]);
  };

  const handleLessonSelect = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const nextLesson = () => {
    if (!selectedCourse || !currentLesson) return;
    
    const currentIndex = selectedCourse.lessons.findIndex(l => l.id === currentLesson.id);
    if (currentIndex < selectedCourse.lessons.length - 1) {
      setCurrentLesson(selectedCourse.lessons[currentIndex + 1]);
      setIsPlaying(false);
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video": return <Play className="h-4 w-4" />;
      case "reading": return <BookOpen className="h-4 w-4" />;
      case "quiz": return <Clock className="h-4 w-4" />;
      default: return <Play className="h-4 w-4" />;
    }
  };

  if (!selectedCourse) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Course Learning</CardTitle>
            <CardDescription>Select a course to begin learning</CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <Progress value={course.progress} />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{course.lessons.length} lessons</span>
                  <Button onClick={() => handleCourseSelect(course)}>
                    {course.progress > 0 ? "Continue" : "Start"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Course Content */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{selectedCourse.title}</CardTitle>
                <CardDescription>{currentLesson?.title}</CardDescription>
              </div>
              <Button variant="outline" onClick={() => setSelectedCourse(null)}>
                Back to Courses
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Video/Content Player */}
        <Card>
          <CardContent className="p-0">
            <div className="aspect-video bg-gray-900 rounded-t-lg flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-6xl mb-4">
                  {currentLesson?.type === "video" ? "📺" : currentLesson?.type === "reading" ? "📖" : "❓"}
                </div>
                <h3 className="text-xl font-semibold mb-2">{currentLesson?.title}</h3>
                <p className="text-gray-300">Duration: {currentLesson?.duration}</p>
              </div>
            </div>
            
            <div className="p-4 border-t">
              <div className="flex items-center justify-center space-x-4">
                <Button onClick={togglePlayPause} size="lg">
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                <Button onClick={nextLesson} variant="outline">
                  <SkipForward className="h-4 w-4 mr-2" />
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Sidebar */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Course Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{selectedCourse.progress}%</span>
              </div>
              <Progress value={selectedCourse.progress} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Lessons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {selectedCourse.lessons.map((lesson) => (
              <div
                key={lesson.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  currentLesson?.id === lesson.id ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"
                }`}
                onClick={() => handleLessonSelect(lesson)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-1 rounded ${lesson.completed ? "bg-green-100" : "bg-gray-100"}`}>
                    {getLessonIcon(lesson.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{lesson.title}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-600">{lesson.duration}</span>
                      {lesson.completed && (
                        <Badge variant="secondary" className="text-xs">Completed</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CourseLearning;
