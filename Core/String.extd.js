/**
 * Created by jetbrains web development IDE ( Web/PhpStorm ).
 * Project: define-newElementHTML - myProject
 * User: algau34
 * Mail: al.gau@free.fr
 * Date: 30/06/2021
 * Time: 19:23
 */
/**
 * The splice() method changes the content of a string
 * by removing a range or characters and/or adding new characters.
 *
 * @param _idx
 * @param _rem
 * @param _str
 * @returns {string}
 */
//
StringExtd.prototype.splice = function (_idx, _rem, _str) {
	return this.slice(0, _idx) + _str + this.slice(_idx + Math.abs(_rem));
};

/**
 *
 * @param cssSelector
 * @param callBack
 * @returns {*}
 */
StringExtd.prototype.performOnStrHTMLBySelector = function (cssSelector, callBack = null) {
	var documentFragment = new DOMParser().parseFromString(this, 'text/html');
	var elmt = documentFragment.querySelector(cssSelector);
	if (callBack) callBack.call(elmt);
	var HTML = documentFragment.documentElement.innerXHTML;
	return HTML;
}

/**
 * shuffle letter of string char
 *
 * @returns {*}
 */
StringExtd.prototype.shuffle = function () {
	return this.split("").sort(function (a, b) {
		return (Math.random() < 0.5 ? 1 : -1);
	}).join("");
}
/**
 * Test if string is HTML
 *
 * @returns {boolean}
 */
String.prototype.isHTML = function () {
	return /<\/?[^>]*>/i.test(this);
}
