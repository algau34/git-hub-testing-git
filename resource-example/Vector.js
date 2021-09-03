/**
 * class Vector
 * @classdesc Math vector object
 */
class Vector {
    /**
     * constructor
     *
     * @param _x
     * @param _y
     */
    constructor(_x, _y) {
        this.x = _x;
        this.y = _y;
    }

    // --- public  methods:
    /**
     *  Return true if the current vector is null
     *
     * @returns {boolean}
     */
    IsNull() {
        return this.x == 0 && this.y == 0;
    }

    /**
     * Amplitude of the current vector
     *
     * @returns {number}
     */
    Amplitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * Normalize the current vector
     *
     * @returns {Vector|Vector}
     */
    Normalize() {
        const m = this.Amplitude();
        return m == 0 ? this : new Vector(this.x / m, this.y / m);
    }

    /**
     * Return the dot product of two vectors
     *
     * @param _b
     * @returns {number}
     */
    DotProd(_b) {
        const a = this.Normalize();
        const b = _b.Normalize();
        return a.x * b.x + a.y * b.y;
    }

    /**
     * Return the barycenter of two vectors
     *
     * @param _b
     * @returns {Vector}
     */
    BaryCenter(_b) {
        return new Vector((this.x + _b.x) / 2, (this.y + _b.y) / 2);
    }

    /**
     * Return the substraction of two vectors
     *
     * @param _b
     * @returns {Vector}
     */
    Substract(_b) {
        return new Vector(this.x - _b.x, this.y - _b.y);
    }
}
