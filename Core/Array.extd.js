/**
 * Created by jetbrains web development IDE ( Web/PhpStorm ).
 * Project: define-newElementHTML - spineNav
 * User: Pascal Gaudin
 * Mail: pascal.gaudin@zimmerbiomet.com
 * Date: 30/06/2021
 * Time: 19:23
 */

/**
 * "get" if a combination of "find" with a potential
 * insertion in case of missing entry
 *
 * @param _fnFind
 * @param _defaultObject
 * @returns {*}
 */
ArrayExtd.prototype.get = function( _fnFind, _defaultObject ){
	const object = this.find( _fnFind );
	return object != null ? object : this[ this.push( _defaultObject ) - 1 ];
}
