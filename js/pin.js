'use strict';
(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  function createFragment(arr) {
    var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
    var fragment = document.createDocumentFragment();

    arr.forEach(function (elem) {
      var offerEl = pinTemplate.cloneNode(true);
      offerEl.style.left = elem.location.x - PIN_WIDTH / 2 + 'px';
      offerEl.style.top = elem.location.y - PIN_HEIGHT + 'px';
      offerEl.firstChild.src = elem.author.avatar;
      offerEl.firstChild.alt = elem.offer.title;
      offerEl.setAttribute('data-id', elem.offer.id);
      offerEl.addEventListener('keydown', window.card.onEnterPinPress);
      offerEl.addEventListener('click', window.card.renderCard);
      fragment.appendChild(offerEl);
    });

    return fragment;
  }
  window.pin = {
    createFragment: createFragment,
  };
})();
