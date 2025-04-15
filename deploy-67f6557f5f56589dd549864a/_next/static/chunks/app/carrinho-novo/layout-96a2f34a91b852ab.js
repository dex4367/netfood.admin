(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[143],{1193:(e,t,r)=>{Promise.resolve().then(r.t.bind(r,3751,23)),Promise.resolve().then(r.bind(r,3599))},3599:(e,t,r)=>{"use strict";r.d(t,{Providers:()=>b});var a=r(122),n=r(7362),o=(e,t,r,a,n,o,s,i)=>{let l=document.documentElement,c=["light","dark"];function d(t){var r;(Array.isArray(e)?e:[e]).forEach(e=>{let r="class"===e,a=r&&o?n.map(e=>o[e]||e):n;r?(l.classList.remove(...a),l.classList.add(o&&o[t]?o[t]:t)):l.setAttribute(e,t)}),r=t,i&&c.includes(r)&&(l.style.colorScheme=r)}if(a)d(a);else try{let e=localStorage.getItem(t)||r,a=s&&"system"===e?window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light":e;d(a)}catch(e){}},s=["light","dark"],i="(prefers-color-scheme: dark)",l="undefined"==typeof window,c=n.createContext(void 0),d=e=>n.useContext(c)?n.createElement(n.Fragment,null,e.children):n.createElement(m,{...e}),u=["light","dark"],m=e=>{let{forcedTheme:t,disableTransitionOnChange:r=!1,enableSystem:a=!0,enableColorScheme:o=!0,storageKey:l="theme",themes:d=u,defaultTheme:m=a?"system":"light",attribute:w="data-theme",value:b,children:p,nonce:g,scriptProps:E}=e,[S,C]=n.useState(()=>f(l,m)),[k,_]=n.useState(()=>"system"===S?y():S),P=b?Object.values(b):d,N=n.useCallback(e=>{let t=e;if(!t)return;"system"===e&&a&&(t=y());let n=b?b[t]:t,i=r?v(g):null,l=document.documentElement,c=e=>{"class"===e?(l.classList.remove(...P),n&&l.classList.add(n)):e.startsWith("data-")&&(n?l.setAttribute(e,n):l.removeAttribute(e))};if(Array.isArray(w)?w.forEach(c):c(w),o){let e=s.includes(m)?m:null,r=s.includes(t)?t:e;l.style.colorScheme=r}null==i||i()},[g]),T=n.useCallback(e=>{let t="function"==typeof e?e(S):e;C(t);try{localStorage.setItem(l,t)}catch(e){}},[S]),I=n.useCallback(e=>{_(y(e)),"system"===S&&a&&!t&&N("system")},[S,t]);n.useEffect(()=>{let e=window.matchMedia(i);return e.addListener(I),I(e),()=>e.removeListener(I)},[I]),n.useEffect(()=>{let e=e=>{e.key===l&&(e.newValue?C(e.newValue):T(m))};return window.addEventListener("storage",e),()=>window.removeEventListener("storage",e)},[T]),n.useEffect(()=>{N(null!=t?t:S)},[t,S]);let L=n.useMemo(()=>({theme:S,setTheme:T,forcedTheme:t,resolvedTheme:"system"===S?k:S,themes:a?[...d,"system"]:d,systemTheme:a?k:void 0}),[S,T,t,k,a,d]);return n.createElement(c.Provider,{value:L},n.createElement(h,{forcedTheme:t,storageKey:l,attribute:w,enableSystem:a,enableColorScheme:o,defaultTheme:m,value:b,themes:d,nonce:g,scriptProps:E}),p)},h=n.memo(e=>{let{forcedTheme:t,storageKey:r,attribute:a,enableSystem:s,enableColorScheme:i,defaultTheme:l,value:c,themes:d,nonce:u,scriptProps:m}=e,h=JSON.stringify([a,r,l,t,d,c,s,i]).slice(1,-1);return n.createElement("script",{...m,suppressHydrationWarning:!0,nonce:"undefined"==typeof window?u:"",dangerouslySetInnerHTML:{__html:"(".concat(o.toString(),")(").concat(h,")")}})}),f=(e,t)=>{let r;if(!l){try{r=localStorage.getItem(e)||void 0}catch(e){}return r||t}},v=e=>{let t=document.createElement("style");return e&&t.setAttribute("nonce",e),t.appendChild(document.createTextNode("*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}")),document.head.appendChild(t),()=>{window.getComputedStyle(document.body),setTimeout(()=>{document.head.removeChild(t)},1)}},y=e=>(e||(e=window.matchMedia(i)),e.matches?"dark":"light"),w=r(7488);function b(e){let{children:t}=e;return(0,a.jsx)(d,{defaultTheme:"light",enableSystem:!1,attribute:"class",children:(0,a.jsx)(w.CartProvider,{children:t})})}},3751:e=>{e.exports={style:{fontFamily:"'Inter', 'Inter Fallback'",fontStyle:"normal"},className:"__className_d65c78"}},7488:(e,t,r)=>{"use strict";r.r(t),r.d(t,{CartProvider:()=>d,useCart:()=>c});var a=r(122),n=r(7362);let o="bob_cart_items_v4",s=(0,n.createContext)(void 0);function i(){try{["bob_cart_items_v3","bob_cart_items_v2","cartItems","bobsCart"].forEach(e=>{try{localStorage.removeItem(e)}catch(t){console.error("Erro ao remover chave antiga ".concat(e,":"),t)}});let e=localStorage.getItem(o);if(!e)return[];let t=JSON.parse(e);if(!Array.isArray(t))return[];return t}catch(e){return console.error("Erro ao carregar carrinho:",e),[]}}function l(e){try{0===e.length?localStorage.removeItem(o):localStorage.setItem(o,JSON.stringify(e))}catch(e){console.error("Erro ao salvar carrinho:",e)}}function c(){let e=(0,n.useContext)(s);if(void 0===e)throw Error("useCart deve ser usado dentro de um CartProvider");return e}function d(e){let{children:t}=e,[r,c]=(0,n.useState)(!1),[d,u]=(0,n.useState)([]);(0,n.useEffect)(()=>{u(i()),c(!0);let e=()=>{u(i())};return window.addEventListener("storage",e),window.addEventListener("cart:updated",e),()=>{window.removeEventListener("storage",e),window.removeEventListener("cart:updated",e)}},[]);let m=(0,n.useCallback)(e=>{let t;if(!e)return;let r=i(),a=r.findIndex(t=>t.id===e.id&&t.selectedSide===e.selectedSide&&JSON.stringify(t.selectedExtras)===JSON.stringify(e.selectedExtras)&&JSON.stringify(t.selectedSauces)===JSON.stringify(e.selectedSauces)&&JSON.stringify(t.selectedAddons)===JSON.stringify(e.selectedAddons)&&t.observation===e.observation);if(-1!==a){let n=(t=[...r])[a];t[a]={...n,quantity:n.quantity+e.quantity,totalPrice:n.totalPrice+e.totalPrice}}else t=[...r,{...e,id:e.id||"".concat(e.product.id,"-").concat(Date.now())}];l(t),u(t),window.dispatchEvent(new CustomEvent("cart:updated"))},[]),h=(0,n.useCallback)(e=>{let t=i().filter(t=>t.id!==e);l(t),u(t),window.dispatchEvent(new CustomEvent("cart:updated"))},[]),f=(0,n.useCallback)((e,t)=>{let r=i().map(r=>r.id===e?{...t,id:e}:r);l(r),u(r),window.dispatchEvent(new CustomEvent("cart:updated"))},[]),v=(0,n.useCallback)((e,t)=>{if(t<1){h(e);return}let r=i().map(r=>{if(r.id===e){let e=r.totalPrice/r.quantity;return{...r,quantity:t,totalPrice:e*t}}return r});l(r),u(r),window.dispatchEvent(new CustomEvent("cart:updated"))},[h]),y=(0,n.useCallback)(()=>{localStorage.removeItem(o),u([]),window.dispatchEvent(new CustomEvent("cart:updated"))},[]),w=(0,n.useCallback)(()=>i().reduce((e,t)=>e+t.totalPrice,0),[]),b=(0,n.useCallback)(()=>i().reduce((e,t)=>e+t.quantity,0),[]);return(0,a.jsx)(s.Provider,{value:{items:d,addItem:m,removeItem:h,updateItem:f,updateItemQuantity:v,clearCart:y,getTotalPrice:w,getTotalItems:b},children:t})}}},e=>{var t=t=>e(e.s=t);e.O(0,[207,500,245,358],()=>t(1193)),_N_E=e.O()}]);