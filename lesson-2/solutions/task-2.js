class TimersManager {
  constructor() {
    this.timers = [];
    this.timersRef = [];
    this.logers = [];
  }

  checkDataValidity(timer) {
    const { name, delay, interval, job } = timer;
    const isValidName = typeof name === 'string';
    const isValidDelay = typeof delay === 'number' && delay > 0 && delay < 5000;
    const isValidInterval = typeof interval === 'boolean';
    const isValidJob = typeof job === 'function';

    if (isValidName && isValidDelay && isValidInterval && isValidJob)
      return timer;
    else console.log('the data in the timer is invalid!');
  }

  add(timer, ...arg) {
    const isValid = this.checkDataValidity(timer);
    console.log('arg', arg);

    if (isValid) {
      const newTimer = { ...isValid, arg };
      this.timers.push(newTimer);
    }
  }

  remove() {}

  clearTimer(id) {
    clearTimeout(id);
  }
  createTimer(t) {
    const { name, delay, interval, job, arg } = t;

    if (interval) {
      let timer = setInterval(job, delay, ...arg);

      this.timersRef.push(timer);
    } else {
      let timer = setTimeout(job, delay, this._log, ...arg);
      let timerR = { name, fn: timer };

      this.timersRef.push(timerR);
    }
  }

  createLog(log) {}

  start() {
    this.timers.forEach((timer) => this.createTimer(timer));
  }

  stop() {
    this.timersRef.forEach((timer) => this.clearTimer(timer.fn));
  }

  pause(id) {
    this.timersRef.forEach((timer) => {
      if (timer.name === id) this.clearTimer(timer.fn);
    });
  }

  resume(timer) {
    const t = this.timers.find((e) => {
      if (e.name === timer) this.createTimer(e);
    });
  }
  remove(id) {
    const removeFromList = this.timers.filter((timer) => timer.name !== id);
    this.timers = removeFromList;

    this.timersRef.forEach((timer) => {
      if (timer.name === id) this.clearTimer(timer.fn);
    });
  }

  _log = (data) => {
    const log = {
      name: data.name,
      in: data.in,
      out: data.out,
      created: Date(),
    };
    this.logers.push(log);
  };

  print() {
    console.log(this.logers);
  }
}
const manager = new TimersManager();

const t1 = {
  name: 't1',
  delay: 1000,
  interval: false,
  job: (cb) => {
    console.log('t1');
    cb();
  },
};
const t2 = {
  name: 't2',
  delay: 1000,
  interval: false,
  job: (cb, a, b) => {
    const result = a + b;
    console.log(result);
    
    const arg = { name: 't2', in: [a, b], out: result ,error:};
    cb(arg);
  },
};

// manager.add(t1);
// manager.add(t1);
// manager.add(t1);
// manager.add(t1);
manager.add(t2, 1, 2);

// manager.add(t1);

// manager.add(t2, 1, 2);

manager.start();

setTimeout(() => {
  manager.print();
}, 2000);
// manager.remove('t2');
// manager.start();

// manager.stop();

// console.log(1);
// manager.pause('t1');
// manager.resume('t1');
