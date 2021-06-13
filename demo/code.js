const urlOpmlFile = "https://raw.githubusercontent.com/scripting/instantOutlines/master/outlines/twitter/davewiner.opml";
var urlSocketServer;
var mySocket = undefined; 

function getObjectFromOpmltext (opmltext) {
	//Changes
		//6/13/21; 9:49:51 AM by DW
			//Generate a JavaScript object from OPML text. 
			//I'm including this in the Socket Client example because it's something every JS app has to do, so I might as well make it super easy. 
			//You have to include xml.js as I do, or crib the code or just use it to guide your code, or ignore it completely. ;-)
	var xstruct = xmlCompile (opmltext);
	var adrhead = xmlGetAddress (xstruct, "head");
	var adrbody = xmlGetAddress (xstruct, "body");
	var theObject = {
		opml: {
			head: xmlGetSubValues (adrhead),
			body: outlineToJson (adrbody)
			}
		}
	return (theObject);
	}
function viewTheOutline (opmltext) {
	var theOutline = getObjectFromOpmltext (opmltext);
	
	var htmltext, indentlevel;
	function add (s) {
		htmltext += filledString ("\t", indentlevel) + s + "\n";
		}
	
	//add an indented outline of the body from the OPML
		htmltext = ""; indentlevel = 0;
		function addSubsHtml (node) {
			add ("<ul>"); indentlevel++;
			node.subs.forEach (function (sub) {
				add ("<li>" + sub.text + "</li>");
				if (sub.subs !== undefined) {
					addSubsHtml (sub);
					}
				});
			add ("</ul>"); indentlevel--;
			}
		addSubsHtml (theOutline.opml.body);
		$("#idOutlineViewer").html (htmltext);
	//add a table of the head elements in the OPML
		htmltext = ""; indentlevel = 0;
		add ("<table>"); indentlevel++;
		for (var x in theOutline.opml.head) {
			add ("<tr><td class=\"tdRight\">" + x + ": </td><td>" + theOutline.opml.head [x] + "</td></tr>");
			}
		add ("</table>"); indentlevel--;
		$("#idHeadElementsViewer").html (htmltext);
	}
function wsWatchForChange () { //connect with socket server, if not already connected
	if (mySocket === undefined) {
		mySocket = new WebSocket (urlSocketServer); 
		mySocket.onopen = function (evt) {
			var msg = "watch " + urlOpmlFile;
			mySocket.send (msg);
			console.log ("wsWatchForChange: socket is open. sent msg == " + msg);
			};
		mySocket.onmessage = function (evt) {
			var s = evt.data;
			if (s !== undefined) { //no error
				const updatekey = "update\r";
				if (beginsWith (s, updatekey)) { //it's an update
					var opmltext = stringDelete (s, 1, updatekey.length);
					console.log ("wsWatchForChange: update received along with " + opmltext.length + " chars of OPML text.");
					viewTheOutline (opmltext);
					}
				}
			};
		mySocket.onclose = function (evt) {
			mySocket = undefined;
			};
		mySocket.onerror = function (evt) {
			console.log ("wsWatchForChange: socket for outline " + urlOpmlFile + " received an error.");
			};
		}
	}
function everySecond () {
	wsWatchForChange (); //if the socket went down, every second try to re-establish connection
	}
function startup () {
	console.log ("startup");
	$("#idOpmlLink").attr ("href", urlOpmlFile);
	readHttpFile (urlOpmlFile, function (opmltext) {
		if (opmltext === undefined) {
			alertDialog ("There was an error reading the OPML file.");
			}
		else {
			var theOutline = getObjectFromOpmltext (opmltext); //get address of socket server from <head> section of outline
			urlSocketServer = theOutline.opml.head.urlUpdateSocket; //global
			wsWatchForChange (); //connect with socket server
			viewTheOutline (opmltext);
			self.setInterval (everySecond, 1000); 
			}
		});
	}
