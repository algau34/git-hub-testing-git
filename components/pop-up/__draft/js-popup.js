/**
 * Created by jetbrains web development IDE ( Web/PhpStorm ).
 * Project: define-newElementHTML - spineNav
 * User: Pascal Gaudin
 * Mail: pascal.gaudin@zimmerbiomet.com
 * Date: 11/06/2021
 * Time: 20:36
 */


var _params = {
	"id":"mypopin_modal-dlg",
	"show": true,
//type : none, error, timer, warning, success, info, valid, input, wait, progress
	"type": "input",
	"title": "shut down the device?",
	"PrimaryMessage": "Do you really want to shut down the device?..." +
					  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor" +
					  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
	"SecondaryMessage": "This will shutdown the device ,..." +
						"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor,Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
	"buttons":
		[
			{
				"id": "wsCM_dialog_yesBtn",
				"text": "Yes"
			},
			{
				"id": "wsCM_dialog_noBtn",
				"text": "      No     ",// if nbrChar < 10 then  _button width will be small
				// for the real life :
				//event:{type:"click",
				// methodCalled:"myMethodCpp",expectedParams:["param1","param2","param3"]}

			}
		]
};


cwui.addCustom("SetDialog", function (_params, _done) {

	_params = this.attributes;

	var wsElmtDialog = shadow;

	if (_params.hasOwnProperty('show') && _params.show == true) {

		wsElmtDialog.parentNode.classList.add('Modal_Screen_On');
		if (_params.hasOwnProperty('type') == false) _params.type = "none";


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
						button.classList.add('small');

					} else if ((_button.hasOwnProperty('widthNarrow') && _button.widthNarrow == false) ||
							   (!_button.hasOwnProperty('widthNarrow') && button.classList.contains('small') &&
								_button.text.length >= 10)) {
						button.parentNode.classList.remove('posRight');
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
				wsElmtDialog.querySelectorAll('.ButtonBar.Horizontal>button.StandardButton:not(:first-child)').
				forEach((button) => button.parentNode.removeChild(button));
				firstButton.removeAttribute('id');
				firstButton.classList.replace('show', 'hide');
				firstButton.innerText = "";
			}
		}
	}
});
