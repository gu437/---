<template>
  <canvas ref="canvasRef" class="mountain-bg" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const canvasRef = ref<HTMLCanvasElement>();

let animationId = 0;
let mouseX = 0.5;
let mouseY = 0.5;

// 山脉层配置
const mountainLayers = [
  { color: "#1a1a2e", height: 0.45, speed: 0.02, amplitude: 80, frequency: 0.003 },
  { color: "#16213e", height: 0.50, speed: 0.04, amplitude: 70, frequency: 0.004 },
  { color: "#0f3460", height: 0.55, speed: 0.06, amplitude: 60, frequency: 0.005 },
  { color: "#1a5276", height: 0.60, speed: 0.08, amplitude: 50, frequency: 0.006 },
  { color: "#2e86ab", height: 0.65, speed: 0.10, amplitude: 40, frequency: 0.007 },
];

// 云朵配置
const clouds: { x: number; y: number; width: number; height: number; speed: number; opacity: number }[] = [];

// 星星配置
const stars: { x: number; y: number; size: number; opacity: number; speed: number }[] = [];

// 流水粒子
const waterParticles: { x: number; y: number; speed: number; opacity: number; size: number }[] = [];

function initClouds(width: number, height: number) {
  clouds.length = 0;
  for (let i = 0; i < 8; i++) {
    clouds.push({
      x: Math.random() * width,
      y: height * 0.1 + Math.random() * height * 0.25,
      width: 100 + Math.random() * 200,
      height: 30 + Math.random() * 50,
      speed: 0.2 + Math.random() * 0.5,
      opacity: 0.1 + Math.random() * 0.2,
    });
  }
}

function initStars(width: number, height: number) {
  stars.length = 0;
  for (let i = 0; i < 150; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height * 0.5,
      size: 0.5 + Math.random() * 2,
      opacity: Math.random(),
      speed: 0.005 + Math.random() * 0.02,
    });
  }
}

function initWaterParticles(width: number, height: number) {
  waterParticles.length = 0;
  const waterY = height * 0.75;
  for (let i = 0; i < 60; i++) {
    waterParticles.push({
      x: Math.random() * width,
      y: waterY + Math.random() * (height * 0.2),
      speed: 0.5 + Math.random() * 1.5,
      opacity: 0.1 + Math.random() * 0.3,
      size: 1 + Math.random() * 3,
    });
  }
}

function drawMountain(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  layer: (typeof mountainLayers)[0],
  time: number,
  parallaxX: number,
  parallaxY: number
) {
  const baseY = height * layer.height;
  const offsetX = parallaxX * layer.speed * 100;
  const offsetY = parallaxY * layer.speed * 50;

  ctx.beginPath();
  ctx.moveTo(0, height);

  for (let x = 0; x <= width; x += 2) {
    const noise1 = Math.sin((x + time * layer.speed * 50 + offsetX) * layer.frequency) * layer.amplitude;
    const noise2 = Math.sin((x + time * layer.speed * 30 + offsetX) * layer.frequency * 2.5) * (layer.amplitude * 0.4);
    const noise3 = Math.sin((x + time * layer.speed * 20 + offsetX) * layer.frequency * 5) * (layer.amplitude * 0.15);
    const y = baseY + noise1 + noise2 + noise3 + offsetY;
    ctx.lineTo(x, y);
  }

  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fillStyle = layer.color;
  ctx.fill();
}

