
/*		TO-DO List		*/
/*
	1. code does what it's supposed to do but is so messy => need to clean it up
	2. add style to it
	3. improve the UX
	4. add authentification 
*/	


var budgetController = (function(){
	
	var Income = function(id, description, value){
		this.id          = id;
		this.description = description;
		this.value       = value;
	};


	var Expense = function(id, description, value){
		this.id          = id;
		this.description = description;
		this.value       = value;
		this.percentage  = '--';
	};

	
	// Our data structure
	var budget = {
		allItems : {
			exp : [],
			inc : [] 
		},

		totalItems : {
			exp : 0,
			inc : 0
		},

		totBudget : 0,
		percentage : '--'
	};


	// Calculate the percentage of each Expence instance
	Expense.prototype.calculatePercentage = function(budget){
		return budget.totalItems.inc > 0 ? this.percentage = `${Math.round(this.value/budget.totalItems.inc*100)}%` : this.percentage = '--';
	};


	// Get the percentage of rach Expence instance
	var getPercentage = function(){
		return this.percentage;
	};



	// Updates the budget after an Item has been deleted
	var newValues = function(budget){
		var totalInc = 0, totalExp =0;
		
		budget.allItems.inc.forEach(x => totalInc += x.value);
		budget.allItems.exp.forEach(x => totalExp += x.value);
		budget.totalItems.exp = totalExp;
		budget.totalItems.inc = totalInc;
		budget.totalItems.inc-budget.totalItems.exp > 0 ? budget.totBudget = budget.totalItems.inc-budget.totalItems.exp : budget.totBudget = 0;	
		
		return budget;
	};



	var deleteItem = function(budget, id, type){
		var value, index;
		budget.allItems[type].forEach(x => {
			if(x.id === id){
				index = budget.allItems[type].indexOf(x);
				budget.allItems[type].splice(index,1);
			}
		});
		return budget;
	};


	// Get the budget, income and expenses when the user first enters an item
	var getTotals = function(budget, type, value){
		var difference;
		type === 'inc' ? budget.totalItems.inc += value : budget.totalItems.exp += value;
		difference = budget.totalItems.inc-budget.totalItems.exp;
		difference < 0 ? budget.totBudget = 0 : budget.totBudget = difference;
		budget.totBudget > 0 ? budget.percentage = `${Math.round(budget.totalItems.exp/(budget.totalItems.inc)*100,2)}%` : budget.percentage = '--';
		
		return budget;	
	};



	return {

		getInputExpInc : function(type, desc, val){
			var newItem, id;
			budget.allItems[type] == 'undefined' ? id = 0 : id = budget.allItems[type].length;
		
			type === 'inc'? newItem = new Income(id, desc, val) : newItem = new Expense(id, desc, val);

			budget.allItems[type].push(newItem);
			return newItem;
		},

		getBudgetObj : function(){
			return budget;
		},

		getTotalExpInc : function(budget, type, value){
			return getTotals(budget, type, value);
		},

		deleteItem : function(budget, id, type){
			return deleteItem(budget, id, type);
		},

		updateBudget : function(budget){
			return newValues(budget);
		},

		getPerc : function(budget){
			budget.allItems.exp.forEach(x => x.getPercentage());
		},
		
		calculatePercentage : function(budget){
			return Expense.prototype.calculatePercentage(budget); 
		
		}
	};

})();



var UIController = (function(){
	
	// html elements
	var DOMStrings = {
		inputSign   : '.select',
		inputItem   : '.enter__Item',
		inputMoney  : '.enter__value',
		inputBtn    : '.enter__budget__btn',
		incomeList  : '.inc__list',
		expensesList: '.exp__list',
		budget      : '.budget',
		income      : '.income__value',
		expenses    : '.expenses__value',
		container   : '.container',
		percentage  : '.item__percentage'	
	};



	var getDOMStrings = function(){	
		return DOMStrings;
	};



	// Return input data on the UI
	var getInputData = function(){
		return{
			sign : document.querySelector(DOMStrings.inputSign).value,
			item : document.querySelector(DOMStrings.inputItem).value,
			money: parseFloat(document.querySelector(DOMStrings.inputMoney).value)
		};
	};



	// Add input data to the UI
	var addListItem = function(obj, type){
		var html, newHTML, element;

		// Create HTML string with a placeholder text
		type === 'inc' ? html = '<div id="inc__item__%id%"><div class="inc__item"><div class="item__description">%description%</div><div class="item__value">%value%</div><button class="delete__item"><img src="delete-Icon.png" width="20"></button></div></div>' : html = '<div id="exp__item__%id%"><div class="exp__item"><div class="item__description">%description%</div><div class="item__value">%value%</div><div class="item__percentage">%percentage%</div><button class="delete__item"><img src="delete-Icon.png" width="20"></button></div></div>';
		type === 'inc' ? element = DOMStrings.incomeList : element = DOMStrings.expensesList;

		// Replace the placeholder text with some actual data
		newHTML = html.replace('%id%',obj.id);
		newHTML = newHTML.replace('%description%',obj.description);
		newHTML = newHTML.replace('%value%',parseInt(obj.value));

		// Insert the HTML into the DOM
		document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
	};



	// Clear input field on our web page once the user enter his data and hits the approval button
	var clearFields = function(){
		var fields;
		fields = document.querySelectorAll(`${DOMStrings.inputItem},${DOMStrings.inputMoney}`);
		Array.from(fields).forEach( x => x.value = "");
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
		},

		clearInputFields : function(){
			return clearFields();
		}

	}

})();




