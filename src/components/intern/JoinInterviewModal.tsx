
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Video, Mic, MicOff, VideoOff, Phone, Settings, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JoinInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  interview?: {
    company: string;
    position: string;
    date: string;
    time: string;
    type: string;
    meetingLink?: string;
    interviewers: string[];
  };
}

const JoinInterviewModal = ({ isOpen, onClose, interview }: JoinInterviewModalProps) => {
  const { toast } = useToast();
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  const handleJoinInterview = () => {
    if (interview?.meetingLink) {
      window.open(interview.meetingLink, '_blank');
    }
    toast({
      title: "Joining Interview",
      description: "Opening interview meeting in new tab.",
    });
    onClose();
  };

  const handleTestAudio = () => {
    toast({
      title: "Audio Test",
      description: "Testing your microphone...",
    });
  };

  const handleTestVideo = () => {
    toast({
      title: "Video Test", 
      description: "Testing your camera...",
    });
  };

  if (!interview) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Join Interview</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Interview Details */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold">{interview.position}</h3>
                <p className="text-gray-600">{interview.company}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{interview.date} at {interview.time}</span>
                  <Badge variant="outline">{interview.type}</Badge>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">Interviewers: {interview.interviewers.join(", ")}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Audio/Video Controls */}
          <div className="space-y-4">
            <h4 className="font-medium">Check Your Setup</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Microphone</span>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setMicEnabled(!micEnabled)}
                  >
                    {micEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>
                </div>
                <Button size="sm" variant="ghost" onClick={handleTestAudio} className="w-full">
                  Test Audio
                </Button>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Camera</span>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setVideoEnabled(!videoEnabled)}
                  >
                    {videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </Button>
                </div>
                <Button size="sm" variant="ghost" onClick={handleTestVideo} className="w-full">
                  Test Video
                </Button>
              </div>
            </div>
          </div>

          {/* Pre-interview Tips */}
          <div className="space-y-2">
            <h4 className="font-medium">Quick Tips</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Find a quiet, well-lit space</li>
              <li>• Have your resume and portfolio ready</li>
              <li>• Test your internet connection</li>
              <li>• Join 2-3 minutes early</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <Button onClick={handleJoinInterview} className="flex-1">
              <Video className="h-4 w-4 mr-2" />
              Join Interview
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinInterviewModal;
