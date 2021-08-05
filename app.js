'use strict';

// UI selectors
const balance = document.querySelector('#balance');
const money_plus = document.querySelector('#money-plus');
const money_minus = document.querySelector('#money-minus');
const list = document.querySelector('#list');
const text = document.querySelector('#text');
const amount = document.querySelector('#amount');
const form = document.querySelector('#form');
const btn = document.querySelector('.btn');

/*const dummyTransaction = [
  { id: 1, text: 'Flower', amount: -20 },
  { id: 2, text: 'Salary', amount: 300 },
  { id: 3, text: 'Book', amount: -10 },
  { id: 4, text: 'Camera', amount: 150 },
  { id: 5, text: 'Shopping', amount: -100 },
  { id: 6, text: 'Wage', amount: 220 },
];*/

const localStorageTransaction = JSON.parse(
  localStorage.getItem('transactions')
);

let transactions =
  localStorage.getItem('transactions') !== null ? localStorageTransaction : [];

/* FUNCTIONS */

const addTransaction = (e) => {
  e.preventDefault();
  //validation
  if (text.value == '' || amount.value == '') {
    return;
  } else {
    const transaction = {
      id: generateRandomID(),
      text: text.value,
      amount: +amount.value,
    };

    //console.log(transaction);

    transactions.push(transaction);

    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();
    // clear inputs
    text.value = '';
    amount.value = '';
    text.focus();
  }
};

// Add transaction to DOM list
const addTransactionDOM = (transaction) => {
  // get sign - or +
  const sign = transaction.amount < 0 ? '-' : '+';
  // add class based on value
  const li = document.createElement('li');
  li.classList.add(transaction.amount < 0 ? 'minus' : 'plus', 'backInLeft');

  li.innerHTML = `
   ${transaction.text} <span>${sign}${Math.abs(transaction.amount)} €</span>
  <button class="delete-btn" onClick="removeTransaction(${transaction.id})">
    <i class="fas fa-trash-alt"></i>
  </button>
  `;

  // after added new item to DOM remove class rotateInDownLeft
  li.addEventListener('animationend', () => {
    li.classList.remove('backInLeft');
  });

  list.appendChild(li);
};

// Generate random ID
const generateRandomID = () => {
  return Math.floor(Math.random() * 100000000);
};

const updateValues = () => {
  //only amounts
  const amounts = transactions.map((transaction) => transaction.amount);
  //console.log(amounts);
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  //console.log(total);

  // filter positive amount
  const income = amounts
    .filter((amount) => amount > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  // filter negative amount
  const expense = (
    amounts
      .filter((amount) => amount < 0)
      .reduce((acc, item) => (acc += item), 0) * -1
  ).toFixed(2);

  if (total > 0) {
    balance.classList.add('plus');
    balance.classList.remove('minus');
  } else if (total < 0) {
    balance.classList.add('minus');
    balance.classList.remove('plus');
  } else if (total == 0) {
    balance.classList.remove('plus', 'minus');
  }

  balance.innerText = `${total} €`;
  money_plus.innerText = `+${income} €`;
  money_minus.innerText = `-${expense} €`;
};

const removeTransaction = (id) => {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  init();
  updateLocalStorage();
};

// update local storage transactions
const updateLocalStorage = () => {
  localStorage.setItem('transactions', JSON.stringify(transactions));
};

// Init app
const init = () => {
  list.innerHTML = '';

  transactions.forEach(addTransactionDOM);
  updateValues();

  text.focus();
};

/* LISTENERS */
window.addEventListener('DOMContentLoaded', init);
form.addEventListener('submit', addTransaction);
