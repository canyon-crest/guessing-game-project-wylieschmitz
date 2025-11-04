// global variables
let level, answer, score;
const levelArr = document.getElementsByName("level");
const scoreArr = [];

// display time
date.textContent = time();

// add event listeners
playBtn.addEventListener("click", play);
guessBtn.addEventListener("click", makeGuess);

function play(){
    score = 0; // sets score to 0 every new game
    playBtn.disabled = true;
    guessBtn.disabled = false;
    guess.disabled = false;
    for(let i = 0; i < levelArr.length; i++){
        if(levelArr[i].checked){
            level = levelArr[i].value;
        }
        levelArr[i].disabled = true;
    }
    msg.innerHTML = "Guess a number from 1-" + level;
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
    
    if(userGuess < answer){
        msg.textContent = userGuess + " is too low, try again.";
    }
    else if(userGuess > answer){
        msg.textContent = userGuess + " is too high, try again.";
    }
    else{
        msg.textContent = answer + " is correct! It took you " + score + triesString + " Press play to play again.";
        updateScore();
        reset();
    }
}

function reset(){
    playBtn.disabled = false;
    guessBtn.disabled = true;
    guess.disabled = true;
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

function time(){
    let d = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
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
    if(d.getHours() < 10){
        hours = "0" + d.getHours();
    }
    let minutes = d.getMinutes();
    if(d.getMinutes() < 10){
        minutes = "0" + d.getMinutes();
    }
    let seconds = d.getSeconds();
    if(d.getSeconds() < 10){
        seconds = "0" + d.getSeconds();
    }
    // concatenate a string with all the date info...
    let dateInfo = months[d.getMonth()] + " " + day + suffix + ", " + d.getFullYear() + ", " + hours + ":" + minutes + ":" + seconds;
    return dateInfo;
}