/**
 * Created by jetbrains web development IDE ( Web/PhpStorm ).
 * Project: mymyProject - myProject
 * User: Pascal Gaudin
 * Mail: al.gau@free.fr
 * Date: 31/12/2020
 * Time: 14:45
 */

/**
 * class mainCwui
 * @extends  cwui
 */
class mainCwui extends cwui {

	/**
	 * constructor
	 *
	 * @constructor
	 */
	constructor() {
		super();

		Cr.getFile("{cwui_context}.json", false,
				   (_content) => {
					   this.initWebSock(_content);
					   // shutdown
					   var shutdownEventName = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? "pagehide" : "beforeunload";
					   window.addEventListener(shutdownEventName, cwui.webSock.send.bind(null,
																						 JSON.stringify({"command": "onWindowClose"})));

					   // element resize
					   window.addEventListener("resize", cwui.resizeAll);
				   });


	}

	/**
	 * WebSocket & general initialisation
	 *
	 * @param _content
	 */
	initWebSock(_content) {

		// set JSON context
		cwui.context = JSON.parse(_content);

		// web-socket initialisation
		var webSocketCreated = false;
		cwui.webSock = new WebSocket("ws://" + cwui.context.wsAddress, "JSON+binary");


		// check for websocket validity
		if (!("WebSocket" in window))
			console.error("HTML5 WebSocket not supported!");

		// binary receive
		cwui.webSock.binaryType = "blob";


		// on web socket open
		cwui.webSock.addEventListener("open", () => {
			webSocketCreated = true;
		});


		// on web socket closure: close the window
		cwui.webSock.addEventListener("close", () => {
			if (!webSocketCreated)
				return cwui.showDialog("Sorry but your web-browser seems" +
									   " incompatible with protocoled web-socket usage...<br>" +
									   "Please try with a web-kit compatible application" +
									   " (Chrome/Chromium, Edge, Opera...).");
			cwui.showDialog("user interface shutdowned");
			delegate(() => {
				window.close(); // depends of the browser...
			});
		});


		// element resize
		window.addEventListener("resize", cwui.resizeAll);
		// on web socket command reception
		cwui.webSock.addEventListener("message", (_cmd) => {		// binary or text receive
			var cmd = cwui.binaryRcv ? cwui.binaryRcv : JSON.parse(_cmd.data);
			if (cwui.binaryRcv) cmd.content = _cmd.data;
			this.execCommand(cmd);
		});

	}

