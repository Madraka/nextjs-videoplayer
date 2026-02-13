'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Keyboard } from 'lucide-react';

const shortcuts = [
  { key: 'Space / K', description: 'Play/Pause' },
  { key: 'F', description: 'Toggle Fullscreen' },
  { key: 'M', description: 'Toggle Mute' },
  { key: 'I', description: 'Toggle Picture-in-Picture' },
  { key: 'T', description: 'Toggle Theater Mode' },
  { key: '←', description: 'Rewind 10 seconds' },
  { key: '→', description: 'Forward 10 seconds' },
  { key: '↑', description: 'Volume up' },
  { key: '↓', description: 'Volume down' },
  { key: '0', description: 'Go to beginning' },
  { key: '1-9', description: 'Go to 10%-90% of video' },
];

export const KeyboardShortcuts: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full text-white hover:bg-white/10 active:bg-white/20 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none touch-manipulation"
        >
          <Keyboard className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex justify-between items-center py-1">
              <span className="text-sm text-muted-foreground">{shortcut.description}</span>
              <kbd className="px-2 py-1 text-xs bg-muted rounded font-mono">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
