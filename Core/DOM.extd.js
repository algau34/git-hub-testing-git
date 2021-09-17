/**
 * Created by jetbrains web development IDE ( Web/PhpStorm ).
 * Project: define-newElementHTML - myProject
 * User: algau34
 * Mail: al.gau@free.fr
 * Date: 14/06/2021
 * Time: 10:43
 */

/**
 * redefine INNERHTML
 * Element.innerXHTML
 * getter & setter
 * like innerHTML , only one difference,
 * js will evaluated,if it is in script tag
 */

Object.defineProperties(HTMLElementExtd.prototype, {

	/**
	 *  @desc
	 *  HTMLElementExtd.innerXHTML (HTMLElement.innerXHTML) - GETTER and SETTER,
	 *  like innerHTML, only a few differences, js will be evaluated,
	 *  if it is in the script tag. It redefines a stylesheet
	 *  moved to the HEAD for more efficiency in the page header.
	 *  It cleans the html of residual tags,in document body, no duplicate meta tag in the body,
	 *  and finally it executes all js code only when dom js is parsed.
	 *  This is implemented in pure DOMJS.
	 *
	 * @memberof HTMLElementExtd
	 *
	 * @type {String}
	 */
	innerXHTML: {
		get: function () {
			return this.innerHTML;
		},
		set: function (xhtml) {

			if (xhtml) {
				var doc = document.transformXHTMLToDom(xhtml);
				const jsHead   = doc.head.getJs(true, true) || "",
					  allSrcJs = doc.body.getJs(),
					  jsBody   = doc.body.getJs(true, true) || "";
				doc.head.moveStyleSheet();// replace in order just simply all styles sheets in head
				doc.body.moveStyleSheet();// move in order just simply all style shetts of body in head

				// clean up all meta, title residues in the body, move them to the doc head
				var docHead = document.head;
				var linkOfDocHead = {
					first: docHead.querySelector('link:first-of-type'),
					last : docHead.querySelector('link:last-of-type')
				};
				doc.querySelectorAll('meta, title, base, style').forEach(
					elmt => docHead.insertBefore(elmt, linkOfDocHead[['STYLE'].indexOf(elmt.nodeName) == -1 ? 'first' : 'last']));
				var allJs = [].concat(jsHead, jsBody).filter(js => js != "");

				// inject HTML, all ChildNode of head and
				this.textContent = "";
				if (doc.head && doc.head.children.length != 0) this.appendChildNodes(doc.head);
				if (doc.body && doc.body.children.length != 0) this.appendChildNodes(doc.body);

				if (allJs.length !== 0) {
					window.eval.call(window, allJs.join('\n'));
					//todo see other methods , at bottom page in comment

					//replace all js just before end tag body
					const srcsScriptOlder = document.body.getJs().concat(document.head.getJs());
					[...new Set(allSrcJs.filter(src => srcsScriptOlder.indexOf(src) == -1))].forEach(src => document.body.insertAdjacentHTML('beforeend', /\.\w{2,3}$/.test(src) ? "<script type='text/javascript' src='" + src + "' ></script>" : "<script type='text/javascript'  >" + src + "</script>"));
				}

			}

		}
	}
});


var te = performance.now();
var b = Math.random();
var tc = performance.now();
console.log(`execution time : ${tc - te} ms `);
