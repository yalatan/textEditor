var app = angular.module('note', ['textAngular']);
app.controller('noteCtrl',
  function noteCtrl($scope, $http) {
    $scope.arrayListTitles = [];
    //textAngular
    $scope.timesSubmitted = 0;
    $scope.testFrm = {};

    $scope.test = function () {
      $scope.timesSubmitted++;
    };

    $scope.accessFormFromScope = function () {
      alert("Form Invalid: " + $scope.testFrm.$invalid);
    };
    //end textAngular


    //получаю данные из json для отображения списка titles       
    $http.get('php/notes.json').then(function (res) {
      $scope.notes = res.data;
    }).catch(function (err) {
      $scope.reqStatus = err.status;
      $scope.reqStatusText = err.statusText;
    });
    ////////////////////
    //добавляю tags на страницу при вводе текста
    $scope.tags = [];
    $scope.text = "";
    $scope.addTags = function (text) {

      function isConsist(text, s) {
        if (text != undefined) {
          //Подготавливаем строку к проверке
          var _text = text.replace(/\n+, <\/\p>, \s+ /g, " "); //Удаляем все переходы на новую строку
          _text = _text.replace(/[\.,\,,\?,\!,\:,\;]+/g, " "); //Удаляем все знаки препинания
          _text = _text.replace(/<p>/g, " "); // Удаляем повторяющиеся пробелы

          _text = _text.split(" ");

          const filterItems = (query) => {
            return _text.filter(function (el) {
                if (el.indexOf(query) > -1) {}
                return el.indexOf(query) > -1
              }

            );
          }
          _text = filterItems(s);
          for (let i = 0; i < _text.length; i++) {
            if (_text[i].indexOf("<") == -1) {
              _text[i] = _text[i].slice(1);
            } else {
              _text[i] = _text[i].slice(1, _text[i].indexOf("<"));

            }
          }
        }
        return _text;
      }

      $scope.tags = isConsist(text, "#");

    };

    //////////////////

    //реализация кнопки - подсветка tags  
    $scope.lightTags = function (tags, text) {
      let repl1 = new RegExp('<span class="lightTag">', 'gi');
      let repl2 = new RegExp('<\/span>', 'gi');
      text = text.replace(repl1, "");
      text = text.replace(repl2, " ");
      for (let i = 0; i < tags.length; i++) {
        var re = new RegExp(tags[i], 'gi');
        var replace = '<span class="lightTag">' + tags[i] + '</span>';
        text = text.replace(re, replace);
        $scope.text = text;
      }
    }

    ////////////////
    //отправка контента на сервер в json   
    let xmlhttp;
    $scope.saveNote = function (title, text, tags) {
      if (title === undefined || "") {
        title = "title"
      };
      let newNote = {
        title: title,
        text: text,
        tags: tags
      }

      let index = -1;
      let indarr=[];
      for (let i = 0; i < $scope.notes.length; i++) {
        if ($scope.notes[i].title === titleOld) {
          index = i;
          indarr.push(index);
        }else
        if ($scope.notes[i].title === title) {
          index = i;
          indarr.push(index);
          break;
        }
      }
      if (indarr.length > 0) {
      for(let q = 0; q < indarr.length; q++){
        if (indarr[q] > -1) {
          $scope.notes.splice(indarr[q], 1, newNote)
        } 
      }
    }
      else {
        $scope.notes.push(newNote);
      }

      if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
      } else { // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
      }
      var myJsonString = JSON.stringify($scope.notes);
      xmlhttp.onreadystatechange = respond;
      xmlhttp.open("POST", "php/file.php", true);
      xmlhttp.send(myJsonString);
    }

    function respond() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {} else {}
    }
    ///////////////////
    let titleOld;
    $scope.showContent = function (titleList) {
      const ind = $scope.notes.map(e => e.title).indexOf(titleList);
      $scope.title = $scope.notes[ind].title;
      $scope.text = $scope.notes[ind].text;
      $scope.tags = $scope.notes[ind].tags;
      titleOld = $scope.title;
    }
    ///////////////////////////
    $scope.clearContent = function (text, title) {
      $scope.text = "";
      $scope.title = "";
      $scope.tags = [];
    };
    /////
    $scope.delete = function (titleList) {
      let index = -1;
      for (let i = 0; i < $scope.notes.length; i++) {
        if ($scope.notes[i].title === titleList) {
          index = i;
          $scope.notes.splice(index, 1)
          break;
        }
      }
      if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
      } else { // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
      }
      var myJsonString = JSON.stringify($scope.notes);
      xmlhttp.onreadystatechange = respond;
      xmlhttp.open("POST", "php/file.php", true);
      xmlhttp.send(myJsonString);
    }

    function respond() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {} else {}
    }
    ///////////////////////
    
  }
);
