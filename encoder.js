const TONE_FREQ = 1000; // 1 kHz
const BIT_0 = 150; // ms
const BIT_1 = 300; // ms
const BIT_GAP = 100; // ms between bits

function playTone(duration) {
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.frequency.value = TONE_FREQ;
  gain.gain.value = 0.3;

  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration / 1000);
}

function textToBinary(text) {
  let binary = '';
  for (const char of text) {
    binary += char.charCodeAt(0).toString(2).padStart(8, '0');
  }
  return binary;
}

function sendText() {
  const text = prompt("Enter text (ASCII)").toUpperCase();
  const binary = textToBinary(text);

  let delay = 0;
  for (const bit of binary) {
    const duration = bit === '0' ? BIT_0 : BIT_1;
    setTimeout(() => playTone(duration), delay);
    delay += duration + BIT_GAP;
  }
}