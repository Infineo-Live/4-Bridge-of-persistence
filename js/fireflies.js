(function () {
  const canvas = document.getElementById('firefly-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, flies = [];
  const COUNT = 55;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomBetween(a, b) { return a + Math.random() * (b - a); }

  function createFly() {
    return {
      x:     randomBetween(0, W),
      y:     randomBetween(0, H),
      r:     randomBetween(1.2, 2.8),
      alpha: 0,
      targetAlpha: randomBetween(0.4, 1),
      fadeDir: 1,
      fadeSpeed: randomBetween(0.005, 0.018),
      vx:    randomBetween(-0.35, 0.35),
      vy:    randomBetween(-0.35, 0.35),
      hue:   randomBetween(55, 100),   /* yellow-green range */
      glowR: randomBetween(6, 14),
    };
  }

  function init() {
    resize();
    flies = Array.from({ length: COUNT }, createFly);
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);

    for (const f of flies) {
      /* fade in/out */
      f.alpha += f.fadeDir * f.fadeSpeed;
      if (f.alpha >= f.targetAlpha) { f.fadeDir = -1; }
      if (f.alpha <= 0) {
        /* respawn elsewhere */
        Object.assign(f, createFly());
        f.alpha = 0;
      }

      /* drift */
      f.x += f.vx;
      f.y += f.vy;
      if (f.x < 0) f.x = W;
      if (f.x > W) f.x = 0;
      if (f.y < 0) f.y = H;
      if (f.y > H) f.y = 0;

      /* glow */
      const grd = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.glowR);
      grd.addColorStop(0,   `hsla(${f.hue}, 100%, 80%, ${f.alpha})`);
      grd.addColorStop(0.4, `hsla(${f.hue}, 90%, 60%, ${f.alpha * 0.6})`);
      grd.addColorStop(1,   `hsla(${f.hue}, 80%, 50%, 0)`);

      ctx.beginPath();
      ctx.arc(f.x, f.y, f.glowR, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      /* bright core */
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${f.hue}, 100%, 92%, ${f.alpha})`;
      ctx.fill();
    }

    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', resize);
  init();
  tick();
})();