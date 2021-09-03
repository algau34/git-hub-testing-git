/**
 * Created by jetbrains web development IDE ( Web/PhpStorm ).
 * Project: define-newElementHTML - spineNav
 * User: Pascal Gaudin
 * Mail: pascal.gaudin@zimmerbiomet.com
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
String.prototype.splice = function( _idx, _rem, _str ){
	return this.slice( 0, _idx ) + _str + this.slice( _idx + Math.abs( _rem ) );
};
