const freqMap = {
  18000:'A',18100:'B',18200:'C',18300:'D',18400:'E',
  18500:'F',18600:'G',18700:'H',18800:'I',18900:'J',
  19000:'K',19100:'L',19200:'M',19300:'N',19400:'O',
  19500:'P',19600:'Q',19700:'R',19800:'S',19900:'T',
  20000:'U',20100:'V',20200:'W',20300:'X',20400:'Y',20500:'Z'
};

let receivedText = "";

async function startDecoding() {
  const audioCtx = new AudioContext();
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const source = audioCtx.createMediaStreamSource(stream);
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 4096;

  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  source.connect(analyser);

  function detectFrequency() {
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

    let closest = null;
    let minDiff = Infinity;

    for (let f in freqMap) {
      let diff = Math.abs(freq - f);
      if (diff < minDiff) {
        minDiff = diff;
        closest = f;
      }
    }

    if (maxAmp > 120 && minDiff < 30) {
      receivedText += freqMap[closest];
      document.getElementById("output").innerText = receivedText;
    }

    requestAnimationFrame(detectFrequency);
  }

  detectFrequency();
}

document.getElementById("start").onclick = startDecoding;
