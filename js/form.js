'use strict';
(function () {
  var FORM_TITLE_MIN_LENGTH = 30;
  var FORM_TITLE_MAX_LENGTH = 100;
  var VALID_TYPES = ['image', 'jpeg', 'x-png', 'png', 'gif'];
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

  var clearPhotos = function () {
    var photos = photosPreview.querySelectorAll('img');
    if (photos.length) {
      photos.forEach(function (element) {
        element.remove();
      });
    }
  };

  var closeSuccessPopup = function () {
    document.removeEventListener('click', closeSuccessPopup);
    document.removeEventListener('keydown', onEscPress);
    document.querySelector('.success').remove();
  };

  var onEscPress = function (evt) {
    if (evt.key === window.util.ESC_CODE) {
      evt.preventDefault();
      closeSuccessPopup();
    }
  };

  var checkInvalidTitleInput = function () {
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
  };

  var checkInvalidPriceInput = function () {
    formPrice.placeholder = offerTypePricesMap[formType.value];

    if (offerTypePricesMap[formType.value] > formPrice.value) {
      formPrice.setCustomValidity('Не менее ' + offerTypePricesMap[formType.value] + ' рублей');
      formSubmit.setAttribute('disabled', true);
    } else {
      formPrice.setCustomValidity('');
      formSubmit.removeAttribute('disabled');
    }

  };

  var checkInvalidTimeInput = function (evt) {
    if (evt.target.id === 'timein') {
      formTimeOut.value = formTimeIn.value;
    } else {
      formTimeIn.value = formTimeOut.value;
    }
  };

  var checkInvalidRoomsInput = function () {

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
  };


  var onResetFormPress = function (evt) {
    if (!form.classList.contains('ad-form--disabled')) {
      evt.preventDefault();
      window.main.deactivatePage();
    }
  };

  var onSuccessSubmit = function () {
    window.main.deactivatePage();
    var successPopup = template.content.cloneNode(true);
    main.appendChild(successPopup);
    document.addEventListener('click', closeSuccessPopup);
    document.addEventListener('keydown', onEscPress);
  };

  var onSubmitPress = function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(form), onSuccessSubmit, window.util.onError);
  };

  var loadAvatar = function (result) {
    avatarPreview.src = result;
  };

  var changeAvatar = function () {

    var file = avatarInput.files[0];
    var fileName = file.name.toLowerCase();

    var matches = VALID_TYPES.some(function (element) {
      return fileName.endsWith(element);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        loadAvatar(reader.result);
      });

      reader.readAsDataURL(file);
    }
  };

  var createPhoto = function (element) {
    var img = document.createElement('img');
    img.src = element.result;
    img.width = PHOTO_PREVIEW_WIDTH;
    img.height = PHOTO_PREVIEW_HEIGHT;
    return img;
  };

  var uploadPhotos = function () {
    var files = photosInput.files;

    for (var i = 0; i < files.length; i++) {
      var file = photosInput.files[i];
      var fileName = file.name.toLowerCase();

      var matches = VALID_TYPES.some(function (element) {
        return fileName.endsWith(element);
      });

      if (matches) {
        var reader = new FileReader();

        reader.addEventListener('load', function (element) {
          photosPreview.appendChild(createPhoto(element.target));
        });

        reader.readAsDataURL(file);
      }
    }
  };

  window.form = {
    reset: onResetFormPress,
    submit: onSubmitPress,
    checkInvalidTitleInput: checkInvalidTitleInput,
    checkInvalidPriceInput: checkInvalidPriceInput,
    checkInvalidTimeInput: checkInvalidTimeInput,
    checkInvalidRoomsInput: checkInvalidRoomsInput,
    clearPhotos: clearPhotos,
    changeAvatar: changeAvatar,
    uploadPhotos: uploadPhotos,
  };
})();
