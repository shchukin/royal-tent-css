







var ct_ijc_v_1 = function(selector) {
  function inject(element, value, expected_id) {
    if (element) {
      if (expected_id && (element && element.parentNode)) {
        if (element.id === expected_id) {
          element.innerHTML = value;
        }
      } else {
        element.innerHTML = value;
      }
    }
  }
  
  function html(value) {
    if (document.body && document.readyState === "complete") {
      initInject();
    } else {
      window.addEventListener('load', initInject);
    }
  
    function initInject() {
      if(selector && (selector.indexOf("#") == 0 || selector.indexOf(".") == 0)) {
        if(selector.indexOf("#") == 0) {
          inject(document.getElementById(selector.substring(1)), value, selector.substring(1));
        }
        if(selector.indexOf(".")== 0 && document.getElementsByClassName) {
          var elements = document.getElementsByClassName(selector.substring(1));
          for(var i = 0 ;  i < elements.length; i++){ inject(elements[i], value);}
        }
      }
      window.removeEventListener('load', initInject);
    }
  }
  
  return { html:html}
};
                                                            
                                                            
                                                            

            if (window['ct'] && typeof window['ct'] === 'function') {
            window['ct']('init_matcher_replacement', {useObserver: false, params: [{"value_code":"800","value_phone":"5511434","phone_code":"800","phone_number":"6009851","selector":"body"},{"value_code":"800","value_phone":"5511434","phone_code":"800","phone_number":"7757226","selector":"body"},{"value_code":"800","value_phone":"5511434","phone_code":"495","phone_number":"1653346","selector":"body"}]});
            }
            window.calltouch_phone = "78005511434";

            if (window['ct'] && typeof window['ct'] === 'function') {
            window['ct']('create_session', { sessionId: 60065907, siteId: 59938, modId: '6mucowlu', setCookie: true, endSessionTime: 1694775910, domain: 'royaltent.ru', setCtCookie: '2400000000041941285', setLkCookie: null, denialTime: 15, phones: {"323013":{"subPoolName":"royaltent.ru","phoneId":"931713","phoneNumber":"78005511434","phoneCode":"800","phoneBody":"5511434"}}, ecommerceGa4Enabled: false, ecommerceTimeout: 1000, calltouchDnsHost: '', dataGoEnabled: false, GA4: [] });
                        } else {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open( "GET", 'https://mod.calltouch.ru/set_attrs_by_get.php?siteId=59938&sessionId=60065907&attrs={"clientError_NO_CT_CREATE_SESSION": 1}', true );
            xmlHttp.send( null );
            }
            


window.ctw = {};
window.ctw.clientFormConfig = {}
window.ctw.clientFormConfig.getClientFormsSettingsUrl = "//mod.calltouch.ru/callback_widget_user_form_find.php";
window.ctw.clientFormConfig.sendClientFormsRequestUrl = "//mod.calltouch.ru/callback_request_user_form_create.php";
(function (targetWindow, nameSpace, params){
!function(){var e={9713:function(e){e.exports=function(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}},693:function(e,t,n){var r=n(9713);e.exports=function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},o=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(o=o.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),o.forEach((function(t){r(e,t,n[t])}))}return e}}},t={};function n(r){var o=t[r];if(void 0!==o)return o.exports;var a=t[r]={exports:{}};return e[r](a,a.exports,n),a.exports}n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,{a:t}),t},n.d=function(e,t){for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},function(){"use strict";var e=n(693),t=n.n(e);function r(e,n,r,o){try{var a=Boolean(window.event&&window.event.target&&"A"===window.event.target.nodeName),i=Boolean(window.event&&(window.event.target&&"submit"===window.event.target.type||"submit"===window.event.type)),c=function(){var e;if(e||"undefined"==typeof XMLHttpRequest)try{e=new ActiveXObject("Msxml2.XMLHTTP")}catch(t){try{e=new ActiveXObject("Microsoft.XMLHTTP")}catch(t){e=!1}}else e=new XMLHttpRequest;return e}(),s=n?"POST":"GET";c.open(s,e,!a&&!i&&!o),a||i||o||(c.timeout=6e4),c.setRequestHeader("Content-type","application/json"),c.onreadystatechange=function(){if(4===c.readyState&&r)if(200===c.status){var e=function(e){var t;try{t=JSON.parse(e)}catch(e){}return t}(c.response);e?e.data?r(!0,t()({},e.data)):e.error?r(!1,t()({},e.error)):r(!1,{type:"unknown_error",message:"Unknown JSON format",details:{}}):r(!1,{type:"unknown_error",message:"JSON parse error",details:{}})}else 0===c.status?r(!1,{type:"unknown_error",message:"Request timeout exceeded or connection reset",details:{}}):r(!1,{type:"unknown_error",message:"Unexpected HTTP code: ".concat(c.statusText),details:{}})},c.send(n)}catch(e){r&&r(!1,{type:"unknown_error",message:"Unexpected js exception",details:{}})}}!function(e,t,n){var o=e||window,a=t||"ctw";o[a]||(o[a]={});var i=o[a].clientFormConfig||{},c=i.getClientFormsSettingsUrl,s=i.sendClientFormsRequestUrl;o[a].getRouteKeyData=function(e,t){var o=1e6*Math.random(),a="".concat(c,"?siteId=").concat(n.siteId,"&routeKey=").concat(e,"&pageUrl=").concat(n.pageUrl,"&sessionId=").concat(n.sessionId);r("".concat(a,"&rand=").concat(Math.floor(o)),null,t)},o[a].createRequest=function(e,t,o,a){var i=arguments.length>4&&void 0!==arguments[4]?arguments[4]:null,c=arguments.length>5&&void 0!==arguments[5]?arguments[5]:[],u=arguments.length>6&&void 0!==arguments[6]?arguments[6]:null,d=arguments.length>7&&void 0!==arguments[7]&&arguments[7],l=1e6*Math.random(),f={siteId:n.siteId,sessionId:n.sessionId,workMode:1,pageUrl:n.pageUrl,tags:c,phone:t,routeKey:e,fields:o,scheduleTime:i,unitId:u};r("".concat(s,"?rand=").concat(Math.floor(l)),JSON.stringify(f),a,d)}}(targetWindow,nameSpace,params)}()}();
})(window, "ctw", {"siteId":59938,"sessionId":60065907,"pageUrl":"https:\/\/royaltent.ru\/project\/photo\/"})
        var call_value = '60065907';
        var call_value_6mucowlu = call_value;
        if(window.onSessionCallValue) {
        onSessionCallValue('60065907', '');
        }
        
