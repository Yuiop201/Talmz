const freqMap = {
  A:13200, B:13400, C:13600, D:13800, E:14000,
  F:14200, G:14400, H:14600, I:14800, J:15000,
  K:15200, L:15400, M:15600, N:15800, O:16000
};

function playFreq(freq) {
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.frequency.value = freq;
  gain.gain.value = 0.3;

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.2);
}

function startEncoding() {
  const text = prompt("Enter text (A–O)").toUpperCase();
  
  let delay = 0;
  for (const char of text) {
    const freq = freqMap[char];
    if (freq) {
      setTimeout(() => playFreq(freq), delay);
      delay += 300; // 300ms spacing for clarity
    }
  }
}
