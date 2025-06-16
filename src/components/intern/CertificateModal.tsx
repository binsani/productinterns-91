
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Award, Download, Share2 } from "lucide-react";

interface CertificateModalProps {
  assessment: any;
  isOpen: boolean;
  onClose: () => void;
}

const CertificateModal = ({ assessment, isOpen, onClose }: CertificateModalProps) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <div className="space-y-6">
          {/* Certificate */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-purple-200 rounded-lg p-8 text-center">
            <div className="border-4 border-purple-300 rounded-lg p-8 bg-white">
              <div className="mb-6">
                <Award className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-purple-800 mb-2">Certificate of Achievement</h1>
                <div className="w-24 h-1 bg-purple-600 mx-auto"></div>
              </div>

              <div className="mb-8">
                <p className="text-lg text-gray-700 mb-4">This certifies that</p>
                <h2 className="text-4xl font-bold text-purple-800 mb-4">John Doe</h2>
                <p className="text-lg text-gray-700 mb-2">has successfully completed</p>
                <h3 className="text-2xl font-semibold text-purple-700 mb-4">{assessment.title}</h3>
                <p className="text-gray-600 mb-6">
                  with a score of <span className="font-bold text-purple-600">{assessment.score}%</span>
                </p>
              </div>

              <div className="flex justify-between items-end">
                <div className="text-left">
                  <p className="text-sm text-gray-600">Date Issued</p>
                  <p className="font-semibold">{currentDate}</p>
                </div>
                
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center mb-2">
                    <span className="text-white font-bold text-2xl">PM</span>
                  </div>
                  <p className="text-sm text-gray-600">InternMatch</p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-600">Certificate ID</p>
                  <p className="font-semibold">IM-{assessment.id}-{Date.now().toString().slice(-6)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center space-x-4">
            <Button className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline" className="flex items-center">
              <Share2 className="h-4 w-4 mr-2" />
              Share on LinkedIn
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CertificateModal;
