const targb='targetbtn';
document.getElementById(targb).addEventListener("click", cli);
document.getElementById("chbtn").addEventListener("click", chText);


const t='***********  Button fired ************ : ';
function cli(){
	let btn = document.getElementById(targb);
	let bt;
	if (btn) bt=btn.value;
	console.log(t);
	// Update status to let user know options were reset.
	let status = document.getElementById('status');
	status.innerHTML = '<div align="right" style="color: red; font-weight: bold;">'+t+bt+'</div>';
	setTimeout(function() {
	  status.innerHTML = '';
	}, 5000);
}
   
   
const TA=['Start','Stop','Next','Play'];
let TAPOS=0;

function chText(){
	let btn = document.getElementById('targetbtn');
	if (btn) {
	 TAPOS++;
	 if (TAPOS >= TA.length) TAPOS=0;
	 btn.value=TA[TAPOS];
	 btn.innerHTML = btn.value;
	}
}
