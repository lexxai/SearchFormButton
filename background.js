// background.js

//let timeoutID = '';

let count=0;
let BUTTON_ID='targetbtn';
let ADD_BUTTON_TEXT=true;


//let tabid=0;


  


function installAlarms(refresh_time,button_id,add_button_text){
  chrome.alarms.clearAll();	 
  BUTTON_ID = button_id;
  ADD_BUTTON_TEXT=add_button_text;
  console.log("Install alarms refresh_time: "+refresh_time);

  for(let i = 0; i < 60; i=i+refresh_time) {
	  let alarmName="alarmName-"+i;
	  let alarmInfo={
		when : Date.now() + i*1000+1000,
		periodInMinutes : 1 
	  };
	  chrome.alarms.create(alarmName,alarmInfo);
	  console.log("Install alarms: "+alarmName);
  }
}

function  removeAlarms(){
  console.log("All alarms cleared");
  chrome.alarms.clearAll();	  
}

function alarm(id) {
    if (id) byTimer(id);
};


async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}



// The body of this function will be executed as a content script inside the spcesific TAB ID

function searchButtonStart() {
	
  const REMIND_TXT=chrome.i18n.getMessage("plug_REMIND_TXT");
  const NIGTH_TXT='&#127772;';

  const PLUGACT_TXT=chrome.i18n.getMessage("plug_PLUGACT_TXT");
  const PLUGINI_TXT=chrome.i18n.getMessage("plug_PLUGINI_TXT");
  const DELAY_TXT=chrome.i18n.getMessage("plug_DELAY_TXT");

  
  const BUTTON_SEARCH_BY_ID='id';
  const BUTTON_SEARCH_BY_NAME='name';
  const BUTTON_SEARCH_BY_CLASS='class';

  const STEP_FIREDELAY=15;  //seconds
  let MAX_TIME=30;//minutes
  let MIN_TIME=1;//minutes    
  
  let MAX_FIREDELAY=MAX_TIME*60/STEP_FIREDELAY; 
  let MIN_FIREDELAY=MIN_TIME*60/STEP_FIREDELAY; 
  
  let BUTTON_ID='targetbtn';
  let BUTTON_TRIGG='Start';
  let BUTTON_SEARCH_BY='id';
  let ADD_BUTTON_TEXT=true;  
  const RESTTIME_ID='_resttime_';
  let START_MAX_TIME="03:00"
  let END_MAX_TIME="09:00"
  let ACT_MAX_TIME=30;
  let ACT_MAX_TIME_ACTIVATE=false;
  let NIGTH_TIME=false;
  //let resttime;
  
  // FUNC
  

  
  
   function restore_options() {
	  // Use default value color = 'red' and likesColor = true.
	  chrome.storage.sync.get({
		max_time: 10,
		min_time: 1,
		s_max_time: 3,
		e_max_time: 9,
		a_max_time: 30,
		a_max_time_activate: true,
		button_id: 'targetbtn',
		button_trigg: 'Start',
		btnsearch: 'id',
		add_button_text: true
	  }, function(items) {
		 MAX_TIME=parseInt(items.max_time);
		 MIN_TIME=parseInt(items.min_time);
		 MAX_FIREDELAY=MAX_TIME*60/STEP_FIREDELAY;  
         MIN_FIREDELAY=MIN_TIME*60/STEP_FIREDELAY; 
		 BUTTON_ID=items.button_id;
		 BUTTON_TRIGG=items.button_trigg;
		 BUTTON_SEARCH_BY=items.btnsearch;
		 ADD_BUTTON_TEXT=(items.add_button_text != ""); 
		 START_MAX_TIME=items.s_max_time;
		 END_MAX_TIME=items.e_max_time;
		 ACT_MAX_TIME=parseInt(items.a_max_time);
		 ACT_MAX_TIME_ACTIVATE=(items.a_max_time_activate != "");
		 
		 if (ACT_MAX_TIME_ACTIVATE){ 
		 	 let ct=new Date();
			 let cta=ct.getTime();
			 let sd=new Date( Date.parse("1970-01-01 "+START_MAX_TIME) );
			 
			 let sd1=new Date();
			 let sdh=sd.getHours();
			 sd1.setHours(sdh,sd.getMinutes(),0,0);
			 let ed=new Date( Date.parse("1970-01-01 "+END_MAX_TIME) );
			 
			 let ed1=new Date();
			 let edh=ed.getHours();
			 ed1.setHours(edh,ed.getMinutes(),0,0);
			 console.log("Night  ct.getTime()"+cta);
			 console.log("Night sd1.getTime()"+sd1.getTime());
			 console.log("Night ed1.getTime()"+ed1.getTime());

			 if (sd1.getHours() < ed1.getHours()){
				 if (sd1.getTime() > ed1.getTime()) {
					 ed1.setTime( ed1.getTime() + 864000000); //add 24h
					 console.log("Night END Restore_options added 24h");
					 console.log("NighT ed1.getTime()"+ed1.getTime());
				 }
			 }else{
				 if (sd1.getTime() > ed1.getTime()) {
					 sd1.setTime( sd1.getTime() - 864000000); //dec 24h
					 console.log("Night START Restore_options decr 24h");
					 console.log("NighT sd1.getTime()"+sd1.getTime());
				 }
			 }
			 console.log("NighT ( cta > sd1.getTime())"+( cta > sd1.getTime()));
			 console.log("NighT ( cta < ed1.getTime())"+( cta < ed1.getTime()));

			 NIGTH_TIME=(( cta > sd1.getTime()) && ( cta < ed1.getTime()));
			 if (NIGTH_TIME) {
				 console.log("Night Restore_options ACT_MAX_TIME:"+ACT_MAX_TIME);	
				 MAX_TIME=ACT_MAX_TIME;		
	             MAX_FIREDELAY=MAX_TIME*60/STEP_FIREDELAY;  	 
			 }
		 }
         console.log("Restore_options MAX_TIME is :"+MAX_TIME);	 
	 		 
         MAIN_searchButtonStart();		 
	  });
  }
  
  function setTitleActive(clicked){
	let Title = document.getElementsByTagName("title")[0];
	let OLDT=Title.getAttribute("OT");
	if (!OLDT) Title.setAttribute("OT",document.title);
	let d = new Date();
	let n = d.toLocaleTimeString();
	document.title=PLUGACT_TXT+" ["+clicked+"] "+n+"|"+OLDT;
  }
  
  function RetFULL_REMIND_TXT(ldelta){
	let FULL_REMIND_TXT;
	let d=new Date();
	d.setHours(0,0,0,0);
	d.setMilliseconds(ldelta);
    console.log('RetFULL_REMIND_TXT fireButton delay by :'+ d.toLocaleTimeString());
	if (NIGTH_TIME) {
		FULL_REMIND_TXT=NIGTH_TXT+" <i>"+REMIND_TXT+": "+d.toLocaleTimeString()+"</i>";
	}else{
		FULL_REMIND_TXT=" "+REMIND_TXT+": "+d.toLocaleTimeString();
	}
	return FULL_REMIND_TXT;
  }
  
  function fireButton(item){
	if (!item) return;
	const color="green";
	let resttime;
	let fireDelay=item.getAttribute("FireDelay");
	if (!fireDelay){
		let RND=(Math.floor(Math.random() * MAX_FIREDELAY)+MIN_FIREDELAY)
		let mins=RND;
		RND=RND*1000*STEP_FIREDELAY; // 1 ... 10(30) mins
		let delay=Date.now()+RND+5;
		item.setAttribute("FireDelay",delay)
		item.style.backgroundColor = color;
		if (ADD_BUTTON_TEXT) {
			let dr;
			while( dr = document.getElementById(RESTTIME_ID) ) {
		        console.log("RESTTIME_ID for remove:" +dr);
				dr.remove();
			} 
			resttime=document.createElement("span");
			resttime.setAttribute("id",RESTTIME_ID);
			resttime.innerHTML = RetFULL_REMIND_TXT(RND);
			resttime.setAttribute("title",DELAY_TXT);
			item.parentNode.insertBefore(resttime,item.nextSibling); 
		}
	}else{
		resttime=document.getElementById(RESTTIME_ID);
		let delta=fireDelay-Date.now();
		if (delta<=10){
			item.removeAttribute("FireDelay");
			item.click();
			let clicked=parseInt(item.getAttribute("clicked"));
			if (!clicked) clicked=0;
			clicked++; 
			item.setAttribute("clicked",clicked);
            setTitleActive(clicked);
			if (ADD_BUTTON_TEXT && resttime) {
			  resttime.innerHTML="*** FIRE ***";
			  setTimeout(()=>{resttime.remove()},1500);
			}
		}else{
			if (ADD_BUTTON_TEXT && resttime) {
				resttime.innerHTML = RetFULL_REMIND_TXT(delta);
			}else{
				console.log('fireButton by not resttime');

			}	
			
		}
	}
  };	
	


  function MAIN_searchButtonStart(item){
	  let TargetBTN;
	  console.log("MAIN_searchButtonStart BUTTON_SEARCH_BY: "+BUTTON_SEARCH_BY);
	  switch (BUTTON_SEARCH_BY) {
		   case BUTTON_SEARCH_BY_ID:
				TargetBTN = document.getElementById(BUTTON_ID);
		   break;
		   case BUTTON_SEARCH_BY_NAME:
				TargetBTN = document.getElementsByName(BUTTON_ID)[0];
		   break;
		   case BUTTON_SEARCH_BY_CLASS:
				TargetBTN = document.getElementsByClassName(BUTTON_ID)[0];
		   break;		   
		   default: 
				return;
	  }
/* 	  let TargetBTN = document.getElementById(BUTTON_ID);
	  if (!TargetBTN) {
		   TargetBTN = document.getElementsByName(BUTTON_ID)[0];
	  }
	  if (!TargetBTN) {
		   TargetBTN = document.getElementsByClassName(BUTTON_ID)[0];
	  } */
	  if (!TargetBTN ) {
		  return;
	  }
	  const color="blue";
	  let clicked=parseInt(TargetBTN.getAttribute("clicked"));
	  let fireDelay=TargetBTN.getAttribute("FireDelay");
	  if (!clicked) clicked=0;
	  let d = new Date();
	  let n = d.toLocaleTimeString();
	  console.log('action by searchButtonStart :'+n);
	  //chrome.storage.sync.get("timeoutID", ({ timeoutID }) => {
		if (TargetBTN) {
			if (!fireDelay) TargetBTN.style.backgroundColor = color;
			setTitleActive(clicked);
			let textbtn=TargetBTN.value;
			let position = textbtn.startsWith(BUTTON_TRIGG);
			if ( position===true ) {
				console.log('Will to fire button: '+textbtn+', but may be need wait before it');
				fireButton(TargetBTN);
			}else{
				console.log('Waiting change state of Button to :'+BUTTON_TRIGG+', now it: '+textbtn);
				let d=document.getElementById(RESTTIME_ID);
				if (d) d.remove();
			}
		}else{
			document.title=PLUGINI_TXT+" "+n+"|"+OLDT;
		}
  };
  
    // MAIN
	
	restore_options();
  
};	

  function state_off(tabId=0){
	tabId=parseInt(tabId);
	console.log("state_off id:"+tabId);
	chrome.action.setBadgeText(
		{
			text: '',
			tabId: tabId,
		},
		() => { console.log("state_off setBadgeText done") }
	);
  };

  function state_on(tabId){
	tabId=parseInt(tabId);
 	chrome.action.setBadgeText(
	  {
		text: 'ON',
		tabId: tabId,
	  },
	  () => { console.log("state_on setBadgeText done") }
	);
  };

