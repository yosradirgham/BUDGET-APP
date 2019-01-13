	
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

		totBudget : 0,
		percentage : '--'
	};

	var deleteItem = function(budget, id, type){
		var value, index;
		budget.allItems[type].forEach(x => {
			if(x.id == id){
				index = budget.allItems[type].indexOf(x);
				budget.allItems[type].splice(index,1);
			}
		});
		return budget;
	};

	var getTotals = function(budget, type, value){
		var difference;
		type === 'inc' ? budget.totalItems.inc += value : budget.totalItems.exp += value;
		difference = budget.totalItems.inc-budget.totalItems.exp;
		difference < 0 ? budget.totBudget = 0 : budget.totBudget = difference;
		budget.totBudget > 0 ? budget.percentage = `${Math.round(budget.totalItems.exp/(budget.totBudget)*100,2)}%` : budget.percentage = '--';
		
		return budget;	
	};

	var newValues = function(budget){
		var totalInc = 0, totalExp =0;

		budget.allItems.inc.forEach(x => {
			totalInc += x.value;
		});

		budget.allItems.exp.forEach(x => {
			totalExp += x.value;
		});
	
		budget.totalItems.exp = totalExp;
		budget.totalItems.inc = totalInc;


		budget.totalItems.inc-budget.totalItems.exp > 0 ? budget.totBudget = budget.totalItems.inc-budget.totalItems.exp : budget.totBudget = 0;
	
		budget.totBudget > 0 ? budget.percentage = `${Math.round(budget.totalItems.exp/(budget.totBudget)*100,2)}%` : budget.percentage = '--';

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
		}

	};

})();


// User Interface controller
var UIController = (function(){
	
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
		container   : '.container'	
	};

	var getInputData = function(){
		
		return{
			sign : document.querySelector(DOMStrings.inputSign).value,
			item : document.querySelector(DOMStrings.inputItem).value,
			money: parseFloat(document.querySelector(DOMStrings.inputMoney).value)
		};

	};

	var getDOMStrings = function(){
		
		return DOMStrings;//return our private DOMStrings so we can use it later on our controller <3
	
	};

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
		var fields = document.querySelectorAll(`${DOMStrings.inputItem},${DOMStrings.inputMoney}`); //returns a nodeList
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


// Global App Controller
var controller = (function(budgetCtrl, UICtrl){
	var UIDomStrings = UIController.getDomStrings();

	/*
	a function where all of our event listeners will be placed
	*/
	var setUpEventListeners = function(){		
		document.querySelector(UIDomStrings.inputBtn).addEventListener('click',ctrlAddItem);

		document.addEventListener('keypress', function(event){
			//using which proprety for old browsers
			if(event.keyCode === 13 || event.which === 13) ctrlAddItem();
		});

		// Event handler for the delete button that is associated to each one of our items listed on our web page
		document.querySelector(UIDomStrings.container).addEventListener('click', ctrlDeleteItem);
	};


	var displayBudget = function(input){
		var budgetObj,budget;

		budgetObj =	budgetCtrl.getBudgetObj();
		budget = budgetCtrl.getTotalExpInc(budgetObj, input.sign, input.money);
		
		//DOM manipulation
		document.querySelector(UIDomStrings.budget).textContent = budget.totBudget;//totalItems.inc - budget.totalItems.exp;
		document.querySelector(UIDomStrings.income).textContent = budget.totalItems.inc;
		document.querySelector(UIDomStrings.expenses).textContent = budget.totalItems.exp;
	};


	var ctrlAddItem = function(){
		//1. get input data
		var input = UICtrl.inputDataPublic();

		if(input.item != "" && !isNaN(input.money) && input.money > 0){
		
			//2.Add the item to the budget controller
			var item = budgetCtrl.getInputExpInc(input.sign,input.item,input.money);
			
			
			//3. Add item to the user interface 
			UICtrl.displayItemOnList(item, input.sign);
			
			//4. clear input fields
			UIController.clearInputFields();
			
			//5. display the budget	
			displayBudget(input);	
		}
	};


	var ctrlDisplayNewBudget = function(obj){
		var newBudget;

		newBudget = budgetCtrl.updateBudget(obj);

		//DOM manipulation
		document.querySelector(UIDomStrings.budget).textContent = newBudget.totBudget;//totalItems.inc - budget.totalItems.exp;
		document.querySelector(UIDomStrings.income).textContent = newBudget.totalItems.inc;
		document.querySelector(UIDomStrings.expenses).textContent = newBudget.totalItems.exp;
		
	};

	var ctrlDeleteItem = function(event){
		if(event.target.parentNode.className == 'delete__item'){
			var item, identifier, obj, type, updatedItem;

			//1. Fetch the Id, type corresponding to out target element
			item = event.target.parentNode.parentNode.parentNode.id;//contains the html element inc__item__id or exp__item__id
			identifier = item.slice(11,14);// the id of the item
			type = item.slice(0,3);// the type of the item : exp or inc

			//2. Delete the element from the UI
			if(item){
				document.getElementById(item).remove();
			}

			//3. Delete the element from the data structure
			obj = budgetCtrl.getBudgetObj();
			updatedItem = budgetCtrl.deleteItem(obj, identifier, type);

			//4. update budget and display it
			ctrlDisplayNewBudget(updatedItem);
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
