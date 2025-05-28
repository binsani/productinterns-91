
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      title: "Skill Score",
      value: "85%", 
      change: "+5% from last test",
      icon: Award
    },
    {
      title: "Saved Jobs",
      value: "8",
      change: "3 new matches", 
      icon: Bookmark
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCards;
