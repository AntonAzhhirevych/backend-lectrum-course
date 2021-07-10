const EventEmmiter = require('events');

class Bank extends EventEmmiter {
  constructor() {
    super();
    this.contractors = [];
  }

  createId() {
    return Date.now();
  }

  getAllContractors() {
    return this.cotractors;
  }

  register(person) {
    const { balance, name } = person;

    const isValidBalance = balance > 0;
    const alreadyRegistered = this.contractors.find(
      ({ name: contractorsName }) => name === contractorsName,
    );

    if (isValidBalance && !alreadyRegistered) {
      const newContractor = { id: this.createId(), ...person };
      this.contractors.push(newContractor);

      return newContractor.id;
    } else if (alreadyRegistered) {
      this.emit('error', new TypeError('a contractor with this name exists'));
    } else if (!isValidBalance) {
      this.emit('error', new TypeError('invalid amount'));
    }
  }
}

const bank = new Bank();

bank.on('add', function addAmountToRegisterBallance(id, ammount) {
  if (!ammount)
    return bank.emit('error', new TypeError('invalid deposit amount'));

  const contractorIndex = this.contractors.findIndex((obj) => obj.id === id);
  const findedContractor = this.contractors[contractorIndex];

  if (!findedContractor)
    return this.emit(
      'error',
      new TypeError('the contractor with the current id does not exist'),
    );

  const updatedContractorObj = {
    ...findedContractor,
    balance: findedContractor.balance + ammount,
  };

  const updatedContractorsList = [
    ...this.contractors.slice(0, contractorIndex),
    updatedContractorObj,
    ...this.contractors.slice(contractorIndex + 1),
  ];

  this.contractors = updatedContractorsList;
});

bank.on('get', function (id, cb) {
  const findedContractor = this.contractors.find(
    ({ id: contractorID }) => contractorID === id,
  );

  if (!findedContractor) {
    return this.emit(
      'error',
      new TypeError('the contractor with the current id does not exist'),
    );
  }

  const { balance } = findedContractor;
  return cb(balance);
});

bank.on('withdraw', function (id, ammount) {
  if (ammount < 0) {
    return this.emit('error', new TypeError('amount must be greater than 0'));
  }

  const contractorIndex = this.contractors.findIndex((obj) => obj.id === id);
  const findedContractor = this.contractors[contractorIndex];

  if (!findedContractor) {
    return this.emit(
      'error',
      new TypeError('the contractor with the current id does not exist'),
    );
  }

  if (findedContractor.balance - ammount < 0) {
    return this.emit(
      'error',
      new TypeError('insufficient funds in the account'),
    );
  }
  const updatedContractorObj = {
    ...findedContractor,
    balance: findedContractor.balance - ammount,
  };

  const updatedContractorsList = [
    ...this.contractors.slice(0, contractorIndex),
    updatedContractorObj,
    ...this.contractors.slice(contractorIndex + 1),
  ];

  this.contractors = updatedContractorsList;
});

bank.on('error', (error) => {
  if (error.name === 'TypeError') {
    console.error(`Received ${error.name} with a message: '${error.message}'`);
  } else if (error.name === 'Error') {
    console.log('Do some stuff');
  }
});

//operations
const personId = bank.register({
  name: 'Pitter Blacwcwck',
  balance: 100,
});

console.log(personId);

bank.emit('add', personId, 20);

bank.emit('get', personId, (balance) => {
  console.log(`I have ${balance}₴`); // I have 120₴
});

bank.emit('withdraw', personId, 200);

bank.emit('get', personId, (balance) => {
  console.log(`I have ${balance}₴`); // I have 70₴
});
