class DigitalRain {
  constructor(canvasContainer) {
    this.canvasContainer = canvasContainer;
    this.canvas = null;
    this.canvas2 = null;
    this.ctx = null;
    this.ctx2 = null;

    this.resizeTimer;

    this.animationMode = "requestAnimationFrame";

    this.characters =
      "MATRIXMATRIXMATRIXMATRIXMAØ1Ø1Ø1Ø1Ø#$%@&#$%@&ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ";

    this.initialColor = "#e4e6e3";
    this.secondColor = "#6cfe6b";
    this.settledColor = "#00dd00";

    this.bold = true;
    this.shading = true;

    this.fontSize = 20;

    this.minLength = 5;
    this.maxLength = 20;

    this.slowestInterval = 500;
    this.fastestInterval = 50;

    this.rampUp = 15000;

    this.totalIntervals = 100;
    this.totalStreamControllers = 100;

    this.columnWidthTweak = 0.85;

    this.totalStreams = null;

    this.totalStreamMultiplier = 1;

    // Perhaps we could check if the user has a stored
    // "themes" object we can load, if not load defaults
    this.themes = [
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

    this.discoInterval;

    this.arrayOfStreamSets = [];
    this.streamIntervalStore = [];
    this.generatingInterval;

    this.controllerArr = [];
    this.newGeneratingInterval;
  }

  setupCanvas = async () => {
    let fontLoaded = false;
    document.fonts.forEach((item) => {
      if (item.family === "Cutive Mono") fontLoaded = true;
    });

    if (!fontLoaded) {
      const fontFile = new FontFace(
        "Cutive Mono",
        "url(https://fonts.gstatic.com/s/cutivemono/v14/m8JWjfRfY7WVjVi2E-K9H6RCTm4.woff2)"
      );

      document.fonts.add(fontFile);

      fontFile.load();
    }

    const canvasContainer = this.canvasContainer;
    canvasContainer.style.position = "relative";
    canvasContainer.style.backgroundColor = "black";

    this.canvas = document.createElement("canvas");
    this.canvas.style.display = "block";
    this.ctx = this.canvas.getContext("2d");

    this.canvas2 = document.createElement("canvas");
    this.canvas2.style.display = "block";
    this.canvas2.style.cssText = `position: absolute; top: 0; left: 0; z-index: 10`;
    this.ctx2 = this.canvas2.getContext("2d");

    canvasContainer.insertAdjacentElement("afterbegin", this.canvas2);
    canvasContainer.insertAdjacentElement("afterbegin", this.canvas);

    this.startAnimation();

    const resizeObserver = new ResizeObserver((entries) => {
      window.clearInterval(this.resizeTimer);
      this.resizeTimer = window.setTimeout(() => {
        this.setCanvasSize(
          Math.ceil(entries[0].contentRect.width),
          Math.ceil(entries[0].contentRect.height)
        );
        this.startAnimation();
      }, 750);
    });

    resizeObserver.observe(canvasContainer);
  };

  setCanvasSize = (width, height) => {
    this.canvas.width = width;
    this.canvas.height = height;

    this.canvas2.width = width;
    this.canvas2.height = height;

    this.ctx.translate(this.canvas.width, 0);
    this.ctx.scale(-1, 1);
    this.ctx2.translate(this.canvas2.width, 0);
    this.ctx2.scale(-1, 1);

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  };

  setTheme = (themeName) => {
    this.themes.forEach((theme) => {
      if (theme.name === themeName.toLowerCase()) {
        this.changeStreamColors(theme.color1, theme.color2, theme.color3);
      }
    });
  };

  changeStreamColors = (color1, color2, color3) => {
    window.clearInterval(this.discoInterval);
    if (color1) this.initialColor = color1;
    if (color2) this.secondColor = color2;
    if (color3) this.settledColor = color3;
  };

  setFontSize = (fontSize) => {
    if (fontSize < 5) {
      this.fontSize = 5;
    } else if (fontSize > 100) {
      this.fontSize = 100;
    } else {
      this.fontSize = fontSize;
    }
    this.setCanvasSize(
      this.canvasContainer.offsetWidth,
      this.canvasContainer.offsetHeight
    );
    this.startAnimation();
  };

  changeAnimationMode = (animationMode) => {
    if (
      animationMode !== "intervals" &&
      animationMode !== "requestAnimationFrame"
    )
      return;
    else {
      this.animationMode = animationMode;

      this.setCanvasSize(
        this.canvasContainer.offsetWidth,
        this.canvasContainer.offsetHeight
      );
      this.startAnimation();
    }
  };

  setTotalStreamMultiplier = (value) => {
    this.totalStreamMultiplier = value;
    this.startAnimation();
  };

  setStreamLength = (min = null, max = null) => {
    if (min) this.minLength = min;
    if (max) this.maxLength = max;

    this.startAnimation();
  };

  setStreamSpeed = (slowestInterval = null, fastestInterval = null) => {
    if (slowestInterval && fastestInterval) {
      if (slowestInterval < fastestInterval) return;
    }

    if (slowestInterval) this.slowestInterval = slowestInterval;
    if (fastestInterval) this.fastestInterval = fastestInterval;

    this.startAnimation();
  };

  getTotalColumns = () => {
    return Math.floor(
      this.canvasContainer.offsetWidth /
        (this.columnWidthTweak * this.fontSize) +
        this.fontSize
    );
  };

  randomColumn = () => {
    const columns = this.getTotalColumns();

    return (
      Math.floor(Math.random() * columns) *
        (this.columnWidthTweak * this.fontSize) +
      this.fontSize
    );
  };

  randomYStart = () => {
    return -1 - this.fontSize * Math.ceil(Math.random() * 50);
  };

  randomStreamLength = () => {
    return Math.floor(
      Math.random() * (this.maxLength - this.minLength + 1) + this.minLength
    );
  };

  calculateTotalStreams = () => {
    const columns = this.getTotalColumns();

    const avgStreamLength = this.minLength + this.maxLength / 2;

    // How many streams of average length can fit vertically?
    let streamsToHeight = Math.floor(
      this.canvas.height / (avgStreamLength * this.fontSize)
    );
    if (streamsToHeight <= 0) streamsToHeight = 1;

    const totalStreams = Math.floor(
      columns * streamsToHeight * this.totalStreamMultiplier
    );

    this.totalStreams = totalStreams;

    return totalStreams;
  };

  genInterval = () => {
    return (
      Math.floor(
        Math.random() * (this.slowestInterval - this.fastestInterval + 1)
      ) + this.fastestInterval
    );
  };

  /* Both interval mode and requestAnimationFrame modes use updateStreams */
  /* to update positions & draw characters for each stream */
  updateStreams = (setOfStreams) => {
    setOfStreams.forEach((stream, idx) => {
      this.ctx.font = `${this.fontSize}px "Cutive Mono", monospace`;
      if (this.bold === true) {
        this.ctx.font = `bold ${this.fontSize}px "Cutive Mono", monospace`;
      }

      this.ctx.textBaseline = "top";

      // Affects width of fill/clear/fillText
      let rectTrim = 1 * this.fontSize;
      // Optional adjustment if bold font
      // if (streamProperties.bold === true) {
      //   rectTrim = 1 * streamProperties.fontSize;
      // }

      const fillRectTweak = (context, xloc, yloc, charPos) => {
        context.fillRect(
          Math.floor(xloc - 0.2 * this.fontSize),
          Math.floor(yloc - this.fontSize * charPos - 0.1 * this.fontSize),
          rectTrim,
          this.fontSize
        );
      };

      const clearRectTweak = (context, xloc, yloc, charPos) => {
        context.clearRect(
          Math.floor(xloc - 0.2 * this.fontSize),
          Math.floor(yloc - this.fontSize * charPos - 0.1 * this.fontSize),
          rectTrim,
          this.fontSize
        );
      };

      const textTweak = (context, character, xloc, yloc, charPos) => {
        context.fillText(
          character,
          Math.floor(xloc),
          Math.floor(yloc - this.fontSize * charPos),
          rectTrim
        );
      };

      const getRandomChar = () => {
        const randNum = Math.floor(Math.random() * this.characters.length);
        return this.characters.charAt(randNum);
      };

      /*
      Think of the end of the stream being at the top of the code here...
    */

      // Clean up at the end of the stream
      this.ctx2.fillStyle = "black";
      fillRectTweak(this.ctx2, stream.XLOC, stream.YLOC, stream.streamLength);
      this.ctx.fillStyle = "black";
      fillRectTweak(this.ctx, stream.XLOC, stream.YLOC, stream.streamLength);

      // Shading with rgba() is detrimental to performance because
      // the browser has to calculate the blending on each draw
      if (this.shading) {
        for (let i = 4; i < stream.streamLength - 3; i++) {
          this.ctx2.fillStyle = "rgba(0, 0, 0, 0.075)";
          fillRectTweak(this.ctx2, stream.XLOC, stream.YLOC, i);
        }
      }

      // Chance to flip an already placed character
      if (Math.floor(Math.random() * 3) === 1) {
        let loc = Math.floor(Math.random() * (stream.streamLength - 4) + 4);

        this.ctx.fillStyle = "black";
        fillRectTweak(this.ctx, stream.XLOC, stream.YLOC, loc);

        this.ctx.fillStyle = `${this.settledColor}`;
        textTweak(this.ctx, getRandomChar(), stream.XLOC, stream.YLOC, loc);
      }

      // Third character
      if (stream.secondChar) {
        this.ctx.fillStyle = "black";
        fillRectTweak(this.ctx, stream.XLOC, stream.YLOC, 2);

        this.ctx.fillStyle = `${this.settledColor}`;
        textTweak(this.ctx, stream.secondChar, stream.XLOC, stream.YLOC, 2);
      }

      // Second Character
      if (stream.firstChar) {
        // Clear square to clean glow from first char
        this.ctx.fillStyle = "black";
        fillRectTweak(this.ctx, stream.XLOC, stream.YLOC, 1);

        this.ctx.fillStyle = `${this.secondColor}`;
        textTweak(this.ctx, stream.firstChar, stream.XLOC, stream.YLOC, 1);
        stream.secondChar = stream.firstChar;
      }

      // Paint area for new character black
      this.ctx.fillStyle = "black";
      fillRectTweak(this.ctx, stream.XLOC, stream.YLOC, 0);

      // Clear the shadow layer at the same spot
      clearRectTweak(this.ctx2, stream.XLOC, stream.YLOC, 0);

      // First (new) character
      const randNum = Math.floor(Math.random() * this.characters.length);
      stream.firstChar = this.characters.charAt(randNum);
      this.ctx.fillStyle = `${this.initialColor}`;
      textTweak(this.ctx, stream.firstChar, stream.XLOC, stream.YLOC, 0);

      // Set YLOC for next draw interval...
      // ... or send to top if entire stream off page
      stream.YLOC += this.fontSize;
      if (
        stream.YLOC >
        this.canvas.offsetHeight + this.fontSize * stream.streamLength
      ) {
        stream.reset(
          this.randomColumn(),
          this.randomYStart(),
          this.randomStreamLength()
        );
      }
    });
  };

  /* Stops any intervals and/or requestAnimationFrame() requests */
  /* Does not clear canvas */
  clearAllIntervals = () => {
    this.streamIntervalStore.forEach((interval, idx) => {
      window.clearInterval(interval);
    });
    this.streamIntervalStore = [];
    window.clearInterval(this.generatingInterval);
    this.arrayOfStreamSets = [];

    window.clearInterval(this.newGeneratingInterval);
    this.controllerArr.forEach((controller) => {
      window.cancelAnimationFrame(controller.frameRef);
    });
    this.controllerArr = [];
    window.clearInterval(this.discoInterval);
  };

  /**/
  ////  "intervals" animation mode
  /**/

  fillStreams = () => {
    const numOfStreams = this.calculateTotalStreams();

    for (let i = 0; i < this.totalIntervals; i++) {
      this.arrayOfStreamSets.push(new Set());
    }

    for (let i = 0; i < numOfStreams; i++) {
      const randomSet = Math.floor(
        Math.random() * this.arrayOfStreamSets.length
      );

      const newStream = new Stream(
        this.randomColumn(),
        this.randomYStart(),
        this.randomStreamLength()
      );

      this.arrayOfStreamSets[randomSet].add(newStream);
    }
  };

  startGeneratingInterval = () => {
    const rampUpInterval = this.rampUp / this.totalIntervals;

    this.generatingInterval = window.setInterval(() => {
      const length = this.streamIntervalStore.length;

      if (this.streamIntervalStore.length >= this.totalIntervals) {
        window.clearInterval(this.generatingInterval);
        return;
      } else if (this.arrayOfStreamSets[length].size === 0) {
        // If there are no items in the set we don't give it an interval...
        this.streamIntervalStore.push(null);
      } else {
        const min = this.fastestInterval;
        const max = this.slowestInterval;
        const randSpeed = Math.floor(Math.random() * (max - min + 1)) + min;
        let newInterval = window.setInterval(() => {
          this.updateStreams(this.arrayOfStreamSets[length]);
        }, randSpeed);
        this.streamIntervalStore.push(newInterval);
      }
    }, rampUpInterval);
  };

  genStreamsAndIntervals = () => {
    this.fillStreams();
    this.startGeneratingInterval();
  };

  /**/
  ////  end "intervals" animation mode
  /**/

  /**/
  ////  "requestAnimationFrame" animation mode
  /**/

  generateAndRun = () => {
    for (let i = 0; i < this.totalStreamControllers; i++) {
      this.controllerArr.push(new StreamController(this.genInterval(), this));
    }

    const totalStreams = this.calculateTotalStreams();

    for (let i = 0; i < totalStreams; i++) {
      const rand = Math.floor(Math.random() * this.controllerArr.length);
      this.controllerArr[rand].streams.add(
        new Stream(
          this.randomColumn(),
          this.randomYStart(),
          this.randomStreamLength()
        )
      );
    }

    const rampUpInterval = this.rampUp / this.totalStreamControllers;
    let i = 0;
    this.newGeneratingInterval = window.setInterval(() => {
      if (this.controllerArr[i].streams.size > 0)
        this.controllerArr[i].animateMe();
      i++;
      if (i === this.controllerArr.length)
        window.clearInterval(this.newGeneratingInterval);
    }, rampUpInterval);
  };

  /**/
  ////  end "requestAnimationFrame" animation mode
  /**/

  // Start drawing - Depends on streamProperties.animationMode
  startAnimation = () => {
    this.clearAllIntervals();
    this.setCanvasSize(
      this.canvasContainer.offsetWidth,
      this.canvasContainer.offsetHeight
    );
    if (this.animationMode === "requestAnimationFrame") this.generateAndRun();
    else if (this.animationMode === "intervals") this.genStreamsAndIntervals();
  };
  // startAnimation();

  // Disco Mode
  changeDiscoColors = (color1, color2, color3) => {
    if (color1) this.initialColor = color1;
    if (color2) this.secondColor = color2;
    if (color3) this.settledColor = color3;
  };

  discoMode = () => {
    window.clearInterval(this.discoInterval);

    let currentTheme = 0;
    this.discoInterval = window.setInterval(() => {
      this.changeDiscoColors(
        this.themes[currentTheme].color1,
        this.themes[currentTheme].color2,
        this.themes[currentTheme].color3
      );
      currentTheme++;
      if (currentTheme === this.themes.length) currentTheme = 0;
    }, 250);
  };
}

class Stream {
  constructor(xloc, yloc, randomStreamLength) {
    this.XLOC = xloc;
    this.YLOC = yloc;
    this.streamLength = randomStreamLength;
    this.firstChar = null;
    this.secondChar = null;
  }

  reset(xloc, yloc, randomStreamLength) {
    this.XLOC = xloc;
    this.YLOC = yloc;
    this.streamLength = randomStreamLength;
    this.firstChar = null;
    this.secondChar = null;
  }
}

class StreamController {
  constructor(randInterval, digitalRain) {
    this.interval = randInterval;
    this.lastUpdate = null;
    this.frameRef = null;
    this.animateMe = this.animateMe.bind(this);
    this.streams = new Set();
    this.digitalRain = digitalRain;
  }

  animateMe(timestamp) {
    if (!this.lastUpdate) this.lastUpdate = timestamp;
    if (timestamp - this.lastUpdate >= this.interval) {
      this.digitalRain.updateStreams(this.streams);
      this.lastUpdate = timestamp;
    }

    this.frameRef = window.requestAnimationFrame(this.animateMe);
  }
}
