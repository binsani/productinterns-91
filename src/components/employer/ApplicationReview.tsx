
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle, XCircle, Eye, Download, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/authStore";
import { supabase } from "@/integrations/supabase/client";
import { MessagingSystem } from "@/components/shared/MessagingSystem";
import { logger } from "@/utils/logger";
import { handleError } from "@/utils/errorHandler";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

interface ApplicationReviewProps {
  internshipId?: string;
}

export const ApplicationReview = ({ internshipId }: ApplicationReviewProps) => {
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<any | null>(null);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingApplications, setIsLoadingApplications] = useState(true);
  const [showMessaging, setShowMessaging] = useState(false);
  const { toast } = useToast();
  const { profile } = useAuthStore();

  useEffect(() => {
    fetchApplications();
  }, [internshipId, profile?.id]);

  const fetchApplications = async () => {
    if (!profile?.id) {
      logger.warn('ApplicationReview: No profile available');
      setIsLoadingApplications(false);
      return;
    }

    try {
      setIsLoadingApplications(true);
      logger.info('Fetching applications for review', { 
        internshipId, 
        employerId: profile.id 
      });

      // First get applications
      let query = supabase
        .from('applications')
        .select('*')
        .order('applied_at', { ascending: false });

      if (internshipId) {
        query = query.eq('internship_id', internshipId);
      } else {
        // Get internship IDs for current employer
        const { data: internships, error: internshipsError } = await supabase
          .from('internships')
          .select('id')
          .eq('employer_id', profile.id);

        if (internshipsError) throw internshipsError;

        const internshipIds = internships?.map(i => i.id) || [];
        if (internshipIds.length === 0) {
          logger.info('No internships found for employer', { employerId: profile.id });
          setApplications([]);
          setIsLoadingApplications(false);
          return;
        }
        query = query.in('internship_id', internshipIds);
      }

      const { data: applicationsData, error } = await query;
      if (error) throw error;

      // Fetch related data separately
      const enrichedApplications = await Promise.all(
        (applicationsData || []).map(async (app) => {
          try {
            const [internData, internshipData] = await Promise.all([
              supabase.from('profiles').select('*').eq('id', app.intern_id).single(),
              supabase.from('internships').select('*').eq('id', app.internship_id).single()
            ]);

            return {
              ...app,
              intern: internData.data,
              internship: internshipData.data
            };
          } catch (enrichmentError) {
            logger.error('Failed to enrich application data', enrichmentError, { 
              applicationId: app.id 
            });
            return {
              ...app,
              intern: null,
              internship: null
            };
          }
        })
      );

      setApplications(enrichedApplications);
      logger.info('Applications fetched successfully', { 
        count: enrichedApplications.length 
      });
    } catch (error) {
      logger.error('Failed to fetch applications', error);
      handleError(error, toast);
    } finally {
      setIsLoadingApplications(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: string) => {
    setIsLoading(true);
    logger.info('Updating application status', { applicationId, status });
    
    try {
      const { error } = await supabase
        .from('applications')
        .update({ 
          status, 
          reviewed_at: new Date().toISOString(),
          notes: notes || null
        })
        .eq('id', applicationId);

      if (error) throw error;

      logger.info('Application status updated successfully', { applicationId, status });
      toast({
        title: "Application updated",
        description: `Application ${status} successfully`
      });

      fetchApplications();
      setSelectedApplication(null);
      setNotes("");
    } catch (error) {
      logger.error('Failed to update application status', error, { applicationId, status });
      handleError(error, toast);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'accepted': return 'default';
      case 'rejected': return 'destructive';
      case 'reviewed': return 'secondary';
      default: return 'outline';
    }
  };

  const downloadResume = async (resumeUrl: string) => {
    try {
      logger.info('Downloading resume', { resumeUrl });
      
      const { data, error } = await supabase.storage
        .from('resumes')
        .download(resumeUrl);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume.pdf';
      a.click();
      URL.revokeObjectURL(url);
      
      logger.info('Resume downloaded successfully');
    } catch (error) {
      logger.error('Failed to download resume', error, { resumeUrl });
      handleError(error, toast);
    }
  };

  if (isLoadingApplications) {
    return <LoadingSpinner />;
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Application Review</CardTitle>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No applications found
              </p>
            ) : (
              <div className="space-y-4">
                {applications.map((application) => (
                  <Card key={application.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>
                            {application.intern?.name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{application.intern?.name || 'Unknown'}</h3>
                          <p className="text-sm text-muted-foreground">
                            {application.intern?.email || 'No email'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Applied {new Date(application.applied_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getStatusBadgeVariant(application.status)}>
                          {application.status}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedApplication(application)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {selectedApplication && selectedApplication.intern && (
          <Card>
            <CardHeader>
              <CardTitle>Review Application - {selectedApplication.intern.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Applicant Details</h4>
                <div className="space-y-2">
                  <p><strong>Name:</strong> {selectedApplication.intern.name}</p>
                  <p><strong>Email:</strong> {selectedApplication.intern.email}</p>
                  {selectedApplication.intern.bio && (
                    <p><strong>Bio:</strong> {selectedApplication.intern.bio}</p>
                  )}
                  {selectedApplication.intern.skills && (
                    <div>
                      <strong>Skills:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedApplication.intern.skills.map((skill: string, index: number) => (
                          <Badge key={index} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {selectedApplication.cover_letter && (
                <div>
                  <h4 className="font-semibold mb-2">Cover Letter</h4>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="whitespace-pre-wrap">{selectedApplication.cover_letter}</p>
                  </div>
                </div>
              )}

              {selectedApplication.resume_url && (
                <div>
                  <h4 className="font-semibold mb-2">Resume</h4>
                  <Button
                    variant="outline"
                    onClick={() => downloadResume(selectedApplication.resume_url)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Resume
                  </Button>
                </div>
              )}

              <div>
                <h4 className="font-semibold mb-2">Review Notes</h4>
                <Textarea
                  placeholder="Add your review notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex justify-between">
                <div className="space-x-2">
                  <Button
                    onClick={() => updateApplicationStatus(selectedApplication.id, 'accepted')}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Accept
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => updateApplicationStatus(selectedApplication.id, 'rejected')}
                    disabled={isLoading}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowMessaging(!showMessaging)}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message Applicant
                </Button>
              </div>

              {showMessaging && (
                <MessagingSystem
                  applicationId={selectedApplication.id}
                  recipientId={selectedApplication.intern.id}
                  recipientName={selectedApplication.intern.name}
                />
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </ErrorBoundary>
  );
};
