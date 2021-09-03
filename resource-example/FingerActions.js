/**
 * class FingerActions
 *  @classdesc Handle all finger actions of the current page
 */
class FingerActions {
	/**
	 * @constructor
	 */
	constructor() {
		this.eGesture = {grab: "grab", drag: "drag", pinch: "pinch", rotate: "rotate"}
		this.m_elements = [];
		this.m_onMouseDown = {
			handleEvent: (_event) => {
				this._OnMouseDown(_event);
			}
		};
		this.m_onMouseMove = {
			handleEvent: (_event) => {
				this._OnMouseMove(_event);
			}
		};
		this.m_onMouseUp = {
			handleEvent: (_event) => {
				this._OnMouseUp(_event);
			}
		};
		this.m_onTouchStart = {
			handleEvent: (_event) => {
				this._OnTouchStart(_event);
			}
		};
		this.m_onTouchMove = {
			handleEvent: (_event) => {
				this._OnTouchMove(_event);
			}
		};
		this.m_onTouchEnd = {
			handleEvent: (_event) => {
				this._OnTouchEnd(_event);
			}
		};
	}

	/**
	 *  Bind finger actions to a given element
	 *
	 * @param _element
	 * @param _events
	 */
	Bind(_element, _events) {
		this._UnBind(_element);
		this.m_elements.push({domElement: _element, fingers: [], events: _events});
		_element.addEventListener("mousedown", this.m_onMouseDown, true);
		_element.addEventListener("mousemove", this.m_onMouseMove, true);
		_element.addEventListener("mouseup", this.m_onMouseUp, true);
		_element.addEventListener("touchstart", this.m_onTouchStart, true);
		_element.addEventListener("touchmove", this.m_onTouchMove, true);
		_element.addEventListener("touchend", this.m_onTouchEnd, true);
		_element.addEventListener("touchcancel", this.m_onTouchEnd, true);
	}

	/**
	 * Clear finger actions for all elements
	 *
	 */
	Clear() {
		while (this.m_elements.length != 0)
			this._UnBind(this.m_elements[0].domElement);
	}

	// --- private methods:
	/**
	 * Unbind finger actions for a given dom element
	 *
	 * @param _element
	 * @private
	 */
	_UnBind(_element) {
		const element = this._GetElement(_element);
		if (element == null)
			return;
		_element.removeEventListener("mousedown", this.m_onMouseDown, true);
		_element.removeEventListener("mousemove", this.m_onMouseMove, true);
		_element.removeEventListener("mouseup", this.m_onMouseUp, true);
		_element.removeEventListener("touchstart", this.m_onTouchStart, true);
		_element.removeEventListener("touchmove", this.m_onTouchMove, true);
		_element.removeEventListener("touchend", this.m_onTouchEnd, true);
		_element.removeEventListener("touchcancel", this.m_onTouchEnd, true);
		this.m_elements.splice(this.m_elements.indexOf(element), 1);
	}

	/**
	 * Retrieve an element using a DOM target
	 *
	 * @param _target
	 * @returns {*}
	 * @private
	 */
	_GetElement(_target) {
		return this.m_elements.find((_element) => {
			return _element.domElement == _target;
		});
	}

	/**
	 * Retrieve a finger object using a touch identifier
	 *
	 * @param _element
	 * @param _identifier
	 * @returns {*}
	 * @private
	 */
	_GetFinger(_element, _identifier) {
		return _element.fingers.find((_finger) => {
			return _finger.identifier == _identifier;
		});
	}

	/**
	 * Retrieve a finger object using a finger index
	 *
	 * @param _element
	 * @param _index
	 * @returns {*}
	 * @private
	 */
	_GetFingerByIndex(_element, _index) {
		return _element.fingers.find((_finger) => {
			return _finger.index == _index;
		});
	}

	/**
	 * Get the first available finger index
	 *
	 * @param _element
	 * @returns {number}
	 * @private
	 */
	_AvailableFingerIndex(_element) {
		var index = 0;
		while (_element.fingers.find((_finger) => {
			return _finger.index == index;
		}) != null)
			index++;
		return index;
	}

