const SAVED_TXT=chrome.i18n.getMessage("plug_SAVED_TXT");
const RESTORED_DEFAULT_TXT=chrome.i18n.getMessage("plug_RESTORED_DEFAULT_TXT");

// Saves options to chrome.storage
function save_options() {
  let  max_time = document.getElementById('max_time').value;
  let  min_time = document.getElementById('min_time').value;
  let  s_max_time = document.getElementById('s_max_time').value;
  let  e_max_time = document.getElementById('e_max_time').value;
  let  a_max_time = document.getElementById('a_max_time').value;
  let  refresh_time = document.getElementById('refresh_time').value;  
  let  button_id = document.getElementById('button_id').value;  
  let  button_trigg = document.getElementById('button_trigg').value;   
  let  add_button_text = document.getElementById('add_button_text').checked;
  let  a_max_time_activate = document.getElementById('a_max_time_activate').checked;
  let  btnsearch =  document.getElementById('btnsearch').value;

  chrome.storage.sync.set({
    max_time: max_time,
    min_time: min_time,
	s_max_time: s_max_time,
	e_max_time: e_max_time,
	a_max_time: a_max_time,
	a_max_time_activate: a_max_time_activate,
	refresh_time: refresh_time,
	button_id: button_id,
	button_trigg: button_trigg,	
	btnsearch: btnsearch,
	add_button_text: add_button_text
  }, function() {
    // Update status to let user know options were saved.
    let status = document.getElementById('status');
    status.innerHTML = '<div align="right" style="color: red; font-weight: bold;">'+SAVED_TXT+'.</div>';
    setTimeout(function() {
      status.innerHTML = '';
    }, 750);
  });
}

function reset_options() {
 let frm=document.getElementById('f1');
 if (frm) {
	 frm.reset();
	// Update status to let user know options were reset.
    let status = document.getElementById('status');
    status.innerHTML = '<div align="right" style="color: red; font-weight: bold;">'+RESTORED_DEFAULT_TXT+'.</div>';
    setTimeout(function() {
      status.innerHTML = '';
    }, 750);
 }
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    max_time: 10,
    min_time: 1,
	s_max_time: "03:00",
	e_max_time: "09:00",
	a_max_time: 30,
	refresh_time: 15,
	button_id: "targetbtn",
	button_trigg: "Start",
	btnsearch: "id",
	a_max_time_activate: true,
	add_button_text: true
  }, function(items) {
	 document.getElementById('max_time').value=items.max_time;
     document.getElementById('min_time').value=items.min_time;
     document.getElementById('s_max_time').value=items.s_max_time;
     document.getElementById('e_max_time').value=items.e_max_time;
     document.getElementById('a_max_time').value=items.a_max_time;
     document.getElementById('a_max_time_activate').checked=items.a_max_time_activate;       
	 document.getElementById('button_id').value=items.button_id;
	 document.getElementById('button_trigg').value=items.button_trigg;	 
	 document.getElementById('refresh_time').value=items.refresh_time;	
	 document.getElementById('add_button_text').checked=items.add_button_text;
	 document.getElementById('btnsearch').value=items.btnsearch;
  });
}

var messageRegex = /__MSG_(.*)__/g;
function localizeHtmlPage (elm) {
  for (var i = 0; i < elm.children.length; i++) {
    localizeHtmlPage(elm.children[i]);
    if (elm.children[i].hasAttributes()) {
      for (var j = 0; j < elm.children[i].attributes.length; j++) {
        elm.children[i].attributes[j].name = elm.children[i].attributes[j].name.replace(messageRegex, localizeString);
        elm.children[i].attributes[j].value = elm.children[i].attributes[j].value.replace(messageRegex, localizeString);
      }
    }
    if (elm.children[i].innerHTML.length) {
      elm.children[i].innerHTML = elm.children[i].innerHTML.replace(messageRegex, localizeString);
    }
  }
}

function localizeString(_, str) {
    return str ? chrome.i18n.getMessage(str) : "";
}

localizeHtmlPage(document.body);

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',  save_options);
document.getElementById('reset').addEventListener('click',  reset_options);

