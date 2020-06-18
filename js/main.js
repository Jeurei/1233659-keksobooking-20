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

var roomsValidityErrorMesages = {
  '1': 'Не больше одного гостя',
  '2': 'Не больше двух гостей',
  '3': 'Не больше трех гостей',
  '100': 'Не для гостей'
};

var form = document.querySelector('.ad-form');
var formAddress = form.querySelector('#address');
var formElements = form.querySelectorAll('.ad-form__element');
var formRooms = form.querySelector('#room_number');
var formCapacity = form.querySelector('#capacity');
var formSubmit = form.querySelector('.ad-form__submit');
var mapPins = document.querySelector('.map__pins');
var mainPin = document.querySelector('.map__pin--main');
var map = document.querySelector('.map');
var mapForm = document.querySelector('.map__filters');
var mapFormFilters = mapForm.querySelectorAll('.map__filter');
var mapFormFeatures = mapForm.querySelectorAll('.map__features');


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
      checkin: CHECKIN[getRandomInRange(0, CHECKIN.length - 1)],
      checkout: CHECKOUT[getRandomInRange(0, CHECKOUT.length - 1)],
      features: features,
      description: DESCRIPTIONS[getRandomInRange(0, DESCRIPTIONS.length - 1)],
      photos: photos,
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

function createFragment(arr) {
  var fragment = document.createDocumentFragment();

  arr.forEach(function (elem) {
    var offerEl = pinTemplate.cloneNode(true);
    offerEl.style.left = elem.location.x - PIN_WIDTH / 2 + 'px';
    offerEl.style.top = elem.location.y - PIN_HEIGHT + 'px';
    offerEl.firstChild.src = elem.author.avatar;
    offerEl.firstChild.alt = elem.offer.title;
    fragment.appendChild(offerEl);
  });

  return fragment;

}

function createCard(obj) {
  var type = cardTemplate.querySelector('.popup__type');
  cardTemplate.querySelector('.popup__title').textContent = obj.offer.title;
  cardTemplate.querySelector('.popup__text--address').textContent = obj.offer.adress;
  cardTemplate.querySelector('.popup__text--price').textContent = obj.offer.price + ' ₽/ночь';
  type.textContent = OfferTypeMap[obj.offer.type.toUpperCase()];
  cardTemplate.querySelector('.popup__text--capacity').textContent = obj.offer.rooms + ' комнаты для ' + obj.offer.guests + ' гостей';
  cardTemplate.querySelector('.popup__text--time').textContent = 'Заезд после ' + obj.offer.checkin + ', выезд до ' + obj.offer.checkout;
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
  return cardTemplate;
}

function clearPins() {
  var previousPins = map.querySelectorAll('.map__pin:not(.map__pin--main)');

  if (previousPins) {
    previousPins.forEach(function (elem) {
      elem.parentNode.removeChild(elem);
    });
  }

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
  mainPin.addEventListener('keydown', onEnterPinPress);

}

var onEnterPinPress = function (evt) {
  if (evt.key === ENTER_CODE) {
    activateMap();
  }
};

var checkInvalidInput = function () {
  var formCapacityValue = +formCapacity.value;


  if (roomsValidMap[formRooms.value] < formCapacityValue) {
    formCapacity.setCustomValidity(roomsValidityErrorMesages[formRooms.value]);
    formSubmit.setAttribute('disabled', true);
  } else {
    formCapacity.setCustomValidity('');
    formSubmit.removeAttribute('disabled');
  }

  if (formRooms.value === '100' && formCapacityValue !== roomsValidMap[formRooms.value]) {
    formCapacity.setCustomValidity(roomsValidityErrorMesages[formRooms.value]);
    formSubmit.setAttribute('disabled', true);
    return;
  } else {
    formCapacity.setCustomValidity('');
    formSubmit.removeAttribute('disabled');
  }

};


var activateMap = function () {
  map.classList.remove('map--faded');
  clearPins();

  if (pinTemplate) {
    var pinsArr = createArray();
    mapPins.appendChild(createFragment(pinsArr));

    if (cardTemplate) {
      var card = createCard(pinsArr[0]);
      if (document.querySelector('.map__filters-container')) {
        document.querySelector('.map__pins').appendChild(card);
      }
    }

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
  formCapacity.addEventListener('change', checkInvalidInput);
  formRooms.addEventListener('change', checkInvalidInput);
  mainPin.removeEventListener('click', activateMap);
  mainPin.removeEventListener('keydown', onEnterPinPress);
};

initPage();
