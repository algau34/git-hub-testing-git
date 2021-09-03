/**
 * @classdesc class abstract cwui
 * @abstract
 */
class cwui {
//using accessible static properties
	/**
	 * @memberOf cwui
	 * @type {[]}
	 */

	static resizables = [];
	/**
	 * @memberOf cwui
	 * @type {[]}
	 */
	static customRoutines = [];
	/**
	 * @memberOf cwui
	 * @type {Object}
	 */
	static pageTransition = {
		initialDelay     : 500,
		div              : null,
		duration         : 0,
		fn               : null,
		prev             : null,
		inProgress       : false,
		sourcedScriptsSrc: [],
		scriptsContent   : [],
		onLoadContent    : null,
		loadedScripts    : 0
	};
	/**
	 * @memberOf cwui
	 * @type {[{fn: function(): void, type: string}, {fn: function(): void, type: string}]}
	 */
	static transitions = [{
		type: "fade-to-black",
		fn  : cwui._Transition__fade_to_black
	},
						  {
							  type: "cross-fade",
							  fn  : cwui._Transition__cross_fade
						  }
	];
	/**
	 * @memberOf cwui
	 * @type {[]}
	 */
	static trackedEvents = [];
	/**
	 * @memberOf cwui
	 * @type {boolean}
	 */
	static activateKeyEvents = false;
	/**
	 * @memberOf cwui
	 * @type {{}}
	 */
	static imagesUrl = {};
	// user accessible object:
	/**
	 * @memberOf cwui
	 * @type {FileCache}
	 */
	static fileCache = new FileCache();
	/**
	 * @memberOf cwui
	 * @type {VirtualKeyboard}
	 */
	static vKeyboard = new VirtualKeyboard();

	// user accessible methods:

	/**
	 * @constructor
	 */
	constructor() {
		if (this.constructor == cwui) {
			throw new Error("This class cannot be instantiated !");
		}
	}

// --- internal functions ---

	/**
	 * Key down event
	 *
	 * @param _event
	 */
	static onKeyDown(_event) {

		if (!cwui.activateKeyEvents)
			return;
		cwui.webSock.send(JSON.stringify({
											 "command": "onKeyDown",
											 "code"   : _event.keyCode,
											 "ctrl"   : _event.ctrlKey,
											 "shift"  : _event.shiftKey,
											 "alt"    : _event.altKey
										 }));
		_event.preventDefault();
	};

	/**
	 * Key up event
	 *
	 * @param _event
	 */
	static onKeyUp(_event) {
		if (!cwui.activateKeyEvents)
			return;
		cwui.webSock.send(JSON.stringify({
											 "command": "onKeyUp",
											 "code"   : _event.keyCode,
											 "ctrl"   : _event.ctrlKey,
											 "shift"  : _event.shiftKey,
											 "alt"    : _event.altKey
										 }));
		_event.preventDefault();
	};


	/**
	 * Connection cancellation
	 *
	 */
	static cancelConnect() {
		fetch("http://" + cwui.context.httpAddress + "connect.cancel");
	};

	/**
	 *  Resize all resizables items
	  */
	static resizeAll() {
		var eResize = new Event("resize");
		cwui.resizables.forEach(_id => cwui.getById(_id).dispatchEvent(eResize));
	};

	/**
	 * Reload all style sheets
	 */
	static reloadStyleSheets() {
		var query = "?reload=" + new Date().getTime();
		document.querySelectorAll("link[rel='stylesheet' ]").forEach(
			_element => _element.href = _element.href.replace(/\?.*|$/, query)
		);
	}

	/**
	 *  Add a user custom js routine
	 *
	 * @param _name
	 * @param _fn
	 */
	static addCustom(_name, _fn) {
		if (cwui.customRoutines.find(_customRoutine => {
			return _customRoutine.name == _name;
		}))
			return console.warn("custom routine '" + _name + "' already registered");
		cwui.customRoutines.push({name: _name, fn: _fn});
	}

	/**
	 * Call a user callback
	 *
	 * @param _name
	 * @param _params
	 * todo Function cbkDone
	 */
	static userCallback(_name, _params, cbkDone) {
		cwui.webSock.send(JSON.stringify({
											 "command": "onUserCallback",
											 "name"   : _name,
											 "params" : _params ? _params : {}
										 }));

		if (typeof cbkDone == 'function') {
			cwui.webSock.addEventListener("message", (_params) => {
				cbkDone.call(_params);
			});
		}
	}

	/**
	 * Element registration
	 */
	static registerElements() {
		var elements = [];
		cwui.pageTransition.div.querySelectorAll("*[id]").forEach(
			_element => {
				if (_element.id != "")
					elements.push(_element.id);
			});
		cwui.webSock.send(JSON.stringify({"command": "onRegistered", "elements": elements}));
	};


	/**
	 * Virtual keyboard binding
	 */
	static bindVKeyboard() {
		cwui.vKeyboard.Bind(cwui.pageTransition.div);
	};

