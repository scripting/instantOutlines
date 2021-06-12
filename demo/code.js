const urlOpmlFile = "https://raw.githubusercontent.com/scripting/instantOutlines/master/outlines/twitter/davewiner.opml";
var urlSocketServer;
var mySocket = undefined; 

var opmltextLog = new Array ();

function getObjectFromOpmltext (opmltext) {
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
	
	var htmltext = "", indentlevel = 0;
	function add (s) {
		htmltext += filledString ("\t", indentlevel) + s + "\n";
		}
	
	//add a table of the head elements in the OPML
		add ("<table>"); indentlevel++;
		for (var x in theOutline.opml.head) {
			add ("<tr><td class=\"tdRight\">" + x + ": </td><td>" + theOutline.opml.head [x] + "</td></tr>");
			}
		add ("</table>"); indentlevel--;
		$("#idHeadElementsViewer").html (htmltext);
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
	
	}
function wsWatchForChange (urlSocketServer) {
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
					opmltextLog.push (opmltext);
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
	wsWatchForChange (urlSocketServer); 
	}
function startup () {
	console.log ("startup");
	opTypeIcons.tweet = undefined; //6/10/21 by DW
	$("#idOpmlLink").attr ("href", urlOpmlFile);
	readHttpFile (urlOpmlFile, function (opmltext) {
		if (opmltext === undefined) {
			alertDialog ("There was an error reading the OPML file.");
			}
		else {
			var xstruct = xmlCompile (opmltext);
			var adropml = xmlGetAddress (xstruct, "opml");
			var adrhead = xmlGetAddress (adropml, "head");
			urlSocketServer = xmlGetValue (adrhead, "urlUpdateSocket"); //set global
			wsWatchForChange (urlSocketServer);
			viewTheOutline (opmltext);
			opmltextLog.push (opmltext);
			self.setInterval (everySecond, 1000); //start the websocket 
			}
		});
	}
