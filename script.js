// Setup canvas & contexts
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const canvas2 = document.getElementById("canvas2");
const ctx2 = canvas2.getContext("2d");

const characters =
  "MATRIXMATRIXMATRIXMATRIXMAØ1Ø1Ø1Ø1Ø#$%@&#$%@&ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ";

// Spans to update with stream info...
const mainDetailsDiv = document.getElementById("details");
const activeStreamsSpan = document.getElementById("active-streams");
const streamMaxLengthSpan = document.getElementById("max-length");
const streamMinLengthSpan = document.getElementById("min-length");
const numOfIntervalsSpan = document.getElementById("num-intervals");
const streamMaxSpeedSpan = document.getElementById("max-speed");
const streamMinSpeedSpan = document.getElementById("min-speed");
const streamFontSize = document.getElementById("font-size");
const setFontSizeInput = document.getElementById("set-font-size");
const toggleDetailsButton = document.getElementById("toggle-details-btn");
// ... and a function update them
const updateReadout = () => {
  activeStreamsSpan.innerText = streamProperties.maxStreams;
  streamMaxLengthSpan.innerText = streamProperties.maxLength;
  streamMinLengthSpan.innerText = streamProperties.minLength;
  numOfIntervalsSpan.innerText = streamProperties.maxIntervals;
  streamFontSize.innerText = streamProperties.fontSize;
  streamMaxSpeedSpan.innerText = streamProperties.maxSpeed;
  streamMinSpeedSpan.innerText = streamProperties.minSpeed;
};
const toggleDetailsDiv = () => {
  const allDetails = document.querySelectorAll("#details div");
  allDetails.forEach((element, idx) => {
    element.classList.contains("d-none")
      ? element.classList.remove("d-none")
      : element.classList.add("d-none");
  });
  toggleDetailsButton.classList.contains("fade-button")
    ? toggleDetailsButton.classList.remove("fade-button")
    : toggleDetailsButton.classList.add("fade-button");
};
let getFontTimeout;
const getFontSizeFromSlider = () => {
  streamFontSize.innerText = setFontSizeInput.value;
  window.clearInterval(getFontTimeout);
  getFontTimeout = window.setTimeout(() => {
    setFontSize(setFontSizeInput.value);
  }, 1500);
};

// Canvas sizing
const setCanvasSize = () => {
  canvas.width = document.querySelector("body").offsetWidth;
  canvas2.width = document.querySelector("body").offsetWidth;

  if (window.innerHeight > document.querySelector("body").offsetHeight) {
    canvas.height = window.innerHeight;
    canvas2.height = window.innerHeight;
  } else {
    canvas.height = document.querySelector("body").offsetHeight;
    canvas2.height = document.querySelector("body").offsetHeight;
  }

  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx2.translate(canvas2.width, 0);
  ctx2.scale(-1, 1);

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};
setCanvasSize();

// streamProperties & functions
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

const changeStreamProperties = (color1, color2, color3) => {
  streamProperties.initialColor = color1;
  streamProperties.secondColor = color2;
  streamProperties.settledColor = color3;
};

const themes = new Set([
  {
    name: "matrix",
    color1: "#e4e6e3",
    color2: "#6cfe6b",
    color3: "#00dd00",
  },
  {
    name: "fire",
    color1: "yellow",
    color2: "orange",
    color3: "red",
  },
  {
    name: "ice",
    color1: "aqua",
    color2: "skyblue",
    color3: "darkcyan",
  },
  {
    name: "pink",
    color1: "lightpink",
    color2: "pink",
    color3: "palevioletred",
  },
  {
    name: "vanu",
    color1: "#EA3FFA",
    color2: "#C187E0",
    color3: "#8115F5",
  },
]);
const setTheme = (themeName) => {
  themes.forEach((theme) => {
    if (theme.name === themeName.toLowerCase()) {
      changeStreamProperties(theme.color1, theme.color2, theme.color3);
    }
  });
};

const setFontSize = (fontSize) => {
  clearAllIntervals();

  if (fontSize < 5) {
    streamProperties.fontSize = 5;
  } else if (fontSize > 100) {
    streamProperties.fontSize = 100;
  } else {
    streamProperties.fontSize = parseInt(setFontSizeInput.value);
  }

  setCanvasSize();

  genStreamsAndIntervals();
};

const setStreamLength = (min = null, max = null) => {
  clearAllIntervals();
  if (min) streamProperties.minLength = min;
  if (max) streamProperties.maxLength = max;
  setCanvasSize();
  genStreamsAndIntervals();
  updateReadout();
};

// ... Because this sets an interval timer:
// min being larger = slower interval,
// max being smaller = faster interval
const setStreamSpeed = (min = null, max = null) => {
  if (max > min) return "min must be greater than max";
  clearAllIntervals();
  if (min) streamProperties.minSpeed = min;
  if (max) streamProperties.maxSpeed = max;
  setCanvasSize();
  genStreamsAndIntervals();
  updateReadout();
};
// END streamProperties & functions

// Interval Management
let intervalStore = [];
const clearAllIntervals = () => {
  intervalStore.forEach((interval, idx) => {
    window.clearInterval(interval);
  });
  intervalStore = [];
};

// Stream Generation & Update
const randomColumn = () => {
  const columns = window.innerWidth / (0.7 * streamProperties.fontSize);
  return Math.floor(Math.random() * columns);
};

const randomYStart = () => {
  return (
    Math.floor(Math.random() * canvas.height) * streamProperties.fontSize * -1
  );
};

