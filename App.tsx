import React, { useState } from 'react';
import { FormProcessor } from './components/FormProcessor';
import { JsonResult } from './components/JsonResult';
import { FileCode, Info } from 'lucide-react';

const App: React.FC = () => {
  const [generatedData, setGeneratedData] = useState<any | null>(null);
  const [formDataForReview, setFormDataForReview] = useState<any | null>(null);

  const handleBackToReview = () => {
    // Store the generated data as form data and go back to review
    setFormDataForReview(generatedData);
    setGeneratedData(null);
  };

  const handleGenerate = (data: any) => {
    setGeneratedData(data);
    setFormDataForReview(null);
  };

  const handleReset = () => {
    setGeneratedData(null);
    setFormDataForReview(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="bg-indigo-600 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
              <FileCode className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <h1 className="text-sm sm:text-xl font-bold text-slate-900 tracking-tight truncate">TransferTycoon Scenario Builder</h1>
          </div>
          <div className="hidden sm:flex items-center text-sm text-gray-500 flex-shrink-0">
            <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-medium text-xs">
                Clinical JSON Generator
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* Introduction */}
        <div className="text-center space-y-2 mb-6 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Create Clinical Scenario</h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto px-2">
            Fill out the clinical details below to instantly generate a standardized JSON file for the simulation platform.
          </p>
        </div>

        {/* Workflow Steps */}
        {!generatedData ? (
          <div className="animate-in fade-in duration-500">
            <FormProcessor 
                onSuccess={handleGenerate} 
                onReset={handleReset}
                initialData={formDataForReview}
            />
          </div>
        ) : (
          <JsonResult 
            data={generatedData} 
            onReset={handleReset}
            onBackToReview={handleBackToReview}
          />
        )}

        {/* Help Footer */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
            <div className="bg-blue-50 rounded-xl p-4 sm:p-6 flex items-start space-x-3 sm:space-x-4">
                <Info className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0 mt-0.5 sm:mt-1" />
                <div className="space-y-2 min-w-0">
                    <h4 className="text-sm sm:text-base font-semibold text-blue-900">Workflow</h4>
                    <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">
                        1. <strong>Fill:</strong> Enter the patient history, vitals, and recommendations.<br/>
                        2. <strong>Review:</strong> Confirm all details are correct in the preview step.<br/>
                        3. <strong>Download:</strong> Name your file and download the JSON.
                    </p>
                </div>
            </div>
        </div>

      </main>
    </div>
  );
};

export default App;