// Setup canvas / context
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const canvas2 = document.getElementById("canvas2");
const ctx2 = canvas2.getContext("2d");

const textProperties = {
  initialColor: "#e4e6e3",
  secondColor: "#6cfe6b",
  settledColor: "#00dd00",
  fontSize: 20,

  minLength: 5,
  maxLength: 20,
};

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

  ctx.font = `${textProperties.fontSize}px "Cutive Mono", monospace`;
  ctx.textBaseline = "top";
};
setCanvasSize();

const changeTextProperties = (color1, color2, color3, fontSize) => {
  textProperties.initialColor = color1;
  textProperties.secondColor = color2;
  textProperties.settledColor = color3;
  if (fontSize) textProperties.fontSize = fontSize;
  setCanvasSize();
};

const setTheme = (themeName, fontSize) => {
  switch (themeName.toLowerCase()) {
    case "matrix":
      changeTextProperties("#e4e6e3", "#6cfe6b", "#00dd00", fontSize);
      break;
    case "fire":
      changeTextProperties("Yellow", "Orange", "Red", fontSize);
      break;
    case "ice":
      changeTextProperties("aqua", "skyblue", "darkcyan", fontSize);
      break;
    case "pink":
      changeTextProperties("lightpink", "pink", "palevioletred", fontSize);
      break;
    default:
      break;
  }
};

const characters =
  "MATRIXMATRIXMATRIXMATRIXMAØ1Ø1Ø1Ø1Øｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ";

const randomColumn = () => {
  const columns = window.innerWidth / (0.7 * textProperties.fontSize);
  return Math.floor(Math.random() * columns);
};
const randomYStart = () =>
  Math.floor(Math.random() * 10) * textProperties.fontSize * -1;
const randomSpeed = () => Math.floor(Math.random() * (250 - 50 + 1)) + 50;

let colsActive = 0;
let colTracker = new Set();

