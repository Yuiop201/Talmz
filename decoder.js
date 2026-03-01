const TONE_FREQ = 1000;
const THRESHOLD = 0.01; // amplitude threshold

let receivedBits = '';
let receivedText = '';

async function startDecoding() {
  const audioCtx = new AudioContext();
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  const source = audioCtx.createMediaStreamSource(stream);
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;

  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  source.connect(analyser);

  let detecting = false;
  let startTime = 0;

  function detect() {
    analyser.getByteTimeDomainData(dataArray);

    // simple amplitude detection
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += Math.abs(dataArray[i] - 128);
    }

    const amp = sum / dataArray.length;

    if (amp > THRESHOLD * 128) {
      if (!detecting) {
        detecting = true;
        startTime = performance.now();
      }
    } else {
      if (detecting) {
        const duration = performance.now() - startTime;
        receivedBits += duration > 200 ? '1' : '0';

        // convert every 8 bits
        while (receivedBits.length >= 8) {
          const byte = receivedBits.slice(0, 8);
          receivedBits = receivedBits.slice(8);
          receivedText += String.fromCharCode(parseInt(byte, 2));
          document.getElementById('output').innerText = receivedText;
        }

        detecting = false;
      }
    }

    requestAnimationFrame(detect);
  }

  detect();
}

document.getElementById('start').onclick = startDecoding;