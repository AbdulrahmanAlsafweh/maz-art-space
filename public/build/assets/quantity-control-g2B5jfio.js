import{a as c,j as e,c as s}from"./app-B2J_87HY.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=[["path",{d:"M5 12h14",key:"1ays0h"}]],h=c("Minus",u);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]],x=c("Plus",b);function y({quantity:l,onChange:a,min:i=0,max:n=20,className:o,buttonClassName:r,valueClassName:d}){const t=Math.min(Math.max(l,i),n);return e.jsxs("div",{className:s("inline-flex h-11 items-center border border-[#c9ced6] bg-white text-[#123b6d]",o),children:[e.jsx("button",{type:"button",onClick:()=>a(t-1),disabled:t<=i,className:s("flex h-full w-11 items-center justify-center transition-colors hover:bg-[#f4f1ed] disabled:cursor-not-allowed disabled:opacity-35",r),"aria-label":"Decrease quantity",children:e.jsx(h,{className:"size-4","aria-hidden":"true"})}),e.jsx("span",{className:s("w-12 text-center text-[9px] font-medium tabular-nums",d),children:t}),e.jsx("button",{type:"button",onClick:()=>a(t+1),disabled:t>=n,className:s("flex h-full w-11 items-center justify-center transition-colors hover:bg-[#f4f1ed] disabled:cursor-not-allowed disabled:opacity-35",r),"aria-label":"Increase quantity",children:e.jsx(x,{className:"size-4","aria-hidden":"true"})})]})}export{y as Q};
