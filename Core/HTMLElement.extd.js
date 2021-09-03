/**
 * Created by jetbrains web development IDE ( Web/PhpStorm ).
 * Project: define-newElementHTML - spineNav
 * User: Pascal Gaudin
 * Mail: pascal.gaudin@zimmerbiomet.com
 * Date: 30/06/2021
 * Time: 19:01
 */

/**
 * get all js in html and return array of script js
 * @returns {[]}
 */
HTMLElement.prototype.getJs=function(){
	var xhtml=this.outerHTML;


	var js = [...xhtml.matchAll(/(\<script\s[^\>]*\>)([\S\s]*)(\<\/script\>)/gmi)];
	var allJs=[];
	if(js.length!=0) js.forEach( (js)=>{
		if(js){
			if( /\ssrc\=['"][^'"]+['"]/gmi.test(js[1])) {
				var  file= js[1].match(/(\ssrc\=\s?['"])([^'"]+)(['"]\s?)/)[2];
				var response= Cr.getFile(file ) ;
				if(response) allJs.push( response );
			} else if(js[2])  allJs.push(js[2]);
		}
	});
	return allJs;
}


/**
 *
 * @param forceRemove
 * @returns {*[]}
 */
HTMLElement.prototype.getCss=function(forceRemove=false){
	var allCss=[],
		links= this.querySelectorAll('link');
	if(links.length!=0) links.forEach(link=>{
		if(link.hasAttribute('href'))  {

			allCss.push(  Cr.getFile(link.getAttribute('href') )) ;
		}else {
			allCss.push(link.textContent );
		}
	})
	if(forceRemove==true) this.querySelectorAll('link').forEach(scr=>this.removeChild(scr));
	return allCss;
}
/**
 * calculated  style of each element
 * @returns {{}}
 */
HTMLElement.prototype.getCalculatedCss=function(  ){
	var elements =this ? this: document.getElementsByTagName('*'),
		myCss={};
	Array.from( elements).forEach(elmt=> {
		Array.from(window.getComputedStyle(elmt, null)).forEach((css)=>{
			if(!myCss.hasOwnProperty(elmt.nodeName)) myCss[elmt.nodeName]= {};
			myCss[elmt.nodeName][css]=
				window.getComputedStyle(elmt, null).getPropertyValue(css);
		})
	});
	return myCss;
}
/**
 *
 * @param cssSelector
 * @param callBack
 * @returns {*}
 */
String.prototype.performOnStrHTMLBySelector = function (cssSelector, callBack = null) {
	var documentFragment = new DOMParser().parseFromString(this, 'text/html');
	var elmt = documentFragment.querySelector(cssSelector);
	if (callBack) callBack.call(elmt);
	var HTML = documentFragment.documentElement.innerXHTML;
	return HTML;
}
