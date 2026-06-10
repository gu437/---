<template>
  <div class="mountain-bg-wrapper"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";

onMounted(() => {
  const canvas = document.createElement("canvas");
  canvas.style.cssText =
    "position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;";
  document.body.prepend(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width: number;
  let height: number;
  let mouseX = 0;
  let mouseY = 0;
  let animationId: number;

  const resize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };

  const drawBackground = () => {
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#0a1628");
    gradient.addColorStop(0.3, "#1a2a4a");
    gradient.addColorStop(0.6, "#2d3e5c");
    gradient.addColorStop(1, "#1a2a3a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  };

  const drawStars = () => {
    const starCount = 150;
    for (let i = 0; i < starCount; i++) {
      const x = (i * 137.508) % width;
      const y = (i * 97.321) % (height * 0.5);
      const size = (i % 3) + 1;
      const opacity = 0.5 + 0.5 * Math.sin(Date.now() * 0.001 + i);
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.fill();
    }
  };

  const drawMoon = () => {
    const moonX = width * 0.8;
    const moonY = height * 0.15;
    const moonRadius = 40;

    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius * 1.5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 200, 0.1)";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#f5f5dc";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(moonX + 15, moonY - 5, moonRadius * 0.85, 0, Math.PI * 2);
    ctx.fillStyle = "#0a1628";
    ctx.fill();
  };

  const drawMountainLayer = (
    offset: number,
    color: string,
    heightFactor: number,
  ) => {
    ctx.beginPath();
    ctx.moveTo(0, height);

    for (let x = 0; x <= width; x += 10) {
      const y =
        height * heightFactor -
        Math.sin((x + offset) * 0.003) * 80 -
        Math.sin((x + offset) * 0.006) * 40 -
        Math.sin((x + offset) * 0.01) * 20;
      ctx.lineTo(x, y);
    }

    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  };

  const drawClouds = () => {
    const time = Date.now() * 0.0001;
    for (let i = 0; i < 5; i++) {
      const x = ((i * 300 + time * 100) % (width + 200)) - 100;
      const y = height * 0.2 + i * 40;
      ctx.fillStyle = `rgba(255, 255, 255, ${0.1 + i * 0.02})`;
      ctx.beginPath();
      ctx.ellipse(x, y, 80, 20, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawWater = () => {
    const waterY = height * 0.75;
    const gradient = ctx.createLinearGradient(0, waterY, 0, height);
    gradient.addColorStop(0, "rgba(20, 50, 80, 0.8)");
    gradient.addColorStop(1, "rgba(10, 30, 50, 0.9)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, waterY, width, height - waterY);

    const time = Date.now() * 0.001;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      for (let x = 0; x <= width; x += 20) {
        const y =
          waterY +
          20 +
          i * 15 +
          Math.sin(x * 0.02 + time + i) * 3 +
          Math.sin(x * 0.01 + time * 0.5) * 2;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    mouseX = (e.clientX / width - 0.5) * 20;
    mouseY = (e.clientY / height - 0.5) * 10;
  };

  const animate = () => {
    ctx.save();
    ctx.translate(mouseX * 0.5, mouseY * 0.5);

    drawBackground();
    drawStars();
    drawMoon();
    drawClouds();

    ctx.translate(-mouseX * 0.3, -mouseY * 0.2);
    drawMountainLayer(0, "#1a2a3a", 0.65);
    drawMountainLayer(100, "#1e3048", 0.6);
    drawMountainLayer(200, "#2a4060", 0.55);
    drawMountainLayer(300, "#3a5070", 0.5);
    drawMountainLayer(400, "#4a6080", 0.45);

    ctx.restore();
    drawWater();

    animationId = requestAnimationFrame(animate);
  };

  resize();
  animate();

  window.addEventListener("resize", resize);
  window.addEventListener("mousemove", handleMouseMove);

  onUnmounted(() => {
    cancelAnimationFrame(animationId);
    window.removeEventListener("resize", resize);
    window.removeEventListener("mousemove", handleMouseMove);
    canvas.remove();
  });
});
</script>

<style scoped>
.mountain-bg-wrapper {
  display: none;
}
</style>
