'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var fileChooser = window.avatarContainer.querySelector('input[type=file]');
  var photoChooser = window.photoContainer.querySelector('input[type=file]');
  photoChooser.setAttribute('multiple', '');

  fileChooser.addEventListener('change', function () {
    var file = fileChooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        window.preview.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  });

  photoChooser.addEventListener('change', function () {
    var photo = photoChooser.files;
    // var reader = [];

    for (var i = 0; i < photo.length; i++) {
      var photoName = photo[i].name.toLowerCase();
      // console.log(photoName);

      var imgElement = document.createElement('img');
      imgElement.src = '';
      imgElement.style.maxWidth = '70px';
      imgElement.style.maxHeight = '70px';

      var matches = FILE_TYPES.some(function (it) {
        return photoName.endsWith(it);
      });

      if (matches) {
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          imgElement.src = reader.result;
        });

        reader.readAsDataURL(photo[i]);
      }
      window.photoContainer.appendChild(imgElement);
    }
  });
})();
