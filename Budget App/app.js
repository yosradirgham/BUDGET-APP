	
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
			exp : [],
			inc : []
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
		getBudgetObj : function(type, val){	
			budget.allItems[type].push(parseInt(val));
			budget.totalItems[type] = getTotal(type);
			//prk ca n'a pas marché lorsque j'ai mis budget.totalBudget = budget.totalItems[inc]-budget.totalItems[exp];
			budget.totalBudget = budget.totalItems.inc-budget.totalItems.exp;
			return budget;
		},

		getInputExpInc : function(type, desc, val){
			var id = 0;
			if(type === 'exp') return new Expense(id, desc, val);
			else if (type === 'inc') return new Income(id, desc, val);
		},

	};

})();


// User Interface controller
var UIController = (function(){
	
	var DOMStrings = {

		inputSign : '.select',
		inputItem : '.enterItem',
		inputMoney: '.enterMoneySpentOnTheItem',
		inputBtn  : '.enter-budget-btn'
	
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

	return {
		inputDataPublic : function(){ 
			return getInputData();
		},
		
		getDomStrings : function(){ 
			return getDOMStrings();
		}
	}

})();


// Global App Controller
var controller = (function(budgetCtrl, UICtrl){

	var ctrlAddItem = function(){
		UIController.inputDataPublic();
		var type = UIController.inputDataPublic().sign;
		var desc = UIController.inputDataPublic().item;
		var val  = UIController.inputDataPublic().money;
		budgetController.getInputExpInc(type, desc, val);
		budgetController.getBudgetObj(type, val);
	};	

	//a function where all of our event listeners will be placed
	var setUpEventListeners = function(){
		var UIDomStrings = UIController.getDomStrings();
		
		document.querySelector(UIDomStrings.inputBtn).addEventListener('click',ctrlAddItem);
		
		document.addEventListener('keypress', function(e){
			//using which proprety for old browsers
			if(e.keyCode === 13 || e.which === 13) ctrlAddItem();
		});
	};

	//1. get input data
	
	//2. update the budget, percentage of expenses, income or expenses depending on the sign the user entered

	//3. display calculated data

	//4. add the item to the UI	
	
	return {

		init : function(){
			setUpEventListeners();
		}

	};

})(budgetController, UIController);

controller.init();
