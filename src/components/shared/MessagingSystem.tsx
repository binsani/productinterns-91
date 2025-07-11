
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, MessageCircle } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useMessages, useSendMessage } from "@/hooks/useSupabaseQuery";
import { useRealtimeMessages } from "@/hooks/useRealtimeMessages";
import { ValidatedForm } from "@/components/forms/ValidatedForm";
import { messageSchema } from "@/schemas/validationSchemas";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

interface MessagingSystemProps {
  applicationId: string;
  recipientId: string;
  recipientName: string;
}

export const MessagingSystem = ({ applicationId, recipientId, recipientName }: MessagingSystemProps) => {
  const { profile } = useAuthStore();
  const { data: messages = [], isLoading } = useMessages(applicationId);
  const sendMessageMutation = useSendMessage();
  const { isSubscribed } = useRealtimeMessages(applicationId);

  if (!profile) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Please log in to send messages</p>
        </CardContent>
      </Card>
    );
  }

  const handleSendMessage = async (data: { content: string }) => {
    await sendMessageMutation.mutateAsync({
      sender_id: profile.id,
      recipient_id: recipientId,
      application_id: applicationId,
      content: data.content.trim()
    });
  };

  return (
    <ErrorBoundary>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              Messages with {recipientName}
            </div>
            {isSubscribed && (
              <div className="text-xs text-green-600">● Live</div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-h-96 overflow-y-auto space-y-3 p-4 bg-muted/30 rounded-lg">
            {isLoading ? (
              <p className="text-center text-muted-foreground">Loading messages...</p>
            ) : messages.length === 0 ? (
              <p className="text-center text-muted-foreground">No messages yet</p>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender_id === profile.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] space-y-1 ${message.sender_id === profile.id ? 'items-end' : 'items-start'} flex flex-col`}>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {message.sender?.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">
                        {message.sender?.name || 'Unknown User'}
                      </span>
                    </div>
                    <div
                      className={`p-3 rounded-lg ${
                        message.sender_id === profile.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-background border'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(message.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <ValidatedForm
            schema={messageSchema.pick({ content: true })}
            onSubmit={handleSendMessage}
            className="flex space-x-2"
          >
            {(form) => (
              <>
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder="Type your message..."
                          {...field}
                          disabled={sendMessageMutation.isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  disabled={sendMessageMutation.isPending || !form.watch('content')?.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </>
            )}
          </ValidatedForm>
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};
