const EventEmmiter = require('events');

const validationText = {
  send: {
    senderNotFound: 'отправитель не найден',
    recipientNotFound: 'получатель не найден',
    insufficientАunds: 'недостаточно средств на счете у отправителя',
    limit: 'не прошел лимит в оерации send',
  },
  withdraw: {
    incorectAmmount: 'сумма должна быть больше 0',
    contractorNotFound: 'contractor не найден',
    insufficientАunds: 'недостаточно средств на счете',
    limit: 'не прошел лимит в оерации withdraw',
  },
  add: {
    incorectAmmount: 'сумма должна быть больше 0',
    contractorNotFound: 'contractor не найден',
  },
  get: {
    contractorNotFound: 'contractor не найден',
  },
};

class BankValidationMethods extends EventEmmiter {
  constructor() {
    super();
  }

  sendValidation(sender, recipient, ammount) {
    const isValidBalance = sender.balance - ammount < 0;

    if (!sender) {
      this.emit('error', new TypeError(validationText.send.senderNotFound));
      return false;
    }

    if (!recipient) {
      this.emit('error', new TypeError(validationText.send.recipientNotFound));
      return false;
    }

    if (isValidBalance) {
      this.emit('error', new TypeError(validationText.send.insufficientАunds));
      return false;
    }

    return true;
  }

  withdrawValidation(ammount, contractor) {
    const isValidAmmount = ammount < 0;
    const isValidBalance = contractor.balance - ammount < 0;

    if (isValidAmmount) {
      this.emit(
        'error',
        new TypeError(validationText.withdraw.incorectAmmount),
      );
      return false;
    }

    if (!contractor) {
      this.emit(
        'error',
        new TypeError(validationText.withdraw.contractorNotFound),
      );
      return false;
    }

    if (isValidBalance) {
      this.emit(
        'error',
        new TypeError(validationText.withdraw.insufficientАunds),
      );
      return false;
    }
    return true;
  }

  addValidation(ammount, contractor) {
    if (!ammount) {
      this.emit('error', new TypeError(validationText.add.incorectAmmount));
      return false;
    }

    if (!contractor) {
      this.emit('error', new TypeError(validationText.add.contractorNotFound));
      return false;
    }

    return true;
  }

  getValidation(contractor) {
    if (!contractor) {
      this.emit('error', new TypeError(validationText.get.contractorNotFound));
      return false;
    }

    return true;
  }
}

class Bank extends BankValidationMethods {
  constructor() {
    super();
    this.contractors = [];
  }

  createId() {
    return Date.now() * Math.random();
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
  const contractorIndex = this.contractors.findIndex((obj) => obj.id === id);
  const findedContractor = this.contractors[contractorIndex];

  const isValidOperation = addValidation(ammount, findedContractor);

  if (!isValidOperation) return;

  const updatedContractorObj = {
    ...findedContractor,
    balance: findedContractor.balance + ammount,
  };

  const filteredContractorList = this.contractors.filter(
    ({ id }) => id !== updatedContractorObj.id,
  );

  const updatedContractorsList = [
    ...filteredContractorList,
    updatedContractorObj,
  ];

  this.contractors = updatedContractorsList;
});

bank.on('get', function (id, cb) {
  const findedContractor = this.contractors.find(
    ({ id: contractorID }) => contractorID === id,
  );

  const isValidOperation = this.getValidation(findedContractor);
  if (!isValidOperation) return;

  const { balance } = findedContractor;
  return cb(balance);
});

bank.on('withdraw', function (id, ammount) {
  const findedContractor = this.contractors.find((obj) => obj.id === id);

  const isValidOperation = this.withdrawValidation(ammount, findedContractor);

  if (!isValidOperation) return;

  const updatedContractorObj = {
    ...findedContractor,
    balance: findedContractor.balance - ammount,
  };

  //limit validation

  const isValidLimit = updatedContractorObj.limit(
    ammount,
    findedContractor.balance,
    updatedContractorObj.balance,
  );

  if (!isValidLimit)
    return this.emit('error', new TypeError(validationText.withdraw.limit));

  const filteredContractorList = this.contractors.filter(
    ({ id }) => id !== updatedContractorObj.id,
  );

  const updatedContractorsList = [
    ...filteredContractorList,
    updatedContractorObj,
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

bank.on('send', function (firstId, secondId, ammount) {
  const senderContractorData = this.contractors.find(
    (obj) => obj.id === firstId,
  );
  const recipientContractorData = this.contractors.find(
    (obj) => obj.id === secondId,
  );

  const isValidOperation = this.sendValidation(
    senderContractorData,
    recipientContractorData,
    ammount,
  );

  if (!isValidOperation) return;

  const updatedSenderContractorDate = {
    ...senderContractorData,
    balance: senderContractorData.balance - ammount,
  };

  //limit validation

  const isValidLimit = updatedSenderContractorDate.limit(
    ammount,
    senderContractorData.balance,
    updatedSenderContractorDate.balance,
  );

  if (!isValidLimit)
    return this.emit('error', new TypeError(validationText.send.limit));

  const updatedRecipientContractorData = {
    ...recipientContractorData,
    balance: recipientContractorData.balance + ammount,
  };

  const filteredContractorList = this.contractors.filter(
    ({ id }) =>
      id !== senderContractorData.id && id !== recipientContractorData.id,
  );

  const updatedContractorsList = [
    ...filteredContractorList,
    updatedSenderContractorDate,
    updatedRecipientContractorData,
  ];

  this.contractors = updatedContractorsList;
});

bank.on('changeLimit', function (id, cb) {
  const contractorData = this.contractors.find(
    ({ id: contractorId }) => contractorId === id,
  );

  const updatedContractorData = {
    ...contractorData,
    limit: cb,
  };

  const filteredContractorList = this.contractors.filter(
    ({ id }) => id !== updatedContractorData.id,
  );

  const updatedContractorsList = [
    ...filteredContractorList,
    updatedContractorData,
  ];

  this.contractors = updatedContractorsList;
});
