import{C as e,f as t,_ as n,a as r,b as i,E as a,F as o,c as s,d as u,e as c,v as l,i as f,g as d,h as p,L as h}from"../common/index.esm-671f1674.js";function v(e){return Array.prototype.slice.call(e)}function m(e){return new Promise((function(t,n){e.onsuccess=function(){t(e.result)},e.onerror=function(){n(e.error)}}))}function g(e,t,n){var r,i=new Promise((function(i,a){m(r=e[t].apply(e,n)).then(i,a)}));return i.request=r,i}function b(e,t,n){var r=g(e,t,n);return r.then((function(e){if(e)return new T(e,r.request)}))}function y(e,t,n){n.forEach((function(n){Object.defineProperty(e.prototype,n,{get:function(){return this[t][n]},set:function(e){this[t][n]=e}})}))}function w(e,t,n,r){r.forEach((function(r){r in n.prototype&&(e.prototype[r]=function(){return g(this[t],r,arguments)})}))}function I(e,t,n,r){r.forEach((function(r){r in n.prototype&&(e.prototype[r]=function(){return this[t][r].apply(this[t],arguments)})}))}function _(e,t,n,r){r.forEach((function(r){r in n.prototype&&(e.prototype[r]=function(){return b(this[t],r,arguments)})}))}function E(e){this._index=e}function T(e,t){this._cursor=e,this._request=t}function C(e){this._store=e}function S(e){this._tx=e,this.complete=new Promise((function(t,n){e.oncomplete=function(){t()},e.onerror=function(){n(e.error)},e.onabort=function(){n(e.error)}}))}function N(e,t,n){this._db=e,this.oldVersion=t,this.transaction=new S(n)}function D(e){this._db=e}y(E,"_index",["name","keyPath","multiEntry","unique"]),w(E,"_index",IDBIndex,["get","getKey","getAll","getAllKeys","count"]),_(E,"_index",IDBIndex,["openCursor","openKeyCursor"]),y(T,"_cursor",["direction","key","primaryKey","value"]),w(T,"_cursor",IDBCursor,["update","delete"]),["advance","continue","continuePrimaryKey"].forEach((function(e){e in IDBCursor.prototype&&(T.prototype[e]=function(){var t=this,n=arguments;return Promise.resolve().then((function(){return t._cursor[e].apply(t._cursor,n),m(t._request).then((function(e){if(e)return new T(e,t._request)}))}))})})),C.prototype.createIndex=function(){return new E(this._store.createIndex.apply(this._store,arguments))},C.prototype.index=function(){return new E(this._store.index.apply(this._store,arguments))},y(C,"_store",["name","keyPath","indexNames","autoIncrement"]),w(C,"_store",IDBObjectStore,["put","add","delete","clear","get","getAll","getKey","getAllKeys","count"]),_(C,"_store",IDBObjectStore,["openCursor","openKeyCursor"]),I(C,"_store",IDBObjectStore,["deleteIndex"]),S.prototype.objectStore=function(){return new C(this._tx.objectStore.apply(this._tx,arguments))},y(S,"_tx",["objectStoreNames","mode"]),I(S,"_tx",IDBTransaction,["abort"]),N.prototype.createObjectStore=function(){return new C(this._db.createObjectStore.apply(this._db,arguments))},y(N,"_db",["name","version","objectStoreNames"]),I(N,"_db",IDBDatabase,["deleteObjectStore","close"]),D.prototype.transaction=function(){return new S(this._db.transaction.apply(this._db,arguments))},y(D,"_db",["name","version","objectStoreNames"]),I(D,"_db",IDBDatabase,["close"]),["openCursor","openKeyCursor"].forEach((function(e){[C,E].forEach((function(t){e in t.prototype&&(t.prototype[e.replace("open","iterate")]=function(){var t=v(arguments),n=t[t.length-1],r=this._store||this._index,i=r[e].apply(r,t.slice(0,-1));i.onsuccess=function(){n(i.result)}})}))})),[E,C].forEach((function(e){e.prototype.getAll||(e.prototype.getAll=function(e,t){var n=this,r=[];return new Promise((function(i){n.iterateCursor(e,(function(e){e?(r.push(e.value),void 0===t||r.length!=t?e.continue():i(r)):i(r)}))}))})}));var P,A=new a("installations","Installations",((P={})["missing-app-config-values"]='Missing App configuration value: "{$valueName}"',P["not-registered"]="Firebase Installation is not registered.",P["installation-not-found"]="Firebase Installation not found.",P["request-failed"]='{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',P["app-offline"]="Could not process request. Application offline.",P["delete-pending-registration"]="Can't delete installation while there is a pending registration request.",P));function k(e){return e instanceof o&&e.code.includes("request-failed")}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function x(e){return"https://firebaseinstallations.googleapis.com/v1/projects/"+e.projectId+"/installations"}function O(e){return{token:e.token,requestStatus:2,expiresIn:(t=e.expiresIn,Number(t.replace("s","000"))),creationTime:Date.now()};var t}function F(e,t){return r(this,void 0,void 0,(function(){var n,r;return i(this,(function(i){switch(i.label){case 0:return[4,t.json()];case 1:return n=i.sent(),r=n.error,[2,A.create("request-failed",{requestName:e,serverCode:r.code,serverMessage:r.message,serverStatus:r.status})]}}))}))}function j(e){var t=e.apiKey;return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":t})}function M(e,t){var n=t.refreshToken,r=j(e);return r.append("Authorization",function(e){return"FIS_v2 "+e}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(n)),r}function q(e){return r(this,void 0,void 0,(function(){var t;return i(this,(function(n){switch(n.label){case 0:return[4,e()];case 1:return(t=n.sent()).status>=500&&t.status<600?[2,e()]:[2,t]}}))}))}function L(e,t){var n=t.fid;return r(this,void 0,void 0,(function(){var t,r,a,o,s,u;return i(this,(function(i){switch(i.label){case 0:return t=x(e),r=j(e),a={fid:n,authVersion:"FIS_v2",appId:e.appId,sdkVersion:"w:0.4.19"},o={method:"POST",headers:r,body:JSON.stringify(a)},[4,q((function(){return fetch(t,o)}))];case 1:return(s=i.sent()).ok?[4,s.json()]:[3,3];case 2:return u=i.sent(),[2,{fid:u.fid||n,registrationStatus:2,refreshToken:u.refreshToken,authToken:O(u.authToken)}];case 3:return[4,F("Create Installation",s)];case 4:throw i.sent()}}))}))}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function R(e){return new Promise((function(t){setTimeout(t,e)}))}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var V=/^[cdef][\w-]{21}$/;function K(){try{var e=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(e),e[0]=112+e[0]%16;var t=function(e){return(t=e,btoa(String.fromCharCode.apply(String,u(t))).replace(/\+/g,"-").replace(/\//g,"_")).substr(0,22);var t}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e);return V.test(t)?t:""}catch(e){return""}}function B(e){return e.appName+"!"+e.appId}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var G=new Map;function U(e,t){var n=B(e);$(n,t),function(e,t){var n=H();n&&n.postMessage({key:e,fid:t});W()}(n,t)}function $(e,t){var r,i,a=G.get(e);if(a)try{for(var o=n(a),s=o.next();!s.done;s=o.next()){(0,s.value)(t)}}catch(e){r={error:e}}finally{try{s&&!s.done&&(i=o.return)&&i.call(o)}finally{if(r)throw r.error}}}var z=null;function H(){return!z&&"BroadcastChannel"in self&&((z=new BroadcastChannel("[Firebase] FID Change")).onmessage=function(e){$(e.data.key,e.data.fid)}),z}function W(){0===G.size&&z&&(z.close(),z=null)}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var J,X="firebase-installations-store",Y=null;function Q(){return Y||(Y=function(e,t,n){var r=g(indexedDB,"open",[e,t]),i=r.request;return i&&(i.onupgradeneeded=function(e){n&&n(new N(i.result,e.oldVersion,i.transaction))}),r.then((function(e){return new D(e)}))}("firebase-installations-database",1,(function(e){switch(e.oldVersion){case 0:e.createObjectStore(X)}}))),Y}function Z(e,t){return r(this,void 0,void 0,(function(){var n,r,a,o,s;return i(this,(function(i){switch(i.label){case 0:return n=B(e),[4,Q()];case 1:return r=i.sent(),a=r.transaction(X,"readwrite"),[4,(o=a.objectStore(X)).get(n)];case 2:return s=i.sent(),[4,o.put(t,n)];case 3:return i.sent(),[4,a.complete];case 4:return i.sent(),s&&s.fid===t.fid||U(e,t.fid),[2,t]}}))}))}function ee(e){return r(this,void 0,void 0,(function(){var t,n,r;return i(this,(function(i){switch(i.label){case 0:return t=B(e),[4,Q()];case 1:return n=i.sent(),[4,(r=n.transaction(X,"readwrite")).objectStore(X).delete(t)];case 2:return i.sent(),[4,r.complete];case 3:return i.sent(),[2]}}))}))}function te(e,t){return r(this,void 0,void 0,(function(){var n,r,a,o,s,u;return i(this,(function(i){switch(i.label){case 0:return n=B(e),[4,Q()];case 1:return r=i.sent(),a=r.transaction(X,"readwrite"),[4,(o=a.objectStore(X)).get(n)];case 2:return s=i.sent(),void 0!==(u=t(s))?[3,4]:[4,o.delete(n)];case 3:return i.sent(),[3,6];case 4:return[4,o.put(u,n)];case 5:i.sent(),i.label=6;case 6:return[4,a.complete];case 7:return i.sent(),!u||s&&s.fid===u.fid||U(e,u.fid),[2,u]}}))}))}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ne(e){return r(this,void 0,void 0,(function(){var t,n,a;return i(this,(function(o){switch(o.label){case 0:return[4,te(e,(function(n){var a=function(e){return ae(e||{fid:K(),registrationStatus:0})}(n),o=function(e,t){if(0===t.registrationStatus){if(!navigator.onLine){var n=Promise.reject(A.create("app-offline"));return{installationEntry:t,registrationPromise:n}}var a={fid:t.fid,registrationStatus:1,registrationTime:Date.now()},o=function(e,t){return r(this,void 0,void 0,(function(){var n,r;return i(this,(function(i){switch(i.label){case 0:return i.trys.push([0,2,,7]),[4,L(e,t)];case 1:return n=i.sent(),[2,Z(e,n)];case 2:return k(r=i.sent())&&409===r.customData.serverCode?[4,ee(e)]:[3,4];case 3:return i.sent(),[3,6];case 4:return[4,Z(e,{fid:t.fid,registrationStatus:0})];case 5:i.sent(),i.label=6;case 6:throw r;case 7:return[2]}}))}))}(e,a);return{installationEntry:a,registrationPromise:o}}return 1===t.registrationStatus?{installationEntry:t,registrationPromise:re(e)}:{installationEntry:t}}(e,a);return t=o.registrationPromise,o.installationEntry}))];case 1:return""!==(n=o.sent()).fid?[3,3]:(a={},[4,t]);case 2:return[2,(a.installationEntry=o.sent(),a)];case 3:return[2,{installationEntry:n,registrationPromise:t}]}}))}))}function re(e){return r(this,void 0,void 0,(function(){var t,n,r,a;return i(this,(function(i){switch(i.label){case 0:return[4,ie(e)];case 1:t=i.sent(),i.label=2;case 2:return 1!==t.registrationStatus?[3,5]:[4,R(100)];case 3:return i.sent(),[4,ie(e)];case 4:return t=i.sent(),[3,2];case 5:return 0!==t.registrationStatus?[3,7]:[4,ne(e)];case 6:return n=i.sent(),r=n.installationEntry,(a=n.registrationPromise)?[2,a]:[2,r];case 7:return[2,t]}}))}))}function ie(e){return te(e,(function(e){if(!e)throw A.create("installation-not-found");return ae(e)}))}function ae(e){return 1===(t=e).registrationStatus&&t.registrationTime+1e4<Date.now()?{fid:e.fid,registrationStatus:0}:e;var t;
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}function oe(e,t){var n=e.appConfig,a=e.platformLoggerProvider;return r(this,void 0,void 0,(function(){var e,r,o,s,u,c,l;return i(this,(function(i){switch(i.label){case 0:return e=function(e,t){var n=t.fid;return x(e)+"/"+n+"/authTokens:generate"}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(n,t),r=M(n,t),(o=a.getImmediate({optional:!0}))&&r.append("x-firebase-client",o.getPlatformInfoString()),s={installation:{sdkVersion:"w:0.4.19"}},u={method:"POST",headers:r,body:JSON.stringify(s)},[4,q((function(){return fetch(e,u)}))];case 1:return(c=i.sent()).ok?[4,c.json()]:[3,3];case 2:return l=i.sent(),[2,O(l)];case 3:return[4,F("Generate Auth Token",c)];case 4:throw i.sent()}}))}))}function se(e,t){return void 0===t&&(t=!1),r(this,void 0,void 0,(function(){var n,a,o;return i(this,(function(u){switch(u.label){case 0:return[4,te(e.appConfig,(function(a){if(!ce(a))throw A.create("not-registered");var o=a.authToken;if(!t&&function(e){return 2===e.requestStatus&&!function(e){var t=Date.now();return t<e.creationTime||e.creationTime+e.expiresIn<t+36e5}(e)}(o))return a;if(1===o.requestStatus)return n=function(e,t){return r(this,void 0,void 0,(function(){var n,r;return i(this,(function(i){switch(i.label){case 0:return[4,ue(e.appConfig)];case 1:n=i.sent(),i.label=2;case 2:return 1!==n.authToken.requestStatus?[3,5]:[4,R(100)];case 3:return i.sent(),[4,ue(e.appConfig)];case 4:return n=i.sent(),[3,2];case 5:return 0===(r=n.authToken).requestStatus?[2,se(e,t)]:[2,r]}}))}))}(e,t),a;if(!navigator.onLine)throw A.create("app-offline");var u=function(e){var t={requestStatus:1,requestTime:Date.now()};return s(s({},e),{authToken:t})}(a);return n=function(e,t){return r(this,void 0,void 0,(function(){var n,r,a;return i(this,(function(i){switch(i.label){case 0:return i.trys.push([0,3,,8]),[4,oe(e,t)];case 1:return n=i.sent(),a=s(s({},t),{authToken:n}),[4,Z(e.appConfig,a)];case 2:return i.sent(),[2,n];case 3:return!k(r=i.sent())||401!==r.customData.serverCode&&404!==r.customData.serverCode?[3,5]:[4,ee(e.appConfig)];case 4:return i.sent(),[3,7];case 5:return a=s(s({},t),{authToken:{requestStatus:0}}),[4,Z(e.appConfig,a)];case 6:i.sent(),i.label=7;case 7:throw r;case 8:return[2]}}))}))}(e,u),u}))];case 1:return a=u.sent(),n?[4,n]:[3,3];case 2:return o=u.sent(),[3,4];case 3:o=a.authToken,u.label=4;case 4:return[2,o]}}))}))}function ue(e){return te(e,(function(e){if(!ce(e))throw A.create("not-registered");var t,n=e.authToken;return 1===(t=n).requestStatus&&t.requestTime+1e4<Date.now()?s(s({},e),{authToken:{requestStatus:0}}):e}))}function ce(e){return void 0!==e&&2===e.registrationStatus}function le(e){return r(this,void 0,void 0,(function(){var t;return i(this,(function(n){switch(n.label){case 0:return[4,ne(e)];case 1:return(t=n.sent().registrationPromise)?[4,t]:[3,3];case 2:n.sent(),n.label=3;case 3:return[2]}}))}))}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fe(e,t){return r(this,void 0,void 0,(function(){var n,r,a,o;return i(this,(function(i){switch(i.label){case 0:return n=function(e,t){var n=t.fid;return x(e)+"/"+n}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e,t),r=M(e,t),a={method:"DELETE",headers:r},[4,q((function(){return fetch(n,a)}))];case 1:return(o=i.sent()).ok?[3,3]:[4,F("Delete Installation",o)];case 2:throw i.sent();case 3:return[2]}}))}))}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function de(e,t){var n=e.appConfig;return function(e,t){H();var n=B(e),r=G.get(n);r||(r=new Set,G.set(n,r)),r.add(t)}(n,t),function(){!function(e,t){var n=B(e),r=G.get(n);r&&(r.delete(t),0===r.size&&G.delete(n),W())}(n,t)}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pe(e){return A.create("missing-app-config-values",{valueName:e})}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(J=t).INTERNAL.registerComponent(new e("installations",(function(e){var t=e.getProvider("app").getImmediate(),a={appConfig:function(e){var t,r;if(!e||!e.options)throw pe("App Configuration");if(!e.name)throw pe("App Name");try{for(var i=n(["projectId","apiKey","appId"]),a=i.next();!a.done;a=i.next()){var o=a.value;if(!e.options[o])throw pe(o)}}catch(e){t={error:e}}finally{try{a&&!a.done&&(r=i.return)&&r.call(i)}finally{if(t)throw t.error}}return{appName:e.name,projectId:e.options.projectId,apiKey:e.options.apiKey,appId:e.options.appId}}(t),platformLoggerProvider:e.getProvider("platform-logger")};return{app:t,getId:function(){
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */return function(e){return r(this,void 0,void 0,(function(){var t,n,r;return i(this,(function(i){switch(i.label){case 0:return[4,ne(e.appConfig)];case 1:return t=i.sent(),n=t.installationEntry,(r=t.registrationPromise)?r.catch(console.error):se(e).catch(console.error),[2,n.fid]}}))}))}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(a)},getToken:function(e){return function(e,t){return void 0===t&&(t=!1),r(this,void 0,void 0,(function(){return i(this,(function(n){switch(n.label){case 0:return[4,le(e.appConfig)];case 1:return n.sent(),[4,se(e,t)];case 2:return[2,n.sent().token]}}))}))}(a,e)},delete:function(){return function(e){return r(this,void 0,void 0,(function(){var t,n;return i(this,(function(r){switch(r.label){case 0:return[4,te(t=e.appConfig,(function(e){if(!e||0!==e.registrationStatus)return e}))];case 1:if(!(n=r.sent()))return[3,6];if(1!==n.registrationStatus)return[3,2];throw A.create("delete-pending-registration");case 2:if(2!==n.registrationStatus)return[3,6];if(navigator.onLine)return[3,3];throw A.create("app-offline");case 3:return[4,fe(t,n)];case 4:return r.sent(),[4,ee(t)];case 5:r.sent(),r.label=6;case 6:return[2]}}))}))}(a)},onIdChange:function(e){return de(a,e)}}}),"PUBLIC")),J.registerVersion("@firebase/installations","0.4.19");
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var he,ve,me="https://www.googletagmanager.com/gtag/js";!function(e){e.EVENT="event",e.SET="set",e.CONFIG="config"}(he||(he={})),function(e){e.ADD_SHIPPING_INFO="add_shipping_info",e.ADD_PAYMENT_INFO="add_payment_info",e.ADD_TO_CART="add_to_cart",e.ADD_TO_WISHLIST="add_to_wishlist",e.BEGIN_CHECKOUT="begin_checkout",e.CHECKOUT_PROGRESS="checkout_progress",e.EXCEPTION="exception",e.GENERATE_LEAD="generate_lead",e.LOGIN="login",e.PAGE_VIEW="page_view",e.PURCHASE="purchase",e.REFUND="refund",e.REMOVE_FROM_CART="remove_from_cart",e.SCREEN_VIEW="screen_view",e.SEARCH="search",e.SELECT_CONTENT="select_content",e.SELECT_ITEM="select_item",e.SELECT_PROMOTION="select_promotion",e.SET_CHECKOUT_OPTION="set_checkout_option",e.SHARE="share",e.SIGN_UP="sign_up",e.TIMING_COMPLETE="timing_complete",e.VIEW_CART="view_cart",e.VIEW_ITEM="view_item",e.VIEW_ITEM_LIST="view_item_list",e.VIEW_PROMOTION="view_promotion",e.VIEW_SEARCH_RESULTS="view_search_results"}(ve||(ve={}));
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var ge,be=new h("@firebase/analytics");
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ye(e,t,n,a,o,s){return r(this,void 0,void 0,(function(){var r,u,c,l;return i(this,(function(i){switch(i.label){case 0:r=a[o],i.label=1;case 1:return i.trys.push([1,7,,8]),r?[4,t[r]]:[3,3];case 2:return i.sent(),[3,6];case 3:return[4,Promise.all(n)];case 4:return u=i.sent(),(c=u.find((function(e){return e.measurementId===o})))?[4,t[c.appId]]:[3,6];case 5:i.sent(),i.label=6;case 6:return[3,8];case 7:return l=i.sent(),be.error(l),[3,8];case 8:return e(he.CONFIG,o,s),[2]}}))}))}function we(e,t,n,a,o){return r(this,void 0,void 0,(function(){var r,s,u,c,l,f,d,p;return i(this,(function(i){switch(i.label){case 0:return i.trys.push([0,4,,5]),r=[],o&&o.send_to?(s=o.send_to,Array.isArray(s)||(s=[s]),[4,Promise.all(n)]):[3,2];case 1:for(u=i.sent(),c=function(e){var n=u.find((function(t){return t.measurementId===e})),i=n&&t[n.appId];if(!i)return r=[],"break";r.push(i)},l=0,f=s;l<f.length&&(d=f[l],"break"!==c(d));l++);i.label=2;case 2:return 0===r.length&&(r=Object.values(t)),[4,Promise.all(r)];case 3:return i.sent(),e(he.EVENT,a,o||{}),[3,5];case 4:return p=i.sent(),be.error(p),[3,5];case 5:return[2]}}))}))}function Ie(e,t,n,a,o){var s=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];window[a].push(arguments)};return window[o]&&"function"==typeof window[o]&&(s=window[o]),window[o]=function(e,t,n,a){return function(o,s,u){return r(this,void 0,void 0,(function(){var r;return i(this,(function(i){switch(i.label){case 0:return i.trys.push([0,6,,7]),o!==he.EVENT?[3,2]:[4,we(e,t,n,s,u)];case 1:return i.sent(),[3,5];case 2:return o!==he.CONFIG?[3,4]:[4,ye(e,t,n,a,s,u)];case 3:return i.sent(),[3,5];case 4:e(he.SET,s),i.label=5;case 5:return[3,7];case 6:return r=i.sent(),be.error(r),[3,7];case 7:return[2]}}))}))}}(s,e,t,n),{gtagCore:s,wrappedGtag:window[o]}}var _e=new a("analytics","Analytics",((ge={})["already-exists"]="A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.",ge["already-initialized"]="Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.",ge["interop-component-reg-failed"]="Firebase Analytics Interop Component failed to instantiate: {$reason}",ge["invalid-analytics-context"]="Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}",ge["indexeddb-unavailable"]="IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}",ge["fetch-throttle"]="The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.",ge["config-fetch-failed"]="Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}",ge["no-api-key"]='The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',ge["no-app-id"]='The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',ge)),Ee=new(function(){function e(e,t){void 0===e&&(e={}),void 0===t&&(t=1e3),this.throttleMetadata=e,this.intervalMillis=t}return e.prototype.getThrottleMetadata=function(e){return this.throttleMetadata[e]},e.prototype.setThrottleMetadata=function(e,t){this.throttleMetadata[e]=t},e.prototype.deleteThrottleMetadata=function(e){delete this.throttleMetadata[e]},e}());function Te(e){return new Headers({Accept:"application/json","x-goog-api-key":e})}function Ce(e){var t;return r(this,void 0,void 0,(function(){var n,r,a,o,s,u,c;return i(this,(function(i){switch(i.label){case 0:return n=e.appId,r=e.apiKey,a={method:"GET",headers:Te(r)},o="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig".replace("{app-id}",n),[4,fetch(o,a)];case 1:if(200===(s=i.sent()).status||304===s.status)return[3,6];u="",i.label=2;case 2:return i.trys.push([2,4,,5]),[4,s.json()];case 3:return c=i.sent(),(null===(t=c.error)||void 0===t?void 0:t.message)&&(u=c.error.message),[3,5];case 4:return i.sent(),[3,5];case 5:throw _e.create("config-fetch-failed",{httpStatus:s.status,responseMessage:u});case 6:return[2,s.json()]}}))}))}function Se(e,t,n,a){var s=t.throttleEndTimeMillis,u=t.backoffCount;return void 0===a&&(a=Ee),r(this,void 0,void 0,(function(){var t,r,l,f,d,p,h;return i(this,(function(i){switch(i.label){case 0:t=e.appId,r=e.measurementId,i.label=1;case 1:return i.trys.push([1,3,,4]),[4,Ne(n,s)];case 2:return i.sent(),[3,4];case 3:if(l=i.sent(),r)return be.warn("Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID "+r+' provided in the "measurementId" field in the local Firebase config. ['+l.message+"]"),[2,{appId:t,measurementId:r}];throw l;case 4:return i.trys.push([4,6,,7]),[4,Ce(e)];case 5:return f=i.sent(),a.deleteThrottleMetadata(t),[2,f];case 6:if(!function(e){if(!(e instanceof o&&e.customData))return!1;var t=Number(e.customData.httpStatus);return 429===t||500===t||503===t||504===t}(d=i.sent())){if(a.deleteThrottleMetadata(t),r)return be.warn("Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID "+r+' provided in the "measurementId" field in the local Firebase config. ['+d.message+"]"),[2,{appId:t,measurementId:r}];throw d}return p=503===Number(d.customData.httpStatus)?c(u,a.intervalMillis,30):c(u,a.intervalMillis),h={throttleEndTimeMillis:Date.now()+p,backoffCount:u+1},a.setThrottleMetadata(t,h),be.debug("Calling attemptFetch again in "+p+" millis"),[2,Se(e,h,n,a)];case 7:return[2]}}))}))}function Ne(e,t){return new Promise((function(n,r){var i=Math.max(t-Date.now(),0),a=setTimeout(n,i);e.addEventListener((function(){clearTimeout(a),r(_e.create("fetch-throttle",{throttleEndTimeMillis:t}))}))}))}var De=function(){function e(){this.listeners=[]}return e.prototype.addEventListener=function(e){this.listeners.push(e)},e.prototype.abort=function(){this.listeners.forEach((function(e){return e()}))},e}();
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pe(e,t,n,a,o){return r(this,void 0,void 0,(function(){var s,u,c,d,p,h,v;return i(this,(function(m){switch(m.label){case 0:return(s=function(e,t,n){return void 0===t&&(t=Ee),r(this,void 0,void 0,(function(){var a,o,s,u,c,l,f=this;return i(this,(function(d){if(a=e.options,o=a.appId,s=a.apiKey,u=a.measurementId,!o)throw _e.create("no-app-id");if(!s){if(u)return[2,{measurementId:u,appId:o}];throw _e.create("no-api-key")}return c=t.getThrottleMetadata(o)||{backoffCount:0,throttleEndTimeMillis:Date.now()},l=new De,setTimeout((function(){return r(f,void 0,void 0,(function(){return i(this,(function(e){return l.abort(),[2]}))}))}),void 0!==n?n:6e4),[2,Se({appId:o,apiKey:s,measurementId:u},c,l,t)]}))}))}(e)).then((function(t){n[t.measurementId]=t.appId,e.options.measurementId&&t.measurementId!==e.options.measurementId&&be.warn("The measurement ID in the local Firebase config ("+e.options.measurementId+") does not match the measurement ID fetched from the server ("+t.measurementId+"). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.")})).catch((function(e){return be.error(e)})),t.push(s),u=function(){return r(this,void 0,void 0,(function(){var e;return i(this,(function(t){switch(t.label){case 0:return f()?[3,1]:(be.warn(_e.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),[2,!1]);case 1:return t.trys.push([1,3,,4]),[4,l()];case 2:return t.sent(),[3,4];case 3:return e=t.sent(),be.warn(_e.create("indexeddb-unavailable",{errorInfo:e}).message),[2,!1];case 4:return[2,!0]}}))}))}().then((function(e){return e?a.getId():void 0})),[4,Promise.all([s,u])];case 1:return c=m.sent(),d=c[0],p=c[1],o("js",new Date),(v={}).origin="firebase",v.update=!0,h=v,null!=p&&(h.firebase_id=p),o(he.CONFIG,d.measurementId,h),[2,d.measurementId]}}))}))}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ae,ke,xe={},Oe=[],Fe={},je="dataLayer",Me="gtag",qe=!1;function Le(e){if(qe)throw _e.create("already-initialized");e.dataLayerName&&(je=e.dataLayerName),e.gtagName&&(Me=e.gtagName)}function Re(e,t){!function(){var e=[];if(d()&&e.push("This is a browser extension environment."),p()||e.push("Cookies are not available."),e.length>0){var t=e.map((function(e,t){return"("+(t+1)+") "+e})).join(" "),n=_e.create("invalid-analytics-context",{errorInfo:t});be.warn(n.message)}}();var n=e.options.appId;if(!n)throw _e.create("no-app-id");if(!e.options.apiKey){if(!e.options.measurementId)throw _e.create("no-api-key");be.warn('The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID '+e.options.measurementId+' provided in the "measurementId" field in the local Firebase config.')}if(null!=xe[n])throw _e.create("already-exists",{id:n});if(!qe){(function(){for(var e=window.document.getElementsByTagName("script"),t=0,n=Object.values(e);t<n.length;t++){var r=n[t];if(r.src&&r.src.includes(me))return r}return null}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */)()||function(e){var t=document.createElement("script");t.src=me+"?l="+e,t.async=!0,document.head.appendChild(t)}(je),function(e){var t=[];Array.isArray(window[e])?t=window[e]:window[e]=t}(je);var a=Ie(xe,Oe,Fe,je,Me),o=a.wrappedGtag,u=a.gtagCore;ke=o,Ae=u,qe=!0}return xe[n]=Pe(e,Oe,Fe,t,Ae),{app:e,logEvent:function(e,t,a){(
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(e,t,n,a,o){return r(this,void 0,void 0,(function(){var r,u;return i(this,(function(i){switch(i.label){case 0:return o&&o.global?(e(he.EVENT,n,a),[2]):[3,1];case 1:return[4,t];case 2:r=i.sent(),u=s(s({},a),{send_to:r}),e(he.EVENT,n,u),i.label=3;case 3:return[2]}}))}))})(ke,xe[n],e,t,a).catch((function(e){return be.error(e)}))},setCurrentScreen:function(e,t){(function(e,t,n,a){return r(this,void 0,void 0,(function(){var r;return i(this,(function(i){switch(i.label){case 0:return a&&a.global?(e(he.SET,{screen_name:n}),[2,Promise.resolve()]):[3,1];case 1:return[4,t];case 2:r=i.sent(),e(he.CONFIG,r,{update:!0,screen_name:n}),i.label=3;case 3:return[2]}}))}))})(ke,xe[n],e,t).catch((function(e){return be.error(e)}))},setUserId:function(e,t){(function(e,t,n,a){return r(this,void 0,void 0,(function(){var r;return i(this,(function(i){switch(i.label){case 0:return a&&a.global?(e(he.SET,{user_id:n}),[2,Promise.resolve()]):[3,1];case 1:return[4,t];case 2:r=i.sent(),e(he.CONFIG,r,{update:!0,user_id:n}),i.label=3;case 3:return[2]}}))}))})(ke,xe[n],e,t).catch((function(e){return be.error(e)}))},setUserProperties:function(e,t){(function(e,t,n,a){return r(this,void 0,void 0,(function(){var r,o,s,u,c;return i(this,(function(i){switch(i.label){case 0:if(!a||!a.global)return[3,1];for(r={},o=0,s=Object.keys(n);o<s.length;o++)u=s[o],r["user_properties."+u]=n[u];return e(he.SET,r),[2,Promise.resolve()];case 1:return[4,t];case 2:c=i.sent(),e(he.CONFIG,c,{update:!0,user_properties:n}),i.label=3;case 3:return[2]}}))}))})(ke,xe[n],e,t).catch((function(e){return be.error(e)}))},setAnalyticsCollectionEnabled:function(e){(function(e,t){return r(this,void 0,void 0,(function(){var n;return i(this,(function(r){switch(r.label){case 0:return[4,e];case 1:return n=r.sent(),window["ga-disable-"+n]=!t,[2]}}))}))})(xe[n],e).catch((function(e){return be.error(e)}))},INTERNAL:{delete:function(){return delete xe[n],Promise.resolve()}}}}function Ve(){return r(this,void 0,void 0,(function(){return i(this,(function(e){switch(e.label){case 0:if(d())return[2,!1];if(!p())return[2,!1];if(!f())return[2,!1];e.label=1;case 1:return e.trys.push([1,3,,4]),[4,l()];case 2:return[2,e.sent()];case 3:return e.sent(),[2,!1];case 4:return[2]}}))}))}!function(t){t.INTERNAL.registerComponent(new e("analytics",(function(e){return Re(e.getProvider("app").getImmediate(),e.getProvider("installations").getImmediate())}),"PUBLIC").setServiceProps({settings:Le,EventName:ve,isSupported:Ve})),t.INTERNAL.registerComponent(new e("analytics-internal",(function(e){try{return{logEvent:e.getProvider("analytics").getImmediate().logEvent}}catch(e){throw _e.create("interop-component-reg-failed",{reason:e})}}),"PRIVATE")),t.registerVersion("@firebase/analytics","0.6.2")}(t);

