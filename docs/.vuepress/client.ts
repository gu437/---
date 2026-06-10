import { defineClientConfig } from "vuepress/client";
import { onMounted, onUnmounted } from "vue";
import * as THREE from "three";

/**
 * Three.js 中国风山水动画 - 仅作用于首页 Hero 区域
 * 层叠山峦 + 云雾 + 水面 + 飞鸟 + 朝阳
 */
const LandscapeHeroBg = {
  name: "LandscapeHeroBg",
  setup() {
    let animationId: number | null = null;
    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let containerEl: HTMLElement | null = null;
    let cloudGroup: THREE.Group | null = null;
    let waterMesh: THREE.Mesh | null = null;
    let birdGroup: THREE.Group | null = null;

    // 简易哈希噪声
    const hashNoise = (x: number, y: number): number => {
      let h = x * 374761393 + y * 668265263;
      h = (h ^ (h >> 13)) * 1274126177;
      h = h ^ (h >> 16);
      return (h & 0x7fffffff) / 0x7fffffff;
    };

    // 平滑噪声
    const smoothNoise = (x: number, y: number): number => {
      const ix = Math.floor(x);
      const iy = Math.floor(y);
      const fx = x - ix;
      const fy = y - iy;
      const sx = fx * fx * (3 - 2 * fx);
      const sy = fy * fy * (3 - 2 * fy);
      const n00 = hashNoise(ix, iy);
      const n10 = hashNoise(ix + 1, iy);
      const n01 = hashNoise(ix, iy + 1);
      const n11 = hashNoise(ix + 1, iy + 1);
      return (
        n00 * (1 - sx) * (1 - sy) +
        n10 * sx * (1 - sy) +
        n01 * (1 - sx) * sy +
        n11 * sx * sy
      );
    };

    // 分形噪声（多倍频叠加）
    const fbm = (x: number, y: number, octaves: number = 4): number => {
      let value = 0;
      let amplitude = 1;
      let frequency = 1;
      let maxValue = 0;
      for (let i = 0; i < octaves; i++) {
        value += amplitude * smoothNoise(x * frequency, y * frequency);
        maxValue += amplitude;
        amplitude *= 0.5;
        frequency *= 2.0;
      }
      return value / maxValue;
    };

    // 创建山体层
    const createMountainLayer = (
      width: number,
      baseHeight: number,
      peakHeight: number,
      color: THREE.Color,
      z: number,
      seed: number,
      segments: number = 120,
    ): THREE.Mesh => {
      const shape = new THREE.Shape();
      const halfW = width / 2;

      shape.moveTo(-halfW, -2);
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const x = -halfW + t * width;
        const noiseVal = fbm(t * 3 + seed, seed * 0.7, 4);
        const y = baseHeight + noiseVal * peakHeight;
        shape.lineTo(x, y);
      }
      shape.lineTo(halfW, -2);
      shape.closePath();

      const extrudeSettings: THREE.ExtrudeGeometryOptions = {
        steps: 1,
        depth: 1.5,
        bevelEnabled: true,
        bevelThickness: 0.3,
        bevelSize: 0.3,
        bevelSegments: 3,
      };

      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      geometry.translate(0, 0, z - 0.75);

      const material = new THREE.MeshLambertMaterial({
        color,
        flatShading: false,
      });

      return new THREE.Mesh(geometry, material);
    };

    // 创建水面
    const createWater = (width: number, z: number): THREE.Mesh => {
      const geometry = new THREE.PlaneGeometry(width, 4, 60, 1);
      geometry.rotateX(-Math.PI / 2);
      geometry.translate(0, -1.2, z);

      const material = new THREE.MeshPhongMaterial({
        color: 0x4a8fa8,
        specular: 0x8899aa,
        shininess: 80,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide,
      });

      return new THREE.Mesh(geometry, material);
    };

    // 创建云雾组
    const createClouds = (): THREE.Group => {
      const group = new THREE.Group();
      const cloudMat = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.6,
      });

      for (let i = 0; i < 12; i++) {
        const cloudGroup = new THREE.Group();
        const count = 3 + Math.floor(Math.random() * 5);
        for (let j = 0; j < count; j++) {
          const geo = new THREE.SphereGeometry(
            0.3 + Math.random() * 1.2,
            8,
            6,
          );
          const mesh = new THREE.Mesh(geo, cloudMat);
          mesh.position.set(
            (Math.random() - 0.5) * 3,
            Math.random() * 0.5,
            (Math.random() - 0.5) * 1.5,
          );
          mesh.scale.set(1, 0.3 + Math.random() * 0.3, 1);
          cloudGroup.add(mesh);
        }
        cloudGroup.position.set(
          (Math.random() - 0.5) * 14,
          1.5 + Math.random() * 3,
          -3 + Math.random() * 3,
        );
        cloudGroup.userData = {
          speed: 0.1 + Math.random() * 0.4,
          amplitude: 0.3 + Math.random() * 0.5,
          offset: Math.random() * Math.PI * 2,
        };
        group.add(cloudGroup);
      }
      return group;
    };

    // 创建飞鸟
    const createBirds = (): THREE.Group => {
      const group = new THREE.Group();
      const birdShape = new THREE.Shape();
      birdShape.moveTo(0, 0);
      birdShape.quadraticCurveTo(0.08, 0.06, 0.2, 0.02);
      birdShape.quadraticCurveTo(0.08, -0.02, 0, 0);

      const birdGeo = new THREE.ShapeGeometry(birdShape);

      for (let i = 0; i < 5; i++) {
        const bird = new THREE.Mesh(
          birdGeo,
          new THREE.MeshBasicMaterial({
            color: 0x333333,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.7,
          }),
        );
        bird.position.set(
          (Math.random() - 0.5) * 8,
          2 + Math.random() * 4,
          -1 + Math.random() * 2,
        );
        bird.userData = {
          speed: 0.2 + Math.random() * 0.6,
          amplitude: 0.3 + Math.random() * 0.8,
          offset: Math.random() * Math.PI * 2,
          baseY: bird.position.y,
          baseX: bird.position.x,
        };
        group.add(bird);
      }
      return group;
    };

    // 清理函数
    const cleanup = () => {
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
      if (renderer) {
        renderer.dispose();
        renderer = null;
      }
      if (containerEl) {
        containerEl.remove();
        containerEl = null;
      }
      scene = null;
      camera = null;
      cloudGroup = null;
      waterMesh = null;
      birdGroup = null;
    };

    onMounted(async () => {
      // 仅在首页生效
      const isHome =
        window.location.pathname === "/---/" ||
        window.location.pathname === "/---/index.html";
      if (!isHome) return;

      // 等待 hero 区域渲染
      const waitForHero = (): Promise<HTMLElement | null> =>
        new Promise((resolve) => {
          let attempts = 0;
          const check = () => {
            const hero = document.querySelector(
              ".home-blog-wrapper .hero-info",
            ) as HTMLElement | null;
            if (hero || attempts > 80) return resolve(hero);
            attempts++;
            requestAnimationFrame(check);
          };
          check();
        });

      const heroEl = await waitForHero();
      if (!heroEl) return;

      const heroWrapper =
        (heroEl.closest(".home-blog-wrapper") as HTMLElement) || heroEl;
      heroWrapper.style.position = "relative";
      heroWrapper.style.overflow = "hidden";

      // 创建 Three.js 容器
      containerEl = document.createElement("div");
      containerEl.id = "landscape-hero-bg";
      containerEl.style.cssText =
        "position:absolute;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;";
      heroWrapper.prepend(containerEl);

      // 提升 hero 文字层级
      heroEl.style.position = "relative";
      heroEl.style.zIndex = "1";

      // --- Three.js 场景初始化 ---
      const width = containerEl.clientWidth;
      const height = containerEl.clientHeight;
      const aspect = width / Math.max(height, 1);

      scene = new THREE.Scene();

      // 天空渐变背景
      const skyCanvas = document.createElement("canvas");
      skyCanvas.width = 2;
      skyCanvas.height = 512;
      const skyCtx = skyCanvas.getContext("2d")!;
      const skyGradient = skyCtx.createLinearGradient(0, 0, 0, 512);
      skyGradient.addColorStop(0, "#fdf4e3"); // 暖黄（顶部）
      skyGradient.addColorStop(0.35, "#f5d5b8"); // 橙粉
      skyGradient.addColorStop(0.65, "#e8c4a0"); // 浅棕
      skyGradient.addColorStop(1, "#c9d5e0"); // 雾蓝（底部）
      skyCtx.fillStyle = skyGradient;
      skyCtx.fillRect(0, 0, 2, 512);
      const skyTexture = new THREE.CanvasTexture(skyCanvas);
      scene.background = skyTexture;

      scene.fog = new THREE.Fog(0xe8d5c0, 8, 35);

      // 相机
      camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 80);
      camera.position.set(0, 1.8, 12);
      camera.lookAt(0, 0.5, 0);

      // 渲染器
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      containerEl.appendChild(renderer.domElement);

      // --- 光照 ---
      // 环境光 - 暖色调
      const ambientLight = new THREE.AmbientLight(0xffeedd, 1.2);
      scene.add(ambientLight);

      // 半球光 - 天空+地面
      const hemiLight = new THREE.HemisphereLight(0xffeedd, 0x8d7c6b, 0.6);
      scene.add(hemiLight);

      // 主方向光 - 模拟朝阳
      const sunLight = new THREE.DirectionalLight(0xffcc88, 2.5);
      sunLight.position.set(8, 6, -2);
      scene.add(sunLight);

      // 补光
      const fillLight = new THREE.DirectionalLight(0xaaccff, 0.6);
      fillLight.position.set(-3, 1, 5);
      scene.add(fillLight);

      // --- 太阳光晕 ---
      const sunGeo = new THREE.SphereGeometry(1.2, 32, 32);
      const sunMat = new THREE.MeshBasicMaterial({
        color: 0xffeedd,
        transparent: true,
        opacity: 0.9,
      });
      const sun = new THREE.Mesh(sunGeo, sunMat);
      sun.position.set(6, 5, -8);
      scene.add(sun);

      // 外层光晕
      const glowGeo = new THREE.SphereGeometry(2.0, 32, 32);
      const glowMat = new THREE.MeshBasicMaterial({
        color: 0xffcc88,
        transparent: true,
        opacity: 0.2,
      });
      const glow = new THREE.Mesh(glowGeo, glowMat);
      sun.add(glow);

      // --- 山体层 ---
      const mountainLayers = [
        { base: -0.8, peak: 2.5, color: 0x2d5a4e, z: -3, seed: 1.7 },
        { base: -0.5, peak: 3.0, color: 0x3d6b5e, z: -2, seed: 2.3 },
        { base: -0.3, peak: 3.8, color: 0x4d7c6e, z: -1, seed: 3.1 },
        { base: 0.0, peak: 4.2, color: 0x5d8d7e, z: 0, seed: 4.5 },
        { base: 0.2, peak: 4.5, color: 0x6d9e8e, z: 1, seed: 5.9 },
      ];

      mountainLayers.forEach((layer) => {
        const mountain = createMountainLayer(
          18,
          layer.base,
          layer.peak,
          new THREE.Color(layer.color),
          layer.z,
          layer.seed,
        );
        scene!.add(mountain);
      });

      // --- 水面 ---
      waterMesh = createWater(18, -0.5);
      scene.add(waterMesh);

      // --- 云雾 ---
      cloudGroup = createClouds();
      scene.add(cloudGroup);

      // --- 飞鸟 ---
      birdGroup = createBirds();
      scene.add(birdGroup);

      // --- 动画循环 ---
      const clock = new THREE.Clock();

      const animate = () => {
        if (!scene || !camera || !renderer) return;

        const elapsed = clock.getElapsedTime();

        // 云雾飘动
        if (cloudGroup) {
          cloudGroup.children.forEach((c) => {
            const ud = c.userData as any;
            c.position.x += ud.speed * 0.005;
            c.position.y +=
              Math.sin(elapsed * 0.3 + ud.offset) * ud.amplitude * 0.003;

            // 循环：飘出右边后从左边回来
            if (c.position.x > 10) {
              c.position.x = -10;
            }
          });
        }

        // 水面波动
        if (waterMesh) {
          const posAttr = waterMesh.geometry.getAttribute(
            "position",
          ) as THREE.BufferAttribute;
          const array = posAttr.array as Float32Array;
          for (let i = 0; i < posAttr.count; i++) {
            const x = array[i * 3];
            const y = array[i * 3 + 1];
            array[i * 3 + 2] =
              y + Math.sin(x * 1.5 + elapsed * 1.2) * 0.15 + Math.cos(x * 2.3 + elapsed * 0.8) * 0.1;
          }
          posAttr.needsUpdate = true;
        }

        // 飞鸟动画
        if (birdGroup) {
          birdGroup.children.forEach((bird) => {
            const ud = bird.userData as any;
            bird.position.x += ud.speed * 0.01;
            bird.position.y =
              ud.baseY + Math.sin(elapsed * 2 + ud.offset) * ud.amplitude * 0.15;

            if (bird.position.x > 10) {
              bird.position.x = -10;
            }
          });
        }

        // 相机微动（呼吸感）
        camera.position.x = Math.sin(elapsed * 0.15) * 0.3;
        camera.position.y = 1.8 + Math.sin(elapsed * 0.2) * 0.15;
        camera.lookAt(0, 0.5, 0);

        renderer.render(scene, camera);
        animationId = requestAnimationFrame(animate);
      };

      animate();

      // 响应窗口大小变化
      const handleResize = () => {
        if (!containerEl || !camera || !renderer) return;
        const w = containerEl.clientWidth;
        const h = containerEl.clientHeight;
        camera.aspect = w / Math.max(h, 1);
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      window.addEventListener("resize", handleResize);
      (containerEl as any)._resizeHandler = handleResize;
    });

    onUnmounted(() => {
      const handler = (containerEl as any)?._resizeHandler;
      if (handler) window.removeEventListener("resize", handler);
      cleanup();
    });

    return () => null;
  },
};

export default defineClientConfig({
  rootComponents: [LandscapeHeroBg],
});