	/**
	 * Get element by id
	 *
	 * @param _id
	 * @param _error
	 * @returns {boolean|Element}
	 */
	static getById(_id, _error = true) {
		var element = cwui.pageTransition.div.querySelector("#" + _id);
		if (!element) {
			var msg = "Unknown element id: " + _id;
			if (_error) console.error(msg);
			else console.warn(msg);
			return false;
		}
		return element;
	};

	/**
	 * Async set innerHTML
	 *
	 * @param _id
	 * @param _content
	 * @returns {Promise<void>}
	 */
	static async setInnerHTML(_id, _content) {
		cwui.getById(_id).innerHTML = _content;
		await new Promise((_resolve) => {
			delegate(() => {
				_resolve();
			});
		});
	};

	/**
	 * Show a global dialog
	 *
	 * @param _text
	 */
	static showDialog(_text) {
		var dialog = document.createElement("div");
		dialog.innerHTML = _text;
		dialog.className = "dialog";
		document.body.append(dialog);
	};


	/* --- internal functions ---*/
	/**
	 * Test an Event if it is exist on element, and return this
	 *
	 * @param _element
	 * @returns {*}
	 */
	static _eventExist(_element, _name) {
		return cwui.trackedEvents.find(
			_event => {
				return _event.element == _element && _event.name == _name;
			})

	}


	/**
	 *  Add trackable event listener
	 *
	 * @param _element
	 * @param _name
	 * @param _fn
	 */
	static _AddEvent(_element, _name, _fn) {
		if (cwui._eventExist(_element, _name))
			return console.warn("event '" + _name + "' on element '"
								+ _element.id + "' already registered");
		var event = {element: _element, name: _name, fn: _fn};
		cwui.trackedEvents.push(event);
		event.element.addEventListener(event.name, event.fn);
	}


	/**
	 * Remove tracked event
	 *
	 * @param _element
	 * @param _name
	 */
	static _RemoveEvent(_element, _name) {
		var _eventExist = cwui._eventExist(_element, _name);
		if (!_eventExist) return;
		_eventExist.element.removeEventListener(_eventExist.name, _eventExist.fn);
		cwui.trackedEvents = cwui.trackedEvents.filter(item => item !== _eventExist);
	}

	/**
	 * Reset current page events
	 *
	 */
	static _NeutralizePageEvents() {
		// reset everything
		cwui.resizables = [];
		cwui.customRoutines = [];
		cwui.binaryRcv = null;

		// key events
		cwui.activateKeyEvents = false;
		document.removeEventListener("keydown", cwui.onKeyDown);
		document.removeEventListener("keyup", cwui.onKeyUp);

		// clear finger actions & image frame rate
		cwui._ClearFingerActions();
		cwui._ClearImageFrameRate();

		// remove events
		if (!cwui.pageTransition.div)
			return;
		var events = ["click", "wheel", "blur", "keypress", "input", "change", "resize"];
		cwui.pageTransition.div.querySelectorAll("*[id]").forEach(_element => {
			events.forEach((_event) => {
				cwui._RemoveEvent(_element, _event);
			});
		});
	}

	/**
	 * Retrieve a custom routine by its name
	 *
	 * @param _name
	 * @returns {null|*}
	 */
	static _GetRoutine(_name) {
		var routine = cwui.customRoutines.find(_entry => {
			return _entry.name == _name
		});
		if (!routine) {
			console.error("Unknown custom routine: " + _name);
			return null;
		}
		return routine;
	}

	/**
	 * Clear current finger actions
	 *
	 */
	static _ClearFingerActions() {
		if (cwui.fingerActions == null)
			return;
		cwui.fingerActions.Clear();
		delete cwui.fingerActions;
	}

	/**
	 * Clear current image frame rate
	 *
	 */
	static _ClearImageFrameRate() {
		if (cwui.imageFrameRate == null)
			return;
		cwui.imageFrameRate.Clear();
		delete cwui.imageFrameRate;
	}

	/**
	 * Send page initialisation to back-end and
	 * register current page elements
	 *
	 */
	static _InitNewPage() {
		// set finger actions & image frame rate
		cwui.fingerActions = new FingerActions();
		cwui.imageFrameRate = new ImageFrameRate();

		// new page event
		cwui.webSock.send(JSON.stringify({"command": "onNewPage"}));

		// bind virtual keyboard to flagged input elements
		cwui.bindVKeyboard();

		// elements registration
		cwui.registerElements();

		// key events
		document.addEventListener("keydown", cwui.onKeyDown);
		document.addEventListener("keyup", cwui.onKeyUp);
	}


	/**
	 * Relive previous page if any
	 *
	 */
	static _RemovePreviousPage() {
		// remove previous content
		if (cwui.pageTransition.prev)
			document.body.removeChild(cwui.pageTransition.prev);
		cwui.pageTransition.prev = cwui.pageTransition.div;
		cwui.pageTransition.inProgress = false;
	}

	/**
	 * Effective new page transition: fade-to-black
	 *
	 */
	static _Transition__fade_to_black() {
		if (cwui.pageTransition.prev)
			cwui.pageTransition.prev.style.opacity = 0;
		cwui._InitNewPage();
		delegate(() => {
			cwui._RemovePreviousPage();
			cwui.pageTransition.div.style.opacity = 1;
		}, cwui.pageTransition.prev ? cwui.pageTransition.duration : cwui.pageTransition.initialDelay);
	}