function drawCloud(ctx: CanvasRenderingContext2D, cloud: (typeof clouds)[0]) {
  ctx.save();
  ctx.globalAlpha = cloud.opacity;
  ctx.fillStyle = "#ffffff";

  // 画多个椭圆组成云朵
  const cx = cloud.x;
  const cy = cloud.y;
  const w = cloud.width;
  const h = cloud.height;

  ctx.beginPath();
  ctx.ellipse(cx, cy, w * 0.5, h * 0.4, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(cx - w * 0.25, cy + h * 0.1, w * 0.3, h * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(cx + w * 0.25, cy + h * 0.05, w * 0.35, h * 0.35, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawStars(ctx: CanvasRenderingContext2D, time: number) {
  for (const star of stars) {
    const twinkle = Math.sin(time * star.speed * 100 + star.x) * 0.5 + 0.5;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`;
    ctx.fill();
  }
}

function drawMoon(ctx: CanvasRenderingContext2D, width: number, height: number, time: number) {
  const x = width * 0.8;
  const y = height * 0.15;
  const radius = 30;

  // 月光光晕
  const gradient = ctx.createRadialGradient(x, y, radius * 0.5, x, y, radius * 4);
  gradient.addColorStop(0, "rgba(255, 255, 230, 0.3)");
  gradient.addColorStop(0.5, "rgba(255, 255, 230, 0.1)");
  gradient.addColorStop(1, "rgba(255, 255, 230, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(x - radius * 4, y - radius * 4, radius * 8, radius * 8);

  // 月亮
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = "#ffeedd";
  ctx.fill();

  // 月亮阴影（新月效果）
  ctx.beginPath();
  ctx.arc(x + 10, y - 5, radius * 0.85, 0, Math.PI * 2);
  ctx.fillStyle = "#0a0a1a";
  ctx.fill();
}

function drawWater(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  parallaxX: number
) {
  const waterY = height * 0.75;

  // 水面渐变
  const gradient = ctx.createLinearGradient(0, waterY, 0, height);
  gradient.addColorStop(0, "rgba(15, 52, 96, 0.8)");
  gradient.addColorStop(0.5, "rgba(10, 35, 65, 0.9)");
  gradient.addColorStop(1, "rgba(5, 20, 40, 1)");

  // 水面波纹
  ctx.beginPath();
  ctx.moveTo(0, height);
  for (let x = 0; x <= width; x += 3) {
    const wave1 = Math.sin((x + time * 80) * 0.02) * 5;
    const wave2 = Math.sin((x + time * 60) * 0.035) * 3;
    const wave3 = Math.sin((x + time * 100 + parallaxX * 50) * 0.015) * 4;
    ctx.lineTo(x, waterY + wave1 + wave2 + wave3);
  }
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  // 水面反光
  for (const particle of waterParticles) {
    const shimmer = Math.sin(time * 3 + particle.x * 0.01) * 0.5 + 0.5;
    ctx.beginPath();
    ctx.ellipse(particle.x, particle.y, particle.size * 3, particle.size * 0.5, 0, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity * shimmer})`;
    ctx.fill();
  }
}

function drawForegroundGrass(ctx: CanvasRenderingContext2D, width: number, height: number, time: number) {
  const grassY = height * 0.85;

  // 深色前景
  ctx.beginPath();
  ctx.moveTo(0, grassY);
  for (let x = 0; x <= width; x += 5) {
    const wave = Math.sin((x + time * 20) * 0.01) * 3;
    ctx.lineTo(x, grassY + wave);
  }
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fillStyle = "#0a0a15";
  ctx.fill();
}

function animate(ctx: CanvasRenderingContext2D, width: number, height: number, time: number) {
  const parallaxX = (mouseX - 0.5) * 2;
  const parallaxY = (mouseY - 0.5) * 2;

  // 清空画布
  ctx.clearRect(0, 0, width, height);

  // 天空渐变
  const skyGradient = ctx.createLinearGradient(0, 0, 0, height * 0.7);
  skyGradient.addColorStop(0, "#0a0a1a");
  skyGradient.addColorStop(0.3, "#0d1b2a");
  skyGradient.addColorStop(0.6, "#1b2838");
  skyGradient.addColorStop(1, "#1a1a2e");
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, width, height);

  // 画星星
  drawStars(ctx, time);

  // 画月亮
  drawMoon(ctx, width, height, time);

  // 画云朵
  for (const cloud of clouds) {
    drawCloud(ctx, cloud);
    cloud.x += cloud.speed;
    if (cloud.x > width + cloud.width) {
      cloud.x = -cloud.width;
    }
  }

  // 画山脉层
  for (const layer of mountainLayers) {
    drawMountain(ctx, width, height, layer, time, parallaxX, parallaxY);
  }

  // 画水面
  drawWater(ctx, width, height, time, parallaxX);

  // 画前景草地
  drawForegroundGrass(ctx, width, height, time);

  // 更新水粒子
  for (const particle of waterParticles) {
    particle.x += particle.speed;
    if (particle.x > width) {
      particle.x = 0;
    }
  }
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
    initWaterParticles(canvas.width, canvas.height);
  };

  resize();
  window.addEventListener("resize", resize);

  // 鼠标移动事件
  const onMouseMove = (e: MouseEvent) => {
    mouseX = e.clientX / window.innerWidth;
    mouseY = e.clientY / window.innerHeight;
  };
  window.addEventListener("mousemove", onMouseMove);

  // 动画循环
  let startTime = Date.now();
  const loop = () => {
    const time = (Date.now() - startTime) / 1000;
    animate(ctx, canvas.width, canvas.height, time);
    animationId = requestAnimationFrame(loop);
  };
  loop();

  onUnmounted(() => {
    cancelAnimationFrame(animationId);
    window.removeEventListener("resize", resize);
    window.removeEventListener("mousemove", onMouseMove);
  });
});
</script>

<style scoped>
.mountain-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}
</style>
