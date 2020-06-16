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
var pinsBlockWidth = 0;
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

// var OfferTypeMap = {
//   FLAT: 'квартира',
//   PALACE: 'дворец',
//   HOUSE: 'дом',
//   BUNGALO: 'бунгало'
// };

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


if (cardTemplate) {
  cardTemplate = document.querySelector('#card').content.querySelector('.map__card').cloneNode(true);
}

if (map) {
  pinsBlockWidth = document.querySelector('.map').offsetWidth;
}

function addAttributeDisabled(arr) {
  arr.forEach(function (el) {
    el.setAttribute('disabled', true);
  });
}

function removeAttributeDisabled(arr) {
  arr.forEach(function (el) {
    el.removeAttribute('disabled');
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

  arr.forEach(function (el) {
    var offerEl = pinTemplate.cloneNode(true);
    offerEl.style.left = el.location.x - PIN_WIDTH / 2 + 'px';
    offerEl.style.top = el.location.y - PIN_HEIGHT + 'px';
    offerEl.firstChild.src = el.author.avatar;
    offerEl.firstChild.alt = el.offer.title;
    fragment.appendChild(offerEl);
  });

  return fragment;

}

// function createCard(obj) {
//   var type = cardTemplate.querySelector('.popup__type');
//   cardTemplate.querySelector('.popup__title').textContent = obj.offer.title;
//   cardTemplate.querySelector('.popup__text--address').textContent = obj.offer.adress;
//   cardTemplate.querySelector('.popup__text--price').textContent = obj.offer.price + ' ₽/ночь';
//   type.textContent = OfferTypeMap[obj.offer.type.toUpperCase()];
//   cardTemplate.querySelector('.popup__text--capacity').textContent = obj.offer.rooms + ' комнаты для ' + obj.offer.guests + ' гостей';
//   cardTemplate.querySelector('.popup__text--time').textContent = 'Заезд после ' + obj.offer.checkin + ', выезд до ' + obj.offer.checkout;
//   var features = cardTemplate.querySelector('.popup__features');
//   features.innerHTML = '';
//   obj.offer.features.forEach(function (el) {
//     var li = document.createElement('li');
//     li.classList.add('popup__feature');
//     li.classList.add('popup__feature--' + el);
//     li.textContent = el;
//     features.appendChild(li);
//   });

//   cardTemplate.querySelector('.popup__description').textContent = obj.offer.description;
//   var photos = cardTemplate.querySelector('.popup__photos');
//   photos.innerHTML = '';
//   obj.offer.photos.forEach(function (el) {
//     var img = document.createElement('img');
//     img.classList.add('popup__photo');
//     img.alt = 'Фотография жилья';
//     img.width = 45;
//     img.height = 40;
//     img.src = el;
//     photos.appendChild(img);
//   });

//   cardTemplate.querySelector('.popup__avatar').src = obj.author.avatar;
//   return cardTemplate;
// }

var onEnterPinPress = function (evt) {
  if (evt.key === ENTER_CODE) {
    toggleMap();
  }
};

var checkInvalidInput = function () {
  var formCapacityValue = +(formCapacity.value);
  var formRoomsValue = +(formRooms.value);

  if (formRoomsValue === 1) {

    if (formCapacityValue > 1) {
      formCapacity.setCustomValidity('Не больше одного гостя');
      formSubmit.setAttribute('disabled', true);
    } else {
      formCapacity.setCustomValidity('');
      formSubmit.removeAttribute('disabled');
    }

  }

  if (formRoomsValue === 2) {

    if (formCapacityValue > 2) {
      formCapacity.setCustomValidity('Не больше двух гостей');
      formSubmit.setAttribute('disabled', true);
    } else {
      formCapacity.setCustomValidity('');
      formSubmit.removeAttribute('disabled');
    }

  }

  if (formRoomsValue === 100) {

    if (formCapacityValue !== 0) {
      formCapacity.setCustomValidity('Не для гостей');
      formSubmit.setAttribute('disabled', true);
    } else {
      formCapacity.setCustomValidity('');
      formSubmit.removeAttribute('disabled');
    }

  }

  if (formCapacityValue === 0 && formRoomsValue !== 100) {
    formCapacity.setCustomValidity('Нужен минимум один гость');
    formSubmit.setAttribute('disabled', true);
  } else {
    formCapacity.setCustomValidity('');
    formSubmit.removeAttribute('disabled');
  }

};

var toggleMap = function () {
  map.classList.remove('map--faded');

  if (mapPins) {

    // возможно это стоит вынести в одтельную функцию(удаляет предыдущие пины)

    while (mapPins.children.length > 2) {
      mapPins.removeChild(mapPins.lastChild);
    }

    if (pinTemplate) {
      var pinsArr = createArray();
      mapPins.appendChild(createFragment(pinsArr));

      // if (cardTemplate) {
      //   var card = createCard(pinsArr[0]);
      //   if (document.querySelector('.map__filters-container')) {
      //     document.querySelector('.map__pins').appendChild(card);
      //   }
      // }

    }

  }

  if (form) {
    form.classList.remove('ad-form--disabled');
    if (formElements.length !== 0) {
      removeAttributeDisabled(formElements);
    }

  }

  if (mapForm) {
    if (mapFormFilters.length !== 0) {
      removeAttributeDisabled(mapFormFilters);
    }

    if (mapFormFeatures.length !== 0) {
      removeAttributeDisabled(mapFormFeatures);
    }

  }

  if (formAddress) {
    formAddress.value = (Math.floor(mainPin.offsetLeft + mainPin.offsetWidth / 2)) + ' ' + (mainPin.offsetTop + mainPin.offsetHeight);
  }

  if (formCapacity && formRooms) {
    formCapacity.addEventListener('change', checkInvalidInput);
    formRooms.addEventListener('change', checkInvalidInput);
  }

  mainPin.removeEventListener('click', toggleMap);
  mainPin.removeEventListener('keydown', onEnterPinPress);
};

if (form) {

  if (formElements.length !== 0) {
    addAttributeDisabled(formElements);
  }

}

if (mapForm) {

  if (mapFormFilters.length !== 0) {
    addAttributeDisabled(mapFormFilters);
  }

  if (mapFormFeatures.length !== 0) {
    addAttributeDisabled(mapFormFeatures);
  }

}

if (mainPin) {

  if (formAddress) {
    formAddress.value = (Math.floor(mainPin.offsetLeft + mainPin.offsetWidth / 2)) + ' ' + Math.floor((mainPin.offsetTop + mainPin.offsetHeight / 2));
  }

  mainPin.addEventListener('mousedown', toggleMap);
  mainPin.addEventListener('keydown', onEnterPinPress);
}
