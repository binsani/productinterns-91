
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileText, Edit } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/hooks/use-toast";
import ProfileEditModal from "./ProfileEditModal";

const ProfileSection = () => {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    skills: ["Product Strategy", "User Research", "Data Analysis", "Agile", "Figma"],
    locations: ["San Francisco", "New York", "Remote"]
  });

  const handleProfileSave = (data: { skills: string[]; locations: string[] }) => {
    setProfileData(data);
  };

  const handlePhotoChange = () => {
    toast({
      title: "Photo Upload",
      description: "Photo upload functionality will be available soon.",
    });
  };

  const handleResumeUpload = () => {
    toast({
      title: "Resume Upload",
      description: "Resume has been uploaded successfully.",
    });
  };

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Manage your personal information and preferences</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsEditModalOpen(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
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
                <Button variant="outline" size="sm" className="mt-2" onClick={handlePhotoChange}>
                  Change Photo
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Skills</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {profileData.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Preferred Locations</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {profileData.locations.map((location) => (
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
              <Button variant="outline" onClick={handleResumeUpload}>Choose File</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleProfileSave}
        initialData={profileData}
      />
    </>
  );
};

export default ProfileSection;
