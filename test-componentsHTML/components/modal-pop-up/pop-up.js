PopUpInfo=class PopUpInfo extends HTMLElement {

	/**
	 *
	 * @type {string}
	 */
	static dir='../modal-pop-up/';
	/**
	 *
	 */
	constructor() {
		// Always call super first in constructor
		super();
		this._params = {};
		// Create some CSS to apply to the shadow dom
		// Create a shadow root
		var shadow = this.attachShadow({mode: 'open'});


		var sheet1 = Tools.importStyleSheetInXHTMLElement(PopUpInfo.dir+'buttonBar.css', shadow);
		var sheet2 = Tools.importStyleSheetInXHTMLElement(PopUpInfo.dir+'pop-up.css', shadow);
		//var shadow =document.body.createShadowRoot();
		// Create spans
		var wrapper = document.transformXHTMLToDom(PopUpInfo.dir+'pop-up.html').children.item(0);

		this._updateparams();
		// attach the created elements to the shadow dom

		this._lifeUpdateTagElmt();
		var base = document.createElement('base');
		base.href=PopUpInfo.dir;
		this.insertAdjacentElement('afterbegin',base);
		var wrapper = shadow.appendChild(wrapper);
		this._assignDom(wrapper);
		//shadow.getCalculatedCss( )
	}

	/**
	 *
	 * @private
	 */
	_lifeUpdateTagElmt() {
		var modifsAllowed = {
			PrimaryMessage  :
				{
					attributes: function (targetNode) {
						var clIconStatus = targetNode.shadowRoot.getElementById('iconStatus').classList;
						clIconStatus.replace([...clIconStatus].pop(), this.target.getAttribute(this.attributeName));
					},
					childList : function (targetNode) {
						targetNode.shadowRoot.getElementById('PrimaryMessage').innerText = this.addedNodes[0].data;
					},
				},
			SecondaryMessage: {
				childList: function (targetNode) {
					targetNode.shadowRoot.getElementById('SecondaryMessage').innerText = this.addedNodes[0].data;
				}
			},
			button          : {},
		}

           var containner =  document.querySelector('#mypopin_modal-dlg');

		for(var elmtName in modifsAllowed) {
			var targetNodes = containner.querySelectorAll( elmtName);
			targetNodes.forEach((_targetNode)=>{
				var config={characterData:true};
				// subtree:true,
				// attributeOldValue:true,
				// characterDataOldValue:true,
				// attributeFilter:[]
				Object.keys(modifsAllowed[elmtName]).forEach( entry => config[entry] = true);
				if(config) var observer = new MutationObserver(function(_modifAllowed,mutationsList)  {
					for (var mutation of mutationsList) {
						if(typeof _modifAllowed[mutation.type] =='function'  )
							_modifAllowed[mutation.type].call(mutation,this);
					}
				}.bind(containner,modifsAllowed[elmtName]));
				observer.observe(_targetNode, config);
			})
	}
	}

	/**
	 *
	 * @private
	 */
	_updateparams() {
		Array.from(this.attributes).forEach(attr => {
			this._params[attr.name] = /(true)|(false)/gmi.test(attr.value.trim()) ? eval(attr.value) : attr.value;
		});
		var buttons = this.querySelectorAll('button');
		var primaryMessage = this.querySelector('PrimaryMessage');
		var secondaryMessage = this.querySelector('SecondaryMessage');
		if (primaryMessage.hasAttribute('type')) this._params['type'] = primaryMessage.getAttribute('type');
		this._params['primaryMessage'] = primaryMessage.textContent;
		this._params['secondaryMessage'] = secondaryMessage.textContent;

		if (buttons.length > 0) {
			this._params['buttons'] = [];
			buttons.forEach((button, idx) => {
				this._params['buttons'][idx] = {
					"id"  : button.getAttribute('id'),
					"text": button.getAttribute('value'),
				};
				if (button.hasAttribute('widthNarrow'))
					this._params['buttons'][idx]['widthNarrow'] = eval(button.getAttribute('widthNarrow'));
			})
		}
	}


	/**
	 *
	 * @param shadow
	 * @private
	 */
	_assignDom(shadow) {

		var _params = this._params;
		var wsElmtDialog = shadow;

		if (_params.hasOwnProperty('show') && _params.show == true) {
			this.parentNode.classList.add('Modal_Screen_On');
			if (_params.hasOwnProperty('type') == false) _params.type = "none";
			if (_params.hasOwnProperty('width') != false) wsElmtDialog.children.item(0).style.width = _params.width;
			wsElmtDialog.querySelector('.title').innerText = _params.title;
			var clStatus = wsElmtDialog.querySelector('.left-box-status').classList;
			if (clStatus.length > 1) {
				clStatus.replace(clStatus.item(clStatus.length - 1), _params.type);
			} else {
				clStatus.add(_params.type);
			}

			/*		var charSizeMaxChunk = 80
					if (_params.primaryMessage.length < charSizeMaxChunk) {
						var size = 25;
						var primaryMessage = Array.from(_params.primaryMessage).reduce((acc, _, i, arr) =>
																						   (i % size) ? acc : [...acc, arr.slice(i, i + size)], []);
						_params.primaryMessage = primaryMessage.map(arr => arr.length === size ?
																		   arr.join('').replace(/(\s)([^\s]*)$/, '<br/>$2') : arr.join('')).join('');
					}*/

			wsElmtDialog.querySelector('.Instructions-1').innerHTML = _params.primaryMessage;
			wsElmtDialog.querySelector('.Instructions-2>span').innerHTML = _params.secondaryMessage;

			if (_params.hasOwnProperty('buttons') == true || _params.buttons.length !== 0)
				_params.buttons.forEach((_button, index) => {
					var buttons = wsElmtDialog.querySelectorAll('.ButtonBar.Horizontal>button.StandardButton');
					var button = buttons.item(buttons.length - 1);

					if (index > 0) button = button.parentNode.appendChild(button.cloneNode(true));

					if (_button.hasOwnProperty('text') && _button.text != "") {
						button.classList.replace('hide', 'show');
						if ((_button.hasOwnProperty('widthNarrow') && _button.widthNarrow == true) ||
							(!_button.hasOwnProperty('widthNarrow') && _button.text.length < 10)) {
							button.parentNode.classList.add('posRight');
							if (button.classList.contains('long-adjust')) button.classList.replace('long-adjust', 'small'); else
								button.classList.add('small');

						} else if ((_button.hasOwnProperty('widthNarrow') && _button.widthNarrow == false) ||
								   (!_button.hasOwnProperty('widthNarrow') && button.classList.contains('small') &&
									_button.text.length >= 10)) {
							button.parentNode.classList.remove('posRight');
							if (button.classList.contains('small')) button.classList.replace('small', 'long-adjust'); else
								button.classList.remove('small');
						}
						button.innerText = _button.text;

					} else {
						button.classList.replace('show', 'hide');
					}
					button.id = _params.prefix + _button.id;
				});

		} else {
			wsElmtDialog.parentNode.classList.remove('Modal_Screen_On');
			var firstButton = wsElmtDialog.querySelector('.ButtonBar.Horizontal>button.StandardButton');

			wsElmtDialog.parentNode.ontransitionend = function () {
				var opacity = window.getComputedStyle(this, null).getPropertyValue('opacity');
				if (opacity == 0) {
					wsElmtDialog.querySelectorAll('.ButtonBar.Horizontal>button.StandardButton:not(:first-child)').forEach((button) => button.parentNode.removeChild(button));
					firstButton.removeAttribute('id');
					firstButton.classList.replace('show', 'hide');
					firstButton.innerText = "";
				}
			}
		}
	}
}



