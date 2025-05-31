
'use client';

import * as React from 'react';

import type { SlateEditor } from '@udecode/plate';

import { HEADING_KEYS, isHeading } from '@udecode/plate-heading';
import { useEditorSelector } from '@udecode/plate/react';

import { cn } from '@/lib/utils';

interface DocumentOutlineProps {
  editor: SlateEditor;
}

interface HeadingItem {
  id: string;
  level: number;
  path: number[];
  title: string;
}

function getHeadingList(editor: SlateEditor): HeadingItem[] {
  const headings: HeadingItem[] = [];
  
  const nodes = editor.children || [];
  
  nodes.forEach((node, index) => {
    if (isHeading(node)) {
      const headingKeys = Object.values(HEADING_KEYS);
      const level = headingKeys.indexOf(node.type as string) + 1;
      const title = node.children?.map((child: any) => child.text || '').join('') || '';
      
      if (title.trim()) {
        headings.push({
          id: `heading-${index}`,
          level,
          path: [index],
          title: title.trim(),
        });
      }
    }
  });
  
  return headings;
}

export function DocumentOutline({ editor }: DocumentOutlineProps) {
  const headingList = useEditorSelector(
    (editor) => getHeadingList(editor),
    [editor]
  );

  const scrollToHeading = (path: number[]) => {
    const element = document.querySelector(`[data-slate-node="element"][data-slate-path="${path.join(',')}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-1">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Document Outline</h3>
      
      {headingList.length > 0 ? (
        <div className="space-y-1">
          {headingList.map((heading) => (
            <button
              key={heading.id}
              className={cn(
                'w-full text-left text-sm hover:bg-accent hover:text-accent-foreground rounded-sm px-2 py-1.5 transition-colors',
                heading.level === 1 && 'font-medium',
                heading.level === 2 && 'pl-4 text-muted-foreground',
                heading.level === 3 && 'pl-6 text-muted-foreground',
                heading.level >= 4 && 'pl-8 text-muted-foreground'
              )}
              onClick={() => scrollToHeading(heading.path)}
            >
              {heading.level === 1 ? `${heading.title}` : `• ${heading.title}`}
            </button>
          ))}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">
          No headings found. Add headings to see the document outline.
        </div>
      )}
    </div>
);
}
