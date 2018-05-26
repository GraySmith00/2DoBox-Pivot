$(document).ready(function() {
  // ===================================================================
  // VARIABLES
  // ===================================================================
  var numCards = 0;
  // var qualityVariable = "swill";

  var objects = JSON.parse(localStorage.getItem('objects')) || [];

  renderAllObjects(objects);

  // ===================================================================
  // EVENT LISTENERS
  // ===================================================================
  $('#todo-form').submit(function(event) {
    event.preventDefault();
    if ($('#title-input').val() === '') {
      alert('Missing a title!');
      return;
    }
    if ($('#body-input').val() === '') {
      alert('Missing a body!');
      return;
    }
    var object = {
      id: numCards,
      title: $('#title-input').val(),
      body: $('#body-input').val(),
      quality: 'swill',
      completed: false,
      exempt: false
    };
    objects.push(object);
    numCards++;
    $('.bottom-box').prepend(newCardHTML(object, objects.length - 1));
    localStorage.setItem('objects', JSON.stringify(objects));
    this.reset();
  });

  $('#title-input').on('keyup', buttonDisabled);
  $('#body-input').on('keyup', buttonDisabled);

  $('.bottom-box').on('click', '.delete-button', deleteCard);
  $('.bottom-box').on('click', upVote);
  $('.bottom-box').on('click', downVote);

  $('.bottom-box').on('click', getContentEditIndex);
  $('.bottom-box').on('keydown', function(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      saveBodyEdit(e);
    }
  });
  $('.bottom-box').on('focusout', saveBodyEdit);

  $('#search-input').on('keyup', search);

  $('.bottom-box').on('click', completed);

  $('#show-completed').on('click', showCompleted);

  // ===================================================================
  // FUNCTIONS
  // ===================================================================
  function buttonDisabled() {
    if ($('#title-input').val() !== '' || $('#body-input').val() !== '') {
      $('.save-btn').prop('disabled', false);
    } else {
      $('.save-btn').prop('disabled', true);
    }
  }

  function renderAllObjects(array, array2 = []) {
    $('.bottom-box').html('');
    array.forEach(function(object, i) {
      $('.bottom-box').prepend(newCardHTML(object, i));
    });
    if (array2.length > 0) {
      array2.forEach(function(object, i) {
        $('.bottom-box').prepend(newCardHTML(object, i));
      });
    }
  }

  function deleteCard(e) {
    var index = e.target.parentElement.dataset.index;
    objects.splice(index, 1);
    localStorage.setItem('objects', JSON.stringify(objects));
    renderAllObjects(objects);
    // $(e.target).closest('.card-container').remove();
    //var cardHTML = $(e.target).closest('.card-container').remove();
    // var cardHTMLId = cardHTML[0].id;
    // localStorage.removeItem(cardHTMLId);
  }

  function newCardHTML(todoObject, i) {
    return `<div data-index="${i}" class="card-container ${todoObject.completed ? 'completed' : ''} ${todoObject.exempt ? 'display-none' : ''} ">
        <h2 contenteditable="true" class="title-of-card">${
          todoObject.title
        }</h2>
        <button class="delete-button"></button>
        <p contenteditable="true" class="body-of-card">${todoObject.body}</p>
        <button class="upvote"></button>
        <button class="downvote"></button>
        <p class="quality">quality: <span class="qualityVariable">${
          todoObject.quality
        }</span></p>
        <button class="completed-button">Completed</button>
        <hr>
      </div>`;
  }

  function upVote(e) {
    var currentQuality = $(
      $(event.target)
        .siblings('p.quality')
        .children()[0]
    )
      .text()
      .trim();
    var index = e.target.parentElement.dataset.index;
    if (e.target.className === 'upvote') {
      if (currentQuality === 'swill') {
        objects[index].quality = 'plausible';
        localStorage.setItem('objects', JSON.stringify(objects));
        $(
          $(event.target)
            .siblings('p.quality')
            .children()[0]
        ).text('plausible');
      } else if (currentQuality === 'plausible') {
        objects[index].quality = 'genius';
        localStorage.setItem('objects', JSON.stringify(objects));
        $(
          $(event.target)
            .siblings('p.quality')
            .children()[0]
        ).text('genius');
      }
    }
  }

  function downVote(e) {
    var currentQuality = $(
      $(event.target)
        .siblings('p.quality')
        .children()[0]
    )
      .text()
      .trim();
    var index = e.target.parentElement.dataset.index;
    if (e.target.className === 'downvote') {
      if (currentQuality === 'plausible') {
        objects[index].quality = 'swill';
        localStorage.setItem('objects', JSON.stringify(objects));
        $(
          $(event.target)
            .siblings('p.quality')
            .children()[0]
        ).text('swill');
      } else if (currentQuality === 'genius') {
        objects[index].quality = 'plausible';
        localStorage.setItem('objects', JSON.stringify(objects));
        $(
          $(event.target)
            .siblings('p.quality')
            .children()[0]
        ).text('plausible');
      }
    }
  }

  var contentEditIndex;

  function getContentEditIndex(e) {
    contentEditIndex = e.target.parentElement.dataset.index;
  }

  function saveBodyEdit(e) {
    if (e.target.nodeName === 'P') {
      if (objects[contentEditIndex].body !== e.target.innerText) {
        objects[contentEditIndex].body = e.target.innerText;
        localStorage.setItem('objects', JSON.stringify(objects));
      }
    } else if (e.target.nodeName === 'H2') {
      if (objects[contentEditIndex].title !== e.target.innerText) {
        objects[contentEditIndex].title = e.target.innerText;
        localStorage.setItem('objects', JSON.stringify(objects));
      }
    }
  }

  function search() {
    var searchInput = $('#search-input').val();
    var searchMatches = objects.filter(function(object) {
      return (
        object.title.includes(searchInput) || object.body.includes(searchInput)
      );
    });
    renderAllObjects(searchMatches);
  }

  function completed(e) {
    if (e.target.className === 'completed-button') {
      var index = e.target.parentElement.dataset.index;
      var object = objects[index];
      object.completed = !object.completed;
      object.exempt = !object.exempt;
      localStorage.setItem('objects', JSON.stringify(objects));
      if (object.completed) {
        e.target.parentElement.classList.add('completed');
      } else {
        e.target.parentElement.classList.remove('completed');
      }
    }
  }

  function showCompleted(e) {
    var completedTodos = objects
      .filter(function(object) {
        return object.completed;
      })
      .map(function(todo) {
        todo.exempt = false;
        localStorage.setItem('objects', JSON.stringify(objects));
        return todo;
      });

    var nonCompletedTodos = objects.filter(function(object) {
      return object.completed === false;
    });
    console.log(completedTodos);
    console.log(nonCompletedTodos);
    renderAllObjects(nonCompletedTodos, completedTodos);
  }
}); //close document ready

