'use strict';
var QUANTITY_OF_OBJ = 8;
var ROOM_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var CHECKIN = ['12:00', '13:00', '14:00'];
var CHECKOUT = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

function getRandomInRange(max, min) {
  return min === undefined ? Math.floor(Math.random() * max) : Math.floor(min + Math.random() * (max + 1 - min));
}

if (document.querySelector('.map')) {
  var pinsBlockWidth = document.querySelector('.map').offsetWidth;
}
function createObj() {
  var obj = {};
  obj.author = {};
  obj.offer = {};
  obj.location = {};
  obj.author.avatar = 'img/avatars/user0' + getRandomInRange(8, 1) + '.png';
  obj.location.x = getRandomInRange(pinsBlockWidth, 0);
  obj.location.y = getRandomInRange(630, 130);
  obj.offer.title = 'строка, заголовок предложения';
  obj.offer.adress = obj.location.x + ' ' + obj.location.y;
  obj.offer.price = 'число, стоимость';
  obj.offer.type = ROOM_TYPES[getRandomInRange(ROOM_TYPES.length)];
  obj.offer.rooms = 'число, количество комнат';
  obj.offer.guests = 'число, количество гостей, которое можно разместить';
  obj.offer.checkin = CHECKIN[getRandomInRange(CHECKIN.length)];
  obj.offer.checkout = CHECKOUT[getRandomInRange(CHECKOUT.length)];
  obj.offer.features = [];
  for (var i = 0; i <= Math.round(0 - 0.5 + Math.random() * (FEATURES.length - 0 + 1)); i++) {
    var id = Math.floor(Math.random() * FEATURES.length);
    var type = FEATURES[id];
    obj.offer.features.push(type);
  }
  obj.offer.description = 'строка с описанием';
  obj.offer.photos = [];
  for (var j = 0; j < getRandomInRange(PHOTOS.length, 0); j++) {
    obj.offer.photos.push(PHOTOS[getRandomInRange(PHOTOS.length)]);
  }
  return obj;

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
    offerEl.style.left = el.location.x + offerEl.offsetWidth + 'px';
    offerEl.style.top = el.location.y + offerEl.offsetHeight + 'px';
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
