/**
 * Created by jetbrains web development IDE ( Web/PhpStorm ).
 * Project: define-newElementHTML - spineNav
 * User: Pascal Gaudin
 * Mail: pascal.gaudin@zimmerbiomet.com
 * Date: 30/06/2021
 * Time: 18:35
 */



/**
 * add CSS Rule in Json in style Sheet
 * @param json
 * @param index
 */
CSSStyleSheetExtd.prototype.addCSSRuleInJson=
function  addCSSRuleInJson ( json, index){
	//grid-template-areas//((?<=\:").+("?=,))|
	var sheet= this;
	var rule =JSON.transformToCss(json.rule),
		selector = json.selector;

	if (sheet.insertRule) {
		sheet.insertRule("\n"+selector + " " +rule  + "\n", index);
	}else   if (sheet.addRule){
		sheet.addRule(selector, rule.replace(/(;)/gm,'$1\n') ,index);
	}

};


/**
 *
 * @type {addCSSRuleInJson}
 */
StyleSheet.prototype.addCSSRuleInJson=addCSSRuleInJson;
