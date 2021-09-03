/**
 * Created by jetbrains web development IDE ( Web/PhpStorm ).
 * Project: define-newElementHTML - spineNav
 * User: Pascal Gaudin
 * Mail: pascal.gaudin@zimmerbiomet.com
 * Date: 30/06/2021
 * Time: 18:35
 */

/**
 *
 * @type {addCSSRuleInJson}
 */
StyleSheet.prototype.addCSSRuleInJson=addCSSRuleInJson;
CSSStyleSheet.prototype.addCSSRuleInJson=addCSSRuleInJson;

/**
 * add CSS Rule in Json in style Sheet
 * @param json
 * @param index
 */
	function addCSSRuleInJson( json, index){
	//grid-template-areas//((?<=\:").+("?=,))|
		var sheet= this;
	var rule =JSON.transformToCss(json.rule),
		selector = json.selector;

	if (sheet.insertRule) {
		sheet.insertRule("\n"+selector + " " +rule  + "\n", index);
	}else   if (sheet.addRule){
		sheet.addRule(selector, rule.replace(/(;)/gm,'$1\n') ,index);
	}

}
