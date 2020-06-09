'use strict';
var QUANTITY_OF_OBJ = 8;
var ROOM_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var CHECKIN = ['12:00', '13:00', '14:00'];
var CHECKOUT = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var TITLES = ['lorem', 'ipsum', 'dolor', 'sit'];
var DESCRIPTIONS = ['lorem ipsum', 'dolor sit', 'amet consectetur', 'adipiscing elit'];
var locationRangeMin = 130;
var locationRangeMax = 630;
var pinsBlockWidth = 0;
function getRandomInRange(min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
}

if (document.querySelector('.map')) {
  pinsBlockWidth = document.querySelector('.map').offsetWidth;
}

function createObj(index) {
  index++;
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
      avatar: 'img/avatars/user0' + index + '.png'
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
  var card = document.querySelector('#card').content.querySelector('.map__card').cloneNode(true);
  card.querySelector('.popup__title').textContent = obj.offer.title;
  card.querySelector('.popup__text--address').textContent = obj.offer.adress;
  card.querySelector('.popup__text--price').textContent = obj.offer.price + ' ₽/ночь';

  switch (obj.offer.type) {
    case 'flat':
      card.querySelector('.popup__type').textContent = 'Квартира';
      break;
    case 'bungalo':
      card.querySelector('.popup__type').textContent = 'Бунгало';
      break;
    case 'house':
      card.querySelector('.popup__type').textContent = 'Дом';
      break;
    case 'palace':
      card.querySelector('.popup__type').textContent = 'Дворец';
  }

  card.querySelector('.popup__text--capacity').textContent = obj.offer.rooms + ' комнаты для ' + obj.offer.guests + ' гостей';
  card.querySelector('.popup__text--time').textContent = 'Заезд после ' + obj.offer.checkin + ', выезд до ' + obj.offer.checkout;
  var features = card.querySelectorAll('.popup__feature');

  features.forEach(function (el) {

    obj.offer.features.forEach(function (objEl) {
      if (el.classList.contains('popup__feature--' + objEl) && el.textContent === '') {
        el.textContent = objEl;
      }
    });

    if (el.textContent === '') {
      el.classList.add('hidden');
    }

  });

  card.querySelector('.popup__description').textContent = obj.offer.description;
  var photos = card.querySelector('.popup__photos');

  if (obj.offer.photos.length >= 1) {
    while (photos.children.length < obj.offer.photos.length) {
      var img = document.createElement('img');
      img.classList.add('popup__photo');
      img.alt = 'Фотография жилья';
      img.width = 45;
      img.height = 40;
      photos.appendChild(img);
    }

  } else {

    if (obj.offer.photos.length === 0) {
      photos.children[0].classList.add('hidden');
    }

  }

  for (var j = 0; j < photos.children.length; j++) {
    photos.children[j].src = obj.offer.photos[j];
  }

  card.querySelector('.popup__avatar').src = obj.author.avatar;
  return card;
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
    offerEl.style.left = el.location.x - offerEl.offsetWidth / 2 + 'px';
    offerEl.style.top = el.location.y - offerEl.offsetHeight + 'px';
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

    if (document.querySelector('#card').content.querySelector('.map__card')) {
      var card = createCard(pinsArr[0]);
      if (document.querySelector('.map__filters-container')) {
        document.querySelector('.map__filters-container').insertAdjacentElement('beforebegin', card);
      }
    }

  }

}

if (document.querySelector('.map')) {
  document.querySelector('.map').classList.remove('map--faded');
}
