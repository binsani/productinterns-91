
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Download, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddToCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: {
    title: string;
    company: string;
    date: string;
    time: string;
    type: string;
    location?: string;
  };
}

const AddToCalendarModal = ({ isOpen, onClose, event }: AddToCalendarModalProps) => {
  const { toast } = useToast();

  const generateCalendarUrl = (provider: string) => {
    if (!event) return '';
    
    const startDate = new Date(`${event.date} ${event.time}`);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour later
    
    const details = `${event.type} interview for ${event.title} at ${event.company}`;
    
    switch (provider) {
      case 'google':
        const googleDate = startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        const googleEndDate = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${googleDate}/${googleEndDate}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(event.location || '')}`;
      
      case 'outlook':
        return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(event.title)}&startdt=${startDate.toISOString()}&enddt=${endDate.toISOString()}&body=${encodeURIComponent(details)}&location=${encodeURIComponent(event.location || '')}`;
      
      default:
        return '';
    }
  };

  const downloadICS = () => {
    if (!event) return;
    
    const startDate = new Date(`${event.date} ${event.time}`);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
    
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Intern Dashboard//Interview//EN
BEGIN:VEVENT
UID:${Date.now()}@interndashboard.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:${event.title}
DESCRIPTION:${event.type} interview for ${event.title} at ${event.company}
LOCATION:${event.location || ''}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.title.replace(/\s+/g, '_')}_interview.ics`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Calendar Event Downloaded",
      description: "ICS file has been downloaded to your device.",
    });
  };

  const handleAddToCalendar = (provider: string) => {
    const url = generateCalendarUrl(provider);
    if (url) {
      window.open(url, '_blank');
      toast({
        title: "Calendar Opened",
        description: `Opening ${provider} calendar to add event.`,
      });
    }
    onClose();
  };

  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Calendar</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold">{event.title}</h3>
            <p className="text-sm text-gray-600">{event.company}</p>
            <p className="text-sm text-gray-500">{event.date} at {event.time}</p>
          </div>
          
          <div className="space-y-2">
            <Button 
              onClick={() => handleAddToCalendar('google')} 
              variant="outline" 
              className="w-full justify-start"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Google Calendar
            </Button>
            
            <Button 
              onClick={() => handleAddToCalendar('outlook')} 
              variant="outline" 
              className="w-full justify-start"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Outlook Calendar
            </Button>
            
            <Button 
              onClick={downloadICS} 
              variant="outline" 
              className="w-full justify-start"
            >
              <Download className="h-4 w-4 mr-2" />
              Download ICS File
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddToCalendarModal;
