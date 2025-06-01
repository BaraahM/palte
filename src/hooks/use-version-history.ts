'use client';

import { useCallback, useState } from 'react';

import { useEditorRef } from '@udecode/plate/react';

export interface Version {
  id: string;
  content: any;
  date: Date;
  isCurrent: boolean;
  name: string;
}

export function useVersionHistory() {
  const editor = useEditorRef();

  const [versions, setVersions] = useState<Version[]>([
    {
      id: '1',
      content: [{ children: [{ text: 'Welcome to your editor!' }], type: 'p' }],
      date: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      isCurrent: false,
      name: 'Initial version',
    },
    {
      id: '2',
      content: [],
      date: new Date(),
      isCurrent: true,
      name: 'Current version',
    },
  ]);

  const currentVersion = versions.find(v => v.isCurrent);

  const handleSaveNewVersion = useCallback(() => {
    const currentContent = editor?.children || [];
    const newVersion: Version = {
      id: Date.now().toString(),
      content: JSON.parse(JSON.stringify(currentContent)), 
      date: new Date(),
      isCurrent: true,
      name: `Version ${new Date().toLocaleDateString()}`,
    };

    setVersions(prev => [...prev.map(v => ({ ...v, isCurrent: false })), newVersion]);
  }, [editor]);

  const handleVersionSelect = useCallback((version: Version) => {
    // Before switching, save the current editor state to the current version
    if (editor?.children) {
      setVersions(prev => prev.map(v => {
        if (v.isCurrent) {
          // Save current editor content before switching
          return { ...v, content: JSON.parse(JSON.stringify(editor.children)), isCurrent: false };
        }
        return { ...v, isCurrent: v.id === version.id };
      }));
    } else {
      setVersions(prev => prev.map(v => ({ ...v, isCurrent: v.id === version.id })));
    }

    // Load the version content into the editor
    if (editor && version.content) {
      // For current version, use its saved content, or default if empty
      let contentToLoad = version.content;
      if (version.name === 'default version' && (!version.content || version.content.length === 0)) {
        contentToLoad = getDefaultContent();
      }

      // Ensure contentToLoad is a valid array
      const validContent = Array.isArray(contentToLoad) && contentToLoad.length > 0 
        ? contentToLoad 
        : [{ children: [{ text: '' }], type: 'p' }];

      try {
        editor.children = validContent;
        if (typeof editor.normalize === 'function') {
          editor.normalize({ force: true });
        }
        if (typeof editor.onChange === 'function') {
          // Call onChange without parameters - it reads from editor.children
          editor.onChange(validContent);
        }
      } catch (error) {
        console.error('Error loading version content:', error);
        // Fallback to default content on error
        const fallbackContent = [{ children: [{ text: '' }], type: 'p' }];
        try {
          editor.children = fallbackContent;
          if (typeof editor.onChange === 'function') {
            editor.onChange(validContent);
          }
        } catch (fallbackError) {
          console.error('Error with fallback content:', fallbackError);
        }
      }
    }
  }, [editor]);

  const handleDeleteVersion = useCallback((versionId: string) => {
    setVersions(prev => {
      const filtered = prev.filter(v => v.id !== versionId);
      if (filtered.length === 0) {
        // If all versions deleted, create a new default one
        return [{
          id: Date.now().toString(),
          content: [{ children: [{ text: '' }], type: 'p' }],
          date: new Date(),
          isCurrent: true,
          name: 'New version',
        }];
      }
      // If current version was deleted, make the first one current
      const hasCurrentVersion = filtered.some(v => v.isCurrent);
      if (!hasCurrentVersion) {
        filtered[0].isCurrent = true;
      }
      return filtered;
    });
  }, []);

  const handleRenameVersion = useCallback((versionId: string, newName: string) => {
    setVersions(prev => prev.map(v => 
      v.id === versionId ? { ...v, name: newName } : v
    ));
  }, []);

  return {
    currentVersion,
    versions,
    handleDeleteVersion,
    handleRenameVersion,
    handleSaveNewVersion,
    handleVersionSelect,
  };
}

// Helper function to get default content
function getDefaultContent() {
  return [
    {
      children: [{ text: "Co-Founders' Agreement" }],
      type: 'h1',
    },
    {
      children: [{ text: '1. Roles and Responsibilities' }],
      type: 'h1',
    },
    {
      children: [{ text: '1.1 Flexible Roles' }],
      type: 'h2',
    },
    {
      children: [
        {
          text: 'The Co-Founders acknowledge and agree that the roles and responsibilities within the Company will be dynamic and subject to change as the business evolves. Each Co-Founder commits to adapting their role as necessary for the benefit of the Company.',
        },
      ],
      type: 'p',
    },
    {
      children: [{ text: '1.2 Initial Role Allocation' }],
      type: 'h2',
    },
    {
      children: [
        {
          text: 'Notwithstanding the flexible nature of the roles, the initial primary responsibilities of each Co-Founder shall be as follows:',
        },
      ],
      type: 'p',
    },
    {
      children: [
        {
          text: 'Co-Founder 1: [DESCRIPTION OF INITIAL RESPONSIBILITIES]',
        },
      ],
      type: 'p',
    },
    {
      children: [
        {
          text: 'Co-Founder 2: [DESCRIPTION OF INITIAL RESPONSIBILITIES]',
        },
      ],
      type: 'p',
    },
    {
      children: [
        {
          text: 'Co-Founder 3: [DESCRIPTION OF INITIAL RESPONSIBILITIES]',
        },
      ],
      type: 'p',
    },
    {
      children: [{ text: '1.3 Duty to Company Success' }],
      type: 'h2',
    },
    {
      children: [
        {
          text: 'Each Co-Founder hereby affirms and agrees that their primary and overriding obligation shall be to promote and ensure the success of the Company. This obligation shall take precedence over individual interests or preferences in all business-related decisions and actions.',
        },
      ],
      type: 'p',
    },
    {
      children: [{ text: '2. Equity Distribution' }],
      type: 'h1',
    },
    {
      children: [{ text: '2.1 Initial Equity' }],
      type: 'h2',
    },
  ];
}