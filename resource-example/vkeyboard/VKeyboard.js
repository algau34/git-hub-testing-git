/**
 * @class
 * generic virtual keyboard
 */
class VirtualKeyboard
{
	/**
	 * Virtual Keyboard ctor: just call initialization
	 * @constructor
 	 */
	constructor() {
		this._Init();
	}

	/**
	 * initialization: load all requiered files and create
	 * a FingerActions object
	 * @async
 	 * @returns {Promise<void>}
	 * @private
	 */
	async _Init() {
		this.fileCache = new FileCache();
		var templates = [ "page", "container", "panel", "row", "key", "single_key", "icon", "lock", "header" ];
		this.templates = {};
		for( var i = 0; i < templates.length; i++ )
			this.templates[ templates[ i ] ] = await this.fileCache.load( "vkeyboard/t_" + templates[ i ] + ".htm" );
		this.keyMap = {};
		this.keyMap[ "num" ] = JSON.parse( await this.fileCache.load( "vkeyboard/num.json" ) );
		this.mapList = [ "eng", "fra" ];
		for( var i = 0; i < this.mapList.length; i++ )
			this.keyMap[ "alpha_" + this.mapList[ i ] ] = JSON.parse( await this.fileCache.load( "vkeyboard/alpha_" + this.mapList[ i ] + ".json" ) );
		this.referenceElement = null;
		this.fa = new FingerActions();
		this.Map();
	}

	/**
	 *  bind current virtual keyboard over input element candidates
	 *
	 * @param _div
	 */
	Bind( _div ) {
		_div.querySelectorAll( "input[vkeyboard]" ).forEach( ( _element )=>{
			// show the virtual keyboard when clicking on the input
			_element.addEventListener( "focus", ()=>{
				_element.blur();
				this._Show( _element );
			} );
		} );
	}

	/**
	 * change virtual keyboard mapping: if currently opening,
	 * perform a live content reloading
	 * @param _lang
	 */
	Map( _lang ) {
		this.lang = _lang;
		if( this.referenceElement )
			this._Build();
	}

	/**show the virtual keyboard, related to a given element:
	 * - set done setter function to reinject the input value
	 * - extract current input configuration
	 * - get current input value as default
	 * - build the virtual keyboard using configuration
	 * - display the keyboard
	 * @param _element
	 * @private
	 */
	_Show( _element ) {
		this.referenceElement = _element;
		this.kbElement = document.getElementById( "virtual-keyboard" );
		this.fnDone = ( _value )=>{
			_element.value = _value;
			_element.dispatchEvent( new Event( "change" ) );
		};
		this.config = {
			password: _element.getAttribute( "type" ) == "password",
			min: _element.getAttribute( "min" ) || 0,
			max: _element.getAttribute( "max" ) || 1000,
			digit: _element.getAttribute( "inputmode" ) == "numeric"
		};
		this.defaultValue = _element.value;
		this.value = this.defaultValue;
		this._Build();
		delegate( ()=>{
			this.kbElement.style.display = "flex";
		} );
	}

	/**
	 * build the virtual keyboard by creating DOM content
	 * @private
	 */
	_Build() {
		this.keyId = 1;
		this.action = "std";
		this.lock = false;
		this.temporaryAction = "";
		this.temporaryKey = null;
		this.valid = true;
		this.mainChars = [];
		var container_bottom = "";
		var lang = this.mapList.find( ( _lang )=>{ return _lang == this.lang; } ) || "eng";
		container_bottom += replaceVariables( this.templates.panel, [ [ "pos", "left" ], [ "content", this._DumpPanel( "alpha_" + lang ) ] ] );
		container_bottom += replaceVariables( this.templates.panel, [ [ "pos", "right" ], [ "content", this._DumpPanel( "num" ) ] ] );
		var content = "";
		content += replaceVariables( this.templates.container, [ [ "pos", "top" ], [ "content", replaceVariables( this.templates.header, [] ) ] ] );
		content += replaceVariables( this.templates.container, [ [ "pos", "bottom" ], [ "content", container_bottom ] ] );
		this.kbElement.innerHTML = replaceVariables( this.templates.page, [ [ "content", content ] ] );
		this._UpdateValue();
		this._HeaderActions();
	}

	/**
	 * called when closing the virtual keyboard: call
	 * the setter function and hide the virtual keyboard
	 * @param _value
	 * @private
	 */
	_Done( _value ) {
		this.fnDone( _value );
		this.referenceElement = null;
		this.kbElement.style.display = "none";
	}

