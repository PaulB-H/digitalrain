// Setup canvas & contexts
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const canvas2 = document.getElementById("canvas2");
const ctx2 = canvas2.getContext("2d");

const characters =
  "MATRIXMATRIXMATRIXMATRIXMAØ1Ø1Ø1Ø1Ø#$%@&#$%@&ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ";

/**/
//// UI Elements
/**/

const mainDetailsDiv = document.getElementById("details");
const toggleDetailsButton = document.getElementById("toggle-details-btn");

const useReqAnimFrameRadio = document.getElementById("use-reqAnimFrame-radio");
const useIntervalsRadio = document.getElementById("use-intervals-radio");

const activeStreamsSpan = document.getElementById("active-streams");

const adjustTotalStreamSpan = document.getElementById("adjust-total");
const adjustTotalStreamSlider = document.getElementById("adjust-total-streams");

const streamMinLengthSpan = document.getElementById("min-length");
const setMinLenSlider = document.getElementById("set-min-length");
const streamMaxLengthSpan = document.getElementById("max-length");
const setMaxLenSlider = document.getElementById("set-max-length");

const numOfIntervalsSpan = document.getElementById("num-intervals");

const fastestIntervalSpan = document.getElementById("fastest-interval");
const setFastestSlider = document.getElementById("set-fastest-interval");
const slowestIntervalSpan = document.getElementById("slowest-interval");
const setSlowestSlider = document.getElementById("set-slowest-interval");

const streamFontSizeSpan = document.getElementById("font-size");
const setFontSizeSlider = document.getElementById("set-font-size");

const toggleBoldCheckbox = document.getElementById("bold-checkbox");
const toggleShadingCheckbox = document.getElementById("shading-checkbox");

/**/
//// UI Input Actions
/**/

const updateReadout = () => {
  // activeStreamsSpan.innerText = streamProperties.maxStreams;
  streamMaxLengthSpan.innerText = streamProperties.maxLength;
  streamMinLengthSpan.innerText = streamProperties.minLength;
  numOfIntervalsSpan.innerText = streamProperties.maxIntervals;
  streamFontSizeSpan.innerText = streamProperties.fontSize;
  fastestIntervalSpan.innerText = streamProperties.fastestInterval;
  slowestIntervalSpan.innerText = streamProperties.slowestInterval;
  adjustTotalStreamSpan.innerText = parseInt(
    streamProperties.maxStreamAdjustment * 100
  );
};
const toggleDetailsDiv = () => {
  const allDetails = document.querySelectorAll("#details div");
  allDetails.forEach((element, idx) => {
    element.classList.toggle("d-none");
  });
  toggleDetailsButton.classList.toggle("fade-button");
};

[useReqAnimFrameRadio, useIntervalsRadio].forEach((radioInput) => {
  radioInput.addEventListener("change", (e) => {
    clearAllIntervals();
    setCanvasSize();
    streamProperties.animationMode = e.target.value;
    startAnimation();
  });
});

let adjustTotalStreamTimeout;
adjustTotalStreamSlider.addEventListener("input", (e) => {
  adjustTotalStreamSpan.innerText = parseInt(e.target.value * 100);
  window.clearTimeout(adjustTotalStreamTimeout);
  adjustTotalStreamTimeout = window.setTimeout(() => {
    clearAllIntervals();
    setCanvasSize();
    streamProperties.maxStreamAdjustment = e.target.value;
    startAnimation();
    updateReadout();
  }, 750);
});

let setMinLenTimeout;
setMinLenSlider.addEventListener("input", (e) => {
  window.clearTimeout(setMinLenTimeout);
  if (parseInt(e.target.value) > parseInt(setMaxLenSlider.value))
    e.target.value = setMaxLenSlider.value;
  streamMinLengthSpan.innerText = e.target.value;
  setMinLenTimeout = window.setTimeout(() => {
    clearAllIntervals();
    setCanvasSize();
    streamProperties.minLength = parseInt(e.target.value);
    startAnimation();
  }, 750);
});
let setMaxLenTimeout;
setMaxLenSlider.addEventListener("input", (e) => {
  window.clearTimeout(setMaxLenTimeout);
  if (parseInt(e.target.value) < parseInt(setMinLenSlider.value))
    e.target.value = setMinLenSlider.value;
  streamMaxLengthSpan.innerText = e.target.value;
  setMaxLenTimeout = window.setTimeout(() => {
    clearAllIntervals();
    setCanvasSize();
    streamProperties.maxLength = parseInt(e.target.value);
    startAnimation();
  }, 750);
});

