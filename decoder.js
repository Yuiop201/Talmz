const FREQ_0 = 13200; // frequency for 0
const FREQ_1 = 15000; // frequency for 1
const BIT_DURATION = 250; // ms

function playFreq(freq) {
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.value = freq;
  gain.gain.value = 0.3;
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + BIT_DURATION / 1000);
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
    const freq = bit === '0' ? FREQ_0 : FREQ_1;
    setTimeout(() => playFreq(freq), delay);
    delay += BIT_DURATION;
  }
}