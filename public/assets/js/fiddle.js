var cScore;
var gScore;
var uScore;

function getCriticScore(criticScore, cb) {
    if (criticScore > 50) {
        cScore = criticScore * 360 / 100 - 180
        $('#criticCircle').text(criticScore + "%")
    } else {
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
        console.log(gScore)
        $('#generalCircle').text(generalScore + "%")
    }
    cb(cScore)
}

function getUserScore(userScore, cb) {
    console.log(typeof userScore * 2)
    var testScore = userScore * 2;
    if (Number.isNaN(testScore)) {
        $('#userCircle').text('None')
    } else if (userScore > 50) {
        uScore = userScore * 360 / 100 - 180
        $('#userCircle').text(userScore + "%")
    } else {
        $('#userSwitch').text('.progress.user .progress-right .progress-bar{animation: generalLoad 1.5s linear forwards 1.8s;}');
        uScore = userScore * 360 / 100
        console.log(uScore)
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

$(document).ready(function () {
    console.log(window.location.pathname);
    $('#searchBlack').val('');
    getCriticScore(parseFloat($("#criticCircle").attr("score")), changeCritic);
    getGeneralScore(parseFloat($("#generalCircle").attr("score")), changeGeneral);
    getUserScore(parseFloat($("#userCircle").attr("score")), changeUser);
    if ($("#limitImage").attr("src") == "N/A"){
        $("#limitImage").attr("src", "/images/movieplaceholder.gif") 
    }
}
)

var bind_to = '#searchBlack';

$(document).on('keyup', bind_to, function (event) {
    event.preventDefault();
    console.log(event)
    if (event.keyCode == 13) {
        var searchTerm = $(this).val().trim()
        if (searchTerm !== '') {
            searchTerm = searchTerm.replace(/[`–~!@#$%^&*()_|+\=?;:",.<>\{\}\[\]\\\/]/gi, '');
            console.log(searchTerm)
            // if (searchTerm !== ''){
            var url = '/api/movies?s=' + searchTerm;
            $.get(url).done(function (result) {
                if (!result) {
                    $.post(url).done(function (data, text) {
                        console.log(data);
                        console.log(text);
                        if (data.redirect) {
                            window.location.href = data.redirect;
                        }
                        else {
                            alert(`We couldn't find that movie! Please update your search.`)
                        }
                    });
                } else {
                    if (result.redirect) {
                        window.location.href = result.redirect;
                    }
                    else {
                        alert(`We couldn't find that movie! Please update your search.`)
                    }
                }
            })

        }
        $(document).off('keyup', bind_to);
    }
});

$(document).on(`focusout`, bind_to, function (event) {
    $('#searchBlack').val('');
})

$(document).on('click', '#registerButton', function (event) {
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
                alert('Success!')
            })
        } else {
            alert('Invalid email!')
        }
    } else {
        alert('Passwords do not match!')
    }
})

$(document).on('click', '#loginBtn', function (event) {
    event.preventDefault();
    console.log(event)
    var email = $('#email').val().trim();
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    // if (regex.test(email)) {
        $.post('/login', {email: email,
            password: $('#password').val()}).then(function(data){
                window.location.href = data.redirect;
            })
    // } else {
        // alert('Invalid email or password!')
    // }
})

$(document).on('click', '.favStar', function (event) {
    event.preventDefault();
    var movieId = $(this).attr('movie');
    console.log(event)
       $.ajax({
           url: '/api/users',
           method: 'PUT', 
           data: {movieId: movieId}
       }).then(function(data){
           if (data) {
             $(this).toggleClass('favorited')
               alert('success')
           } else {
               alert('must be logged in to do that')
           }
       })
    // $.post('/login', {email: email,
    //         password: $('#password').val()}).then(function(data){
    //             window.location.href = data.redirect;
    //         })
})

// $(document).on('click', '#question1', function (event) {
//     event.preventDefault();
//     var movieId = $(this).attr('movie');
//     console.log(event)
//        $.ajax({
//            url: '/api/users',
//            method: 'PUT', 
//            data: {movieId: movieId}
//        }).then(function(data){
//            if (data) {
//              $(this).toggleClass('favorited')
//                alert('success')
//            } else {
//                alert('You must be logged in to rate a movie!')
//            }
//        })
//     // $.post('/login', {email: email,
//     //         password: $('#password').val()}).then(function(data){
//     //             window.location.href = data.redirect;
//     //         })
// })