'use strict';
(function () {
  var ESC_CODE = 'Escape';
  var ENTER_CODE = 'Enter';
  window.util = {
    ESC_CODE: ESC_CODE,
    ENTER_CODE: ENTER_CODE,
    getRandomInRange: function getRandomInRange(min, max) {
      return Math.floor(min + Math.random() * (max + 1 - min));
    }};
})();
