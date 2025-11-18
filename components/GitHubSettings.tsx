import React, { useState } from 'react';
import { GitHubConfig } from '../types';
import { Button } from './ui/Button';
import { validateGitHubToken } from '../services/githubService';
import { Github, Lock, CheckCircle, AlertCircle } from 'lucide-react';

interface GitHubSettingsProps {
  config: GitHubConfig | null;
  onSave: (config: GitHubConfig) => void;
  onClear: () => void;
}

export const GitHubSettings: React.FC<GitHubSettingsProps> = ({ config, onSave, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempConfig, setTempConfig] = useState<GitHubConfig>({
    token: '',
    owner: '',
    repo: ''
  });
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setError(null);
    if (!tempConfig.token || !tempConfig.owner || !tempConfig.repo) {
      setError("Please fill in all fields.");
      return;
    }

    setIsValidating(true);
    const isValid = await validateGitHubToken(tempConfig.token);
    setIsValidating(false);

    if (isValid) {
      onSave(tempConfig);
      setIsOpen(false);
    } else {
      setError("Invalid Personal Access Token. Please check your permissions.");
    }
  };

  if (config) {
    return (
      <div className="flex items-center justify-between bg-gray-900 text-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex items-center">
          <Github className="w-6 h-6 mr-3" />
          <div>
            <p className="font-medium">Connected to GitHub</p>
            <p className="text-xs text-gray-400">{config.owner}/{config.repo}</p>
          </div>
        </div>
        <Button variant="outline" onClick={onClear} className="text-xs h-8 px-3 bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <>
      {!isOpen ? (
        <Button 
            variant="secondary" 
            className="w-full mb-6 flex items-center justify-center"
            onClick={() => setIsOpen(true)}
            icon={<Github className="w-4 h-4" />}
        >
          Connect GitHub Repository
        </Button>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-gray-700 flex items-center">
                    <Github className="w-4 h-4 mr-2" /> 
                    GitHub Integration
                </h4>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 text-sm">Cancel</button>
            </div>
            
            <div className="space-y-3">
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Personal Access Token</label>
                    <div className="relative">
                        <input 
                            type="password" 
                            value={tempConfig.token}
                            onChange={(e) => setTempConfig({...tempConfig, token: e.target.value})}
                            placeholder="ghp_..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <Lock className="w-3 h-3 text-gray-400 absolute right-3 top-3" />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                        Token needs <code>repo</code> scope. 
                        <a href="https://github.com/settings/tokens" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline ml-1">Generate here</a>
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Owner (User/Org)</label>
                        <input 
                            type="text" 
                            value={tempConfig.owner}
                            onChange={(e) => setTempConfig({...tempConfig, owner: e.target.value})}
                            placeholder="e.g., facebook"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Repository Name</label>
                        <input 
                            type="text" 
                            value={tempConfig.repo}
                            onChange={(e) => setTempConfig({...tempConfig, repo: e.target.value})}
                            placeholder="e.g., react"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                    </div>
                </div>

                {error && (
                    <div className="flex items-center text-xs text-red-600 bg-red-50 p-2 rounded">
                        <AlertCircle className="w-3 h-3 mr-2" />
                        {error}
                    </div>
                )}

                <Button 
                    onClick={handleSave} 
                    isLoading={isValidating}
                    className="w-full"
                >
                    Connect Repository
                </Button>
            </div>
        </div>
      )}
    </>
  );
};