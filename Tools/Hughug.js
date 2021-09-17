/**
 * Created by jetbrains web development IDE ( Web/PhpStorm ).
 * Project: define-newElementHTML - myProject
 * User: Pascal Gaudin
 * Mail: al.gau@free.fr
 * Date: 30/06/2021
 * Time: 14:47
 */



/**
 * @classdesc engine template
 * @type {Hughug}
 */
var Hughug=class Hughug  {

	/**
	 *
	 */
	constructor() {


	}

	/**
	 *
	 * @param xhtml
	 * @param data
	 * @returns {string}
	 * @private
	 */
	_includeXHTML(xhtml,data){
		var regexInclude=/\{{2}include\s+([^}]+)\s*\}{2}/gm;
		var binds = [...xhtml.matchAll(regexInclude)];
		if(binds.length!=0)  {

			binds.forEach( (bind)=>{
				var file =bind[1];
				var response= Cr.getFile(file,false ) ;
				if(regexInclude.test(response)) response= this._includeXHTML(response);
				xhtml = xhtml.replace(regexInclude,response);
			})
		}
		return xhtml;
	}

	/**
	 *
	 * @param xhtml
	 * @param data
	 * @returns {*}
	 * @private
	 */
	_dataXHTML(xhtml,data) {
		var regexData=/\{{2}\s*([^}]+)\s*\}{2}/gm;
			 [...xhtml.matchAll(regexData)].forEach((bind)=> {
				var key = bind[1].trim();
				if( data.hasOwnProperty( key ) ) {
					if(data[key] instanceof Array) data[key]='['+data[key].join(',')+']';
					if(data[key] instanceof Object)  data[key]= JSON.stringify(data[key] )  ;
					var replRegex=new RegExp("\{{2}" + key +"\}{2}","gm");
					xhtml  = xhtml.replace(replRegex , data[key]);
				}
			});
			xhtml   = xhtml.replace(/(\{{2}\s*["']?([^"']+)["']\s*?\}{2})/gm, "$2");
		return xhtml  ;
	}

	/**
	 *
	 * @param xhtml
	 * @param data
	 * @returns {*}
	 * @private
	 */
	_loopXHTML(xhtml,data) {
		xhtml=xhtml.replace(/[\t\r\n\v]+/,'');
		var regexVar= bind =>new RegExp("\{{2}\s*" + bind + "\s*\}{2}","gm" );
		var regexLoop=/(\{{2}loop\s+([^}]+)\s*\}{2})(([\s\S]*?)(\{{2}\/loop\s*\}{2}))/gm;
		[... xhtml.matchAll( regexLoop)].forEach( bind => {
			var partXhtml="" ;

			if(data.hasOwnProperty(bind[2]) && data[bind[2]] instanceof Array) {
				data[bind[2]].forEach((value,index)=>{
					partXhtml +=bind[4];
					if(value instanceof Object==false) {
						partXhtml =partXhtml.replace(regexVar(bind[2]),value);
					}  else {
						for(var k in value)	{
							var sVar= regexVar(bind[2].toString()+"\."+ k.toString() );
							partXhtml =partXhtml.replace(sVar , value[k] );
						}
					}
				})
			}
			xhtml = xhtml.replace(bind[0],partXhtml);
		});

		return xhtml;
	}

	/**
	 * @param xhtml
	 * @param data
	 * @returns {*}
	 * @private
	 */
	_ifElseXHTML(xhtml,data){
		xhtml=xhtml.replace(/[\t\r\n\v]*/gm,'');
		var dataList= Object.keys(data),
			myData = new RegExp("(" + dataList.join(")|(") + ")","gm") ;

		var regexIf =/(\{{2}\s*(else)?(\s?(\/)?if(\s+[^}]+\s*)?)?\}{2})/gm;
		var regexCond= /(\{{2}if\s+([^}]+)\s*\}{2})(([\s\S]*?)(\{{2}\/if\s*\}{2}))/gm
		var  conds=[], ifs=[];
		[...xhtml.matchAll(  regexIf )].forEach( bind => {

			if(bind[5]||bind[2]) {
				var stHtml=bind.index + bind[0].length,
					pos={st:stHtml, ed: stHtml+xhtml.slice(stHtml).search(/\{{2}\s*((else)|(\/if))/)};
				var cHtml={};
				if(bind[5] ) cHtml.cond=bind[5].trim();
				cHtml.html	= xhtml.slice(pos.st,pos.ed);
				ifs.push(cHtml);
			}
			if(bind[3]=='/if') conds.push(ifs),ifs=[];
		});

		[...xhtml.matchAll(  regexCond )].forEach((bind,idx) => {
			var  _blckHtmlCond,newCond;
			if(conds.length!==0)while(  _blckHtmlCond=conds[idx].shift() ) {
				if( _blckHtmlCond.hasOwnProperty('cond')) {
					newCond = eval('()=>'+  _blckHtmlCond.cond.replace(myData,"data.$&"))();
					if(newCond !== true) continue;
				}
				if( _blckHtmlCond.hasOwnProperty('html')) {
					xhtml=xhtml.replace(bind[0],  _blckHtmlCond.html);
					break;
				}
			}
		})
		return xhtml;
	}

	/**
	 *
	 * @param html
	 * @param data
	 * @returns {*}
	 */
    perform(html,data){
		html = this._includeXHTML(html);
		html = this._ifElseXHTML(html,data );
		html = this._loopXHTML(html, data);/**/
		html = this._dataXHTML(html,data );
		return html;
	}
}
