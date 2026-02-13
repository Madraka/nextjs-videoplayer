'use client';

import { useEffect } from 'react';
import { createConsoleLogger, setPlayerLogger } from '@madraka/nextjs-videoplayer';

const DEBUG_ENABLED = process.env.NEXT_PUBLIC_PLAYER_DEBUG_LOGS === 'true';
const INFO_ENABLED = process.env.NEXT_PUBLIC_PLAYER_INFO_LOGS === 'true';

export default function PlayerLoggerBootstrap() {
  useEffect(() => {
    setPlayerLogger(
      createConsoleLogger({
        debug: DEBUG_ENABLED,
        info: INFO_ENABLED,
        warn: true,
        error: true,
      })
    );

    return () => {
      setPlayerLogger(null);
    };
  }, []);

  return null;
}
