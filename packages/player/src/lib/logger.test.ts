import { afterEach, describe, expect, it, vi } from 'vitest';

import { createConsoleLogger, getPlayerLogger, setPlayerLogger } from '@/lib/logger';

describe('logger', () => {
  afterEach(() => {
    setPlayerLogger(null);
    vi.restoreAllMocks();
  });

  it('supports configurable console logger levels', () => {
    const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => undefined);
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => undefined);
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const logger = createConsoleLogger({ debug: true, info: false, warn: true, error: true });

    logger.debug('d');
    logger.info('i');
    logger.warn('w');
    logger.error('e');

    expect(debugSpy).toHaveBeenCalledTimes(1);
    expect(infoSpy).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });

  it('allows overriding and resetting global logger', () => {
    const warnFn = vi.fn();
    setPlayerLogger({ warn: warnFn });
    getPlayerLogger().warn('test');
    expect(warnFn).toHaveBeenCalledWith('test');

    setPlayerLogger(null);
    expect(getPlayerLogger().warn).not.toBe(warnFn);
  });
});