	/**
	 * Perform action depending of the command
	 *
	 * @param cmd
	 */
	execCommand(cmd) {
		switch (cmd.command) {
			// set the current body
			case "setBody":
				this._BodyTransition(
					cmd.data,
					cmd.readOnly,
					cmd.transition);
				break;

			// set document title
			case "setTitle":
				document.title = cmd.data;
				break;

			// resize the window
			case "resize":
				window.resizeTo(
					cmd.data.width,
					cmd.data.height);
				break;

			// set the html of a given element
			case "setHtml":
				cwui.getById(cmd.data.id).innerHTML = cmd.data.value;
				break;

			// set a css property of a given element
			case "setCss":
				cwui.getById(cmd.data.id).style[cmd.data.property] = cmd.data.value;
				break;

			// get a css property of a given element
			case "getCss":
				var telement = document.createElement("div");
				telement.classList.add(cmd.data.className);
				document.body.appendChild(telement);
				var value = window.getComputedStyle(telement,
													null).getPropertyValue(cmd.data.property).trim();
				telement.remove();
				cwui.webSock.send(JSON.stringify({
													 "command"  : "onGetCss",
													 "className": cmd.data.className,
													 "property" : cmd.data.property,
													 "value"    : value
												 }));
				break;

			// action over the classList of a given element
			case "classList":
				var element = cwui.getById(cmd.data.id);
				if (cmd.data.action == "add")
					element.classList.add(cmd.data.name)
				else element.classList.remove(cmd.data.name);
				break;

			// set an image with binary content
			case "setImageFile":
				cwui.getById(cmd.data.id);
				// next message on websocket will be the binary content of the image file
				cwui.binaryRcv = {
					command: "setBinaryImage",
					data   : {id: cmd.data.id}
				};
				break;


			// receive and display binary image
			case "setBinaryImage":
				cwui.binaryRcv = null;
				cwui._SetImageURL(
					cmd.data.id,
					cmd.content);
				cwui.imageFrameRate.Set(cmd.data.id);
				break;

			// set the attribute of a given element
			case "setAttribute":
				var element = cwui.getById(cmd.data.id);
				element.setAttribute(
					cmd.data.name,
					cmd.data.value);
				break;

			// onKeyPress
			case "onKeyPress":
				cwui.activateKeyEvents = true;
				break;
			// set an action to a given element
			case "setAction":
				var element = cwui.getById(
					cmd.data.id, false);
				if (!element) // may be KO because of asynchronous DOM manipulations
					return;
				switch (cmd.data.action) {
					// onMouseClick
					case "onMouseClick":
						cwui._AddEvent(element, "click", (_event) => {
							if (element.id == "") return;
							cwui.webSock.send(JSON.stringify(
								{
									"command": "onMouseClick",
									"id"     : element.id
								}));
							_event.stopPropagation();
						});
						break;

					// onMouseWheel
					case "onMouseWheel":
						cwui._AddEvent(element, "wheel", (_event) => {
							if (element.id == "")
								return;
							cwui.webSock.send(JSON.stringify(
								{
									"command": "onMouseWheel",
									"id"     : element.id,
									"delta"  : _event.deltaY
								}));
							_event.stopPropagation();
						});
						break;

					// onFingerAction
					case "onFingerAction":
						cwui.fingerActions.Bind(element, {
							onPick           : (_pick) => {
								cwui.webSock.send(JSON.stringify(
									{
										"command" : "onFingerPick",
										"id"      : cmd.data.id,
										"position": _pick.position
									}));
							},
							onGestureProgress: (_gesture) => {
								cwui.webSock.send(JSON.stringify({
																	 "command": "onFingerGestureProgress",
																	 "id"     : cmd.data.id,
																	 "gesture": _gesture
																 }));
							},
							onGestureEnd     : (_gesture) => {
								cwui.webSock.send(JSON.stringify(
									{
										"command": "onFingerGestureEnd",
										"id"     : cmd.data.id,
										"gesture": _gesture
									}));
							}
						});
						break;

					// onEdit
					case "onEdit":
						element.setAttribute("contenteditable", "true");
						cwui._AddEvent(element, "blur", () => {
							cwui.webSock.send(JSON.stringify({
																 "command": "onEditDone",
																 "id"     : element.id,
																 "data"   : element.outerHTML
															 }));
						});
						cwui._AddEvent(element, "keypress", (_event) => {
							if (_event.keyCode == 13) {
								element.dispatchEvent(new Event("blur"));
								return _event.preventDefault();
							}
							cwui.webSock.send(JSON.stringify({
																 "command": "onEditChange",
																 "id"     : element.id,
																 "data"   : element.outerHTML
															 }));
						});
						break;

					// onInput
					case "onInput":
						cwui._AddEvent(element, "input", (_event) => {
							cwui.webSock.send(JSON.stringify({
																 "command": "onInput",
																 "id"     : element.id,
																 "data"   : element.value
															 }));
							_event.stopPropagation();
						});
						break;

					// onResize
					case "onResize":
						cwui._AddEvent(element, "resize", (_event) => {
							if (_event.target.clientWidth != undefined &&
								_event.target.clientHeight != undefined)
								cwui.webSock.send(JSON.stringify({
																	 "command": "onResize",
																	 "id"     : cmd.data.id,
																	 "width"  : _event.target.clientWidth,
																	 "height" : _event.target.clientHeight
																 }));
							return false;
						});
						cwui.resizables.push(cmd.data.id);
						element.dispatchEvent(new Event("resize"));
						break;

					// onChange
					case "onChange":
						cwui._AddEvent(element, "change", (_event) => {
							cwui.webSock.send(JSON.stringify(
								{
									"command": "onChange",
									"id"     : element.id,
									"data"   : element.value
								}));
							_event.stopPropagation();
						});
						break;
					// unknown action
					default:
						console.error("Unknown action: " + cmd.data.action);
				}
				break;

			// append element
			case "append":
				var element = cwui.getById(cmd.data.id);
				var div = document.createElement("div");
				div.innerHTML = atob(cmd.data.element);
				div.id = cmd.data.childId;
				element.appendChild(div);
				break;

			// reload the style sheets
			case "reloadStyleSheets":
				cwui.reloadStyleSheets();
				break;

			// trigger a general window resize
			case "windowResize":
				window.dispatchEvent(new Event("resize"));
				break;

			// call custom routine
			case "call":
				if (cmd.data.params && typeof cmd.data.params == 'string')
					cmd.data.params = JSON.parse(cmd.data.params);
				cwui._GetRoutine(cmd.data.name).fn((
													   cmd.data.params instanceof Array
													   && cmd.data.params.length == 0) ?
												   [] : cmd.data.params,
												   (_params) => {
													   cwui.webSock.send(JSON.stringify(
														   {
															   "command": "onCallEnd",
															   "name"   : cmd.data.name,
															   "params" : _params ? _params : {}
														   }));
												   });
				break;

			// shutdown the communication
			case "shutdown":
				cwui.webSock.close();
				break;
			// unknown command
			default:
				console.warn("Unknown command: " + cmd.command, " data", cmd.data);
		}
	}

}

/**
 * execute mainCwui
 */
var CWUI = new mainCwui();
