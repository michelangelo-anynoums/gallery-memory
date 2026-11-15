import { useContext, useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { AnimationContext, ErrorModel } from "../App";
import { ModelRendered } from "../App";

export default function TreeScene() {
  // Get animation state from Context
  const { animation3D } = useContext(AnimationContext);
  const { setModelState } = useContext(ModelRendered);
  const { setError } = useContext(ErrorModel);

  // Store Three.js objects
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);

  // =================================
  // INITIALIZE THREE.JS SCENE
  // =================================

  useEffect(() => {
    const container = document.querySelector("#canvas-wrapper");
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      35,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );

    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    rendererRef.current = renderer;

    // Remove old Three.js canvas if present
    const oldCanvas = container.querySelector("canvas");
    if (oldCanvas) oldCanvas.remove();

    container.appendChild(renderer.domElement);

    // =================================
    // LIGHTING
    // =================================

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xb0b0b0, 1);
    scene.add(hemisphereLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1);
    keyLight.position.set(3, 5, 4);
    scene.add(keyLight);

    const frontLight = new THREE.DirectionalLight(0xffffff, 1);
    frontLight.position.set(0, 2, 5);
    scene.add(frontLight);

    const leftLight = new THREE.DirectionalLight(0xffffff, 1);
    leftLight.position.set(-5, 2, 0);
    scene.add(leftLight);

    const rightLight = new THREE.DirectionalLight(0xffffff, 1);
    rightLight.position.set(5, 2, 0);
    scene.add(rightLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 1);
    backLight.position.set(0, 3, -5);
    scene.add(backLight);

    // =================================
    // CAMERA CONTROLS
    // =================================

    const controls = new OrbitControls(camera, renderer.domElement);

    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Zoom controls
    controls.enableZoom = true;
    controls.minDistance = 1.2;
    controls.maxDistance = 5;

    // Disable panning
    controls.enablePan = false;

    // Rotation limits
    controls.minPolarAngle = 0.3;
    controls.maxPolarAngle = Math.PI / 1.8;

    controlsRef.current = controls;

    // =================================
    // DRACO LOADER
    // =================================

    const dracoLoader = new DRACOLoader();

    dracoLoader.setDecoderPath(`${import.meta.env.BASE_URL}draco/`);

    // =================================
    // LOAD 3D MODEL
    // =================================

    const loader = new GLTFLoader();

    // Connect Draco to GLTFLoader
    loader.setDRACOLoader(dracoLoader);

    let model;
    let disposed = false;

    loader.load(
      "/models/dog.glb",

      (gltf) => {
        if (disposed) {
          gltf.scene.traverse((child) => {
            if (child.isMesh) {
              child.geometry.dispose();

              const materials = Array.isArray(child.material)
                ? child.material
                : [child.material];

              materials.forEach((material) => material.dispose());
            }
          });
          return;
        }

        model = gltf.scene;

        // Model is fully rendered
        setModelState(true);

        // =================================
        // CORRECT MODEL ROTATION
        // =================================

        // Adjust model orientation
        model.rotation.set(0, 0, 0);

        // Calculate bounds after rotation
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Center model
        model.position.sub(center);

        scene.add(model);

        // Camera distance
        const maxDim = Math.max(size.x, size.y, size.z);
        const distance = maxDim * 1.8;

        // Camera orientation
        camera.up.set(0, 1, 0);
        camera.position.set(0, maxDim * 0.4, distance);

        camera.lookAt(0, 0, 0);

        controls.target.set(0, 0, 0);
        controls.update();
      },

      undefined,

      (error) => {
        console.error("Error loading tree model:", error);
        setError(true);
      },
    );

    // =================================
    // RESPONSIVE RESIZING
    // =================================

    const resizeObserver = new ResizeObserver(() => {
      const width = container.clientWidth;
      const height = container.clientHeight;

      if (!width || !height) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    });

    resizeObserver.observe(container);

    // =================================
    // CLEANUP
    // =================================

    return () => {
      disposed = true;

      resizeObserver.disconnect();

      controls.dispose();

      // Dispose Draco decoder
      dracoLoader.dispose();

      renderer.dispose();

      if (model) {
        scene.remove(model);

        model.traverse((child) => {
          if (child.isMesh) {
            child.geometry.dispose();

            const materials = Array.isArray(child.material)
              ? child.material
              : [child.material];

            materials.forEach((material) => material.dispose());
          }
        });
      }

      renderer.domElement.remove();

      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      controlsRef.current = null;
    };
  }, []);

  // =================================
  // ANIMATION CONTROL
  // =================================

  useEffect(() => {
    if (!animation3D) {
      setModelState(false);
      return;
    }

    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const renderer = rendererRef.current;
    const controls = controlsRef.current;

    if (!scene || !camera || !renderer || !controls) return;

    let animationId;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      setModelState(false);
      cancelAnimationFrame(animationId);
    };
  }, [animation3D]);

  return null;
}
