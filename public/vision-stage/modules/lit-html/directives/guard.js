import{directive as r}from"../../lit-html.js";
/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const e=new WeakMap,t=r((r,t)=>a=>{const s=e.get(a);if(Array.isArray(r)){if(Array.isArray(s)&&s.length===r.length&&r.every((r,e)=>r===s[e]))return}else if(s===r&&(void 0!==r||e.has(a)))return;a.setValue(t()),e.set(a,Array.isArray(r)?Array.from(r):r)});export{t as guard};
//# sourceMappingURL=guard.js.map
