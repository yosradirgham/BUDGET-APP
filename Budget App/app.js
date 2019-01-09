
// Budget controller
var budgetController = (function(){

	var DOMStrings = {

	};

	var getDOMStrings = function(){
		return DOMStrings;
	};
	//update the budget
	//update the income
	//update the expense + percentage

	return{
		getDomStrings : function(){
			getDOMStrings();
		},
	};
})();

// User Interface controller
var UIController = (function(){
	
	var DOMStrings = {
		inputSign : '.select',
		inputItem : '.enterItem',
		inputMoney: '.enterMoneySpentOnTheItem'
	};

	//get input data
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

	//add lists of incomes and expenses

	return {
		inputDataPublic : function(){
			console.log(getInputData());
		},

		getDomStrings : function(){
			getDOMStrings();
		}
	}
})();

// Global App Controller
var controller = (function(budgetCtrl, UICtrl){

	var UIDomStrings = UIController.getDomStrings();
	var budgetDomStrings = budgetController.getDomStrings();

	var ctrlAddItem = function(){
		//1. get input data
		UIController.inputDataPublic();
		//2. update the budget, percentage of expenses, income or expenses depending on the sign the user entered
		//3. display calculated data
		//4. add the item to the UI		
	};	

	//set up the event listener for the input button 
	document.querySelector('.enter-budget-btn').addEventListener('click',ctrlAddItem);
	
	//5. we want this to happen when the user hits the enter button, but also when he hits the enter key (on the keyboard)
	document.addEventListener('keypress', function(e){
		if(e.keyCode === 13){
			ctrlAddItem();
		}
	});


})(budgetController, UIController);
