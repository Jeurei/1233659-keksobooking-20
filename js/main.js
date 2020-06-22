'use strict';
var QUANTITY_OF_OBJ = 8;
var ROOM_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var CHECKIN = ['12:00', '13:00', '14:00'];
var CHECKOUT = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var TITLES = ['lorem', 'ipsum', 'dolor', 'sit'];
var DESCRIPTIONS = ['lorem ipsum', 'dolor sit', 'amet consectetur', 'adipiscing elit'];
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var ENTER_CODE = 'Enter';
var ESC_CODE = 'Escape';
var locationRangeMin = 130;
var locationRangeMax = 630;
var pinsBlockWidth = document.querySelector('.map').offsetWidth;
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card').cloneNode(true);

var OfferTypeMap = {
  FLAT: 'квартира',
  PALACE: 'дворец',
  HOUSE: 'дом',
  BUNGALO: 'бунгало'
};

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
var form = document.querySelector('.ad-form');
var formCapacity = form.querySelector('#capacity');
var formRoomNumber = form.querySelector('#room_number');
var formTitle = form.querySelector('#title');
var formPrice = form.querySelector('#price');
var formType = form.querySelector('#type');
var formTimeIn = form.querySelector('#timein');
var formTimeOut = form.querySelector('#timeout');
var formAddress = form.querySelector('#address');
var formElements = form.querySelectorAll('.ad-form__element');
var formSubmit = form.querySelector('.ad-form__submit');
var mapPins = document.querySelector('.map__pins');
var mainPin = document.querySelector('.map__pin--main');
var map = document.querySelector('.map');
var mapForm = document.querySelector('.map__filters');
var mapFormFilters = mapForm.querySelectorAll('.map__filter');
var mapFormFeatures = mapForm.querySelectorAll('.map__features');
var mapFiltersContainer = map.querySelector('.map__filters-container');
var pinsArr = [];

var formTitleMinLength = 30;
var formTitleMaxLength = 100;


function addAttributeDisabled(arr) {
  arr.forEach(function (elem) {
    elem.setAttribute('disabled', true);
  });
}

function removeAttributeDisabled(arr) {
  arr.forEach(function (elem) {
    elem.removeAttribute('disabled');
  });
}

function getRandomInRange(min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
}

function clearPins() {
  var previousPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');

  if (previousPins) {
    previousPins.forEach(function (elem) {
      elem.parentNode.removeChild(elem);
    });
  }

}

var onEscPressClosePopup = function (evt) {

  if (evt.code === ESC_CODE && !mapFiltersContainer.querySelector('.popup.visually-hidden')) {
    evt.preventDefault();
    mapFiltersContainer.querySelector('.popup').removeEventListener('click', closePopup);
    mapFiltersContainer.querySelector('.popup').classList.add('visually-hidden');
  }

};

var onEnterClosePopupPress = function (evt) {
  if (evt.key === ENTER_CODE) {
    closePopup();
  }
};

var closePopup = function (evt) {

  evt.target.closest('.popup').classList.add('visually-hidden');

  evt.target.removeEventListener('keydown', onEnterClosePopupPress);

  evt.target.removeEventListener('click', closePopup);
};


var onEnterMainPinPress = function (evt) {
  if (evt.key === ENTER_CODE) {
    activateMap();
  }
};

var onEnterPinPress = function (evt) {
  if (evt.key === ENTER_CODE) {
    createCard(evt);
  }
};

