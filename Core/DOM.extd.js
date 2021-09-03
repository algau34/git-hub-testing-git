/**
 * Created by jetbrains web development IDE ( Web/PhpStorm ).
 * Project: define-newElementHTML - spineNav
 * User: Pascal Gaudin
 * Mail: pascal.gaudin@zimmerbiomet.com
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
Object.defineProperty(HTMLElement.prototype, 'innerXHTML', {
	get: function() {
		return this.innerHTML;
	},
	set: function(xhtml) {
		 this.innerHTML=xhtml;
		var doc = document.transformXHTMLToDom(xhtml)
		let allJs = doc.getJs();
		if(allJs.length!==0) {
			var js = allJs.join('\n');
			window.eval.call(window,js)
		}
	}
});





