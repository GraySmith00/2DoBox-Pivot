$(document).ready(function() {
  // ===================================================================
  // VARIABLES
  // ===================================================================

  renderLocalStorage();

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
      id: Date.now(),
      title: $('#title-input').val(),
      body: $('#body-input').val(),
      quality: 'swill',
      completed: false,
      exempt: false
    };
    $('.bottom-box').prepend(newCardHTML(object, object.id));
    localStorage.setItem(object.id, JSON.stringify(object));
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

  function renderLocalStorage() {
    $('.bottom-box').html('');
    Object.keys(localStorage).forEach(function(key) {
      var object = JSON.parse(localStorage.getItem(key));
      $('.bottom-box').prepend(newCardHTML(object, object.id));
    });
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

  function deleteCard(e) {
    var cardHTML = $(event.target).closest('.card-container');
    var cardHTMLId = cardHTML[0].dataset.index;
    localStorage.removeItem(`${cardHTMLId}`);
    this.parentElement.remove();
  }

  function upVote(e) {
    var qualityElement = $(
      $(event.target)
        .siblings('p.quality')
        .children()[0]
    );
    var currentQuality = qualityElement.text().trim();
    var index = e.target.parentElement.dataset.index;
    var object = JSON.parse(localStorage.getItem(index));
    if (e.target.className === 'upvote') {
      if (currentQuality === 'swill') {
        object.quality = 'plausible';
        localStorage.setItem(object.id, JSON.stringify(object));
        qualityElement.text('plausible');
      } else if (currentQuality === 'plausible') {
        object.quality = 'genius';
        localStorage.setItem(object.id, JSON.stringify(object));
        qualityElement.text('genius');
      }
    }
  }

  function downVote(e) {
    var qualityElement = $(
      $(event.target)
        .siblings('p.quality')
        .children()[0]
    );
    var currentQuality = qualityElement.text().trim();
    var index = e.target.parentElement.dataset.index;
    var object = JSON.parse(localStorage.getItem(index));
    if (e.target.className === 'downvote') {
      if (currentQuality === 'plausible') {
        object.quality = 'swill';
        localStorage.setItem(object.id, JSON.stringify(object));
        qualityElement.text('swill');
      } else if (currentQuality === 'genius') {
        object.quality = 'plausible';
        localStorage.setItem(object.id, JSON.stringify(object));
        qualityElement.text('plausible');
      }
    }
  }

  var contentEditIndex;

  function getContentEditIndex(e) {
    contentEditIndex = e.target.parentElement.dataset.index;
  }

  function saveBodyEdit(e) {
    var object = JSON.parse(localStorage.getItem(contentEditIndex));
    if (e.target.nodeName === 'P') {
      if (object.body !== e.target.innerText) {
        object.body = e.target.innerText;
        localStorage.setItem(object.id, JSON.stringify(object));
      }
    } else if (e.target.nodeName === 'H2') {
      if (object.title !== e.target.innerText) {
        object.title = e.target.innerText;
        localStorage.setItem(object.id, JSON.stringify(object));
      }
    }
  }

  function search() {
    var searchInput = $('#search-input').val();
    // x
    var searchMatches = Object.keys(localStorage).filter(function(key) {
      var object = JSON.parse(localStorage.getItem(key));
      return (
        object.title.includes(searchInput) || object.body.includes(searchInput)
      );
    });
    $('.bottom-box').html('');
    searchMatches.forEach(function(matchId) {
      var object = JSON.parse(localStorage.getItem(matchId));
      $('.bottom-box').prepend(newCardHTML(object, object.id));
    });
  }

  function completed(e) {
    if (e.target.className === 'completed-button') {
      var index = e.target.parentElement.dataset.index;
      var object = JSON.parse(localStorage.getItem(index));
      object.completed = !object.completed;
      object.exempt = !object.exempt;
      localStorage.setItem(object.id, JSON.stringify(object));
      if (object.completed) {
        e.target.parentElement.classList.add('completed');
      } else {
        e.target.parentElement.classList.remove('completed');
      }
    }
  }

  function showCompleted(e) {
    var completedTodos = Object.keys(localStorage)
      .filter(function(key) {
        var object = JSON.parse(localStorage.getItem(key));
        return object.completed;
      })
      .map(function(completedId) {
        var object = JSON.parse(localStorage.getItem(completedId));
        object.exempt = false;
        localStorage.setItem(object.id, JSON.stringify(object));
        return object;
      });

    var nonCompletedTodos = Object.keys(localStorage)
      .filter(function(key) {
        var object = JSON.parse(localStorage.getItem(key));
        return object.completed === false;
      })
      .map(function(matchId) {
        var object = JSON.parse(localStorage.getItem(matchId));
        return object;
      });
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
