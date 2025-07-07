
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DollarSign, 
  Search, 
  Filter, 
  CreditCard,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

interface Subscription {
  id: string;
  companyName: string;
  companyAvatar: string;
  plan: 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  amount: number;
  billingCycle: 'monthly' | 'annual';
  startDate: string;
  endDate: string;
  lastPayment: string;
  nextPayment: string;
  paymentMethod: string;
  internshipCount: number;
  maxInternships: number;
}

const Subscriptions = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPlan, setFilterPlan] = useState("all");
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      id: "SUB-001",
      companyName: "TechCorp Solutions",
      companyAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TechCorp",
      plan: "premium",
      status: "active",
      amount: 99,
      billingCycle: "monthly",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      lastPayment: "2024-01-01",
      nextPayment: "2024-02-01",
      paymentMethod: "**** 4242",
      internshipCount: 8,
      maxInternships: 20
    },
    {
      id: "SUB-002",
      companyName: "Innovation Labs",
      companyAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Innovation",
      plan: "enterprise",
      status: "active",
      amount: 299,
      billingCycle: "monthly",
      startDate: "2023-06-15",
      endDate: "2024-06-15",
      lastPayment: "2024-01-15",
      nextPayment: "2024-02-15",
      paymentMethod: "**** 1234",
      internshipCount: 45,
      maxInternships: 100
    },
    {
      id: "SUB-003",
      companyName: "StartupX",
      companyAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=StartupX",
      plan: "basic",
      status: "trial",
      amount: 0,
      billingCycle: "monthly",
      startDate: "2024-01-10",
      endDate: "2024-01-24",
      lastPayment: "",
      nextPayment: "2024-01-24",
      paymentMethod: "",
      internshipCount: 2,
      maxInternships: 5
    },
    {
      id: "SUB-004",
      companyName: "Growth Corp",
      companyAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Growth",
      plan: "premium",
      status: "cancelled",
      amount: 99,
      billingCycle: "monthly",
      startDate: "2023-08-01",
      endDate: "2024-01-20",
      lastPayment: "2023-12-01",
      nextPayment: "",
      paymentMethod: "**** 5678",
      internshipCount: 5,
      maxInternships: 20
    }
  ]);

  // Sample revenue data
  const revenueData = [
    { month: 'Aug', revenue: 12500 },
    { month: 'Sep', revenue: 14200 },
    { month: 'Oct', revenue: 16800 },
    { month: 'Nov', revenue: 18900 },
    { month: 'Dec', revenue: 21200 },
    { month: 'Jan', revenue: 23400 }
  ];

  const subscriptionData = [
    { month: 'Aug', basic: 15, premium: 8, enterprise: 3 },
    { month: 'Sep', basic: 18, premium: 12, enterprise: 4 },
    { month: 'Oct', basic: 22, premium: 15, enterprise: 5 },
    { month: 'Nov', basic: 25, premium: 18, enterprise: 6 },
    { month: 'Dec', basic: 28, premium: 22, enterprise: 7 },
    { month: 'Jan', basic: 32, premium: 25, enterprise: 8 }
  ];

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || sub.status === filterStatus;
    const matchesPlan = filterPlan === "all" || sub.plan === filterPlan;
    
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const handleCancelSubscription = (subId: string) => {
    setSubscriptions(prev => prev.map(sub => 
      sub.id === subId ? { ...sub, status: 'cancelled' as const } : sub
    ));
    toast({
      title: "Subscription Cancelled",
      description: "The subscription has been cancelled successfully.",
    });
  };

  const handleReactivateSubscription = (subId: string) => {
    setSubscriptions(prev => prev.map(sub => 
      sub.id === subId ? { ...sub, status: 'active' as const } : sub
    ));
    toast({
      title: "Subscription Reactivated",
      description: "The subscription has been reactivated successfully.",
    });
  };

  const handleExportData = () => {
    const csvContent = "data:text/csv;charset=utf-8,ID,Company,Plan,Status,Amount,Billing Cycle,Start Date,End Date,Usage\n";
    let csvData = csvContent;
    
    subscriptions.forEach(sub => {
      csvData += `${sub.id},${sub.companyName},${sub.plan},${sub.status},${sub.amount},${sub.billingCycle},${sub.startDate},${sub.endDate},${sub.internshipCount}/${sub.maxInternships}\n`;
    });

    const encodedUri = encodeURI(csvData);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "subscriptions-export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Complete",
      description: "Subscription data has been exported successfully.",
    });
  };

  const handleViewBillingHistory = () => {
    toast({
      title: "Billing History",
      description: "Redirecting to billing history page...",
    });
  };

  const handleUpdatePaymentMethod = () => {
    toast({
      title: "Payment Method",
      description: "Redirecting to payment method update page...",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'trial': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'basic': return 'bg-gray-100 text-gray-800';
      case 'premium': return 'bg-blue-100 text-blue-800';
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalRevenue = subscriptions.reduce((sum, sub) => sum + (sub.status === 'active' ? sub.amount : 0), 0);
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active').length;
  const trialSubscriptions = subscriptions.filter(sub => sub.status === 'trial').length;
  const churnRate = (subscriptions.filter(sub => sub.status === 'cancelled').length / subscriptions.length * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Subscription Management</h2>
          <p className="text-gray-600">Monitor and manage billing and subscriptions</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+3</span> new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trial Accounts</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trialSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              Converting at 68% rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{churnRate}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">-2%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly recurring revenue growth</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription Distribution</CardTitle>
            <CardDescription>Breakdown by plan type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subscriptionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="basic" fill="#6B7280" name="Basic" />
                <Bar dataKey="premium" fill="#3B82F6" name="Premium" />
                <Bar dataKey="enterprise" fill="#7C3AED" name="Enterprise" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search subscriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="trial">Trial</option>
              <option value="cancelled">Cancelled</option>
              <option value="expired">Expired</option>
            </select>
            
            <select
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Plans</option>
              <option value="basic">Basic</option>
              <option value="premium">Premium</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions List and Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Subscriptions</CardTitle>
            <CardDescription>All customer subscriptions and billing information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredSubscriptions.map((subscription) => (
                <div
                  key={subscription.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedSubscription?.id === subscription.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedSubscription(subscription)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={subscription.companyAvatar} />
                        <AvatarFallback>{subscription.companyName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{subscription.companyName}</h4>
                        <p className="text-sm text-gray-600">{subscription.id}</p>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <Badge className={getPlanColor(subscription.plan)} variant="outline">
                        {subscription.plan}
                      </Badge>
                      <Badge className={getStatusColor(subscription.status)} variant="outline">
                        {subscription.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Amount:</span>
                      <p className="font-medium">
                        {subscription.amount > 0 ? `$${subscription.amount}/${subscription.billingCycle === 'monthly' ? 'mo' : 'yr'}` : 'Free Trial'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Usage:</span>
                      <p className="font-medium">{subscription.internshipCount}/{subscription.maxInternships} internships</p>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500">
                    Next payment: {subscription.nextPayment ? new Date(subscription.nextPayment).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Subscription Detail */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription Details</CardTitle>
            <CardDescription>
              {selectedSubscription ? `Manage subscription ${selectedSubscription.id}` : "Select a subscription to view details"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedSubscription ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={selectedSubscription.companyAvatar} />
                      <AvatarFallback>{selectedSubscription.companyName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{selectedSubscription.companyName}</h3>
                      <p className="text-sm text-gray-600">{selectedSubscription.id}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className={getPlanColor(selectedSubscription.plan)} variant="outline">
                      {selectedSubscription.plan}
                    </Badge>
                    <Badge className={getStatusColor(selectedSubscription.status)} variant="outline">
                      {selectedSubscription.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Plan:</span>
                    <p className="capitalize">{selectedSubscription.plan}</p>
                  </div>
                  <div>
                    <span className="font-medium">Amount:</span>
                    <p>
                      {selectedSubscription.amount > 0 ? `$${selectedSubscription.amount}` : 'Free'}
                      {selectedSubscription.amount > 0 && ` / ${selectedSubscription.billingCycle}`}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Start Date:</span>
                    <p>{new Date(selectedSubscription.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="font-medium">End Date:</span>
                    <p>{new Date(selectedSubscription.endDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="font-medium">Last Payment:</span>
                    <p>{selectedSubscription.lastPayment ? new Date(selectedSubscription.lastPayment).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Next Payment:</span>
                    <p>{selectedSubscription.nextPayment ? new Date(selectedSubscription.nextPayment).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Payment Method:</span>
                    <p>{selectedSubscription.paymentMethod || 'None'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Usage:</span>
                    <p>{selectedSubscription.internshipCount} / {selectedSubscription.maxInternships} internships</p>
                  </div>
                </div>

                {/* Usage Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Internship Usage</span>
                    <span>{Math.round((selectedSubscription.internshipCount / selectedSubscription.maxInternships) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(selectedSubscription.internshipCount / selectedSubscription.maxInternships) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  {selectedSubscription.status === 'active' && (
                    <Button 
                      variant="outline" 
                      onClick={() => handleCancelSubscription(selectedSubscription.id)}
                      className="w-full"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel Subscription
                    </Button>
                  )}
                  
                  {selectedSubscription.status === 'cancelled' && (
                    <Button 
                      onClick={() => handleReactivateSubscription(selectedSubscription.id)}
                      className="w-full"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Reactivate Subscription
                    </Button>
                  )}
                  
                  <Button variant="outline" className="w-full" onClick={handleViewBillingHistory}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Billing History
                  </Button>
                  
                  <Button variant="outline" className="w-full" onClick={handleUpdatePaymentMethod}>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Update Payment Method
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Subscription Selected</h3>
                <p className="text-gray-600">Select a subscription from the list to view details and manage billing</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Subscriptions;
