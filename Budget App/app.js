	
//update the budget

//update the income

//update the expense + percentage

// Budget controller : keeps track of all the incomes and expenses
var budgetController = (function(){
	var Expense = function(id, description, value){
		this.id          = id;
		this.description = description;
		this.value       = value;
	};

	var Income = function(id, description, value){
		this.id          = id;
		this.description = description;
		this.value       = value;
	};

	var budget = {
		allItems : {
			exp : [],//whose type is Expense(id, desc, val)
			inc : [] //whose type is Income (id, desc, val)
		},

		totalItems : {
			exp : 0,
			inc : 0
		},
	};


	var totalExp=0, totalInc=0, total=0;
	var getTotals = function(budget, type, value){
		if(type === 'inc'){
			console.log(`value: ${value}`);
			budget.totalItems.inc += value;
		}
		else{
			budget.totalItems.exp += value;			
		}
		return budget;
	};



	return {

		getInputExpInc : function(type, desc, val){
			var newItem, id;
			budget.allItems[type] == 'undefined' ? id = 0 : id = budget.allItems[type].length;

			type === 'inc'? newItem = new Income(id, desc, val) : newItem = new Expense(id, desc, val);

			budget.allItems[type].push(newItem);
			console.log(budget.allItems[type]);
			return newItem;
		},

		getBudgetObj : function(){
			return budget;
		},

		getTotalExpInc : function(budget, type, value){
			return getTotals(budget, type, value);
		}


	};

})();


// User Interface controller
var UIController = (function(){
	
	var DOMStrings = {

		inputSign   : '.select',
		inputItem   : '.enterItem',
		inputMoney  : '.enterMoneySpentOnTheItem',
		inputBtn    : '.enter__budget__btn',
		incomeList  : '.inc__list',
		expensesList: '.exp__list',
		budget : '.budget',
		income : '.income__value',
		expenses : '.expenses__value'	
	};

	var getInputData = function(){
		
		return{
			sign : document.querySelector(DOMStrings.inputSign).value,
			item : document.querySelector(DOMStrings.inputItem).value,
			money: parseInt(document.querySelector(DOMStrings.inputMoney).value)
		};

	};

	var getDOMStrings = function(){
		
		return DOMStrings;//return our private DOMStrings so we can use it later on our controller <3
	
	};

	var addListItem = function(obj, type){
		var html, newHTML, element;

		// Create HTML string with a placeholder text
		type === 'inc' ? html = '<div class="inc__item__%id%"><div class="item__description">%description%</div><div class="item__value">%value%</div><button class="item__delete__item"><img src="delete-Icon.png" width="20"></button></div>' : html = '<div class="exp__item__%id%"><div class="item__description">%description%</div><div class="item__value">%value%</div><div class="item__percentage">%percentage%</div><button class="item__delete__item"><img src="delete-Icon.png" width="20"></button></div>';
		type === 'inc' ? element = DOMStrings.incomeList : element = DOMStrings.expensesList;
		//console.log(element);
		//console.log(`obj.value: ${obj.value}`);

		// Replace the placeholder text with some actual data
		newHTML = html.replace('%id%',obj.id);
		newHTML = newHTML.replace('%description%',obj.description);
		newHTML = newHTML.replace('%value%',parseInt(obj.value));

		// Insert the HTML into the DOM
		document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
	};

	return {
		inputDataPublic : function(){ 
			return getInputData();
		},
		
		getDomStrings : function(){ 
			return getDOMStrings();
		},

		displayItemOnList : function(obj,type){
			return addListItem(obj,type);
		}
	}

})();


// Global App Controller
var controller = (function(budgetCtrl, UICtrl){

	var ctrlAddItem = function(){
		var UIDomStrings = UIController.getDomStrings();

		//1. get input data
		/*
		input variabe contains the input data that the user enters, which are : sign, description of the Item, and the value
		*/
		var input = UICtrl.inputDataPublic();
		console.log(input);
		
		//2.Add the item to the budget controller
		/* 
		creates a new item that could either be an income or an expense
		inserts the created Item (object Income/Expense) into budget.allItems[type]
		returns the created Item: variable item holds object budget, with entered data
		*/
		var item = budgetCtrl.getInputExpInc(input.sign,input.item,input.money);
		
		
		//3. Add item to the user interface 
		UICtrl.displayItemOnList(item, input.sign);
		
		
		//4. display the budget	
		var budgetObj =	budgetCtrl.getBudgetObj();
		var budget = budgetCtrl.getTotalExpInc(budgetObj, input.sign, input.money);
		document.querySelector(UIDomStrings.budget).textContent = budget.totalItems.inc - budget.totalItems.exp;
		document.querySelector(UIDomStrings.income).textContent = budget.totalItems.inc;
		document.querySelector(UIDomStrings.expenses).textContent = budget.totalItems.exp;

	};	


	/*
	a function where all of our event listeners will be placed
	*/
	var setUpEventListeners = function(){
		var UIDomStrings = UIController.getDomStrings();
		
		document.querySelector(UIDomStrings.inputBtn).addEventListener('click',ctrlAddItem);
		
		document.addEventListener('keypress', function(e){
			//using which proprety for old browsers
			if(e.keyCode === 13 || e.which === 13) ctrlAddItem();
		});
	};

	
	return {

		init : function(){
			setUpEventListeners();
		}

	};

})(budgetController, UIController);

controller.init();