function createObj(index) {
  var x = getRandomInRange(0, pinsBlockWidth);
  var y = getRandomInRange(locationRangeMin, locationRangeMax);
  var features = [];

  var quantityOfFeatures = getRandomInRange(0, FEATURES.length);

  for (var i = 0; i < quantityOfFeatures; i++) {
    features.push(FEATURES[getRandomInRange(0, FEATURES.length - 1)]);
  }

  var photos = [];
  var quantityOfPhotos = getRandomInRange(0, PHOTOS.length);

  for (var j = 0; j < quantityOfPhotos; j++) {
    photos.push(PHOTOS[getRandomInRange(0, PHOTOS.length - 1)]);
  }

  return {
    author: {
      avatar: 'img/avatars/user0' + (index + 1) + '.png'
    },
    location: {
      x: x,
      y: y
    },
    offer: {
      title: TITLES[getRandomInRange(0, TITLES.length - 1)],
      adress: x + ' ' + y,
      price: getRandomInRange(1000, 10000),
      type: ROOM_TYPES[getRandomInRange(0, ROOM_TYPES.length - 1)],
      rooms: getRandomInRange(1, 4),
      guests: getRandomInRange(0, 6),
      timein: CHECKIN[getRandomInRange(0, CHECKIN.length - 1)],
      timeout: CHECKOUT[getRandomInRange(0, CHECKOUT.length - 1)],
      features: features,
      description: DESCRIPTIONS[getRandomInRange(0, DESCRIPTIONS.length - 1)],
      photos: photos,
      id: index,
    }
  };
}

function createArray() {
  var arr = [];

  for (var i = 0; i < QUANTITY_OF_OBJ; i++) {
    arr.push(createObj(i));
  }

  return arr;
}

var createCard = function (evt) {
  var card = mapFiltersContainer.querySelector('.popup');
  var object;
  var type;
  var features;
  var photos;

  if (evt.target.classList.contains('map__pin')) {
    object = pinsArr[evt.target.dataset.id];
  } else {
    object = pinsArr[evt.target.parentNode.dataset.id];
  }


  if (cardTemplate && !card) {

    type = cardTemplate.querySelector('.popup__type');
    cardTemplate.querySelector('.popup__title').textContent = object.offer.title;
    cardTemplate.querySelector('.popup__text--address').textContent = object.offer.adress;
    cardTemplate.querySelector('.popup__text--price').textContent = object.offer.price + ' ₽/ночь';
    type.textContent = OfferTypeMap[object.offer.type.toUpperCase()];
    cardTemplate.querySelector('.popup__text--capacity').textContent = object.offer.rooms + ' комнаты для ' + object.offer.guests + ' гостей';
    cardTemplate.querySelector('.popup__text--time').textContent = 'Заезд после ' + object.offer.timein + ', выезд до ' + object.offer.timeout;
    features = cardTemplate.querySelector('.popup__features');
    features.innerHTML = '';
    object.offer.features.forEach(function (elem) {
      var li = document.createElement('li');
      li.classList.add('popup__feature');
      li.classList.add('popup__feature--' + elem);
      li.textContent = elem;
      features.appendChild(li);
    });

    cardTemplate.querySelector('.popup__description').textContent = object.offer.description;
    photos = cardTemplate.querySelector('.popup__photos');
    photos.innerHTML = '';
    object.offer.photos.forEach(function (elem) {
      var img = document.createElement('img');
      img.classList.add('popup__photo');
      img.alt = 'Фотография жилья';
      img.width = 45;
      img.height = 40;
      img.src = elem;
      photos.appendChild(img);
    });

    cardTemplate.querySelector('.popup__avatar').src = object.author.avatar;
    cardTemplate.querySelector('.popup__close').addEventListener('keydown', onEnterClosePopupPress);
    cardTemplate.querySelector('.popup__close').addEventListener('click', closePopup);
    mapFiltersContainer.appendChild(cardTemplate);
  } else {
    type = card.querySelector('.popup__type');
    card.querySelector('.popup__title').textContent = object.offer.title;
    card.querySelector('.popup__title').textContent = object.offer.title;
    card.querySelector('.popup__text--address').textContent = object.offer.adress;
    card.querySelector('.popup__text--price').textContent = object.offer.price + ' ₽/ночь';
    type.textContent = OfferTypeMap[object.offer.type.toUpperCase()];
    card.querySelector('.popup__text--capacity').textContent = object.offer.rooms + ' комнаты для ' + object.offer.guests + ' гостей';
    card.querySelector('.popup__text--time').textContent = 'Заезд после ' + object.offer.timein + ', выезд до ' + object.offer.timeout;
    features = card.querySelector('.popup__features');
    features.innerHTML = '';
    object.offer.features.forEach(function (elem) {
      var li = document.createElement('li');
      li.classList.add('popup__feature');
      li.classList.add('popup__feature--' + elem);
      li.textContent = elem;
      features.appendChild(li);
    });

    card.querySelector('.popup__description').textContent = object.offer.description;
    photos = card.querySelector('.popup__photos');
    photos.innerHTML = '';
    object.offer.photos.forEach(function (elem) {
      var img = document.createElement('img');
      img.classList.add('popup__photo');
      img.alt = 'Фотография жилья';
      img.width = 45;
      img.height = 40;
      img.src = elem;
      photos.appendChild(img);
    });
    card.querySelector('.popup__close').addEventListener('keydown', onEnterClosePopupPress);
    card.querySelector('.popup__close').addEventListener('click', closePopup);
    card.querySelector('.popup__avatar').src = object.author.avatar;
    card.classList.remove('visually-hidden');
  }
};

