var cScore;
var gScore;
var uScore;

function getCriticScore(criticScore, cb) {
    if ((Number.isNaN(criticScore))) {
        $('#criticCircle').text('None')
    }
    else if (criticScore > 50) {
        cScore = criticScore * 360 / 100 - 180
        $('#criticCircle').text(criticScore + "%")
    }
    else {
        $('#criticSwitch').text('.progress.critic .progress-right .progress-bar{animation: criticLoad 1.5s linear forwards 1.8s;}');
        cScore = criticScore * 360 / 100
        $('#criticCircle').text(criticScore + "%")
    }
    cb(cScore)
}

function getGeneralScore(generalScore, cb) {
    if (generalScore > 50) {
        gScore = generalScore * 360 / 100 - 180
        $('#generalCircle').text(generalScore + "%")
    } else {
        $('#generalSwitch').text('.progress.general .progress-right .progress-bar{animation: generalLoad 1.5s linear forwards 1.8s;}');
        gScore = generalScore * 360 / 100
        $('#generalCircle').text(generalScore + "%")
    }
    cb(cScore)
}

function getUserScore(userScore, cb) {
    var testScore = userScore * 2;
    if (Number.isNaN(testScore)) {
        $('#userCircle').text('None')
    } else if (userScore > 50) {
        uScore = userScore * 360 / 100 - 180
        $('#userCircle').text(userScore + "%")
    } else {
        $('#userSwitch').text('.progress.user .progress-right .progress-bar{animation: generalLoad 1.5s linear forwards 1.8s;}');
        uScore = userScore * 360 / 100
        $('#userCircle').text(userScore + "%")
    }
    cb(cScore)
}

function changeCritic() {
    $('#criticKeyframe').text('@keyframes criticLoad{0%{-webkit-transform: rotate(0deg);transform: rotate(0deg);}100%{-webkit-transform: rotate(' + cScore + 'deg);transform: rotate(' + cScore + 'deg);}}');
}

function changeGeneral() {
    $('#generalKeyframe').text('@keyframes generalLoad{0%{-webkit-transform: rotate(0deg);transform: rotate(0deg);}100%{-webkit-transform: rotate(' + gScore + 'deg);transform: rotate(' + gScore + 'deg);}}');
}

function changeUser() {
    $('#userKeyframe').text('@keyframes userLoad{0%{-webkit-transform: rotate(0deg);transform: rotate(0deg);}100%{-webkit-transform: rotate(' + uScore + 'deg);transform: rotate(' + uScore + 'deg);}}');
}

function changeBackground() {
    if ($("#movieColorNeutral").attr("score") > 15) {
        $("#movieColorNeutral").attr("id", "movieColorGood")
    } else if ($("#movieColorNeutral").attr("score") < -15) {
        $("#movieColorNeutral").attr("id", "movieColorBad")
    }
}

$(document).ready(function () {
    $('#searchBlack').val('');
    getCriticScore(parseFloat($("#criticCircle").attr("score")), changeCritic);
    getGeneralScore(parseFloat($("#generalCircle").attr("score")), changeGeneral);
    getUserScore(parseFloat($("#userCircle").attr("score")), changeUser);
    changeBackground();
    if ($("#limitImage").attr("src") == "N/A") {
        $("#limitImage").attr("src", "/images/movieplaceholder.gif")
    }
    if ($(".movieImageCircle").attr("src") == "N/A") {
        $(this).attr("src", "/images/notfoundplaceholder.png")
    }
})

// $(".movieImageCircle").ready(function(){
//     if ($(this).attr("src") == "N/A"){
//         $(this).attr("src", "/images/notfoundplaceholder.png") 
//     }
// })

var bind_to = '#searchBlack';

$(document).on('keyup', bind_to, function (event) {

    event.preventDefault();
    if (event.keyCode == 13) {
        $(document).off('keyup', '#searchBlack');
        var searchTerm = $(this).val().trim()
        if (searchTerm !== '') {
            $("#mainPageSplash").removeClass("rollIn").addClass("spinLoading");
            $(".searchIconNM").addClass("flash");
            // searchTerm = searchTerm.replace(/[`–~!@#$%^&*()_|+\=?;:",.<>\{\}\[\]\\\/]/gi, '');
            // if (searchTerm !== ''){
            var url = '/api/movies?s=' + searchTerm;
            $.get(url).done(function (result) {
                if (result.redirect) {
                    window.location.href = result.redirect;
                    // $.post(url).done(function (data, text) {
                    //     if (data.redirect) {
                    //         window.location.href = data.redirect;
                    //     }
                    //     else {
                    //         alert(`We couldn't find that movie! Please update your search.`);
                    //         $(".searchIconNM").removeClass("flash");
                    //         $("#mainPageSplash").removeClass("spinLoading");
                    //     }
                    // });
                } else {
                    $.post(url).done(function (data, text) {
                        if (data.redirect) {
                            window.location.href = data.redirect;
                        }
                        else {
                            $('.modal-body').html(`<p class="text-center">We couldn't find that movie! Please update your search.</p>`)
                            $('#warningModal').modal({
                                show: true
                            })
                            $(".searchIconNM").removeClass("flash");
                            $("#mainPageSplash").removeClass("spinLoading");
                        }
                    });
                    // alert(`We couldn't find that movie! Please update your search.`);
                    // $(".searchIconNM").removeClass("flash");
                    // $("#mainPageSplash").removeClass("spinLoading");

                }
            })

        }
        $(document).off('keyup', bind_to);
    }
});

