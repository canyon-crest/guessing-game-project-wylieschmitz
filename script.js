// global variables
let level, answer, score, userName;
const levelArr = document.getElementsByName("level");
const scoreArr = [];

// display time
date.textContent = time();

// add event listeners
playBtn.addEventListener("click", play);
guessBtn.addEventListener("click", makeGuess);
giveUp.addEventListener("click", giveUpFunc);
nameBtn.addEventListener("click", enterName);

function enterName(){
    let nameInput = document.getElementById("name").value;
    userName = nameInput.charAt(0).toUpperCase();
    for(let i = 1; i < nameInput.length; i++){
        userName += nameInput.charAt(i).toLowerCase()
    }
}

function play(){
    score = 0; // sets score to 0 every new game
    playBtn.disabled = true;
    guessBtn.disabled = false;
    guess.disabled = false;
    giveUp.disabled = false;
    for(let i = 0; i < levelArr.length; i++){
        if(levelArr[i].checked){
            level = levelArr[i].value;
        }
        levelArr[i].disabled = true;
    }
    msg.innerHTML = "Ready " + userName + "? Guess a number from 1-" + level;
    answer = Math.floor(Math.random()*level)+1;
    guess.placeholder = answer;
}

function makeGuess(){
    let userGuess = parseInt(guess.value);

    if(score == 0){
        var triesString = " try.";
    }
    else{
        triesString = " tries.";
    }

    if(isNaN(userGuess) || userGuess < 1 || userGuess > level){
        msg.textContent = "Enter a VALID number from 1-" + level;
        return;
    }

    score++; // valid guess add 1 to score
    let scoreAssessment;
    if(score == 1){
        scoreAssessment = " That was amazing " + userName + "!"
    }
    else if(level == 10 && score <=3 || level == 100 && score <= 20){
        scoreAssessment = " Pretty good " + userName + "! Want to see if you can do better?"
    }
    else if(level == 3 || level == 10 && score <= 6 || level == 100 && score <= 50){
        scoreAssessment = " That was okay " + userName + ", but I know you can do better."
    }
    else{
        scoreAssessment = " Did you even try " + userName + "?"
    }
    
    if(userGuess < answer){
        msg.textContent = userGuess + " is too low, try again " + userName + ".";
    }
    else if(userGuess > answer){
        msg.textContent = userGuess + " is too high, try again " + userName + ".";
    }
    else{
        msg.textContent = answer + " is correct! It took you " + score + triesString + scoreAssessment + " Press play to play again.";
        updateScore();
        reset();
        return;
    }

    let absDiff = Math.abs(answer - userGuess);
    if(absDiff <= Math.ceil(level/20)){
        msg.textContent += " You are burning hot!";
    }
    else if(absDiff <= Math.ceil(level/4)){
        msg.textContent += " You are warm.";
    }
    else{
        msg.textContent += " You are very cold.";
    }
}

function reset(){
    playBtn.disabled = false;
    guessBtn.disabled = true;
    guess.disabled = true;
    giveUp.disabled = true;
    guess.value = "";
    guess.placeholder = "";
    for(let i = 0; i < levelArr.length; i++){
        levelArr[i].disabled = false;
    }
}

function updateScore(){
    let sum = 0;
    let lb = document.getElementsByName("leaderboard");
    scoreArr.push(score);
    scoreArr.sort((a,b)=>a-b); // sort increasing order
    
    wins.textContent = "Total wins: " + scoreArr.length;

    for(let i = 0; i < scoreArr.length; i++){
        sum += scoreArr[i];
        if(i < lb.length){
            lb[i].textContent = scoreArr[i];
        }
    }

    let avg = sum/scoreArr.length;
    avgScore.textContent = "Average Score: " + avg.toFixed(2);
}

function giveUpFunc(){
    score = level;
    msg.innerHTML = "Don't worry " + userName + ", I'm sure you'll get it next time.";
    reset();
}

function time(){
    let d = new Date();

    let month = d.getMonth()
    switch(month){
        case 0: month = "January"; break;
        case 1: month = "February"; break;
        case 2: month = "March"; break;
        case 3: month = "April"; break;
        case 4: month = "May"; break;
        case 5: month = "June"; break;
        case 6: month = "July"; break;
        case 7: month = "August"; break;
        case 8: month = "September"; break;
        case 9: month = "October"; break;
        case 10: month = "November"; break;
        case 11: month = "December"; break;
    }

    day = d.getDate();
    let suffix;
    if(day >= 4 && day <= 20 || day >= 24 && day <= 30){
        suffix = "th";
    }
    else if(day%10 == 1){
        suffix = "st";
    }
    else if(day%10 == 2){
        suffix = "nd";
    }
    else{
        suffix = "rd";
    }

    let hours = d.getHours();
    ampm = "AM"
    if(hours > 12){
        hours -= 12;
        ampm = "PM"
    }
    if(hours < 10){
        hours = "0" + hours;
    }
    let minutes = d.getMinutes();
    if(minutes < 10){
        minutes = "0" + minutes;
    }
    let seconds = d.getSeconds();
    if(seconds < 10){
        seconds = "0" + seconds;
    }

    let dateInfo = month + " " + day + suffix + ", " + d.getFullYear() + ", " + hours + ":" + minutes + ":" + seconds + " " + ampm;
    return dateInfo;
}