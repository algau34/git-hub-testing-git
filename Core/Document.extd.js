/**
 * Created by jetbrains web development IDE ( Web/PhpStorm ).
 * Project: define-newElementHTML - spineNav
 * User: Pascal Gaudin
 * Mail: pascal.gaudin@zimmerbiomet.com
 * Date: 30/06/2021
 * Time: 18:51
 */



/**
 *
 * @param whParent
 * @returns {CSSStyleSheet|StyleSheet}
 */
documentExtd.createStyleSheet=function(whParent=document.head ){
	var styleTag = document.createElement ("style");
	styleTag.setAttribute('type','text/css');
	whParent.appendChild (styleTag);
	styleTag.textContent ="";
	var sheet =  styleTag.sheet ? styleTag.sheet : styleTag.styleSheet  ;
	return sheet ;
}


/**
 * transform a string Html to DomHTML
 * @param htmlOrPath
 * @returns {documentExtd}
 */
documentExtd.transformXHTMLToDom=function(xhtmlOrPath ) {
	var html =/\.(html?)|(xml)$/.test(xhtmlOrPath) ? Cr.getFile( xhtmlOrPath ):xhtmlOrPath;
	var DOM = new DOMParser();
	var doc = DOM.parseFromString(html , "text/html");
	return doc.body;
}

