/**
 * Created by jetbrains web development IDE ( Web/PhpStorm ).
 * Project: define-newElementHTML - spineNav
 * User: Pascal Gaudin
 * Mail: pascal.gaudin@zimmerbiomet.com
 * Date: 23/08/2021
 * Time: 12:57
 */

function ready() {

	return new Promise((resolve, reject) => {
		var img_ = new Image();
		img_.src = "https://images.ctfassets.net/hrltx12pl8hq/4plHDVeTkWuFMihxQnzBSb/aea2f06d675c3d710d095306e377382f/shutterstock_554314555_copy.jpg";
		var tmpImg;
		img_.onload= (event) => {
			if(tmpImg=document.body.appendChild(img_)) {
				if (document.body.contains(tmpImg)) {
					resolve(true);
					document.body.removeChild(tmpImg);
				} else {
					reject(false);
				}
				;
			};}


		img_.onerror= (event) => {  reject(false) };
	});
	;}
