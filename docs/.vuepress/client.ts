import { defineClientConfig } from "vuepress/client";
import { h, onMounted, onUnmounted, ref } from "vue";

const MountainBg = {
  name: "MountainBg",
  setup() {
    const canvasRef = ref<HTMLCanvasElement>();
    let animationId = 0;
    let mouseX = 0.5;
    let mouseY = 0.5;

    const mountainLayers = [
      { color: "#1a1a2e", height: 0.35, speed: 0.02, amplitude: 80, frequency: 0.003 },
      { color: "#16213e", height: 0.40, speed: 0.04, amplitude: 70, frequency: 0.004 },
      { color: "#0f3460", height: 0.45, speed: 0.06, amplitude: 60, frequency: 0.005 },
      { color: "#1a5276", height: 0.50, speed: 0.08, amplitude: 50, frequency: 0.006 },
      { color: "#2e86ab", height: 0.55, speed: 0.10, amplitude: 40, frequency: 0.007 },
    ];

    const clouds: any[] = [];
    const stars: any[] = [];
    const waterParticles: any[] = [];

    function initClouds(w: number, h: number) {
      clouds.length = 0;
      for (let i = 0; i < 8; i++) {
        clouds.push({
          x: Math.random() * w,
          y: h * 0.08 + Math.random() * h * 0.2,
          width: 100 + Math.random() * 200,
          height: 30 + Math.random() * 50,
          speed: 0.2 + Math.random() * 0.5,
          opacity: 0.1 + Math.random() * 0.2,
        });
      }
    }

    function initStars(w: number, h: number) {
      stars.length = 0;
      for (let i = 0; i < 150; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h * 0.4,
          size: 0.5 + Math.random() * 2,
          opacity: Math.random(),
          speed: 0.005 + Math.random() * 0.02,
        });
      }
    }

    function initWater(w: number, h: number) {
      waterParticles.length = 0;
      const waterY = h * 0.7;
      for (let i = 0; i < 60; i++) {
        waterParticles.push({
          x: Math.random() * w,
          y: waterY + Math.random() * (h * 0.25),
          speed: 0.5 + Math.random() * 1.5,
          opacity: 0.1 + Math.random() * 0.3,
          size: 1 + Math.random() * 3,
        });
      }
    }

    function drawMountain(ctx: CanvasRenderingContext2D, w: number, h: number, layer: any, time: number, px: number, py: number) {
      const baseY = h * layer.height;
      const ox = px * layer.speed * 100;
      const oy = py * layer.speed * 50;
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w; x += 2) {
        const n1 = Math.sin((x + time * layer.speed * 50 + ox) * layer.frequency) * layer.amplitude;
        const n2 = Math.sin((x + time * layer.speed * 30 + ox) * layer.frequency * 2.5) * (layer.amplitude * 0.4);
        const n3 = Math.sin((x + time * layer.speed * 20 + ox) * layer.frequency * 5) * (layer.amplitude * 0.15);
        ctx.lineTo(x, baseY + n1 + n2 + n3 + oy);
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fillStyle = layer.color;
      ctx.fill();
    }

    function drawCloud(ctx: CanvasRenderingContext2D, c: any) {
      ctx.save();
      ctx.globalAlpha = c.opacity;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.ellipse(c.x, c.y, c.width * 0.5, c.height * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(c.x - c.width * 0.25, c.y + c.height * 0.1, c.width * 0.3, c.height * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(c.x + c.width * 0.25, c.y + c.height * 0.05, c.width * 0.35, c.height * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawStars(ctx: CanvasRenderingContext2D, time: number) {
      for (const s of stars) {
        const twinkle = Math.sin(time * s.speed * 100 + s.x) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.opacity * twinkle})`;
        ctx.fill();
      }
    }

    function drawMoon(ctx: CanvasRenderingContext2D, w: number, h: number) {
      const x = w * 0.8, y = h * 0.12, r = 30;
      const g = ctx.createRadialGradient(x, y, r * 0.5, x, y, r * 4);
      g.addColorStop(0, "rgba(255,255,230,0.3)");
      g.addColorStop(0.5, "rgba(255,255,230,0.1)");
      g.addColorStop(1, "rgba(255,255,230,0)");
      ctx.fillStyle = g;
      ctx.fillRect(x - r * 4, y - r * 4, r * 8, r * 8);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = "#ffeedd";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + 10, y - 5, r * 0.85, 0, Math.PI * 2);
      ctx.fillStyle = "#0a0a1a";
      ctx.fill();
    }

    function drawWater(ctx: CanvasRenderingContext2D, w: number, h: number, time: number, px: number) {
      const waterY = h * 0.7;
      const g = ctx.createLinearGradient(0, waterY, 0, h);
      g.addColorStop(0, "rgba(15,52,96,0.8)");
      g.addColorStop(0.5, "rgba(10,35,65,0.9)");
      g.addColorStop(1, "rgba(5,20,40,1)");
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w; x += 3) {
        const w1 = Math.sin((x + time * 80) * 0.02) * 5;
        const w2 = Math.sin((x + time * 60) * 0.035) * 3;
        const w3 = Math.sin((x + time * 100 + px * 50) * 0.015) * 4;
        ctx.lineTo(x, waterY + w1 + w2 + w3);
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fillStyle = g;
      ctx.fill();
      for (const p of waterParticles) {
        const shimmer = Math.sin(time * 3 + p.x * 0.01) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.size * 3, p.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.opacity * shimmer})`;
        ctx.fill();
      }
    }

    function drawForeground(ctx: CanvasRenderingContext2D, w: number, h: number, time: number) {
      const gy = h * 0.82;
      ctx.beginPath();
      ctx.moveTo(0, gy);
      for (let x = 0; x <= w; x += 5) {
        ctx.lineTo(x, gy + Math.sin((x + time * 20) * 0.01) * 3);
      }
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fillStyle = "#0a0a15";
      ctx.fill();
    }

    onMounted(() => {
      const canvas = canvasRef.value;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initClouds(canvas.width, canvas.height);
        initStars(canvas.width, canvas.height);
        initWater(canvas.width, canvas.height);
      };
      resize();
      window.addEventListener("resize", resize);

      const onMouseMove = (e: MouseEvent) => {
        mouseX = e.clientX / window.innerWidth;
        mouseY = e.clientY / window.innerHeight;
      };
      window.addEventListener("mousemove", onMouseMove);

      const startTime = Date.now();
      const loop = () => {
        const time = (Date.now() - startTime) / 1000;
        const px = (mouseX - 0.5) * 2;
        const py = (mouseY - 0.5) * 2;
        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);
        const sky = ctx.createLinearGradient(0, 0, 0, h * 0.7);
        sky.addColorStop(0, "#0a0a1a");
        sky.addColorStop(0.3, "#0d1b2a");
        sky.addColorStop(0.6, "#1b2838");
        sky.addColorStop(1, "#1a1a2e");
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, w, h);

        drawStars(ctx, time);
        drawMoon(ctx, w, h);

        for (const c of clouds) {
          drawCloud(ctx, c);
          c.x += c.speed;
          if (c.x > w + c.width) c.x = -c.width;
        }

        for (const layer of mountainLayers) {
          drawMountain(ctx, w, h, layer, time, px, py);
        }

        drawWater(ctx, w, h, time, px);
        drawForeground(ctx, w, h, time);

        for (const p of waterParticles) {
          p.x += p.speed;
          if (p.x > w) p.x = 0;
        }

        animationId = requestAnimationFrame(loop);
      };
      loop();

      onUnmounted(() => {
        cancelAnimationFrame(animationId);
        window.removeEventListener("resize", resize);
        window.removeEventListener("mousemove", onMouseMove);
      });
    });

    return () =>
      h("canvas", {
        ref: canvasRef,
        style: "position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;",
      });
  },
};

export default defineClientConfig({
  rootComponents: [MountainBg],
});
