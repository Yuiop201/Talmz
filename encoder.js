function playFreq(freq) {
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  osc.frequency.value = freq;
  osc.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.2);
}

function startEncoding() {
  const text = prompt("Enter text:").toUpperCase();
  const freqMap = {
    A:18000,B:18100,C:18200,D:18300,E:18400,F:18500,G:18600,
    H:18700,I:18800,J:18900,K:19000,L:19100,M:19200,N:19300,
    O:19400,P:19500,Q:19600,R:19700,S:19800,T:19900,U:20000,
    V:20100,W:20200,X:20300,Y:20400,Z:20500
  };

  let delay = 0;
  for (const letter of text) {
    const freq = freqMap[letter];
    if (freq) setTimeout(() => playFreq(freq), delay);
    delay += 250;
  }
}
