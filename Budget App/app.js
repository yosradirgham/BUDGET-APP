
// Budget controller
var budgetController = (function(){

	//update the budget
	//update the income
	//update the expense + percentage

	return{
	};
})();

// User Interface controller
var UIController = (function(){
	
	var DOMStrings = {
		inputSign : '.select',
		inputItem : '.enterItem',
		inputMoney: '.enterMoneySpentOnTheItem',
		inputBtn  : '.enter-budget-btn',
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
			return getDOMStrings();
		}
	}
})();

// Global App Controller
var controller = (function(budgetCtrl, UICtrl){

	var UIDomStrings = UIController.getDomStrings();

	var ctrlAddItem = function(){
		//1. get input data
		UIController.inputDataPublic();
		//2. update the budget, percentage of expenses, income or expenses depending on the sign the user entered
		//3. display calculated data
		//4. add the item to the UI		
	};	

	document.querySelector(UIDomStrings.inputBtn).addEventListener('click',ctrlAddItem);

	document.addEventListener('keypress', function(e){
		if(e.keyCode === 13){
			ctrlAddItem();
		}
	});


})(budgetController, UIController);
