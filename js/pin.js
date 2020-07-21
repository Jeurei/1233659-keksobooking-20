
'use strict';
(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var MAIN_PIN_TOP_LIMIT = 130;
  var MAIN_PIN_BOTTOM_LIMIT = 630;
  var QUANTITY_OF_PINS = 5;
  var mainPin = document.querySelector('.map__pin--main');
  var pinHalfOffsetWidth = mainPin.offsetWidth / 2;
  var pinOffsetHeight = mainPin.offsetHeight;
  var form = document.querySelector('.ad-form');
  var formAddress = form.querySelector('#address');
  var map = document.querySelector('.map__pins');
  var mapWidth = map.offsetWidth;

  var setMainPinChords = function () {
    return (Math.floor(mainPin.offsetLeft + pinHalfOffsetWidth)) + ' ' + Math.floor((mainPin.offsetTop + pinOffsetHeight));
  };

  var startDrag = function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var dragged = false;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      dragged = true;

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };
      if (mainPin.offsetTop + pinOffsetHeight - shift.y < MAIN_PIN_TOP_LIMIT) {
        mainPin.style.top = MAIN_PIN_TOP_LIMIT;
      } else if (mainPin.offsetTop - shift.y > MAIN_PIN_BOTTOM_LIMIT - pinOffsetHeight) {
        mainPin.style.top = MAIN_PIN_BOTTOM_LIMIT - pinOffsetHeight + 'px';
      } else {
        mainPin.style.top = (mainPin.offsetTop - shift.y) + 'px';
      }
      if (mainPin.offsetLeft - shift.x < 0 - pinHalfOffsetWidth) {
        mainPin.style.left = 0 - pinHalfOffsetWidth + 'px';
      } else if (mainPin.offsetLeft - shift.x > mapWidth - pinHalfOffsetWidth) {
        mainPin.style.left = mapWidth - pinHalfOffsetWidth + 'px';
      } else {
        mainPin.style.left = (mainPin.offsetLeft - shift.x) + 'px';
      }
      formAddress.value = setMainPinChords();
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      if (dragged) {
        var onClickPreventDefault = function (clickEvt) {
          clickEvt.preventDefault();
          mainPin.removeEventListener('click', onClickPreventDefault);
        };
        mainPin.addEventListener('click', onClickPreventDefault);
      }
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      formAddress.value = setMainPinChords();
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  var createFragment = function (array) {
    var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
    var fragment = document.createDocumentFragment();

    array.forEach(function (element, i) {

      if (i > QUANTITY_OF_PINS) {
        return;
      }

      var offerElement = pinTemplate.cloneNode(true);
      offerElement.style.left = element.location.x - PIN_WIDTH / 2 + 'px';
      offerElement.style.top = element.location.y - PIN_HEIGHT + 'px';
      offerElement.firstChild.src = element.author.avatar;
      offerElement.firstChild.alt = element.offer.title;
      offerElement.setAttribute('data-id', i);
      offerElement.addEventListener('keydown', window.card.onEnterPinPress);
      offerElement.addEventListener('click', window.card.renderOffer);
      if (!element.hasOwnProperty('offer')) {
        offerElement.classList.add('visually-hidden');
      }
      fragment.appendChild(offerElement);
    });

    return fragment;
  };
  window.pin = {
    createFragment: createFragment,
    startDrag: startDrag,
    setMainPinChords: setMainPinChords,
    QUANTITY_OF_PINS: QUANTITY_OF_PINS,
  };
})();
