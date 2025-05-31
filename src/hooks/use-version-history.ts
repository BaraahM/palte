
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
    setVersions(prev => prev.map(v => ({ ...v, isCurrent: v.id === version.id })));
    
    // Load the version content into the editor
    if (editor && version.content) {
      try {
        editor.children = version.content;
        if (typeof editor.normalize === 'function') {
          editor.normalize({ force: true });
        }
        if (typeof editor.onChange === 'function') {
          editor.onChange();
        }
      } catch (error) {
        console.error('Error loading version content:', error);
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