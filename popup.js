// Initialize button with user's preferred color
const startAction = document.getElementById("startAction");
const stopAction = document.getElementById("stopAction");
let tabid=0;




//chrome.storage.sync.get("color", ({ color }) => {
//  changeColor.style.backgroundColor = color;
//});

async function getCurrentTabID() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  stabid=tab.id;
  chrome.storage.local.set({ stabid });
  return tab;
}

function searchButtonStop() {
	 const RESTTIME_ID='_resttime_';
	 stabid=0;	
	 console.log('action stopPageBackgroundColo');
     chrome.storage.sync.get({button_id:"targetbtn"},function(items){
		 let BUTTON_ID=items.button_id;
		 chrome.storage.sync.set({ stabid: stabid}, () => {
			   let TargetBTN = document.getElementById(BUTTON_ID);
			   if (!TargetBTN) {
				   TargetBTN = document.getElementsByName(BUTTON_ID)[0];
			   }
			   if (!TargetBTN) {
					TargetBTN = document.getElementsByClassName(BUTTON_ID)[0];
				}
			   if (!TargetBTN ) {
				return;
			   }
			   if (TargetBTN) {
				   TargetBTN.style.backgroundColor = "yellow";
				   TargetBTN.removeAttribute("firedelay");
				let dr;
				while( dr = document.getElementById(RESTTIME_ID) ) {
					console.log("RESTTIME_ID for remove:" +dr);
					dr.remove();
				}; 
			   }
		       let OLDT="";
			   let Title = document.getElementsByTagName("title")[0];
			   if (Title) {
				OLDT=Title.getAttribute("ot");
				if (!OLDT) {
					OLDT=document.title;
					Title.setAttribute("ot",OLDT);
				}
			   }
			   document.title="PLUGIN NOT ACTIVE|"+OLDT
		 });
	 });
};

function addTab(value){
 console.log('addTab '+value);
 chrome.storage.sync.get({stabids:[]}, (result) => {
  let arr=result.stabids;
  console.log("arr:"+arr);
  if( arr.indexOf(value) === -1) {
   let stabids = arr.push(value);
   console.log("arr pushe:"+arr);
   chrome.storage.sync.set({ stabids: arr } );
  }
 });
}

function removeTab(value){
 if (!value) return;
 console.log('removeTab '+value);
 chrome.storage.sync.get({ stabids: []}, (result) => {	
  let arr=result.stabids;
  console.log("arr:"+arr);
  arr=arr.filter(item => item !== value);
  chrome.storage.sync.set({ stabids: arr });
});
}

function checkTab(value){
 let res=false;
 console.log('checkTab '+value);
  async () => {
	  let [tab]=await chrome.tabs.query({ index: value });
	  res=(tab.id==value);
  };
 console.log('checkedTab '+value+':'+res);
 return res;
}


//if (startAction) {
// When the button is clicked, inject startAction into current page
	startAction.addEventListener("click", async () => {
	  let [tab]=await chrome.tabs.query({ active: true, currentWindow: true });
	  tabid=tab.id;
	  stabid=tab.id;
	  console.log('addEventListener by startAction tabid:'+tabid);
	  addTab(tabid);  
	  chrome.scripting.executeScript({
	   target: { tabId: tabid },
	   function: () => {
		   let OLDT="";
		   let Title = document.getElementsByTagName("title")[0];
		   if (Title) {
		    OLDT=Title.getAttribute("ot");
		    if (!OLDT) {
				OLDT=document.title;
				Title.setAttribute("ot",OLDT);
			}
		   }
		   document.title="PLUGIN INITED|"+OLDT
		 },
	  //byTimer();
	  });
	});
//};

//if (stopAction) {
// When the button is clicked, inject stopAction into current page
	stopAction.addEventListener("click", async () => {
	  let [tab]=await chrome.tabs.query({ active: true, currentWindow: true });
	  tabid=tab.id;
	  console.log('addEventListener by stopAction tabid:'+tabid);
      removeTab(tabid);
	  chrome.scripting.executeScript({
		target: { tabId: tabid ,  allFrames: true},
		func: searchButtonStop,
	  },
	   (injectionResults) => {
		for (const frameResult of injectionResults) {
		console.log('stopAction result injection: ' + frameResult.result);
		};
	   });
	});
//}









