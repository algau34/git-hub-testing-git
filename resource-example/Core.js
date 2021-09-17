/**
 * Created by jetbrains web development IDE ( Web/PhpStorm ).
 * Project: define-newElementHTML - myProject
 * User: Pascal Gaudin
 * Mail: al.gau@free.fr
 * Date: 30/06/2021
 * Time: 19:04
 */

/**
 * class  Cr : the coreJs
 * @abstract
 * @classdesc Abstract class
 * @type {Cr}
 */
var Cr = class Cr {

	/**
	 * constructor
	 *
	 * @constructor
	 * @hideconstructor
	 */
	constructor() {
		if (this.constructor === Cr) {
			throw new TypeError('Abstract class "' + this.constructor.toString() +
								'" cannot be instantiated directly');
		}
	}

	/**
	 * Get a file in synchronous mode
	 *
	 * @param _path
	 * @param _binary
	 * @param _cbkDone
	 * @returns {boolean|any|string}
	 */
	static getFile(_path, _binary = false, _cbkDone = null) {
		const request = new XMLHttpRequest();
		var response = () => {
			return request.status == 404 ? false : (_binary ? request.response : request.responseText)
		};
		if (_binary)
			request.responseType = "arraybuffer";
		request.open("GET", _path, _cbkDone ? true : false);
		if (_cbkDone)
			request.onloadend = () => {
				_cbkDone(response());
			};
		request.send(null);
		return _cbkDone ? true : response();
	}

	/**
	 * Import a js Script and eval this
	 *
	 * @param _path
	 */
	static importScript(_path) {
		let code = Cr.getFile(_path);
		code = code.replace(/^[\u00BB\u00BF\uFEFF\t\r\n\v]+/gm, "");
		window.eval('\n' + code + ';');

	}

	/**
	 * Calcul data size in Kilo Byte,MegaByte ,etc.
	 *
	 * @param _a
	 * @param _b
	 * @returns {string}
	 */
	static dataSize(_a, _b = 2) {
		if (0 === _a)
			return "0B";
		const c = 0 > _b ? 0 : _b, d = Math.floor(Math.log(_a) / Math.log(1024));
		return parseFloat((_a / Math.pow(1024, d)).toFixed(c)) + ["B", "KB", "MB", "GB", "TB"][d];
	}
}


/*------------- we keep the olders functions, because they are certainly used elsewhere --------------------------------*/
/**
 * Synchronous or asynchronous file load
 *
 * @param _path
 * @param _binary
 * @param _onLoadEnd
 * @returns {*}
 */
function loadFile(_path, _binary = false, _onLoadEnd = null) {
	return Cr.getFile(_path, _binary, _onLoadEnd);
}


/**
 * Async loadFile, using a promise
 *
 * @async
 * @param _path
 * @param _binary
 * @returns {Promise<unknown>}
 */
async function loadFileAsync(_path, _binary = false) {
	return await new Promise((_resolve) => {
		Cr.getFile(_path, _binary, _response => {
			_resolve(_response);
		});
	});
}


/**
 * Replace data tokens using replacement pairs
 *
 * @param _data
 * @param _replacementPairs
 * @returns {*}
 */
function replaceVariables(_data, _replacementPairs) {
	_replacementPairs.forEach((_replacementPair) => {
		_data = _data.split("$" + _replacementPair[0]).join(_replacementPair[1]);
	});
	return _data;
}


/**
 * Replace data tokens using smart automatic parsing
 *
 * @param _data
 * @param _object
 * @returns {*}
 */
function autoReplaceVariables(_data, _object) {
	[..._data.matchAll(/\$(\w*)/g)].forEach((_token) => {
		_data = _data.split("$" + _token[1]).join(_object[_token[1]]);
	});
	return _data;
}


/**
 *  Delegate call
 * @async
 * @param _fn
 * @param _delay
 */
function delegate(_fn, _delay = 0) {
	setTimeout(_fn, _delay);
}


/**
 * Format data size by adding extension
 *
 * @param _a
 * @param _b
 */
function dataSize(_a, _b = 2) {
	Cr.dataSize(_a, _b = 2)
}


/**
 * Escape HTML data
 *
 * @param _data
 * @returns {*}
 */
function escapeHtml(_data) {
	return _data.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}


/**
 * Get custom styles from a given class name
 *
 * @param _className
 * @param _properties
 * @returns {{}}
 */
function getCustomStyles(_className, _properties) {
	var telement = document.createElement("div");
	telement.classList.add(_className);
	document.body.appendChild(telement);
	var style = {};
	_properties.forEach((_property) => {
		style[_property] = window.getComputedStyle(telement, null).getPropertyValue("--" + _property).trim();
	});
	telement.remove();
	return style;
}

/**
 * Download a Uint8Array as a file
 *
 * @param _data
 * @param _filename
 * @param _type
 */
function downloadAsFile(_data, _filename, _type = "application/octet-stream") {
	var file = new Blob([_data], {type: _type});
	var a = document.createElement("a");
	var url = URL.createObjectURL(file);
	a.href = url;
	a.download = _filename;
	document.body.appendChild(a);
	a.click();
	setTimeout(() => {
		document.body.removeChild(a);
		window.URL.revokeObjectURL(url);
	}, 0);
}


/**
 * get a mock in JSON
 *
 *  not used
 * @todo improvement ...
 * @async
 * @param nameMock
 * @returns {Promise<*>}
 */
async function getMock(nameMock) {
	var _params = await loadFileAsync("asset/mock/" + nameMock + "[0].json");
	var json = JSON.parse(_params);
	return json[nameMock];

}

/*********************************************************************/
/** other methods :
 *
 	static getFile( file , _binary = false, _onLoadEnd = false ) {
		var page = file.split(/\//).pop();
		const request = new XMLHttpRequest();
		var wait = setTimeout( ()=>{
			request.abort();
			throw new Error("Time out load js : "+page +"!")},2500);


		if( _binary ) request.responseType = "arraybuffer";
		              request.open("GET", file, _onLoadEnd ? true : false);
					  request.send();

		var res= ()=>{
			clearTimeout(wait);
			if(request.status == 404 )  throw "Page "+ page +" not found !";
			var response = _binary ? request.response : request.responseText;
			request.abort();
			return  response;
		} ;
		if( _onLoadEnd ) request.onloadend = ()=>  _onLoadEnd.call(null,res.call()); else
            return res.call();
 			return true;
	}
 */

