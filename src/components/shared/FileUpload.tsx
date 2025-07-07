import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Upload, File, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/authStore";
import { supabase } from "@/integrations/supabase/client";

interface FileUploadProps {
  bucket: 'resumes' | 'avatars' | 'company-logos';
  accept?: string;
  maxSize?: number; // in MB
  onUploadComplete?: (url: string) => void;
  currentFile?: string;
  label?: string;
}

export const FileUpload = ({ 
  bucket, 
  accept = "*/*", 
  maxSize = 5, 
  onUploadComplete,
  currentFile,
  label = "Upload File"
}: FileUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  const { profile } = useAuthStore();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `Please select a file smaller than ${maxSize}MB`,
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
  };

  const uploadFile = async () => {
    if (!selectedFile || !profile?.id) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Create file path
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${profile.id}/${Date.now()}.${fileExt}`;

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      setUploadProgress(100);
      
      toast({
        title: "Upload successful",
        description: "File uploaded successfully"
      });

      onUploadComplete?.(data.path);
      setSelectedFile(null);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const deleteCurrentFile = async () => {
    if (!currentFile) return;

    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([currentFile]);

      if (error) throw error;

      toast({
        title: "File deleted",
        description: "File removed successfully"
      });

      onUploadComplete?.("");
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete failed",
        description: "Failed to delete file",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      
      {currentFile && (
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center space-x-2">
            <File className="h-4 w-4" />
            <span className="text-sm">Current file uploaded</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={deleteCurrentFile}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="space-y-2">
        <Input
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          disabled={uploading}
        />
        
        {selectedFile && (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-muted rounded">
              <div className="flex items-center space-x-2">
                <File className="h-4 w-4" />
                <span className="text-sm truncate">{selectedFile.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeFile}
                disabled={uploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {uploading && (
              <Progress value={uploadProgress} className="w-full" />
            )}

            <div className="flex space-x-2">
              <Button 
                onClick={uploadFile} 
                disabled={uploading}
                size="sm"
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload'}
              </Button>
              {!uploading && (
                <Button 
                  variant="outline" 
                  onClick={removeFile}
                  size="sm"
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Maximum file size: {maxSize}MB
      </p>
    </div>
  );
};