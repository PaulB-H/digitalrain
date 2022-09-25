// Setup canvas / context
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const canvas2 = document.getElementById("canvas2");
const ctx2 = canvas2.getContext("2d");

const characters =
  "MATRIXMATRIXMATRIXMATRIXMAØ1Ø1Ø1Ø1Ø#$%@&#$%@&ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ";

const activeStreamsSpan = document.getElementById("active-streams");
const streamMaxLengthSpan = document.getElementById("max-length");
const streamMinLengthSpan = document.getElementById("min-length");
const numOfIntervalsSpan = document.getElementById("num-intervals");
const streamMaxSpeedSpan = document.getElementById("max-speed");
const streamMinSpeedSpan = document.getElementById("min-speed");
const streamFontSize = document.getElementById("font-size");
const setFontSizeInput = document.getElementById("set-font-size");

const streamProperties = {
  initialColor: "#e4e6e3",
  secondColor: "#6cfe6b",
  settledColor: "#00dd00",
  fontSize: 20,

  minLength: 5,
  maxLength: 20,

  minSpeed: 500,
  maxSpeed: 50,

  maxIntervals: 100,
  maxStreams: null,
};

const updateReadout = () => {
  activeStreamsSpan.innerText = streamProperties.maxStreams;
  streamMaxLengthSpan.innerText = streamProperties.maxLength;
  streamMinLengthSpan.innerText = streamProperties.minLength;
  numOfIntervalsSpan.innerText = streamProperties.maxIntervals;
  streamFontSize.innerText = streamProperties.fontSize;
  streamMaxSpeedSpan.innerText = streamProperties.maxSpeed;
  streamMinSpeedSpan.innerText = streamProperties.minSpeed;
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

  ctx.font = `${streamProperties.fontSize}px "Cutive Mono", monospace`;
  ctx.textBaseline = "top";
};
setCanvasSize();

const setStreamSpeed = (min = null, max = null) => {
  if (min) streamProperties.minSpeed = min;
  if (max) streamProperties.maxSpeed = max;
  updateReadout();
};

const changeStreamProperties = (color1, color2, color3, fontSize) => {
  streamProperties.initialColor = color1;
  streamProperties.secondColor = color2;
  streamProperties.settledColor = color3;
  if (fontSize) {
    streamProperties.fontSize = fontSize;
    setCanvasSize();
  }
};
const setTheme = (themeName, fontSize) => {
  switch (themeName.toLowerCase()) {
    case "matrix":
      changeStreamProperties("#e4e6e3", "#6cfe6b", "#00dd00", fontSize);
      break;
    case "fire":
      changeStreamProperties("Yellow", "Orange", "Red", fontSize);
      break;
    case "ice":
      changeStreamProperties("aqua", "skyblue", "darkcyan", fontSize);
      break;
    case "pink":
      changeStreamProperties("lightpink", "pink", "palevioletred", fontSize);
      break;
    case "purple":
      changeStreamProperties("#EA3FFA", "#C187E0", "#8115F5", fontSize);
      break;
    default:
      break;
  }
};

const randomColumn = () => {
  const columns = window.innerWidth / (0.7 * streamProperties.fontSize);
  return Math.floor(Math.random() * columns);
};
const randomYStart = () =>
  Math.floor(Math.random() * canvas.height) * streamProperties.fontSize * -1;

