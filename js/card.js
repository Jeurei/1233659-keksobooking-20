'use strict';
(function () {
  var map = document.querySelector('.map');
  var mapFiltersContainer = map.querySelector('.map__filters-container');
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var popup = mapFiltersContainer.querySelector('.popup');
  var popupClose = document.querySelector('.popup__close');

  var OfferTypeMap = {
    FLAT: 'квартира',
    PALACE: 'дворец',
    HOUSE: 'дом',
    BUNGALO: 'бунгало'
  };

  var createCard = function (evt) {
    var card = mapFiltersContainer.querySelector('.popup');
    var type;
    var features;
    var photos;
    var object;
    var target = evt.currentTarget.dataset.id;

    if (window.map.filterPinsByType) {
      object = window.map.filterPinsByType[target];
    } else {
      object = window.map.pinsArr[target];
    }

    if (!card) {
      card = cardTemplate.cloneNode(true);
    }

    type = card.querySelector('.popup__type');
    card.querySelector('.popup__title').textContent = object.offer.title;
    card.querySelector('.popup__text--address').textContent = object.offer.adress;
    card.querySelector('.popup__text--price').textContent = object.offer.price + ' ₽/ночь';
    type.textContent = OfferTypeMap[object.offer.type.toUpperCase()];
    card.querySelector('.popup__text--capacity').textContent = object.offer.rooms + ' комнаты для ' + object.offer.guests + ' гостей';
    card.querySelector('.popup__text--time').textContent = 'Заезд после ' + object.offer.checkin + ', выезд до ' + object.offer.checkout;
    features = card.querySelector('.popup__features');
    features.innerHTML = '';
    object.offer.features.forEach(function (elem) {
      var li = document.createElement('li');
      li.classList.add('popup__feature');
      li.classList.add('popup__feature--' + elem);
      li.textContent = elem;
      features.appendChild(li);
    });

    card.querySelector('.popup__description').textContent = object.offer.description;
    photos = card.querySelector('.popup__photos');
    photos.innerHTML = '';
    object.offer.photos.forEach(function (elem) {
      var img = document.createElement('img');
      img.classList.add('popup__photo');
      img.alt = 'Фотография жилья';
      img.width = 45;
      img.height = 40;
      img.src = elem;
      photos.appendChild(img);
    });

    card.querySelector('.popup__avatar').src = object.author.avatar;
    card.querySelector('.popup__close').addEventListener('keydown', onEnterClosePopupPress);
    card.querySelector('.popup__close').addEventListener('click', closePopup);
    document.addEventListener('keydown', onEscClosePopupPress);
    return card;

  };

  var renderCard = function (evt) {
    var card = mapFiltersContainer.querySelector('.popup');
    if (!card) {
      card = createCard(evt);
      mapFiltersContainer.appendChild(card);
    } else {
      card = createCard(evt);
      card.classList.remove('visually-hidden');
    }
  };

  var onEnterClosePopupPress = function (evt) {
    popup = mapFiltersContainer.querySelector('.popup');
    popupClose = document.querySelector('.popup__close');

    if (evt.key === window.util.ENTER_CODE) {
      closePopup();
    }

  };

  var onEscClosePopupPress = function (evt) {
    if (evt.key === window.util.ESC_CODE) {
      evt.preventDefault();
      closePopup();
    }
  };

  function onFilterChangeClosePopup() {
    popup = mapFiltersContainer.querySelector('.popup');
    popupClose = document.querySelector('.popup__close');

    if (popup && !popup.classList.contains('visually-hidden')) {
      closePopup();
    }

  }

  var closePopup = function () {
    popup = mapFiltersContainer.querySelector('.popup');
    popupClose = document.querySelector('.popup__close');

    popup.classList.add('visually-hidden');

    popupClose.removeEventListener('keydown', onEnterClosePopupPress);

    document.removeEventListener('keydown', onEscClosePopupPress);

    popupClose.removeEventListener('click', closePopup);
  };

  var onEnterPinPress = function (evt) {

    if (evt.key === window.util.ENTER_CODE) {
      renderCard(evt);
    }

  };

  window.card = {
    onFilterChangeClosePopup: onFilterChangeClosePopup,
    closePopup: closePopup,
    renderCard: renderCard,
    onEnterPinPress: onEnterPinPress,
  };
})();
