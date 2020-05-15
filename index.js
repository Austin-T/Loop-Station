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

    pads.forEach((pad, index) => {
        pad.addEventListener('click', function() {
                sounds[index].currentTime = 0;
                sounds[index].play();
                createBubbles();
        });
    });

    const createBubbles = () => {
        const bubble = document.createElement("div");
        visual.appendChild(bubble);
        bubble.style.backgroundColor = "white";
        bubble.style.animation = 'jump 1s ease';
        bubble.addEventListener('animationend', function(){
            visual.removeChild(this);
        });
    }
});