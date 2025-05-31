
import StatsCard from "@/components/shared/StatsCard";
import { FileText, Calendar, Award, Bookmark } from "lucide-react";

const StatsCards = () => {
  const stats = [
    {
      title: "Applications",
      value: "12",
      change: "+2 this week",
      icon: FileText
    },
    {
      title: "Interviews", 
      value: "3",
      change: "2 upcoming",
      icon: Calendar
    },
    {
      title: "PM Skill Score",
      value: "85%", 
      change: "+5% from last test",
      icon: Award
    },
    {
      title: "Saved PM Internships",
      value: "8",
      change: "3 new matches", 
      icon: Bookmark
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <StatsCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          icon={stat.icon}
        />
      ))}
    </div>
  );
};

export default StatsCards;
