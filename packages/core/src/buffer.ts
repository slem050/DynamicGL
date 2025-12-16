/**
 * Fixed-size ring buffer for efficient data streaming
 */
export class RingBuffer<T> {
  private buffer: T[];
  private capacity: number;
  private head: number;
  private size: number;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.buffer = new Array(capacity);
    this.head = 0;
    this.size = 0;
  }

  /**
   * Add an item to the buffer (overwrites oldest if full)
   */
  push(item: T): void {
    this.buffer[this.head] = item;
    this.head = (this.head + 1) % this.capacity;
    if (this.size < this.capacity) {
      this.size++;
    }
  }

  /**
   * Get item at index (0 = oldest, size-1 = newest)
   */
  get(index: number): T | undefined {
    if (index < 0 || index >= this.size) {
      return undefined;
    }
    const actualIndex = (this.head - this.size + index + this.capacity) % this.capacity;
    return this.buffer[actualIndex];
  }

  /**
   * Get all items in order (oldest to newest)
   */
  toArray(): T[] {
    const result: T[] = [];
    for (let i = 0; i < this.size; i++) {
      result.push(this.get(i)!);
    }
    return result;
  }

  /**
   * Clear the buffer
   */
  clear(): void {
    this.head = 0;
    this.size = 0;
  }

  /**
   * Get current size
   */
  getSize(): number {
    return this.size;
  }

  /**
   * Check if buffer is full
   */
  isFull(): boolean {
    return this.size === this.capacity;
  }

  /**
   * Get capacity
   */
  getCapacity(): number {
    return this.capacity;
  }
}

