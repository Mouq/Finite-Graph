// fn-plot (.js/.html)
// Plot equation solutions in a grid
// as per N. J. Wildberger's
// Rational Trigonometry
// CC:BY 3.0 Alexander Moquin

function graph(){
    var div = document.getElementById("graph");
    div.innerHTML = "Well something isn't right here";
    var field = document.getElementById("field").value;
    var data = [];
    
    var ul = document.getElementsByTagName("ul");
    for (var u=0; u<ul.length; u++) {
	var equation = (ul[u].getElementsByClassName("equation"))[0].value;
	var color = (ul[u].getElementsByClassName("color"))[0].value;
	
	// Check for basic illegal inputs
	var check = !equation.match(/=/) ? 
	    "Not an equation." :
	    !field.match(/^\d+$/) ?
	    "Enter a number into the field field." :
	    !color.match(/^[ABCDEFabcdef0123456789]{3,6}$/) ?
	    "Enter a 6 number hex code for the color." :
	    "";
	if (check !== ""){displayErr(check); return;}
	else {hideErr();}
	
	var fn = parse(equation);
	var tmpWidth = window.innerWidth*0.6;
	css ( "td" ) ({ width: tmpWidth/field+"px", height: tmpWidth/field+"px" });
	// Brute force, basically, to fit any equation
	for (var y=0; y<field; y++) {
	    if(!data[y]){ data[y] = []; }
	    for (var x=0; x<field; x++) {
		data[y][x] = (fn(x,y,field) ? mixColor(color, data[y][x]) : data[y][x] ? data[y][x] : '');
	    }
	}
    }
    div.innerHTML = array2table(data);
}

function newEq () {
    var oldUls = document.getElementsByTagName('ul');
    document.getElementById("input")
	.insertAdjacentHTML('beforeend',
	"<ul>"+oldUls[oldUls.length-1].innerHTML+"</ul>");
//    var killB = document.getElementsByClassName('kill');
//    for (var i=1; i<killB.length; i++) {
//	killB[i].addEventListener('click', killEq(killB[i]));
//    }
}// function killEq (c) {
//    sender.parentNode.parentNode.childRemove(c.parentNode);
//}

function displayErr(form) {
    css ( "#error" ) ({ display: "block" });
    document.getElementById("error").innerHTML = form;
} function hideErr() {
    css ( "#error" ) ({ display: "none" });
    document.getElementById("error").innerHTML = "";
}

function array2table(arr) {
    var ret = "<table>";
    var foot = "";
    for (var i=arr.length-1; i>=0; i--) {
	ret += "<tr><td class='noB'>"+i+"</td>";
	for (var j=0; j<arr.length; j++) {
	    ret += "<td style='background-color: #"+(arr[i][j] ? arr[i][j] : 'FFFFFF')+";'></td>";
	}
	ret += "</tr>";
	foot = "<td class='noB'>"+i+"</td>" + foot;
    }
    ret += "<tr><td class='noB'></td>"+foot+"</tr></table>";
    return ret;
}

function mixColor (color1, color2) {
    if (!color1) { return color2 }
    else if (!color2) { return color1 }
    else {
	color1 = color1.match(/(..)(..)(..)/);
	color2 = color2.match(/(..)(..)(..)/);
	return (Math.floor((parseInt(color1[1], 16)+parseInt(color2[1], 16))/2)*Math.pow(16,4)+
	        Math.floor((parseInt(color1[2], 16)+parseInt(color2[2], 16))/2)*Math.pow(16,2)+
	        Math.floor((parseInt(color1[3], 16)+parseInt(color2[3], 16))/2)).toString(16);
    }
}

function parse(eq) {
    var fn = 
	"if (";
    var sides = eq.split("=");
    for (var s=0; s<sides.length; s++){
	sides[s]=sides[s].replace(/(\d+)(x|y)/g, "$1*$2");
	sides[s]=sides[s].replace(/(\d+|x|y)\/(\d+|x|y)/g, "div($1,$2)");
	sides[s]=sides[s].replace(/(\d+|x|y)(\*\*|\^)(\d+|x|y)/g, "pow($1,$3)");
    }
    fn += "pos("+sides[0]+")==pos("+sides[1]+")"
    	+ ") {return true;}"
    	+ "function div(a,b) {"
    	+ "if (!(b%p)) {return undefined; alert('inf')}"
    	+ "var x = 0;"
    	+ "while(b*x%p!=a%p){x++};"
    	+ "return x;}"
    	+ "function pos(a) {"
    	+ "if (a<0) {return eval(p+(a%p))} return a%p;}"
	+ "function pow(a,b) { return Math.pow(a,b); }"
	;
    return new Function('x', 'y', 'p', fn);
}

