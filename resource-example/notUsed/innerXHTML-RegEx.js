/**
 * Created by jetbrains web development IDE ( Web/PhpStorm ).
 * Project: zimmer-robotics - spineNav
 * User: Pascal Gaudin
 * Mail: pascal.gaudin@zimmerbiomet.com
 * Date: 09/08/2021
 * Time: 12:21
 */


/**
 * Clean the string script
 *
 * @param tags
 * @returns {*}
 */
StringExtd.prototype.wash = function (tags, baliseInside = 'body') {
	let regexpWash;

	switch (tags) {
		case 'script' :
			regexpWash = /\<script.*(src=\s*["'](.*)["'])?.*\>(.*)\<\/\s*script\s*\>/gmi;
			break;
		case 'link' :
			regexpWash = /\<link.*href=\s*["'](.*)["'].*\/?\>/gmi;
			break;
		case 'body' :
			regexpWash = /\<body.*\/?\>/gmi;
			break;
		case 'meta' :
			regexpWash = /\<meta.*\/?\>/gmi;
			break;
		case 'title' :
			regexpWash = /\<title.* \>(.*)\<\/\s*title\s*\>/gmi;
			break;
		case 'head' :
			regexpWash = /\<head\/?\>/gmi;
			break;
		//...
		default :
	}

	return this.substringReplace(baliseInside, regexpWash, "");

}
/**
 * Extract all link tag in a string HTML and return an Array of href
 * refXhtml is an Object passed by reference , first property contains the HTML
 * if refXHTML exist, then in object the string HTML haven't got tag link
 *
 * @param refXhtml for new html without link
 * @returns {string[]}
 */
StringExtd.prototype.extractLinks = function (refXhtml = {}) {
	const sourcedLinkRegEx = /(<link\s.*?(?=href)href\=\\?"|')([\w\/:%_+.,#?!@&=-]+)(\\?"|')([^>]*\/?>)/gmi;
	const key = Object.keys(refXhtml).shift() || null;
	let allLinks = [...this.matchAll(sourcedLinkRegEx)].map(mtch => {
		if (key && refXhtml[key].isHTML()) refXhtml[key] = refXhtml[key].replace(mtch[0], '');
		return mtch[2];
	})
	return allLinks;
}

/**
 * Extract all script tag with attribute src or not (when there's script code in tag),
 * in a string HTML and return an Array of src (loadJs =false)  else simply script code
 * param refXhtml is an Object passed by reference , first property contains the HTML
 * if refXHTML exist, then in object the string HTML haven't got tag script.
 *
 * @param loadJs
 * @param refXhtml
 * @returns {(*|string)[]}
 */
StringExtd.prototype.extractJs = function (loadJs = false, refXhtml = {}) {
	const sourcedScriptRegEx = /\<script\s*([^>]*(?=src)(src\=\\?"|')([^\\'"]+)(\\?"|'))?[^>]*>([\s\S]*?)\s*\<\/?script\>/gim;
	let allJs = [];
	const key = Object.keys(refXhtml).shift() || null;
	allJs = [...this.matchAll(sourcedScriptRegEx)].map(mtch => {
		if (key && refXhtml[key].isHTML()) {
			refXhtml[key] = refXhtml[key].replace(mtch[0], '');
		}
		return mtch[5] ? mtch[5] : loadJs ? Cr.getFile(mtch[3]) : mtch[3];
	})
	return allJs;
}
/**
 * like String.replace, with an extra option
 * that serves just delimited the replacement by the delimiter tag in the string
 *
 * @param boundingTagStr
 * @param replaceStr
 * @param replaceValue
 * @returns {string}
 */
StringExtd.prototype.substringReplace = function (boundingTagStr, replaceStr, replaceValue) {

	const regex = new RegExp("(\\<" + boundingTagStr + ".*\\>)" +
							 "([\\s\\S]*)" +
							 "(\\<\\/" + boundingTagStr + ".*\\>)", "i");
	const matchInBounding = this.match(regex) || null;
	if (!matchInBounding) return this.replace(replaceStr, replaceValue);
	return matchInBounding[1] + matchInBounding[2].replace(replaceStr, replaceValue) + matchInBounding[3];
}

/**
 * Insert a mini HTML template ('<link href = "#" />'   for example)
 * in the "Element" (this) element,
 * for each of the values of the param aSrcs array found - instead of "$" -,
 * before targetBeforeElmtFirst otherwise
 * if it is not found before the end tag (same as for or null).
 *
 * @param aSrcs
 * @param templateHtml
 * @param targetBeforeElmtFirst
 */
HTMLElementExtd.prototype.insertHTMLFromArray = function (aSrcs, htmlStr, targetBeforeElmtFirst = null) {
	if (typeof htmlStr === 'string') htmlStr = {src: htmlStr};
	aSrcs.forEach(src => {
		let script;
		if (targetBeforeElmtFirst) script = this.querySelector(targetBeforeElmtFirst + ':nth-of-type(1)');
		let replHtml             = htmlStr[/\.\w{2,3}$/.test(src) ? 'src' : 'script'].replace(/\$/, src),
			elmtRef = script, wh = 'beforebegin';
		if (!script) elmtRef = this, wh = 'beforeend';
		elmtRef.insertAdjacentHTML(wh, replHtml);
	});
}


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
				let ref = {xhtml: xhtml};
				let links = xhtml.extractLinks(ref);
				const allJs = xhtml.extractJs(true, ref);
				const linksOlder = document.head.innerHTML.extractLinks();
				document.head.insertHTMLFromArray([...new Set(links.filter(href => linksOlder.indexOf(href) == -1))], '<link rel="stylesheet" href="$"/>', 'script');

				// todo: this code is just to position the script
				//  of the javascript tags in the html page
				//  just before the body of the end tag,
				//  but it degrades performance by a few ms
				let allSrcJs = xhtml.extractJs();
				const srcsScriptOlder = document.body.innerHTML.extractJs();
				document.body.insertHTMLFromArray([...new Set(allSrcJs.filter(src => srcsScriptOlder.indexOf(src) == -1))], {
													  src   : "<script type='text/javascript'  defer src='$' ></script>",
													  script: "<script type='text/javascript'  >\n$\n</script>"
												  }
				);
				// todo end

				this.innerHTML = "<!--start : add html block of doc." + this.nodeName + "-->" +
								 ref.xhtml.wash('meta').wash('title').wash('body').wash('head') +
								 "<!--end : add html block of doc." + this.nodeName + "-->";

				if (allJs.length !== 0) {
					window.eval.call(window, allJs.join('\n'));
				}
			}

		}
	}});
