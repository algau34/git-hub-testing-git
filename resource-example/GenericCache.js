/**
 * class GenericCache
 * @classdesc Generic cache
 *
 */
class GenericCache {
    /**
     * constructor
     *  Create cache object
     *
     */
    constructor() {
        this.cache = {};
    }

    /**
     * Get an element in the cache, set it if currently unknown
     *
     * @param _name
     * @param _fnSet
     * @returns {*}
     */
    get(_name, _fnSet) {
        if (!this.cache[_name])
            this.cache[_name] = _fnSet();
        return this.cache[_name];
    }
}
