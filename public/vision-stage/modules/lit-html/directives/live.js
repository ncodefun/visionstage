import{directive as e,EventPart as t,NodePart as n,BooleanAttributePart as i,PropertyPart as r,AttributePart as o}from"../../lit-html.js";
/**
 * @license
 * Copyright (c) 2020 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const s=e(e=>s=>{let a;if(s instanceof t||s instanceof n)throw new Error("The `live` directive is not allowed on text or event bindings");if(s instanceof i)l(s.strings),a=s.element.hasAttribute(s.name),s.value=a;else{const{element:t,name:n,strings:i}=s.committer;if(l(i),s instanceof r){if(a=t[n],a===e)return}else s instanceof o&&(a=t.getAttribute(n));if(a===String(e))return}s.setValue(e)}),l=e=>{if(2!==e.length||""!==e[0]||""!==e[1])throw new Error("`live` bindings can only contain a single expression")};export{s as live};

