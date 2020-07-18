'use strict';
(function () {
  var FORM_TITLE_MIN_LENGTH = 30;
  var FORM_TITLE_MAX_LENGTH = 100;
  var VALID_TYPES = ['image', 'jpeg', 'x-png', 'png', 'gif'];
  var DEFAULT_IMG_SRC = 'img/muffin-grey.svg"';
  var PHOTO_PREVIEW_WIDTH = 70;
  var PHOTO_PREVIEW_HEIGHT = 70;
  var form = document.querySelector('.ad-form');
  var formCapacity = form.querySelector('#capacity');
  var formRoomNumber = form.querySelector('#room_number');
  var formTitle = form.querySelector('#title');
  var formPrice = form.querySelector('#price');
  var formType = form.querySelector('#type');
  var formTimeIn = form.querySelector('#timein');
  var formTimeOut = form.querySelector('#timeout');
  var formSubmit = form.querySelector('.ad-form__submit');
  var avatarInput = form.querySelector('.ad-form__field .ad-form-header__input');
  var avatarPreview = form.querySelector('.ad-form-header__preview img');
  var photosInput = form.querySelector('.ad-form__upload .ad-form__input');
  var photosPreview = form.querySelector('.ad-form__photo');
  var main = document.querySelector('.main');
  var template = document.querySelector('#success');
  var resetButton = document.querySelector('.ad-form__reset');
  var formAddress = form.querySelector('#address');
  var mainPin = document.querySelector('.map__pin--main');
  var roomsValidMap = {
    '1': 1,
    '2': 2,
    '3': 3,
    '100': 0
  };

  var offerTypePricesMap = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000,
  };

  var roomsValidityErrorMesages = {
    '1': 'Не больше одного гостя',
    '2': 'Не больше двух гостей',
    '3': 'Не больше трех гостей',
    '100': 'Не для гостей'
  };

  var onResetFormPress = function (evt) {
    if (!form.classList.contains('ad-form--disabled')) {
      evt.preventDefault();
      avatarPreview.src = DEFAULT_IMG_SRC;
      photosPreview.innerHTML = '';
      form.reset();
      formAddress.value = window.pin.setMainPinChords();
    }
  };

  var closeSuccessPopup = function () {
    document.removeEventListener('click', closeSuccessPopup);
    document.removeEventListener('keydown', onEscPress);
    document.querySelector('.success').remove();
  };

  var onEscPress = function (evt) {
    if (evt.key === window.util.ESC_CODE) {
      closeSuccessPopup();
    }
  };

  function onSuccessSubmit() {
    window.map.clear();
    window.main.initPage();
    form.reset();
    formAddress.value = window.pin.setMainPinChords();
    resetButton.removeEventListener('click', onResetFormPress);
    var successPopup = template.content.cloneNode(true);
    main.appendChild(successPopup);
    document.addEventListener('click', closeSuccessPopup);
    document.addEventListener('keydown', onEscPress);
    form.removeEventListener('submit', window.form.submit);
    resetButton.removeEventListener('click', window.form.reset);
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
  }

  function onSubmitPress(evt) {
    evt.preventDefault();
    window.backend.save(new FormData(form), onSuccessSubmit, window.util.onError);
  }

  function checkInvalidTitleInput() {
    if (formTitle.value.length < FORM_TITLE_MIN_LENGTH) {
      formTitle.setCustomValidity('Не менее ' + FORM_TITLE_MIN_LENGTH + ' символов');
      formSubmit.setAttribute('disabled', true);
    } else if (formTitle.value.length > FORM_TITLE_MAX_LENGTH) {
      formTitle.setCustomValidity('Не более ' + FORM_TITLE_MAX_LENGTH + ' символов');
      formSubmit.setAttribute('disabled', true);
    } else {
      formTitle.setCustomValidity('');
      formSubmit.removeAttribute('disabled');
    }
  }

  function checkInvalidPriceInput() {
    formPrice.placeholder = offerTypePricesMap[formType.value];

    if (offerTypePricesMap[formType.value] > formPrice.value) {
      formPrice.setCustomValidity('Не менее ' + offerTypePricesMap[formType.value] + ' рублей');
      formSubmit.setAttribute('disabled', true);
    } else {
      formPrice.setCustomValidity('');
      formSubmit.removeAttribute('disabled');
    }

  }

  function checkInvalidTimeInput(evt) {
    if (evt.target.id === 'timein') {
      formTimeOut.value = formTimeIn.value;
    } else {
      formTimeIn.value = formTimeOut.value;
    }
  }

  function checkInvalidRoomsInput() {

    if (formRoomNumber.value === '100' && formCapacity.value !== roomsValidMap[formRoomNumber.value]) {
      formCapacity.setCustomValidity(roomsValidityErrorMesages[formRoomNumber.value]);
      formSubmit.setAttribute('disabled', true);
      return;
    } else {
      formCapacity.setCustomValidity('');
      formSubmit.removeAttribute('disabled');
    }

    if (roomsValidMap[formRoomNumber.value] < formCapacity.value) {

      formCapacity.setCustomValidity(roomsValidityErrorMesages[formRoomNumber.value]);
      formSubmit.setAttribute('disabled', true);
    } else {
      formCapacity.setCustomValidity('');
      formSubmit.removeAttribute('disabled');
    }
  }

  var changeAvatar = function () {
    var loadAvatar = function () {
      avatarPreview.src = reader.result;
    };

    var file = avatarInput.files[0];
    var fileName = file.name.toLowerCase();

    var matches = VALID_TYPES.some(function (element) {
      return fileName.endsWith(element);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', loadAvatar);

      reader.readAsDataURL(file);
    }
  };

  var uploadPhotos = function () {
    var loadPhoto = function () {
      var img = document.createElement('img');
      img.src = reader.result;
      img.width = PHOTO_PREVIEW_WIDTH;
      img.height = PHOTO_PREVIEW_HEIGHT;
      photosPreview.appendChild(img);
    };

    var file = photosInput.files[0];
    var fileName = file.name.toLowerCase();

    var matches = VALID_TYPES.some(function (element) {
      return fileName.endsWith(element);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', loadPhoto);

      reader.readAsDataURL(file);
    }
  };

  window.form = {
    reset: onResetFormPress,
    submit: onSubmitPress,
    checkInvalidTitleInput: checkInvalidTitleInput,
    checkInvalidPriceInput: checkInvalidPriceInput,
    checkInvalidTimeInput: checkInvalidTimeInput,
    checkInvalidRoomsInput: checkInvalidRoomsInput,
    changeAvatar: changeAvatar,
    uploadPhotos: uploadPhotos,
  };
})();
