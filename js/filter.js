'use strict';

(function () {
  var VALUE_ANY = 'any';
  var mapForm = document.querySelector('.map__filters');
  var mapFormTypeFilter = mapForm.querySelector('#housing-type');
  var mapFormPriceFilter = mapForm.querySelector('#housing-price');
  var mapFormRoomsFilter = mapForm.querySelector('#housing-rooms');
  var mapFormGuestsFilter = mapForm.querySelector('#housing-guests');
  var mapPins = document.querySelector('.map__pins');
  var mapFormFeaturesCheckboxes = mapForm.querySelectorAll('#housing-features input');

  var pricesMap = {
    LOW_VALUE: 'low',
    HIGH_VALUE: 'high',
    MIDDLE_VALUE: 'middle',
    LOW: 10000,
    HIGH: 50000,
  };

  function appendPins(array) {
    window.map.clear();
    mapPins.appendChild(window.pin.createFragment(array));
  }

  function isHouseTypeFilter(element) {
    var currentType = mapFormTypeFilter.value;
    if (currentType === VALUE_ANY) {
      return true;
    }

    return element.offer.type === currentType;
  }

  function isPriceFilter(element) {
    var currentPrice = mapFormPriceFilter.value;
    var price = element.offer.price;

    if (currentPrice === VALUE_ANY) {
      return true;
    }

    return (
      ((currentPrice === pricesMap.LOW_VALUE) && (price <= pricesMap.LOW)) ||
      ((currentPrice === pricesMap.HIGH_VALUE) && (price >= pricesMap.HIGH)) ||
      ((currentPrice === pricesMap.MIDDLE_VALUE) && (price > pricesMap.LOW) && (price < pricesMap.HIGH)));
  }

  function isRoomsQuantityFilter(element) {
    var currentRooms = mapFormRoomsFilter.value;

    if (currentRooms === VALUE_ANY) {
      return true;
    }

    return currentRooms === String(element.offer.rooms);
  }

  function isGuestsQuantityFilter(element) {
    var currentGuests = mapFormGuestsFilter.value;

    if (currentGuests === VALUE_ANY) {
      return true;
    }

    return currentGuests === String(element.offer.guests);
  }

  function isFeaturesAvailability(checkbox, element) {
    mapFormFeaturesCheckboxes = mapForm.querySelectorAll('#housing-features input:checked');

    var checkedCheckboxes = Array.from(mapFormFeaturesCheckboxes).map(function (arrElement) {
      return arrElement.value;
    });

    if (checkedCheckboxes.length === 0) {
      return true;
    }

    if (checkbox.checked === true && element.offer.features.indexOf(checkbox.value) !== -1) {
      return true;
    }
    return false;
  }

  function filterPins() {
    var checkboxWifi = mapForm.querySelector('#filter-wifi');
    var checkboxDishwasher = mapForm.querySelector('#filter-dishwasher');
    var checkboxParking = mapForm.querySelector('#filter-parking');
    var checkboxWasher = mapForm.querySelector('#filter-washer');
    var checkboxElevator = mapForm.querySelector('#filter-elevator');
    var checkboxConditioner = mapForm.querySelector('#filter-conditioner');
    var filteredPinsByFilters = [];

    for (var i = 0; i < window.map.pinsArr.length; i++) {

      if (isHouseTypeFilter(window.map.pinsArr[i]) &&
      isPriceFilter(window.map.pinsArr[i]) &&
      isRoomsQuantityFilter(window.map.pinsArr[i]) &&
      isGuestsQuantityFilter(window.map.pinsArr[i]) &&
      (isFeaturesAvailability(checkboxWifi, window.map.pinsArr[i]) ||
      isFeaturesAvailability(checkboxDishwasher, window.map.pinsArr[i]) ||
      isFeaturesAvailability(checkboxParking, window.map.pinsArr[i]) ||
      isFeaturesAvailability(checkboxWasher, window.map.pinsArr[i]) ||
      isFeaturesAvailability(checkboxConditioner, window.map.pinsArr[i]) ||
      isFeaturesAvailability(checkboxElevator, window.map.pinsArr[i]))) {
        filteredPinsByFilters.push(window.map.pinsArr[i]);

        if (filteredPinsByFilters.length === window.pin.QUANTITY_OF_PINS) {
          break;
        }

      }
    }

    window.map.filteredPins = filteredPinsByFilters;
    appendPins(filteredPinsByFilters);
  }

  window.filter = {
    filterPins: filterPins,
  };

})();
