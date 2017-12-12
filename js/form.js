'use strict';

(function () {
  var price = window.mapForm.querySelector('#price');
  var title = window.mapForm.querySelector('#title');
  var type = window.mapForm.querySelector('#type');
  var room = window.mapForm.querySelector('#room_number');
  var capacity = window.mapForm.querySelector('#capacity');
  var submit = window.mapForm.querySelector('.form__submit');
  var minPrices = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };

  function checkCorrectData() {
    window.address.setAttribute('readOnly', '');
    window.address.setAttribute('required', '');
    window.address.addEventListener('invalid', function () {
      return (window.address.validity.valueMissing === true ? window.address.setCustomValidity('Обязательное поле') : window.address.setCustomValidity(''));
    });

    title.setAttribute('minlength', '30');
    title.setAttribute('maxlength', '100');
    title.setAttribute('required', '');

    title.addEventListener('invalid', function () {
      if (title.validity.tooShort) {
        title.setCustomValidity('Заголовок должен состоять минимум из 30 символов');
      } else if (title.validity.tooLong) {
        title.setCustomValidity('Заголовок не должен превышать 100 символов');
      } else if (title.validity.valueMissing) {
        title.setCustomValidity('Обязательное поле');
      } else {
        title.setCustomValidity('');
      }
    });

    title.addEventListener('input', function (evt) {
      var target = evt.target;
      if (target.value.length < 30) {
        target.setCustomValidity('Заголовок должен состоять минимум из 30 символов');
      } else {
        target.setCustomValidity('');
      }
    });

    price.setAttribute('type', 'number');
    price.setAttribute('value', '1000');
    price.setAttribute('min', '0');
    price.setAttribute('max', '1000000');
    price.setAttribute('required', '');

    price.addEventListener('input', function () {
      if (price.validity.rangeUnderflow) {
        price.setCustomValidity('Цена должна быть не меньше ' + minPrices[type.options[type.selectedIndex].value] + ' руб.');
      } else if (price.validity.rangeOverflow) {
        price.setCustomValidity('Цена должна быть не больше 1 000 000 руб.');
      } else if (price.validity.valueMissing) {
        price.setCustomValidity('Обязательное поле');
      } else {
        price.setCustomValidity('');
      }
    });
  }
  checkCorrectData();

  // --------------------------------------------------------------------- //

  var timein = window.mapForm.querySelector('#timein');
  var timeout = window.mapForm.querySelector('#timeout');
  var timeinArray = ['12:00', '13:00', '14:00'];
  var timeoutArray = ['12:00', '13:00', '14:00'];

  function onTimeInChange() {
    function syncValues(element, value) {
      element.value = value;
    }
    window.synchronizeFields(timein, timeout, timeinArray, timeoutArray, syncValues);
  }

  function onTimeOutChange() {
    function syncValues(element, value) {
      element.value = value;
    }
    window.synchronizeFields(timeout, timein, timeoutArray, timeinArray, syncValues);
  }

  timein.addEventListener('change', onTimeInChange);
  timeout.addEventListener('change', onTimeOutChange);

  /*
  function onGuestInputChange() {
    var count = ['1 комната', '2 комнаты', '100 комнат'];
    var guests = ['не для гостей', 'для 3 гостей', 'для 3 гостей'];
    var roomsDropDown = window.mapForm.querySelector('#room_number');
    var guestsDropDown = window.mapForm.querySelector('#capacity');

    function syncValues(field, value) {
      for (var i = 0; i < field.options.length; i++) {
        if (field.options[i].text === value) {
          field.options[i].selected = true;
          return;
        }
      }
    }

    window.synchronizeFields(roomsDropDown, guestsDropDown, count, guests, syncValues);
  }

  function onPriceInputChange() {
    var types = ['Квартира', 'Лачуга', 'Дом', 'Дворец'];
    var prices = [1000, 0, 5000, 10000];
    var typeDropDown = window.mapForm.querySelector('#type');
    var priceDropDown = window.mapForm.querySelector('#price');

    function syncValues(field, value) {
      field.value = value;
      field.min = value;
    }

    window.synchronizeFields(typeDropDown, priceDropDown, types, prices, syncValues);
  }*/

  // ---------------------мой код---------------------------------- //
  /*
  function synchronizeData() {
    var timein = window.mapForm.querySelector('#timein');
    var timeout = window.mapForm.querySelector('#timeout');

    timein.addEventListener('change', function () {
      timeout.selectedIndex = timein.selectedIndex;
    });

    timeout.addEventListener('change', function () {
      timein.selectedIndex = timeout.selectedIndex;
    });
  }
  synchronizeData();
  */

  function setSynchronizeForDefault() {
    if (type.querySelectorAll('option')[0].selected === true) {
      onPriceInputChange();
    }
    if (room.querySelectorAll('option')[0].selected === true) {
      onGuestInputChange();
    }
  }
  setSynchronizeForDefault();

  type.addEventListener('change', onPriceInputChange);
  room.addEventListener('change', onGuestInputChange);

  function onPriceInputChange() {
    price.setAttribute('min', minPrices[type.options[type.selectedIndex].value]);
  }

  function onGuestInputChange() {
    setAllOptions(window.OPTION_GUESTS_COUNT);
    switch (room.value) {
      case '1':
        capacity.querySelectorAll('option')[0].classList.add('hidden');
        capacity.querySelectorAll('option')[1].classList.add('hidden');
        capacity.querySelectorAll('option')[3].classList.add('hidden');
        capacity.querySelectorAll('option')[2].setAttribute('selected', '');
        break;
      case '2':
        capacity.querySelectorAll('option')[0].classList.add('hidden');
        capacity.querySelectorAll('option')[3].classList.add('hidden');
        capacity.querySelectorAll('option')[1].setAttribute('selected', '');
        break;
      case '3':
        capacity.querySelectorAll('option')[3].classList.add('hidden');
        capacity.querySelectorAll('option')[0].setAttribute('selected', '');
        break;
      case '100':
        capacity.querySelectorAll('option')[0].classList.add('hidden');
        capacity.querySelectorAll('option')[1].classList.add('hidden');
        capacity.querySelectorAll('option')[2].classList.add('hidden');
        capacity.querySelectorAll('option')[3].setAttribute('selected', '');
        break;
    }
  }

  function setAllOptions(count) {
    for (var i = 0; i < count; i++) {
      if (capacity.querySelectorAll('option')[i].getAttribute('class', 'hidden')) {
        capacity.querySelectorAll('option')[i].classList.remove('hidden');
      }
      if (capacity.querySelectorAll('option')[i].selected === true) {
        capacity.querySelectorAll('option')[i].removeAttribute('selected');
      }
    }
  }

  window.mapForm.setAttribute('action', 'https://js.dump.academy/keksobooking');

  submit.addEventListener('click', onSubmitClick);

  function onSubmitClick() {
    checkBeforeSending();
  }

  function checkBeforeSending() {
    var allInputs = window.mapForm.querySelectorAll('input');
    var allSelects = window.mapForm.querySelectorAll('select');
    checkForm(allInputs);
    checkForm(allSelects);
  }

  function checkForm(formElements) {
    for (var i = 0; i < formElements.length; i++) {
      if (!formElements[i].validity.valid) {
        formElements[i].setAttribute('style', 'border: 2px solid red;');
      } else {
        formElements[i].removeAttribute('style');
      }
    }
  }
})();
