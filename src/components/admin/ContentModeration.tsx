
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import ModerationHeader from "./content-moderation/ModerationHeader";
import ModerationFilters from "./content-moderation/ModerationFilters";
import ContentQueue from "./content-moderation/ContentQueue";
import ContentReview from "./content-moderation/ContentReview";

interface ModerationItem {
  id: string;
  type: 'internship' | 'profile' | 'message' | 'company';
  title: string;
  content: string;
  submittedBy: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  priority: 'low' | 'medium' | 'high';
  flags?: string[];
}

const ContentModeration = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [selectedItem, setSelectedItem] = useState<ModerationItem | null>(null);
  const [reviewNote, setReviewNote] = useState("");

  const [items, setItems] = useState<ModerationItem[]>([
    {
      id: "1",
      type: "internship",
      title: "Product Management Intern - Summer 2024",
      content: "Looking for a passionate PM intern to join our growing team. Must have strong analytical skills...",
      submittedBy: "TechCorp Solutions",
      submittedAt: "2024-01-15T10:30:00Z",
      status: "pending",
      priority: "medium",
      flags: ["salary_range_missing"]
    },
    {
      id: "2",
      type: "profile",
      title: "John Smith - Intern Profile",
      content: "Computer Science student at Stanford University. Passionate about product management...",
      submittedBy: "John Smith",
      submittedAt: "2024-01-15T09:15:00Z",
      status: "flagged",
      priority: "high",
      flags: ["inappropriate_content", "fake_experience"]
    },
    {
      id: "3",
      type: "company",
      title: "Innovation Labs Company Profile",
      content: "We are a cutting-edge technology company focused on AI and machine learning solutions...",
      submittedBy: "Innovation Labs",
      submittedAt: "2024-01-14T16:45:00Z",
      status: "pending",
      priority: "low"
    },
    {
      id: "4",
      type: "message",
      title: "Interview Follow-up Message",
      content: "Thank you for the interview opportunity. I wanted to follow up on the next steps...",
      submittedBy: "Sarah Johnson",
      submittedAt: "2024-01-14T14:20:00Z",
      status: "approved",
      priority: "low"
    }
  ]);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    const matchesType = filterType === "all" || item.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleApprove = (itemId: string) => {
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, status: 'approved' as const } : item
    ));
    toast({
      title: "Content Approved",
      description: "The content has been approved and published.",
    });
    setSelectedItem(null);
    setReviewNote("");
  };

  const handleReject = (itemId: string) => {
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, status: 'rejected' as const } : item
    ));
    toast({
      title: "Content Rejected",
      description: "The content has been rejected and will not be published.",
      variant: "destructive"
    });
    setSelectedItem(null);
    setReviewNote("");
  };

  const handleFlag = (itemId: string) => {
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, status: 'flagged' as const, priority: 'high' as const } : item
    ));
    toast({
      title: "Content Flagged",
      description: "The content has been flagged for further review.",
      variant: "destructive"
    });
  };

  const pendingCount = items.filter(item => item.status === 'pending').length;
  const flaggedCount = items.filter(item => item.status === 'flagged').length;

  return (
    <div className="space-y-6">
      <ModerationHeader 
        pendingCount={pendingCount} 
        flaggedCount={flaggedCount} 
      />

      <ModerationFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterType={filterType}
        setFilterType={setFilterType}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ContentQueue
          items={filteredItems}
          selectedItem={selectedItem}
          onSelectItem={setSelectedItem}
        />

        <ContentReview
          selectedItem={selectedItem}
          reviewNote={reviewNote}
          setReviewNote={setReviewNote}
          onApprove={handleApprove}
          onReject={handleReject}
          onFlag={handleFlag}
        />
      </div>
    </div>
  );
};

export default ContentModeration;
