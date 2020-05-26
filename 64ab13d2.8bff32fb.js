/*! For license information please see 64ab13d2.8bff32fb.js.LICENSE.txt */
(window.webpackJsonp=window.webpackJsonp||[]).push([[40],{176:function(e,n,t){"use strict";t.r(n),t.d(n,"frontMatter",(function(){return i})),t.d(n,"metadata",(function(){return u})),t.d(n,"rightToc",(function(){return c})),t.d(n,"default",(function(){return s}));var r=t(1),o=t(9),a=(t(254),t(253)),i={id:"relationships",title:"Model Relationships",sidebar_label:"Model Relationships"},u={id:"crud/relationships",title:"Model Relationships",description:"NOTE: This document is outdated and needs more work",source:"@site/../docs/crud/relationships.md",permalink:"/docs/next/crud/relationships",editUrl:"https://github.com/aerogear/graphback/edit/master/website/../docs/crud/relationships.md",version:"next",sidebar_label:"Model Relationships"},c=[{value:"Database Relationships",id:"database-relationships",children:[{value:"OneToOne",id:"onetoone",children:[]},{value:"OneToMany",id:"onetomany",children:[]}]}],l={rightToc:c};function s(e){var n=e.components,t=Object(o.a)(e,["components"]);return Object(a.b)("wrapper",Object(r.a)({},l,t,{components:n,mdxType:"MDXLayout"}),Object(a.b)("blockquote",null,Object(a.b)("p",{parentName:"blockquote"},"NOTE: This document is outdated and needs more work")),Object(a.b)("h2",{id:"database-relationships"},"Database Relationships"),Object(a.b)("p",null,"Graphback supports ",Object(a.b)("inlineCode",{parentName:"p"},"one-to-one")," and ",Object(a.b)("inlineCode",{parentName:"p"},"one-to-many")," relationships and provides out of the box support for the schema and resolvers accordingly."),Object(a.b)("h3",{id:"onetoone"},"OneToOne"),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{className:"language-graphql"}),'"""\n@model\n"""\ntype Profile {\n  id: ID!\n  """\n  @oneToOne\n  """\n  user: User!\n}\n\n"""\n@model\n"""\ntype User {\n  id: ID!\n  name: String\n}\n')),Object(a.b)("p",null,"This creates a relationship via a ",Object(a.b)("inlineCode",{parentName:"p"},"userId")," column in the ",Object(a.b)("inlineCode",{parentName:"p"},"profile")," table. You can customize the key tracking the relationship with the ",Object(a.b)("inlineCode",{parentName:"p"},"key")," annotation:"),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{className:"language-graphql"}),'"""\n@model\n"""\ntype Profile {\n  id: ID!\n  """\n  @oneToOne key: \'user_id\'\n  """\n  user: User!\n}\n\n"""\n@model\n"""\ntype User {\n  id: ID!\n  name: String\n}\n')),Object(a.b)("p",null,"This maps ",Object(a.b)("inlineCode",{parentName:"p"},"Profile.user")," to ",Object(a.b)("inlineCode",{parentName:"p"},"profile.user_id")," in the database."),Object(a.b)("h3",{id:"onetomany"},"OneToMany"),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{className:"language-graphql"}),'"""\n@model\n"""\ntype Note {\n  id: ID!\n  title: String!\n  """\n  @oneToMany field: \'note\'\n  """\n  comments: [Comment]\n}\n')),Object(a.b)("p",null,"This creates a relationship between ",Object(a.b)("inlineCode",{parentName:"p"},"Note.comments")," and ",Object(a.b)("inlineCode",{parentName:"p"},"Comment.note")," and maps to ",Object(a.b)("inlineCode",{parentName:"p"},"comment.noteId")," in the database. If ",Object(a.b)("inlineCode",{parentName:"p"},"Comment.note")," does not exist it will be generated for you."),Object(a.b)("p",null,"With the ",Object(a.b)("inlineCode",{parentName:"p"},"key")," annotation you can customise the database column to map to."),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{className:"language-graphql"}),'"""\n@model\n"""\ntype Note {\n  id: ID!\n  title: String!\n  """\n  @oneToMany field: \'note\', key: \'note_id\'\n  """\n  comments: [Comment]\n}\n')),Object(a.b)("p",null,"This maps to ",Object(a.b)("inlineCode",{parentName:"p"},"comment.note_id")," in the database."))}s.isMDXComponent=!0},253:function(e,n,t){"use strict";t.d(n,"a",(function(){return p})),t.d(n,"b",(function(){return b}));var r=t(0),o=t.n(r);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function u(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function c(e,n){if(null==e)return{};var t,r,o=function(e,n){if(null==e)return{};var t,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var l=o.a.createContext({}),s=function(e){var n=o.a.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):u(u({},n),e)),t},p=function(e){var n=s(e.components);return o.a.createElement(l.Provider,{value:n},e.children)},f={inlineCode:"code",wrapper:function(e){var n=e.children;return o.a.createElement(o.a.Fragment,{},n)}},d=o.a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,a=e.originalType,i=e.parentName,l=c(e,["components","mdxType","originalType","parentName"]),p=s(t),d=r,b=p["".concat(i,".").concat(d)]||p[d]||f[d]||a;return t?o.a.createElement(b,u(u({ref:n},l),{},{components:t})):o.a.createElement(b,u({ref:n},l))}));function b(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var a=t.length,i=new Array(a);i[0]=d;var u={};for(var c in n)hasOwnProperty.call(n,c)&&(u[c]=n[c]);u.originalType=e,u.mdxType="string"==typeof e?e:r,i[1]=u;for(var l=2;l<a;l++)i[l]=t[l];return o.a.createElement.apply(null,i)}return o.a.createElement.apply(null,t)}d.displayName="MDXCreateElement"},254:function(e,n,t){"use strict";e.exports=t(255)},255:function(e,n,t){"use strict";var r=t(256),o="function"==typeof Symbol&&Symbol.for,a=o?Symbol.for("react.element"):60103,i=o?Symbol.for("react.portal"):60106,u=o?Symbol.for("react.fragment"):60107,c=o?Symbol.for("react.strict_mode"):60108,l=o?Symbol.for("react.profiler"):60114,s=o?Symbol.for("react.provider"):60109,p=o?Symbol.for("react.context"):60110,f=o?Symbol.for("react.forward_ref"):60112,d=o?Symbol.for("react.suspense"):60113,b=o?Symbol.for("react.memo"):60115,y=o?Symbol.for("react.lazy"):60116,m="function"==typeof Symbol&&Symbol.iterator;function h(e){for(var n="https://reactjs.org/docs/error-decoder.html?invariant="+e,t=1;t<arguments.length;t++)n+="&args[]="+encodeURIComponent(arguments[t]);return"Minified React error #"+e+"; visit "+n+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var O={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},j={};function v(e,n,t){this.props=e,this.context=n,this.refs=j,this.updater=t||O}function g(){}function w(e,n,t){this.props=e,this.context=n,this.refs=j,this.updater=t||O}v.prototype.isReactComponent={},v.prototype.setState=function(e,n){if("object"!=typeof e&&"function"!=typeof e&&null!=e)throw Error(h(85));this.updater.enqueueSetState(this,e,n,"setState")},v.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")},g.prototype=v.prototype;var k=w.prototype=new g;k.constructor=w,r(k,v.prototype),k.isPureReactComponent=!0;var C={current:null},S=Object.prototype.hasOwnProperty,_={key:!0,ref:!0,__self:!0,__source:!0};function P(e,n,t){var r,o={},i=null,u=null;if(null!=n)for(r in void 0!==n.ref&&(u=n.ref),void 0!==n.key&&(i=""+n.key),n)S.call(n,r)&&!_.hasOwnProperty(r)&&(o[r]=n[r]);var c=arguments.length-2;if(1===c)o.children=t;else if(1<c){for(var l=Array(c),s=0;s<c;s++)l[s]=arguments[s+2];o.children=l}if(e&&e.defaultProps)for(r in c=e.defaultProps)void 0===o[r]&&(o[r]=c[r]);return{$$typeof:a,type:e,key:i,ref:u,props:o,_owner:C.current}}function N(e){return"object"==typeof e&&null!==e&&e.$$typeof===a}var E=/\/+/g,x=[];function T(e,n,t,r){if(x.length){var o=x.pop();return o.result=e,o.keyPrefix=n,o.func=t,o.context=r,o.count=0,o}return{result:e,keyPrefix:n,func:t,context:r,count:0}}function R(e){e.result=null,e.keyPrefix=null,e.func=null,e.context=null,e.count=0,10>x.length&&x.push(e)}function $(e,n,t){return null==e?0:function e(n,t,r,o){var u=typeof n;"undefined"!==u&&"boolean"!==u||(n=null);var c=!1;if(null===n)c=!0;else switch(u){case"string":case"number":c=!0;break;case"object":switch(n.$$typeof){case a:case i:c=!0}}if(c)return r(o,n,""===t?"."+D(n,0):t),1;if(c=0,t=""===t?".":t+":",Array.isArray(n))for(var l=0;l<n.length;l++){var s=t+D(u=n[l],l);c+=e(u,s,r,o)}else if(null===n||"object"!=typeof n?s=null:s="function"==typeof(s=m&&n[m]||n["@@iterator"])?s:null,"function"==typeof s)for(n=s.call(n),l=0;!(u=n.next()).done;)c+=e(u=u.value,s=t+D(u,l++),r,o);else if("object"===u)throw r=""+n,Error(h(31,"[object Object]"===r?"object with keys {"+Object.keys(n).join(", ")+"}":r,""));return c}(e,"",n,t)}function D(e,n){return"object"==typeof e&&null!==e&&null!=e.key?function(e){var n={"=":"=0",":":"=2"};return"$"+(""+e).replace(/[=:]/g,(function(e){return n[e]}))}(e.key):n.toString(36)}function I(e,n){e.func.call(e.context,n,e.count++)}function M(e,n,t){var r=e.result,o=e.keyPrefix;e=e.func.call(e.context,n,e.count++),Array.isArray(e)?q(e,r,t,(function(e){return e})):null!=e&&(N(e)&&(e=function(e,n){return{$$typeof:a,type:e.type,key:n,ref:e.ref,props:e.props,_owner:e._owner}}(e,o+(!e.key||n&&n.key===e.key?"":(""+e.key).replace(E,"$&/")+"/")+t)),r.push(e))}function q(e,n,t,r,o){var a="";null!=t&&(a=(""+t).replace(E,"$&/")+"/"),$(e,M,n=T(n,a,r,o)),R(n)}var U={current:null};function A(){var e=U.current;if(null===e)throw Error(h(321));return e}var F={ReactCurrentDispatcher:U,ReactCurrentBatchConfig:{suspense:null},ReactCurrentOwner:C,IsSomeRendererActing:{current:!1},assign:r};n.Children={map:function(e,n,t){if(null==e)return e;var r=[];return q(e,r,null,n,t),r},forEach:function(e,n,t){if(null==e)return e;$(e,I,n=T(null,null,n,t)),R(n)},count:function(e){return $(e,(function(){return null}),null)},toArray:function(e){var n=[];return q(e,n,null,(function(e){return e})),n},only:function(e){if(!N(e))throw Error(h(143));return e}},n.Component=v,n.Fragment=u,n.Profiler=l,n.PureComponent=w,n.StrictMode=c,n.Suspense=d,n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=F,n.cloneElement=function(e,n,t){if(null==e)throw Error(h(267,e));var o=r({},e.props),i=e.key,u=e.ref,c=e._owner;if(null!=n){if(void 0!==n.ref&&(u=n.ref,c=C.current),void 0!==n.key&&(i=""+n.key),e.type&&e.type.defaultProps)var l=e.type.defaultProps;for(s in n)S.call(n,s)&&!_.hasOwnProperty(s)&&(o[s]=void 0===n[s]&&void 0!==l?l[s]:n[s])}var s=arguments.length-2;if(1===s)o.children=t;else if(1<s){l=Array(s);for(var p=0;p<s;p++)l[p]=arguments[p+2];o.children=l}return{$$typeof:a,type:e.type,key:i,ref:u,props:o,_owner:c}},n.createContext=function(e,n){return void 0===n&&(n=null),(e={$$typeof:p,_calculateChangedBits:n,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null}).Provider={$$typeof:s,_context:e},e.Consumer=e},n.createElement=P,n.createFactory=function(e){var n=P.bind(null,e);return n.type=e,n},n.createRef=function(){return{current:null}},n.forwardRef=function(e){return{$$typeof:f,render:e}},n.isValidElement=N,n.lazy=function(e){return{$$typeof:y,_ctor:e,_status:-1,_result:null}},n.memo=function(e,n){return{$$typeof:b,type:e,compare:void 0===n?null:n}},n.useCallback=function(e,n){return A().useCallback(e,n)},n.useContext=function(e,n){return A().useContext(e,n)},n.useDebugValue=function(){},n.useEffect=function(e,n){return A().useEffect(e,n)},n.useImperativeHandle=function(e,n,t){return A().useImperativeHandle(e,n,t)},n.useLayoutEffect=function(e,n){return A().useLayoutEffect(e,n)},n.useMemo=function(e,n){return A().useMemo(e,n)},n.useReducer=function(e,n,t){return A().useReducer(e,n,t)},n.useRef=function(e){return A().useRef(e)},n.useState=function(e){return A().useState(e)},n.version="16.13.1"},256:function(e,n,t){"use strict";var r=Object.getOwnPropertySymbols,o=Object.prototype.hasOwnProperty,a=Object.prototype.propertyIsEnumerable;function i(e){if(null==e)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(e)}e.exports=function(){try{if(!Object.assign)return!1;var e=new String("abc");if(e[5]="de","5"===Object.getOwnPropertyNames(e)[0])return!1;for(var n={},t=0;t<10;t++)n["_"+String.fromCharCode(t)]=t;if("0123456789"!==Object.getOwnPropertyNames(n).map((function(e){return n[e]})).join(""))return!1;var r={};return"abcdefghijklmnopqrst".split("").forEach((function(e){r[e]=e})),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},r)).join("")}catch(o){return!1}}()?Object.assign:function(e,n){for(var t,u,c=i(e),l=1;l<arguments.length;l++){for(var s in t=Object(arguments[l]))o.call(t,s)&&(c[s]=t[s]);if(r){u=r(t);for(var p=0;p<u.length;p++)a.call(t,u[p])&&(c[u[p]]=t[u[p]])}}return c}}}]);