let setFastestTimeout;
setFastestSlider.addEventListener("input", (e) => {
  window.clearTimeout(setFastestTimeout);
  if (parseInt(e.target.value) > parseInt(setSlowestSlider.value))
    e.target.value = setSlowestSlider.value;
  fastestIntervalSpan.innerText = e.target.value;
  setFastestTimeout = window.setTimeout(() => {
    setStreamSpeed(null, parseInt(e.target.value));
  }, 750);
});
let setSlowestTimeout;
setSlowestSlider.addEventListener("input", (e) => {
  window.clearTimeout(setSlowestTimeout);
  if (parseInt(e.target.value) < parseInt(setFastestSlider.value))
    e.target.value = setFastestSlider.value;
  slowestIntervalSpan.innerText = e.target.value;
  setSlowestTimeout = window.setTimeout(() => {
    setStreamSpeed(parseInt(e.target.value), null);
  }, 750);
});

let getFontTimeout;
const getFontSizeFromSlider = () => {
  streamFontSizeSpan.innerText = setFontSizeSlider.value;
  window.clearInterval(getFontTimeout);
  getFontTimeout = window.setTimeout(() => {
    setFontSize(parseInt(setFontSizeSlider.value));
  }, 1500);
};

toggleBoldCheckbox.addEventListener("change", (e) => {
  if (e.target.checked) streamProperties.bold = true;
  else streamProperties.bold = false;
  clearAllIntervals();
  setCanvasSize();
  startAnimation();
});
toggleShadingCheckbox.addEventListener("change", (e) => {
  if (e.target.checked) streamProperties.shading = true;
  else streamProperties.shading = false;
});

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
// setCanvasSize();

// Resize function
let resizeTimer;
window.addEventListener("resize", () => {
  window.clearInterval(resizeTimer);
  resizeTimer = window.setTimeout(() => {
    clearAllIntervals();
    setCanvasSize();
    startAnimation();
    updateReadout();
  }, 750);
});

/**/
//// Main object to control stream properties
/**/
const streamProperties = {
  animationMode: "requestAnimationFrame",

  initialColor: "#e4e6e3",
  secondColor: "#6cfe6b",
  settledColor: "#00dd00",
  fontSize: 20,

  minLength: 5,
  maxLength: 20,

  slowestInterval: 500,
  fastestInterval: 50,

  maxIntervals: 100,
  maxStreams: null,

  maxStreamAdjustment: 1,

  bold: true,
  shading: true,
};

/**/
//// Font Properties
/**/
const themes = [
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
];
const setTheme = (themeName) => {
  themes.forEach((theme) => {
    if (theme.name === themeName.toLowerCase()) {
      changeStreamColors(theme.color1, theme.color2, theme.color3);
    }
  });
};

const changeStreamColors = (color1, color2, color3) => {
  window.clearInterval(discoInterval);
  if (color1) streamProperties.initialColor = color1;
  if (color2) streamProperties.secondColor = color2;
  if (color3) streamProperties.settledColor = color3;
};

const useTheseColors = () => {
  const color1 = document.getElementById("color1").value;
  const color2 = document.getElementById("color2").value;
  const color3 = document.getElementById("color3").value;
  changeStreamColors(color1, color2, color3);
};

const setFontSize = (fontSize) => {
  clearAllIntervals();

  if (fontSize < 5) {
    streamProperties.fontSize = 5;
  } else if (fontSize > 100) {
    streamProperties.fontSize = 100;
  } else {
    streamProperties.fontSize = fontSize;
  }

  setCanvasSize();

  startAnimation();
};

