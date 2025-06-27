
import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileText, Edit, Upload, User } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/hooks/use-toast";
import ProfileEditModal from "./ProfileEditModal";

const ProfileSection = () => {
  const { profile, updateProfile } = useAuthStore();
  const { toast } = useToast();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    skills: profile?.skills || ["Product Strategy", "User Research", "Data Analysis", "Agile", "Figma"],
    locations: profile?.locations || ["San Francisco", "New York", "Remote"]
  });
  const [uploadedResume, setUploadedResume] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState(profile?.avatar_url);
  
  const photoInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const handleProfileSave = (data: { skills: string[]; locations: string[] }) => {
    setProfileData(data);
    // Update the profile in the database
    updateProfile(data);
  };

  const handlePhotoChange = () => {
    photoInputRef.current?.click();
  };

  const handlePhotoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const imageUrl = URL.createObjectURL(file);
        setProfileImageUrl(imageUrl);
        
        // Update profile avatar in store
        updateProfile({ avatar_url: imageUrl });
        
        toast({
          title: "Photo Updated",
          description: "Your profile photo has been updated successfully.",
        });
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please select an image file (PNG, JPG, etc.).",
          variant: "destructive",
        });
      }
    }
  };

  const handleResumeUpload = () => {
    resumeInputRef.current?.click();
  };

  const handleResumeFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        setUploadedResume(file);
        toast({
          title: "Resume Uploaded",
          description: `${file.name} has been uploaded successfully.`,
        });
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF file for your resume.",
          variant: "destructive",
        });
      }
    }
  };

  const handleResumeDownload = () => {
    if (uploadedResume) {
      const url = URL.createObjectURL(uploadedResume);
      const a = document.createElement('a');
      a.href = url;
      a.download = uploadedResume.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
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
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profileImageUrl} alt={profile?.name} />
                  <AvatarFallback>
                    <User className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
              </div>
              <div>
                <h3 className="text-xl font-semibold">{profile?.name || "User"}</h3>
                <p className="text-gray-600">{profile?.email}</p>
                <Button variant="outline" size="sm" className="mt-2" onClick={handlePhotoChange}>
                  <Upload className="h-4 w-4 mr-2" />
                  Change Photo
                </Button>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoFileChange}
                  className="hidden"
                />
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
            {uploadedResume ? (
              <div className="border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-red-600" />
                    <div>
                      <p className="font-medium">{uploadedResume.name}</p>
                      <p className="text-sm text-gray-600">
                        {(uploadedResume.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={handleResumeDownload}>
                      Download
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleResumeUpload}>
                      Replace
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Upload your resume (PDF only)</p>
                <Button variant="outline" onClick={handleResumeUpload}>
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
              </div>
            )}
            <input
              ref={resumeInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleResumeFileChange}
              className="hidden"
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
    </>
  );
};

export default ProfileSection;
