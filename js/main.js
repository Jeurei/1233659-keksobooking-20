'use strict';
(function () {
  var map = document.querySelector('.map');
  var form = document.querySelector('.ad-form');
  var mapForm = document.querySelector('.map__filters');
  var formAddress = form.querySelector('#address');
  var mapFormFilters = mapForm.querySelectorAll('.map__filter');
  var formElements = form.querySelectorAll('.ad-form__element');
  var mapFormFeatures = mapForm.querySelectorAll('.map__features');
  var mainPin = document.querySelector('.map__pin--main');

  function addAttributeDisabled(arr) {
    arr.forEach(function (elem) {
      elem.setAttribute('disabled', true);
    });
  }

  function initPage() {

    if (map.classList.contains('map--faded') !== true) {
      map.classList.add('map--faded');
    }

    if (form.classList.contains('ad-form--disabled') !== true) {
      form.classList.add('ad-form--disabled');
    }

    addAttributeDisabled(formElements);
    addAttributeDisabled(mapFormFilters);
    addAttributeDisabled(mapFormFeatures);

    formAddress.value = window.pin.setMainPinChords();
    mainPin.addEventListener('mousedown', window.map.activateMap);
    mainPin.addEventListener('keydown', window.map.onEnterMainPinPress);
  }
  initPage();
})();
