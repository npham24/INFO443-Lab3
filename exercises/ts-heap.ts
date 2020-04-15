// from: https://github.com/alex3165/ts-pq
// if you want to use priorty queue in your assignment

// user import {PriorityQueue} from "./ts-heap"

export interface Node {
    timestamp: number;
  }
  
export type Tuple<T> = [T, number];
  
export class PriorityQueue<T extends Node> {
  heap: Tuple<T>[] = [];

  constructor() {}

  insert(val: T, priority: number) {
    if (!this.heap.length || this.heap[this.heap.length - 1][1] > priority) {
      this.heap.push([val, priority]);
      return this.heap;
    }

    const tmp: Tuple<T>[] = [];
    let found = false;

    for (let i = 0; i < this.heap.length; i++) {
      const p = this.heap[i][1];

      if (priority >= p && !found) {
        tmp.push([val, priority]);
        found = true;
      }

      tmp.push(this.heap[i]);
    }

    return (this.heap = tmp);
  }

  has({ timestamp }: T) {
    const foundNode = this.heap.find(([val]) => val.timestamp === timestamp);

    return !!foundNode;
  }

  get({ timestamp }: T) {
    const foundNode = this.heap.find(([val]) => val.timestamp === timestamp);

    return foundNode && foundNode[0];
  }

  shift(priority: boolean) {
    const tuple = this.heap.shift();
    if (priority) {
      return tuple;
    }

    return tuple ? tuple[0] : undefined;
  }

  pop() {
    const tuple = this.heap.pop();
    return tuple ? tuple[0] : undefined;
  }

  priorities() {
    return this.heap.map(([_, p]) => p);
  }

  values() {
    return this.heap.map(([val]) => val);
  }

  size() {
    return this.heap.length;
  }

  toArray(values: boolean) {
    if (values) {
      return this.heap.map(([val]) => val);
    }
    return this.heap;
  }
}