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

  var PricesMap = {
    LOW_VALUE: 'low',
    HIGH_VALUE: 'high',
    MIDDLE_VALUE: 'middle',
    LOW: 10000,
    HIGH: 50000,
  };

  var appendPins = function () {
    window.map.clear();
    mapPins.appendChild(window.pin.createFragment(filterPins()));
  };

  var isHouseTypeFilter = function (element) {
    var currentType = mapFormTypeFilter.value;
    if (currentType === VALUE_ANY) {
      return true;
    }

    return element.offer.type === currentType;
  };

  var isPriceFilter = function (element) {
    var currentPrice = mapFormPriceFilter.value;
    var price = element.offer.price;

    if (currentPrice === VALUE_ANY) {
      return true;
    }

    return (
      ((currentPrice === PricesMap.LOW_VALUE) && (price <= PricesMap.LOW)) ||
      ((currentPrice === PricesMap.HIGH_VALUE) && (price >= PricesMap.HIGH)) ||
      ((currentPrice === PricesMap.MIDDLE_VALUE) && (price > PricesMap.LOW) && (price < PricesMap.HIGH)));
  };

  var isRoomsQuantityFilter = function (element) {
    var currentRooms = mapFormRoomsFilter.value;

    if (currentRooms === VALUE_ANY) {
      return true;
    }

    return currentRooms === String(element.offer.rooms);
  };

  var isGuestsQuantityFilter = function (element) {
    var currentGuests = mapFormGuestsFilter.value;

    if (currentGuests === VALUE_ANY) {
      return true;
    }

    return currentGuests === String(element.offer.guests);
  };

  var isFeaturesAvailability = function (checkbox, element) {
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
  };

  var filterPins = function () {
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
    return filteredPinsByFilters;
  };


  window.filter = {
    filterPins: appendPins,
  };

})();
