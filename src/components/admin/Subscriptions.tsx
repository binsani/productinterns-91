
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  MoreHorizontal, 
  DollarSign, 
  CreditCard, 
  Calendar, 
  TrendingUp,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react";

interface Subscription {
  id: string;
  customerName: string;
  email: string;
  plan: "Basic" | "Premium" | "Enterprise";
  status: "active" | "cancelled" | "past_due" | "trialing";
  amount: number;
  billingCycle: "monthly" | "yearly";
  nextBilling: string;
  createdAt: string;
  avatar: string;
}

const Subscriptions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const subscriptions: Subscription[] = [
    {
      id: "sub_1",
      customerName: "TechCorp Inc",
      email: "billing@techcorp.com",
      plan: "Enterprise",
      status: "active",
      amount: 99,
      billingCycle: "monthly",
      nextBilling: "2024-02-15",
      createdAt: "2024-01-15",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=techcorp"
    },
    {
      id: "sub_2",
      customerName: "StartupX",
      email: "finance@startupx.com",
      plan: "Premium",
      status: "active",
      amount: 49,
      billingCycle: "monthly",
      nextBilling: "2024-02-20",
      createdAt: "2024-01-20",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=startupx"
    },
    {
      id: "sub_3",
      customerName: "Innovation Labs",
      email: "accounts@innovation.com",
      plan: "Basic",
      status: "past_due",
      amount: 19,
      billingCycle: "monthly",
      nextBilling: "2024-02-10",
      createdAt: "2024-01-10",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=innovation"
    },
    {
      id: "sub_4",
      customerName: "Growth Corp",
      email: "billing@growth.com",
      plan: "Premium",
      status: "trialing",
      amount: 49,
      billingCycle: "monthly",
      nextBilling: "2024-02-25",
      createdAt: "2024-02-11",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=growth"
    },
    {
      id: "sub_5",
      customerName: "DevStudio",
      email: "admin@devstudio.com",
      plan: "Enterprise",
      status: "cancelled",
      amount: 99,
      billingCycle: "yearly",
      nextBilling: "2024-01-30",
      createdAt: "2024-01-01",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=devstudio"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "trialing": return "bg-blue-100 text-blue-800";
      case "past_due": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "Basic": return "bg-gray-100 text-gray-800";
      case "Premium": return "bg-blue-100 text-blue-800";
      case "Enterprise": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="h-3 w-3" />;
      case "trialing": return <Calendar className="h-3 w-3" />;
      case "past_due": return <AlertTriangle className="h-3 w-3" />;
      case "cancelled": return <XCircle className="h-3 w-3" />;
      default: return <CheckCircle className="h-3 w-3" />;
    }
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = planFilter === "all" || sub.plan === planFilter;
    const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
    
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const stats = {
    total: subscriptions.length,
    active: subscriptions.filter(s => s.status === "active").length,
    trialing: subscriptions.filter(s => s.status === "trialing").length,
    pastDue: subscriptions.filter(s => s.status === "past_due").length,
    cancelled: subscriptions.filter(s => s.status === "cancelled").length,
    mrr: subscriptions
      .filter(s => s.status === "active")
      .reduce((sum, s) => sum + (s.billingCycle === "yearly" ? s.amount / 12 : s.amount), 0),
    arr: subscriptions
      .filter(s => s.status === "active")
      .reduce((sum, s) => sum + (s.billingCycle === "yearly" ? s.amount : s.amount * 12), 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Subscription Management</h2>
        <p className="text-gray-600">Monitor and manage customer subscriptions</p>
      </div>

      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-green-100">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Monthly Recurring Revenue</p>
                <p className="text-2xl font-bold">${stats.mrr.toFixed(0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-blue-100">
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Annual Recurring Revenue</p>
                <p className="text-2xl font-bold">${stats.arr.toFixed(0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-purple-100">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Subscriptions</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-yellow-100">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Past Due</p>
                <p className="text-2xl font-bold">{stats.pastDue}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Plans Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">
              {subscriptions.filter(s => s.plan === "Basic").length}
            </div>
            <div className="text-sm text-gray-600">Basic Plan ($19/month)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {subscriptions.filter(s => s.plan === "Premium").length}
            </div>
            <div className="text-sm text-gray-600">Premium Plan ($49/month)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {subscriptions.filter(s => s.plan === "Enterprise").length}
            </div>
            <div className="text-sm text-gray-600">Enterprise Plan ($99/month)</div>
          </CardContent>
        </Card>
      </div>

      {/* Subscriptions List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Subscriptions</CardTitle>
              <CardDescription>Manage customer subscriptions and billing</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="Basic">Basic</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
                <SelectItem value="Enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="trialing">Trialing</SelectItem>
                <SelectItem value="past_due">Past Due</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Subscription List */}
          <div className="space-y-4">
            {filteredSubscriptions.map((subscription) => (
              <div key={subscription.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={subscription.avatar} alt={subscription.customerName} />
                      <AvatarFallback>{subscription.customerName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold">{subscription.customerName}</h3>
                        <Badge className={getPlanColor(subscription.plan)}>
                          {subscription.plan}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{subscription.email}</p>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(subscription.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(subscription.status)}
                            <span className="capitalize">{subscription.status}</span>
                          </div>
                        </Badge>
                        <Badge variant="outline">
                          ${subscription.amount}/{subscription.billingCycle === "monthly" ? "mo" : "yr"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right text-sm">
                      <div className="text-gray-600">
                        Next billing: {new Date(subscription.nextBilling).toLocaleDateString()}
                      </div>
                      <div className="text-gray-500">
                        Customer since: {new Date(subscription.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-gray-500">
                        ID: {subscription.id}
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>View Invoices</DropdownMenuItem>
                        <DropdownMenuItem>Update Plan</DropdownMenuItem>
                        <DropdownMenuItem>Send Invoice</DropdownMenuItem>
                        {subscription.status === "past_due" && (
                          <DropdownMenuItem className="text-yellow-600">
                            Retry Payment
                          </DropdownMenuItem>
                        )}
                        {subscription.status === "active" && (
                          <DropdownMenuItem className="text-red-600">
                            Cancel Subscription
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Subscriptions;