	/**
	 * Common touches event actions then call
	 * an action for each changed touch
	 *
	 * @param _event
	 * @param _fnTouch
	 * @returns {*}
	 * @private
	 */
	_ForEachChangedTouch(_event, _fnTouch) {
		_event.preventDefault();
		const element = this._GetElement(_event.currentTarget);
		for (var i = 0; i < _event.changedTouches.length; i++)
			_fnTouch(element, _event.changedTouches[i]);
		return element;
	}

	/**
	 * Common mouse event actions then call an action
	 *
	 * @param _event
	 * @param _fnAction
	 * @returns {*}
	 * @private
	 */
	_ForMouseEvent(_event, _fnAction) {
		_event.preventDefault();
		const element = this._GetElement(_event.currentTarget);
		_fnAction(element);
		return element;
	}

	/**
	 * Common touch start code
	 *
	 * @param _element
	 * @param _identifier
	 * @param _container
	 * @private
	 */
	_Common_OnTouchStart(_element, _identifier, _container) {
		const brect = _element.domElement.getBoundingClientRect();
		const relatedPos = new Vector(Math.floor(_container.clientX - brect.left), Math.floor(_container.clientY - brect.top));
		const insertedFinger = _element.fingers[_element.fingers.push({
																		  identifier: _identifier,
																		  index     : this._AvailableFingerIndex(_element),
																		  position  : relatedPos,
																		  anchor    : relatedPos
																	  }) - 1];
		if (_element.events.onFingerPress != null)
			_element.events.onFingerPress({index: insertedFinger.index, position: insertedFinger.position});
	}

	/**
	 * Common pick code
	 *
	 * @param _element
	 * @private
	 */
	_Common_OnPick(_element) {
		if (_element.action == null && _element.fingers.length == 1 && _element.events.onPick != null)
			_element.events.onPick({position: _element.fingers[0].position});
	}

	/**
	 * Finger touch start
	 *
	 * @param _event
	 * @private
	 */
	_OnTouchStart(_event) {
		this._Common_OnPick(this._ForEachChangedTouch(_event, (_element, _touch) => {
			this._Common_OnTouchStart(_element, _touch.identifier, _touch);
		}));
	}

	/**
	 * Mouse down
	 *
	 * @param _event
	 * @private
	 */
	_OnMouseDown(_event) {
		this._Common_OnPick(this._ForMouseEvent(_event, (_element) => {
			this._Common_OnTouchStart(_element, "mouse", _event);
		}));
		_event.currentTarget.setPointerCapture(1);
	}

	/**
	 * Common touch move code
	 *
	 * @param _element
	 * @param _identifier
	 * @param _container
	 * @private
	 */
	_Common_OnTouchMove(_element, _identifier, _container) {
		var finger = this._GetFinger(_element, _identifier);
		if (finger == null)
			return;
		const brect = _element.domElement.getBoundingClientRect();
		finger.position = new Vector(Math.floor(_container.clientX - brect.left), Math.floor(_container.clientY - brect.top));
		finger.offset = finger.position.Substract(finger.anchor);
		if (_element.events.onFingerMove != null)
			_element.events.onFingerMove({index: finger.index, position: finger.position, offset: finger.offset});
	}

	/**
	 * Get the current fingers action
	 *
	 * @param _element
	 * @param _finger0
	 * @param _finger1
	 * @returns {string|null|*}
	 * @private
	 */
	_GetAction(_element, _finger0, _finger1) {
		if (_element.action != null)
			return _element.action;
		if (_finger0.offset.IsNull())
			return null;
		if (_element.fingers.length == 1)
			return this.eGesture.drag;
		_finger0.cumulator = _finger0.cumulator == null ? 0 : _finger0.cumulator + 1;
		if (_finger0.cumulator <= 2)
			return null;
		if (_finger1.offset.IsNull())
			return null;
		_finger1.cumulator = _finger1.cumulator == null ? 0 : _finger1.cumulator + 1;
		if (_finger1.cumulator <= 2)
			return null;
		if (_finger0.offset.DotProd(_finger1.offset) > 0.9)
			return this.eGesture.grab;
		const barycenter = _finger0.position.BaryCenter(_finger1.position);
		const dot = barycenter.Substract(_finger0.position).DotProd(_finger0.offset) * barycenter.Substract(_finger1.position).DotProd(_finger1.offset);
		if (dot <= -0.2 || dot >= 0.2)
			return this.eGesture.pinch;
		_element.startAngle = Math.acos(_finger0.position.Substract(barycenter).DotProd(new Vector(1, 0)));
		return this.eGesture.rotate;
	}

