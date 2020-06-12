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
var locationRangeMin = 130;
var locationRangeMax = 630;
var pinsBlockWidth = 0;
var OfferTypeMap = {
  FLAT: 'квартира',
  PALACE: 'дворец',
  HOUSE: 'дом',
  BUNGALO: 'бунгало'
};
if (document.querySelector('#card').content.querySelector('.map__card')) {
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card').cloneNode(true);
}

function getRandomInRange(min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
}

if (document.querySelector('.map')) {
  pinsBlockWidth = document.querySelector('.map').offsetWidth;
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
  obj.offer.features.forEach(function (el) {
    var li = document.createElement('li');
    li.classList.add('popup__feature');
    li.classList.add('popup__feature--' + el);
    li.textContent = el;
    features.appendChild(li);
  });

  cardTemplate.querySelector('.popup__description').textContent = obj.offer.description;
  var photos = cardTemplate.querySelector('.popup__photos');
  photos.innerHTML = '';
  obj.offer.photos.forEach(function (el) {
    var img = document.createElement('img');
    img.classList.add('popup__photo');
    img.alt = 'Фотография жилья';
    img.width = 45;
    img.height = 40;
    img.src = el;
    photos.appendChild(img);
  });

  cardTemplate.querySelector('.popup__avatar').src = obj.author.avatar;
  return cardTemplate;
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
    var offerEl = template.cloneNode(true);
    offerEl.style.left = el.location.x - PIN_WIDTH / 2 + 'px';
    offerEl.style.top = el.location.y - PIN_HEIGHT + 'px';
    offerEl.firstChild.src = el.author.avatar;
    offerEl.firstChild.alt = el.offer.title;
    fragment.appendChild(offerEl);
  });

  return fragment;

}

if (document.querySelector('.map__pins')) {
  var mapPins = document.querySelector('.map__pins');

  if (document.querySelector('#pin').content.querySelector('.map__pin')) {
    var template = document.querySelector('#pin').content.querySelector('.map__pin');
    var pinsArr = createArray();
    mapPins.appendChild(createFragment(pinsArr));

    if (cardTemplate) {
      var card = createCard(pinsArr[0]);
      if (document.querySelector('.map__filters-container')) {
        document.querySelector('.map__pins').appendChild(card);
      }
    }

  }

}

if (document.querySelector('.map')) {
  document.querySelector('.map').classList.remove('map--faded');
}
