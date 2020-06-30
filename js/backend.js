'use strict';

(function () {
  var URL_LOAD = 'https://javascript.pages.academy/keksobooking/data';

  function backendLOAD(onSuccess) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onSuccess(xhr.response);
      }
    });

    xhr.open('GET', URL_LOAD);
    xhr.timeout = 10000;
    xhr.send();

  }

  window.backend = {
    load: backendLOAD,
  };
})();
