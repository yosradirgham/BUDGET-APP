
const d = new Date();
const months = ['January','Febuary','Martch','April','May','June','July','August','September','October','November','December'];

/*function getMonthString(d){
	return months[d.getMonth()]
} */
//document.querySelector('#date').textContent = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;

//Add weather + location + user Name


//create a table with 2 indexes: one for the incomes and another one the expenses
//when the user enters a positive amount of money we increment the incomes
//when the user enters a negative amount of money we increment the expenses
//when the income or expenses are equal to 0 => shouldn't be displayed

let arr = [0,0];
let getIncome = arr[0];
let getExpenses = arr[1];
//document.querySelector('.income-value').textContent;
//let getExpenses = document.querySelector('.expenses-value').textContent;


//available budget in ${month}
document.querySelector('#budget-title').textContent = `Available budget in ${months[d.getMonth()]}`;

//Month budget:
//document.querySelector('.income-value').textContent = arr[1];
//document.querySelector('.expenses-value').textContent = arr[0];
document.querySelector('#budget').textContent = '-0.00';

