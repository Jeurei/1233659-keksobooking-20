'use strict';
(function () {
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
  var pinsBlockWidth = document.querySelector('.map').offsetWidth;

  function createObj(index) {
    var x = window.util.getRandomInRange(0, pinsBlockWidth);
    var y = window.util.getRandomInRange(locationRangeMin, locationRangeMax);
    var features = [];

    var quantityOfFeatures = window.util.getRandomInRange(0, FEATURES.length);

    for (var i = 0; i < quantityOfFeatures; i++) {
      features.push(FEATURES[window.util.getRandomInRange(0, FEATURES.length - 1)]);
    }

    var photos = [];
    var quantityOfPhotos = window.util.getRandomInRange(0, PHOTOS.length);

    for (var j = 0; j < quantityOfPhotos; j++) {
      photos.push(PHOTOS[window.util.getRandomInRange(0, PHOTOS.length - 1)]);
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
        title: TITLES[window.util.getRandomInRange(0, TITLES.length - 1)],
        adress: x + ' ' + y,
        price: window.util.getRandomInRange(1000, 10000),
        type: ROOM_TYPES[window.util.getRandomInRange(0, ROOM_TYPES.length - 1)],
        rooms: window.util.getRandomInRange(1, 4),
        guests: window.util.getRandomInRange(0, 6),
        timein: CHECKIN[window.util.getRandomInRange(0, CHECKIN.length - 1)],
        timeout: CHECKOUT[window.util.getRandomInRange(0, CHECKOUT.length - 1)],
        features: features,
        description: DESCRIPTIONS[window.util.getRandomInRange(0, DESCRIPTIONS.length - 1)],
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
  window.data = {
    createArray: createArray,
  };

})();
