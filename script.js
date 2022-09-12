// Setup canvas / context
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ-ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ-ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ-ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ";

const initialColor = "#e4e6e3";
const secondColor = "#6cfe6b";
const settledColor = "#00dd00";
const aboutToFade = "#002003";

ctx.translate(canvas.width, 0);
ctx.scale(-1, 1);

ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

const fontSize = 50;
ctx.font = `${fontSize}px "Cutive Mono", monospace`;
ctx.textBaseline = "top";

const randomColumn = () => {
  const columns = window.innerWidth / (0.7 * fontSize);
  return Math.ceil(Math.random() * columns);
};
const randomYStart = () => Math.floor(Math.random() * (10 * fontSize) * -1);
const randomSpeed = () => Math.floor(Math.random() * (250 - 50 + 1)) + 50;

let colsActive = 0;
let colTracker = new Set();

const createWriteStream = () => {
  if (colsActive > window.innerWidth / fontSize) return;

  let XLOC = randomColumn() * (0.7 * fontSize);
  let YLOC = randomYStart();

  let colExist = false;
  colTracker.forEach((item, idx) => {
    if (item.col === XLOC && item.date + 5000 > Date.now()) {
      colExist = true;
      return;
    } else if (item.col === XLOC && item.date + 5000 < Date.now()) {
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

    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    ctx.fillRect(XLOC, YLOC, 0.7 * fontSize, fontSize);

    if (secondLastChar) {
      ctx.fillStyle = `${settledColor}`;
      ctx.fillText(secondLastChar, XLOC, YLOC - fontSize * 2);
    }

    if (lastChar) {
      ctx.fillStyle = `${secondColor}`;
      ctx.fillText(lastChar, XLOC, YLOC - fontSize);
      secondLastChar = lastChar;
    }

    ctx.fillStyle = `${initialColor}`;
    ctx.shadowColor = "rgba(228,230,227,1)";
    ctx.shadowBlur = "5";
    ctx.fillText(randChar, XLOC, YLOC);
    ctx.shadowColor = null;
    ctx.shadowBlur = null;

    YLOC += fontSize;

    if (YLOC > window.innerHeight + fontSize * 2) {
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

window.setInterval(() => {
  ctx.fillStyle = "rgba(0, 0, 0, 0.105)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}, 100);

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.font = `${fontSize}px "Cutive Mono", monospace`;
});
