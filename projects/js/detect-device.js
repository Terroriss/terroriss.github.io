const device = {
  Android: (function() {
    return navigator.userAgent.match(/Android/i) || false;
  })(),
  BlackBerry: (function() {
    return navigator.userAgent.match(/BlackBerry/i) || false;
  })(),
  iOS: (function() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i) || false;
  })(),
  Opera: (function() {
    return navigator.userAgent.match(/Opera Mini/i) || false;
  })(),
  Windows: (function() {
    return navigator.userAgent.match(/IEMobile/i) || false;
  })(),
  hasTouchScreen: (function() {
    var hasTouchScreen = false;
    if ("maxTouchPoints" in navigator) {
      hasTouchScreen = navigator.maxTouchPoints > 0;
    } else if ("msMaxTouchPoints" in navigator) {
      hasTouchScreen = navigator.msMaxTouchPoints > 0;
    } else {
      var mQ = window.matchMedia && matchMedia("(pointer:coarse)");
      if (mQ && mQ.media === "(pointer:coarse)") {
        hasTouchScreen = !!mQ.matches;
      } else if ('orientation' in window) {
        hasTouchScreen = true; // deprecated, but good fallback
      } else {
        // Only as a last resort, fall back to user agent sniffing
        var UA = navigator.userAgent;
        hasTouchScreen = (
          /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
          /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA)
        );
      }
    };
    return hasTouchScreen;
  })(),
  smallWidth: (function() {
    const windowWidth = window.screen.width < window.outerWidth ? window.screen.width : window.outerWidth;
    return windowWidth < 500;
  })()
};

if (!Object.entries) {
  Object.entries = function( obj ){
    var ownProps = Object.keys( obj ),
        i = ownProps.length,
        resArray = new Array(i); // preallocate the Array
    while (i--)
      resArray[i] = [ownProps[i], obj[ownProps[i]]];

    return resArray;
  };
};

Object.entries(device).forEach(([key, value]) => {
  const td = document.getElementById(key);
  td.innerText = value ? "✔️" : "❌";
});
