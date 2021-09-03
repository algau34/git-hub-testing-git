/**
 * class OverlayCanvas
 *
 * @classdesc deal with a canvas overlaying a reference div
 */
class OverlayCanvas
{
	/**
	 *
	 * @description Append a canvas element below reference div, access its 2d context,
	 * adjust it to the current reference image dimension, set default styles
	 * and create an internal cache
	 * @param _referenceDivId
	 */
	constructor( _referenceDivId ) {
		this.referenceDiv = document.getElementById( _referenceDivId );
		this.canvasElement = document.createElement( "canvas" );
		this.canvasElement.style.position = "absolute";
		this.canvasElement.style.pointerEvents = "none";
		this.referenceDiv.parentElement.appendChild( this.canvasElement );
		this.context = this.canvasElement.getContext( "2d" );
		this.resize();
		this.defaultStyles = {
			fillStyle: "white",
			strokeStyle: "white",
			shadowColor: "black",
			shadowBlur: 0,
			shadowOffsetX: 0,
			shadowOffsetY: 0,
			lineCap: "square", // butt | round | square
			lineJoin: "miter", // bevel | round | miter
			lineWidth: 1,
			miterLimit: 10,
			closePath: false,
			lineDash: "solid",
			font: "12px arial",
			fill: "true"
		};
		this.lineDashStyles = {
			solid: [],
			dotted: [ 1, 2 ],
			dashed: [ 5, 2 ]
		};
		this.cache = new GenericCache();
	}


	/**
	 * Get and apply color, styles & shadows on current context
	 *
	 * @param _className
	 * @returns {*}
	 * @private
	 */
	_applyStyle( _className ) {
		var style = this.cache.get( "class-" + _className, ()=>{
			return getCustomStyles( _className, this.cache.get( "defaultStylesNames", ()=>{
				var styles = [];
				Object.entries( this.defaultStyles ).forEach( ( [ _name ] )=>{
					styles.push( _name );
				} );
				return styles;
			} ) );
		} );
		Object.entries( this.defaultStyles ).forEach( ( [ _name, _value ] )=>{
			if( typeof this.context[ _name ] !== "function" )
				this.context[ _name ] = style[ _name ] || _value;
		} );
		return style;
	}

	/**
	 * Get dash style, adapted to current line width
	 *
	 * @param _style
	 * @returns {[]}
	 * @private
	 */
	_getDash( _style ) {
		var dash = [];
		this.lineDashStyles[ _style.lineDash || this.defaultStyles.lineDash ].forEach( ( _dash )=>{
			dash.push( _dash * _style.lineWidth );
		} );
		return dash;
	}


	/**
	 * Resize the canvas depending of current reference div dimensions
	 */
	resize() {
		this.canvasElement.width = this.referenceDiv.offsetWidth;
		this.canvasElement.height = this.referenceDiv.offsetHeight;
	}


	/**
	 * Clear current canvas content
	 *
	 * @param preserveTransform
	 */
	clear(preserveTransform) {
		if(preserveTransform) {
			this.context.save();
			this.context.setTransform(1, 0, 0, 1, 0, 0);
		}
		this.context.clearRect( 0, 0, this.canvasElement.width, this.canvasElement.height );
		if (preserveTransform) {
			this.context.restore();
		}
    }

	/**
	 * Draw a path on the canvas
	 * (_path: [ [ x, y ], [ x, y ], ... ])
	 *
	 * @param _path
	 * @param _class
	 * @param _closePath
	 */
	path( _path, _class, _closePath = false ) {
		var style = this._applyStyle( _class );
		this.context.setLineDash( this._getDash( style ) );
		this.context.beginPath();
		for( var i = 0; i < _path.length; i++ )
			this.context[ i == 0 ? "moveTo" : "lineTo" ]( _path[ i ][ 0 ], _path[ i ][ 1 ] );
		if( style.closePath || _closePath )
			this.context.closePath();
		this.context.stroke();
		if( _path.length > 2 )
			this.context.fill();
	}

	/**
	 * Draw a rectangle on the canvas
	 * (_rect: [ x, y, width, height ])
	 *
	 * @param _rect
	 * @param _class
	 */
	rectangle( _rect, _class ) {
		this.path( [ [ _rect[ 0 ], _rect[ 1 ] ], [ _rect[ 0 ] + _rect[ 2 ], _rect[ 1 ] ], [ _rect[ 0 ] + _rect[ 2 ], _rect[ 1 ] + _rect[ 3 ] ], [ _rect[ 0 ], _rect[ 1 ] + _rect[ 3 ] ] ], _class, true );
	}

	/**
	 * Draw a rectangle on the canvas
	 * _rect: [ x, y, width, height ]
	 *
	 * @param _rect
	 * @param _alpha
	 * @param _class
	 */
	rectAlpha( _rect, _alpha, _class ) {
		var style = this._applyStyle( _class );
		this.context.setLineDash( this._getDash( style ) );
		this.context.globalAlpha = _alpha;
		this.context.fillRect( _rect[ 0 ], _rect[ 1 ], _rect[ 2 ], _rect[ 3 ] );
		this.context.globalAlpha = 1;
		this.context.strokeRect( _rect[ 0 ], _rect[ 1 ], _rect[ 2 ], _rect[ 3 ] );
	}


	/**
	 * Draw a circle on the canvas
	 * _pos: [ x, y, radius ]
	 *
	 * @param _pos
	 * @param _alpha
	 * @param _class
	 */
	circleAlpha( _pos, _alpha, _class ) {
		var style = this._applyStyle( _class );
		this.context.setLineDash( this._getDash( style ) );
		this.context.beginPath();
		this.context.arc(_pos[0], _pos[1], _pos[2], 0, 2 * Math.PI);
		this.context.stroke();
		this.context.globalAlpha = _alpha;
		this.context.fill();
		this.context.globalAlpha = 1;
	}

	/**
     * Draw a circle on the canvas
     * (_pos: [ x, y, radius ])
	 *
     * @param _pos
     * @param _class
     */
	circle( _pos, _class ) {
		var style = this._applyStyle( _class );
		this.context.setLineDash( this._getDash( style ) );
		this.context.beginPath();
		this.context.arc(_pos[0], _pos[1], _pos[2], 0, 2 * Math.PI);
		this.context.stroke();
		if ( style.fill == "true")
			this.context.fill();
	}

    /**
     * Draw a text on the canvas
     * _pos: [ x, y ]
     *
     * @param _pos
     * @param _text
     * @param _class
     */
	text( _pos, _text, _class ) {
		var style = this._applyStyle( _class );
		this.context.font = style.font;
		this.context.fillText( _text, _pos[ 0 ], _pos[ 1 ] );
	}
}
