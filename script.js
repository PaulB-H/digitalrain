// Setup canvas / context
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const canvas2 = document.getElementById("canvas2");
const ctx2 = canvas2.getContext("2d");

const fontSize = 50;

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

  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx2.translate(canvas.width, 0);
  ctx2.scale(-1, 1);

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = `${fontSize}px "Cutive Mono", monospace`;
  ctx.textBaseline = "top";
};
setCanvasSize();

const characters =
  "MATRIXMATRIXMATRIXMATRIXMA1234567890ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ-ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ-ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ-ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ";

const initialColor = "#e4e6e3";
const secondColor = "#6cfe6b";
const settledColor = "#00dd00";
const aboutToFade = "#002003";

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

  let firstChar = null;
  let secondChar = null;

  const drawInterval = setInterval(() => {
    // Clean up crew
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.fillRect(XLOC - 1, YLOC - 18 * fontSize, 0.85 * fontSize, fontSize);
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(XLOC - 1, YLOC - 19 * fontSize, 0.85 * fontSize, fontSize);
    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    ctx.fillRect(XLOC - 1, YLOC - 21 * fontSize, 0.85 * fontSize, fontSize);

    ctx.clearRect(XLOC - 1, YLOC - 21 * fontSize, 0.85 * fontSize, fontSize);

    // Clear up the last shadow layer, to prepare for next stream
    ctx2.clearRect(XLOC, YLOC - 21 * fontSize, 0.75 * fontSize, fontSize);

    // Fading per-stream, on other canvas
    for (let i = 3; i < 20; i++) {
      ctx2.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx2.fillRect(XLOC, YLOC - i * fontSize, 0.75 * fontSize, fontSize);
    }

    // Chance to flip an already placed character
    if (Math.floor(Math.random() * 5) === 1) {
      let loc = Math.floor(Math.random() * 17 + 3);

      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      ctx.fillRect(
        XLOC - 3,
        YLOC - fontSize * loc - 3,
        0.8 * fontSize,
        fontSize + 3
      );

      ctx.fillStyle = `${settledColor}`;
      ctx.fillText(
        characters.charAt(Math.floor(Math.random() * characters.length)),
        XLOC + 3,
        YLOC - fontSize * loc,
        0.5 * fontSize
      );
    }

    // Third character
    if (secondChar) {
      ctx.fillStyle = `${settledColor}`;
      ctx.fillText(secondChar, XLOC + 3, YLOC - fontSize * 2, 0.5 * fontSize);
    }

    // Second Character
    if (firstChar) {
      // Clear square to clean glow from first char
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      ctx.fillRect(XLOC - 1, YLOC - fontSize - 10, 0.85 * fontSize, fontSize);
      ctx.fillStyle = `${secondColor}`;
      ctx.fillText(firstChar, XLOC + 3, YLOC - fontSize, 0.5 * fontSize);
      secondChar = firstChar;
    }

    // First (new) character
    firstChar = characters.charAt(
      Math.floor(Math.random() * characters.length)
    );

    ctx.fillStyle = `${initialColor}`;
    ctx.shadowColor = "rgba(230,230,230,1)";
    ctx.shadowBlur = "5";
    ctx.fillText(firstChar, XLOC + 3, YLOC, 0.5 * fontSize);
    ctx.shadowColor = null;
    ctx.shadowBlur = null;

    // Sets YLOC for next draw interval
    YLOC += fontSize;

    if (YLOC > canvas.offsetHeight + fontSize * 21) {
      window.clearInterval(drawInterval);
      colsActive--;
    }
  }, randomSpeed());
  // END drawInterval
};

const startWriting = window.setInterval(() => {
  createWriteStream();
}, 300);

window.addEventListener("resize", () => {
  setCanvasSize();
});
