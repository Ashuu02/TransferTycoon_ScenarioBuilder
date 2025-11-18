import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Trash2, Copy, ArrowRight, Edit2, CheckCircle } from 'lucide-react';

interface FormProcessorProps {
  onSuccess: (data: any) => void;
  onReset: () => void;
  initialData?: any;
}

// The specific schema structure required
const INITIAL_DATA = {
  ScenarioName: "",
  PresentIllnessHistory: {
    ReasonForPresentation: "",
    VitalSigns: {
      HeartRate: "",
      BloodPressure: "",
      OxygenSaturation: "",
      Temperature: ""
    }
  },
  ElicitedHistory: {
    PastMedicalHistory: "",
    Allergies: "",
    Medications: "",
    Labs: "",
    Imagings: ""
  },
  InterventionsAndRecommendations: {
    WhatHasBeenDone: "",
    WhatNeedsToBeDone: ""
  }
};

// --- Helper Components moved OUTSIDE to prevent re-renders and focus loss ---

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">{children}</label>
);

const inputBaseStyles = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-200 placeholder-slate-400 outline-none";

const Input = ({ 
  value, 
  onChange, 
  placeholder,
  suffix
}: { 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  placeholder?: string;
  suffix?: string;
}) => (
  <div className="relative">
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`${inputBaseStyles} ${suffix ? 'pr-16' : ''}`}
    />
    {suffix && (
      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
        <span className="text-slate-400 text-sm font-semibold tracking-wide bg-slate-50 pl-2 border-l border-slate-100 h-2/3 flex items-center">
          {suffix}
        </span>
      </div>
    )}
  </div>
);

const TextArea = ({ 
  value, 
  onChange, 
  placeholder,
  rows = 2
}: { 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; 
  placeholder?: string;
  rows?: number;
}) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    rows={rows}
    className={inputBaseStyles}
  />
);

const ReviewItem = ({ label, value }: { label: string, value: string }) => (
  <div className="mb-4 last:mb-0">
    <dt className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">{label}</dt>
    <dd className="text-sm text-slate-800 font-medium bg-slate-50 p-3 rounded-lg border border-slate-100">
      {value || <span className="text-slate-400 italic">Not specified</span>}
    </dd>
  </div>
);

// --- Main Component ---