	/**
	 * set header actions (cancel, clear, ok and input field)
	 * @private
	 */
	_HeaderActions() {
		delegate( ()=>{
			var virtual_keyboard_cancel = document.getElementById( "virtual-keyboard-cancel" );
			this.fa.Bind( virtual_keyboard_cancel, { onFingerPress: ()=>{
					virtual_keyboard_cancel.classList.add( "active" );
					this._Done( this.defaultValue );
				}, onFingerRelease: ()=>{
					virtual_keyboard_cancel.classList.remove( "active" );
				}
			} );
			var virtual_keyboard_clear = document.getElementById( "virtual-keyboard-clear" );
			this.fa.Bind( virtual_keyboard_clear, { onFingerPress: ()=>{
					virtual_keyboard_clear.classList.add( "active" );
					this.value = this.defaultValue;
					this._UpdateValue();
				}, onFingerRelease: ()=>{
					virtual_keyboard_clear.classList.remove( "active" );
				}
			} );
			var virtual_keyboard_ok = document.getElementById( "virtual-keyboard-ok" );
			this.fa.Bind( virtual_keyboard_ok, { onFingerPress: ()=>{
					virtual_keyboard_ok.classList.add( "active" );
					this._Done( this.value );
				}, onFingerRelease: ()=>{
					virtual_keyboard_ok.classList.remove( "active" );
				}
			} );
			var valueElement = document.getElementById( "virtual-keyboard-value" );
			valueElement.addEventListener( "input", ()=>{
				this.value = valueElement.value;
				this._UpdateValue();
			} );
			valueElement.addEventListener( "keyup", ( _event )=>{
				if( _event.keyCode === 13 && this.valid )
					this._Done( this.value );
			} );
			valueElement.setAttribute( "type", this.config.password ? "password" : "text" );
			this._ScrollInput();
		} );
	}

	/**
	 * automatically scroll right in the input field, eventually
	 * set focus on non-mobile devices (allowing alternative
	 * real keyboard usage by default)
	 * @private
	 */
	_ScrollInput() {
		var valueElement = document.getElementById( "virtual-keyboard-value" );
		valueElement.setSelectionRange( valueElement.value.length, valueElement.value.length );
		valueElement.scrollLeft = valueElement.scrollWidth;
		delegate( ()=>{
			if( ! /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test( navigator.userAgent ) )
				valueElement.focus();
		} );
	}

	/**
	 * dump a given panel (alphabetical or numerical)
	 * @param _name
	 * @returns {string}
	 * @private
	 */
	_DumpPanel( _name ){
		var content = "";
		this.keyMap[ _name ].forEach( ( _row )=>{ content += this._DumpRow( _row ); } );
		return content;
	}

	/**
	 *  switch virtual keyboard to a specific key location (std, shift or alt)
	 * @param _action
	 * @private
	 */
	_SwitchTo( _action ) {
		for( var i = 1; i < this.keyId; i++ ) {
			var prevElement = document.getElementById( "virtual-keyboard-high-" + this.action + i );
			if( prevElement )
				prevElement.classList.remove( "highlight" );
			var newElement = document.getElementById( "virtual-keyboard-high-" + _action + i );
			if( newElement )
				newElement.classList.add( "highlight" );
		}
		this.action = _action;
	}

	/**
	 * update the current value of the input field, check for digt restriction, validity and scroll right
	 * @private
	 */
	_UpdateValue() {
		delegate( ()=>{
			if( this.config.digit )
				this.value = this.value.replace( /[^\d]/g, "" );
			this._CheckValidity();
			document.getElementById( "virtual-keyboard-value" ).value = this.value;
			this._ScrollInput();
		} );
	}

	/**
	 * check for value validity regarding constraints (min & max data length)
	 * @private
	 */
	_CheckValidity() {
		var valid = this.value.length >= this.config.min && this.value.length <= this.config.max;
		if( this.valid == valid )
			return;
		if( valid )
			document.getElementById( "virtual-keyboard-ok" ).classList.remove( "invalid" );
		else
			document.getElementById( "virtual-keyboard-ok" ).classList.add( "invalid" );
		this.valid = valid;
	}

	/**
	 * clear current temporary
	 * @private
	 */
	_ClearTemporary() {
		this._SwitchTo( this.lock ? "shift" : "std" );
		document.getElementById( this.temporaryKey ).classList.remove( "active" );
		if( this.temporaryAction != "alt" )
			this._TransformMainChars( this.lock );
		this.temporaryAction = "";
		this.temporaryKey = null;
	}

	/**
	 * common finger actions related to shift & alt keys
	 * @param _key_id
	 * @param _fn
	 * @private
	 */
	_ShiftAltActions( _key_id, _fn ) {
		delegate( ()=>{
			var key = document.getElementById( _key_id );
			this.fa.Bind( key, { onFingerPress: ()=>{
					var temporaryIsAction = _key_id == this.temporaryKey;
					if( this.temporaryKey != null ) {
						this._ClearTemporary();
						if( temporaryIsAction )
							return;
					}
					key.classList.add( "active" );
					var action = _fn();
					this._SwitchTo( action );
					if( action != "alt" )
						this._TransformMainChars( !this.lock );
					this.temporaryAction = action;
					this.temporaryKey = _key_id;
				}, onFingerRelease: ()=>{}
			} );
		} );
	}