	/**
	 * Effective new page transition: cross-fade
	 *
	 */
	static _Transition__cross_fade() {
		if (cwui.pageTransition.prev)
			cwui.pageTransition.prev.style.zIndex = -1;
		cwui._InitNewPage();
		delegate(() => {
			cwui.pageTransition.div.style.opacity = 1;
			delegate(() => {
				cwui._RemovePreviousPage();
			}, cwui.pageTransition.duration);
		}, cwui.pageTransition.prev ? 0 : cwui.pageTransition.initialDelay);
	}


	/**
	 * Set image URL, taking care
	 * of previous URL removal
	 *
	 * @param _id
	 * @param _content
	 */
	static _SetImageURL(_id, _content) {
		if (cwui.imagesUrl[_id] != null)
			window.URL.revokeObjectURL(cwui.imagesUrl[_id]);
		cwui.imagesUrl[_id] = window.URL.createObjectURL(_content);
		cwui.getById(_id).src = cwui.imagesUrl[_id];
	}

	/**
	 * Execute callBack , when all images are loaded
	 *
	 * @param _parentElmt
	 * @param _cbkDone
	 */
	static _performWhenAllImgsLoaded(_parentElmt, _cbkDone) {
		/*		var imgs =_parentElmt.querySelectorAll('img'),
					remainingImgs=imgs.length;
				if(remainingImgs!=0){
					imgs.forEach( _img =>{
						_img.onload =  __img =>{
							if((--remainingImgs)==0) _cbkDone.call();
							__img.onload=null;
						} ;
					});
				}else{
					_cbkDone.call();
				}
			*/


		var images = [];
		cwui.pageTransition.div.querySelectorAll("img").forEach((_element) => {
			var path = _element.src.substring(window.location.href.length);
			if (path != "")
				images.push(path);
		});

		// pre-load images
		var loadedImages = images.length;
		if (images.length == 0)
			cwui.pageTransition.fn();
		images.forEach((_image) => {
			var image = new Image();
			image.addEventListener("load", () => {
				if (--loadedImages != 0)
					return;
				cwui.pageTransition.fn();
			});
			image.src = _image;
		});/**/


	}

	/**
	 * Create a div for future transition
	 * @returns {HTMLDivElement}
	 */
	static _prepareTransition() {
		var elmt = document.createElement("div");
		elmt.classList.toggle('transition-wrapper', true);
		var options = {opacity: "0", transition: cwui.pageTransition.duration + "ms"};
		Object.entries(options).forEach(([_key, _value]) => {
			elmt.style[_key] = _value;
		});
		return elmt;
	}

	/**
	 *  Perform body transition
	 *
	 * @param _data
	 * @param _readOnly
	 * @param _transition
	 * @returns {Promise<void>}
	 */
	async _BodyTransition(_data, _readOnly, _transition) {
		// transition factor depending of transition type
		var transitionFactor = _transition.type == "cross-fade" ? 1 : 0.5;
		cwui.pageTransition.duration = (_readOnly ? 0 : (_transition.duration * transitionFactor)).toFixed();
		cwui.pageTransition.fn = cwui.transitions.find(
			__transition => {
				return __transition.type == _transition.type
			}).fn;

		// wait for previous transition if currently in progress:
		if (cwui.pageTransition.inProgress)
			await (async _resolve => {
				setTimeout(_resolve, cwui.pageTransition.duration);
			});
		cwui.pageTransition.inProgress = true;

		// reset current body events
		cwui._NeutralizePageEvents();

		// affect tween on page Transition div

		//todo  start of Pascal 's code
		cwui.pageTransition.div = cwui._prepareTransition();
		// rename all elmts with id for to avoid duplicate  id betwenn page transition  (a div)
		// prev and div (cwui.pageTransition.prev & cwui.pageTransition.div)
		/*	if(cwui.pageTransition.prev instanceof HTMLElement) cwui.pageTransition.prev.querySelectorAll("*[id]").forEach(elmt=>elmt.id+="_tmp");*/

		// get HTML of _data (an URL of component HTML)
		var xhtml = Cr.getFile(_data);
		// insert new div in general body:
		document.body.insertBefore(cwui.pageTransition.div, document.body.firstElementChild);
		//add html loaded in page transition div element
		cwui.pageTransition.div.innerXHTML = xhtml;
		//wait all imgs laod ended for to execute tween (cwui.pageTransition.fn)
		cwui._performWhenAllImgsLoaded(cwui.pageTransition.div, cwui.pageTransition.fn);

		// call onload (only dom 0) statements events for each tags elments excluded img,body,script
		var eLoad = new Event("load");
		var allElmtsExcludeImgBodyScript = cwui.pageTransition.div.querySelectorAll('*:not(img):not(body):not(script):not(link)');

		allElmtsExcludeImgBodyScript.forEach(_element => {
			if (_element.onload != null) _element.dispatchEvent(eLoad);
		});
		//todo  end of Pascal 's code

	}


}






