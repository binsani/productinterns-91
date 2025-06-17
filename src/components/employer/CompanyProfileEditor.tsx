
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Upload, X, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/authStore";

const CompanyProfileEditor = () => {
  const { toast } = useToast();
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [companyData, setCompanyData] = useState({
    name: user?.companyName || "",
    industry: "Technology & Software",
    size: "500-1000",
    location: "San Francisco, CA",
    founded: "2015",
    website: "https://company.com",
    description: "We're a fast-growing technology company focused on building innovative products that solve real-world problems. Our team values collaboration, innovation, and continuous learning. We offer excellent opportunities for PM interns to grow.",
    benefits: ["Health Insurance", "Flexible Hours", "Remote Work", "Learning Budget", "Free Lunch"],
    logoUrl: ""
  });
  const [newBenefit, setNewBenefit] = useState("");

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to a service like Supabase Storage
      const mockUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${companyData.name}`;
      setCompanyData(prev => ({ ...prev, logoUrl: mockUrl }));
      toast({
        title: "Logo Uploaded",
        description: "Company logo has been updated successfully.",
      });
    }
  };

  const handleSave = () => {
    // Update the user's company name in the auth store
    if (user) {
      updateUser({ ...user, companyName: companyData.name });
    }
    
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Company profile has been saved successfully.",
    });
  };

  const addBenefit = () => {
    if (newBenefit.trim() && !companyData.benefits.includes(newBenefit.trim())) {
      setCompanyData(prev => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()]
      }));
      setNewBenefit("");
    }
  };

  const removeBenefit = (benefit: string) => {
    setCompanyData(prev => ({
      ...prev,
      benefits: prev.benefits.filter(b => b !== benefit)
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Company Profile</CardTitle>
            <CardDescription>Manage your company information and branding</CardDescription>
          </div>
          <div className="space-x-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              {companyData.logoUrl ? (
                <img src={companyData.logoUrl} alt="Company Logo" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <span className="text-white font-bold text-2xl">{companyData.name.charAt(0)}</span>
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold">{companyData.name}</h3>
              <p className="text-gray-600">{companyData.industry} • {companyData.size} employees</p>
              {isEditing && (
                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <Button variant="outline" size="sm" asChild>
                    <label htmlFor="logo-upload" className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Update Logo
                    </label>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={companyData.name}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, name: e.target.value }))}
                />
              ) : (
                <p className="text-gray-700">{companyData.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              {isEditing ? (
                <Select value={companyData.industry} onValueChange={(value) => setCompanyData(prev => ({ ...prev, industry: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technology & Software">Technology & Software</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Financial Services">Financial Services</SelectItem>
                    <SelectItem value="E-commerce">E-commerce</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-gray-700">{companyData.industry}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Company Size</Label>
              {isEditing ? (
                <Select value={companyData.size} onValueChange={(value) => setCompanyData(prev => ({ ...prev, size: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 employees</SelectItem>
                    <SelectItem value="11-50">11-50 employees</SelectItem>
                    <SelectItem value="51-200">51-200 employees</SelectItem>
                    <SelectItem value="201-500">201-500 employees</SelectItem>
                    <SelectItem value="500-1000">500-1000 employees</SelectItem>
                    <SelectItem value="1000+">1000+ employees</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-gray-700">{companyData.size} employees</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              {isEditing ? (
                <Input
                  id="location"
                  value={companyData.location}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, location: e.target.value }))}
                />
              ) : (
                <p className="text-gray-700">{companyData.location}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="founded">Founded</Label>
              {isEditing ? (
                <Input
                  id="founded"
                  value={companyData.founded}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, founded: e.target.value }))}
                />
              ) : (
                <p className="text-gray-700">{companyData.founded}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              {isEditing ? (
                <Input
                  id="website"
                  value={companyData.website}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, website: e.target.value }))}
                />
              ) : (
                <a href={companyData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {companyData.website}
                </a>
              )}
            </div>
          </div>

          {/* Company Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Company Description</Label>
            {isEditing ? (
              <Textarea
                id="description"
                value={companyData.description}
                onChange={(e) => setCompanyData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
              />
            ) : (
              <p className="text-gray-700">{companyData.description}</p>
            )}
          </div>

          {/* Benefits & Perks */}
          <div className="space-y-2">
            <Label>Benefits & Perks</Label>
            <div className="flex flex-wrap gap-2">
              {companyData.benefits.map((benefit) => (
                <Badge key={benefit} variant="secondary" className="flex items-center gap-1">
                  {benefit}
                  {isEditing && (
                    <button
                      onClick={() => removeBenefit(benefit)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
            {isEditing && (
              <div className="flex items-center space-x-2 mt-2">
                <Input
                  placeholder="Add a benefit"
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addBenefit()}
                />
                <Button size="sm" onClick={addBenefit}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyProfileEditor;
