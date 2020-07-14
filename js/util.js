'use strict';
(function () {
  var ESC_CODE = 'Escape';
  var ENTER_CODE = 'Enter';
  var DEBOUNCE_INTERVAL = 500;
  var errorTemplate = document.querySelector('#error');
  function onError(text) {

    function onErrorEscPress(evt) {
      if (evt.key === ESC_CODE) {
        closeError();
      }
    }

    function closeError() {
      document.querySelector('.error').remove();

      document.removeEventListener('keydown', onErrorEscPress);

      document.removeEventListener('click', closeError);

      errorTemplate.querySelector('.error__button').removeEventListener('click', closeError);
    }

    if (errorTemplate) {
      var errorPopup = errorTemplate.content.querySelector('.error').cloneNode(true);
      if (text) {
        errorPopup.querySelector('.error__message').textContent = text;
      }

      document.addEventListener('keydown', onErrorEscPress);

      document.addEventListener('click', closeError);

      errorPopup.querySelector('.error__button').addEventListener('click', closeError);

      document.querySelector('.main').appendChild(errorPopup);
    }
  }

  function debounce(callback) {
    var lastTimeout = null;
    return function () {
      var parameters = arguments;

      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }

      lastTimeout = window.setTimeout(function () {
        callback.apply(null, parameters);
      }, DEBOUNCE_INTERVAL);
    };
  }

  window.util = {
    ESC_CODE: ESC_CODE,
    ENTER_CODE: ENTER_CODE,
    getRandomInRange: function getRandomInRange(min, max) {
      return Math.floor(min + Math.random() * (max + 1 - min));
    },
    onError: onError,
    debounce: debounce,
  };

})();
