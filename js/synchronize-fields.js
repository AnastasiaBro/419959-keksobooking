'use strict';

(function () {
  window.synchronizeFields = function (unchange, change, unchangeValues, changeValues, synchronize) {
    var unchangeValueIndex = unchangeValues.indexOf(unchange.value);
    var syncValue = changeValues[unchangeValueIndex];
    synchronize(change, syncValue);
  };
})();
