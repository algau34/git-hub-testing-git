/**
 * Created by jetbrains web development IDE ( Web/PhpStorm ).
 * Project: mySpineNav - spineNav
 * User: Pascal Gaudin
 * Mail: pascal.gaudin@zimmerbiomet.com
 * Date: 31/12/2020
 * Time: 11:46
 */

/**
 * @constructor
 * @hideconstructor
 * @classdesc  Specialisation of HTMLElement.prototype
 * @type {{prototype: HTMLElement, new(): HTMLElement}}
 */
var HTMLElementExtd=!HTMLElementExtd ? HTMLElement:HTMLElementExtd;
/**
 * @constructor
 * @hideconstructor
 * @classdesc Spécialisation de String.prototype
 */
var StringExtd=!StringExtd? String:StringExtd;
/**
 * @constructor
 * @hideconstructor
 * @classdesc Specialisation of Array.prototype
 */
var ArrayExtd=!ArrayExtd ? Array:ArrayExtd;

/**
 * @constructor
 * @hideconstructor
 * @classdesc Spécialisation de document
 */
var documentExtd=!documentExtd? document:documentExtd;
/**
 * "get" if a combination of "find" with a potential
 * insertion in case of missing entry
 *
 * @param _fnFind
 * @param _defaultObject
 * @returns {*}
 */
ArrayExtd.prototype.get = function (_fnFind, _defaultObject) {
	const object = this.find(_fnFind);
	return object != null ? object : this[this.push(_defaultObject) - 1];
}


/**
 * The splice() method changes the content of a string
 * by removing a range or characters and/or adding new characters.
 *
 * @param _idx {number}
 * @param _rem {number}
 * @param _str {string} String to insert
 * @returns {string}
 */
StringExtd.prototype.splice = function (_idx, _rem, _str) {
	return this.slice(0, _idx) + _str + this.slice(_idx + Math.abs(_rem));
};


/**
 * Test if string is HTML
 *
 * @returns {boolean} return true if HTML , else  return false
 */
StringExtd.prototype.isHTML = function () {
	return /<\/?[^>]*>/i.test(this);
}






/**
 * transform a string Html to DomHTML
 * @function
 * @static
 * @memberOf documentExtd
 * @param xhtmlOrPath String is  HTML or link page HTML
 * @returns {DocumentFragment}
 */
documentExtd.transformXHTMLToDom = function(xhtmlOrPath ) {
	var html = xhtmlOrPath.isHTML() ? xhtmlOrPath: Cr.getFile( xhtmlOrPath );
	var DOM = new DOMParser();
	var doc = DOM.parseFromString(html , "text/html");
	return doc ;
}


/**
 * Target a previous sibling's item by tag name
 *
 * @param tag {HTMLElement}
 * @param limit {String} target limit parent
 * @returns {{tagName}|ChildNode|null}
 */
HTMLElementExtd.prototype.previousSiblingByTagName = function (tag, limit = 'body') {
	for (var o = this, tag = tag.toUpperCase(); o = o.previousSibling;)
		if ((o.tagName && o.tagName == tag) || (o.nodeType == Node.COMMENT_NODE && tag == '#comment')) return o;
		else if (limit && o.tagName == limit.toUpperCase()) return null;
	return null;
}

/**
 * Target a next sibling's item by tag name
 *
 * @param tag {HTMLElement}
 * @param limit {String} target limit parent
 * @returns {{tagName}|ChildNode|null}
 */
HTMLElementExtd.prototype.nextSiblingByTagName = function (tag, limit = 'body') {
	for (var o = this, tag = tag.toUpperCase(); o = o.nextSibling;)
		if ((o.tagName && o.tagName == tag) || (o.nodeType == Node.COMMENT_NODE && tag == '#comment')) return o;
		else if (limit && o.tagName == limit.toUpperCase()) return null;
	return null;
}

/**
 * Target the parent element with a string selector
 *
 * @param tag {HTMLElement}
 * @param limit {String} target limit parent
 * @returns {{tagName}|(Node & ParentNode)|null}
 */
HTMLElementExtd.prototype.getParentByCssSelector = function (cssSelector) {
	for (var o = this; o = o.parentNode;)
		if (o && o.matches(cssSelector)) return o;
	return null;
}

/**
 * Target a previous sibling's item with a string selector
 *
 * @param cssSelector
 * @returns {null|Element}
 */
HTMLElementExtd.prototype.previousSiblingByCssSelector = function (cssSelector) {
	for (var o = this; o = o.previousElementSibling;)
		if (o && o.matches(cssSelector)) return o;
	return null;
}

/**
 * Target a next sibling's item with a string selector
 *
 * @param cssSelector {String}
 * @returns {null|Element}
 */
HTMLElementExtd.prototype.nextSiblingByCssSelector = function (cssSelector) {
	for (var o = this; o = o.nextElementSibling;)
		if (o && o.matches(cssSelector)) return o;
	return null;
}

/**
 * Remove all comments in tag parent
 *
 */
HTMLElementExtd.prototype.removeComments = function () {
	var treeWalker = document.createTreeWalker(
		this,
		NodeFilter.SHOW_COMMENT,
		null,
		false
	);
	while (treeWalker.nextNode()) this.removeChild(treeWalker.currentNode);
}

/**
 * Append all nodes in context elmt (this)
 *
 * @param docElmt { HTMLElement |DocumentFragment }
 */
HTMLElementExtd.prototype.appendChildNodes = function (docElmt) {
	var nodeName = docElmt.nodeName.toLowerCase();
	var comments = ["start : add html block of doc." + nodeName + ".",
					"end : add html block of doc." + nodeName + "."].map(cmt => {
		return document.createComment(cmt);
	});
	this.appendChild(comments.shift());
	this.append(...docElmt.childNodes);
	this.appendChild(comments.shift());
}












