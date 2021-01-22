import{directive as e,AttributePart as t}from"../../lit-html.js";
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
 */const o=new WeakMap,i=e(e=>i=>{const m=o.get(i);if(void 0===e&&i instanceof t){if(void 0!==m||!o.has(i)){const e=i.committer.name;i.committer.element.removeAttribute(e)}}else e!==m&&i.setValue(e);o.set(i,e)});export{i as ifDefined};

