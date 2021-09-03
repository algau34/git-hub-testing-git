#**GENERATE a documentation with JSDOC and nodeJs**


Installation and Usage
----------------------

**Usage :**

`"node.exe" node_modules/jsdoc/jsdoc.js 
--configure node_modules/jsdoc/config.json 
mainline\CppWebUIDll\resource 
-r -d mainline\CppWebUIDll\resource/doc/ 
--verbose`

**Install :** 
 
`npm install --save-dev jsdoc`

--------------------------------------------------------
**_important_** :


For jsDoc 's working correctly with js (some type is not taken, like [{}], etc.),  you must replace file **_jsdoc/lib/jsdoc/tag/type.js**_ by the file _**type.js**_ of dir _**patch-jsdoc**_ in dir **ressource** or apply patch (there 's so the css ans js improvment for the template docdash )

--------------------------------------------------------

You must specify the configuration in the file ("`node_modules/jsdoc/config.json`"),
"config.json",  may be elsewhere and have another name.
"`mainline\CppWebUIDll\resource`" is the js file folder for which you need to generate the doc .
"`mainline\CppWebUIDll\resource/doc/`" is where it will get the doc.

--------------------------------------------------------
**_paths_** :

To access this doc, you need to copy this directory url and paste it into the browser's address bar. Doc will be generated in HTML .

**file:///D:/project-mainline/zimmer-robotics/mainline/CppWebUIDll/resource/doc/index.html for ex.**


For this doc , the template used is  docdash for jsDoc , you can to use [**another template**](https://cancerberosgx.github.io/jsdoc-templates-demo/demo/).

--------------------------------------------------------
for to install template **docdash** :

`npm install jsdoc-dash-template --save-dev`

--------------------------------------------------------
with  _**config**_( example)  : 
`{"source": {
"exclude": ["doc","notUsed"  ],
"includePattern": ".js$",
"excludePattern": "(node_modules/|notUsed|docs?/|__.js$)"},
"plugins": ["plugins/markdown"],
"docdash": {
"static":true,
"sort":true,
"sectionOrder": [
"Classes",
"Modules",
"Externals",
"Events",
"Namespaces",
"Mixins",
"Tutorials",
"Interfaces"
],
"disqus": "","openGraph": {
"title": "",
"type": "website",
"image": "",
"site_name": "",
"url": ""
},
"meta": {
"title": "",
"description": "",
"keyword": ""
},
"search": true,
"commonNav": true,
"collapse": true,
"wrap":true,
"typedefs":true,
"navLevel":1,
"private":true ,
"removeQuotes": "none",
"scripts": [], "scopeInOutputPath":true,
"nameInOutputPath":true ,
"versionInOutputPath":true } ,"opts": { "destination": "doc",
"encoding": "utf8",
"recurse": true,
"verbose": true,
"template": "./node_modules/docdash"
} }` 

This config's file is in dir **patch-jsdoc/docdash**

--------------------------------------------------------
**It is not recommended to update jsDoc and docDash. This may not walk.** 
