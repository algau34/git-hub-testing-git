/**
 * Created by jetbrains web development IDE ( Web/PhpStorm ).
 * Project: zimmer-robotics - spineNav
 * User: Pascal Gaudin
 * Mail: pascal.gaudin@zimmerbiomet.com
 * Date: 09/08/2021
 * Time: 14:31
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
	get: function() {
		return this.innerHTML;
	},
	set: function(xhtml) {
	 var te =  performance.now();
		if(xhtml) {
			var doc = document.transformXHTMLToDom(xhtml);
			const jsHead= doc.head.getJs(true,true)|| "",
		        allSrcJs=	doc.body.getJs(),
				jsBody=doc.body.getJs(true,true) || "";
			doc.head.moveStyleSheet();// replace in order just simply all styles sheets in head
			doc.body.moveStyleSheet();// move in order just simply all style shetts of body in head

			// clean up all meta, title residues in the body, move them to the doc head
			var docHead=document.head;
			var linkOfDocHead = {
				first:docHead.querySelector('link:first-of-type'),
				last:docHead.querySelector('link:last-of-type') };
			doc.querySelectorAll('meta, title, base, style').forEach(
				elmt=>docHead.insertBefore( elmt, linkOfDocHead[['STYLE'].indexOf(elmt.nodeName)==-1   ? 'first':'last'] ) );
			var allJs = [].concat( jsHead, jsBody).filter( js => js != "");

			// inject HTML, all ChildNode of head and
			this.textContent = "";
			if(doc.head && doc.head.children.length!=0)  this.appendChildNodes( doc.head );
			if(doc.body && doc.body.children.length!=0)  this.appendChildNodes( doc.body );

			if(allJs.length!==0) {
				window.eval.call(window,allJs.join('\n'));
				//todo see other methods , at bottom page in comment

				//replace all js just before end tag body
				const srcsScriptOlder = document.body.getJs().concat( document.head.getJs());
				[...new Set(allSrcJs.filter(src=>srcsScriptOlder.indexOf(src)==-1))].forEach(src=> document.body.insertAdjacentHTML('beforeend',/\.\w{2,3}$/.test(src) ? "<script type='text/javascript' src='"+src+"' ></script>":"<script type='text/javascript'  >"+src+"</script>"));
			}

		}
		var tc=performance.now();
		console.log(`execution time : ${tc -  te} ms ` );
	}
}});


// todo to test in the future (for innerXHTML-RegEx.js & innerXTHML-DOM.js :
//  with other methods to execute code with a js string:


/*    new  Function ('window', allJs.join('\n')) () ;
	  or
	  window.F= new  Function (  allJs.join('\n'))   ;
	  window.F();
	  or
	  window.Function.constructor.call(window, allJs.join('\n')).call() ;

	 //doesn't work !... because pb context
*/
/*
		var allScript = document.getElementsByTagName('script');
		var balScr=document.createElement('script');
		balScr.type="text/javascript";
		balScr.onload=function(){};
		balScr.defer=true;
		balScr.textContent= allJs.map((scr,idx)=>	 { return '\n//js n° '+(allScript.length+1).toString()+'['+( idx+1).toString()+']\n'+scr;}).join('\n');
		document.body.appendChild(balScr);

	 // work ! but ...
 */
