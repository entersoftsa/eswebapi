// The initialize function must be run each time a new page is loaded
(function(){
	$(document).ready(function () {
		$('#get-data-from-selection').click(getDataFromSelection);
	});
})();


// Reads data from current document selection and displays a notification
function getDataFromSelection() {
	console.log("getDataFromSelection called");
	
}