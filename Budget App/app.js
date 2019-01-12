	
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

	var getNewTotal = function(budget){
		var tot = 0, tot1=0;
		
		for(let i in budget.allItems.inc){
			tot += budget.allItems.inc.i.value;
		}
		budget.totalItems.inc = tot;

		for(let i of budget.allItems.exp){
			tot1 += budget.allItems.exp[i].value;
		}
		budget.totalItems.exp = tot1;

		budget.totBudget = getTotalIncomes(budget)-getTotalExpenses(budget);

		budget.totBudget > 0 ? budget.percentage = `${Math.round(budget.totalItems.exp/(budget.totBudget)*100,2)}%` : budget.percentage = '--';
	};

	var getTotals = function(budget, type, value){
		var difference;
		type === 'inc' ? budget.totalItems.inc += value : budget.totalItems.exp += value;
		difference = budget.totalItems.inc-budget.totalItems.exp;
		difference < 0 ? budget.totBudget = 0 : budget.totBudget = difference;
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

		getNewTotal : function(budget){
			return getNewTotal(budget);
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
		type === 'inc' ? html = '<div id="inc__item__%id%"><div class="item__description">%description%</div><div class="item__value">%value%</div><button class="item__delete__item"><img src="delete-Icon.png" width="20"></button></div>' : html = '<div id="exp__item__%id%"><div class="item__description">%description%</div><div class="item__value">%value%</div><div class="item__percentage">%percentage%</div><button class="item__delete__item"><img src="delete-Icon.png" width="20"></button></div>';
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

	var ctrlDeleteItem = function(event){
		var item, identifier, obj, type, index;

		//1. Fetch the Id, type corresponding to out target element
		item = event.target.parentNode.parentNode.id;
		identifier = item.slice(11,14);
		type = item.slice(0,3);

		//2. Delete the element from the UI
		if(item){
			document.getElementById(item).remove();
		}

		//3. Delete the element from the data structure
		obj = budgetCtrl.getBudgetObj();

		obj.allItems[type].forEach(x => {
			if(x.id == identifier){

				index = obj.allItems[type].indexOf(x);

				obj.allItems[type].splice(index, 1);

			}
		});

		//4. Update the budget and ( Income Or Expenses)
/* 
	Not working
 	should update the budget
 */		
		budgetCtrl.getNewTotal(obj);

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
