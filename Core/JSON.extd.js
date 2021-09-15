/**
 * Created by jetbrains web development IDE ( Web/PhpStorm ).
 * Project: define-newElementHTML - spineNav
 * User: Pascal Gaudin
 * Mail: pascal.gaudin@zimmerbiomet.com
 * Date: 30/06/2021
 * Time: 18:31
 */

/**
 * transform Json to Css
 * @param json
 * @returns {string}
 */
JSONExtd.transformToCss=function(json){
	return JSON.stringify(json ).replace(/((?<!\\)[\\"{}]|(?<="\s*)[,])/gmi, mtch=>
		mtch=='"' ? ' ':mtch==',' ? ';\n\t':mtch=='}' ? `;\n\t${mtch}` : mtch!='\\' ?`${mtch}\n\t`:''
	)+'\n' ;

}
