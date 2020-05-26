(window.webpackJsonp=window.webpackJsonp||[]).push([[81],{217:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return i})),n.d(t,"metadata",(function(){return c})),n.d(t,"rightToc",(function(){return s})),n.d(t,"default",(function(){return u}));var r=n(1),o=n(9),a=(n(0),n(253)),i={title:"Custom Methods",id:"custom"},c={id:"version-0.9.x/custom",title:"Custom Methods",description:"Graphback also allows people to add custom queries, mutations or subscriptions by generating empty stubs where users can write their resolvers. This can be done by defining Query, Mutation or Subscription in your data model. The syntax is similar to SDL syntax.",source:"@site/versioned_docs/version-0.9.x/custom.md",permalink:"/docs/0.9.x/custom",editUrl:"https://github.com/aerogear/graphback/edit/master/website/versioned_docs/version-0.9.x/custom.md",version:"0.9.x",sidebar:"version-0.9.x/docs",previous:{title:"CRUD Config",permalink:"/docs/0.9.x/config"},next:{title:"Introduction",permalink:"/docs/0.9.x/concepts"}},s=[{value:"Example",id:"example",children:[]}],p={rightToc:s};function u(e){var t=e.components,n=Object(o.a)(e,["components"]);return Object(a.b)("wrapper",Object(r.a)({},p,n,{components:t,mdxType:"MDXLayout"}),Object(a.b)("p",null,"Graphback also allows people to add custom queries, mutations or subscriptions by generating empty stubs where users can write their resolvers. This can be done by defining ",Object(a.b)("inlineCode",{parentName:"p"},"Query"),", ",Object(a.b)("inlineCode",{parentName:"p"},"Mutation")," or ",Object(a.b)("inlineCode",{parentName:"p"},"Subscription")," in your data model. The syntax is similar to SDL syntax."),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{}),"type Query {\n  ...   //schema definition\n}\n")),Object(a.b)("h3",{id:"example"},"Example"),Object(a.b)("p",null,"If we have the following datamodel"),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{}),"type Post {\n  id: ID!\n  content: String!\n  author: User!\n  likes: Int!\n}\n\ntype User {\n  id: ID!\n  name: String!\n}\n")),Object(a.b)("p",null,"and we want to implement a mutation to like a Post, then we can simply"),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{className:"language-graphql"}),"...\n...\n\n#Custom mutations\ntype Mutation {\n  likePost(id: ID!): Post!\n}\n")),Object(a.b)("p",null,"This will add the mutation to the schema "),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{className:"language-graphql"}),"type Mutation {\n  createPost(input: PostInput!): Post!\n  createUser(input: UserInput!): User!\n  updatePost(id: ID!, input: PostInput!): Post!\n  updateUser(id: ID!, input: UserInput!): User!\n  ## Custom mutations\n  likePost(id: ID!): Post!\n}\n")),Object(a.b)("p",null,"and will generated a resolver file in custom folder"),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{}),"export const likePost = {\n  Mutation: {\n    likePost: (_: any, args: any, context: any) => {\n        // Implementation here\n    }\n  }\n}\n")),Object(a.b)("blockquote",null,Object(a.b)("p",{parentName:"blockquote"},Object(a.b)("strong",{parentName:"p"},"Note:")," This works similarily for ",Object(a.b)("inlineCode",{parentName:"p"},"Query")," and ",Object(a.b)("inlineCode",{parentName:"p"},"Subscription"),".")))}u.isMDXComponent=!0},253:function(e,t,n){"use strict";n.d(t,"a",(function(){return l})),n.d(t,"b",(function(){return d}));var r=n(0),o=n.n(r);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var p=o.a.createContext({}),u=function(e){var t=o.a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},l=function(e){var t=u(e.components);return o.a.createElement(p.Provider,{value:t},e.children)},b={inlineCode:"code",wrapper:function(e){var t=e.children;return o.a.createElement(o.a.Fragment,{},t)}},m=o.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,a=e.originalType,i=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),l=u(n),m=r,d=l["".concat(i,".").concat(m)]||l[m]||b[m]||a;return n?o.a.createElement(d,c(c({ref:t},p),{},{components:n})):o.a.createElement(d,c({ref:t},p))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=n.length,i=new Array(a);i[0]=m;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c.mdxType="string"==typeof e?e:r,i[1]=c;for(var p=2;p<a;p++)i[p]=n[p];return o.a.createElement.apply(null,i)}return o.a.createElement.apply(null,n)}m.displayName="MDXCreateElement"}}]);