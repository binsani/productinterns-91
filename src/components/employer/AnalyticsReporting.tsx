
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  FileText,
  UserCheck,
  Download,
  Calendar
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const AnalyticsReporting = () => {
  const monthlyData = [
    { month: 'Jan', applications: 45, views: 680, hires: 3 },
    { month: 'Feb', applications: 52, views: 720, hires: 4 },
    { month: 'Mar', applications: 48, views: 650, hires: 2 },
    { month: 'Apr', applications: 61, views: 890, hires: 5 },
    { month: 'May', applications: 55, views: 780, hires: 4 },
  ];

  const jobPerformanceData = [
    { name: 'Product Management Intern', applications: 23, conversion: 8.5 },
    { name: 'Junior PM Intern', applications: 18, conversion: 12.2 },
    { name: 'Associate PM Intern', applications: 15, conversion: 6.7 },
    { name: 'PM Summer Intern', applications: 31, conversion: 9.8 },
  ];

  const sourceData = [
    { name: 'Job Boards', value: 45, color: '#8884d8' },
    { name: 'Company Website', value: 30, color: '#82ca9d' },
    { name: 'Referrals', value: 15, color: '#ffc658' },
    { name: 'Social Media', value: 10, color: '#ff7300' },
  ];

  const stats = [
    {
      title: "Total Applications",
      value: "281",
      change: "+12.5%",
      trend: "up",
      period: "vs last month",
      icon: FileText
    },
    {
      title: "Job Views",
      value: "3,720",
      change: "+8.2%",
      trend: "up",
      period: "vs last month",
      icon: Eye
    },
    {
      title: "Conversion Rate",
      value: "9.2%",
      change: "-2.1%",
      trend: "down",
      period: "vs last month",
      icon: TrendingUp
    },
    {
      title: "Successful Hires",
      value: "18",
      change: "+22.2%",
      trend: "up",
      period: "vs last month",
      icon: UserCheck
    }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
                )}
                <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>
                  {stat.change}
                </span>
                <span className="ml-1">{stat.period}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Application Trends</CardTitle>
            <CardDescription>Monthly application and hiring trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="applications" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="hires" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Application Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Application Sources</CardTitle>
            <CardDescription>Where candidates are finding your jobs</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Job Performance */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Job Performance</CardTitle>
            <CardDescription>Applications and conversion rates by job posting</CardDescription>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={jobPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="applications" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
          <CardDescription>Key insights from your hiring data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Best Performing Job</h3>
                <p className="text-sm text-gray-600">Junior PM Intern with 12.2% conversion rate</p>
              </div>
              <Badge className="bg-green-100 text-green-800">Top Performer</Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Most Applications</h3>
                <p className="text-sm text-gray-600">PM Summer Intern with 31 applications this month</p>
              </div>
              <Badge className="bg-blue-100 text-blue-800">High Volume</Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Needs Attention</h3>
                <p className="text-sm text-gray-600">Associate PM Intern has low conversion rate</p>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">Action Required</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsReporting;
