/**
 * class ImageFrameRate
 * @classdesc Generic frame rate manager for images
 *
 */
class ImageFrameRate {
    /**
     * constructor
     */
    constructor() {
        this.images = [];
    }

    /**
     * Handle frame rate for a given image using its DOM identifier
     *
     * @param _id
     */
    Set(_id) {
        // check first for frame rate related element
        const elemFps = document.getElementById(_id + "_fps");
        if (elemFps == null)
            return;

        // current date
        const now = performance.now();

        // retrieve element in the list or add it with a default structure
        var image = this.images.get((_image) => {
            return _image.id == _id;
        }, {
            id   : _id,
            count: -1, // take care of subsequent increment
            date : now
        });

        // increment count & get measure current leap
        image.count++;
        const leap = now - image.date;

        // too early
        if (leap < 1000)
            return;

        // set current framerate
        elemFps.innerHTML = (image.count * 1000 / leap).toFixed(2) + " fps";

        // reset current image information
        image.count = 0;
        image.date = now;
    }

    /**
     * Clear the current frate rate images structure clear
     * the current frate rate images structure
     */
    Clear() {
        this.images = [];
    }
}
