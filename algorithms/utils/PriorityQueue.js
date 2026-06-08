export class PriorityQueue {
  constructor() {
    this.heap = [];
  }

  // Get parent/child index positions
  getParentIndex(i) { return Math.floor((i - 1) / 2); }
  getLeftChildIndex(i) { return 2 * i + 1; }
  getRightChildIndex(i) { return 2 * i + 2; }

  swap(i1, i2) {
    [this.heap[i1], this.heap[i2]] = [this.heap[i2], this.heap[i1]];
  }

  peek() {
    return this.heap[0] ? this.heap[0].element : null;
  }

  size() {
    return this.heap.length;
  }

  // Insert a new item into the queue
  enqueue(element, priority) {
    const node = { element, priority };
    this.heap.push(node);
    this.heapifyUp(this.heap.length - 1);
  }

  // Remove and return the highest priority item
  dequeue() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop().element;

    const root = this.heap[0].element;
    this.heap[0] = this.heap.pop();
    this.heapifyDown(0);
    return root;
  }

  // Move the node up to balance the heap properties
  heapifyUp(index) {
    let current = index;
    while (
      current > 0 && 
      this.heap[current].priority < this.heap[this.getParentIndex(current)].priority
    ) {
      const parent = this.getParentIndex(current);
      this.swap(current, parent);
      current = parent;
    }
  }

  // Move the node down to balance the heap properties
  heapifyDown(index) {
    let current = index;
    while (this.getLeftChildIndex(current) < this.heap.length) {
      let smallerChildIndex = this.getLeftChildIndex(current);
      const rightChildIndex = this.getRightChildIndex(current);

      if (
        rightChildIndex < this.heap.length && 
        this.heap[rightChildIndex].priority < this.heap[smallerChildIndex].priority
      ) {
        smallerChildIndex = rightChildIndex;
      }

      if (this.heap[current].priority <= this.heap[smallerChildIndex].priority) {
        break;
      }

      this.swap(current, smallerChildIndex);
      current = smallerChildIndex;
    }
  }
}
