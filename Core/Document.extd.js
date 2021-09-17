/**
 * Created by jetbrains web development IDE ( Web/PhpStorm ).
 * Project: define-newElementHTML - myProject
 * User: algau34
 * Mail: al.gau@free.fr
 * Date: 30/06/2021
 * Time: 18:51
 */


/**
 *
 * @param whParent
 * @returns {CSSStyleSheet|StyleSheet}
 */
documentExtd.createStyleSheet = function (whParent = document.head) {
	var styleTag = document.createElement("style");
	styleTag.setAttribute('type', 'text/css');
	whParent.appendChild(styleTag);
	styleTag.textContent = "";
	var sheet = styleTag.sheet ? styleTag.sheet : styleTag.styleSheet;
	return sheet;
}


/**
 * transform a string Html to DomHTML
 * @function
 * @static
 * @memberOf documentExtd
 * @param xhtmlOrPath String is  HTML or link page HTML
 * @returns {DocumentFragment}
 */
documentExtd.transformXHTMLToDom = function (xhtmlOrPath) {
	var html = xhtmlOrPath.isHTML() ? xhtmlOrPath : Cr.getFile(xhtmlOrPath);
	var DOM = new DOMParser();
	var doc = DOM.parseFromString(html, "text/html");
	return doc;
}


