const containers = document.getElementsByClassName('container');
const stopButton = document.getElementById("stop");
const startButton = document.getElementById("start");

let stopAnimationFlag = false;   // Permet de détecter si on doit stopper
let timeoutId = null;            // Stockera l'ID du setTimeout

stopButton.addEventListener("click", () => {
    console.log("Stop !");
    stopAnimation();
    stopButton.style.display = "none";
    startButton.style.display = "block";
});

startButton.addEventListener("click", () => {
    stopAnimation();
    stopAnimationFlag = false;
    activateContainers(containers, 5000);
    startButton.style.display = "none";
    stopButton.style.display = "block";
});

function activateOneContainer() {
    for (let el of containers) {
        el.addEventListener("click", () => {
            el.classList.add('container-active');
        });
    }
}

function activateContainers(elements, delay) {
  let index = 0;

  function activateNext() {
    if (stopAnimationFlag) { // si stop demandé, on arrête
      return;
    }

    elements[index].classList.add('container-active');

    timeoutId = setTimeout(() => {
      elements[index].classList.remove('container-active');
      index++;
      if (index >= elements.length) {
        index = 0;
      }
      activateNext();
    }, delay);
  }

  activateNext();
}

function stopAnimation() {
  stopAnimationFlag = true;
  clearTimeout(timeoutId);
  // On enlève la classe au cas où
  for (let el of containers) {
    el.classList.remove('container-active');
  }
}

// Pour démarrer
activateContainers(containers, 5000);

// Pour stopper manuellement
// stopAnimation();

// Permet le focus sur un élément au click
activateOneContainer();

