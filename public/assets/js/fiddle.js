var cScore;
var gScore;
var uScore;

function getCriticScore(criticScore, cb){
    if (criticScore > 50){
        cScore = criticScore*360/100-180
        $('#criticCircle').text(criticScore+"%")
    }else{
        $('#criticSwitch').text('.progress.critic .progress-right .progress-bar{animation: criticLoad 1.5s linear forwards 1.8s;}');   
        cScore = criticScore*360/100
        $('#criticCircle').text(criticScore+"%")
    }
    cb(cScore)
}

function getGeneralScore(generalScore, cb){
    if (generalScore > 50){
        gScore = generalScore*360/100-180
        $('#generalCircle').text(generalScore+"%")
    }else{
        $('#generalSwitch').text('.progress.general .progress-right .progress-bar{animation: generalLoad 1.5s linear forwards 1.8s;}');   
        gScore = generalScore*360/100
        console.log(gScore)
        $('#generalCircle').text(generalScore+"%")
    }
    cb(cScore)
}

function getUserScore(userScore, cb){
    if (userScore > 50){
        uScore = userScore*360/100-180
        $('#userCircle').text(userScore+"%")
    }else{
        $('#userSwitch').text('.progress.user .progress-right .progress-bar{animation: generalLoad 1.5s linear forwards 1.8s;}');   
        uScore = userScore*360/100
        console.log(uScore)
        $('#userCircle').text(userScore+"%")
    }
    cb(cScore)
}

function changeCritic() {
    $('#criticKeyframe').text('@keyframes criticLoad{0%{-webkit-transform: rotate(0deg);transform: rotate(0deg);}100%{-webkit-transform: rotate('+cScore+'deg);transform: rotate('+cScore+'deg);}}');
}

function changeGeneral() {
    $('#generalKeyframe').text('@keyframes generalLoad{0%{-webkit-transform: rotate(0deg);transform: rotate(0deg);}100%{-webkit-transform: rotate('+gScore+'deg);transform: rotate('+gScore+'deg);}}');
}

function changeUser() {
    $('#userKeyframe').text('@keyframes userLoad{0%{-webkit-transform: rotate(0deg);transform: rotate(0deg);}100%{-webkit-transform: rotate('+uScore+'deg);transform: rotate('+uScore+'deg);}}');
}

$(document).ready(
    getCriticScore(parseFloat($("#criticCircle").attr("score")), changeCritic),
    getGeneralScore(parseFloat($("#generalCircle").attr("score")), changeGeneral),
    getUserScore(parseFloat($("#userCircle").attr("score")), changeUser),
)

$('#searchBlack').keyup(function(e) {
    if (e.which == 13) {
        if ($('#searchBlack').val() !== ''){
            
        }
    }
});
