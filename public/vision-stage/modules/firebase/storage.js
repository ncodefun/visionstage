import{j as e,a as t,b as r,F as n,C as o,f as i,l as s}from"../common/index.esm-671f1674.js";
/**
 * @license
 * Copyright 2017 Google LLC
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
 */var a=function(t){function r(e,n){var o=t.call(this,x(e),"Firebase Storage: "+n)||this;return o.customData={serverResponse:null},Object.setPrototypeOf(o,r.prototype),o}return e(r,t),r.prototype.codeEquals=function(e){return x(e)===this.code},Object.defineProperty(r.prototype,"message",{get:function(){return this.customData.serverResponse?this.message+"\n"+this.customData.serverResponse:this.message},enumerable:!1,configurable:!0}),Object.defineProperty(r.prototype,"serverResponse",{get:function(){return this.customData.serverResponse},set:function(e){this.customData.serverResponse=e},enumerable:!1,configurable:!0}),r}(n),u="unknown",l="object-not-found",c="quota-exceeded",h="unauthenticated",p="unauthorized",f="retry-limit-exceeded",d="canceled",_="invalid-url",v="invalid-default-bucket",m="cannot-slice-blob",g="server-file-wrong-size",b="no-download-url",y="invalid-argument",w="app-deleted",R="invalid-root-operation",k="invalid-format",T="internal-error";function x(e){return"storage/"+e}function O(){return new a(u,"An unknown error occurred, please check the error payload for server response.")}function U(){return new a(d,"User canceled the upload/download.")}function S(){return new a(m,"Cannot slice blob for upload. Please retry the upload.")}function P(){return new a(w,"The Firebase app was deleted.")}function C(e,t){return new a(k,"String does not match format '"+e+"': "+t)}function E(e){throw new a(T,"Internal error: "+e)}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */var A={RAW:"raw",BASE64:"base64",BASE64URL:"base64url",DATA_URL:"data_url"},I=function(e,t){this.data=e,this.contentType=t||null};function q(e,t){switch(e){case A.RAW:return new I(L(t));case A.BASE64:case A.BASE64URL:return new I(N(e,t));case A.DATA_URL:return new I((r=new j(t)).base64?N(A.BASE64,r.rest):function(e){var t;try{t=decodeURIComponent(e)}catch(e){throw C(A.DATA_URL,"Malformed data URL.")}return L(t)}(r.rest),function(e){return new j(e).contentType}(t))}var r;throw O()}function L(e){for(var t=[],r=0;r<e.length;r++){var n=e.charCodeAt(r);if(n<=127)t.push(n);else if(n<=2047)t.push(192|n>>6,128|63&n);else if(55296==(64512&n))if(r<e.length-1&&56320==(64512&e.charCodeAt(r+1)))n=65536|(1023&n)<<10|1023&e.charCodeAt(++r),t.push(240|n>>18,128|n>>12&63,128|n>>6&63,128|63&n);else t.push(239,191,189);else 56320==(64512&n)?t.push(239,191,189):t.push(224|n>>12,128|n>>6&63,128|63&n)}return new Uint8Array(t)}function N(e,t){switch(e){case A.BASE64:var r=-1!==t.indexOf("-"),n=-1!==t.indexOf("_");if(r||n)throw C(e,"Invalid character '"+(r?"-":"_")+"' found: is it base64url encoded?");break;case A.BASE64URL:var o=-1!==t.indexOf("+"),i=-1!==t.indexOf("/");if(o||i)throw C(e,"Invalid character '"+(o?"+":"/")+"' found: is it base64 encoded?");t=t.replace(/-/g,"+").replace(/_/g,"/")}var s;try{s=atob(t)}catch(t){throw C(e,"Invalid character found")}for(var a=new Uint8Array(s.length),u=0;u<s.length;u++)a[u]=s.charCodeAt(u);return a}var j=function(e){this.base64=!1,this.contentType=null;var t=e.match(/^data:([^,]+)?,/);if(null===t)throw C(A.DATA_URL,"Must be formatted 'data:[<mediatype>][;base64],<data>");var r=t[1]||null;null!=r&&(this.base64=(n=r,o=";base64",n.length>=o.length&&n.substring(n.length-o.length)===o),this.contentType=this.base64?r.substring(0,r.length-";base64".length):r),this.rest=e.substring(e.indexOf(",")+1);var n,o;
/**
 * @license
 * Copyright 2017 Google LLC
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
 */};var B,z={STATE_CHANGED:"state_changed"},H="running",M="pausing",D="paused",F="success",X="canceling",G="canceled",W="error",K={RUNNING:"running",PAUSED:"paused",SUCCESS:"success",CANCELED:"canceled",ERROR:"error"};function Z(e){switch(e){case H:case M:case X:return K.RUNNING;case D:return K.PAUSED;case F:return K.SUCCESS;case G:return K.CANCELED;case W:default:return K.ERROR}}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */function V(e){return null!=e}function $(e){return"string"==typeof e||e instanceof String}function J(e){return Y()&&e instanceof Blob}function Y(){return"undefined"!=typeof Blob}function Q(e,t,r,n){if(n<t)throw new a(y,"Invalid value for '"+e+"'. Expected "+t+" or greater.");if(n>r)throw new a(y,"Invalid value for '"+e+"'. Expected "+r+" or less.")}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */!function(e){e[e.NO_ERROR=0]="NO_ERROR",e[e.NETWORK_ERROR=1]="NETWORK_ERROR",e[e.ABORT=2]="ABORT"}(B||(B={}));
