
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, MessageSquare } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface MessageModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSend: (message: { to: string; subject: string; body: string }) => void;
}

const MessageModal = ({ user, isOpen, onClose, onSend }: MessageModalProps) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!user || !subject.trim() || !message.trim()) return;

    setIsSending(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onSend({
        to: user.email,
        subject,
        body: message
      });
      setSubject("");
      setMessage("");
      console.log("Message sent to:", user.email);
      alert("Message sent successfully!");
      onClose();
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Send Message</span>
          </DialogTitle>
          <DialogDescription>
            Send a direct message to this user
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Recipient Info */}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-gray-600">{user.email}</div>
            </div>
          </div>

          {/* Message Form */}
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Enter message subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSend}
            disabled={!subject.trim() || !message.trim() || isSending}
            className="flex items-center space-x-2"
          >
            <Send className="h-4 w-4" />
            <span>{isSending ? "Sending..." : "Send Message"}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessageModal;
