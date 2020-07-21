'use strict';
(function () {
  var DEFAULT_IMG_SRC = './img/muffin-grey.svg';
  var map = document.querySelector('.map');
  var form = document.querySelector('.ad-form');
  var mapForm = document.querySelector('.map__filters');
  var avatarPreview = form.querySelector('.ad-form-header__preview img');
  var formAddress = form.querySelector('#address');
  var mapFormFilters = mapForm.querySelectorAll('.map__filter');
  var formElements = form.querySelectorAll('.ad-form__element');
  var mapFormFeatures = mapForm.querySelectorAll('.map__features');
  var mainPin = document.querySelector('.map__pin--main');
  var resetButton = document.querySelector('.ad-form__reset');
  var avatarInput = form.querySelector('.ad-form__field .ad-form-header__input');
  var formCapacity = form.querySelector('#capacity');
  var formRoomNumber = form.querySelector('#room_number');
  var formTitle = form.querySelector('#title');
  var formPrice = form.querySelector('#price');
  var formType = form.querySelector('#type');
  var formTimeIn = form.querySelector('#timein');
  var formTimeOut = form.querySelector('#timeout');

  var addAttributeDisabled = function (array) {
    array.forEach(function (element) {
      element.setAttribute('disabled', true);
    });
  };

  var initPage = function () {

    if (!map.classList.contains('map--faded')) {
      map.classList.add('map--faded');
    }

    if (!form.classList.contains('ad-form--disabled')) {
      form.classList.add('ad-form--disabled');
    }

    addAttributeDisabled(formElements);
    addAttributeDisabled(mapFormFilters);
    addAttributeDisabled(mapFormFeatures);

    avatarPreview.src = DEFAULT_IMG_SRC;
    formAddress.value = window.pin.setMainPinChords();
    mainPin.addEventListener('mousedown', window.map.activatePage);
    mainPin.addEventListener('keydown', window.map.onEnterMainPinPress);
  };

  var deactivatePage = function () {
    form.reset();
    window.map.clear();
    window.form.clearPhotos();
    resetButton.removeEventListener('click', window.form.reset);
    form.removeEventListener('submit', window.form.submit);
    formCapacity.removeEventListener('change', window.form.checkInvalidRoomsInput);
    formRoomNumber.removeEventListener('change', window.form.checkInvalidRoomsInput);
    formTitle.removeEventListener('input', window.form.checkInvalidTitleInput);
    formType.removeEventListener('change', window.form.checkInvalidPriceInput);
    formPrice.removeEventListener('input', window.form.checkInvalidPriceInput);
    formTimeIn.removeEventListener('change', window.form.checkInvalidTimeInput);
    formTimeOut.removeEventListener('change', window.form.checkInvalidTimeInput);
    avatarInput.removeEventListener('change', window.form.changeAvatar);
    document.removeEventListener('keydown', window.card.onKeyPressClosePopup);
    mainPin.removeEventListener('mousedown', window.pin.startDrag);
    formAddress.value = window.pin.setMainPinChords();
    window.main.initPage();
  };

  initPage();

  window.main = {
    initPage: initPage,
    deactivatePage: deactivatePage,
  };
})();
