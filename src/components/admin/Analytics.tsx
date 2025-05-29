
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Building2, 
  FileText, 
  DollarSign,
  Eye,
  Clock,
  Download,
  Calendar
} from "lucide-react";

const Analytics = () => {
  const metrics = [
    { title: "Total Users", value: "2,847", change: "+12%", trend: "up", icon: Users },
    { title: "Active Employers", value: "156", change: "+8%", trend: "up", icon: Building2 },
    { title: "Job Applications", value: "1,234", change: "+23%", trend: "up", icon: FileText },
    { title: "Monthly Revenue", value: "$45,231", change: "+18%", trend: "up", icon: DollarSign },
    { title: "Page Views", value: "89,432", change: "-3%", trend: "down", icon: Eye },
    { title: "Avg. Session Time", value: "12m 34s", change: "+5%", trend: "up", icon: Clock },
  ];

  const topPages = [
    { page: "/jobs", views: "23,456", percentage: "32%" },
    { page: "/dashboard", views: "18,293", percentage: "25%" },
    { page: "/profile", views: "12,847", percentage: "18%" },
    { page: "/applications", views: "9,234", percentage: "13%" },
    { page: "/messages", views: "6,781", percentage: "9%" },
  ];

  const userActivity = [
    { time: "9:00 AM", interns: 234, employers: 45 },
    { time: "12:00 PM", interns: 567, employers: 89 },
    { time: "3:00 PM", interns: 432, employers: 67 },
    { time: "6:00 PM", interns: 198, employers: 34 },
    { time: "9:00 PM", interns: 89, employers: 12 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-gray-600">Monitor platform performance and user insights</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Last 30 days</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center space-x-1">
                  {metric.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <p className={`text-xs ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                    {metric.change} from last month
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts and Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
            <CardDescription>Most visited pages this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{page.page}</p>
                    <p className="text-sm text-gray-600">{page.views} views</p>
                  </div>
                  <Badge variant="secondary">{page.percentage}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Daily User Activity</CardTitle>
            <CardDescription>Active users throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{activity.time}</span>
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">{activity.interns} interns</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">{activity.employers} employers</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Summary</CardTitle>
          <CardDescription>Key insights and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Top Performing Features</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Job Search</span>
                  <span className="text-green-600">+15% engagement</span>
                </li>
                <li className="flex justify-between">
                  <span>Application Tracking</span>
                  <span className="text-green-600">+12% usage</span>
                </li>
                <li className="flex justify-between">
                  <span>Messaging System</span>
                  <span className="text-green-600">+8% activity</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Areas for Improvement</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Mobile Experience</span>
                  <span className="text-orange-600">Needs attention</span>
                </li>
                <li className="flex justify-between">
                  <span>Load Times</span>
                  <span className="text-orange-600">3.2s avg</span>
                </li>
                <li className="flex justify-between">
                  <span>User Onboarding</span>
                  <span className="text-red-600">65% completion</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
