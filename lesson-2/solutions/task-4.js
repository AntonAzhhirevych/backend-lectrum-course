class TimersManager {
  constructor() {
    this.timers = [];
    this.timersRef = [];
    this.logers = [];
  }

  // methods for checks

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

  checkForUniqueness(timerId) {
    const { name } = timerId;
    const isUnique = this.timers.find((timer) => timer.name === name);
    if (!isUnique) return true;
    else console.log('timer has already been added!');
  }

  checkTaskQueue() {
    const taskQueue = this.timersRef.length;
    if (!taskQueue) return true;
    else console.log('you cannot use add method after start method!');
  }

  //
  clearTimer(id) {
    clearTimeout(id);
  }

  createTimer(timer) {
    const { name, delay, interval, job, arg } = timer;

    if (interval) {
      let timerId = setInterval(this._log, delay, job, name, ...arg);

      this.timersRef.push(timerId);
    } else {
      let timerId = setTimeout(this._log, delay, job, name, ...arg);
      let timerRef = { timerName: name, timerId };

      this.timersRef.push(timerRef);
    }
  }

  clearTimersQueue() {
    let longestTimer = 0;
    this.timers.forEach(({ delay }) => {
      if (longestTimer < delay) longestTimer = delay;
    });

    setTimeout(() => {
      this.timers = [];
    }, longestTimer + 10000);
  }
  //
  add(timer, ...arg) {
    const isValid = this.checkDataValidity(timer);

    const isUnique = this.checkForUniqueness(timer);

    const taskQueue = this.checkTaskQueue();

    if (isValid && isUnique && taskQueue) {
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
  //
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
  job: () => 't1',
};
const t2 = {
  name: 't2',
  delay: 1000,
  interval: false,
  job: (a, b) => a + b,
};

const t3 = {
  name: 't3',
  delay: 4000,
  interval: false,
  job: () => {
    throw new Error('We have a problem!');
  },
};

manager.add(t1);
manager.add(t3, 1, 6);
manager.add(t1);
manager.add(t2, 1, 2);
manager.start();

//

//
setTimeout(() => {
  manager.print();
}, 5000);
//
manager.clearTimersQueue();

//other methods
// manager.remove('t1');
// manager.pause('t1');
// manager.resume('t1');
// manager.stop();