// $(".bottom-box").on('click', function (event) {
//     var currentQuality = $($(event.target).siblings('p.quality').children()[0]).text().trim();
//     var qualityVariable;

//     if (event.target.className === "upvote" || event.target.className === "downvote") {

//         if (event.target.className === "upvote" && currentQuality === "plausible") {
//             qualityVariable = "genius";
//             $($(event.target).siblings('p.quality').children()[0]).text(qualityVariable);

//         } else if (event.target.className === "upvote" && currentQuality === "swill") {
//             qualityVariable = "plausible";
//             $($(event.target).siblings('p.quality').children()[0]).text(qualityVariable);

//         } else if (event.target.className === "downvote" && currentQuality === "plausible") {
//             qualityVariable = "swill"
//             $($(event.target).siblings('p.quality').children()[0]).text(qualityVariable);

//         } else if (event.target.className === "downvote" && currentQuality === "genius") {
//             qualityVariable = "plausible"
//             $($(event.target).siblings('p.quality').children()[0]).text(qualityVariable);

//         } else if (event.target.className === "downvote" && currentQuality === "swill") {
//             qualityVariable = "swill";

//         } else if (event.target.className === "upvote" && currentQuality === "genius") {
//             qualityVariable = "genius";
//         }

// var cardHTML = $(event.target).closest('.card-container');
// var cardHTMLId = cardHTML[0].id;
// var cardObjectInJSON = localStorage.getItem(cardHTMLId);
// var cardObjectInJS = JSON.parse(cardObjectInJSON);

// cardObjectInJS.quality = qualityVariable;

// var newCardJSON = JSON.stringify(cardObjectInJS);
// localStorage.setItem(cardHTMLId, newCardJSON);
//     }

// });

// ===================================================================
// GRAVEYARD
// ===================================================================

// function displayLocalStorage() {
//     for (var i = 0; i < localStorage.length; i++){
//         var key = localStorage.key(i);
//         var localStorageItem = JSON.parse(localStorage.getItem(key));
//         $(".bottom-box").prepend(newCardHTML(localStorageItem));
//     }
// }

// function localStoreCard(todoObject) {
//     var cardString = JSON.stringify(todoObject);
//     localStorage.setItem('card', cardString);
// }

// function cardObject() {
//     return {
//         title: $('#title-input').val(),
//         body: $('#body-input').val(),
//         quality: qualityVariable
//     };
// }

// $.each(localStorage, function (key) {
//     var cardData = JSON.parse(this);
//     numCards++;
//     $(".bottom-box").prepend(newCardHTML(key, cardData.title, cardData.body, cardData.quality));
// });
