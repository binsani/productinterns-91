
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Download, 
  Calendar,
  DollarSign,
  Check,
  AlertCircle,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BillingManagement = () => {
  const { toast } = useToast();
  const [currentPlan, setCurrentPlan] = useState("Pro");

  const invoices = [
    {
      id: "INV-001",
      date: "2024-01-01",
      amount: 299,
      status: "Paid",
      description: "Pro Plan - January 2024"
    },
    {
      id: "INV-002",
      date: "2023-12-01",
      amount: 299,
      status: "Paid",
      description: "Pro Plan - December 2023"
    },
    {
      id: "INV-003",
      date: "2023-11-01",
      amount: 299,
      status: "Paid",
      description: "Pro Plan - November 2023"
    },
  ];

  const plans = [
    {
      name: "Starter",
      price: 99,
      period: "month",
      features: [
        "Up to 3 job postings",
        "50 candidate profiles",
        "Basic analytics",
        "Email support"
      ],
      current: false
    },
    {
      name: "Pro",
      price: 299,
      period: "month",
      features: [
        "Unlimited job postings",
        "Unlimited candidate profiles",
        "Advanced analytics",
        "Priority support",
        "Interview scheduling",
        "Team collaboration"
      ],
      current: true
    },
    {
      name: "Enterprise",
      price: 599,
      period: "month",
      features: [
        "Everything in Pro",
        "Custom integrations",
        "Dedicated account manager",
        "Custom reporting",
        "API access",
        "SLA guarantee"
      ],
      current: false
    }
  ];

  const handleDownloadInvoice = (invoiceId: string) => {
    toast({
      title: "Download Started",
      description: `Downloading invoice ${invoiceId}...`,
    });
  };

  const handleUpgradePlan = (planName: string) => {
    toast({
      title: "Plan Upgrade",
      description: `Upgrading to ${planName} plan. You will be redirected to payment.`,
    });
  };

  const handleUpdatePaymentMethod = () => {
    toast({
      title: "Payment Method",
      description: "Update payment method functionality will be available soon.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Current Plan
          </CardTitle>
          <CardDescription>Manage your subscription and billing details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold">{currentPlan} Plan</h3>
                <Badge className="bg-blue-100 text-blue-800">Active</Badge>
              </div>
              <p className="text-gray-600">$299/month • Next billing: February 1, 2024</p>
              <p className="text-sm text-gray-500 mt-1">Unlimited job postings and candidates</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleUpdatePaymentMethod}>
                Update Payment
              </Button>
              <Button variant="outline">
                Manage Plan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Overview</CardTitle>
          <CardDescription>Your current month usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">5</div>
              <p className="text-sm text-gray-600">Active Job Postings</p>
              <p className="text-xs text-gray-500">Unlimited available</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">47</div>
              <p className="text-sm text-gray-600">Candidate Profiles</p>
              <p className="text-xs text-gray-500">Unlimited available</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">12</div>
              <p className="text-sm text-gray-600">Interviews Scheduled</p>
              <p className="text-xs text-gray-500">Unlimited available</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
          <CardDescription>Upgrade or downgrade your plan anytime</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div 
                key={plan.name} 
                className={`border rounded-lg p-6 ${plan.current ? 'border-blue-500 bg-blue-50' : ''}`}
              >
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                </div>
                
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                {plan.current ? (
                  <Button className="w-full" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <Button 
                    className="w-full" 
                    variant={plan.name === "Enterprise" ? "default" : "outline"}
                    onClick={() => handleUpgradePlan(plan.name)}
                  >
                    {plan.price > 299 ? "Upgrade" : "Downgrade"} to {plan.name}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Billing History</CardTitle>
            <CardDescription>Download your invoices and payment history</CardDescription>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-green-100 rounded-full">
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{invoice.description}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(invoice.date).toLocaleDateString()}
                      </span>
                      <span>${invoice.amount}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-100 text-green-800">
                    {invoice.status}
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDownloadInvoice(invoice.id)}
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Manage your payment information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gray-100 rounded">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">**** **** **** 4242</h3>
                <p className="text-sm text-gray-600">Expires 12/25</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleUpdatePaymentMethod}>
              Update
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingManagement;
