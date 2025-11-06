// global variables
let level, answer, score, userName, startMs, gameTimeInterval;
const levelArr = document.getElementsByName("level");
const modeArr = document.getElementsByName("mode");
let gameMode;
let timeAttackTimer;
let timeAttackRemaining;
const TIME_ATTACK_DURATION = 15; // seconds
const scoreArr = [];
const timeArr = [];

// display time: run once immediately, then update every second
time();
setInterval(time, 1000);


// add event listeners
playBtn.addEventListener("click", startCountdown);
guessBtn.addEventListener("click", makeGuess);
giveUpBtn.addEventListener("click", giveUpFunc);
nameBtn.addEventListener("click", enterName);

// Keyboard shortcuts
// Enter: submit name (if name field focused) or make a guess
// P: start play (starts countdown)
// Escape: give up (only when give up is enabled)
document.addEventListener('keydown', function(e){
    const active = document.activeElement;
    const tag = active && active.tagName ? active.tagName.toLowerCase() : '';

    if(e.key === 'Enter'){
        // If the user is typing their name and presses Enter, submit the name
        if(tag === 'input' && active.id === 'name'){
            enterName();
            return;
        }
        // Otherwise, attempt to make a guess if guessing is enabled
        if(typeof guessBtn !== 'undefined' && !guessBtn.disabled){
            makeGuess();
        }
    }

    if(e.key === 'p' || e.key === 'P'){
            // Avoid triggering while typing in text inputs/textareas, but allow
            // radio buttons and other non-typing inputs so clicking a radio
            // doesn't block the shortcut.
            const activeType = (active && active.type) ? active.type.toLowerCase() : '';
            const isTypingField = tag === 'textarea' || active.isContentEditable || (
                tag === 'input' && ['text','password','search','tel','url','email','number'].includes(activeType)
            );
            if(!isTypingField && !playBtn.disabled){
            startCountdown();
        }
    }

    if(e.key === 'Escape' && !guessBtn.disabled){
        if(typeof giveUpBtn !== 'undefined' && !giveUpBtn.disabled){
            giveUpFunc();
        }
    }
});

function enterName(){
    let nameInput = document.getElementById("name").value;
    userName = nameInput.charAt(0).toUpperCase();
    for(let i = 1; i < nameInput.length; i++){
        userName += nameInput.charAt(i).toLowerCase()
    }
}

function play(){
    score = 0; // sets score to 0 every new game
    startMs = new Date().getTime();

    playBtn.disabled = true;
    guessBtn.disabled = false;
    guess.disabled = false;
    giveUpBtn.disabled = false;

    for(let i = 0; i < levelArr.length; i++){
        if(levelArr[i].checked){
            level = levelArr[i].value;
        }
        levelArr[i].disabled = true;
    }

    msg.innerHTML = "Ready " + userName + "? Guess a number from 1-" + level;
    answer = Math.floor(Math.random()*level)+1;

    // determine selected mode (normal or time-attack)
    gameMode = 'normal';
    for(let i = 0; i < modeArr.length; i++){
        if(modeArr[i].checked){
            gameMode = modeArr[i].value;
        }
    }

    // start timers depending on mode
    if(gameMode === 'time-attack'){
        // time-attack: countdown from TIME_ATTACK_DURATION using precise milliseconds
        currentGameTime.textContent = "Time left: " + TIME_ATTACK_DURATION.toFixed(2) + "s";
        timeAttackTimer = setInterval(()=>{
            const elapsed = (new Date().getTime() - startMs) / 1000;
            const remaining = Math.max(0, TIME_ATTACK_DURATION - elapsed);
            currentGameTime.textContent = "Time left: " + remaining.toFixed(2) + "s";
            if(remaining <= 0){
                clearInterval(timeAttackTimer);
                // behave like give up when time expires
                score = level;
                msg.innerHTML = "Time's up! Don't worry " + userName + ", I'm sure you'll get it next time.";
                reset();
                return;
            }
        }, 50);
    } else {
        // normal mode: show elapsed time with millisecond precision
        gameTimeInterval = setInterval(function(){
            let timeElapsed = new Date().getTime() - startMs;
            currentGameTime.textContent = "Time: " + (timeElapsed/1000).toFixed(2) + "s";
        }, 50);
    }
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
        updateTimers(new Date().getTime());
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
    giveUpBtn.disabled = true;
    guess.value = "";
    clearInterval(gameTimeInterval);
    clearInterval(timeAttackTimer);
    for(let i = 0; i < levelArr.length; i++){
        levelArr[i].disabled = false;
    }
}

function updateScore(){
    let scoreSum = 0;
    let lb = document.getElementsByName("leaderboard");
    scoreArr.push(score);
    scoreArr.sort((a,b)=>a-b); // sort increasing order
    
    wins.textContent = "Total wins: " + scoreArr.length;

    for(let i = 0; i < scoreArr.length; i++){
        scoreSum += scoreArr[i];
        if(i < lb.length){
            lb[i].textContent = scoreArr[i];
        }
    }

    let avgScoreValue = scoreSum/scoreArr.length;
    avgScore.textContent = "Average Score: " + avgScoreValue.toFixed(2);
}

function updateTimers(endMs){
    clearInterval(gameTimeInterval);
    clearInterval(timeAttackTimer);

    let gameTime = (endMs - startMs)/1000;
    timeArr.push(gameTime);
    timeArr.sort((a,b)=>a-b);

    fastest.textContent = "Fastest game: " + timeArr[0].toFixed(3) + "s";

    let timeSum = 0;
    for(let i = 0; i < timeArr.length; i++){
        timeSum += timeArr[i];
    }

    let avgTimeValue = timeSum/timeArr.length;
    avgTime.textContent = "Average Time: " + avgTimeValue.toFixed(3) + "s";
}

function giveUpFunc(){
    score = level;
    msg.innerHTML = "Don't worry " + userName + ", I'm sure you'll get it next time.";
    reset();
}

function startCountdown(){
    // prevent starting if already disabled
    if(playBtn.disabled) return;
    playBtn.disabled = true; // temporarily disable
    const countdownEl = document.getElementById('countdown');

    let count = 3;
    countdownEl.textContent = count;
    countdownEl.classList.add('show','pop');

    const tick = setInterval(()=>{
        count--;
        if(count > 0){
            // update number and retrigger pop animation
            countdownEl.textContent = count;
            countdownEl.classList.remove('pop');
            // force reflow to restart animation
            void countdownEl.offsetWidth;
            countdownEl.classList.add('pop');
        } else {
            clearInterval(tick);
            // hide countdown then start the game
            countdownEl.classList.remove('pop');
            countdownEl.classList.remove('show');
            countdownEl.textContent = '';
            // call existing play logic
            play();
        }
    }, 1000);
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

    date.textContent = month + " " + day + suffix + ", " + d.getFullYear() + ", " + hours + ":" + minutes + ":" + seconds + " " + ampm;
}