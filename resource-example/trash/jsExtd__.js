/**
 * Created by jetbrains web development IDE ( Web/PhpStorm ).
 * Project: mySpineNav - spineNav
 * User: Pascal Gaudin
 * Mail: pascal.gaudin@zimmerbiomet.com
 * Date: 31/12/2020
 * Time: 11:46
 */


/**
 * "get" if a combination of "find" with a potential
 * insertion in case of missing entry
 *
 * @param _fnFind
 * @param _defaultObject
 * @returns {*}
 */
Array.prototype.get = function (_fnFind, _defaultObject) {
	const object = this.find(_fnFind);
	return object != null ? object : this[this.push(_defaultObject) - 1];
}

/**
 * The splice() method changes the content of a string
 * by removing a range or characters and/or adding new characters.
 *
 * @param _idx
 * @param _rem
 * @param _str
 * @returns {string}
 */
String.prototype.splice = function (_idx, _rem, _str) {
	return this.slice(0, _idx) + _str + this.slice(_idx + Math.abs(_rem));
};

/**
 * Test if string is HTML
 *
 * @returns {boolean}
 */
String.prototype.isHTML=function() {
	return /<\/?[^>]*>/i.test(this);
}



/**
 * get a mock in JSON
 *
 * @param nameMock
 * @returns {Promise<*>}
 */
async function getMock(nameMock) {
	var _params = await loadFileAsync("asset/mock/" + nameMock + "[0].json");
	var json = JSON.parse(_params);
	return json[nameMock];

}


/**
 * HTMLElementExtd
 */
class HTMLElementExtd extends HTMLElement {

	constructor() {
		super();
	}

	/**
	 * Target a previous sibling's item by tag name
	 *
	 * @param tag
	 * @returns {ChildNode}
	 */
	previousSiblingByTagName(tag, limit = 'body') {
		for (var o = this, tag = tag.toUpperCase(); o = o.previousSibling;)
			if ((o.tagName && o.tagName == tag) || (o.nodeType == Node.COMMENT_NODE && tag == '#comment')) return o;
			else if (limit && o.tagName == limit.toUpperCase()) return null;
		return null;
	}
	/**
	 * Target a next sibling's item by tag name
	 *
	 * @param tag
	 * @param limit
	 * @returns {{tagName}|ChildNode|null}
	 */
	nextSiblingByTagName(tag, limit = 'body') {
		for (var o = this, tag = tag.toUpperCase(); o = o.nextSibling;)
			if ((o.tagName && o.tagName == tag) || (o.nodeType == Node.COMMENT_NODE && tag == '#comment')) return o;
			else if (limit && o.tagName == limit.toUpperCase()) return null;
		return null;
	}
	/**
	 * Target the parent element with a string selector
	 *
	 * @param tag
	 * @param limit
	 * @returns {{tagName}|(Node & ParentNode)|null}
	 */
	getParentByCssSelector(cssSelector) {
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
	previousSiblingByCssSelector(cssSelector) {
		for (var o = this; o = o.previousElementSibling;)
			if (o && o.matches(cssSelector)) return o;
		return null;
	}
	/**
	 * Target a next sibling's item with a string selector
	 *
	 * @param cssSelector
	 * @returns {null|Element}
	 */
	nextSiblingByCssSelector(cssSelector) {
		for (var o = this; o = o.nextElementSibling;)
			if (o && o.matches(cssSelector)) return o;
		return null;
	}



	/**
	 * Remove all comments in tag parent
	 */
	removeComments() {
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
	 * @param docElmt
	 */
	appendChildNodes(docElmt) {
		var nodeName = docElmt.nodeName.toLowerCase();
		var comments = ["start : add html block of doc." + nodeName + ".",
						"end : add html block of doc." + nodeName + "."].map(cmt => {
			return document.createComment(cmt);
		});
		this.appendChild(comments.shift());
		this.append(...docElmt.childNodes);
		this.appendChild(comments.shift());
	}



}



new HTMLElementExtd();






