/**
 * Created by Pascal on 07/04/2017.
 */


window.dummy = typeof dummy != "undefined" ? dummy : {};

/**
 *
 *
 **/
dummy.organ = function () {

	/**
	 * @private
	 * @constant
	 * @property
	 * @type {number}
	 */
	var _widthImage = 1600;
	/**
	 * @private
	 * @constant
	 * @property
	 * @type {number}
	 */
	var _coeffFontSize = 400;


	/**
	 * @private
	 * @constant
	 * @property
	 * @type {string}
	 */
	var _bodySrc = 'assets/images/acc/interactiveBody_backfront.png';

	/**
	 *
	 *  constructeur de la classe instance dummy.organ
	 *
	 *  @class
	 *  @constructor
	 **/
	this.organ = function () {
		dummy.instance = this; // instance courante
		toolsSVG.call(this);

		this.defaultEvents = {
			"mouseover": function (currentInstance) {
				this.setAttribute("old", this.getAttribute("fill-opacity"));
				this.setAttribute("fill-opacity", currentInstance.fillOpacityHover);
				dummy.mOver = true;
			},
			"mouseout" : function (currentInstance) {
				this.setAttribute("fill-opacity", this.getAttribute("old"));
				dummy.mOver = false;
			},
			"click"    : function (currentInstance) {
				var status = currentInstance.getStatus(this);
				//currentInstance.defaultEvents[ "mouseover"].bind(this,currentInstance);
			}
		}


	}

	/**
	 * @public
	 * @type {toolsSVG}
	 */
	this.organ.prototype = Object.create(toolsSVG.prototype);
	this.organ.prototype.constructor = this.organ;

	/**
	 * @private
	 * @property
	 * @type {number}
	 */
	var coeffReduce = 1;
	/**
	 *
	 * position x et y supposé
	 * du pointer, par défaut
	 *
	 * @public
	 * @type {{x: number, y: number}}
	 */
	this.organ.prototype.constOffsetPointer = {x: 5, y: 31};

	/**
	 * calcul de la position du bloc test
	 * par rapport au pointer
	 *
	 * @public
	 *
	 * @param containermyDummy
	 * @returns {{x: number, y: number}}
	 */
	this.organ.prototype.calculOffsetPointer = function (containermyDummy) {
		return {
			x: +this.constOffsetPointer.x,
			y: Math.pow((containermyDummy.offsetHeight / 100) / 2, 2) + this.constOffsetPointer.y
		};
	}

	/**
	 *
	 * positions du texte lié
	 * au zones specifiques du mannequin
	 *
	 * @public
	 * @property
	 * index 1 et 2 = pos x, y du text "stat", si en index 3 = true on trace une ligne
	 * @type {{head: [*], ear right: [*], ear left: [*], nose: [*], eye right: [*], eye left: [*], elbow: [*], ankle: [*], foot: [*], shoulder: [*], mouth: [*], pubis: [*], wrist: [*], hand: [*], fingers: [*], toes: [*]}}
	 */
	this.organ.prototype.posSpecialArea = {
		"head"     : [0, -60],
		"ear right": [70, 25, true],
		"ear left" : [-70, 25, true],
		"nose"     : [-120, -15, true],
		"eye right": [75, -60, true],
		"eye left" : [-75, -60, true],
		"elbow"    : [80, -40, true],
		"ankle"    : [120, -80, true],
		"foot"     : [120, -60, true],
		"shoulder" : [120, -40, true],
		"mouth"    : [-160, 80, true],
		"pubis"    : [-200, 120, true],
		"wrist"    : [100, -64, true],
		"hand"     : [80, -22, true],
		"fingers"  : [80, 80, true],
		"toes"     : [80, -40, true],
	};
	/**
	 * @public
	 * @property
	 * @type {number}
	 */
	this.organ.prototype.coeffOpacityOnClick = 1.4;
	/**
	 * @public
	 * @property
	 * @type {number}
	 */
	this.organ.prototype.fillOpacityHover = 0.3;
	/**
	 * @public
	 * @property
	 * @type {{stroke: string, stroke-width: number}}
	 */
	this.organ.prototype.defaultAttrLine = {
		"stroke"      : "#333",
		"stroke-width": 0.8
	}
	/**
	 * @public
	 * @property
	 * @type {{fill: string, stroke: string, stroke-width: number, font-size: string, font-weight: string, text-anchor: string, dominant-baseline: string, font-family: string}}
	 */
	this.organ.prototype.defaultAttrStat = {
		"fill"             : "#000",
		"stroke"           : "#555",
		"stroke-width"     : 0.8,
		"font-size"        : "0.8em",
		"font-weight"      : "normal",
		"text-anchor"      : "middle",         //start , middle, end
		"dominant-baseline": "middle", //hanging , middle ,baseline
		"font-family"      : "'Super Sans' , Helvetica, 'sans-serif'"
	};
	/**
	 * @public
	 * @type {{fill: string, stroke: string, fill-opacity: number, stroke-opacity: number, stroke-width: number, cursor: string}}
	 */
	this.organ.prototype.defaultAttrShape = {
		"fill"          : "#ff0000",
		"stroke"        : "#ff0000",
		"fill-opacity"  : 0,
		"stroke-opacity": 0.5,
		"stroke-width"  : 3,
		"cursor"        : "pointer"
	};

	/**
	 * @public
	 * @type {{fill: string, stroke: string, stroke-opacity: number, stroke-width: number, stroke-linecap: string, rx: number, ry: number}}
	 */
	this.organ.prototype.defaultAttrBGText = {
		"fill"          : "#ffffff",
		"stroke"        : "#ffffff",
		"stroke-opacity": 1,
		"stroke-width"  : 5,
		"stroke-linecap": "square",
		"rx"            : 3,
		"ry"            : 3
	}
	/**
	 * @public
	 * @type {{font-family: string, fill: string, font-size: string, text-anchor: string, font-weight: string}}
	 */
	this.organ.prototype.defaultAttrText = {
		"font-family": "'Super Sans' , Helvetica, 'sans-serif'",
		"fill"       : "#000",
		"font-size"  : "0.8em",
		"text-anchor": "start",
		"font-weight": "normal"
	}

	/**
	 * @public
	 * @type {{fill: string, stroke: string, font-size: string, font-weight: string, font-family: string, text-anchor: string, stroke-width: number, x: string, y: string}}
	 */
	this.organ.prototype.defaultAttrTitle = {
		"fill"        : "#638697",
		"stroke"      : "#abcdef",
		"font-size"   : "0.9em",
		"font-weight" : "bold",
		"font-family" : "'Super Sans' , Helvetica, 'sans-serif'",
		"text-anchor" : "middle",
		"stroke-width": 0.5,
		x             : '80%',
		y             : '98%'

	}

	/**
	 * initialisation du manequin
	 *
	 * @public method
	 * @param parentContainer  - element HTML conteneur
	 * @param w - longueur
	 * @param h - hauteur
	 * @param attr -les attributs de la zone d'affichage
	 * @param title {string|null} [title=null] - Le titre dans la zone d'affichage
	 * @return {Void}
	 */
	this.organ.prototype.init = function (parentContainer, w, h, attr, title) {

		var width  = parentContainer.offsetWidth,
			height = (h / w) * width;

		this.container.setAttribute("xmlns", this.NS);
		this.container.setAttribute("xmlns:xlink", this.NSxLink);
		this.container.setAttribute("width", width);
		this.container.setAttribute("height", height);//( width / _coeffFontSize)+"em"
		this.container.setAttribute("font-size", (width / _coeffFontSize) + "em");
		coeffReduce = width / _widthImage;

		var image    = _createBgImage.call(this, 0, 0, "100%", "100%"),
			areaBody = _createAreaBody.call(this, dummy.areaBody, coeffReduce, attr);


		if (title) {
			var newAttrs = Object.assign(this.defaultAttrTitle, attr);
			this.createText({x: newAttrs.x, y: newAttrs.y}, title, null, {text: newAttrs});
		}
		if (this.mouseOverLay != false) {
			var coords = parentContainer.getBoundingClientRect();
			_mouseOverLay.call(this, parentContainer, {x: coords.left, y: coords.top});
		}
		this.container.appendChild(image);
		this.container.appendChild(areaBody);
		parentContainer.appendChild(this.container);

		_affectAllEvents.call(this);
	}

	/**
	 * @public
	 * @type {boolean}
	 */
	this.organ.prototype.mouseOverLay = false;

	/**
	 * @private
	 * @param parentContainer
	 * @param offset
	 * @return {Void}
	 */
	var _mouseOverLay = function (parentContainer, offset) {

		window.addEventListener("resize", function (resizedw, event) {
			clearTimeout(this.doIt);
			this.doIt = setTimeout(resizedw, 100);
		}.bind(this, function () {
			var coords = parentContainer.getBoundingClientRect();
			offset = {x: coords.left, y: coords.top};
		}));

		parentContainer.addEventListener('mousemove', function (event) {
			dummy.X = event.clientX , dummy.Y = event.clientY;
			dummy.X -= offset.x - this.mouseOverLay.offset.x ,
				dummy.Y -= offset.y - this.mouseOverLay.offset.y;

			if (dummy.mOver) {
				this.mouseOverLay.elmt.setAttribute('transform', 'translate(' + dummy.X + ' ' + dummy.Y + ')');
			}

		}.bind(this));


	}

	/**
	 * @private
	 * @param x
	 * @param y
	 * @param w
	 * @param h
	 * @returns {Element}
	 */
	var _createBgImage = function (x, y, w, h) {
		var imgRoot = document.createElementNS(this.NS, 'g');
		this.createImage(imgRoot, _bodySrc, x, y, w, h);
		return imgRoot;

	}
	/**
	 * @private
	 * @param json
	 * @param scale
	 * @param attr
	 * @returns {Element}
	 */
	var _createAreaBody = function (json, scale, attr) {
		var pathRoot = document.createElementNS(this.NS, 'g');
		pathRoot.setAttribute("transform", "scale(" + scale + ")");
		for (var id in json) {
			this.createPath(pathRoot, id, json[id], Object.assign({},
																  this.defaultAttrShape, attr && attr.shape ? attr.shape : {}));
		}
		return pathRoot;
	}


	/**
	 * @public
	 * @param bBox
	 * @param text
	 * @param id
	 * @param attr
	 * @param refNodeInsert
	 * @returns {*}
	 */
	this.organ.prototype.createText = function (bBox, text, id, attr, refNodeInsert) {
		var pathRoot = document.createElementNS(this.NS, 'g');
		this.createSimpleText(pathRoot, bBox.x, bBox.y, text,
							  Object.assign({}, this.defaultAttrText, attr && attr.text ? attr.text : {}), id);
		if (!refNodeInsert) {
			this.container.appendChild(pathRoot);
		} else {
			this.container.insertBefore(pathRoot, refNodeInsert);
		}

		// this.container.insertBefore(pathRoot, this.container.lastChild );
		if (attr && attr.bg) {

			this.createBG(pathRoot, Object.assign(bBox,
												  this.defaultAttrBGText,
												  bBox.width ? {"width": bBox.width} : {},
												  bBox.height ? {"height": bBox.height} : {},
												  bBox["resize"] ? {"resize": bBox["resize"]} : {},
												  attr ? attr.bg : {}
			));
		}

		return this;
	}

	/**
	 * @public
	 * @param elmt
	 * @param status
	 * @returns {*}
	 */
	this.organ.prototype.setStatus = function (elmt, status) {
		//alert(elmt+" "+ status)
		elmt.setAttribute("status", status);
		if (status == true) {
			var opacity = this.fillOpacityHover * this.coeffOpacityOnClick;
		} else {
			opacity = 0;
		}
		elmt.setAttribute("fill-opacity", opacity);
		elmt.setAttribute("old-fill", elmt.getAttribute("fill"));
		elmt.setAttribute("old", opacity);
		return status;
	}

	/**
	 * @public
	 * @param elmt{Element}
	 * @returns {boolean}
	 */
	this.organ.prototype.getStatus = function (elmt) {
		return elmt.getAttribute("status") == "true";
	}

	/**
	 * @public
	 * @param event
	 * @param elmt
	 * @returns {*}
	 */
	this.organ.prototype.tryCallBackOnEvent = function (event, elmt) {

		if (this[event]) {
			var status = this.getStatus(elmt);
			this[event].call(this, elmt, status);
		}
		return this;
	}

	/**
	 * @private
	 * @return {Void}
	 */
	var _affectAllEvents = function () {

		Array.prototype.forEach.call(this.container.getElementsByTagName('path'), function (elmt, index) {
			//

			elmt.addEventListener('click', function (currentInstance) {

				currentInstance.defaultEvents['click'].call(this, currentInstance);
				currentInstance.tryCallBackOnEvent.call(currentInstance, 'click', this);

			}.bind(elmt, this));
			//
			elmt.addEventListener('mouseover', function (currentInstance) {

				currentInstance.defaultEvents['mouseover'].call(this, currentInstance);
				currentInstance.tryCallBackOnEvent.call(currentInstance, 'mouseover', this);
			}.bind(elmt, this));
			//
			elmt.addEventListener('mouseout', function (currentInstance) {

				currentInstance.defaultEvents['mouseout'].call(this, currentInstance);
				currentInstance.tryCallBackOnEvent.call(currentInstance, 'mouseout', this);
			}.bind(elmt, this));

		}.bind(this));

	}
	/**
	 * @public
	 * @param areaIdElmt
	 * @param statValue
	 * @param show
	 * @returns {*}
	 */
	this.organ.prototype.setValueStatOnSpecificArea = function (areaIdElmt, statValue, show) {

		if (typeof show == 'undefined') show = true;
		if (show) this.setStatus(this.getElmtById(areaIdElmt), show);


		if (statValue != null) {
			var parentCoord = this.container.parentNode.getBoundingClientRect(),
				coord       = this.getElmtById(areaIdElmt).getBoundingClientRect(),
				newCoord    = {
					"x": (coord.left - parentCoord.left + (coord.width / 2)),
					"y": (coord.top - parentCoord.top + (coord.height / 2))
				}, id       = 'info-' + areaIdElmt;

			if (this.posSpecialArea[areaIdElmt]) {
				if (this.posSpecialArea[areaIdElmt][2]) {
					var x1 = newCoord.x,
						y1 = newCoord.y,
						x2 = newCoord.x = x1 + (this.posSpecialArea[areaIdElmt][0] * (coeffReduce)),
						y2 = newCoord.y = y1 + (this.posSpecialArea[areaIdElmt][1] * (coeffReduce));
				} else {
					if (this.posSpecialArea[areaIdElmt][0]) newCoord.x += this.posSpecialArea[areaIdElmt][0] * (coeffReduce);
					if (this.posSpecialArea[areaIdElmt][1]) newCoord.y += this.posSpecialArea[areaIdElmt][1] * (coeffReduce);
				}
			}

			var dir = (x2 >= (parentCoord.width * 0.25) && x2 <= (parentCoord.width * 0.75)) ? +1 : -1;
			var containerTxt = this.createText({
												   x: newCoord.x + (3 * dir),
												   y: newCoord.y
											   }, statValue, id, {text: this.defaultAttrStat},
											   this.container.getElementsByTagName('g').item(this.container.getElementsByTagName('g').length - 1)).getElmtById(id);

			if (x1 && y1 && x2 && y2) {
				this.createLine(containerTxt, x1, y1, x2, y2, this.defaultAttrLine);
				this.getElmtById(id).getElementsByTagName('text').item(0)
					.setAttribute('text-anchor', dir > 0 ? 'start' : 'end');//start , middle, end
			}
		}


		return this;
	}

	/**
	 * @public
	 * @param specificArea
	 * @param show
	 * @returns {*}
	 */
	this.organ.prototype.setValueStatsOnSpecificArea = function (specificArea, show) {
		for (var areaIdElmt in specificArea) {

			this.setValueStatOnSpecificArea(areaIdElmt, specificArea[areaIdElmt], show);
		}
		return this;
	}
	/**
	 * @public
	 * @param id
	 * @return {Void}
	 */
	this.organ.prototype.zoneEvent = function (type, id) {
		var evt = document.createEvent("MouseEvents");
		evt.initMouseEvent(type, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		document.querySelectorAll("#dummy svg g path[id='" + id + "']").item(0).dispatchEvent(evt);

	}


	return this.organ;

}.call(dummy)
