
'use client';

import { createPlatePlugin } from '@udecode/plate/react';

import { VersionHistoryProvider } from '@/components/editor/version-history-context';
import { FixedToolbar } from '@/components/ui/fixed-toolbar';
import { FixedToolbarButtons } from '@/components/ui/fixed-toolbar-buttons';
import { VersionHistoryButton } from '@/components/ui/version-history-button';

export const FixedToolbarPlugin = createPlatePlugin({
  key: 'fixed-toolbar',
  render: {
    beforeEditable: () => (
      <VersionHistoryProvider>
        <div className="flex flex-col">
        <div className="flex justify-center py-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <VersionHistoryButton />
          </div>
          <FixedToolbar>
            <FixedToolbarButtons />
          </FixedToolbar>
        </div>
      </VersionHistoryProvider>
    ),
  },
});
