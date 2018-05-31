$(document).ready(function() {
  renderObjects(Object.keys(localStorage), 10);
  displayShowMore();

  $('#todo-form').submit(addObject);
  $('#title-input').on('keyup', buttonDisabled);
  $('#body-input').on('keyup', buttonDisabled);
  $('.bottom-box').on('click', '.delete-button', deleteCard);
  $('.bottom-box').on('click', vote);
  $('.bottom-box').on('click', getContentEditIndex);
  $('.bottom-box').on('keydown', function(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      saveEdit(e);
    }
  });
  $('.bottom-box').on('focusout', saveEdit);
  $('#search-input').on('keyup', search);
  $('.bottom-box').on('click', completed);
  $('#show-completed').on('click', showCompleted);
  $('#show-more').on('click', showMore);
  $('.all').on('click', function() {
    renderObjects(Object.keys(localStorage), 10);
  });
  $('.none').on('click', function() {
    showImportance('None');
  });
  $('.low').on('click', function() {
    showImportance('Low');
  });
  $('.normal').on('click', function() {
    showImportance('Normal');
  });
  $('.high').on('click', function() {
    showImportance('High');
  });
  $('.critical').on('click', function() {
    showImportance('Critical');
  });
  $('.bottom-box').on('keydown', characterCount);

  function addObject(e) {
    event.preventDefault();
    if ($('#title-input').val() === '') {
      alert('Missing a title!');
      return;
    }
    if ($('#body-input').val() === '') {
      alert('Missing a body!');
      return;
    }
    if ($('#body-input').val().length >= 120) {
      alert('Sorry, but the max task length is 120 characters!');
      return;
    }
    var object = {
      id: Date.now(),
      title: $('#title-input').val(),
      body: $('#body-input').val(),
      quality: 'None',
      completed: false,
      exempt: false
    };
    localStorage.setItem(object.id, JSON.stringify(object));
    renderObjects(Object.keys(localStorage), 10);
    displayShowMore();
    this.reset();
  }

  function buttonDisabled() {
    if ($('#title-input').val() !== '' || $('#body-input').val() !== '') {
      $('.save-btn').prop('disabled', false);
    } else {
      $('.save-btn').prop('disabled', true);
    }
  }

  function renderObjects(array, displayCount) {
    $('.bottom-box').html('');
    var tenMostRecent = array
      .filter(function(element, index) {
        var firstIndex = array.length - displayCount;
        return index >= firstIndex;
      })
      .map(function(match) {
        if (typeof match !== 'object') {
          match = JSON.parse(localStorage.getItem(match));
        }
        return match;
      });
    tenMostRecent.forEach(function(element) {
      $('.bottom-box').prepend(newCardHTML(element));
    });
  }

  function displayShowMore() {
    if (Object.keys(localStorage).length > 10) {
      $('#show-more').removeClass('display-none');
    }
  }

  function showMore() {
    Object.keys(localStorage)
      .slice(0, Object.keys(localStorage).length - 10)
      .reverse()
      .forEach(function(key) {
        var object = JSON.parse(localStorage.getItem(key));
        $('.bottom-box').append(newCardHTML(object));
      });
  }

  function newCardHTML(todoObject) {
    return `<div data-index="${
      todoObject.id
    }" class="card-container ${todoObject.completed ? 'completed' : ''} ${todoObject.exempt ? 'display-none' : ''} ">
        <h2 contenteditable="true" class="title-of-card">${
          todoObject.title
        }</h2>
        <button class="delete-button"></button>
        <p contenteditable="true" max="50" class="body-of-card">${
          todoObject.body
        }</p>
        <button class="upvote"></button>
        <button class="downvote"></button>
        <p class="quality">quality: <span class="qualityVariable">${
          todoObject.quality
        }</span></p>
        <p class="character-count">Character Count: ${
          todoObject.body.length
        }</p>
        <button id="completed-button" class="completed-button">Completed</button>
        <hr>
      </div>`;
  }

  function deleteCard(e) {
    var cardHTML = $(event.target).closest('.card-container');
    var cardHTMLId = cardHTML[0].dataset.index;
    localStorage.removeItem(`${cardHTMLId}`);
    this.parentElement.remove();
    displayShowMore();
  }

  function vote(e) {
    if (e.target.className === 'upvote' || e.target.className === 'downvote') {
      var qualityElement = $(
        $(event.target)
          .siblings('p.quality')
          .children()[0]
      );
      var index = e.target.parentElement.dataset.index;
      var object = JSON.parse(localStorage.getItem(index));
      var importanceArray = ['None', 'Low', 'Normal', 'High', 'Critical'];
      var importanceIndex = importanceArray.indexOf(object.quality);
    }
    if (
      e.target.className === 'upvote' &&
      importanceIndex < importanceArray.length - 1
    ) {
      importanceIndex++;
      object.quality = importanceArray[importanceIndex];
      localStorage.setItem(object.id, JSON.stringify(object));
      qualityElement.text(object.quality);
      return;
    }
    if (e.target.className === 'downvote' && importanceIndex > 0) {
      importanceIndex--;
      object.quality = importanceArray[importanceIndex];
      localStorage.setItem(object.id, JSON.stringify(object));
      qualityElement.text(object.quality);
      return;
    }
  }

  var contentEditIndex;

  function getContentEditIndex(e) {
    contentEditIndex = e.target.parentElement.dataset.index;
  }

  function saveEdit(e) {
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
    var searchMatches = Object.keys(localStorage).filter(function(key) {
      var object = JSON.parse(localStorage.getItem(key));
      return (
        object.title.includes(searchInput) || object.body.includes(searchInput)
      );
    });
    $('.bottom-box').html('');
    searchMatches.forEach(function(matchId) {
      var object = JSON.parse(localStorage.getItem(matchId));
      $('.bottom-box').prepend(newCardHTML(object));
    });
  }

  function completed(e) {
    if (e.target.className === 'completed-button') {
      var index = e.target.parentElement.dataset.index;
      var object = JSON.parse(localStorage.getItem(index));
      object.completed = !object.completed;
      object.exempt = true;
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
    var completedComboArray = nonCompletedTodos.concat(completedTodos);
    renderObjects(completedComboArray, 10);
  }

  function showImportance(importance) {
    var array = Object.keys(localStorage)
      .filter(function(key) {
        var object = JSON.parse(localStorage.getItem(key));
        return object.quality === importance;
      })
      .map(function(matchId) {
        var object = JSON.parse(localStorage.getItem(matchId));
        return object;
      });

    renderObjects(array, 10);
  }

  function characterCount(e) {
    if (e.target.className === 'body-of-card') {
      var numCharacters = $(e.target).text().length;
      $(e.target).siblings()[5].innerText = `Character Count: ${numCharacters}`;
      if (numCharacters === 120 && event.keyCode != 8) {
        event.preventDefault();
        $(e.target)
          .siblings()[5]
          .classList.add('red-text');
        return;
      }
      $(e.target)
        .siblings()[5]
        .classList.remove('red-text');
    }
  }
});