function register(event) {
    $(document).off('click', '#registerButton')
    var email = $('#input2EmailForm').val().trim();
    var p1 = $('#input2PasswordForm').val();
    var p2 = $('#input2Password2Form').val();
    if (p1 === p2) {
        event.preventDefault();
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (regex.test(email)) {
            var user = {
                email: $('#input2EmailForm').val().trim(),
                name: {
                    first: $('#firstName').val().trim(),
                    last: $('#lastName').val().trim()
                },
                password: $('#input2PasswordForm').val()
            }
            $.post('/api/users', user, function (results) {
                if (results) {
                    $('.modal-title').text('Success')
                    $('.modal-body').html(`<p class="text-center">You are all signed up!</p>`)
                    $('#warningModal').modal({
                        show: true
                    })
                } else {
                    $('.modal-body').html(`<p class="text-center">It seems like you are already registered on WorthIt!</p>`)
                    $('#warningModal').modal({
                        show: true
                    })
                }
            })
        } else {
            $('.modal-body').html(`<p class="text-center">It seems like you didn't enter a valid email!</p>`)
            $('#warningModal').modal({
                show: true
            })
        }
    } else {
        event.preventDefault();
        $('.modal-body').html(`<p class="text-center">It seems like your passwords do not match!</p>`)
        $('#warningModal').modal({
            show: true
        })
    }
    $(document).on('click', '#registerButton', function (event) { register(event) })
}

$(document).on('click', '#registerButton', function (event) { register(event) })

$(document).on('click', '#loginBtn', function (event) {
    // $(document).off('click', '#loginBtn');
    event.preventDefault();
    var email = $('#email').val().trim();
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    // if (regex.test(email)) {

    $.ajax({
        url: '/login',
        type: 'POST',
        data: {
            email: email,
            password: $('#password').val()
        },
        success: function (response, status) {
            window.location.href = response.redirect;
        },
        error: function (response, status) {
            $('.modal-body').html(`<p class="text-center">It seems like you haven't signed up for an account yet!</p>`)
            $('#warningModal').modal({
                show: true
            })
        }
    })
})

$(document).on('click', '#question1', function (event) {
    event.preventDefault();
    $('#question1').attr('value', 'selected');
    $('#question2').attr('value', '');

})

$(document).on('click', '#question2', function (event) {
    event.preventDefault();
    $('#question1').attr('value', '');
    $('#question2').attr('value', 'selected');

})

$(document).on('click', '.favStar', function (event) {
    $(document).off('click', ".favStar");
    event.preventDefault();
    var movieId = $(this).attr('movie');
    $.ajax({
        url: '/api/users',
        method: 'PUT',
        data: { movieId: movieId }
    }).then(function (data) {
        if (data) {
            $(".favStar").toggleClass('favorited')
        } else {
            $('.modal-body').html(`<p class="text-center">You must be logged in to favorite movies!</p>`)
            $('#warningModal').modal({
                show: true
            })
        }

    })
})

$(document).on('click', '#btn-apple', function (event) {
    $(document).off('click', '#btn-apple');
    event.preventDefault();
    var rating;
    var comment = $('#tallerComments').val().trim();
    if ($('#question1').attr('value') === 'selected') {
        rating = true
    } else if ($('#question2').attr('value') === 'selected') {
        rating = false
    }
    $.ajax({
        url: '/api/ratings',
        method: 'POST',
        data: {
            rating: rating,
            movie_id: $('.favStar').attr('movie'),
            comment: comment
        }
    }).then(function (data) {
        if (data) {
            $(document).off('keyup', bind_to);
            location.reload(true);
        } else {
            $('.modal-body').html(`<p class="text-center">You must be logged in to rate movies!</p>`)
            $('#warningModal').modal({
                show: true
            })
        }
    })

})