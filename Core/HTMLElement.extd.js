/**
 * Created by jetbrains web development IDE ( Web/PhpStorm ).
 * Project: define-newElementHTML - myProject
 * User: algau34
 * Mail: al.gau@free.fr
 * Date: 30/06/2021
 * Time: 19:01
 */

/**
 * get all js in html and return array of script js
 * @param loadJs {Boolean} load the js  if true else just the source
 * @param forceRemove {Boolean}
 * @returns {*[]}
 */
HTMLElementExtd.prototype.getJs = function (loadJs = false, forceRemove = false) {
	var allJs   = [],
		scripts = this.querySelectorAll('script');
	if (scripts.length != 0) {
		scripts.forEach(script => {
			if (script.hasAttribute('src')) {
				var src = script.getAttribute('src');
				var js = loadJs ? Cr.getFile(src) : src;
				allJs.push(js);
			} else {
				allJs.push(script.textContent);
			}
			if (forceRemove == true && this.contains(script)) script.parentNode.removeChild(script);
		})
	}
	return allJs;
}

/**
 * move all StyleSheet contains in context(this)
 * in target (document head by default)
 *
 * @target {HTMLElement}
 */
HTMLElementExtd.prototype.moveStyleSheet = function (target = document.head) {
	var links = this.querySelectorAll('link');
	if (links.length != 0) {//isEqualNode(
		var hrefsOfHead     = [...target.querySelectorAll('link')].map(_link => _link.href),
			firstNodeScript = target.querySelectorAll('script').item(0);
		links.forEach(link => {
			var linkHref = link.href;
			if (hrefsOfHead.indexOf(linkHref) == -1) {
				if (firstNodeScript) {
					target.insertBefore(link, firstNodeScript);
				} else {
					target.appendChild(link);
				}
				hrefsOfHead.push(linkHref);
			} else if (this.contains(link)) {
				link.parentNode.removeChild(link);
			}
		});
	}
	return this;
}


/**
 *
 * @param forceRemove
 * @returns {*[]}
 */
HTMLElementExtd.prototype.getCss = function (forceRemove = false) {
	var allCss = [],
		links  = this.querySelectorAll('link');
	if (links.length != 0) links.forEach(link => {
		if (link.hasAttribute('href')) {

			allCss.push(Cr.getFile(link.getAttribute('href')));
		} else {
			allCss.push(link.textContent);
		}
	})
	if (forceRemove == true) this.querySelectorAll('link').forEach(scr => this.removeChild(scr));
	return allCss;
}
/**
 * calculated  style of each element
 * @returns {{}}
 */
HTMLElementExtd.prototype.getCalculatedCss = function () {
	var elements = this ? this : document.getElementsByTagName('*'),
		myCss    = {};
	Array.from(elements).forEach(elmt => {
		Array.from(window.getComputedStyle(elmt, null)).forEach((css) => {
			if (!myCss.hasOwnProperty(elmt.nodeName)) myCss[elmt.nodeName] = {};
			myCss[elmt.nodeName][css] =
				window.getComputedStyle(elmt, null).getPropertyValue(css);
		})
	});
	return myCss;
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
