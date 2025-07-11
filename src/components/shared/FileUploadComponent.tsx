
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, File, Image } from 'lucide-react';
import { useFileUpload } from '@/hooks/useFileUpload';

interface FileUploadComponentProps {
  bucket: string;
  onUploadComplete: (filePath: string) => void;
  onUploadError?: (error: string) => void;
  maxSizeBytes?: number;
  allowedTypes?: string[];
  folder?: string;
  accept?: Record<string, string[]>;
  multiple?: boolean;
  className?: string;
}

export const FileUploadComponent = ({
  bucket,
  onUploadComplete,
  onUploadError,
  maxSizeBytes = 5 * 1024 * 1024,
  allowedTypes,
  folder,
  accept,
  multiple = false,
  className
}: FileUploadComponentProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const { uploadFile, isUploading, progress } = useFileUpload({
    bucket,
    maxSizeBytes,
    allowedTypes,
    folder
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      try {
        const filePath = await uploadFile(file);
        if (filePath) {
          setUploadedFiles(prev => [...prev, filePath]);
          onUploadComplete(filePath);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        onUploadError?.(errorMessage);
      }
    }
  }, [uploadFile, onUploadComplete, onUploadError]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxSize: maxSizeBytes
  });

  const removeFile = (filePath: string) => {
    setUploadedFiles(prev => prev.filter(f => f !== filePath));
  };

  const getFileIcon = (filePath: string) => {
    const ext = filePath.split('.').pop()?.toLowerCase();
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    
    return imageExts.includes(ext || '') ? (
      <Image className="h-4 w-4" />
    ) : (
      <File className="h-4 w-4" />
    );
  };

  return (
    <div className={className}>
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
              ${isUploading ? 'pointer-events-none opacity-50' : ''}
            `}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            
            {isDragActive ? (
              <p className="text-lg font-medium">Drop files here...</p>
            ) : (
              <div>
                <p className="text-lg font-medium mb-2">
                  Drag & drop files here, or click to select
                </p>
                <p className="text-sm text-muted-foreground">
                  Max size: {Math.round(maxSizeBytes / (1024 * 1024))}MB
                </p>
                {allowedTypes && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Allowed: {allowedTypes.join(', ')}
                  </p>
                )}
              </div>
            )}
          </div>

          {isUploading && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Uploading...</span>
                <span className="text-sm">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {fileRejections.length > 0 && (
            <div className="mt-4 space-y-2">
              {fileRejections.map(({ file, errors }) => (
                <div key={file.name} className="text-sm text-destructive">
                  {file.name}: {errors.map(e => e.message).join(', ')}
                </div>
              ))}
            </div>
          )}

          {uploadedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="font-medium">Uploaded Files:</h4>
              {uploadedFiles.map((filePath) => (
                <div key={filePath} className="flex items-center justify-between bg-muted p-2 rounded">
                  <div className="flex items-center space-x-2">
                    {getFileIcon(filePath)}
                    <span className="text-sm truncate">{filePath.split('/').pop()}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(filePath)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
