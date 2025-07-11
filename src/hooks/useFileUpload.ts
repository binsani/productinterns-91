
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';

interface UseFileUploadOptions {
  bucket: string;
  maxSizeBytes?: number;
  allowedTypes?: string[];
  folder?: string;
}

export const useFileUpload = (options: UseFileUploadOptions) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  
  const { bucket, maxSizeBytes = 5 * 1024 * 1024, allowedTypes, folder } = options;

  const uploadFile = async (file: File, customFileName?: string): Promise<string | null> => {
    try {
      setIsUploading(true);
      setProgress(0);

      // Validate file size
      if (file.size > maxSizeBytes) {
        throw new Error(`File size exceeds ${maxSizeBytes / (1024 * 1024)}MB limit`);
      }

      // Validate file type
      if (allowedTypes && !allowedTypes.includes(file.type)) {
        throw new Error(`File type ${file.type} not allowed. Allowed types: ${allowedTypes.join(', ')}`);
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = customFileName || `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      logger.info('Starting file upload', { fileName, fileSize: file.size, fileType: file.type });

      // Upload file
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      setProgress(100);
      
      logger.info('File uploaded successfully', { filePath: data.path });
      
      toast({
        title: 'Upload successful',
        description: 'File has been uploaded successfully'
      });

      return data.path;
    } catch (error) {
      logger.error('File upload failed', error, { fileName: file.name });
      
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload file',
        variant: 'destructive'
      });
      
      return null;
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  const deleteFile = async (filePath: string): Promise<boolean> => {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) throw error;

      logger.info('File deleted successfully', { filePath });
      return true;
    } catch (error) {
      logger.error('File deletion failed', error, { filePath });
      return false;
    }
  };

  const getPublicUrl = (filePath: string): string => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  };

  return {
    uploadFile,
    deleteFile,
    getPublicUrl,
    isUploading,
    progress
  };
};
