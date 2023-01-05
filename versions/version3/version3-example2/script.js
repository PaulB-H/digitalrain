const rainContainer = document.getElementById("rain-container");
for (let i = 0; i < 33; i++) {
  const elem = document.createElement("div");
  elem.classList.add("canvas-container");
  elem.id = `canvas-container${i}`;
  rainContainer.appendChild(elem);
}

const rains = [];

for (let i = 0; i < 33; i++) {
  const newRain = new DigitalRain(
    document.getElementById(`canvas-container${i}`)
  );
  newRain.setupCanvas();
  newRain.startAnimation();
  rains.push(newRain);
}

const themes = rains[0].themes;

const getRandomTheme = () => {
  let randNum = Math.floor(Math.random() * themes.length);
  return themes[randNum].name;
};

window.setInterval(() => {
  rains[Math.floor(Math.random() * rains.length)].setTheme(getRandomTheme());
}, 1000);

rains.forEach((rain) => {
  rain.setTotalStreamMultiplier(1.75);
});

window.setInterval(() => {
  rains[Math.floor(Math.random() * rains.length)].discoMode();
}, 5000);

window.setInterval(() => {
  const randomRain = rains[Math.floor(Math.random() * rains.length)];
  const randFontSize = Math.floor(Math.random() * (100 - 5 + 1) + 5);
  randomRain.setFontSize(randFontSize);
}, 10000);
