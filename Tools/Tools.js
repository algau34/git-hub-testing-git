/**
 * Created by jetbrains web development IDE ( Web/PhpStorm ).
 * Project: define-newElementHTML - myProject
 * User: Pascal Gaudin
 * Mail: al.gau@free.fr
 * Date: 11/06/2021
 * Time: 11:09
 */

/**
 * Tools
 * @type {Tools}
 */
var Tools=class Tools {


	/**
	 *
	 */
	constructor() {
		if (this.constructor === Tools) {
			throw new TypeError('Abstract class "Tools" cannot be instantiated directly');
		}
	}

	/**
	 *
	 * @param _path
	 * @param whParent
	 * @param index
	 * @returns {CSSStyleSheet|StyleSheet}
	 */
	 static importStyleSheetInXHTMLElement(_path,whParent,index=null ){
		 var sheet = document.createStyleSheet(whParent);
		if(!index) index = 	 sheet.ownerNode.getElementsByTagName('style').length ;

		var jsons=  Tools. getStyleSheet(_path,  true);
		jsons.forEach((json)=>sheet.addCSSRuleInJson( json, index));
		return sheet;
	 }


	/**
	 * get a style-Sheet of file _path
	 *
	 * @param _path
	 * @param inJson
	 * @returns {*|string|boolean|[]}
	 */
	static   getStyleSheet(_path,  inJson=false){
		var css =  Cr.getFile(_path );
	   if (inJson == true) {
		   var ruleAndSelector = [...css.matchAll(/([^{}]+)\{([^{}]+)\}/gmi) ];//.filter(v=>/[^\t\r\n\v]/.test(v))
		   var jsonCss = [];

		   ruleAndSelector.forEach(found=> {
			   var jsonRule={} ;
			   var listRule= found[2].replace(/[\u00BB\u00BF\uFEFF\t\r\n\v]+/gm,"").trim().split(/;/);
			   listRule.filter(str=>str.length).forEach((r)=>{
				   let rs=r.split(/\:/);
				   jsonRule[rs.shift().trim()]=rs.shift().trim();
			   }) ;
			   jsonCss.push({selector: found[1].trim(), rule:  jsonRule  });
		   } );
		 return jsonCss;
	   }
	   return   css;
	}


}
