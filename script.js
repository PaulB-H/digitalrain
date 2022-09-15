// Setup canvas / context
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const canvas2 = document.getElementById("canvas2");
const ctx2 = canvas2.getContext("2d");

const setCanvasSize = () => {
  if (window.innerWidth > document.querySelector("body").offsetWidth) {
    canvas.width = window.innerWidth;
    canvas2.width = window.innerWidth;
  } else {
    canvas.width = document.querySelector("body").offsetWidth;
    canvas2.width = document.querySelector("body").offsetWidth;
  }
  if (window.innerHeight > document.querySelector("body").offsetHeight) {
    canvas.height = window.innerHeight;
    canvas2.height = window.innerHeight;
  } else {
    canvas.height = document.querySelector("body").offsetHeight;
    canvas2.height = document.querySelector("body").offsetHeight;
  }
};
setCanvasSize();

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ-ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ-ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ-ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ";

const initialColor = "#e4e6e3";
const secondColor = "#6cfe6b";
const settledColor = "#00dd00";
const aboutToFade = "#002003";

ctx.translate(canvas.width, 0);
ctx.scale(-1, 1);
ctx2.translate(canvas.width, 0);
ctx2.scale(-1, 1);

ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

const fontSize = 50;
ctx.font = `${fontSize}px "Cutive Mono", monospace`;
ctx.textBaseline = "top";

const randomColumn = () => {
  const columns = window.innerWidth / (0.7 * fontSize);
  return Math.ceil(Math.random() * columns);
};
const randomYStart = () => Math.floor(Math.random() * 10) * fontSize * -1;
const randomSpeed = () => Math.floor(Math.random() * (250 - 50 + 1)) + 50;

let colsActive = 0;
let colTracker = new Set();

const createWriteStream = () => {
  if (colsActive > window.innerWidth / (0.7 * fontSize)) return;

  let XLOC = randomColumn() * (0.7 * fontSize);
  let YLOC = randomYStart();

  let colExist = false;
  colTracker.forEach((item, idx) => {
    if (item.col === XLOC && item.date + 8000 > Date.now()) {
      colExist = true;
      return;
    } else if (item.col === XLOC && item.date + 8000 < Date.now()) {
      colTracker.delete(item);
    }
  });
  if (colExist) return;

  colsActive++;
  colTracker.add({ col: XLOC, date: Date.now() });

  let lastChar = null;
  let secondLastChar = null;

  const drawInterval = setInterval(() => {
    const randChar = characters.charAt(
      Math.floor(Math.random() * characters.length - 1)
    );

    // Clean up crew
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.fillRect(XLOC, YLOC - 18 * fontSize, 0.75 * fontSize, fontSize);
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(XLOC, YLOC - 19 * fontSize, 0.75 * fontSize, fontSize);
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.fillRect(XLOC, YLOC - 20 * fontSize, 0.75 * fontSize, fontSize);

    // Clear up the last shadow layer, to prepare for next stream
    ctx2.clearRect(XLOC, YLOC - 21 * fontSize, 0.75 * fontSize, fontSize);

    // We are now fading locally per-stream
    for (let i = 3; i < 18; i++) {
      ctx2.fillStyle = "rgba(0, 0, 0, 0.12)";
      ctx2.fillRect(XLOC, YLOC - i * fontSize, 0.75 * fontSize, fontSize);
    }

    // Second last character
    if (secondLastChar) {
      ctx.fillStyle = `${settledColor}`;
      ctx.fillText(
        secondLastChar,
        XLOC + 3,
        YLOC - fontSize * 2,
        0.5 * fontSize
      );
    }

    // Last character
    if (lastChar) {
      // Print clean square to clean glow from
      // first characters shadow, resulting in cleaner
      // looking trail left behind
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      ctx.fillRect(XLOC, YLOC - fontSize, 0.75 * fontSize, fontSize);

      ctx.fillStyle = `${secondColor}`;
      ctx.fillText(lastChar, XLOC + 3, YLOC - fontSize, 0.5 * fontSize);
      secondLastChar = lastChar;
    }

    // New character
    ctx.fillStyle = `${initialColor}`;
    ctx.shadowColor = "rgba(228,230,227,1)";
    ctx.shadowBlur = "5";
    ctx.fillText(randChar, XLOC + 3, YLOC, 0.5 * fontSize);
    ctx.shadowColor = null;
    ctx.shadowBlur = null;

    YLOC += fontSize;

    if (YLOC > canvas.offsetHeight + fontSize * 20) {
      window.clearInterval(drawInterval);
      colsActive--;
    }
    lastChar = randChar;
  }, randomSpeed());
  // END drawInterval
};

const startWriting = window.setInterval(() => {
  createWriteStream();
}, 300);

// RIP global shader
// window.setInterval(() => {
//   ctx.fillStyle = "rgba(0, 0, 0, 0.105)";
//   ctx.fillRect(0, 0, canvas.width, canvas.height);
// }, 100);

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.font = `${fontSize}px "Cutive Mono", monospace`;
  // Don't forget to flip the shadow context
  ctx2.translate(canvas.width, 0);
  ctx2.scale(-1, 1);
});
