'use strict';
(function () {
  var DEFAULT_PHOTO_WIDTH = 45;
  var DEFAULT_PHOTO_HEIGHT = 40;
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var popup = mapFiltersContainer.querySelector('.popup');
  var popupClose = document.querySelector('.popup__close');

  var OfferTypeMap = {
    FLAT: 'квартира',
    PALACE: 'дворец',
    HOUSE: 'дом',
    BUNGALO: 'бунгало'
  };

  var createFeatureElement = function (element) {
    var li = document.createElement('li');
    li.classList.add('popup__feature');
    li.classList.add('popup__feature--' + element);
    li.textContent = element;
    return li;
  };

  var createPhotoElement = function (element) {
    var img = document.createElement('img');
    img.classList.add('popup__photo');
    img.alt = 'Фотография жилья';
    img.width = DEFAULT_PHOTO_WIDTH;
    img.height = DEFAULT_PHOTO_HEIGHT;
    img.src = element;
    return img;
  };

  var closePopup = function () {
    popup = mapFiltersContainer.querySelector('.popup');
    popupClose = document.querySelector('.popup__close');

    popup.classList.add('visually-hidden');

    popupClose.removeEventListener('keydown', onEnterClosePopupPress);

    document.removeEventListener('keydown', onEscClosePopupPress);

    popupClose.removeEventListener('click', onClickClosePopup);
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

  var onFilterChangeClosePopup = function () {
    popup = mapFiltersContainer.querySelector('.popup');
    popupClose = document.querySelector('.popup__close');

    if (popup && !popup.classList.contains('visually-hidden')) {
      closePopup();
    }

  };

  var onClickClosePopup = function () {
    closePopup();
  };

  var onEnterPinPress = function (evt) {

    if (evt.key === window.util.ENTER_CODE) {
      renderOffer(evt);
    }

  };

  var createCard = function (evt) {
    var card = mapFiltersContainer.querySelector('.popup');
    var typeElement = null;
    var featuresElement = null;
    var photosElement = null;
    var object = null;
    var target = evt.currentTarget.dataset.id;

    if (window.map.filteredPins) {
      object = window.map.filteredPins[target];
    } else {
      object = window.map.pinsArr[target];
    }

    if (!card) {
      card = cardTemplate.cloneNode(true);
    }

    typeElement = card.querySelector('.popup__type');
    card.querySelector('.popup__title').textContent = object.offer.title;
    card.querySelector('.popup__text--address').textContent = object.offer.adress;
    card.querySelector('.popup__text--price').textContent = object.offer.price + ' ₽/ночь';
    typeElement.textContent = OfferTypeMap[object.offer.type.toUpperCase()];
    card.querySelector('.popup__text--capacity').textContent = object.offer.rooms + ' комнаты для ' + object.offer.guests + ' гостей';
    card.querySelector('.popup__text--time').textContent = 'Заезд после ' + object.offer.checkin + ', выезд до ' + object.offer.checkout;
    featuresElement = card.querySelector('.popup__features');
    featuresElement.innerHTML = '';
    object.offer.features.forEach(function (element) {
      featuresElement.appendChild(createFeatureElement(element));
    });

    card.querySelector('.popup__description').textContent = object.offer.description;
    photosElement = card.querySelector('.popup__photos');
    photosElement.innerHTML = '';
    object.offer.photos.forEach(function (element) {
      photosElement.appendChild(createPhotoElement(element));
    });

    card.querySelector('.popup__avatar').src = object.author.avatar;
    card.querySelector('.popup__close').addEventListener('keydown', onEnterClosePopupPress);
    card.querySelector('.popup__close').addEventListener('click', onClickClosePopup);
    document.addEventListener('keydown', onEscClosePopupPress);
    return card;

  };

  var renderOffer = function (evt) {
    var card = mapFiltersContainer.querySelector('.popup');
    if (!card) {
      card = createCard(evt);
      mapFiltersContainer.appendChild(card);
    } else {
      card = createCard(evt);
      card.classList.remove('visually-hidden');
    }
  };

  window.card = {
    onFilterChangeClosePopup: onFilterChangeClosePopup,
    closePopup: closePopup,
    renderOffer: renderOffer,
    onEnterPinPress: onEnterPinPress,
  };
})();
