window.addEventListener('load', () => {
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
                createWave(colors[Math.floor(Math.random() * 7)]);
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
});