var controller = (function(budgetCtrl, UICtrl){
	var UIDomStrings = UIController.getDomStrings();


	// Event handlers
	var setUpEventListeners = function(){		
		document.querySelector(UIDomStrings.inputBtn).addEventListener('click',ctrlAddItem);

		document.addEventListener('keypress', function(event){if(event.keyCode === 13 || event.which === 13) ctrlAddItem();});//using which proprety for old browsers

		document.querySelector(UIDomStrings.container).addEventListener('click', ctrlDeleteItem);// Event handler for the delete button that is associated to each one of our items listed on our web page

	};



	// Calculate the budget
	var calculateBudget = function(input){
		var budgetObj,budget;
		budgetObj =	budgetCtrl.getBudgetObj();
		budget    = budgetCtrl.getTotalExpInc(budgetObj, input.sign, input.money);
		return budget;
	};


	// Display calculated budget
	var displayBudget = function(obj){
		document.querySelector(UIDomStrings.budget).textContent   = obj.totBudget;
		document.querySelector(UIDomStrings.income).textContent   = obj.totalItems.inc;
		document.querySelector(UIDomStrings.expenses).textContent = obj.totalItems.exp;
	};

	
	// For each Expense instance calculate its corresponding percentage
	var calcPercentage = function(){
		var obj;
		obj = budgetCtrl.getBudgetObj();
		obj.allItems.exp.forEach(x => x.percentage = x.calculatePercentage(obj));
		return obj;
	};



	var ctrlAddItem = function(){
		var input, item, budget, percentage;
		
		input = UICtrl.inputDataPublic();	//1. get input data

		if(input.item != "" && !isNaN(input.money) && input.money > 0){
		
			item = budgetCtrl.getInputExpInc(input.sign,input.item,input.money);	//2.Add the item to the budget controller

			UICtrl.displayItemOnList(item, input.sign);		//3. Add item to the user interface 

			UIController.clearInputFields();	//4. clear input fields

			budget = calculateBudget(input);	//5. calculate the budget 	

			displayBudget(budget);		//6. display the budget	

			percentage = calcPercentage();		//7. display exepenses percentages

		}
	};



	// Calculate new budget after the user had deleted an item
	var calculateNewBudget = function(obj){
		var newBudget;
		newBudget = budgetCtrl.updateBudget(obj);
		return newBudget;		
	};



	var ctrlDeleteItem = function(event){
		
		if(event.target.parentNode.className == 'delete__item'){
			var item, identifier, obj, type, updatedItem, budget;

			item = event.target.parentNode.parentNode.parentNode.id;// 1. fetch Item, id and the type
			identifier = parseInt(item.slice(11,14));
			type = item.slice(0,3);

			if(item) document.getElementById(item).remove();	//2. Delete the element from the UI

			obj = budgetCtrl.getBudgetObj();	//3. Delete the element from the data structure
			updatedItem = budgetCtrl.deleteItem(obj, identifier, type);

			budget = calculateNewBudget(updatedItem);	//4. update budget and display it

			displayBudget(budget);   //5. Display the new budget
		}
	};	


	
	return {
		init : function(){
			setUpEventListeners();
			document.querySelector(UIDomStrings.budget).textContent = 0;
			document.querySelector(UIDomStrings.income).textContent = 0;
			document.querySelector(UIDomStrings.expenses).textContent = 0;
		}
	};

})(budgetController, UIController);

controller.init();
