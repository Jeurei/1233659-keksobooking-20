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

function createObj() {
  var x = getRandomInRange(0, pinsBlockWidth);
  var y = getRandomInRange(locationRangeMin, locationRangeMax);
  var features = [];

  var quantityOfFeatures = getRandomInRange(0, FEATURES.length);

  for (var i = 0; i < quantityOfFeatures; i++) {
    features.push(FEATURES[getRandomInRange(0, FEATURES.length)]);
  }

  var photos = [];
  var quantityOfPhotos = getRandomInRange(0, PHOTOS.length);

  for (var j = 0; j < quantityOfPhotos; j++) {
    photos.push(PHOTOS[getRandomInRange(0, PHOTOS.length)]);
  }

  return {
    author: {
      avatar: 'img/avatars/user0' + getRandomInRange(8, 1) + '.png'
    },
    location: {
      x: x,
      y: y
    },
    offer: {
      title: TITLES[getRandomInRange(0, TITLES.length)],
      adress: x + ' ' + y,
      price: getRandomInRange(1000, 10000),
      type: ROOM_TYPES[getRandomInRange(0, ROOM_TYPES.length)],
      rooms: getRandomInRange(1, 4),
      guests: getRandomInRange(0, 6),
      checkin: CHECKIN[getRandomInRange(0, CHECKIN.length)],
      checkout: CHECKOUT[getRandomInRange(0, CHECKOUT.length)],
      features: features,
      description: DESCRIPTIONS[getRandomInRange(0, DESCRIPTIONS.length)],
      photos: photos,
    }
  };
}

function createArray() {
  var arr = [];

  for (var i = 0; i < QUANTITY_OF_OBJ; i++) {
    arr.push(createObj());
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
  }

}

if (document.querySelector('.map')) {
  document.querySelector('.map').classList.remove('map--faded');
}