const updateStreams = (set) => {
  set.forEach((item, idx) => {
    const fontSizeMinus7Percent =
      streamProperties.fontSize - (7 / 100) * streamProperties.fontSize;

    const seventyPercentFontSize = 0.7 * streamProperties.fontSize;
    const fiftyPercentFontSize = 0.5 * streamProperties.fontSize;

    // New Clear Rect
    ctx2.fillStyle = "black";
    ctx2.fillRect(
      item.XLOC - 0.175 * streamProperties.fontSize,
      item.YLOC -
        streamProperties.fontSize * item.streamLength -
        0.1 * streamProperties.fontSize,
      0.9 * streamProperties.fontSize,
      streamProperties.fontSize
    );

    /*
      !! Drawing the fading this way is very detrimental to performance !!
    */
    // // Clear up the last shadow layer, to prepare for next stream
    // ctx2.clearRect(
    //   item.XLOC,
    //   Math.floor(item.YLOC - item.streamLength * fontSizeMinus7Percent),
    //   seventyPercentFontSize,
    //   streamProperties.fontSize
    // );
    // Fading per-stream, on other canvas
    // if (streamProperties.totalStreams < 5000) {
    for (let i = 4; i < item.streamLength - 3; i++) {
      ctx2.fillStyle = "rgba(0, 0, 0, 0.075)";
      ctx2.fillRect(
        item.XLOC,
        item.YLOC -
          streamProperties.fontSize * i -
          0.1 * streamProperties.fontSize,
        seventyPercentFontSize,
        streamProperties.fontSize
      );
    }
    // }

    // Chance to flip an already placed character
    if (Math.floor(Math.random() * 3) === 1) {
      let loc = Math.floor(Math.random() * (item.streamLength - 4) + 4);

      ctx.fillStyle = "black";
      ctx.fillRect(
        item.XLOC - 0.1 * streamProperties.fontSize,

        item.YLOC -
          streamProperties.fontSize * loc -
          0.1 * streamProperties.fontSize,
        seventyPercentFontSize,
        streamProperties.fontSize
      );

      ctx.fillStyle = `${streamProperties.settledColor}`;
      ctx.fillText(
        characters.charAt(Math.floor(Math.random() * characters.length)),
        item.XLOC,
        item.YLOC - streamProperties.fontSize * loc,
        fiftyPercentFontSize
      );
    }

    // Third character
    if (item.secondChar) {
      ctx.fillStyle = "black";
      ctx.fillRect(
        item.XLOC - (7 / 100) * streamProperties.fontSize,

        item.YLOC -
          streamProperties.fontSize * 2 -
          0.1 * streamProperties.fontSize,
        seventyPercentFontSize,
        streamProperties.fontSize
      );

      ctx.fillStyle = `${streamProperties.settledColor}`;
      ctx.fillText(
        item.secondChar,
        item.XLOC,
        item.YLOC - streamProperties.fontSize * 2,
        fiftyPercentFontSize
      );
    }

    // Second Character
    if (item.firstChar) {
      // Clear square to clean glow from first char
      ctx.fillStyle = "black";
      ctx.fillRect(
        item.XLOC,
        item.YLOC - streamProperties.fontSize - 0.1 * streamProperties.fontSize,
        seventyPercentFontSize,
        streamProperties.fontSize
      );
      ctx.fillStyle = `${streamProperties.secondColor}`;
      ctx.fillText(
        item.firstChar,
        item.XLOC,
        item.YLOC - streamProperties.fontSize,
        fiftyPercentFontSize
      );
      item.secondChar = item.firstChar;
    }

    ctx.fillStyle = "black";
    ctx.fillRect(
      item.XLOC,
      item.YLOC - 0.1 * streamProperties.fontSize,
      seventyPercentFontSize,
      streamProperties.fontSize
    );
    // ctx.fillStyle = "black";
    ctx2.clearRect(
      item.XLOC - 0.1 * streamProperties.fontSize,
      item.YLOC - 0.1 * streamProperties.fontSize,
      seventyPercentFontSize,
      streamProperties.fontSize
    );

    // First (new) character
    const randNum = Math.floor(Math.random() * characters.length);
    item.firstChar = characters.charAt(randNum);
    ctx.fillStyle = `${streamProperties.initialColor}`;
    // ctx.shadowColor = "rgba(230,230,230,1)";
    // ctx.shadowColor = streamProperties.initialColor;
    // ctx.shadowBlur = streamProperties.fontSize / 80;
    ctx.fillText(item.firstChar, item.XLOC, item.YLOC, fiftyPercentFontSize);
    ctx.shadowColor = null;
    ctx.shadowBlur = null;
    // Sets YLOC for next draw interval
    item.YLOC += streamProperties.fontSize;
    if (
      item.YLOC >
      canvas.offsetHeight + streamProperties.fontSize * item.streamLength
    ) {
      item.YLOC = randomYStart();
      item.firstChar = null;
    }
  });
};

let intervalStore = [];
const genStreams = (minSpeed, maxSpeed, numOfIntervals, numOfStreams) => {
  const allSets = [];
  for (let i = 0; i < numOfIntervals; i++) {
    allSets.push(new Set());
  }

  do {
    const randStream = Math.floor(Math.random() * allSets.length);

    allSets[randStream].add({
      XLOC: Math.floor(randomColumn() * 0.7 * streamProperties.fontSize),
      YLOC: randomYStart(),
      streamLength:
        Math.ceil(Math.random() * streamProperties.maxLength) +
        streamProperties.minLength,
      firstChar: null,
      secondChar: null,
    });
    numOfStreams--;
  } while (numOfStreams > 0);

  for (let i = 0; i < numOfIntervals; i++) {
    const randSpeed =
      Math.floor(Math.random() * streamProperties.minSpeed) +
      streamProperties.maxSpeed;
    let newInterval = window.setInterval(() => {
      updateStreams(allSets[i]);
    }, randSpeed);
    intervalStore.push(newInterval);
  }

  updateReadout();
};

const calculateMaxStreams = () => {
  const columns = Math.floor(
    window.innerWidth / (0.7 * streamProperties.fontSize)
  );
  let totalStreams = Math.floor(
    columns *
      (canvas.height /
        (streamProperties.maxLength - streamProperties.minLength))
  );

  totalStreams = Math.floor(0.5 * totalStreams);

  if (totalStreams > 15000) totalStreams = 15000;

  streamProperties.maxStreams = totalStreams;
  activeStreamsSpan.innerText = totalStreams;
  return totalStreams;
};

let setFontTimeout;
const setFontSize = (timeout = 1500) => {
  window.clearInterval(setFontTimeout);
  streamFontSize.innerText = setFontSizeInput.value;
  setFontTimeout = window.setTimeout(() => {
    intervalStore.forEach((interval, idx) => {
      window.clearInterval(interval);
    });

    if (setFontSizeInput.value < 5) {
      streamProperties.fontSize = 5;
      setFontSizeInput.value = 5;
    } else if (setFontSizeInput.value > 100) {
      streamProperties.fontSize = 100;
      setFontSizeInput.value = 100;
    } else {
      streamProperties.fontSize = parseInt(setFontSizeInput.value);
    }

    setCanvasSize();

    genStreams(
      streamProperties.maxSpeed,
      streamProperties.minSpeed,
      streamProperties.maxIntervals,
      calculateMaxStreams()
    );
  }, timeout);
};

window.addEventListener("resize", () => {
  intervalStore.forEach((interval, idx) => {
    window.clearInterval(interval);
  });
  setCanvasSize();
  genStreams(
    streamProperties.maxSpeed,
    streamProperties.minSpeed,
    streamProperties.maxIntervals,
    calculateMaxStreams()
  );
  updateReadout();
});

genStreams(
  streamProperties.maxSpeed,
  streamProperties.minSpeed,
  streamProperties.maxIntervals,
  calculateMaxStreams()
);
