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
	static getFile(file, _relativeHref = true) {
		if (!_relativeHref) file = Cr.targetUrl + file;
		var page = file.split(/\//).pop();
		var wait = setTimeout(() => {
			throw new Error("Time out load js : " + page + "!")
		}, 2500);
		const request = new XMLHttpRequest();
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

}


(function (Cr) {
	var dirsHref = window.location.href.split('/');
	dirsHref.pop();
	var fScrs = ['Init.Object.extd.js',
				 'Document.extd.js',
				 'HTMLElement.extd.js',
				 'DOM.extd.js',
				 'JSON.extd.js',
				 'Array.extd.js',
				 'String.extd.js',
				 'Sheet.extd.js'];
	fScrs.forEach(fScr => Cr.importScript(dirsHref.join('/') + '/Core/' + fScr));
})(Cr)


