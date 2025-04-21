
import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * A full-screen 3D aptitude animation as the Home Page background.
 */
const Aptitude3DScene = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // === Setup Scene, Camera, and Renderer ===
    const scene = new THREE.Scene();
    // "Aptitude" blue background with some fog for depth.
    scene.background = new THREE.Color("#edf2fa");
    scene.fog = new THREE.Fog("#e0e8f8", 10, 30);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // === Lighting ===
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
    dirLight.position.set(3, 10, 5);
    scene.add(dirLight);

    // === Helper: Color palette for shapes ===
    const palette = ["#2A3C41", "#1D3557", "#D4A72B", "#D9B8A7"];
    function paletteColor(i:number) { return palette[i % palette.length]; }

    // === "Aptitude" 3D Shapes ===

    // Floating numbers
    const shapeObjects: THREE.Mesh[] = [];
    for (let i = 0; i < 14; i++) {
      let geometry: THREE.BufferGeometry;
      if (i % 3 === 0) geometry = new THREE.TorusGeometry(0.35, 0.08, 14, 42);
      else if (i % 3 === 1) geometry = new THREE.TetrahedronGeometry(0.32);
      else geometry = new THREE.IcosahedronGeometry(0.33);

      const material = new THREE.MeshStandardMaterial({
        color: paletteColor(i),
        roughness: 0.53,
        metalness: 0.4,
        transparent: true,
        opacity: 0.8
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 7,
        -7 - Math.random() * 8
      );
      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      scene.add(mesh);
      shapeObjects.push(mesh);
    }

    // Floating mathematical symbols (cube for '+', cross for '×', bar for '-')
    function addSymbol(type: "+" | "−" | "×" | "÷" | "%", pos: [number, number, number], color: string) {
      const group = new THREE.Group();
      const mat = new THREE.MeshStandardMaterial({ color, metalness: 0.34, roughness: 0.55, transparent: true, opacity: 0.88 });

      if (type === "+") {
        group.add(
          new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.13, 0.13), mat),
          new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.5, 0.13), mat)
        );
      } else if (type === "×") {
        const meshA = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.12, 0.13), mat);
        meshA.rotation.z = Math.PI / 4;
        const meshB = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.12, 0.13), mat);
        meshB.rotation.z = -Math.PI / 4;
        group.add(meshA, meshB);
      } else if (type === "−") {
        group.add(new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.13, 0.13), mat));
      } else if (type === "%") {
        const ringA = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.035, 10, 25), mat);
        ringA.position.x = -0.18;
        ringA.position.y = 0.20;
        const ringB = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.035, 10, 25), mat);
        ringB.position.x = 0.18;
        ringB.position.y = -0.20;
        const diag = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.11, 0.11), mat);
        diag.rotation.z = Math.PI / 4;
        group.add(ringA, ringB, diag);
      } else if (type === "÷") {
        const bar = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.11, 0.11), mat);
        const dotTop = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), mat);
        dotTop.position.y = 0.21;
        const dotBottom = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), mat);
        dotBottom.position.y = -0.21;
        group.add(bar, dotTop, dotBottom);
      }
      group.position.set(...pos);
      scene.add(group);
      shapeObjects.push(group as unknown as THREE.Mesh); // for global motion
    }
    addSymbol("+", [-4.6, 2.7, -9.7], palette[2]);
    addSymbol("−", [5.2, 1.3, -9.4], palette[1]);
    addSymbol("×", [4, -2.4, -8.1], palette[0]);
    addSymbol("÷", [-2.7, -2.1, -10.4], palette[3]);
    addSymbol("%", [2.2, 3.2, -11], palette[2]);

    // Floating number "blocks" (simulate numbers with colored cubes)
    for (let i = 0; i < 10; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: palette[(i + 1) % palette.length],
        metalness: 0.3,
        roughness: 0.5,
        transparent: true,
        opacity: 0.7,
      });
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.53, 0.12),
        mat
      );
      mesh.position.set(
        (Math.random() - 0.5) * 11,
        (Math.random() - 0.5) * 6,
        -10 - Math.random() * 10
      );
      scene.add(mesh);
      shapeObjects.push(mesh);
    }

    // === Mouse Interaction: Drag to rotate shapes ===
    let isDragging = false;
    let prevX = 0, prevY = 0;

    function handleDown(e: MouseEvent) {
      isDragging = true;
      prevX = e.clientX; prevY = e.clientY;
    }
    function handleUp() { isDragging = false; }
    function handleMove(e: MouseEvent) {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;

      shapeObjects.forEach(obj => {
        obj.rotation.y += dx * 0.005;
        obj.rotation.x += dy * 0.005;
      });
      prevX = e.clientX; prevY = e.clientY;
    }
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("mousemove", handleMove);

    // === Animate: Floating and rotating ===
    let animFrame: number;
    function animate() {
      animFrame = requestAnimationFrame(animate);

      shapeObjects.forEach((obj, idx) => {
        if (!isDragging) {
          obj.rotation.x += 0.0008 + 0.0001 * idx;
          obj.rotation.y += 0.0011 + 0.0001 * idx;
        }
        obj.position.y += Math.sin(Date.now() * 0.001 + idx * 0.5) * 0.0035;
      });

      renderer.render(scene, camera);
    }
    animate();

    // === Responsive ===
    function onResize() {
      if (!canvasRef.current) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", onResize);

    // === Clean up ===
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(animFrame);
      // Dispose
      shapeObjects.forEach(obj => {
        if ("geometry" in obj) (obj as any).geometry.dispose?.();
        if ("material" in obj) (obj as any).material.dispose?.();
        scene.remove(obj);
      });
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
      aria-label="3D aptitude animation background"
    />
  );
};

export default Aptitude3DScene;
