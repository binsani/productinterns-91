
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface ProfessionalSummarySectionProps {
  summary: string;
  onUpdate: (summary: string) => void;
}

const ProfessionalSummarySection = ({ summary, onUpdate }: ProfessionalSummarySectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional Summary</CardTitle>
        <CardDescription>A compelling summary highlighting your PM aspirations and relevant experience</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Write a compelling summary that highlights your passion for product management, relevant experience, and career goals..."
          value={summary}
          onChange={(e) => onUpdate(e.target.value)}
          rows={4}
        />
      </CardContent>
    </Card>
  );
};

export default ProfessionalSummarySection;
