
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const AptitudeFeature3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Set up scene, camera, and renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#edf2fa");
    scene.fog = new THREE.Fog("#e0e8f8", 10, 30);
    
    // Calculate aspect ratio based on container
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const aspect = width / height;
    
    const camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 100);
    camera.position.z = 7;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    
    // Add lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
    dirLight.position.set(3, 10, 5);
    scene.add(dirLight);
    
    // Math-related objects
    const mathObjects: THREE.Mesh[] = [];
    
    // Color palette
    const palette = ["#2A3C41", "#1D3557", "#D4A72B", "#D9B8A7"];
    function getColor(i: number) { return palette[i % palette.length]; }
    
    // Create mathematical symbols (plus, minus, multiply, divide, percentage)
    function createSymbol(type: string, position: [number, number, number], color: string): THREE.Group {
      const group = new THREE.Group();
      const material = new THREE.MeshStandardMaterial({ 
        color, 
        metalness: 0.34, 
        roughness: 0.55,
        transparent: true,
        opacity: 0.9
      });
      
      if (type === "plus") {
        const horizontal = new THREE.Mesh(
          new THREE.BoxGeometry(0.5, 0.13, 0.13),
          material
        );
        const vertical = new THREE.Mesh(
          new THREE.BoxGeometry(0.13, 0.5, 0.13),
          material
        );
        group.add(horizontal, vertical);
      } 
      else if (type === "minus") {
        const bar = new THREE.Mesh(
          new THREE.BoxGeometry(0.5, 0.13, 0.13),
          material
        );
        group.add(bar);
      } 
      else if (type === "multiply") {
        const bar1 = new THREE.Mesh(
          new THREE.BoxGeometry(0.5, 0.13, 0.13),
          material
        );
        bar1.rotation.z = Math.PI / 4;
        
        const bar2 = new THREE.Mesh(
          new THREE.BoxGeometry(0.5, 0.13, 0.13),
          material
        );
        bar2.rotation.z = -Math.PI / 4;
        
        group.add(bar1, bar2);
      } 
      else if (type === "divide") {
        const bar = new THREE.Mesh(
          new THREE.BoxGeometry(0.5, 0.13, 0.13),
          material
        );
        
        const dot1 = new THREE.Mesh(
          new THREE.SphereGeometry(0.08, 16, 8),
          material
        );
        dot1.position.y = 0.2;
        
        const dot2 = new THREE.Mesh(
          new THREE.SphereGeometry(0.08, 16, 8),
          material
        );
        dot2.position.y = -0.2;
        
        group.add(bar, dot1, dot2);
      } 
      else if (type === "percent") {
        const bar = new THREE.Mesh(
          new THREE.BoxGeometry(0.6, 0.13, 0.13),
          material
        );
        bar.rotation.z = Math.PI / 4;
        
        const dot1 = new THREE.Mesh(
          new THREE.SphereGeometry(0.08, 16, 8),
          material
        );
        dot1.position.set(-0.2, 0.2, 0);
        
        const dot2 = new THREE.Mesh(
          new THREE.SphereGeometry(0.08, 16, 8),
          material
        );
        dot2.position.set(0.2, -0.2, 0);
        
        group.add(bar, dot1, dot2);
      }
      
      group.position.set(...position);
      scene.add(group);
      mathObjects.push(group as unknown as THREE.Mesh);
      return group;
    }
    
    // Create number shapes
    function createNumber(num: number, position: [number, number, number], color: string): THREE.Mesh {
      // Use simple cubes to represent numbers
      const geometry = new THREE.BoxGeometry(0.35, 0.53, 0.12);
      const material = new THREE.MeshStandardMaterial({
        color,
        metalness: 0.3,
        roughness: 0.5,
        transparent: true,
        opacity: 0.85
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...position);
      scene.add(mesh);
      mathObjects.push(mesh);
      return mesh;
    }
    
    // Create geometric shapes (representing aptitude concepts)
    function createGeometricShape(type: string, position: [number, number, number], color: string): THREE.Mesh {
      let geometry;
      
      if (type === "sphere") {
        geometry = new THREE.SphereGeometry(0.32, 32, 16);
      } else if (type === "cube") {
        geometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
      } else if (type === "tetrahedron") {
        geometry = new THREE.TetrahedronGeometry(0.4);
      } else if (type === "torus") {
        geometry = new THREE.TorusGeometry(0.35, 0.1, 16, 32);
      } else if (type === "cone") {
        geometry = new THREE.ConeGeometry(0.3, 0.7, 20);
      } else {
        geometry = new THREE.IcosahedronGeometry(0.33);
      }
      
      const material = new THREE.MeshStandardMaterial({
        color,
        metalness: 0.4,
        roughness: 0.4,
        transparent: true,
        opacity: 0.9
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...position);
      scene.add(mesh);
      mathObjects.push(mesh);
      return mesh;
    }
    
    // Create formula representation
    function createFormula(position: [number, number, number], scale: number): void {
      const group = new THREE.Group();
      
      // Create x² + y² = 1 (equation of circle)
      const xSquare = createSymbol("multiply", [-1.2 * scale, 0, 0], "#D4A72B");
      xSquare.scale.set(0.6 * scale, 0.6 * scale, 0.6 * scale);
      group.add(xSquare);
      
      const plus = createSymbol("plus", [-0.6 * scale, 0, 0], "#1D3557");
      plus.scale.set(0.6 * scale, 0.6 * scale, 0.6 * scale);
      group.add(plus);
      
      const ySquare = createSymbol("multiply", [0 * scale, 0, 0], "#D4A72B");
      ySquare.scale.set(0.6 * scale, 0.6 * scale, 0.6 * scale);
      group.add(ySquare);
      
      const equals = createSymbol("minus", [0.6 * scale, 0, 0], "#2A3C41");
      equals.scale.set(0.6 * scale, 0.6 * scale, 0.6 * scale);
      group.add(equals);
      
      const one = createNumber(1, [1.2 * scale, 0, 0], "#D9B8A7");
      one.scale.set(0.6 * scale, 0.6 * scale, 0.6 * scale);
      group.add(one);
      
      group.position.set(...position);
      scene.add(group);
    }
    
    // Add symbols
    createSymbol("plus", [-3, 2, -5], palette[0]);
    createSymbol("minus", [3, 1.5, -7], palette[1]);
    createSymbol("multiply", [-2.5, -1.5, -6], palette[2]);
    createSymbol("divide", [2, -2, -5], palette[3]);
    createSymbol("percent", [0, 2, -7], palette[0]);
    
    // Add numbers
    createNumber(1, [-1.5, 1.2, -6], palette[1]);
    createNumber(2, [1.2, -1.5, -5], palette[2]);
    createNumber(3, [-2.5, 0.5, -7], palette[3]);
    createNumber(4, [2.5, 0.8, -6], palette[0]);
    
    // Add geometric shapes
    createGeometricShape("sphere", [1, -1, -4], palette[0]);
    createGeometricShape("cube", [-1.5, -2, -7], palette[1]);
    createGeometricShape("tetrahedron", [2.5, 2, -6], palette[2]);
    createGeometricShape("torus", [0, -2.5, -5], palette[3]);
    createGeometricShape("cone", [-3.5, 0, -6], palette[0]);
    
    // Add formula
    createFormula([0, 0, -8], 0.8);
    
    // Animation
    let animationFrame: number;
    
    function animate() {
      animationFrame = requestAnimationFrame(animate);
      
      // Rotate and float objects
      mathObjects.forEach((obj, idx) => {
        // Gentle rotation
        obj.rotation.x += 0.002 + 0.0005 * (idx % 3);
        obj.rotation.y += 0.003 + 0.0003 * (idx % 5);
        
        // Subtle floating effect
        obj.position.y += Math.sin(Date.now() * 0.001 + idx * 0.5) * 0.002;
      });
      
      renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle resize
    function handleResize() {
      if (!containerRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
    }
    
    window.addEventListener('resize', handleResize);
    
    // Mouse interaction
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let rotationSpeed = { x: 0, y: 0 };
    
    function handleMouseDown(e: MouseEvent) {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    }
    
    function handleMouseUp() {
      isDragging = false;
    }
    
    function handleMouseMove(e: MouseEvent) {
      if (!isDragging) return;
      
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      
      rotationSpeed.x = deltaY * 0.001;
      rotationSpeed.y = deltaX * 0.001;
      
      mathObjects.forEach(obj => {
        obj.rotation.x += rotationSpeed.x;
        obj.rotation.y += rotationSpeed.y;
      });
      
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    }
    
    containerRef.current.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    
    // Cleanup
    return () => {
      containerRef.current?.removeChild(renderer.domElement);
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrame);
      
      mathObjects.forEach(obj => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach(material => material.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
    };
  }, []);
  
  return (
    <div 
      ref={containerRef} 
      className="w-full h-full min-h-[400px] flex justify-center items-center animate-fade-in"
      style={{ animationDelay: "0.09s" }}
      aria-label="3D Mathematical Animation"
    />
  );
};

export default AptitudeFeature3D;
