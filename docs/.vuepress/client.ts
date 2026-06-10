import { defineClientConfig } from "vuepress/client";
import { onMounted, onUnmounted, ref, h } from "vue";

const ParticlesBg = {
  name: "ParticlesBg",
  setup() {
    let cleanup: (() => void) | null = null;

    onMounted(async () => {
      // 动态加载 tsparticles（避免 SSR 问题）
      const { tsParticles } = await import(
        "@tsparticles/engine" as string
      );
      const { loadSlim } = await import(
        "@tsparticles/slim" as string
      );

      await loadSlim(tsParticles);

      // 创建容器
      const container = document.createElement("div");
      container.id = "tsparticles-bg";
      container.style.cssText =
        "position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;";
      document.body.prepend(container);

      // 加载粒子配置
      const instance = await tsParticles.load({
        id: "tsparticles-bg",
        options: {
          fullScreen: false,
          fpsLimit: 60,
          particles: {
            number: {
              value: 80,
              density: { enable: true, width: 1920, height: 1080 },
            },
            color: { value: "#1e90ff" },
            links: {
              enable: true,
              distance: 150,
              color: "#1e90ff",
              opacity: 0.15,
              width: 1,
            },
            move: {
              enable: true,
              speed: 0.8,
              direction: "none",
              random: true,
              straight: false,
              outModes: { default: "out" },
            },
            size: {
              value: { min: 1, max: 3 },
              animation: {
                enable: true,
                speed: 2,
                minimumValue: 0.5,
                sync: false,
              },
            },
            opacity: {
              value: { min: 0.2, max: 0.6 },
              animation: {
                enable: true,
                speed: 0.5,
                minimumValue: 0.1,
                sync: false,
              },
            },
          },
          interactivity: {
            events: {
              onHover: { enable: true, mode: "grab" },
              resize: { enable: true },
            },
            modes: {
              grab: {
                distance: 180,
                links: { opacity: 0.35, color: "#1e90ff" },
              },
            },
          },
          detectRetina: true,
          background: { color: "transparent" },
        },
      });

      cleanup = () => {
        instance?.destroy();
        container.remove();
      };
    });

    onUnmounted(() => {
      cleanup?.();
    });

    return () => null;
  },
};

export default defineClientConfig({
  rootComponents: [ParticlesBg],
});