async function byTimer(id) {	
  let d = new Date();
  let n = d.toLocaleTimeString();
  console.log('action by timer: '+n+', tabid:'+id);
  if (!id) return;
	chrome.scripting.executeScript({
		target: { tabId: id },
		func: searchButtonStart
	});	
};

async function listTabs(){
	let tabid=0;
	chrome.storage.sync.get( {stabids: []},  async (result) => {	
	 const arr=result.stabids;
	 console.log("listTabs arr:"+result.stabids);

	 arr.forEach( (atabid) => {
		 console.log("TABS LIST ID:" +atabid);
		 checkTab(atabid);
		 
	 });
	  console.log("listTabs wait start:"+new Date().toLocaleTimeString());
	 await new Promise((resolve) => setTimeout(resolve, 500));
	 	  console.log("listTabs wait end:"+new Date().toLocaleTimeString());

	 // post check
	 tabid=0;
	 chrome.storage.sync.get( {stabids: []}, (result) => {	
	  const arr=result.stabids;
	   arr.forEach( (atabid) => {
		 console.log("Chcked TABS LIST ID:" +atabid);
		 //tabid=atabid;
		 alarm(atabid);
		 console.log("listTabs atabid: "+atabid);
	   });
	 });

	});
}

async function removeTab(value){
 value=parseInt(value);
 console.log('BG removeTab '+value);
	  chrome.storage.sync.get({ stabids: []}, async (result) => {	
	  let arr=result.stabids;
	  console.log("BG removeTab arr:"+arr);
	  arr=arr.filter(item => item !== value);
	  console.log("BG removedTab arr:"+arr);
	  await new Promise((resolve_save) => {
		  chrome.storage.sync.set({stabids: arr}, () => { console.log("BG removedTab confirm"); resolve_save();	 });
	  }); // promise wait save

	 });
}

 function removeTabs(){
   chrome.storage.sync.set({ stabids: [] });
};

