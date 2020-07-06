'use strict';
(function () {
  var map = document.querySelector('.map');
  var form = document.querySelector('.ad-form');
  var mapForm = document.querySelector('.map__filters');
  var mapFormFilters = mapForm.querySelectorAll('.map__filter');
  var mapFormTypeFilter = mapForm.querySelector('#housing-type');
  var formElements = form.querySelectorAll('.ad-form__element');
  var mapFormFeatures = mapForm.querySelectorAll('.map__features');
  var mainPin = document.querySelector('.map__pin--main');
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var mapPins = document.querySelector('.map__pins');
  var formCapacity = form.querySelector('#capacity');
  var mapFiltersContainer = map.querySelector('.map__filters-container');
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


  function closePopup() {
    var popup = mapFiltersContainer.querySelector('.popup');
    if (popup) {
      if (!popup.classList.contains('visually-hidden')) {
        mapFiltersContainer.querySelector('.popup').removeEventListener('click', closePopup);
        mapFiltersContainer.querySelector('.popup').classList.add('visually-hidden');
      }
    }
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

  function filterPinsByType() {
    var currentType = mapFormTypeFilter.value;
    closePopup();
    if (currentType === 'any') {
      clearPins();
      mapPins.appendChild(window.pin.createFragment(window.map.pinsArr));
      return;
    }
    var filtredPinsByType = window.map.pinsArr.filter(function (elem) {
      return elem.offer.type === currentType;
    });
    window.map.filterPinsByType = filtredPinsByType;
    clearPins();
    mapPins.appendChild(window.pin.createFragment(filtredPinsByType));
  }

  var mapFormTypeFilterChange = window.util.debounce(filterPinsByType);

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
    document.addEventListener('keydown', window.card.onEscPressClosePopup);
    mainPin.addEventListener('mousedown', window.pin.startDrag);
    mapFormTypeFilter.addEventListener('change', mapFormTypeFilterChange);
  };

  window.map = {
    activateMap: activateMap,
    onEnterMainPinPress: onEnterMainPinPress,
    clear: clearPins,
  };
})();
