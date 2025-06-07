document.addEventListener('DOMContentLoaded', function() {
  const gameRulesLink = document.querySelector('a[href="#gameRuleSection"]');
  const gameRuleSection = document.getElementById('gameRuleSection');

  if (gameRulesLink && gameRuleSection) {
    gameRulesLink.addEventListener('click', function(event) {
      event.preventDefault(); // Default jump ko rok do
      gameRuleSection.scrollIntoView({ behavior: 'smooth' }); // Smooth scroll
    });
  }

  // Contact Us scroll logic
  const contactLink = document.querySelector('a[href="#contactSection"]');
  const contactSection = document.getElementById('contactSection');

  if (contactLink && contactSection) {
    contactLink.addEventListener('click', function(event) {
      event.preventDefault();
      contactSection.scrollIntoView({ behavior: 'smooth' });
    });
  }
});

// Rock Paper Scissors Game Logic
let myScore = 0;
let computerScore = 0;
let gameActive = false;

const playNowBtn = document.getElementById('playNowBtn');
const myScoreSpan = document.getElementById('myScore');
const computerScoreSpan = document.getElementById('computerScore');
const choiceLinks = document.querySelectorAll('.text a');
const heroImages = document.querySelectorAll('.image img');
const resultPopup = document.getElementById('resultPopup');
const myScoreH1 = myScoreSpan.closest('h1');
const computerScoreH1 = computerScoreSpan.closest('h1');

function showPopup(message, type) {
  resultPopup.textContent = message;
  resultPopup.className = 'result-popup ' + type;
  resultPopup.style.display = 'block';
  resultPopup.style.opacity = '1';
  setTimeout(() => {
    resultPopup.style.opacity = '0';
    setTimeout(() => {
      resultPopup.style.display = 'none';
    }, 300);
  }, 1200);
}

heroImages.forEach((img, idx) => {
  img.style.cursor = 'pointer';
  img.addEventListener('click', function () {
    if (!gameActive) return;

    stopAnimation();

    const choices = ['rock', 'paper', 'scissor'];
    const userChoice = choices[idx];
    const computerChoice = choices[Math.floor(Math.random() * 3)];

    let result = '';
    if (userChoice === computerChoice) {
      result = "It's a draw!";
      showPopup("Draw!", "");
    } else if (
      (userChoice === 'rock' && computerChoice === 'scissor') ||
      (userChoice === 'paper' && computerChoice === 'rock') ||
      (userChoice === 'scissor' && computerChoice === 'paper')
    ) {
      result = 'You win!';
      myScore++;
      myScoreSpan.textContent = myScore;
      myScoreH1.classList.add('score-animate-left');
      showPopup("You Win!", "win");
      setTimeout(() => myScoreH1.classList.remove('score-animate-left'), 600);
    } else {
      result = 'Computer wins!';
      computerScore++;
      computerScoreSpan.textContent = computerScore;
      computerScoreH1.classList.add('score-animate-right');
      showPopup("You Lose!", "lose");
      setTimeout(() => computerScoreH1.classList.remove('score-animate-right'), 600);
    }

    // Disable choices until Play Now is clicked again
    gameActive = false;
    choiceLinks.forEach(link => {
      link.style.pointerEvents = 'none';
      link.style.opacity = '0.5';
    });
  });
});

// Initially disable choices
choiceLinks.forEach(link => {
  link.style.pointerEvents = 'none';
  link.style.opacity = '0.5';
});

// Helper: Animation start
function startAnimation() {
  heroImages.forEach(img => img.classList.add('animated'));
}

// Helper: Animation stop
function stopAnimation() {
  heroImages.forEach(img => img.classList.remove('animated'));
}

// Play Now button logic
playNowBtn.addEventListener('click', function() {
  gameActive = true;
  choiceLinks.forEach(link => {
    link.style.pointerEvents = 'auto';
    link.style.opacity = '1';
  });
  // Images enable bhi karein
  heroImages.forEach(img => {
    img.style.pointerEvents = 'auto';
    img.style.opacity = '1';
  });
  startAnimation(); // Animation start
});

// Reset button logic
const resetBtn = document.getElementById('resetBtn');
resetBtn.addEventListener('click', function (e) {
  e.preventDefault(); // Page reload nahi hoga

  // Score reset
  myScore = 0;
  computerScore = 0;
  myScoreSpan.textContent = myScore;
  computerScoreSpan.textContent = computerScore;

  // Choices disable
  gameActive = false;
  choiceLinks.forEach(link => {
    link.style.pointerEvents = 'none';
    link.style.opacity = '0.5';
  });
  // Images disable
  heroImages.forEach(img => {
    img.style.pointerEvents = 'none';
    img.style.opacity = '0.5';
  });

  // Animation stop
  stopAnimation();

  // Popup hide
  resultPopup.style.display = 'none';
});