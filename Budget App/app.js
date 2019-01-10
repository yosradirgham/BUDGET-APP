	
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

		getInputExpInc : function(type, desc, val){
			var newItem;
			var id = budget.allItems[type].length;

			if(type === 'exp') newItem = new Expense(id, desc, val);
			else if (type === 'inc') newItem = new Income(id, desc, val);

			budget.allItems[type].push(newItem);

			return newItem;
		},

		getBudgetObj : function(type, val){	
			budget.allItems[type].push(parseInt(val));
			budget.totalItems[type] = getTotal(type);
			//prk ca n'a pas marché lorsque j'ai mis budget.totalBudget = budget.totalItems[inc]-budget.totalItems[exp];
			budget.totalBudget = budget.totalItems.inc-budget.totalItems.exp;
			return budget;
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
		
		//1. get input data
		var input = UIController.inputDataPublic();
		
		//2.Add the item to the budget controller
		budgetController.getInputExpInc(input.sign,input.item,input.money);


		//3. Add item to the user interface 

		//5. display the budget	
		budgetController.getBudgetObj(input.sign,input.money);
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

	
	return {

		init : function(){
			setUpEventListeners();
		}

	};

})(budgetController, UIController);

controller.init();
