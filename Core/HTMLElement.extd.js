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
 * @param loadJs {Boolean} load the js  if true else just the source
 * @param forceRemove {Boolean}
 * @returns {*[]}
 */
HTMLElementExtd.prototype.getJs=function(loadJs = false,forceRemove=false){
	var allJs=[],
		scripts= this.querySelectorAll('script');
	if(scripts.length!=0) {
		scripts.forEach(    script=>{
			if(script.hasAttribute('src'))  {
				var src=script.getAttribute('src');
				var js =loadJs ? Cr.getFile(src):src;
				allJs.push( js ) ;
			}else {
				allJs.push(script.textContent );
			}
			if( forceRemove==true && this.contains(script))   script.parentNode.removeChild(script);
		} )
	}
	return allJs;
}

/**
 * move all StyleSheet contains in context(this)
 * in target (document head by default)
 *
 * @target {HTMLElement}
 */
HTMLElementExtd.prototype.moveStyleSheet=function(target = document.head ){
	var  links= this.querySelectorAll('link');
	if(links.length!=0) {//isEqualNode(
		var hrefsOfHead =  [...target.querySelectorAll('link') ].map(_link=>_link.href),
			firstNodeScript = target.querySelectorAll('script').item(0);
		links.forEach(link=>{
			var linkHref =link.href;
			if( hrefsOfHead.indexOf(linkHref)==-1) {
				if(firstNodeScript) {
					target.insertBefore(link ,firstNodeScript); } else {
					target.appendChild(link);
				}
				hrefsOfHead.push(linkHref);
			} else  if( this.contains(link) )   {
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
HTMLElementExtd.prototype.getCss=function(forceRemove=false){
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
HTMLElementExtd.prototype.getCalculatedCss=function(  ){
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




