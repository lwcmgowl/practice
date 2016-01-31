function debug(msg){
	var log=document.getElementById("debug");
	if(!log){
		log=document.createElement("div");
		log.id="debug";
		log.innerHTML="<h1>Debug Log</h1>";
		document.body.appendChild(log);
	}
	var pre=document.createElement("pre");
	var text=document.createTextNode(msg);
	pre.appendChild(text);
	log.appendChild(pre);
}

function hide(e,reflow){
	if(reflow){
		e.style.display="none";
	}else{
		e.style.visibility="hidden";
	}
}