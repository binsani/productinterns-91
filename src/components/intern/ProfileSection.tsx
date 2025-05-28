
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileText } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

const ProfileSection = () => {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Manage your personal information and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{user?.name}</h3>
              <p className="text-gray-600">{user?.email}</p>
              <Button variant="outline" size="sm" className="mt-2">Change Photo</Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Skills</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {["Product Strategy", "User Research", "Data Analysis", "Agile", "Figma"].map((skill) => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Preferred Locations</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {["San Francisco", "New York", "Remote"].map((location) => (
                  <Badge key={location} variant="outline">{location}</Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resume & Documents</CardTitle>
          <CardDescription>Upload and manage your documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Upload your resume</p>
            <Button variant="outline">Choose File</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSection;
