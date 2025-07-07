
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Building2, 
  FileText,
  Calendar,
  Download,
  Filter
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("30d");
  const [metric, setMetric] = useState("users");

  // Sample data
  const userGrowthData = [
    { month: 'Jan', interns: 120, employers: 15 },
    { month: 'Feb', interns: 180, employers: 22 },
    { month: 'Mar', interns: 250, employers: 28 },
    { month: 'Apr', interns: 320, employers: 35 },
    { month: 'May', interns: 410, employers: 42 },
    { month: 'Jun', interns: 520, employers: 48 }
  ];

  const applicationData = [
    { day: 'Mon', applications: 45 },
    { day: 'Tue', applications: 52 },
    { day: 'Wed', applications: 38 },
    { day: 'Thu', applications: 67 },
    { day: 'Fri', applications: 58 },
    { day: 'Sat', applications: 23 },
    { day: 'Sun', applications: 18 }
  ];

  const industryData = [
    { name: 'Technology', value: 35, color: '#3B82F6' },
    { name: 'Healthcare', value: 20, color: '#10B981' },
    { name: 'Finance', value: 18, color: '#F59E0B' },
    { name: 'Education', value: 15, color: '#EF4444' },
    { name: 'Other', value: 12, color: '#8B5CF6' }
  ];

  const generateReport = () => {
    console.log(`Generating ${metric} report for ${timeRange}`);
    
    // Create sample CSV data based on selected metric
    let csvContent = "";
    let fileName = "";
    
    if (metric === "users") {
      csvContent = "data:text/csv;charset=utf-8,Month,Interns,Employers\n";
      userGrowthData.forEach(row => {
        csvContent += `${row.month},${row.interns},${row.employers}\n`;
      });
      fileName = `users-report-${timeRange}.csv`;
    } else if (metric === "applications") {
      csvContent = "data:text/csv;charset=utf-8,Day,Applications\n";
      applicationData.forEach(row => {
        csvContent += `${row.day},${row.applications}\n`;
      });
      fileName = `applications-report-${timeRange}.csv`;
    } else {
      csvContent = "data:text/csv;charset=utf-8,Metric,Value\n";
      csvContent += "Total Users,2847\n";
      csvContent += "Active Employers,156\n";
      csvContent += "Applications,1234\n";
      csvContent += "Success Rate,73%\n";
      fileName = `${metric}-report-${timeRange}.csv`;
    }

    // Create and trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-gray-600">Monitor platform performance and user engagement</p>
        </div>
        <div className="flex space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={metric} onValueChange={setMetric}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="users">User Metrics</SelectItem>
              <SelectItem value="applications">Applications</SelectItem>
              <SelectItem value="revenue">Revenue</SelectItem>
              <SelectItem value="engagement">Engagement</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={generateReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Employers</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8</span> new this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+23%</span> this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">73%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Monthly registration trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="interns" fill="#3B82F6" name="Interns" />
                <Bar dataKey="employers" fill="#10B981" name="Employers" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Applications Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Applications</CardTitle>
            <CardDescription>Daily application submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={applicationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="applications" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Industry Distribution and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Industry Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Industry Distribution</CardTitle>
            <CardDescription>Employer breakdown by industry</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={industryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {industryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Performing Content */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Activity</CardTitle>
            <CardDescription>Recent platform metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Most Popular Internship</p>
                  <p className="text-sm text-gray-600">Product Management Intern at TechCorp</p>
                </div>
                <Badge>47 applications</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Top Employer</p>
                  <p className="text-sm text-gray-600">Innovation Labs</p>
                </div>
                <Badge variant="secondary">12 internships</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Peak Application Time</p>
                  <p className="text-sm text-gray-600">Tuesday 2:00 PM - 4:00 PM</p>
                </div>
                <Badge variant="outline">67 avg</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Average Response Time</p>
                  <p className="text-sm text-gray-600">Employer to candidate</p>
                </div>
                <Badge variant="outline">2.3 days</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Metrics</CardTitle>
          <CardDescription>Comprehensive platform statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-gray-700">USER ENGAGEMENT</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Daily Active Users</span>
                  <span className="text-sm font-medium">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Session Duration</span>
                  <span className="text-sm font-medium">12m 34s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Pages per Session</span>
                  <span className="text-sm font-medium">4.2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Bounce Rate</span>
                  <span className="text-sm font-medium">34%</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-gray-700">CONVERSION METRICS</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Application Rate</span>
                  <span className="text-sm font-medium">23%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Interview Rate</span>
                  <span className="text-sm font-medium">12%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Hiring Rate</span>
                  <span className="text-sm font-medium">7%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Employer Retention</span>
                  <span className="text-sm font-medium">89%</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-gray-700">TECHNICAL METRICS</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Page Load Time</span>
                  <span className="text-sm font-medium">1.2s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Uptime</span>
                  <span className="text-sm font-medium">99.9%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Error Rate</span>
                  <span className="text-sm font-medium">0.03%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">API Response Time</span>
                  <span className="text-sm font-medium">120ms</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
