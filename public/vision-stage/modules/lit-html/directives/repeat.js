import{directive as e,NodePart as t,createMarker as n,reparentNodes as o,removeNodes as s}from"../../lit-html.js";
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const r=(e,o)=>{const s=e.startNode.parentNode,r=void 0===o?e.endNode:o.startNode,l=s.insertBefore(n(),r);s.insertBefore(n(),r);const i=new t(e.options);return i.insertAfterNode(l),i},l=(e,t)=>(e.setValue(t),e.commit(),e),i=(e,t,n)=>{const s=e.startNode.parentNode,r=n?n.startNode:e.endNode,l=t.endNode.nextSibling;l!==r&&o(s,t.startNode,l,r)},d=e=>{s(e.startNode.parentNode,e.startNode,e.endNode.nextSibling)},a=(e,t,n)=>{const o=new Map;for(let s=t;s<=n;s++)o.set(e[s],s);return o},f=new WeakMap,N=new WeakMap,c=e((e,n,o)=>{let s;return void 0===o?o=n:void 0!==n&&(s=n),n=>{if(!(n instanceof t))throw new Error("repeat can only be used in text bindings");const c=f.get(n)||[],u=N.get(n)||[],p=[],g=[],h=[];let w,m,v=0;for(const t of e)h[v]=s?s(t,v):v,g[v]=o(t,v),v++;let b=0,x=c.length-1,M=0,k=g.length-1;for(;b<=x&&M<=k;)if(null===c[b])b++;else if(null===c[x])x--;else if(u[b]===h[M])p[M]=l(c[b],g[M]),b++,M++;else if(u[x]===h[k])p[k]=l(c[x],g[k]),x--,k--;else if(u[b]===h[k])p[k]=l(c[b],g[k]),i(n,c[b],p[k+1]),b++,k--;else if(u[x]===h[M])p[M]=l(c[x],g[M]),i(n,c[x],c[b]),x--,M++;else if(void 0===w&&(w=a(h,M,k),m=a(u,b,x)),w.has(u[b]))if(w.has(u[x])){const e=m.get(h[M]),t=void 0!==e?c[e]:null;if(null===t){const e=r(n,c[b]);l(e,g[M]),p[M]=e}else p[M]=l(t,g[M]),i(n,t,c[b]),c[e]=null;M++}else d(c[x]),x--;else d(c[b]),b++;for(;M<=k;){const e=r(n,p[k+1]);l(e,g[M]),p[M++]=e}for(;b<=x;){const e=c[b++];null!==e&&d(e)}f.set(n,p),N.set(n,h)}});export{c as repeat};
//# sourceMappingURL=repeat.js.map
