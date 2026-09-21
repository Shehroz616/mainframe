import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ToothScrollSection = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(24, 1, 0.1, 100);
    camera.position.set(0, 0.15, 5.8);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    scene.add(new THREE.HemisphereLight(0xeaf8ff, 0x1c3444, 2.2));
    const keyLight = new THREE.DirectionalLight(0xffffff, 4.8);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0x55c9ff, 12, 8);
    rimLight.position.set(-3, 0.5, 2);
    scene.add(rimLight);

    const toothGroup = new THREE.Group();
    toothGroup.position.y = -0.18;
    scene.add(toothGroup);

    let destroyed = false;

    new GLTFLoader().load('/molar_tooth.glb', (gltf) => {
      if (destroyed) return;
      const model = gltf.scene;
      model.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        object.castShadow = true;
        object.receiveShadow = true;
        const material = object.material;
        if (material instanceof THREE.MeshStandardMaterial || material instanceof THREE.MeshPhysicalMaterial) {
          material.roughness = 0.3;
          material.metalness = 0.04;
        }
      });

      const bounds = new THREE.Box3().setFromObject(model);
      const size = bounds.getSize(new THREE.Vector3());
      model.scale.setScalar(1.0 / Math.max(size.x, size.y, size.z));
      const centeredBounds = new THREE.Box3().setFromObject(model);
      model.position.sub(centeredBounds.getCenter(new THREE.Vector3()));
      toothGroup.add(model);
    });

    const resize = () => {
      const width = section.clientWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const scrollTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: ({ progress }) => {
        const copy = section.querySelector<HTMLElement>('[data-tooth-copy]');
        const details = section.querySelector<HTMLElement>('[data-tooth-details]');
        const letters = section.querySelectorAll<HTMLElement>('[data-tooth-letter]');
        if (copy) {
          copy.style.opacity = `${1 - THREE.MathUtils.clamp(progress / 0.42, 0, 1)}`;
        }
        letters.forEach((letter, index) => {
          const letterProgress = THREE.MathUtils.clamp((progress - index * 0.008) / 0.3, 0, 1);
          const direction = index % 2 === 0 ? -1 : 1;
          const lift = 160 + (index % 5) * 34;
          const drift = direction * letterProgress * (10 + (index % 4) * 5);
          letter.style.opacity = `${1 - letterProgress}`;
          letter.style.transform = `translate3d(${drift}px, ${-letterProgress * lift}px, 0) rotate(${direction * letterProgress * (8 + (index % 3) * 4)}deg)`;
        });
        const detailProgress = THREE.MathUtils.clamp((progress - 0.82) * 5.6, 0, 1);
        if (details) {
          details.style.opacity = `${detailProgress}`;
          details.style.transform = `translateY(${(1 - detailProgress) * 24}px)`;
        }
        toothGroup.rotation.y = progress * Math.PI * 1.55 - 0.45;
        toothGroup.rotation.x = Math.sin(progress * Math.PI) * 0.14;
        toothGroup.position.x = THREE.MathUtils.lerp(0.75, 0, progress);
        toothGroup.position.y = THREE.MathUtils.lerp(-0.18, 0.16, progress);
        toothGroup.scale.setScalar(THREE.MathUtils.lerp(0.82, 1.12, progress));
        camera.position.z = THREE.MathUtils.lerp(5.8, 4.6, progress);
        camera.position.x = THREE.MathUtils.lerp(0.18, 0, progress);
        camera.lookAt(toothGroup.position.x, toothGroup.position.y, 0);
      },
    });

    const render = () => {
      if (!destroyed) renderer.render(scene, camera);
    };

    resize();
    render();
    gsap.ticker.add(render);
    window.addEventListener('resize', resize);

    return () => {
      destroyed = true;
      scrollTrigger.kill();
      gsap.ticker.remove(render);
      window.removeEventListener('resize', resize);
      renderer.dispose();
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        object.geometry.dispose();
        if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
        else object.material.dispose();
      });
    };
  }, []);

  return (
    <section ref={sectionRef} className="tooth-scroll-section" aria-labelledby="tooth-scroll-title">
      <div className="tooth-scroll-stage">
        <canvas ref={canvasRef} className="tooth-scroll-canvas" aria-hidden="true" />
        <div className="tooth-scroll-copy" data-tooth-copy>
          <p className="tooth-scroll-kicker">Precision, made visible</p>
          <h2 id="tooth-scroll-title" aria-label="Dental Problems">
            {Array.from('Dental Problems').map((letter, index) => (
              <span
                key={`${letter}-${index}`}
                data-tooth-letter
                aria-hidden="true"
              >
                {letter === ' ' ? '\u00a0' : letter}
              </span>
            ))}
          </h2>
          <p className="tooth-scroll-intro">That can occour due to diabetes.</p>
        </div>
        <div className="tooth-scroll-details" data-tooth-details aria-label="Our care principles">
          <div className="tooth-scroll-feature tooth-scroll-feature--top-left">
            {/* <p>01 / Precision</p> */}
            <span className="tooth-scroll-feature__icon" aria-hidden="true">+</span>
            <strong>Sensitivity</strong>
          </div>
          <div className="tooth-scroll-feature tooth-scroll-feature--top-right">
            <span className="tooth-scroll-feature__icon" aria-hidden="true">*</span>
            {/* <p>02 / Gentle care</p> */}
            <strong>Calculus</strong>
          </div>
          <div className="tooth-scroll-feature tooth-scroll-feature--bottom-left">
            <strong>Periodontitis</strong>
            <span className="tooth-scroll-feature__icon" aria-hidden="true">o</span>
            {/* <p>03 / Confidence</p> */}
          </div>
          <div className="tooth-scroll-feature tooth-scroll-feature--bottom-right">
            <strong>Gingivitis</strong>
            <span className="tooth-scroll-feature__icon" aria-hidden="true">^</span>
            {/* <p>04 / Long-term</p> */}
          </div>
        </div>
        <div className="tooth-scroll-mark" aria-hidden="true">HAMDARD / 03</div>
      </div>
    </section>
  );
};

export default ToothScrollSection;