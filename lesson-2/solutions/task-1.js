class TimersManager {
  constructor() {
    this.timers = [];
    this.timersRef = [];
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
      let timer = setTimeout(job, delay, ...arg);
      let timerR = { name, fn: timer };

      this.timersRef.push(timerR);
    }
  }

  start() {
    this.timers.forEach((timer) => this.createTimer(timer));
  }

  stop() {
    this.timersRef.forEach((timer) => this.clearTimer(timer.fn));
  }

  pause(id) {
    this.timersRef.forEach((timer) => {
      if (timer.name === id) {
        this.clearTimer(timer.fn);
      }
    });
  }

  resume(timer) {
    const t = this.timers.find((e) => {
      if (e.name === timer) {
        this.createTimer(e);
      }
    });
  }
  remove(id) {
    const removeFromList = this.timers.filter((timer) => timer.name !== id);
    this.timers = removeFromList;

    this.timersRef.forEach((timer) => {
      if (timer.name === id) {
        this.clearTimer(timer.fn);
      }
    });
  }
}
const manager = new TimersManager();

const t1 = {
  name: 't1',
  delay: 1000,
  interval: false,
  job: () => {
    console.log('t1');
  },
};
const t2 = {
  name: 't2',
  delay: 1000,
  interval: false,
  job: (a, b) => console.log(a + b),
};
manager.add(t1);
manager.add(t1);
manager.add(t1);
manager.add(t1);
manager.add(t1);

// manager.add(t1);

manager.add(t2, 1, 2);

manager.start();
// manager.remove('t2');
// manager.start();

// manager.stop();

// console.log(1);
manager.pause('t1');
manager.resume('t1');
