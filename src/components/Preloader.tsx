import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

declare const __TOTAL_FRAMES__: number;

const TOTAL_FRAMES = __TOTAL_FRAMES__;
const FRAME_LOAD_CONCURRENCY = 6;
const VIDEO_SRC = '/hero-video-2.mp4';

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
    image.src = `/frames/frame_${String(index + 1).padStart(4, '0')}.jpg`;
  });
}

async function loadAllFrames() {
  let nextIndex = 0;

  const loadWorker = async () => {
    while (nextIndex < TOTAL_FRAMES) {
      const index = nextIndex;
      nextIndex += 1;
      await loadFrame(index);
    }
  };

  await Promise.all(
    Array.from(
      { length: Math.min(FRAME_LOAD_CONCURRENCY, TOTAL_FRAMES) },
      () => loadWorker(),
    ),
  );
}

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const startedAt = performance.now();
    let removeTimer: number | undefined;
    let animationFrame = 0;
    let destroyed = false;
    const canvas = canvasRef.current;

    if (canvas) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
      camera.position.z = 5.2;
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;

      scene.add(new THREE.HemisphereLight(0xeaf8ff, 0x1c3444, 2.4));
      const keyLight = new THREE.DirectionalLight(0xffffff, 4.5);
      keyLight.position.set(3, 4, 5);
      scene.add(keyLight);
      const rimLight = new THREE.PointLight(0x55c9ff, 10, 8);
      rimLight.position.set(-3, 0.5, 2);
      scene.add(rimLight);

      const tooth = new THREE.Group();
      scene.add(tooth);

      const resize = () => {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      };

      const loadTooth = new Promise<void>((resolve) => {
        new GLTFLoader().load('/molar_tooth.glb', (gltf) => {
          if (destroyed) {
            resolve();
            return;
          }
          const model = gltf.scene;
          model.traverse((object) => {
            if (!(object instanceof THREE.Mesh)) return;
            const material = object.material;
            if (material instanceof THREE.MeshStandardMaterial || material instanceof THREE.MeshPhysicalMaterial) {
              material.roughness = 0.3;
              material.metalness = 0.04;
            }
          });

          const bounds = new THREE.Box3().setFromObject(model);
          const size = bounds.getSize(new THREE.Vector3());
          model.scale.setScalar(2.2 / Math.max(size.x, size.y, size.z));
          const centeredBounds = new THREE.Box3().setFromObject(model);
          model.position.sub(centeredBounds.getCenter(new THREE.Vector3()));
          tooth.add(model);
          resolve();
        }, undefined, () => resolve());
      });

      const render = () => {
        if (destroyed) return;
        tooth.rotation.y += 0.008;
        tooth.rotation.x = Math.sin(performance.now() * 0.001) * 0.05;
        renderer.render(scene, camera);
        animationFrame = window.requestAnimationFrame(render);
      };

      resize();
      render();
      window.addEventListener('resize', resize);

      const cleanupScene = () => {
        destroyed = true;
        window.cancelAnimationFrame(animationFrame);
        window.removeEventListener('resize', resize);
        renderer.dispose();
        scene.traverse((object) => {
          if (!(object instanceof THREE.Mesh)) return;
          object.geometry.dispose();
          if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
          else object.material.dispose();
        });
      };

      const hide = () => {
        const remaining = Math.max(0, 850 - (performance.now() - startedAt));
        window.setTimeout(() => {
          setIsLeaving(true);
          removeTimer = window.setTimeout(() => setIsVisible(false), 650);
        }, remaining);
      };

      void Promise.all([loadHeroVideo(), loadAllFrames(), loadTooth]).then(hide);

      return () => {
        if (removeTimer) window.clearTimeout(removeTimer);
        cleanupScene();
      };
    }

    const hide = () => {
      const remaining = Math.max(0, 850 - (performance.now() - startedAt));
      window.setTimeout(() => {
        setIsLeaving(true);
        removeTimer = window.setTimeout(() => setIsVisible(false), 650);
      }, remaining);
    };

    void Promise.all([loadHeroVideo(), loadAllFrames()]).then(hide);

    return () => {
      if (removeTimer) window.clearTimeout(removeTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`site-preloader ${isLeaving ? 'is-leaving' : ''}`} role="status" aria-label="Loading Hamdard Dental">
      <canvas ref={canvasRef} className="site-preloader__animation" aria-hidden="true" />
      {/* <div className="site-preloader__label">
        <span>Hamdard</span>
        <small>Dental &amp; Skin Clinic</small>
      </div> */}
    </div>
  );
}
