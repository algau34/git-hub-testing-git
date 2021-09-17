/**
 * Created by jetbrains web development IDE ( Web/PhpStorm ).
 * Project: define-newElementHTML - myProject
 * User: algau34
 * Mail: al.gau@free.fr
 * Date: 30/06/2021
 * Time: 19:04
 */

/**
 * class Cr
 * @classdesc class Cr core
 */
class Cr {

	/**
	 * get directory in absolute link
	 *
	 * @memberOf Cr
	 * @type {string}
	 */
	static targetUrl = window.location.href.substr(0, window.location.href.lastIndexOf('/') + 1);

	/**
	 *
	 */
	constructor() {
		if (this.constructor === Cr) {
			throw new TypeError('Abstract class "' + this.constructor.toString() + '" cannot be instantiated directly');
		}
	}

	/**
	 *  get a file in synchronous mode
	 * @param file
	 * @param _relativeHref force relative url target
	 * @returns {string}
	 */
	static getFile(file) {
		var page = file.split(/\//).pop();
		var wait = setTimeout(() => {
			throw new Error("Time out load js : " + page + "!")
		}, 2500);
		const request = new XMLHttpRequest();
		file = Cr.getPresentUrl(true) + file;
		request.open("GET", file, false);
		request.send();
		var res = (() => {
			clearTimeout(wait);
			if (request.status == 404) throw "Page " + page + " not found !";
			var respText = request.responseText;
			request.abort();
			return respText;
		})();

		return res;
	}

	/**
	 * import a js Script and eval this
	 * @param _path
	 */
	static importScript(_path) {
		let code = Cr.getFile(_path);
		code = code.replace(/^[\u00BB\u00BF\uFEFF\t\r\n\v]+/gm, "");
		window.eval('\n' + code + ';');
	}

	/*	if(stack[0]=="Error") { // Chromium (\b[^\s]+\s\b)?(\bhttp(s?)\:\/\/\b)?
		var m;
		if(m=stack[stack.length-1].match(/(http(s?)\:\/\/[^\?\#]*\.js$)/im)){
			var files = m.pop().split(/\//);
			if(dir) files.pop() ;
			__FILE__ =files.join('/');
		}

	}
	console.log('__FILE__ : ',__FILE__);*/
	/**
	 *
	 * @param dir
	 * @returns {string}
	 */
	static getPresentUrl(dir = false) {
		var stack    = ((new Error).stack).split("\n"),
			__FILE__ = "not Found";
		if (stack[0] == "Error") { // Chromium
			var m;
			if (m = stack[stack.length - 1].match(/(https?[^\?\#]*\.[a-z]{2,4})/im)) {
				var files = m.pop().split(/\//), f;
				__FILE__ = [(f = files.pop()) && !dir ? f : ''].concat(files.reverse()).reverse().join('/');
			}
		}
		return __FILE__;
	}
}

/**
 *
 */
(function (Cr) {
	var fScrs = ['Init.Object.extd.js',
				 'Document.extd.js',
				 'HTMLElement.extd.js',
				 'DOM.extd.js',
				 'JSON.extd.js',
				 'Array.extd.js',
				 'String.extd.js',
				 'Sheet.extd.js'];
	fScrs.forEach(fScr => Cr.importScript(fScr));
})(Cr)


