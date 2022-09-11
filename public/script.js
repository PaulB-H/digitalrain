// Setup canvas / context
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const string =
  "abcdefhhijklmnopqrstuvwxyz123456789ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ-ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ-ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ";

const initialColor = "#e4e6e3";
const secondColor = "#6cfe6b";
const settledColor = "#00dd00";
const aboutToFade = "#002003";

ctx.translate(canvas.width, 0);
ctx.scale(-1, 1);

ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.fillStyle = `${settledColor}`;
const fontSize = 50;
ctx.font = `${fontSize}px 'IBM Plex Mono', monospace`;
ctx.textBaseline = "top";

const randomColumn = () => {
  const columns = window.innerWidth / fontSize;
  return Math.ceil(Math.random() * columns);
};

const randomStart = () => Math.floor(Math.random() * (10 * fontSize) * -1);
const randomSpeed = () => Math.floor(Math.random() * (250 - 50 + 1)) + 50;

const writeStuff = () => {
  let XLOC = randomColumn() * fontSize;
  let YLOC = randomStart();
  const drawInterval = setInterval(() => {
    const randChar = string.charAt(
      Math.floor(Math.random() * string.length - 1)
    );
    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    ctx.fillRect(XLOC, YLOC, fontSize, fontSize);

    ctx.fillStyle = `${settledColor}`;
    ctx.fillText(randChar, XLOC, YLOC);
    YLOC += fontSize;
    if (YLOC > window.innerHeight) {
      // console.log("Kill me");
      window.clearInterval(drawInterval);
    }
  }, randomSpeed());
};

window.setInterval(() => {
  writeStuff();
}, 500);

window.setInterval(() => {
  ctx.fillStyle = "rgba(0, 0, 0, 0.105)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}, 100);
