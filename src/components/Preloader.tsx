import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

declare const __TOTAL_FRAMES__: number;

const TOTAL_FRAMES = __TOTAL_FRAMES__;
const VIDEO_SRC = '/hero-video-2.mp4';

function ToothSpinner() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId: number;
    let destroyed = false;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0.12, 3.4);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(64, 64, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    // Bright, clinical 3D lighting for enamel tooth texture
    const ambient = new THREE.HemisphereLight(0xffffff, 0x1f8fce, 2.8);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 4.0);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x7bc5f6, 2.5);
    fillLight.position.set(-3, -1, -2);
    scene.add(fillLight);

    const group = new THREE.Group();
    scene.add(group);

    const loader = new GLTFLoader();
    loader.load(
      '/molar_tooth.glb',
      (gltf) => {
        if (destroyed) return;
        const model = gltf.scene;

        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const mat = child.material;
            if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
              mat.roughness = 0.25;
              mat.metalness = 0.05;
            }
          }
        });

        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim > 0) {
          model.scale.setScalar(1.4 / maxDim);
        }

        const centeredBox = new THREE.Box3().setFromObject(model);
        model.position.sub(centeredBox.getCenter(new THREE.Vector3()));

        group.add(model);
      },
      undefined,
      (err) => {
        console.error('Error loading molar_tooth.glb in preloader:', err);
      }
    );

    let prevTime = performance.now();
    const animate = (now: number) => {
      if (destroyed) return;
      const delta = (now - prevTime) / 1000;
      prevTime = now;

      // Continuous Y-axis spinning (yaw) to keep tooth right-side up without 2D tumbling
      group.rotation.y += delta * 2.8;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      destroyed = true;
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />;
}

function loadFrame(index: number) {
  return new Promise<void>((resolve) => {
    const image = new Image();
    const finish = () => resolve();
    image.onload = () => {
      if (image.decode) {
        void image.decode().catch(() => undefined).finally(finish);
      } else {
        finish();
      }
    };
    image.onerror = finish;
    image.src = `/frames/ezgif-frame-${String(index + 1).padStart(3, '0')}.png`;
  });
}

// async function loadAllFrames() {
//   let nextIndex = 0;

//   const loadWorker = async () => {
//     while (nextIndex < TOTAL_FRAMES) {
//       const index = nextIndex;
//       nextIndex += 1;
//       await loadFrame(index);
//     }
//   };

//   await Promise.all(
//     Array.from(
//       { length: Math.min(FRAME_LOAD_CONCURRENCY, TOTAL_FRAMES) },
//       () => loadWorker(),
//     ),
//   );
// }

function loadHeroVideo() {
  return new Promise<void>((resolve) => {
    const video = document.createElement('video');
    const finish = () => resolve();
    video.preload = 'auto';
    video.muted = true;
    video.playsInline = true;
    video.addEventListener('canplaythrough', finish, { once: true });
    video.addEventListener('error', finish, { once: true });
    video.src = VIDEO_SRC;
    video.load();
  });
}

export default function Preloader() {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startedAt = performance.now();
    let removeTimer: number | undefined;

    const updateProgress = (loaded: number, total: number) => {
      const nextProgress = Math.min(100, Math.max(0, (loaded / total) * 100));
      setProgress(nextProgress);
    };

    const hide = () => {
      const remaining = Math.max(0, 320 - (performance.now() - startedAt));
      window.setTimeout(() => {
        setIsLeaving(true);
        // Signal AdvancedDentistry to begin the intro frame animation.
        window.__preloaderReady = true;
        window.dispatchEvent(new CustomEvent('preloader:ready'));
        removeTimer = window.setTimeout(() => setIsVisible(false), 420);
      }, remaining);
    };

    const loadTasks = async () => {
      let framesLoaded = 0;

      const trackFrameProgress = async () => {
        const total = TOTAL_FRAMES + 1;
        const tick = () => {
          framesLoaded += 1;
          updateProgress(framesLoaded, total);
        };

        for (let index = 0; index < TOTAL_FRAMES; index += 1) {
          await loadFrame(index);
          tick();
        }
      };

      await Promise.all([
        (async () => {
          await loadHeroVideo();
          updateProgress(1, TOTAL_FRAMES + 1);
        })(),
        trackFrameProgress(),
      ]);

      updateProgress(TOTAL_FRAMES + 1, TOTAL_FRAMES + 1);
      hide();
    };

    void loadTasks();

    return () => {
      if (removeTimer) window.clearTimeout(removeTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`site-preloader ${isLeaving ? 'is-leaving' : ''}`} role="status" aria-label="Loading Hamdard Dental">
      <div className="site-preloader__card" aria-hidden="true">
        <img src="/logo-blue.png" alt="Hamdard logo" className="site-preloader__logo" />
        {/* <div className="site-preloader__text-wrap">
          <span className="site-preloader__brand">Hamdard</span>
          <small className="site-preloader__sub">Dental &amp; Skin Clinic</small>
        </div> */}
      </div>

      <div className="site-preloader__progress" aria-live="polite">
        <div className="site-preloader__bar" aria-hidden="true">
          <span className="site-preloader__bar-fill" style={{ width: `${progress}%` }}>
            {/* 3D Spinning molar_tooth model rides at the live tip of the progress bar */}
            <span className="site-preloader__tooth" aria-hidden="true">
              <ToothSpinner />
            </span>
          </span>
        </div>
        <span className="site-preloader__percent">{Math.round(progress)}%</span>
      </div>
    </div>
  );
}