/**/
//// Stream Properties
/**/

// Column width adjustment
const columnWidthTweak = 0.85;

const setStreamLength = (min = null, max = null) => {
  clearAllIntervals();
  if (min) streamProperties.minLength = min;
  if (max) streamProperties.maxLength = max;
  setCanvasSize();
  startAnimation();
  updateReadout();
};

const setStreamSpeed = (slowestInterval = null, fastestInterval = null) => {
  if (slowestInterval && fastestInterval) {
    if (slowestInterval < fastestInterval) return;
  }
  clearAllIntervals();
  if (slowestInterval) streamProperties.slowestInterval = slowestInterval;
  if (fastestInterval) streamProperties.fastestInterval = fastestInterval;
  setCanvasSize();
  startAnimation();
  updateReadout();
};

const getTotalColumns = () => {
  return Math.floor(
    window.innerWidth / (columnWidthTweak * streamProperties.fontSize) +
      streamProperties.fontSize
  );
};

const randomColumn = () => {
  const columns = getTotalColumns();
  return (
    Math.floor(Math.random() * columns) *
      (columnWidthTweak * streamProperties.fontSize) +
    streamProperties.fontSize
  );
};

const randomYStart = () => {
  return -1 - streamProperties.fontSize * Math.ceil(Math.random() * 50);
};

const randomStreamLength = () => {
  return Math.floor(
    Math.random() *
      (streamProperties.maxLength - streamProperties.minLength + 1) +
      streamProperties.minLength
  );
};

const calculateMaxStreams = () => {
  const columns = getTotalColumns();

  const avgStreamLength =
    streamProperties.minLength + streamProperties.maxLength / 2;

  // How many streams of average length can fit vertically?
  let streamsToHeight = Math.floor(
    canvas.height / (avgStreamLength * streamProperties.fontSize)
  );
  if (streamsToHeight <= 0) streamsToHeight = 1;

  const totalStreams = Math.floor(
    columns * streamsToHeight * streamProperties.maxStreamAdjustment
  );

  streamProperties.maxStreams = totalStreams;
  activeStreamsSpan.innerText = totalStreams;
  return totalStreams;
};

const genInterval = () => {
  return (
    Math.floor(
      Math.random() *
        (streamProperties.slowestInterval -
          streamProperties.fastestInterval +
          1)
    ) + streamProperties.fastestInterval
  );
};

class Stream {
  constructor() {
    this.XLOC = randomColumn();
    this.YLOC = randomYStart();
    this.streamLength = randomStreamLength();
    this.firstChar = null;
    this.secondChar = null;
    this.interval = genInterval();
    this.lastUpdate = null;
    this.frameRef = null;
    this.animateMe = this.animateMe.bind(this);
  }

  animateMe(timestamp) {
    if (!this.lastUpdate) this.lastUpdate = timestamp;
    if (timestamp - this.lastUpdate >= this.interval) {
      updateAnStream(this);
      this.lastUpdate = timestamp;
    }

    this.frameRef = window.requestAnimationFrame(this.animateMe);
  }

  reset() {
    this.XLOC = randomColumn();
    this.YLOC = randomYStart();
    this.streamLength = randomStreamLength();
    this.firstChar = null;
    this.secondChar = null;
    this.interval = genInterval();
  }
}

