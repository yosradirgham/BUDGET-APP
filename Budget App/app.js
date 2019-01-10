	
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


	var budgetObj = {
		allItems : {
			exp : [],
			inc : []
		},

		totalItems : {
			totalExp : 0,
			totalInc : 0
		},

		budget : 0
	};

	return {
		getBudgetObj : function(){
			return budgetObj;
		},

		getExpense : function(){
			return new Expense();
		},

		getIncome : function(){
			return new Income();
		}
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
			getInputData();
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
