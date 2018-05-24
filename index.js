var titleInput = $('#title-input');
var bodyInput = $('#body-input');
var numCards = 0;
var qualityVariable = "swill";

$('#todo-form').submit(function (event) {
    event.preventDefault();
    if ($('#title-input').val() === "" || $('#body-input').val() === "") {
        alert('Missing some inputs!');
        return;
    };
    var todo = {
        id: numCards,
        title: titleInput.val(),
        body: bodyInput.val(),
        quality: 'swill'
    }
    numCards++;
    $(".bottom-box").prepend(newCardHTML(todo));
    localStorage.setItem('todo' + numCards, JSON.stringify(todo));
    this.reset();
});

function newCardHTML(todoObject) {
    return '<div id="' + todoObject.id + '"class="card-container"><h2 class="title-of-card">'
        + todoObject.title + '</h2>'
        + '<button class="delete-button"></button>'
        + '<p class="body-of-card">'
        + todoObject.body + '</p>'
        + '<button class="upvote"></button>'
        + '<button class="downvote"></button>'
        + '<p class="quality">' + 'quality:' + '<span class="qualityVariable">' + todoObject.quality + '</span>' + '</p>'
        + '<hr>'
        + '</div>';
};





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





$(".bottom-box").on('click', function (event) {
    var currentQuality = $($(event.target).siblings('p.quality').children()[0]).text().trim();
    var qualityVariable;

    if (event.target.className === "upvote" || event.target.className === "downvote") {

        if (event.target.className === "upvote" && currentQuality === "plausible") {
            qualityVariable = "genius";
            $($(event.target).siblings('p.quality').children()[0]).text(qualityVariable);

        } else if (event.target.className === "upvote" && currentQuality === "swill") {
            qualityVariable = "plausible";
            $($(event.target).siblings('p.quality').children()[0]).text(qualityVariable);

        } else if (event.target.className === "downvote" && currentQuality === "plausible") {
            qualityVariable = "swill"
            $($(event.target).siblings('p.quality').children()[0]).text(qualityVariable);

        } else if (event.target.className === "downvote" && currentQuality === "genius") {
            qualityVariable = "plausible"
            $($(event.target).siblings('p.quality').children()[0]).text(qualityVariable);

        } else if (event.target.className === "downvote" && currentQuality === "swill") {
            qualityVariable = "swill";

        } else if (event.target.className === "upvote" && currentQuality === "genius") {
            qualityVariable = "genius";
        }

        var cardHTML = $(event.target).closest('.card-container');
        var cardHTMLId = cardHTML[0].id;
        var cardObjectInJSON = localStorage.getItem(cardHTMLId);
        var cardObjectInJS = JSON.parse(cardObjectInJSON);

        cardObjectInJS.quality = qualityVariable;

        var newCardJSON = JSON.stringify(cardObjectInJS);
        localStorage.setItem(cardHTMLId, newCardJSON);
    }

    else if (event.target.className === "delete-button") {
        var cardHTML = $(event.target).closest('.card-container').remove();
        var cardHTMLId = cardHTML[0].id;
        localStorage.removeItem(cardHTMLId);
    }
});











