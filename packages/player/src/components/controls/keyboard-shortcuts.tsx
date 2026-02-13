'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
          <Keyboard className="h-4 w-4" />
        </Button>
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
