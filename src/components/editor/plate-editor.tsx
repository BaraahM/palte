'use client';

import * as React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Plate } from '@udecode/plate/react';
import { ArrowLeft, User } from 'lucide-react';

import { useCreateEditor } from '@/components/editor/use-create-editor';
import { Button } from '@/components/ui/button';
import { DocumentOutline } from '@/components/ui/document-outline';
import { Editor, EditorContainer } from '@/components/ui/editor';
import { FixedToolbar } from '@/components/ui/fixed-toolbar';
import { FixedToolbarButtons } from '@/components/ui/fixed-toolbar-buttons';
import { FloatingToolbar } from '@/components/ui/floating-toolbar';
import { FloatingToolbarButtons } from '@/components/ui/floating-toolbar-buttons';

export function PlateEditor() {
  const editor = useCreateEditor();

  return (
    <DndProvider backend={HTML5Backend}>
      <Plate editor={editor}>
        <div className="flex h-screen">
          {/* Sidebar */}
          <div className="w-64 border-r border-border bg-background p-4 overflow-y-auto">
            <DocumentOutline editor={editor} />
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Custom Header */}
            <div className="flex items-center justify-between p-3 border-b border-border bg-background">
              <div className="flex items-center gap-3">
                <Button size="sm" variant="ghost" className="p-1 h-8 w-8">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                Version 05/22/2022 • 11:21 AM
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" className="p-1 h-8 w-8 rounded-full bg-blue-600 text-white hover:bg-blue-700">
                  <User className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Toolbar */}
            <FixedToolbar>
              <FixedToolbarButtons />
            </FixedToolbar>

            {/* Editor */}
            <EditorContainer
              id="scroll_container"
              variant="demo"
              className="max-w-none flex-1"
            >
              <Editor variant="demo" />

              <FloatingToolbar>
                <FloatingToolbarButtons />
              </FloatingToolbar>
            </EditorContainer>
          </div>
        </div>
      </Plate>
    </DndProvider>
  );
}