const createWriteStream = () => {
  if (colsActive > window.innerWidth / (0.7 * textProperties.fontSize)) return;

  let XLOC = randomColumn() * (0.7 * textProperties.fontSize);
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

  let firstChar = null;
  let secondChar = null;

  const streamLength =
    Math.floor(
      Math.random() * (textProperties.maxLength - textProperties.minLength + 1)
    ) + textProperties.minLength;

  const drawInterval = setInterval(() => {
    // Clean up crew
    ctx2.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx2.fillRect(
      XLOC,
      YLOC -
        (streamLength - 3) * textProperties.fontSize -
        (7 / 100) * textProperties.fontSize,
      0.7 * textProperties.fontSize,
      textProperties.fontSize
    );
    ctx2.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx2.fillRect(
      XLOC,
      YLOC -
        (streamLength - 2) * textProperties.fontSize -
        (7 / 100) * textProperties.fontSize,
      0.7 * textProperties.fontSize,
      textProperties.fontSize
    );
    ctx2.fillStyle = "rgba(0, 0, 0, 0.75)";
    ctx2.fillRect(
      XLOC,
      YLOC -
        (streamLength - 1) * textProperties.fontSize -
        (7 / 100) * textProperties.fontSize,
      0.7 * textProperties.fontSize,
      textProperties.fontSize
    );

    ctx.clearRect(
      XLOC - (7 / 100) * textProperties.fontSize,
      YLOC -
        streamLength * textProperties.fontSize -
        (7 / 100) * textProperties.fontSize,
      0.7 * textProperties.fontSize,
      textProperties.fontSize
    );
    ctx.clearRect(
      XLOC - (7 / 100) * textProperties.fontSize,
      YLOC -
        (streamLength + 2) * textProperties.fontSize -
        (7 / 100) * textProperties.fontSize,
      0.7 * textProperties.fontSize,
      textProperties.fontSize
    );

    // Clear up the last shadow layer, to prepare for next stream
    ctx2.clearRect(
      XLOC,
      YLOC -
        streamLength * textProperties.fontSize -
        (8 / 100) * textProperties.fontSize,
      0.7 * textProperties.fontSize,
      textProperties.fontSize
    );

    // Fading per-stream, on other canvas
    for (let i = 4; i < streamLength - 3; i++) {
      ctx2.fillStyle = "rgba(0, 0, 0, 0.075)";
      ctx2.fillRect(
        XLOC,
        YLOC -
          i * textProperties.fontSize -
          (7 / 100) * textProperties.fontSize,
        0.7 * textProperties.fontSize,
        textProperties.fontSize
      );
    }

    // Chance to flip an already placed character
    if (Math.floor(Math.random() * 5) === 1) {
      let loc = Math.floor(Math.random() * (streamLength - 4) + 4);

      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      ctx.fillRect(
        XLOC,
        YLOC -
          loc * textProperties.fontSize -
          (7 / 100) * textProperties.fontSize,
        0.7 * textProperties.fontSize,
        textProperties.fontSize
      );

      ctx.fillStyle = `${textProperties.settledColor}`;
      ctx.fillText(
        characters.charAt(Math.floor(Math.random() * characters.length)),
        XLOC,
        YLOC - textProperties.fontSize * loc,
        0.5 * textProperties.fontSize
      );
    }

    // Third character
    if (secondChar) {
      ctx.fillStyle = `${textProperties.settledColor}`;
      ctx.fillText(
        secondChar,
        XLOC,
        YLOC - textProperties.fontSize * 2,
        0.5 * textProperties.fontSize
      );
    }

    // Second Character
    if (firstChar) {
      // Clear square to clean glow from first char
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      ctx.fillRect(
        XLOC,
        YLOC - textProperties.fontSize - (7 / 100) * textProperties.fontSize,
        0.7 * textProperties.fontSize,
        textProperties.fontSize
      );
      ctx.fillStyle = `${textProperties.secondColor}`;
      ctx.fillText(
        firstChar,
        XLOC,
        YLOC - textProperties.fontSize,
        0.5 * textProperties.fontSize
      );
      secondChar = firstChar;
    }

    // First (new) character
    firstChar = characters.charAt(
      Math.floor(Math.random() * characters.length)
    );

    ctx.clearRect(
      XLOC,
      YLOC - (7 / 100) * textProperties.fontSize,
      0.7 * textProperties.fontSize,
      textProperties.fontSize
    );

    ctx.fillStyle = `${textProperties.initialColor}`;
    // ctx.shadowColor = "rgba(230,230,230,1)";
    ctx.shadowColor = textProperties.initialColor;
    ctx.shadowBlur = textProperties.fontSize / 80;
    ctx.fillText(firstChar, XLOC, YLOC, 0.5 * textProperties.fontSize);
    ctx.shadowColor = null;
    ctx.shadowBlur = null;

    // Sets YLOC for next draw interval
    YLOC += textProperties.fontSize;

    if (YLOC > canvas.offsetHeight + textProperties.fontSize * streamLength) {
      window.clearInterval(drawInterval);
      colsActive--;
    }
  }, randomSpeed());
  // END drawInterval
  colsActive++;
  colTracker.add({ col: XLOC, date: Date.now(), interval: drawInterval });
};

const activeStreamsSpan = document.getElementById("active-streams");
const streamMaxLengthSpan = document.getElementById("max-length");
const streamMinLengthSpan = document.getElementById("min-length");
const streamFontSize = document.getElementById("font-size");

let writeInterval;
const startWriting = () => {
  writeInterval = window.setInterval(() => {
    createWriteStream();

    // Update debug info
    activeStreamsSpan.innerText = colsActive;
    streamMaxLengthSpan.innerText = textProperties.maxLength;
    streamMinLengthSpan.innerText = textProperties.minLength;
  }, 100);
};
startWriting();

const setFontSizeInput = document.getElementById("set-font-size");

let setFontTimeout;
const setFontSize = (timeout = 1500) => {
  streamFontSize.innerText = setFontSizeInput.value;
  setFontTimeout = window.setTimeout(() => {
    window.clearInterval(writeInterval);

    if (setFontSizeInput.value < 5) {
      textProperties.fontSize = 5;
      setFontSizeInput.value = 5;
    } else if (setFontSizeInput.value > 100) {
      textProperties.fontSize = 100;
      setFontSizeInput.value = 100;
    } else {
      textProperties.fontSize = parseInt(setFontSizeInput.value);
    }

    colTracker.forEach((item, idx) => {
      window.clearInterval(item.interval);
    });

    colsActive = 0;
    colTracker = new Set();

    startWriting();

    setCanvasSize();
  }, timeout);
};

window.addEventListener("resize", () => {
  setCanvasSize();
});
