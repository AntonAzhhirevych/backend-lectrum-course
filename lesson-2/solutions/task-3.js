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

    if (isValid) {
      const newTimer = { ...isValid, arg };
      this.timers.push(newTimer);
    }
  }

  remove() {
    const removeFromList = this.timers.filter(({ name }) => name !== id);
    this.timers = removeFromList;

    this.timersRef.forEach(({ name, timerId }) => {
      if (name === id) this.clearTimer(timerId);
    });
  }

  clearTimer(id) {
    clearTimeout(id);
  }
  createTimer(timer) {
    const { name, delay, interval, job, arg } = timer;

    if (interval) {
      let timerId = setInterval(job, delay, ...arg);

      this.timersRef.push(timerId);
    } else {
      let timerId = setTimeout(this._log, delay, job, name, ...arg);
      let timerR = { timerName: name, timerId };

      this.timersRef.push(timerR);
    }
  }

  start() {
    this.timers.forEach((timer) => this.createTimer(timer));
  }

  stop() {
    this.timersRef.forEach(({ timerId }) => this.clearTimer(timerId));
  }

  pause(id) {
    this.timersRef.forEach(({ timerName, timerId }) => {
      if (timerName === id) this.clearTimer(timerId);
    });
  }

  resume(name) {
    this.timers.find((timer) => {
      if (timer.name === name) this.createTimer(timer);
    });
  }
  remove(timer) {
    const removeFromList = this.timers.filter(({ name }) => name !== timer);
    this.timers = removeFromList;

    this.timersRef.forEach(({ timerName, timerId }) => {
      if (timerName === timer) this.clearTimer(timerId);
    });
  }

  _log = (fn, name, ...arg) => {
    let resultFnSuccess;
    let resultFnError;

    try {
      resultFnSuccess = fn(...arg);
    } catch (error) {
      const { name, message, stack } = error;
      resultFnError = { name, message, stack };
    }

    let successLog = { name, in: [...arg], out: resultFnSuccess };
    let errorLog = { name, in: [...arg], out: undefined, Error: resultFnError };

    if (resultFnError) this.logers.push(errorLog);
    else this.logers.push(successLog);
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
  job: () => {
    console.log('t1');
  },
};
const t2 = {
  name: 't2',
  delay: 1000,
  interval: false,
  job: (a, b) => {
    const result = a + b;
    return result;
  },
};

const t3 = {
  name: 't3',
  delay: 2000,
  interval: false,
  job: () => {
    throw new Error('We have a problem!');
  },
};

manager.add(t1);
manager.add(t1);
manager.add(t1);

manager.add(t3, 1, 2);

// manager.add(t1);

manager.add(t2, 1, 2);

manager.start();

manager.remove('t1');
// manager.pause('t1');
// manager.resume('t1');

setTimeout(() => {
  manager.print();
}, 2000);
// manager.start();

// manager.stop();

// console.log(1);