/**
 * @license
 * Copyright 2017 Google LLC
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
var ee=function(){function e(){var e=this;this.sent_=!1,this.xhr_=new XMLHttpRequest,this.errorCode_=B.NO_ERROR,this.sendPromise_=new Promise((function(t){e.xhr_.addEventListener("abort",(function(){e.errorCode_=B.ABORT,t(e)})),e.xhr_.addEventListener("error",(function(){e.errorCode_=B.NETWORK_ERROR,t(e)})),e.xhr_.addEventListener("load",(function(){t(e)}))}))}return e.prototype.send=function(e,t,r,n){if(this.sent_)throw E("cannot .send() more than once");if(this.sent_=!0,this.xhr_.open(t,e,!0),V(n))for(var o in n)n.hasOwnProperty(o)&&this.xhr_.setRequestHeader(o,n[o].toString());return V(r)?this.xhr_.send(r):this.xhr_.send(),this.sendPromise_},e.prototype.getErrorCode=function(){if(!this.sent_)throw E("cannot .getErrorCode() before sending");return this.errorCode_},e.prototype.getStatus=function(){if(!this.sent_)throw E("cannot .getStatus() before sending");try{return this.xhr_.status}catch(e){return-1}},e.prototype.getResponseText=function(){if(!this.sent_)throw E("cannot .getResponseText() before sending");return this.xhr_.responseText},e.prototype.abort=function(){this.xhr_.abort()},e.prototype.getResponseHeader=function(e){return this.xhr_.getResponseHeader(e)},e.prototype.addUploadProgressListener=function(e){V(this.xhr_.upload)&&this.xhr_.upload.addEventListener("progress",e)},e.prototype.removeUploadProgressListener=function(e){V(this.xhr_.upload)&&this.xhr_.upload.removeEventListener("progress",e)},e}(),te=function(){function e(){}return e.prototype.createXhrIo=function(){return new ee},e}();
/**
 * @license
 * Copyright 2017 Google LLC
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
 * Copyright 2017 Google LLC
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
function re(){return"undefined"!=typeof BlobBuilder?BlobBuilder:"undefined"!=typeof WebKitBlobBuilder?WebKitBlobBuilder:void 0}function ne(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];var r=re();if(void 0!==r){for(var n=new r,o=0;o<e.length;o++)n.append(e[o]);return n.getBlob()}if(Y())return new Blob(e);throw Error("This browser doesn't seem to support creating Blobs")}
/**
 * @license
 * Copyright 2017 Google LLC
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
var oe=function(){function e(e,t){var r=0,n="";J(e)?(this.data_=e,r=e.size,n=e.type):e instanceof ArrayBuffer?(t?this.data_=new Uint8Array(e):(this.data_=new Uint8Array(e.byteLength),this.data_.set(new Uint8Array(e))),r=this.data_.length):e instanceof Uint8Array&&(t?this.data_=e:(this.data_=new Uint8Array(e.length),this.data_.set(e)),r=e.length),this.size_=r,this.type_=n}return e.prototype.size=function(){return this.size_},e.prototype.type=function(){return this.type_},e.prototype.slice=function(t,r){if(J(this.data_)){var n=function(e,t,r){return e.webkitSlice?e.webkitSlice(t,r):e.mozSlice?e.mozSlice(t,r):e.slice?e.slice(t,r):null}(this.data_,t,r);return null===n?null:new e(n)}return new e(new Uint8Array(this.data_.buffer,t,r-t),!0)},e.getBlob=function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];if(Y()){var n=t.map((function(t){return t instanceof e?t.data_:t}));return new e(ne.apply(null,n))}var o=t.map((function(e){return $(e)?q(A.RAW,e).data:e.data_})),i=0;o.forEach((function(e){i+=e.byteLength}));var s=new Uint8Array(i),a=0;return o.forEach((function(e){for(var t=0;t<e.length;t++)s[a++]=e[t]})),new e(s,!0)},e.prototype.uploadData=function(){return this.data_},e}(),ie=function(){function e(e,t){this.bucket=e,this.path_=t}return Object.defineProperty(e.prototype,"path",{get:function(){return this.path_},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"isRoot",{get:function(){return 0===this.path.length},enumerable:!1,configurable:!0}),e.prototype.fullServerUrl=function(){var e=encodeURIComponent;return"/b/"+e(this.bucket)+"/o/"+e(this.path)},e.prototype.bucketOnlyServerUrl=function(){return"/b/"+encodeURIComponent(this.bucket)+"/o"},e.makeFromBucketSpec=function(t){var r;try{r=e.makeFromUrl(t)}catch(r){return new e(t,"")}if(""===r.path)return r;throw new a(v,"Invalid default bucket '"+t+"'.")},e.makeFromUrl=function(t){var r=null;var n=new RegExp("^gs://([A-Za-z0-9.\\-_]+)(/(.*))?$","i");function o(e){e.path_=decodeURIComponent(e.path)}for(var i="firebasestorage.googleapis.com".replace(/[.]/g,"\\."),s=[{regex:n,indices:{bucket:1,path:3},postModify:function(e){"/"===e.path.charAt(e.path.length-1)&&(e.path_=e.path_.slice(0,-1))}},{regex:new RegExp("^https?://"+i+"/v[A-Za-z0-9_]+/b/([A-Za-z0-9.\\-_]+)/o(/([^?#]*).*)?$","i"),indices:{bucket:1,path:3},postModify:o},{regex:new RegExp("^https?://(?:storage.googleapis.com|storage.cloud.google.com)/([A-Za-z0-9.\\-_]+)/([^?#]*)","i"),indices:{bucket:1,path:2},postModify:o}],u=0;u<s.length;u++){var l=s[u],c=l.regex.exec(t);if(c){var h=c[l.indices.bucket],p=c[l.indices.path];p||(p=""),r=new e(h,p),l.postModify(r);break}}if(null==r)throw function(e){return new a(_,"Invalid URL '"+e+"'.")}(t);return r},e}();
/**
 * @license
 * Copyright 2017 Google LLC
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
 * Copyright 2017 Google LLC
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
function se(e){var t,r;try{t=JSON.parse(e)}catch(e){return null}return"object"!=typeof(r=t)||Array.isArray(r)?null:t}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */function ae(e){var t=e.lastIndexOf("/",e.length-2);return-1===t?e:e.slice(t+1)}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */function ue(e){return"https://firebasestorage.googleapis.com/v0"+e}function le(e){var t=encodeURIComponent,r="?";for(var n in e){if(e.hasOwnProperty(n))r=r+(t(n)+"="+t(e[n]))+"&"}return r=r.slice(0,-1)}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */function ce(e,t){return t}var he=function(e,t,r,n){this.server=e,this.local=t||e,this.writable=!!r,this.xform=n||ce},pe=null;function fe(){if(pe)return pe;var e=[];e.push(new he("bucket")),e.push(new he("generation")),e.push(new he("metageneration")),e.push(new he("name","fullPath",!0));var t=new he("name");t.xform=function(e,t){return function(e){return!$(e)||e.length<2?e:ae(e)}(t)},e.push(t);var r=new he("size");return r.xform=function(e,t){return V(t)?Number(t):t},e.push(r),e.push(new he("timeCreated")),e.push(new he("updated")),e.push(new he("md5Hash",null,!0)),e.push(new he("cacheControl",null,!0)),e.push(new he("contentDisposition",null,!0)),e.push(new he("contentEncoding",null,!0)),e.push(new he("contentLanguage",null,!0)),e.push(new he("contentType",null,!0)),e.push(new he("metadata","customMetadata",!0)),pe=e}function de(e,t,r){for(var n={type:"file"},o=r.length,i=0;i<o;i++){var s=r[i];n[s.local]=s.xform(n,t[s.server])}return function(e,t){Object.defineProperty(e,"ref",{get:function(){var r=e.bucket,n=e.fullPath,o=new ie(r,n);return t.makeStorageReference(o)}})}(n,e),n}function _e(e,t,r){var n=se(t);return null===n?null:de(e,n,r)}function ve(e,t){for(var r={},n=t.length,o=0;o<n;o++){var i=t[o];i.writable&&(r[i.server]=e[i.local])}return JSON.stringify(r)}
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
 */function me(e,t,r){var n=se(r);return null===n?null:function(e,t,r){var n={prefixes:[],items:[],nextPageToken:r.nextPageToken};if(r.prefixes)for(var o=0,i=r.prefixes;o<i.length;o++){var s=i[o].replace(/\/$/,""),a=e.makeStorageReference(new ie(t,s));n.prefixes.push(a)}if(r.items)for(var u=0,l=r.items;u<l.length;u++){var c=l[u];a=e.makeStorageReference(new ie(t,c.name));n.items.push(a)}return n}(e,t,n)}var ge=function(e,t,r,n){this.url=e,this.method=t,this.handler=r,this.timeout=n,this.urlParams={},this.headers={},this.body=null,this.errorHandler=null,this.progressCallback=null,this.successCodes=[200],this.additionalRetryCodes=[]};
