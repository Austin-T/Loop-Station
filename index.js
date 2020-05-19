// Classes

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
    getXPosAfter(){
        // This function returnt the x position of the leading edge of the paddle
        return this.position.x + this.width;
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

// Functions

function playLoop(timestamp) {
    // This function is responisble for plaing the looper and allowing new recording
    // let deltaTime = timestamp - lastUpdate;
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
    if (!play) return;
    // update the position of the paddle
    paddle.update(tempoRange.value, deltaTime);

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
    if (!play) return;
    let sound2 = new Audio(sound.src);
    let newNote = new Note(sound2, color, paddle.getXPosAfter(), paddle.getYPos());
    notes.push(newNote);
}

function createMetronome(beats) {
    for (let i = 0; i <= beats; i++) {
        let audio = new Audio('./sounds/click.mp3');
        audio.volume = 0.2;
        metronome.push(new Note(audio, "grey", (i + 1) * (300 / beats), 0));
    }
}

function createWave(color) {
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

// Global variables

const canvas = document.getElementById("loopScreen");
const context = canvas.getContext("2d");
const sounds = document.getElementsByClassName("sound");
const pads = document.getElementsByClassName("pad");
const visual = document.getElementById("visual");
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
const tempoRange = document.getElementById("tempoRange");
const states = document.getElementsByClassName("state");
const metronomebtn = document.getElementById("metronome");
const playbtn = document.getElementById("play");
const clearLoop = document.getElementById("clearLoop");

playbtn.style.backgroundColor = "white";
metronomebtn.style.backgroundColor = "rgb(37, 86, 179)";

let play = false;
let width = 500;
let height = 150;
let paddle = new Paddle (width, height);
let notes = [];        // an array to hold all of the Note objects
let metronome = [];    // an array to hold the position of the metronome clicks
let lastUpdate = 0;    // holds the time of the last update to game objects
let savedStates = [[], [], [], [], []]; // holds arrays of notes saved by the user

// Event Listeners

for (let i = 0; i < states.length; i++) {
    states[i].style.backgroundColor = "white";
    states[i].addEventListener("click", function() {
        if (states[i].style.backgroundColor == "white") {
            // save the current notes in the looper
            savedStates[i] = [...notes];
            // change the color of the button
            states[i].style.backgroundColor = "rgb(58, 173, 58)";
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

playbtn.addEventListener("click", function() {
    if (this.style.backgroundColor == "white") {
        this.style.backgroundColor = "rgb(37, 86, 179)";
        play = true;
    }
    else {
        this.style.backgroundColor = "white";
        play = false;
    }
});

metronomebtn.addEventListener("click", function() {
    if (this.style.backgroundColor == "white") {
        this.style.backgroundColor = "rgb(37, 86, 179)";
        createMetronome(8);
    }
    else {
        this.style.backgroundColor = "white";
        metronome = [];
    }
});

clearLoop.addEventListener('click', function(){
    notes = [];
});

for (let i = 0; i < pads.length; i++) {
    pads[i].style.backgroundColor = colors[Math.floor(i / 4)];
    pads[i].addEventListener('click', function() {
            sounds[i].currentTime = 0;
            sounds[i].volume = volumeRange.value / 100;
            sounds[i].playbackRate = speedRange.value / 100;
            sounds[i].play();
            createWave(pads[i].style.backgroundColor);
            addNote(sounds[i], pads[i].style.backgroundColor);
    });
}

window.addEventListener('load', function() {
    const preload = document.getElementById("preload");
    preload.classList.add("preload-finish");
});

// Function calls

createMetronome(8);
playLoop(0);