export const FormProcessor: React.FC<FormProcessorProps> = ({ onSuccess, initialData }) => {
  // If initialData is provided (coming back from review), use it and start in review mode
  const [formData, setFormData] = useState(() => {
    if (initialData) {
      // Convert back from generated format (with units) to form format (without units)
      const data = JSON.parse(JSON.stringify(initialData));
      const vitals = data.PresentIllnessHistory?.VitalSigns;
      if (vitals) {
        // Remove units from vitals
        if (vitals.HeartRate) vitals.HeartRate = vitals.HeartRate.replace(' bpm', '');
        if (vitals.BloodPressure) vitals.BloodPressure = vitals.BloodPressure.replace(' mmHg', '');
        if (vitals.OxygenSaturation) vitals.OxygenSaturation = vitals.OxygenSaturation.replace('%', '');
        if (vitals.Temperature) vitals.Temperature = vitals.Temperature.replace(' C', '');
      }
      return data;
    }
    return JSON.parse(JSON.stringify(INITIAL_DATA));
  });
  const [isReviewing, setIsReviewing] = useState(!!initialData);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Helper to update nested state
  const handleChange = (section: string, field: string, value: string, subSection?: string) => {
    setFormData((prev: any) => {
      const newState = { ...prev };
      if (subSection) {
        newState[section][subSection][field] = value;
      } else if (section === 'root') {
        newState[field] = value;
      } else {
        newState[section][field] = value;
      }
      return newState;
    });
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  // Specialized handler for vital signs to restrict input
  const handleVitalChange = (field: string, value: string, allowedChars: RegExp) => {
    // Remove any characters that don't match the allowed regex
    // This prevents letters from being typed
    const filteredValue = value.split('').filter(char => allowedChars.test(char)).join('');
    handleChange('PresentIllnessHistory', field, filteredValue, 'VitalSigns');
  };

  // Validation function to check if all required fields are filled
  const validateForm = (): boolean => {
    const errors: string[] = [];
    
    if (!formData.ScenarioName?.trim()) {
      errors.push('Scenario Name is required');
    }
    if (!formData.PresentIllnessHistory?.ReasonForPresentation?.trim()) {
      errors.push('Reason for Presentation is required');
    }
    if (!formData.ElicitedHistory?.PastMedicalHistory?.trim()) {
      errors.push('Past Medical History is required');
    }
    if (!formData.ElicitedHistory?.Allergies?.trim()) {
      errors.push('Allergies is required (enter "None" if no allergies)');
    }
    if (!formData.ElicitedHistory?.Medications?.trim()) {
      errors.push('Medications is required (enter "None" if no medications)');
    }
    if (!formData.ElicitedHistory?.Labs?.trim()) {
      errors.push('Labs is required');
    }
    if (!formData.ElicitedHistory?.Imagings?.trim()) {
      errors.push('Imaging Results is required');
    }
    if (!formData.InterventionsAndRecommendations?.WhatHasBeenDone?.trim()) {
      errors.push('What Has Been Done is required');
    }
    if (!formData.InterventionsAndRecommendations?.WhatNeedsToBeDone?.trim()) {
      errors.push('What Needs To Be Done is required');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleReview = () => {
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsReviewing(true);
  };

  const handleBackToEdit = () => {
    setIsReviewing(false);
  };

  const handleGenerate = () => {
    // Validate again before generating
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    // Create a deep copy to modify for final output
    const finalData = JSON.parse(JSON.stringify(formData));
    const vitals = finalData.PresentIllnessHistory.VitalSigns;

    // Append units if values exist
    if (vitals.HeartRate) vitals.HeartRate = `${vitals.HeartRate} bpm`;
    if (vitals.BloodPressure) vitals.BloodPressure = `${vitals.BloodPressure} mmHg`;
    if (vitals.OxygenSaturation) vitals.OxygenSaturation = `${vitals.OxygenSaturation}%`;
    if (vitals.Temperature) vitals.Temperature = `${vitals.Temperature} C`;

    onSuccess(finalData);
  };

  const loadSample = () => {
    setFormData({
      "ScenarioName": "Chest Pain Emergency",
      "PresentIllnessHistory": {
        "ReasonForPresentation": "Sudden severe chest pain, shortness of breath.",
        "VitalSigns": {
          "HeartRate": "110",
          "BloodPressure": "140/90",
          "OxygenSaturation": "92",
          "Temperature": "37.3"
        }
      },
      "ElicitedHistory": {
        "PastMedicalHistory": "Hypertension, Hyperlipidemia",
        "Allergies": "Penicillin",
        "Medications": "Aspirin, Atorvastatin",
        "Labs": "Troponin elevated, ECG abnormal",
        "Imagings": "Chest X-ray normal, ECG shows ST elevation"
      },
      "InterventionsAndRecommendations": {
        "WhatHasBeenDone": "Oxygen started, Aspirin given",
        "WhatNeedsToBeDone": "Immediate cardiac consult, Blood draw for further labs"
      }
    });
  };

  const clearForm = () => {
    setFormData(JSON.parse(JSON.stringify(INITIAL_DATA)));
    setIsReviewing(false);
  };

  if (isReviewing) {
    const vitals = formData.PresentIllnessHistory.VitalSigns;
    
    return (
      <Card title="Confirm Scenario Details" description="Please review the details below before generating the file.">
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
          
          {/* Review: Scenario Name */}
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 flex items-center">
                <span className="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs sm:text-sm mr-2 sm:mr-3">1</span>
                Scenario Overview
             </h3>
             <ReviewItem label="Scenario Name" value={formData.ScenarioName} />
          </div>

          {/* Review: Clinical Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 flex items-center">
                    <span className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs sm:text-sm mr-2 sm:mr-3">2</span>
                    Present Illness & Vitals
                </h3>
                <div className="space-y-4">
                    <ReviewItem label="Reason for Presentation" value={formData.PresentIllnessHistory.ReasonForPresentation} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                        <ReviewItem 
                          label="Heart Rate" 
                          value={vitals.HeartRate ? `${vitals.HeartRate} bpm` : ''} 
                        />
                        <ReviewItem 
                          label="BP" 
                          value={vitals.BloodPressure ? `${vitals.BloodPressure} mmHg` : ''} 
                        />
                        <ReviewItem 
                          label="O2 Sat" 
                          value={vitals.OxygenSaturation ? `${vitals.OxygenSaturation}%` : ''} 
                        />
                        <ReviewItem 
                          label="Temp" 
                          value={vitals.Temperature ? `${vitals.Temperature} C` : ''} 
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 flex items-center">
                    <span className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs sm:text-sm mr-2 sm:mr-3">3</span>
                    History & Labs
                </h3>
                <div className="space-y-4">
                    <ReviewItem label="Past History" value={formData.ElicitedHistory.PastMedicalHistory} />
                    <ReviewItem label="Allergies" value={formData.ElicitedHistory.Allergies} />
                    <ReviewItem label="Medications" value={formData.ElicitedHistory.Medications} />
                    <ReviewItem label="Labs" value={formData.ElicitedHistory.Labs} />
                    <ReviewItem label="Imagings" value={formData.ElicitedHistory.Imagings} />
                </div>
            </div>
          </div>

          {/* Review: Recommendations */}
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 flex items-center">
                <span className="w-7 h-7 sm:w-8 sm:h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs sm:text-sm mr-2 sm:mr-3">4</span>
                Interventions
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <ReviewItem label="Has Been Done" value={formData.InterventionsAndRecommendations.WhatHasBeenDone} />
                <ReviewItem label="Needs To Be Done" value={formData.InterventionsAndRecommendations.WhatNeedsToBeDone} />
             </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
            <Button 
                onClick={handleBackToEdit} 
                variant="outline"
                className="w-full sm:w-auto"
                icon={<Edit2 className="w-4 h-4" />}
            >
                Edit Details
            </Button>
            <Button 
                onClick={handleGenerate} 
                variant="primary"
                className="w-full sm:w-auto px-8"
                icon={<CheckCircle className="w-4 h-4" />}
            >
                Confirm & Generate JSON
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card title="1. Clinical Scenario Details" description="Fill out the form below to generate the scenario JSON.">
      <div className="space-y-8 animate-in fade-in">
        
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-2 sm:space-x-2">
             <button 
            onClick={loadSample}
            className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center justify-center bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors font-medium w-full sm:w-auto"
          >
            <Copy className="w-3.5 h-3.5 mr-1.5" />
            Fill Sample
          </button>
          <button 
            onClick={clearForm}
            className="text-sm text-slate-500 hover:text-red-600 flex items-center justify-center bg-slate-50 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors font-medium w-full sm:w-auto"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Clear
          </button>
        </div>

        {/* Scenario Name */}
        <div className="bg-slate-50/50 p-4 sm:p-5 rounded-2xl border border-slate-100">
          <Label>Scenario Name</Label>
          <Input 
            value={formData.ScenarioName}
            onChange={(e) => handleChange('root', 'ScenarioName', e.target.value)}
            placeholder="e.g., Chest Pain Emergency"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            
            {/* Left Column: Present Illness & Vitals */}
            <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
                    <div className="w-2 h-6 bg-indigo-500 rounded-full"></div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-800">Present Illness History</h3>
                </div>
                
                <div>
                    <Label>Reason for Presentation</Label>
                    <TextArea 
                        value={formData.PresentIllnessHistory.ReasonForPresentation}
                        onChange={(e) => handleChange('PresentIllnessHistory', 'ReasonForPresentation', e.target.value)}
                        placeholder="Describe the main complaint..."
                        rows={3}
                    />
                </div>

                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <h4 className="text-sm font-semibold text-slate-700 mb-4 flex items-center">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                        Vital Signs
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label>Heart Rate</Label>
                            <Input 
                                value={formData.PresentIllnessHistory.VitalSigns.HeartRate}
                                onChange={(e) => handleVitalChange('HeartRate', e.target.value, /^[0-9]*$/)}
                                placeholder="e.g. 110"
                                suffix="bpm"
                            />
                        </div>
                        <div>
                            <Label>Blood Pressure</Label>
                            <Input 
                                value={formData.PresentIllnessHistory.VitalSigns.BloodPressure}
                                onChange={(e) => handleVitalChange('BloodPressure', e.target.value, /^[0-9/]*$/)}
                                placeholder="e.g. 140/90"
                                suffix="mmHg"
                            />
                        </div>
                        <div>
                            <Label>O2 Saturation</Label>
                            <Input 
                                value={formData.PresentIllnessHistory.VitalSigns.OxygenSaturation}
                                onChange={(e) => handleVitalChange('OxygenSaturation', e.target.value, /^[0-9]*$/)}
                                placeholder="e.g. 92"
                                suffix="%"
                            />
                        </div>
                        <div>
                            <Label>Temperature</Label>
                            <Input 
                                value={formData.PresentIllnessHistory.VitalSigns.Temperature}
                                onChange={(e) => handleVitalChange('Temperature', e.target.value, /^[0-9.]*$/)}
                                placeholder="e.g. 37.3"
                                suffix="C"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Elicited History */}
            <div className="space-y-4 sm:space-y-6">
                 <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
                    <div className="w-2 h-6 bg-purple-500 rounded-full"></div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-800">Elicited History</h3>
                </div>
                
                <div>
                    <Label>Past Medical History</Label>
                    <TextArea 
                        value={formData.ElicitedHistory.PastMedicalHistory}
                        onChange={(e) => handleChange('ElicitedHistory', 'PastMedicalHistory', e.target.value)}
                        placeholder="Previous conditions..."
                    />
                </div>
                
                <div>
                    <Label>Allergies</Label>
                    <Input 
                        value={formData.ElicitedHistory.Allergies}
                        onChange={(e) => handleChange('ElicitedHistory', 'Allergies', e.target.value)}
                        placeholder="e.g. Penicillin"
                    />
                </div>

                <div>
                    <Label>Medications</Label>
                    <Input 
                        value={formData.ElicitedHistory.Medications}
                        onChange={(e) => handleChange('ElicitedHistory', 'Medications', e.target.value)}
                        placeholder="Current medications..."
                    />
                </div>

                <div>
                    <Label>Labs</Label>
                    <TextArea 
                        value={formData.ElicitedHistory.Labs}
                        onChange={(e) => handleChange('ElicitedHistory', 'Labs', e.target.value)}
                        placeholder="Relevant lab results..."
                    />
                </div>

                <div>
                    <Label>Imaging Results</Label>
                    <TextArea 
                        value={formData.ElicitedHistory.Imagings}
                        onChange={(e) => handleChange('ElicitedHistory', 'Imagings', e.target.value)}
                        placeholder="X-rays, CT scans, etc..."
                    />
                </div>
            </div>
        </div>

        {/* Bottom Section: Recommendations */}
        <div className="space-y-4 sm:space-y-6 pt-4 sm:pt-6 border-t border-slate-100">
             <div className="flex items-center space-x-2">
                <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
                <h3 className="text-base sm:text-lg font-bold text-slate-800">Interventions & Recommendations</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-emerald-50/30 p-4 rounded-2xl border border-emerald-100/50">
                    <Label>What Has Been Done</Label>
                    <TextArea 
                        value={formData.InterventionsAndRecommendations.WhatHasBeenDone}
                        onChange={(e) => handleChange('InterventionsAndRecommendations', 'WhatHasBeenDone', e.target.value)}
                        placeholder="Initial actions taken..."
                        rows={3}
                    />
                </div>
                <div className="bg-blue-50/30 p-4 rounded-2xl border border-blue-100/50">
                    <Label>What Needs To Be Done</Label>
                    <TextArea 
                        value={formData.InterventionsAndRecommendations.WhatNeedsToBeDone}
                        onChange={(e) => handleChange('InterventionsAndRecommendations', 'WhatNeedsToBeDone', e.target.value)}
                        placeholder="Next steps..."
                        rows={3}
                    />
                </div>
             </div>
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
            <h4 className="text-sm font-semibold text-red-900 flex items-center">
              <span className="w-5 h-5 bg-red-200 rounded-full flex items-center justify-center text-red-700 text-xs mr-2">!</span>
              Please fill in all required fields:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-red-800 ml-7">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-8 flex justify-end">
             <Button 
              onClick={handleReview} 
              icon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto px-8 py-3 text-base shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              Review Details
            </Button>
        </div>
      </div>
    </Card>
  );
};