	/**
	 * transform main chars
	 * @param _uppercase
	 * @private
	 */
	_TransformMainChars( _uppercase ) {
		this.mainChars.forEach( ( _id )=>{
			var char = document.getElementById( _id );
			if( _uppercase )
				char.classList.remove( "lowercase" );
			else
				char.classList.add( "lowercase" );
		} );
	}

	/**
	 * finger action of the lock key
	 * @param _key_id
	 * @private
	 */
	_LockAction( _key_id ) {
		delegate( ()=>{
			var key = document.getElementById( _key_id );
			this.fa.Bind( key, { onFingerPress: ()=>{
					key.classList.add( "active" );
				}, onFingerRelease: ()=>{
					key.classList.remove( "active" );
					if( this.lock ) {
						document.getElementById( _key_id + "lock" ).classList.remove( "on" );
						this._SwitchTo( "std" );
						this.lock = false;
						this._TransformMainChars( false );
						return;
					}
					document.getElementById( _key_id + "lock" ).classList.add( "on" );
					this._SwitchTo( "shift" );
					this.lock = true;
					this._TransformMainChars( true );
				}
			} );
		} );
	}

	/**
	 * finger action of the backspace key
	 * @param _key_id
	 * @private
	 */
	_BackSpaceAction( _key_id ) {
		delegate( ()=>{
			var key = document.getElementById( _key_id );
			this.fa.Bind( key, { onFingerPress: ()=>{
					key.classList.add( "active" );
					if( !this.value )
						return;
					this.value = this.value.slice( 0, -1 );
					this._UpdateValue();
				}, onFingerRelease: ()=>{
					key.classList.remove( "active" );
				}
			} );
		} );
	}

	/**
	 * 	default finger action (dump selected character)
	 * @param _key_id
	 * @param _col
	 * @private
	 */
	_DefaultAction( _key_id, _col ) {
		delegate( ()=>{
			var key = document.getElementById( _key_id );
			this.fa.Bind( key, { onFingerPress: ()=>{
					key.classList.add( "active" );
					var character = this.action == "std" ? _col[ 1 ] : ( this.action == "shift" ? _col[ 0 ] : _col[ 2 ] );
					if( !character )
						character = this.action == "alt" && this.lock ? _col[ 0 ].toUpperCase() : _col[ 0 ].toLowerCase();
					this.value += character;
					this._UpdateValue();
					if( this.temporaryAction != "" )
						this._ClearTemporary();
				}, onFingerRelease: ()=>{
					key.classList.remove( "active" );
				}
			} );
		} );
	}

	/**
	 * dump a whole row of keys
	 * @param _row
	 * @returns {*}
	 * @private
	 */
	_DumpRow( _row ){
		var content = "";
		_row.forEach( ( _col )=>{
			var id = _col[ 5 ] ? 0 : this.keyId;
			var key_id = "virtual-keyboard-key-" + this.keyId++;
			if( _col[ 0 ] >= 'A' && _col[ 0 ] <= 'Z' )
				this.mainChars.push( "char-" + key_id );
			var shift = _col[ 0 ];
			switch( _col[ 5 ] ) {
				case "shift":
					this._ShiftAltActions( key_id, ()=>{ return this.lock ? "std" : "shift"; } );
					shift = replaceVariables( this.templates.icon, [ [ "icon", "shift" ] ] );
					break;

				case "alt":
					this._ShiftAltActions( key_id, ()=>{ return "alt"; } );
					shift = replaceVariables( this.templates.icon, [ [ "icon", "alt" ] ] );
					break;

				case "lock":
					this._LockAction( key_id );
					shift = replaceVariables( this.templates.lock, [ [ "id", key_id + "lock" ] ] );
					break;

				case "backspace":
					this._BackSpaceAction( key_id );
					shift = replaceVariables( this.templates.icon, [ [ "icon", "backspace" ] ] );
					break;

				default:
					this._DefaultAction( key_id, _col );
			}
			var keyValue = parseInt( _col[ 0 ] );
			var disable = this.config.digit && _col[ 5 ] != "backspace" && ( !( keyValue >= 0 && keyValue <= 9 ) || _col[ 1 ] ) ? " disable" : "";
			var template = ( !_col[ 4 ] || ( !_col[ 1 ] && !_col[ 2 ] ) ) ? this.templates.single_key : this.templates.key;
			content += replaceVariables( template, [ [ "key_id", key_id ], [ "id", id ], [ "enabled", _col[ 4 ] ? "" : " disabled" ], [ "system", _col[ 5 ] ? " system" : "" ], [ "grow", _col[ 3 ] * 100 ], [ "shift", shift ], [ "std", _col[ 1 ] ], [ "alt", _col[ 2 ] ], [ "disable", disable ] ] );
		} );
		return replaceVariables( this.templates.row, [ [ "content", content ] ] );
	}
};