const calculateMaxStreams = () => {
  const columns = Math.floor(
    window.innerWidth / (0.7 * streamProperties.fontSize)
  );
  let totalStreams = Math.floor(
    columns * (canvas.height / streamProperties.maxLength)
  );

  totalStreams = Math.floor(0.5 * totalStreams);

  if (totalStreams > 15000) totalStreams = 15000;

  streamProperties.maxStreams = totalStreams;
  activeStreamsSpan.innerText = totalStreams;
  return totalStreams;
};

const genStreamsAndIntervals = () => {
  let numOfStreams = calculateMaxStreams();

  const allSets = [];
  for (let i = 0; i < streamProperties.maxIntervals; i++) {
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

  for (let i = 0; i < streamProperties.maxIntervals; i++) {
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

const updateStreams = (set) => {
  set.forEach((item, idx) => {
    ctx.font = `${streamProperties.fontSize}px "Cutive Mono", monospace`;
    ctx.textBaseline = "top";

    const fiftyPercentFontSize = 0.5 * streamProperties.fontSize;

    const rectTweak = (fillOrClear, context, xloc, yloc, charPos) => {
      if (fillOrClear === "fill") {
        context.fillRect(
          Math.floor(xloc),
          Math.floor(
            yloc -
              streamProperties.fontSize * charPos -
              0.1 * streamProperties.fontSize
          ),
          fiftyPercentFontSize,
          streamProperties.fontSize
        );
      } else if (fillOrClear === "clear") {
        context.clearRect(
          Math.floor(xloc),
          Math.floor(
            yloc -
              streamProperties.fontSize * charPos -
              0.1 * streamProperties.fontSize
          ),
          fiftyPercentFontSize,
          streamProperties.fontSize
        );
      }
    };

    const textTweak = (context, character, xloc, yloc, charPos) => {
      context.fillText(
        character,
        Math.floor(xloc),
        Math.floor(yloc - streamProperties.fontSize * charPos),
        fiftyPercentFontSize
      );
    };

    getRandomChar = () => {
      const randNum = Math.floor(Math.random() * characters.length);
      return characters.charAt(randNum);
    };

    /*
      Think of the end of the stream being at the top of the code here...
    */

    // Clean up at the end of the stream
    ctx2.fillStyle = "black";
    rectTweak("fill", ctx2, item.XLOC, item.YLOC, item.streamLength);

    // Shading with rgba() is detrimental to performance because
    // the browser has to calculate the blending on each draw
    for (let i = 4; i < item.streamLength - 3; i++) {
      ctx2.fillStyle = "rgba(0, 0, 0, 0.075)";
      rectTweak("fill", ctx2, item.XLOC, item.YLOC, i);
    }

    // Chance to flip an already placed character
    if (Math.floor(Math.random() * 3) === 1) {
      let loc = Math.floor(Math.random() * (item.streamLength - 4) + 4);

      ctx.fillStyle = "black";
      rectTweak("fill", ctx, item.XLOC, item.YLOC, loc);

      ctx.fillStyle = `${streamProperties.settledColor}`;
      textTweak(ctx, getRandomChar(), item.XLOC, item.YLOC, loc);
    }

    // Third character
    if (item.secondChar) {
      ctx.fillStyle = "black";
      rectTweak("fill", ctx, item.XLOC, item.YLOC, 2);

      ctx.fillStyle = `${streamProperties.settledColor}`;
      textTweak(ctx, item.secondChar, item.XLOC, item.YLOC, 2);
    }

    // Second Character
    if (item.firstChar) {
      // Clear square to clean glow from first char
      ctx.fillStyle = "black";
      rectTweak("fill", ctx, item.XLOC, item.YLOC, 1);

      ctx.fillStyle = `${streamProperties.secondColor}`;
      textTweak(ctx, item.firstChar, item.XLOC, item.YLOC, 1);
      item.secondChar = item.firstChar;
    }

    // Paint area for new character black
    ctx.fillStyle = "black";
    rectTweak("fill", ctx, item.XLOC, item.YLOC, 0);

    // Clear the shadow layer at the same spot
    rectTweak("clear", ctx2, item.XLOC, item.YLOC, 0);

    // First (new) character
    const randNum = Math.floor(Math.random() * characters.length);
    item.firstChar = characters.charAt(randNum);
    ctx.fillStyle = `${streamProperties.initialColor}`;
    textTweak(ctx, item.firstChar, item.XLOC, item.YLOC, 0);

    // Set YLOC for next draw interval...
    // ... or send to top if entire stream off page
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
// END Stream Generation & Update

// Resize function
let resizeTimer;
window.addEventListener("resize", () => {
  window.clearInterval(resizeTimer);
  resizeTimer = window.setTimeout(() => {
    clearAllIntervals();
    setCanvasSize();
    genStreamsAndIntervals();
    updateReadout();
  }, 750);
});

// Start drawing
genStreamsAndIntervals();

let discoInterval;
const discoMode = (stop = false) => {
  if (stop) {
    window.clearInterval(discoInterval);
    return;
  }
  window.clearInterval(discoInterval);
  const themes = ["matrix", "fire", "ice", "pink", "vanu"];
  let currentTheme = 0;
  discoInterval = window.setInterval(() => {
    setTheme(themes[currentTheme]);
    currentTheme++;
    if (currentTheme === 5) currentTheme = 0;
  }, 250);
};
