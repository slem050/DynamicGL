/**
 * Time window configuration for live data
 */
export interface TimeWindowConfig {
  windowMs: number;
  now?: number;
}

/**
 * Time window manager for sliding window data
 */
export class TimeWindow {
  private windowMs: number;
  private now: number;

  constructor(config: TimeWindowConfig) {
    this.windowMs = config.windowMs;
    this.now = config.now ?? Date.now();
  }

  /**
   * Update the current time
   */
  update(now?: number): void {
    this.now = now ?? Date.now();
  }

  /**
   * Get the start of the time window
   */
  getStart(): number {
    return this.now - this.windowMs;
  }

  /**
   * Get the end of the time window (current time)
   */
  getEnd(): number {
    return this.now;
  }

  /**
   * Get the window range [start, end]
   */
  getRange(): [number, number] {
    return [this.getStart(), this.getEnd()];
  }

  /**
   * Check if a timestamp is within the window
   */
  contains(timestamp: number): boolean {
    return timestamp >= this.getStart() && timestamp <= this.getEnd();
  }

  /**
   * Update the window size
   */
  setWindowMs(windowMs: number): void {
    this.windowMs = windowMs;
  }

  /**
   * Get the window size in milliseconds
   */
  getWindowMs(): number {
    return this.windowMs;
  }
}

