	
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

		totalBudget : 0
	};

	var getTotal = function(type){
		var i =0, tot=0;
		while(budget.allItems[type][i]){
			tot += budget.allItems[type][i];
			++i;
		}
		return tot;
	}

	return {

		getInputExpInc : function(type, desc, val){
			var newItem;
			var id = budget.allItems[type].length;

			if(type === 'exp') newItem = new Expense(id, desc, val);
			else if (type === 'inc') newItem = new Income(id, desc, val);

			budget.allItems[type].push(newItem);

			return newItem;
		},

		//getBudgetObj : function(type, val){	
			//budget.allItems[type].push(parseInt(val));
			//budget.totalItems[type] = getTotal(type);
			//prk ca n'a pas marché lorsque j'ai mis budget.totalBudget = budget.totalItems[inc]-budget.totalItems[exp];
			//budget.totalBudget = budget.totalItems.inc-budget.totalItems.exp;
			//return budget;
		//},

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
		expensesList: '.exp__list'	
	};

	var getInputData = function(){
		
		return{
			sign : document.querySelector(DOMStrings.inputSign).value,
			item : document.querySelector(DOMStrings.inputItem).value,
			money: document.querySelector(DOMStrings.inputMoney).value
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
		console.log(item);
		console.log(`input sign: ${input.sign}`);
		//3. Add item to the user interface 
		var list = UICtrl.displayItemOnList(item, input.sign);
		console.log(list);
		//5. display the budget	
		//budgetController.getBudgetObj(input.sign,input.money);
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