/**
 * @license
 * Copyright 2017 Google LLC
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
 */function be(e){if(!e)throw O()}function ye(e,t){return function(r,n){var o=_e(e,n,t);return be(null!==o),o}}function we(e,t){return function(r,n){var o=_e(e,n,t);return be(null!==o),function(e,t){var r=se(t);if(null===r)return null;if(!$(r.downloadTokens))return null;var n=r.downloadTokens;if(0===n.length)return null;var o=encodeURIComponent;return n.split(",").map((function(t){var r=e.bucket,n=e.fullPath;return ue("/b/"+o(r)+"/o/"+o(n))+le({alt:"media",token:t})}))[0]}(o,n)}}function Re(e){return function(t,r){var n,o,i;return 401===t.getStatus()?n=new a(h,"User is not authenticated, please authenticate using Firebase Authentication and try again."):402===t.getStatus()?(i=e.bucket,n=new a(c,"Quota for bucket '"+i+"' exceeded, please view quota on https://firebase.google.com/pricing/.")):403===t.getStatus()?(o=e.path,n=new a(p,"User does not have permission to access '"+o+"'.")):n=r,n.serverResponse=r.serverResponse,n}}function ke(e){var t=Re(e);return function(r,n){var o,i=t(r,n);return 404===r.getStatus()&&(o=e.path,i=new a(l,"Object '"+o+"' does not exist.")),i.serverResponse=n.serverResponse,i}}function Te(e,t,r){var n=ue(t.fullServerUrl()),o=e.maxOperationRetryTime,i=new ge(n,"GET",ye(e,r),o);return i.errorHandler=ke(t),i}function xe(e,t,r,n,o){var i={};t.isRoot?i.prefix="":i.prefix=t.path+"/",r&&r.length>0&&(i.delimiter=r),n&&(i.pageToken=n),o&&(i.maxResults=o);var s=ue(t.bucketOnlyServerUrl()),a=e.maxOperationRetryTime,u=new ge(s,"GET",function(e,t){return function(r,n){var o=me(e,t,n);return be(null!==o),o}}(e,t.bucket),a);return u.urlParams=i,u.errorHandler=Re(t),u}function Oe(e,t,r){var n=Object.assign({},r);return n.fullPath=e.path,n.size=t.size(),n.contentType||(n.contentType=function(e,t){return e&&e.contentType||t&&t.type()||"application/octet-stream"}(null,t)),n}var Ue=function(e,t,r,n){this.current=e,this.total=t,this.finalized=!!r,this.metadata=n||null};function Se(e,t){var r=null;try{r=e.getResponseHeader("X-Goog-Upload-Status")}catch(e){be(!1)}return be(!!r&&-1!==(t||["active"]).indexOf(r)),r}function Pe(e,t,r,n,o,i,s,u){var l=new Ue(0,0);if(s?(l.current=s.current,l.total=s.total):(l.current=0,l.total=n.size()),n.size()!==l.total)throw new a(g,"Server recorded incorrect upload file size, please retry the upload.");var c=l.total-l.current,h=c;o>0&&(h=Math.min(h,o));var p=l.current,f=p+h,d={"X-Goog-Upload-Command":h===c?"upload, finalize":"upload","X-Goog-Upload-Offset":l.current},_=n.slice(p,f);if(null===_)throw S();var v=t.maxUploadRetryTime,m=new ge(r,"POST",(function(e,r){var o,s=Se(e,["active","final"]),a=l.current+h,u=n.size();return o="final"===s?ye(t,i)(e,r):null,new Ue(a,u,"final"===s,o)}),v);return m.headers=d,m.body=_.uploadData(),m.progressCallback=u||null,m.errorHandler=Re(e),m}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */var Ce=function(e,t,r){if("function"==typeof e||V(t)||V(r))this.next=e,this.error=t||null,this.complete=r||null;else{var n=e;this.next=n.next||null,this.error=n.error||null,this.complete=n.complete||null}},Ee=function(e,t,r,n,o,i){this.bytesTransferred=e,this.totalBytes=t,this.state=r,this.metadata=n,this.task=o,this.ref=i};
