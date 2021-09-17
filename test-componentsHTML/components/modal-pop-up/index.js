/**
 * Created by jetbrains web development IDE ( Web/PhpStorm ).
 * Project: define-newElementHTML - myProject
 * User: Pascal Gaudin
 * Mail: al.gau@free.fr
 * Date: 11/06/2021
 * Time: 11:01
 */


window.addEventListener('load',function(){
Cr.importScript(    'pop-up.js' );
 customElements.define('my-modalpopin',  PopUpInfo);
// Define the new element
})

