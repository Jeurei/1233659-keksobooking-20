
'use strict';
(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var MAIN_PIN_TOP_LIMIT = 130;
  var MAIN_PIN_BOTTOM_LIMIT = 630;
  var QUANTITY_OF_PINS = 5;
  var mainPin = document.querySelector('.map__pin--main');
  var form = document.querySelector('.ad-form');
  var formAddress = form.querySelector('#address');
  var map = document.querySelector('.map__pins');
  var mapWidth = map.offsetWidth;

  function setMainPinChords() {
    return (Math.floor(mainPin.offsetLeft + mainPin.offsetWidth / 2)) + ' ' + Math.floor((mainPin.offsetTop + mainPin.offsetHeight / 2));
  }

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
      if (mainPin.offsetTop + mainPin.offsetHeight / 2 - shift.y < MAIN_PIN_TOP_LIMIT) {
        mainPin.style.top = MAIN_PIN_TOP_LIMIT;
      } else if (mainPin.offsetTop - shift.y > MAIN_PIN_BOTTOM_LIMIT - mainPin.offsetHeight / 2) {
        mainPin.style.top = MAIN_PIN_BOTTOM_LIMIT - mainPin.offsetHeight / 2 + 'px';
      } else {
        mainPin.style.top = (mainPin.offsetTop - shift.y) + 'px';
      }
      if (mainPin.offsetLeft - shift.x < 0 - mainPin.offsetWidth / 2) {
        mainPin.style.left = 0 - mainPin.offsetWidth / 2 + 'px';
      } else if (mainPin.offsetLeft - shift.x > mapWidth - mainPin.offsetWidth / 2) {
        mainPin.style.left = mapWidth - mainPin.offsetWidth / 2 + 'px';
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

  function createFragment(arr) {
    var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
    var fragment = document.createDocumentFragment();

    arr.forEach(function (elem, i) {

      if (i > QUANTITY_OF_PINS) {
        return;
      }

      var offerEl = pinTemplate.cloneNode(true);
      offerEl.style.left = elem.location.x - PIN_WIDTH / 2 + 'px';
      offerEl.style.top = elem.location.y - PIN_HEIGHT + 'px';
      offerEl.firstChild.src = elem.author.avatar;
      offerEl.firstChild.alt = elem.offer.title;
      offerEl.setAttribute('data-id', i);
      offerEl.addEventListener('keydown', window.card.onEnterPinPress);
      offerEl.addEventListener('click', window.card.renderCard);
      if (!elem.hasOwnProperty('offer')) {
        offerEl.classList.add('visually-hidden');
      }
      fragment.appendChild(offerEl);
    });

    return fragment;
  }
  window.pin = {
    createFragment: createFragment,
    startDrag: startDrag,
    setMainPinChords: setMainPinChords,
  };
})();
