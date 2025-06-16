
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Download, FileText, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CoverLetterData {
  companyName: string;
  hiringManagerName: string;
  positionTitle: string;
  yourName: string;
  customContent: string;
}

const CoverLetterTemplates = () => {
  const { toast } = useToast();
  const [letterData, setLetterData] = useState<CoverLetterData>({
    companyName: "",
    hiringManagerName: "",
    positionTitle: "",
    yourName: "",
    customContent: ""
  });

  const templates = {
    entry: {
      title: "Entry-Level PM Intern",
      description: "Perfect for students with limited PM experience",
      content: `Dear ${letterData.hiringManagerName || '[Hiring Manager Name]'},

I am writing to express my strong interest in the ${letterData.positionTitle || '[Position Title]'} position at ${letterData.companyName || '[Company Name]'}. As a passionate student eager to break into product management, I am excited about the opportunity to contribute to your team while developing my PM skills.

Throughout my academic journey, I have developed a strong foundation in analytical thinking, user-centered design, and cross-functional collaboration. My coursework in [relevant subjects] has equipped me with the ability to analyze market trends, understand user needs, and make data-driven decisions—all essential skills for a successful product manager.

What particularly excites me about ${letterData.companyName || '[Company Name]'} is [specific reason related to company/product]. I am impressed by [specific company achievement or product feature] and would love to contribute to your mission of [company mission/goal].

I am eager to bring my fresh perspective, analytical mindset, and enthusiasm for product management to your team. I would welcome the opportunity to discuss how my academic background and passion for product management align with your internship program.

Thank you for your consideration.

Sincerely,
${letterData.yourName || '[Your Name]'}`
    },
    technical: {
      title: "Technical PM Intern",
      description: "For candidates with technical background",
      content: `Dear ${letterData.hiringManagerName || '[Hiring Manager Name]'},

I am excited to apply for the ${letterData.positionTitle || '[Position Title]'} position at ${letterData.companyName || '[Company Name]'}. With my technical background and growing passion for product management, I am eager to bridge the gap between engineering and business strategy at your organization.

My experience with [programming languages/technologies] has given me a deep appreciation for the technical challenges involved in product development. This technical foundation, combined with my interest in user experience and business strategy, has naturally led me toward product management as a career path.

In my previous projects, I have demonstrated the ability to translate technical concepts into user-friendly solutions. For example, [specific example of technical project with user impact]. This experience has taught me the importance of balancing technical feasibility with user needs and business objectives—a core responsibility of product managers.

${letterData.companyName || '[Company Name]'}'s commitment to [technical innovation/specific technology] aligns perfectly with my interests and technical background. I am particularly drawn to [specific product or technical challenge] and would love to contribute to solving complex technical problems while ensuring exceptional user experiences.

I am confident that my technical expertise, combined with my growing PM skills, would make me a valuable addition to your product team.

Best regards,
${letterData.yourName || '[Your Name]'}`
    },
    business: {
      title: "Business-Focused PM Intern",
      description: "Emphasizes business strategy and market analysis",
      content: `Dear ${letterData.hiringManagerName || '[Hiring Manager Name]'},

I am writing to apply for the ${letterData.positionTitle || '[Position Title]'} position at ${letterData.companyName || '[Company Name]'}. With my strong business acumen and passion for product strategy, I am excited about the opportunity to contribute to your product team's success.

My background in business analysis and market research has equipped me with the skills necessary to understand market dynamics, identify opportunities, and develop strategies that drive business growth. Through my coursework and projects in [relevant business areas], I have developed expertise in competitive analysis, market sizing, and business model development.

What sets me apart is my ability to combine analytical rigor with creative problem-solving. In my recent project analyzing [specific market/product], I identified key market opportunities and developed a comprehensive go-to-market strategy that resulted in [specific outcome or learning].

I am particularly drawn to ${letterData.companyName || '[Company Name]'} because of your innovative approach to [specific business area or market]. Your recent [product launch/market expansion/strategic initiative] demonstrates exactly the kind of strategic thinking and market leadership that I aspire to contribute to as a product manager.

I am eager to apply my business strategy skills and analytical mindset to help drive product decisions that create value for both users and the business.

Thank you for your consideration.

Sincerely,
${letterData.yourName || '[Your Name]'}`
    }
  };

  const pmTips = [
    "Research the company's products and mention specific features you admire",
    "Show understanding of the PM role by mentioning key responsibilities",
    "Quantify your achievements with specific metrics when possible",
    "Demonstrate user empathy and customer-first thinking",
    "Mention relevant frameworks you know (Agile, Design Thinking, etc.)",
    "Show passion for the industry and continuous learning"
  ];

  const handleCopyTemplate = (template: string) => {
    navigator.clipboard.writeText(template);
    toast({
      title: "Template Copied",
      description: "Cover letter template has been copied to your clipboard.",
    });
  };

  const handleDownload = () => {
    toast({
      title: "Cover Letter Downloaded",
      description: "Your cover letter has been downloaded as a document.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>PM Cover Letter Templates</CardTitle>
          <CardDescription>Professional cover letter templates specifically designed for product management internships</CardDescription>
        </CardHeader>
      </Card>

      {/* Personal Information Form */}
      <Card>
        <CardHeader>
          <CardTitle>Personalize Your Cover Letter</CardTitle>
          <CardDescription>Fill in your information to customize the templates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Your Name"
              value={letterData.yourName}
              onChange={(e) => setLetterData(prev => ({ ...prev, yourName: e.target.value }))}
            />
            <Input
              placeholder="Company Name"
              value={letterData.companyName}
              onChange={(e) => setLetterData(prev => ({ ...prev, companyName: e.target.value }))}
            />
            <Input
              placeholder="Hiring Manager Name"
              value={letterData.hiringManagerName}
              onChange={(e) => setLetterData(prev => ({ ...prev, hiringManagerName: e.target.value }))}
            />
            <Input
              placeholder="Position Title"
              value={letterData.positionTitle}
              onChange={(e) => setLetterData(prev => ({ ...prev, positionTitle: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Choose Your Template</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="entry" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="entry">Entry-Level</TabsTrigger>
              <TabsTrigger value="technical">Technical Focus</TabsTrigger>
              <TabsTrigger value="business">Business Focus</TabsTrigger>
            </TabsList>

            {Object.entries(templates).map(([key, template]) => (
              <TabsContent key={key} value={key} className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{template.title}</h3>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleCopyTemplate(template.content)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button size="sm" onClick={handleDownload}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
                <Textarea
                  value={template.content}
                  readOnly
                  rows={20}
                  className="font-mono text-sm"
                />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* PM Writing Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="h-5 w-5 mr-2" />
            PM Cover Letter Tips
          </CardTitle>
          <CardDescription>Essential tips for writing compelling PM cover letters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pmTips.map((tip, index) => (
              <div key={index} className="flex items-start space-x-2">
                <Badge variant="outline" className="mt-1 px-2 py-1 text-xs">
                  {index + 1}
                </Badge>
                <p className="text-sm">{tip}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Letter Editor */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Cover Letter</CardTitle>
          <CardDescription>Write your own personalized cover letter</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Write your custom cover letter here..."
            value={letterData.customContent}
            onChange={(e) => setLetterData(prev => ({ ...prev, customContent: e.target.value }))}
            rows={15}
          />
          <div className="flex space-x-2 mt-4">
            <Button variant="outline" onClick={() => handleCopyTemplate(letterData.customContent)}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Text
            </Button>
            <Button onClick={handleDownload}>
              <FileText className="h-4 w-4 mr-2" />
              Save as Document
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoverLetterTemplates;
