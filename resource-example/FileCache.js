/**
 *
 * class FileCache
 * @classdesc class  FileCache A simple file cache, avoiding multiple loading
 *
 */
class FileCache {
    /**
     * @constructor
     */
    constructor() {
        this.cache = [];
    }

    /**
     * Load a file if needed, then use a cache
     *
     * @param _path
     * @param _binary
     * @returns {Promise<*>}
     */
    async load(_path, _binary = false) {
        var file = this.cache.find((_element) => {
            return _element.path == _path;
        });
        return file ? file.data : this.cache[this.cache.push({
            path: _path,
            data: await loadFileAsync(_path, _binary)
        }) - 1].data;
    }
};