/**
 * @license
 * Copyright 2017 Google LLC
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
function Ae(e){return function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];Promise.resolve().then((function(){return e.apply(void 0,t)}))}}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */var Ie=function(){function e(e,t,r,n,o,i){var s=this;void 0===i&&(i=null),this.transferred_=0,this.needToFetchStatus_=!1,this.needToFetchMetadata_=!1,this.observers_=[],this.error_=null,this.uploadUrl_=null,this.request_=null,this.chunkMultiplier_=1,this.resolve_=null,this.reject_=null,this.ref_=e,this.service_=t,this.location_=r,this.blob_=o,this.metadata_=i,this.mappings_=n,this.resumable_=this.shouldDoResumable_(this.blob_),this.state_=H,this.errorHandler_=function(e){s.request_=null,s.chunkMultiplier_=1,e.codeEquals(d)?(s.needToFetchStatus_=!0,s.completeTransitions_()):(s.error_=e,s.transition_(W))},this.metadataErrorHandler_=function(e){s.request_=null,e.codeEquals(d)?s.completeTransitions_():(s.error_=e,s.transition_(W))},this.promise_=new Promise((function(e,t){s.resolve_=e,s.reject_=t,s.start_()})),this.promise_.then(null,(function(){}))}return e.prototype.makeProgressCallback_=function(){var e=this,t=this.transferred_;return function(r){return e.updateProgress_(t+r)}},e.prototype.shouldDoResumable_=function(e){return e.size()>262144},e.prototype.start_=function(){this.state_===H&&null===this.request_&&(this.resumable_?null===this.uploadUrl_?this.createResumable_():this.needToFetchStatus_?this.fetchStatus_():this.needToFetchMetadata_?this.fetchMetadata_():this.continueUpload_():this.oneShotUpload_())},e.prototype.resolveToken_=function(e){var t=this;this.service_.getAuthToken().then((function(r){switch(t.state_){case H:e(r);break;case X:t.transition_(G);break;case M:t.transition_(D)}}))},e.prototype.createResumable_=function(){var e=this;this.resolveToken_((function(t){var r=function(e,t,r,n,o){var i=t.bucketOnlyServerUrl(),s=Oe(t,n,o),a={name:s.fullPath},u=ue(i),l={"X-Goog-Upload-Protocol":"resumable","X-Goog-Upload-Command":"start","X-Goog-Upload-Header-Content-Length":n.size(),"X-Goog-Upload-Header-Content-Type":s.contentType,"Content-Type":"application/json; charset=utf-8"},c=ve(s,r),h=e.maxUploadRetryTime,p=new ge(u,"POST",(function(e){var t;Se(e);try{t=e.getResponseHeader("X-Goog-Upload-URL")}catch(e){be(!1)}return be($(t)),t}),h);return p.urlParams=a,p.headers=l,p.body=c,p.errorHandler=Re(t),p}(e.service_,e.location_,e.mappings_,e.blob_,e.metadata_),n=e.service_.makeRequest(r,t);e.request_=n,n.getPromise().then((function(t){e.request_=null,e.uploadUrl_=t,e.needToFetchStatus_=!1,e.completeTransitions_()}),e.errorHandler_)}))},e.prototype.fetchStatus_=function(){var e=this,t=this.uploadUrl_;this.resolveToken_((function(r){var n=function(e,t,r,n){var o=e.maxUploadRetryTime,i=new ge(r,"POST",(function(e){var t=Se(e,["active","final"]),r=null;try{r=e.getResponseHeader("X-Goog-Upload-Size-Received")}catch(e){be(!1)}r||be(!1);var o=Number(r);return be(!isNaN(o)),new Ue(o,n.size(),"final"===t)}),o);return i.headers={"X-Goog-Upload-Command":"query"},i.errorHandler=Re(t),i}(e.service_,e.location_,t,e.blob_),o=e.service_.makeRequest(n,r);e.request_=o,o.getPromise().then((function(t){t=t,e.request_=null,e.updateProgress_(t.current),e.needToFetchStatus_=!1,t.finalized&&(e.needToFetchMetadata_=!0),e.completeTransitions_()}),e.errorHandler_)}))},e.prototype.continueUpload_=function(){var e=this,t=262144*this.chunkMultiplier_,r=new Ue(this.transferred_,this.blob_.size()),n=this.uploadUrl_;this.resolveToken_((function(o){var i;try{i=Pe(e.location_,e.service_,n,e.blob_,t,e.mappings_,r,e.makeProgressCallback_())}catch(t){return e.error_=t,void e.transition_(W)}var s=e.service_.makeRequest(i,o);e.request_=s,s.getPromise().then((function(t){e.increaseMultiplier_(),e.request_=null,e.updateProgress_(t.current),t.finalized?(e.metadata_=t.metadata,e.transition_(F)):e.completeTransitions_()}),e.errorHandler_)}))},e.prototype.increaseMultiplier_=function(){262144*this.chunkMultiplier_<33554432&&(this.chunkMultiplier_*=2)},e.prototype.fetchMetadata_=function(){var e=this;this.resolveToken_((function(t){var r=Te(e.service_,e.location_,e.mappings_),n=e.service_.makeRequest(r,t);e.request_=n,n.getPromise().then((function(t){e.request_=null,e.metadata_=t,e.transition_(F)}),e.metadataErrorHandler_)}))},e.prototype.oneShotUpload_=function(){var e=this;this.resolveToken_((function(t){var r=function(e,t,r,n,o){var i=t.bucketOnlyServerUrl(),s={"X-Goog-Upload-Protocol":"multipart"},a=function(){for(var e="",t=0;t<2;t++)e+=Math.random().toString().slice(2);return e}();s["Content-Type"]="multipart/related; boundary="+a;var u=Oe(t,n,o),l="--"+a+"\r\nContent-Type: application/json; charset=utf-8\r\n\r\n"+ve(u,r)+"\r\n--"+a+"\r\nContent-Type: "+u.contentType+"\r\n\r\n",c="\r\n--"+a+"--",h=oe.getBlob(l,n,c);if(null===h)throw S();var p={name:u.fullPath},f=ue(i),d=e.maxUploadRetryTime,_=new ge(f,"POST",ye(e,r),d);return _.urlParams=p,_.headers=s,_.body=h.uploadData(),_.errorHandler=Re(t),_}(e.service_,e.location_,e.mappings_,e.blob_,e.metadata_),n=e.service_.makeRequest(r,t);e.request_=n,n.getPromise().then((function(t){e.request_=null,e.metadata_=t,e.updateProgress_(e.blob_.size()),e.transition_(F)}),e.errorHandler_)}))},e.prototype.updateProgress_=function(e){var t=this.transferred_;this.transferred_=e,this.transferred_!==t&&this.notifyObservers_()},e.prototype.transition_=function(e){if(this.state_!==e)switch(e){case X:case M:this.state_=e,null!==this.request_&&this.request_.cancel();break;case H:var t=this.state_===D;this.state_=e,t&&(this.notifyObservers_(),this.start_());break;case D:this.state_=e,this.notifyObservers_();break;case G:this.error_=U(),this.state_=e,this.notifyObservers_();break;case W:case F:this.state_=e,this.notifyObservers_()}},e.prototype.completeTransitions_=function(){switch(this.state_){case M:this.transition_(D);break;case X:this.transition_(G);break;case H:this.start_()}},Object.defineProperty(e.prototype,"snapshot",{get:function(){var e=Z(this.state_);return new Ee(this.transferred_,this.blob_.size(),e,this.metadata_,this,this.ref_)},enumerable:!1,configurable:!0}),e.prototype.on=function(e,t,r,n){var o=this,i=new Ce(t,r,n);return this.addObserver_(i),function(){o.removeObserver_(i)}},e.prototype.then=function(e,t){return this.promise_.then(e,t)},e.prototype.catch=function(e){return this.then(null,e)},e.prototype.addObserver_=function(e){this.observers_.push(e),this.notifyObserver_(e)},e.prototype.removeObserver_=function(e){var t=this.observers_.indexOf(e);-1!==t&&this.observers_.splice(t,1)},e.prototype.notifyObservers_=function(){var e=this;this.finishPromise_(),this.observers_.slice().forEach((function(t){e.notifyObserver_(t)}))},e.prototype.finishPromise_=function(){if(null!==this.resolve_){var e=!0;switch(Z(this.state_)){case K.SUCCESS:Ae(this.resolve_.bind(null,this.snapshot))();break;case K.CANCELED:case K.ERROR:Ae(this.reject_.bind(null,this.error_))();break;default:e=!1}e&&(this.resolve_=null,this.reject_=null)}},e.prototype.notifyObserver_=function(e){switch(Z(this.state_)){case K.RUNNING:case K.PAUSED:e.next&&Ae(e.next.bind(e,this.snapshot))();break;case K.SUCCESS:e.complete&&Ae(e.complete.bind(e))();break;case K.CANCELED:case K.ERROR:e.error&&Ae(e.error.bind(e,this.error_))();break;default:e.error&&Ae(e.error.bind(e,this.error_))()}},e.prototype.resume=function(){var e=this.state_===D||this.state_===M;return e&&this.transition_(H),e},e.prototype.pause=function(){var e=this.state_===H;return e&&this.transition_(M),e},e.prototype.cancel=function(){var e=this.state_===H||this.state_===M;return e&&this.transition_(X),e},e}(),qe=function(){function e(e,t){this.service=e,this.location=t instanceof ie?t:ie.makeFromUrl(t)}return e.prototype.toString=function(){return"gs://"+this.location.bucket+"/"+this.location.path},e.prototype.newRef=function(t,r){return new e(t,r)},e.prototype.mappings=function(){return fe()},e.prototype.child=function(e){var t=function(e,t){var r=t.split("/").filter((function(e){return e.length>0})).join("/");return 0===e.length?r:e+"/"+r}(this.location.path,e),r=new ie(this.location.bucket,t);return this.newRef(this.service,r)},Object.defineProperty(e.prototype,"parent",{get:function(){var e=function(e){if(0===e.length)return null;var t=e.lastIndexOf("/");return-1===t?"":e.slice(0,t)}(this.location.path);if(null===e)return null;var t=new ie(this.location.bucket,e);return this.newRef(this.service,t)},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"root",{get:function(){var e=new ie(this.location.bucket,"");return this.newRef(this.service,e)},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"bucket",{get:function(){return this.location.bucket},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"fullPath",{get:function(){return this.location.path},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"name",{get:function(){return ae(this.location.path)},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"storage",{get:function(){return this.service},enumerable:!1,configurable:!0}),e.prototype.put=function(e,t){return void 0===t&&(t=null),this.throwIfRoot_("put"),new Ie(this,this.service,this.location,this.mappings(),new oe(e),t)},e.prototype.putString=function(e,t,r){void 0===t&&(t=A.RAW),this.throwIfRoot_("putString");var n=q(t,e),o=Object.assign({},r);return!V(o.contentType)&&V(n.contentType)&&(o.contentType=n.contentType),new Ie(this,this.service,this.location,this.mappings(),new oe(n.data,!0),o)},e.prototype.delete=function(){var e=this;return this.throwIfRoot_("delete"),this.service.getAuthToken().then((function(t){var r=function(e,t){var r=ue(t.fullServerUrl()),n=e.maxOperationRetryTime,o=new ge(r,"DELETE",(function(e,t){}),n);return o.successCodes=[200,204],o.errorHandler=ke(t),o}(e.service,e.location);return e.service.makeRequest(r,t).getPromise()}))},e.prototype.listAll=function(){var e={prefixes:[],items:[]};return this.listAllHelper(e).then((function(){return e}))},e.prototype.listAllHelper=function(e,n){return t(this,void 0,void 0,(function(){var t,o,i,s;return r(this,(function(r){switch(r.label){case 0:return t={pageToken:n},[4,this.list(t)];case 1:return o=r.sent(),(i=e.prefixes).push.apply(i,o.prefixes),(s=e.items).push.apply(s,o.items),null==o.nextPageToken?[3,3]:[4,this.listAllHelper(e,o.nextPageToken)];case 2:r.sent(),r.label=3;case 3:return[2]}}))}))},e.prototype.list=function(e){var t=this,r=e||{};return"number"==typeof r.maxResults&&Q("options.maxResults",1,1e3,r.maxResults),this.service.getAuthToken().then((function(e){var n=xe(t.service,t.location,"/",r.pageToken,r.maxResults);return t.service.makeRequest(n,e).getPromise()}))},e.prototype.getMetadata=function(){var e=this;return this.throwIfRoot_("getMetadata"),this.service.getAuthToken().then((function(t){var r=Te(e.service,e.location,e.mappings());return e.service.makeRequest(r,t).getPromise()}))},e.prototype.updateMetadata=function(e){var t=this;return this.throwIfRoot_("updateMetadata"),this.service.getAuthToken().then((function(r){var n=function(e,t,r,n){var o=ue(t.fullServerUrl()),i=ve(r,n),s=e.maxOperationRetryTime,a=new ge(o,"PATCH",ye(e,n),s);return a.headers={"Content-Type":"application/json; charset=utf-8"},a.body=i,a.errorHandler=ke(t),a}(t.service,t.location,e,t.mappings());return t.service.makeRequest(n,r).getPromise()}))},e.prototype.getDownloadURL=function(){var e=this;return this.throwIfRoot_("getDownloadURL"),this.service.getAuthToken().then((function(t){var r=function(e,t,r){var n=ue(t.fullServerUrl()),o=e.maxOperationRetryTime,i=new ge(n,"GET",we(e,r),o);return i.errorHandler=ke(t),i}(e.service,e.location,e.mappings());return e.service.makeRequest(r,t).getPromise().then((function(e){if(null===e)throw new a(b,"The given file does not have any download URLs.");return e}))}))},e.prototype.throwIfRoot_=function(e){if(""===this.location.path)throw function(e){return new a(R,"The operation '"+e+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}(e)},e}(),Le=function(){function e(e){this.promise_=Promise.reject(e)}return e.prototype.getPromise=function(){return this.promise_},e.prototype.cancel=function(e){},e}();
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
 * Copyright 2017 Google LLC
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
var Ne=function(){function e(e,t,r,n,o,i,s,a,u,l,c){var h=this;this.pendingXhr_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.url_=e,this.method_=t,this.headers_=r,this.body_=n,this.successCodes_=o.slice(),this.additionalRetryCodes_=i.slice(),this.callback_=s,this.errorCallback_=a,this.progressCallback_=l,this.timeout_=u,this.pool_=c,this.promise_=new Promise((function(e,t){h.resolve_=e,h.reject_=t,h.start_()}))}return e.prototype.start_=function(){var e=this;function t(t,r){var n,o=e.resolve_,i=e.reject_,s=r.xhr;if(r.wasSuccessCode)try{var u=e.callback_(s,s.getResponseText());void 0!==u?o(u):o()}catch(e){i(e)}else null!==s?((n=O()).serverResponse=s.getResponseText(),e.errorCallback_?i(e.errorCallback_(s,n)):i(n)):r.canceled?i(n=e.appDelete_?P():U()):i(n=new a(f,"Max retry time for operation exceeded, please try again."))}this.canceled_?t(0,new je(!1,null,!0)):this.backoffId_=
/**
 * @license
 * Copyright 2017 Google LLC
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
function(e,t,r){var n=1,o=null,i=!1,a=0;function u(){return 2===a}var l=!1;function c(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];l||(l=!0,t.apply(null,e))}function h(t){o=setTimeout((function(){o=null,e(p,u())}),t)}function p(e){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r];if(!l)if(e)c.call.apply(c,s([null,e],t));else{var o,p=u()||i;if(p)c.call.apply(c,s([null,e],t));else n<64&&(n*=2),1===a?(a=2,o=0):o=1e3*(n+Math.random()),h(o)}}var f=!1;function d(e){f||(f=!0,l||(null!==o?(e||(a=2),clearTimeout(o),h(0)):e||(a=1)))}return h(0),setTimeout((function(){i=!0,d(!0)}),r),d}((function(t,r){if(r)t(!1,new je(!1,null,!0));else{var n=e.pool_.createXhrIo();e.pendingXhr_=n,null!==e.progressCallback_&&n.addUploadProgressListener(o),n.send(e.url_,e.method_,e.body_,e.headers_).then((function(r){null!==e.progressCallback_&&r.removeUploadProgressListener(o),e.pendingXhr_=null;var n=(r=r).getErrorCode()===B.NO_ERROR,i=r.getStatus();if(n&&!e.isRetryStatusCode_(i)){var s=-1!==e.successCodes_.indexOf(i);t(!0,new je(s,r))}else{var a=r.getErrorCode()===B.ABORT;t(!1,new je(!1,null,a))}}))}function o(t){var r=t.loaded,n=t.lengthComputable?t.total:-1;null!==e.progressCallback_&&e.progressCallback_(r,n)}}),t,this.timeout_)},e.prototype.getPromise=function(){return this.promise_},e.prototype.cancel=function(e){this.canceled_=!0,this.appDelete_=e||!1,null!==this.backoffId_&&(0,this.backoffId_)(!1),null!==this.pendingXhr_&&this.pendingXhr_.abort()},e.prototype.isRetryStatusCode_=function(e){var t=e>=500&&e<600,r=-1!==[408,429].indexOf(e),n=-1!==this.additionalRetryCodes_.indexOf(e);return t||r||n},e}(),je=function(e,t,r){this.wasSuccessCode=e,this.xhr=t,this.canceled=!!r};function Be(e,t,r,n){var o=le(e.urlParams),s=e.url+o,a=Object.assign({},e.headers);return function(e,t){t&&(e["X-Firebase-GMPID"]=t)}(a,t),function(e,t){null!==t&&t.length>0&&(e.Authorization="Firebase "+t)}(a,r),function(e){var t=void 0!==i?i.SDK_VERSION:"AppManager";e["X-Firebase-Storage-Version"]="webjs/"+t}(a),new Ne(s,e.method,a,e.body,e.successCodes,e.additionalRetryCodes,e.handler,e.errorHandler,e.timeout,e.progressCallback,n)}
/**
 * @license
 * Copyright 2017 Google LLC
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
 */var ze,He,Me=function(){function e(t,r,n,o){var i;this.bucket_=null,this.appId_=null,this.deleted_=!1,this.app_=t,this.authProvider_=r,this.maxOperationRetryTime_=12e4,this.maxUploadRetryTime_=6e5,this.requests_=new Set,this.pool_=n,this.bucket_=null!=o?ie.makeFromBucketSpec(o):e.extractBucket_(null===(i=this.app_)||void 0===i?void 0:i.options),this.internals_=new De(this)}return e.extractBucket_=function(e){var t=null==e?void 0:e.storageBucket;return null==t?null:ie.makeFromBucketSpec(t)},e.prototype.getAuthToken=function(){return t(this,void 0,void 0,(function(){var e,t;return r(this,(function(r){switch(r.label){case 0:return(e=this.authProvider_.getImmediate({optional:!0}))?[4,e.getToken()]:[3,2];case 1:if(null!==(t=r.sent()))return[2,t.accessToken];r.label=2;case 2:return[2,null]}}))}))},e.prototype.deleteApp=function(){this.deleted_=!0,this.app_=null,this.requests_.forEach((function(e){return e.cancel()})),this.requests_.clear()},e.prototype.makeStorageReference=function(e){return new qe(this,e)},e.prototype.makeRequest=function(e,t){var r=this;if(this.deleted_)return new Le(P());var n=Be(e,this.appId_,t,this.pool_);return this.requests_.add(n),n.getPromise().then((function(){return r.requests_.delete(n)}),(function(){return r.requests_.delete(n)})),n},e.prototype.ref=function(e){if(/^[A-Za-z]+:\/\//.test(e))throw new a(y,"Expected child path but got a URL, use refFromURL instead.");if(null==this.bucket_)throw new Error("No Storage Bucket defined in Firebase Options.");var t=new qe(this,this.bucket_);return null!=e?t.child(e):t},e.prototype.refFromURL=function(e){if(!/^[A-Za-z]+:\/\//.test(e))throw new a(y,"Expected full URL but got a child path, use ref instead.");try{ie.makeFromUrl(e)}catch(e){throw new a(y,"Expected valid full URL but got an invalid one.")}return new qe(this,e)},Object.defineProperty(e.prototype,"maxUploadRetryTime",{get:function(){return this.maxUploadRetryTime_},enumerable:!1,configurable:!0}),e.prototype.setMaxUploadRetryTime=function(e){Q("time",0,Number.POSITIVE_INFINITY,e),this.maxUploadRetryTime_=e},Object.defineProperty(e.prototype,"maxOperationRetryTime",{get:function(){return this.maxOperationRetryTime_},enumerable:!1,configurable:!0}),e.prototype.setMaxOperationRetryTime=function(e){Q("time",0,Number.POSITIVE_INFINITY,e),this.maxOperationRetryTime_=e},Object.defineProperty(e.prototype,"app",{get:function(){return this.app_},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"INTERNAL",{get:function(){return this.internals_},enumerable:!1,configurable:!0}),e}(),De=function(){function e(e){this.service_=e}return e.prototype.delete=function(){return this.service_.deleteApp(),Promise.resolve()},e}();function Fe(e,t){var r=e.getProvider("app").getImmediate(),n=e.getProvider("auth-internal");return new Me(r,n,new te,t)}He={TaskState:K,TaskEvent:z,StringFormat:A,Storage:Me,Reference:qe},(ze=i).INTERNAL.registerComponent(new o("storage",Fe,"PUBLIC").setServiceProps(He).setMultipleInstances(!0)),ze.registerVersion("@firebase/storage","0.4.1");