function createFragment(arr) {
  var fragment = document.createDocumentFragment();

  arr.forEach(function (elem) {
    var offerEl = pinTemplate.cloneNode(true);
    offerEl.style.left = elem.location.x - PIN_WIDTH / 2 + 'px';
    offerEl.style.top = elem.location.y - PIN_HEIGHT + 'px';
    offerEl.firstChild.src = elem.author.avatar;
    offerEl.firstChild.alt = elem.offer.title;
    offerEl.setAttribute('data-id', elem.offer.id);
    offerEl.addEventListener('keydown', onEnterPinPress);
    offerEl.addEventListener('click', createCard);
    fragment.appendChild(offerEl);
  });

  return fragment;

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

  formAddress.value = (Math.floor(mainPin.offsetLeft + mainPin.offsetWidth / 2)) + ' ' + Math.floor((mainPin.offsetTop + mainPin.offsetHeight / 2));
  mainPin.addEventListener('mousedown', activateMap);
  mainPin.addEventListener('keydown', onEnterMainPinPress);
}

function checkInvalidTitleInput() {
  if (formTitle.value.length < formTitleMinLength) {
    formTitle.setCustomValidity('Не менее ' + formTitleMinLength + ' символов');
    formSubmit.setAttribute('disabled', true);
  } else if (formTitle.value.length > formTitleMaxLength) {
    formTitle.setCustomValidity('Не более ' + formTitleMaxLength + ' символов');
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


var activateMap = function () {
  map.classList.remove('map--faded');
  clearPins();

  if (pinTemplate) {
    pinsArr = createArray();
    mapPins.appendChild(createFragment(pinsArr));

  }

  form.classList.remove('ad-form--disabled');
  if (formElements.length !== 0) {
    removeAttributeDisabled(formElements);
  }

  if (mapFormFilters.length !== 0) {
    removeAttributeDisabled(mapFormFilters);
  }

  if (mapFormFeatures.length !== 0) {
    removeAttributeDisabled(mapFormFeatures);
  }

  formAddress.value = (Math.floor(mainPin.offsetLeft + mainPin.offsetWidth / 2)) + ' ' + (mainPin.offsetTop + mainPin.offsetHeight);
  formCapacity.addEventListener('change', checkInvalidRoomsInput);
  formRoomNumber.addEventListener('change', checkInvalidRoomsInput);
  formTitle.addEventListener('input', checkInvalidTitleInput);
  formType.addEventListener('change', checkInvalidPriceInput);
  formPrice.addEventListener('input', checkInvalidPriceInput);
  formTimeIn.addEventListener('change', checkInvalidTimeInput);
  formTimeOut.addEventListener('change', checkInvalidTimeInput);
  mainPin.removeEventListener('click', activateMap);
  mainPin.removeEventListener('keydown', onEnterMainPinPress);
  document.addEventListener('keydown', onEscPressClosePopup);
};

initPage();
