
import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, User } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "@/components/shared/FileUpload";
import ProfileEditModal from "./ProfileEditModal";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

const ProfileSection = () => {
  const { profile, updateProfile } = useAuthStore();
  const { toast } = useToast();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    skills: profile?.skills || ["Product Strategy", "User Research", "Data Analysis", "Agile", "Figma"],
    locations: profile?.locations || ["San Francisco", "New York", "Remote"]
  });
  const [profileImageUrl, setProfileImageUrl] = useState(profile?.avatar_url);

  const handleProfileSave = async (data: { skills: string[]; locations: string[] }) => {
    try {
      setProfileData(data);
      const result = await updateProfile(data);
      if (result?.error) {
        toast({
          title: "Error updating profile",
          description: result.error,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully."
        });
      }
    } catch (error) {
      toast({
        title: "Error updating profile",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const handleAvatarUpload = async (url: string) => {
    try {
      setProfileImageUrl(url);
      const result = await updateProfile({ avatar_url: url });
      if (result?.error) {
        toast({
          title: "Error updating avatar",
          description: result.error,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Avatar updated",
          description: "Your profile photo has been updated successfully."
        });
      }
    } catch (error) {
      toast({
        title: "Error updating avatar",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  return (
    <ErrorBoundary>
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
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profileImageUrl} alt={profile?.name} />
                  <AvatarFallback>
                    <User className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{profile?.name || "User"}</h3>
                <p className="text-gray-600">{profile?.email}</p>
                <div className="mt-2">
                  <FileUpload
                    bucket="avatars"
                    accept="image/*"
                    maxSize={2}
                    onUploadComplete={handleAvatarUpload}
                    currentFile={profileImageUrl}
                    label="Change Profile Photo"
                  />
                </div>
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
            <FileUpload
              bucket="resumes"
              accept=".pdf,application/pdf"
              maxSize={10}
              onUploadComplete={(url) => {
                toast({
                  title: "Resume uploaded",
                  description: "Your resume has been uploaded successfully."
                });
              }}
              label="Upload Resume (PDF only)"
            />
          </CardContent>
        </Card>
      </div>

      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleProfileSave}
        initialData={profileData}
      />
    </ErrorBoundary>
  );
};

export default ProfileSection;
