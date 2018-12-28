
const d = new Date();
const months = ['January','Febuary','Martch','April','May','June','July','August','September','October','November','December'];

/*function getMonthString(d){
	return months[d.getMonth()]
} */
document.querySelector('#date').textContent = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;