function checkTabID(value) {
    return new Promise((resolve, reject) => {
        try {
            chrome.tabs.get(
			 value,
             function (tab) {
				 if (tab) {
				  console.log('checkTabID '+tab.id);
				  resolve(tab.id==value);
				 }else{
				  console.log('else checkTabID '+value);
				  resolve(false);
				 }
             })
        } catch (e) {
			console.log('catch checkTabID '+e);
			resolve(false);
        }
    })
}

async function checkTab(value){
   await checkTabID(value).then( 
   (present) => { 
    console.log('checkTab '+present);
		if (!present) {
			removeTab(value);
			console.log('checkTab - removeTab '+value);
		}
		
    }
  );
};

function restoreTitles(){
	console.log('restoreTitles');
	chrome.storage.sync.get( {stabids: []}, (result) => {	
	 const arr=result.stabids;
	 arr.forEach( (id) => {
	  console.log('restoreTitle: '+id);
	  chrome.scripting.executeScript({
		target: { tabId: id },
		 function: () => {
			console.log('restoreTitle');
			let Title = document.getElementsByTagName("title")[0];
			OLDT=Title.getAttribute("ot");
			document.title=OLDT;
			Title.setAttribute("ot",'');
		}
	  });	
	 });
	});
}

// CODE

chrome.alarms.onAlarm.addListener(function(a) {
	listTabs();
	console.log("onAlarm:"+a.name+" ,scheduledTime:"+a.scheduledTime+". "+ ++count );
});



chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
   console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${oldValue}", new value is "${newValue}".`+newValue.length
    );    
	if ( key == "stabids" ){
	    let tabid=newValue[0];
		if ( newValue.length > 0 ) {
		 chrome.storage.sync.get({
		    refresh_time: 15,
			button_id: "targetbtn",
			add_button_text: true
		 }, function(item){
			installAlarms(parseInt(item.refresh_time),item.button_id,item.add_button_text);
			alarm( tabid ); 
			console.log("changed stabid - alarm "+tabid);
		 });
		}else{
			removeAlarms();
		}
	}
  }
});



chrome.runtime.onInstalled.addListener(() => {
  console.log("onInstalled");
  removeAlarms();
  //restoreTitles();
  removeTabs();
});



chrome.tabs.onRemoved.addListener( (tabId, removeInfo) => {
	console.log("onRemoved:"+tabId);
	removeTab(tabId);
});