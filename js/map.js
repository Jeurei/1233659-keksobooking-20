'use strict';
(function () {
  var map = document.querySelector('.map');
  var form = document.querySelector('.ad-form');
  var mapForm = document.querySelector('.map__filters');
  var mapFormFilters = mapForm.querySelectorAll('.map__filter');
  var mapFormTypeFilter = mapForm.querySelector('#housing-type');
  var mapFormPriceFilter = mapForm.querySelector('#housing-price');
  var mapFormRoomsFilter = mapForm.querySelector('#housing-rooms');
  var mapFormGuestsFilter = mapForm.querySelector('#housing-guests');
  var mapFormFeaturesCheckboxes = mapForm.querySelectorAll('#housing-features input');
  var formElements = form.querySelectorAll('.ad-form__element');
  var mapFormFeatures = mapForm.querySelectorAll('.map__features');
  var mainPin = document.querySelector('.map__pin--main');
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var mapPins = document.querySelector('.map__pins');
  var formCapacity = form.querySelector('#capacity');
  var formRoomNumber = form.querySelector('#room_number');
  var formTitle = form.querySelector('#title');
  var formPrice = form.querySelector('#price');
  var formType = form.querySelector('#type');
  var formTimeIn = form.querySelector('#timein');
  var formTimeOut = form.querySelector('#timeout');
  var formAddress = form.querySelector('#address');
  var resetButton = form.querySelector('.ad-form__reset');

  function removeAttributeDisabled(arr) {

    arr.forEach(function (elem) {
      elem.removeAttribute('disabled');
    });

  }

  function clearPins() {
    var previousPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');

    if (previousPins) {
      previousPins.forEach(function (elem) {
        elem.parentNode.removeChild(elem);
      });
    }

  }

  var onEnterMainPinPress = function (evt) {

    if (evt.key === window.util.ENTER_CODE) {
      activateMap();
    }

  };

  function onSuccess(arr) {
    mapPins.appendChild(window.pin.createFragment(arr));
    window.map.pinsArr = arr;

    if (mapFormFilters.length !== 0) {
      removeAttributeDisabled(mapFormFilters);
    }

    if (mapFormFeatures.length !== 0) {
      removeAttributeDisabled(mapFormFeatures);
    }

  }

  function appendPins(arr) {
    clearPins();
    mapPins.appendChild(window.pin.createFragment(arr));
  }

  function filterPins() {
    var currentType = mapFormTypeFilter.value;
    var currentPrice = mapFormPriceFilter.value;
    var currentRooms = mapFormRoomsFilter.value;
    var currentGuests = mapFormGuestsFilter.value;
    mapFormFeaturesCheckboxes = mapForm.querySelectorAll('#housing-features input:checked');
    var checkedCheckboxes = Array.from(mapFormFeaturesCheckboxes).map(function (element) {
      return element.value;
    });

    var filteredPinsByFilters = window.map.pinsArr.filter(function (element) {

      if (currentType === 'any') {
        return true;
      }

      return element.offer.type === currentType;
    })
    .filter(function (element) {

      if (currentPrice === 'low' && element.offer.price <= 10000) {
        return true;
      } else if (currentPrice === 'middle' && (element.offer.price > 10000 && element.offer.price < 50000)) {
        return true;
      } else if (currentPrice === 'high' && element.offer.price >= 50000) {
        return true;
      } else if (currentPrice === 'any') {
        return true;
      }

      return false;
    })
    .filter(function (element) {

      if (currentRooms === 'any') {
        return true;
      }

      return currentRooms === '' + element.offer.rooms;
    })
    .filter(function (element) {

      if (currentGuests === 'any') {
        return true;
      }

      return currentGuests === '' + element.offer.guests;
    })
    .filter(function (element) {
      var result = false;
      if (checkedCheckboxes.length === 0) {
        return true;
      }

      element.offer.features.some(function (feature) {

        if (checkedCheckboxes.indexOf(feature) !== -1) {
          result = true;
        }

        return false;
      });

      if (result) {
        return true;
      }

      return false;
    });
    window.map.filteredPins = filteredPinsByFilters;
    appendPins(filteredPinsByFilters);
  }

  var filterPinsByFilters = function () {
    window.card.onFilterChangeClosePopup();
    window.util.debounce(filterPins)();
  };

  var activateMap = function () {
    map.classList.remove('map--faded');
    clearPins();

    if (pinTemplate) {
      window.backend.load(onSuccess, window.util.onError);
    }

    form.classList.remove('ad-form--disabled');

    if (formElements.length !== 0) {
      removeAttributeDisabled(formElements);
    }

    formAddress.value = (Math.floor(mainPin.offsetLeft + mainPin.offsetWidth / 2)) + ' ' + (mainPin.offsetTop + mainPin.offsetHeight);
    form.addEventListener('submit', window.form.submit);
    resetButton.addEventListener('click', window.form.reset);
    formCapacity.addEventListener('change', window.form.checkInvalidRoomsInput);
    formRoomNumber.addEventListener('change', window.form.checkInvalidRoomsInput);
    formTitle.addEventListener('input', window.form.checkInvalidTitleInput);
    formType.addEventListener('change', window.form.checkInvalidPriceInput);
    formPrice.addEventListener('input', window.form.checkInvalidPriceInput);
    formTimeIn.addEventListener('change', window.form.checkInvalidTimeInput);
    formTimeOut.addEventListener('change', window.form.checkInvalidTimeInput);
    mainPin.removeEventListener('mousedown', activateMap);
    mainPin.removeEventListener('keydown', onEnterMainPinPress);
    mainPin.addEventListener('mousedown', window.pin.startDrag);
    mapFormTypeFilter.addEventListener('change', filterPinsByFilters);
    mapFormPriceFilter.addEventListener('change', filterPinsByFilters);
    mapFormRoomsFilter.addEventListener('change', filterPinsByFilters);
    mapFormGuestsFilter.addEventListener('change', filterPinsByFilters);
    Array.from(mapFormFeaturesCheckboxes).forEach(function (element) {
      element.addEventListener('change', filterPinsByFilters);
    });
  };

  window.map = {
    activateMap: activateMap,
    onEnterMainPinPress: onEnterMainPinPress,
    clear: clearPins,
  };
})();
