import { GitHubConfig } from '../types';

export const uploadToGitHub = async (
  config: GitHubConfig,
  fileName: string,
  content: object
): Promise<string> => {
  const { token, owner, repo } = config;
  
  if (!token || !owner || !repo) {
    throw new Error("Missing GitHub configuration.");
  }

  const path = `scenarios/${fileName}`;
  const message = `Add form scenario: ${fileName}`;
  const contentBase64 = btoa(JSON.stringify(content, null, 2));

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  try {
    // First, check if file exists to get SHA (if we were updating, but here we prefer creating new)
    // We assume new filenames based on timestamp to avoid collisions for simplicity
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        message,
        content: contentBase64,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to upload to GitHub");
    }

    const data = await response.json();
    return data.content.html_url;
  } catch (error: any) {
    throw new Error(error.message || "Network error connecting to GitHub");
  }
};

export const validateGitHubToken = async (token: string): Promise<boolean> => {
    try {
        const response = await fetch('https://api.github.com/user', {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
            }
        });
        return response.ok;
    } catch (e) {
        return false;
    }
}