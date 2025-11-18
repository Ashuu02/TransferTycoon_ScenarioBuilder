import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Download, RefreshCcw, FileJson, ArrowLeft } from 'lucide-react';

interface JsonResultProps {
  data: any;
  onReset: () => void;
  onBackToReview?: () => void;
}

export const JsonResult: React.FC<JsonResultProps> = ({ data, onReset, onBackToReview }) => {
  const jsonString = JSON.stringify(data, null, 2);
  
  // Default filename state (without .json extension)
  const [filename, setFilename] = useState(() => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    return `Scenario_${timestamp}`;
  });

  const handleDownload = () => {
    // Ensure we have a valid filename
    let validFilename = filename.trim();
    if (!validFilename) validFilename = "scenario";
    // Always append .json extension
    const filenameWithExtension = `${validFilename}.json`;
    
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filenameWithExtension;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card title="2. Result" description="Review your generated JSON below." className="animate-in fade-in slide-in-from-bottom-4">
      <div className="space-y-4 sm:space-y-6">
        
        {/* JSON Preview */}
        <div className="bg-slate-800 rounded-lg p-3 sm:p-4 overflow-auto max-h-96 shadow-inner border border-slate-700">
          <div className="flex justify-between items-center mb-2 border-b border-slate-700 pb-2">
            <span className="text-slate-400 text-xs font-mono">Preview</span>
            <span className="text-green-400 text-xs font-mono">Valid JSON</span>
          </div>
          <pre className="text-xs sm:text-sm text-blue-300 font-mono whitespace-pre-wrap break-words">
            {jsonString}
          </pre>
        </div>

        {/* Filename Input - Moved below JSON preview */}
        <div className="bg-slate-50 p-3 sm:p-4 rounded-lg border border-slate-200">
           <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
             File Name
           </label>
           <div className="flex items-center space-x-2">
             <div className="relative flex-grow">
                <input 
                  type="text" 
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  className="w-full px-4 py-2 pr-16 bg-white border border-slate-300 rounded-md text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-mono text-sm"
                  placeholder="Enter filename"
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-slate-400 text-sm font-semibold tracking-wide bg-slate-50 pl-2 border-l border-slate-200 h-2/3 flex items-center">
                    .json
                  </span>
                </span>
             </div>
           </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-gray-100">
          <Button 
            onClick={handleDownload} 
            variant="primary" 
            icon={<Download className="w-4 h-4" />}
            className="flex-1"
          >
            Download JSON
          </Button>

          {onBackToReview && (
            <Button 
              onClick={onBackToReview} 
              variant="outline" 
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Back to Review
            </Button>
          )}

          <Button 
            onClick={onReset} 
            variant="outline" 
            icon={<RefreshCcw className="w-4 h-4" />}
          >
            Create New
          </Button>
        </div>
      </div>
    </Card>
  );
};