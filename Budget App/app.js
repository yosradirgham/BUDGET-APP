
// Budget controller
var budgetController = (function(){
	//update the budget
	//update the income
	//update the expense + percentage
})();

// User Interface controller
var UIController = (function(){
	
	//get input data
	function getInputData(){
		return{
			sign : document.querySelector('.select').value,
			item : document.querySelector('.enterItem').value,
			money: document.querySelector('.enterMoneySpentOnTheItem').value
		};
	}

	//add lists of incomes and expenses

	return {
		inputDataPublic : function(){
			console.log(getInputData());
		}
	}
})();

// Global App Controller
var controller = (function(budgetCtrl, UICtrl){

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