/* Both interval mode and requestAnimationFrame modes use updateStreams */
/* to update positions & draw characters for each stream */
const updateStreams = (setOfStreams) => {
  setOfStreams.forEach((stream, idx) => {
    ctx.font = `${streamProperties.fontSize}px "Cutive Mono", monospace`;
    if (streamProperties.bold === true) {
      ctx.font = `bold ${streamProperties.fontSize}px "Cutive Mono", monospace`;
    }

    ctx.textBaseline = "top";

    // Affects width of fill/clear/fillText
    let rectTrim = 1 * streamProperties.fontSize;
    // Optional adjustment if bold font
    // if (streamProperties.bold === true) {
    //   rectTrim = 1 * streamProperties.fontSize;
    // }

    const fillRectTweak = (context, xloc, yloc, charPos) => {
      context.fillRect(
        Math.floor(xloc - 0.2 * streamProperties.fontSize),
        Math.floor(
          yloc -
            streamProperties.fontSize * charPos -
            0.1 * streamProperties.fontSize
        ),
        rectTrim,
        streamProperties.fontSize
      );
    };

    const clearRectTweak = (context, xloc, yloc, charPos) => {
      context.clearRect(
        Math.floor(xloc - 0.2 * streamProperties.fontSize),
        Math.floor(
          yloc -
            streamProperties.fontSize * charPos -
            0.1 * streamProperties.fontSize
        ),
        rectTrim,
        streamProperties.fontSize
      );
    };

    const textTweak = (context, character, xloc, yloc, charPos) => {
      context.fillText(
        character,
        Math.floor(xloc),
        Math.floor(yloc - streamProperties.fontSize * charPos),
        rectTrim
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
    fillRectTweak(ctx2, stream.XLOC, stream.YLOC, stream.streamLength);
    ctx.fillStyle = "black";
    fillRectTweak(ctx, stream.XLOC, stream.YLOC, stream.streamLength);

    // Shading with rgba() is detrimental to performance because
    // the browser has to calculate the blending on each draw
    if (streamProperties.shading) {
      for (let i = 4; i < stream.streamLength - 3; i++) {
        ctx2.fillStyle = "rgba(0, 0, 0, 0.075)";
        fillRectTweak(ctx2, stream.XLOC, stream.YLOC, i);
      }
    }

    // Chance to flip an already placed character
    if (Math.floor(Math.random() * 3) === 1) {
      let loc = Math.floor(Math.random() * (stream.streamLength - 4) + 4);

      ctx.fillStyle = "black";
      fillRectTweak(ctx, stream.XLOC, stream.YLOC, loc);

      ctx.fillStyle = `${streamProperties.settledColor}`;
      textTweak(ctx, getRandomChar(), stream.XLOC, stream.YLOC, loc);
    }

    // Third character
    if (stream.secondChar) {
      ctx.fillStyle = "black";
      fillRectTweak(ctx, stream.XLOC, stream.YLOC, 2);

      ctx.fillStyle = `${streamProperties.settledColor}`;
      textTweak(ctx, stream.secondChar, stream.XLOC, stream.YLOC, 2);
    }

    // Second Character
    if (stream.firstChar) {
      // Clear square to clean glow from first char
      ctx.fillStyle = "black";
      fillRectTweak(ctx, stream.XLOC, stream.YLOC, 1);

      ctx.fillStyle = `${streamProperties.secondColor}`;
      textTweak(ctx, stream.firstChar, stream.XLOC, stream.YLOC, 1);
      stream.secondChar = stream.firstChar;
    }

    // Paint area for new character black
    ctx.fillStyle = "black";
    fillRectTweak(ctx, stream.XLOC, stream.YLOC, 0);

    // Clear the shadow layer at the same spot
    clearRectTweak(ctx2, stream.XLOC, stream.YLOC, 0);

    // First (new) character
    const randNum = Math.floor(Math.random() * characters.length);
    stream.firstChar = characters.charAt(randNum);
    ctx.fillStyle = `${streamProperties.initialColor}`;
    textTweak(ctx, stream.firstChar, stream.XLOC, stream.YLOC, 0);

    // Set YLOC for next draw interval...
    // ... or send to top if entire stream off page
    stream.YLOC += streamProperties.fontSize;
    if (
      stream.YLOC >
      canvas.offsetHeight + streamProperties.fontSize * stream.streamLength
    ) {
      stream.reset();
    }
  });
};

/* Stops any intervals and/or requestAnimationFrame() requests */
/* Does not clear canvas */
const clearAllIntervals = () => {
  streamIntervalStore.forEach((interval, idx) => {
    window.clearInterval(interval);
  });
  streamIntervalStore = [];
  window.clearInterval(generatingInterval);
  arrayOfStreamSets = [];

  window.clearInterval(newGeneratingInterval);
  controllerArr.forEach((controller) => {
    window.cancelAnimationFrame(controller.frameRef);
  });
  controllerArr = [];
};

/**/
////  "intervals" animation mode
/**/

let arrayOfStreamSets = [];
const fillStreams = () => {
  const numOfStreams = calculateMaxStreams();

  for (let i = 0; i < streamProperties.maxIntervals; i++) {
    arrayOfStreamSets.push(new Set());
  }

  for (let i = 0; i < numOfStreams; i++) {
    const randomSet = Math.floor(Math.random() * arrayOfStreamSets.length);

    const newStream = new Stream();

    arrayOfStreamSets[randomSet].add(newStream);
  }
};

let streamIntervalStore = [];
let generatingInterval;
const startGeneratingInterval = () => {
  generatingInterval = window.setInterval(() => {
    const length = streamIntervalStore.length;

    if (streamIntervalStore.length >= 100) {
      window.clearInterval(generatingInterval);
      return;
    } else if (arrayOfStreamSets[length].size === 0) {
      // If there are no items in the set we don't give it an interval...
      streamIntervalStore.push(null);
    } else {
      const min = streamProperties.fastestInterval;
      const max = streamProperties.slowestInterval;
      const randSpeed = Math.floor(Math.random() * (max - min + 1)) + min;
      let newInterval = window.setInterval(() => {
        updateStreams(arrayOfStreamSets[length]);
      }, randSpeed);
      streamIntervalStore.push(newInterval);
    }
  }, 150);
};

const genStreamsAndIntervals = () => {
  fillStreams();
  startGeneratingInterval();
  updateReadout();
};

/**/
////  end "intervals" animation mode
/**/

/**/
////  "requestAnimationFrame" animation mode
/**/

class StreamController {
  constructor() {
    this.interval = genInterval();
    this.lastUpdate = null;
    this.frameRef = null;
    this.animateMe = this.animateMe.bind(this);
    this.streams = new Set();
  }

  animateMe(timestamp) {
    if (!this.lastUpdate) this.lastUpdate = timestamp;
    if (timestamp - this.lastUpdate >= this.interval) {
      updateStreams(this.streams);
      this.lastUpdate = timestamp;
    }

    this.frameRef = window.requestAnimationFrame(this.animateMe);
  }
}

let controllerArr = [];
let newGeneratingInterval;
const generateAndRun = () => {
  for (let i = 0; i < 100; i++) {
    controllerArr.push(new StreamController());
  }

  const maxStreams = calculateMaxStreams();

  for (let i = 0; i < maxStreams; i++) {
    const rand = Math.floor(Math.random() * controllerArr.length);
    controllerArr[rand].streams.add(new Stream());
  }

  let i = 0;
  newGeneratingInterval = window.setInterval(() => {
    if (controllerArr[i].streams.size > 0) controllerArr[i].animateMe();
    i++;
    if (i === controllerArr.length) window.clearInterval(newGeneratingInterval);
  }, 250);

  updateReadout();
};

/**/
////  end "requestAnimationFrame" animation mode
/**/

// Start drawing - Depends on streamProperties.animationMode
const startAnimation = () => {
  setCanvasSize();
  if (streamProperties.animationMode === "requestAnimationFrame")
    generateAndRun();
  else if (streamProperties.animationMode === "intervals")
    genStreamsAndIntervals();
};
startAnimation();

// Disco Mode
const changeDiscoColors = (color1, color2, color3) => {
  if (color1) streamProperties.initialColor = color1;
  if (color2) streamProperties.secondColor = color2;
  if (color3) streamProperties.settledColor = color3;
};
let discoInterval;
const discoMode = () => {
  window.clearInterval(discoInterval);

  let currentTheme = 0;
  discoInterval = window.setInterval(() => {
    changeDiscoColors(
      themes[currentTheme].color1,
      themes[currentTheme].color2,
      themes[currentTheme].color3
    );
    currentTheme++;
    if (currentTheme === themes.length) currentTheme = 0;
  }, 250);
};
