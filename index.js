class Paddle {
    constructor(loopWidth, loopHeight) {
        this.loopWidth = loopWidth;
        this.loopHeight = loopHeight;
        this.width = 5;
        this.height = loopHeight;

        this.position = {
            x: 0,
            y: 0,
        }
    }

    draw(context){
        context.fillStyle = "grey";
        context.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update(speed, deltaTime){
        this.position.x += (speed / deltaTime);
    }

    getXPos(){
        // This function returns the current x position of the paddle
        return this.position.x;
    }
    getYPos(){
        // This function returns the current x position of the paddle
        return this.position.y;
    }
    contains(coordinate){
        // This function returns tue id the given x coordinate falls within the
        // paddle. Otherwise, false is returned
        if (this.position.x < coordinate && this.position.x + this.width > coordinate) {
            return true;
        }
        return false;
    }
    setPos(xPos, yPos) {
        // This function allows a user to reset the position of the paddle
        this.position.x = xPos;
        this.position.y = yPos;
    }
}

class Note {
    constructor(sound, color, xPos, yPos) {
        this.width = 1;
        this.height = 150;
        this.sound = sound;
        this.color = color;
        this.justPlayed = false;

        this.position = {
            x: xPos,
            y: yPos,
        }
    }

    draw(context){
        context.fillStyle = this.color;
        context.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
    getXPos(){
        // This function returns the current x position of the paddle
        return this.position.x;
    }
    play(){
        // This function plays the sound of the note
        if (this.justPlayed) return;
        this.sound.currentTime = 0;
        this.sound.play();
        createWave(this.color);
        this.justPlayed = true;
    }
    reset() {
        this.justPlayed = false;
    }
}
// class Looper {
//     constructor(loopWidth, loopHeight, canvas){
//         this.width = loopWidth;
//         this.height = loopHeight;
//         this.canvas = canvas;
//         this.context = canvas.getContext("2d");
//         this.paddle = new Paddle (this.width, this.height);
//         this.notes = [];        // an array to hold all of the Note objects
//         //this.time = 0;     // holds the time since the start of the loop
//         this.lastUpdate = 0;    // holds the time of the last update to game objects
//     }

//     playLoop(timestamp) {
//         // This function is responisble for plaing the looper and allowing new recording
//         let deltaTime = timestamp - this.lastUpdate;
//         this.lastUpdate = timestamp;
//         this.updateObjects(deltaTime);
//         this.clearCanvas();
//         this.drawObjects();
//         console.log("second round");
//         requestAnimationFrame(this.playLoop);
        
//     }

//     updateObjects(deltaTime) {
//         // This function updates all objcts inside the looper (i.e. paddle, notes, etc)
//         if (!deltaTime) return;
//         this.paddle.update(deltaTime);
//     }

//     clearCanvas() {
//         // This function clears the canvas and resets any objects which need to be reset
//         this.context.clearRect(0, 0, this.width, this.height);
//     }

//     drawObjects() {
//         // This function draws all objects to the canvas
//         this.paddle.draw(this.context);
//     }
// }
// let canvas = document.getElementById("loopScreen");
// let context = canvas.getContext("2d");

// const LOOP_WIDTH = 500;
// const LOOP_HEIGHT = 150;

// let paddle = new Paddle(LOOP_WIDTH, LOOP_HEIGHT);
// paddle.draw(context);

// function soundLoop() {
//     // clear canvas
//     context.clearRect(0, 0, LOOP_WIDTH, LOOP_HEIGHT)
//     // update paddle
//     paddle.update(time)
// }

function playLoop(timestamp) {
    // This function is responisble for plaing the looper and allowing new recording
    // let deltaTime = timestamp - lastUpdate;
    if (!play) return;
    updateObjects(timestamp - lastUpdate);
    lastUpdate = timestamp;
    clearCanvas();
    drawObjects();
    //console.log(notes)
    requestAnimationFrame(playLoop);
    
}

function updateObjects(deltaTime) {
    // This function updates all objcts inside the looper (i.e. paddle, notes, etc)
    if (!deltaTime) return;

    // update the position of the paddle
    paddle.update(paddleSpeed, deltaTime);

    // play all notes which have just been contacted by the paddle
    for (let i = 0; i < notes.length; i++) {
        if(paddle.contains(notes[i].getXPos())) {
            notes[i].play();
        }
    }

    // play all metronome clicks which have just been contacted by the paddle
    for (let i = 0; i < metronome.length; i++) {
        if(paddle.contains(metronome[i].getXPos())) {
            metronome[i].play();
        }
    }

    // if the paddle has left the looper window, reset the paddle and all the notes
    if (paddle.getXPos() > 300){
        paddle.setPos(0, 0);
        for (let i = 0; i < notes.length; i++) {
            notes[i].reset();
        }
        for (let i = 0; i < metronome.length; i++) {
            metronome[i].reset();
        }
    }
}

function clearCanvas() {
    // This function clears the canvas and resets any objects which need to be reset
    context.clearRect(0, 0, width, height);
}

function drawObjects() {
    // This function draws all objects to the canvas

    // draw the paddle
    paddle.draw(context);

    // draw all notes
    for (let i = 0; i < notes.length; i++) {
        notes[i].draw(context);
    }

    // draw the metronome
    for (let i = 0; i < metronome.length; i++) {
        metronome[i].draw(context);
    }
}

function addNote(sound, color) {
    let sound2 = new Audio(sound.src);
    let newNote = new Note(sound2, color, paddle.getXPos(), paddle.getYPos());
    notes.push(newNote);
}

let play = true;
let width = 500;
let height = 150;
let canvas = document.getElementById("loopScreen");
console.log(canvas.style.width);
let context = canvas.getContext("2d");
let paddle = new Paddle (width, height);
let notes = [];        // an array to hold all of the Note objects
let metronome = [];    // an array to hold the position of the metronome clicks
let lastUpdate = 0;    // holds the time of the last update to game objects
let paddleSpeed = 5;
let savedStates = [[], [], [], [], []]; // holds arrays of notes saved by the user



// create the metronome
for (let i = 0; i <= 300; i++) {
    if (i % 15 == 0) {
        let audio = new Audio('./sounds/click.mp3');
        audio.volume = 0.2;
        metronome.push(new Note(audio, "grey", i, 0));
    }
}
playLoop(0);

let states = document.getElementsByClassName("state");
for (let i = 0; i < states.length; i++) {
    states[i].style.backgroundColor = "white";
    states[i].addEventListener("click", function() {
        if (states[i].style.backgroundColor == "white") {
            // save the current notes in the looper
            savedStates[i] = [...notes];
            // change the color of the button
            states[i].style.backgroundColor = "yellow";
            states[i].innerHTML = "Restore State";
            states[i].style.textAlign = "center";
        }
        else {
            // load the notes from the saved states back into the looper
            notes = [...savedStates[i]];
            // change the color of the button
            states[i].style.backgroundColor = "white";
            states[i].innerHTML = "Save State";
            states[i].style.textAlign = "center";
        }
    });
}

let clearLoop = document.getElementById("clearLoop");
clearLoop.addEventListener('click', function(){
    notes = [];
});

//window.addEventListener('load', () => {
    const sounds = document.querySelectorAll(".sound");
    const pads = document.querySelectorAll(".pad");
    const visual = document.querySelector(".visual");
    const colors = [
        "rgb(58, 173, 58)",
        "rgb(179, 164, 37)",
        "rgb(160, 72, 32)",
        "rgb(175, 40, 47)",
        "rgb(147, 50, 167)",
        "rgb(37, 86, 179)"
    ];
    const volumeRange = document.getElementById("volumeRange");
    const speedRange = document.getElementById("speedRange");

    pads.forEach((pad, index) => {
        pad.addEventListener('click', function() {
                sounds[index].currentTime = 0;
                sounds[index].volume = volumeRange.value / 100;
                sounds[index].playbackRate = speedRange.value / 100;
                sounds[index].play();
                createWave(colors[Math.floor(Math.random() * 6)]);
                addNote(sounds[index], colors[Math.floor(Math.random() * 6)]);
        });
    });
    console.log(visual.style.width);
    const createWave = (color) => {
        for (var i = 0; i < 10; i++){
            const wave = document.createElement("div");
            visual.appendChild(wave);
            wave.style.backgroundColor = color;
            wave.style.left = String(Math.floor(Math.random()*700)) + "px";
            wave.style.animation = 'jump 1s ease';
            wave.addEventListener('animationend', function(){
                visual.removeChild(this);
            });
        }
    }
//});