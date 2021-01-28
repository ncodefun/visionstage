import{directive as e,NodePart as t,isPrimitive as n}from"../../lit-html.js";
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
const o=new WeakMap,r=e(e=>r=>{if(!(r instanceof t))throw new Error("unsafeHTML can only be used in text bindings");const a=o.get(r);if(void 0!==a&&n(e)&&e===a.value&&r.value===a.fragment)return;const i=document.createElement("template");i.innerHTML=e;const s=document.importNode(i.content,!0);r.setValue(s),o.set(r,{value:e,fragment:s})});export{r as unsafeHTML};
//# sourceMappingURL=unsafe-html.js.map
