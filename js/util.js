'use strict';
(function () {
  var ESC_CODE = 'Escape';
  var ENTER_CODE = 'Enter';
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
      errorTemplate = errorTemplate.content.querySelector('.error').cloneNode(true);
      if (text) {
        errorTemplate.querySelector('.error__message').textContent = text;
      }

      document.addEventListener('keydown', onErrorEscPress);

      document.addEventListener('click', closeError);

      errorTemplate.querySelector('.error__button').addEventListener('click', closeError);

      document.querySelector('.main').appendChild(errorTemplate);
    }
  }

  window.util = {
    ESC_CODE: ESC_CODE,
    ENTER_CODE: ENTER_CODE,
    getRandomInRange: function getRandomInRange(min, max) {
      return Math.floor(min + Math.random() * (max + 1 - min));
    },
    onError: onError,
  };

})();
