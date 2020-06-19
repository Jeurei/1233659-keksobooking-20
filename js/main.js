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
// тоже такое себе решение имхо
var popupOpened = false;
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

function clearElems(className) {
  var previousElem = document.querySelectorAll('' + className);

  if (previousElem) {
    previousElem.forEach(function (elem) {
      elem.parentNode.removeChild(elem);
    });
  }

}


var onEscPress = function (evt) {
  if (evt.code === ESC_CODE) {
    closePopup(evt);
  }
};

var closePopup = function (evt) {
  evt.preventDefault();

  if (evt.code === ESC_CODE && popupOpened) {
    mapFiltersContainer.querySelector('.popup').remove();
    mapFiltersContainer.querySelector('.popup').removeEventListener('click', closePopup);
    popupOpened = false;
    return;
  }

  evt.target.closest('.popup').remove();

  popupOpened = false;

  evt.target.removeEventListener('click', onEscPress);

  evt.target.removeEventListener('click', closePopup);
};

var onEnterMainPinPress = function (evt) {
  if (evt.key === ENTER_CODE) {
    activateMap();
  }
};

var onEnterPinPress = function (evt) {
  if (evt.key === ENTER_CODE) {
    createCard();
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
  clearElems('.map__card popup');
  var obj;

  if (evt.target.classList.contains('map__pin')) {
    obj = pinsArr[evt.target.dataset.id];
  } else {
    obj = pinsArr[evt.target.parentNode.dataset.id];
  }


  if (cardTemplate) {

    var type = cardTemplate.querySelector('.popup__type');
    cardTemplate.querySelector('.popup__title').textContent = obj.offer.title;
    cardTemplate.querySelector('.popup__text--address').textContent = obj.offer.adress;
    cardTemplate.querySelector('.popup__text--price').textContent = obj.offer.price + ' ₽/ночь';
    type.textContent = OfferTypeMap[obj.offer.type.toUpperCase()];
    cardTemplate.querySelector('.popup__text--capacity').textContent = obj.offer.rooms + ' комнаты для ' + obj.offer.guests + ' гостей';
    cardTemplate.querySelector('.popup__text--time').textContent = 'Заезд после ' + obj.offer.timein + ', выезд до ' + obj.offer.timeout;
    var features = cardTemplate.querySelector('.popup__features');
    features.innerHTML = '';
    obj.offer.features.forEach(function (elem) {
      var li = document.createElement('li');
      li.classList.add('popup__feature');
      li.classList.add('popup__feature--' + elem);
      li.textContent = elem;
      features.appendChild(li);
    });

    cardTemplate.querySelector('.popup__description').textContent = obj.offer.description;
    var photos = cardTemplate.querySelector('.popup__photos');
    photos.innerHTML = '';
    obj.offer.photos.forEach(function (elem) {
      var img = document.createElement('img');
      img.classList.add('popup__photo');
      img.alt = 'Фотография жилья';
      img.width = 45;
      img.height = 40;
      img.src = elem;
      photos.appendChild(img);
    });

    cardTemplate.querySelector('.popup__avatar').src = obj.author.avatar;
    popupOpened = true;
    cardTemplate.addEventListener('keydown', onEnterPinPress);
    cardTemplate.querySelector('.popup__close').addEventListener('click', closePopup);
    mapFiltersContainer.appendChild(cardTemplate);
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


var checkInvalidInput = function (evt) {
  if (form.querySelector('#title').value.length < formTitleMinLength) {
    form.querySelector('#title').setCustomValidity('Не менее ' + formTitleMinLength + ' символов');
    formSubmit.setAttribute('disabled', true);
  } else if (form.querySelector('#title').value.length > formTitleMaxLength) {
    form.querySelector('#title').setCustomValidity('Не более ' + formTitleMaxLength + ' символов');
    formSubmit.setAttribute('disabled', true);
  } else {
    form.querySelector('#title').setCustomValidity('');
    formSubmit.removeAttribute('disabled');
  }

  form.querySelector('#price').placeholder = offerTypePricesMap[form.querySelector('#type').value];

  if (offerTypePricesMap[form.querySelector('#type').value] > form.querySelector('#price').value) {
    form.querySelector('#price').setCustomValidity('Не менее ' + offerTypePricesMap[form.querySelector('#type').value] + ' рублей');
    formSubmit.setAttribute('disabled', true);
  } else {
    form.querySelector('#price').setCustomValidity('');
    formSubmit.removeAttribute('disabled');
  }

  if (evt.target.id === 'timein') {
    form.querySelector('#timeout').value = form.querySelector('#timein').value;
  } else {
    form.querySelector('#timein').value = form.querySelector('#timeout').value;
  }

  if (form.querySelector('#room_number').value === '100' && form.querySelector('#capacity').value !== roomsValidMap[form.querySelector('#room_number').value]) {
    form.querySelector('#capacity').setCustomValidity(roomsValidityErrorMesages[form.querySelector('#room_number').value]);
    formSubmit.setAttribute('disabled', true);
    return;
  } else {
    form.querySelector('#capacity').setCustomValidity('');
    formSubmit.removeAttribute('disabled');
  }

  if (roomsValidMap[form.querySelector('#room_number').value] < form.querySelector('#capacity').value) {

    form.querySelector('#capacity').setCustomValidity(roomsValidityErrorMesages[form.querySelector('#room_number').value]);
    formSubmit.setAttribute('disabled', true);
  } else {
    form.querySelector('#capacity').setCustomValidity('');
    formSubmit.removeAttribute('disabled');
  }


};


var activateMap = function () {
  map.classList.remove('map--faded');
  clearElems('.map__pin:not(.map__pin--main)');

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
  form.querySelector('#capacity').addEventListener('change', checkInvalidInput);
  form.querySelector('#room_number').addEventListener('change', checkInvalidInput);
  form.querySelector('#title').addEventListener('input', checkInvalidInput);
  form.querySelector('#type').addEventListener('change', checkInvalidInput);
  form.querySelector('#price').addEventListener('input', checkInvalidInput);
  form.querySelector('#timein').addEventListener('change', checkInvalidInput);
  form.querySelector('#timeout ').addEventListener('change', checkInvalidInput);
  mainPin.removeEventListener('click', activateMap);
  mainPin.removeEventListener('keydown', onEnterMainPinPress);
  // наверное такое себе решение
  document.addEventListener('keydown', onEscPress);
};

initPage();
