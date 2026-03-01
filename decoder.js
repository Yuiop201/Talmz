const freqMap = {
  13200:'A', 13400:'B', 13600:'C', 13800:'D', 14000:'E',
  14200:'F', 14400:'G', 14600:'H', 14800:'I', 15000:'J',
  15200:'K', 15400:'L', 15600:'M', 15800:'N', 16000:'O'
};

let receivedText = "";

async function startDecoding() {
  const audioCtx = new AudioContext();
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  document.getElementById("output").innerText = "Decoder running...";

  const source = audioCtx.createMediaStreamSource(stream);
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 4096;

  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  source.connect(analyser);

  function detectFreq() {
    analyser.getByteFrequencyData(dataArray);

    let maxAmp = 0;
    let maxIndex = 0;

    for (let i = 0; i < dataArray.length; i++) {
      if (dataArray[i] > maxAmp) {
        maxAmp = dataArray[i];
        maxIndex = i;
      }
    }

    const freq = maxIndex * (audioCtx.sampleRate / analyser.fftSize);

    // Find best match among 13200–16000
    let bestFreq = null;
    let minDiff = 9999;

    for (let f in freqMap) {
      let diff = Math.abs(freq - f);
      if (diff < minDiff) {
        minDiff = diff;
        bestFreq = f;
      }
    }

    // threshold rules
    if (maxAmp > 100 && minDiff < 120) {
      const char = freqMap[bestFreq];
      if (char) {
        receivedText += char;
        document.getElementById("output").innerText = receivedText;
      }
    }

    requestAnimationFrame(detectFreq);
  }

  detectFreq();
}

document.getElementById("start").onclick = startDecoding;
