const connectUI = (digitalrain) => {
  // const mainDetailsDiv = document.getElementById("details");
  // const numOfIntervalsSpan = document.getElementById("num-intervals");

  const toggleDetailsButton = document.getElementById("toggle-details-btn");
  toggleDetailsButton.addEventListener("click", () => {
    const allDetails = document.querySelectorAll("#details div");
    allDetails.forEach((element) => {
      element.classList.toggle("d-none");
    });
    toggleDetailsButton.classList.toggle("fade-button");
  });

  const useReqAnimFrameRadio = document.getElementById(
    "use-reqAnimFrame-radio"
  );
  const useIntervalsRadio = document.getElementById("use-intervals-radio");
  [useReqAnimFrameRadio, useIntervalsRadio].forEach((radioInput) => {
    radioInput.addEventListener("change", (e) => {
      digitalrain.changeAnimationMode(e.target.value);
    });
  });

  const activeStreamsSpan = document.getElementById("active-streams");
  const adjustTotalStreamSpan = document.getElementById("adjust-total");
  const adjustTotalStreamSlider = document.getElementById(
    "adjust-total-streams"
  );
  let adjustTotalStreamTimeout;
  adjustTotalStreamSlider.addEventListener("input", (e) => {
    adjustTotalStreamSpan.innerText = parseInt(e.target.value * 100);
    window.clearTimeout(adjustTotalStreamTimeout);
    adjustTotalStreamTimeout = window.setTimeout(() => {
      digitalrain.setTotalStreamMultiplier(parseFloat(e.target.value));
      updateReadout();
    }, 750);
  });

  const streamMinLengthSpan = document.getElementById("min-length");
  const setMinLenSlider = document.getElementById("set-min-length");
  const streamMaxLengthSpan = document.getElementById("max-length");
  const setMaxLenSlider = document.getElementById("set-max-length");
  let setMinLenTimeout;
  setMinLenSlider.addEventListener("input", (e) => {
    window.clearTimeout(setMinLenTimeout);
    if (parseInt(e.target.value) > parseInt(setMaxLenSlider.value))
      e.target.value = setMaxLenSlider.value;
    streamMinLengthSpan.innerText = e.target.value;
    setMinLenTimeout = window.setTimeout(() => {
      digitalrain.setStreamLength(parseInt(e.target.value));
      updateReadout();
    }, 750);
  });
  let setMaxLenTimeout;
  setMaxLenSlider.addEventListener("input", (e) => {
    window.clearTimeout(setMaxLenTimeout);
    if (parseInt(e.target.value) < parseInt(setMinLenSlider.value))
      e.target.value = setMinLenSlider.value;
    streamMaxLengthSpan.innerText = e.target.value;
    setMaxLenTimeout = window.setTimeout(() => {
      digitalrain.setStreamLength(null, parseInt(e.target.value));
      updateReadout();
    }, 750);
  });

  const fastestIntervalSpan = document.getElementById("fastest-interval");
  const setFastestSlider = document.getElementById("set-fastest-interval");
  const slowestIntervalSpan = document.getElementById("slowest-interval");
  const setSlowestSlider = document.getElementById("set-slowest-interval");
  let setFastestTimeout;
  setFastestSlider.addEventListener("input", (e) => {
    window.clearTimeout(setFastestTimeout);
    if (parseInt(e.target.value) > parseInt(setSlowestSlider.value))
      e.target.value = setSlowestSlider.value;
    fastestIntervalSpan.innerText = e.target.value;
    setFastestTimeout = window.setTimeout(() => {
      digitalrain.setStreamSpeed(null, parseInt(e.target.value));
    }, 750);
  });
  let setSlowestTimeout;
  setSlowestSlider.addEventListener("input", (e) => {
    window.clearTimeout(setSlowestTimeout);
    if (parseInt(e.target.value) < parseInt(setFastestSlider.value))
      e.target.value = setFastestSlider.value;
    slowestIntervalSpan.innerText = e.target.value;
    setSlowestTimeout = window.setTimeout(() => {
      digitalrain.setStreamSpeed(parseInt(e.target.value), null);
    }, 750);
  });

  const streamFontSizeSpan = document.getElementById("font-size");
  const setFontSizeSlider = document.getElementById("set-font-size");
  let getFontTimeout;
  setFontSizeSlider.addEventListener("input", (e) => {
    streamFontSizeSpan.innerText = setFontSizeSlider.value;
    window.clearInterval(getFontTimeout);
    getFontTimeout = window.setTimeout(() => {
      digitalrain.setFontSize(parseInt(setFontSizeSlider.value));
      updateReadout();
    }, 1500);
  });

  const toggleBoldCheckbox = document.getElementById("bold-checkbox");
  const toggleShadingCheckbox = document.getElementById("shading-checkbox");
  toggleBoldCheckbox.addEventListener("change", (e) => {
    if (e.target.checked) digitalrain.bold = true;
    else digitalrain.bold = false;
    digitalrain.startAnimation();
  });
  toggleShadingCheckbox.addEventListener("change", (e) => {
    if (e.target.checked) digitalrain.shading = true;
    else digitalrain.shading = false;
  });

  const useTheseColorsBtn = document.getElementById("use-these-colors");
  useTheseColorsBtn.addEventListener("click", () => {
    const color1 = document.getElementById("color1").value;
    const color2 = document.getElementById("color2").value;
    const color3 = document.getElementById("color3").value;
    digitalrain.changeStreamColors(color1, color2, color3);
  });

  const updateReadout = () => {
    activeStreamsSpan.innerText = digitalrain.totalStreams;
    streamMaxLengthSpan.innerText = digitalrain.maxLength;
    streamMinLengthSpan.innerText = digitalrain.minLength;
    // numOfIntervalsSpan.innerText = digitalrain.totalIntervals;
    streamFontSizeSpan.innerText = digitalrain.fontSize;
    fastestIntervalSpan.innerText = digitalrain.fastestInterval;
    slowestIntervalSpan.innerText = digitalrain.slowestInterval;
    adjustTotalStreamSpan.innerText = parseInt(
      adjustTotalStreamSlider.value * 100
    );
  };

  // Wait for a sec for total streams to update
  window.setTimeout(() => updateReadout()), 250;
};

const newRain = new DigitalRain(document.getElementById(`canvas-container`));

connectUI(newRain);

newRain.setupCanvas();
newRain.startAnimation();