	/**
	 * Common gestures progress code
	 *
	 * @param _element
	 * @private
	 */
	_Common_OnGestureProgress(_element) {
		if (_element.events.onGestureProgress == null)
			return;
		const finger0 = this._GetFingerByIndex(_element, 0);
		if (finger0 == null)
			return;
		const finger1 = this._GetFingerByIndex(_element, 1);
		_element.action = this._GetAction(_element, finger0, finger1);
		switch (_element.action) {
			case this.eGesture.drag:
			case this.eGesture.grab:
				_element.events.onGestureProgress({
													  action  : _element.action,
													  position: finger0.position,
													  offset  : finger0.offset == null ? {x: 0, y: 0} : finger0.offset
												  });
				break;
			case this.eGesture.pinch:
				_element.events.onGestureProgress({
													  action  : _element.action,
													  distance: Math.floor(finger1.position.Substract(finger0.position).Amplitude() - finger1.anchor.Substract(finger0.anchor).Amplitude())
												  });
				break;
			case this.eGesture.rotate:
				_element.events.onGestureProgress({
													  action: _element.action,
													  angle : (Math.acos(finger0.position.Substract(finger0.position.BaryCenter(finger1.position)).DotProd(new Vector(1, 0))) - _element.startAngle) * 180 / Math.PI
												  });
				break;
		}
	}

	/**
	 * Finger touch move
	 *
	 * @param _event
	 * @private
	 */
	_OnTouchMove(_event) {
		this._Common_OnGestureProgress(this._ForEachChangedTouch(_event, (_element, _touch) => {
			this._Common_OnTouchMove(_element, _touch.identifier, _touch);
		}));
	}

	/**
	 * Mouse move
	 *
	 * @param _event
	 * @private
	 */
	_OnMouseMove(_event) {
		this._Common_OnGestureProgress(this._ForMouseEvent(_event, (_element) => {
			this._Common_OnTouchMove(_element, "mouse", _event);
		}));
	}

	/**
	 * Common touch end code
	 *
	 * @param _element
	 * @param _identifier
	 * @private
	 */
	_Common_OnTouchEnd(_element, _identifier) {
		const finger = this._GetFinger(_element, _identifier);
		if (_element.events.onFingerRelease != null)
			_element.events.onFingerRelease(finger);
		_element.fingers.splice(_element.fingers.indexOf(finger), 1);
	}

	/**
	 * Common gestures end code
	 *
	 * @param _event
	 * @param _element
	 * @private
	 */
	_Common_OnGestureEnd(_event, _element) {
		if (_element.fingers.length != 0 || _element.action == null)
			return;
		if (_element.events.onGestureEnd != null)
			_element.events.onGestureEnd({action: _element.action});
		_element.action = null;
	}

	/**
	 * Finger touch end
	 *
	 * @param _event
	 * @private
	 */
	_OnTouchEnd(_event) {
		this._Common_OnGestureEnd(_event, this._ForEachChangedTouch(_event, (_element, _touch) => {
			this._Common_OnTouchEnd(_element, _touch.identifier);
		}));
	}

	/**
	 * Mouse up
	 *
	 * @param _event
	 * @private
	 */
	_OnMouseUp(_event) {
		this._Common_OnGestureEnd(_event, this._ForMouseEvent(_event, (_element) => {
			this._Common_OnTouchEnd(_element, "mouse");
		}));
		_event.currentTarget.releasePointerCapture(1);
	}
}
