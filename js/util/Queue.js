class Queue {
  constructor() {
    this.state = 0;
    this.queue = [];
  }

  flush() {
    this.queue = [];
  }

  pause() {
    this.flush();
    this.state = 1;
  }

  resume() {
    this.state = 2;
    this.queue.forEach(f => f.call());
    this.state = 0;
  }

  push(f, ...a) {
    this.queue.push(f.bind(this, ...a))
  }

  pass(f, ...a) {
    if(this.state !== 0) this.push(f, ...a); else f(...a);
  }
}