// document.addEventListener('DOMContentLoaded', function () {
// const balloonContainer = document.getElementById('balloon-container');

// const balloonImage = [
//     "src/pink.png",
//     "src/red.png",
//     "src/yellow.png",
//     "src/green.png",
// ]


// function startBalloons() {
//     setTimeout(() => {
//         const img = document.createElement('img');
//         const randomIndex = Math.floor(Math.random() * balloonImage.length);
//         img.src = balloon(randomIndex);
//         img.classList.add("balloon");
//         img.style.left = Math.random() * 100 + "%";
//         balloonContainer.appendChild(img);
//         balloonContainer.removeChild(img)
//     }, 250);
// }

// startBalloons();

    const balloonContainer = document.getElementById('balloon-container');
    let balloonInterval;

    function startBalloons() {
        balloonInterval = setInterval(() => {
            const colors = ['red', 'pink', 'green', 'yellow', 'golden'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const balloon = document.createElement('img');
            balloon.src = `src/${color}.png`;
            balloon.style.left = Math.random() * 100 + '%';
            balloonContainer.appendChild(balloon);
            balloon.style.backgroundColor = "red"
            balloon.addEventListener('animationend', () => balloon.remove());
        }, 250);
    }

    startBalloons()