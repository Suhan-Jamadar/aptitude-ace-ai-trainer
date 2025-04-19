
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/Layout/MainLayout";
import AuthModal from "@/components/Auth/AuthModal";
import { ArrowRight } from "lucide-react";

const HomePage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<"login" | "signup">("signup");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Create shapes for aptitude theme
    const shapes: THREE.Mesh[] = [];
    const otherObjects: THREE.Object3D[] = []; // Store non-mesh objects here
    const mathObjects: THREE.Group[] = [];
    
    // Color palette based on app's theme
    const colors = [
      "#D4A72B", // Gold
      "#2A3C41", // Dark Blue
      "#1D3557", // Darker Blue
      "#D9B8A7"  // Peach
    ];
    
    // Create mathematical formulas
    const createFormula = (type: string, position: THREE.Vector3, size: number, color: string) => {
      const group = new THREE.Group();
      
      switch(type) {
        case "pythagoras": {
          // a² + b² = c²
          const material = new THREE.MeshStandardMaterial({ 
            color: new THREE.Color(color),
            metalness: 0.3,
            roughness: 0.6
          });
          
          // Create a²
          const aSquared = new THREE.Group();
          const aText = createTextMesh("a", 0.15 * size, material.clone());
          aText.position.set(0, 0, 0);
          
          const superscript = createTextMesh("2", 0.08 * size, material.clone());
          superscript.position.set(0.15 * size, 0.05 * size, 0);
          
          aSquared.add(aText, superscript);
          
          // Create + sign
          const plus = createTextMesh("+", 0.15 * size, material.clone());
          plus.position.set(0.3 * size, 0, 0);
          
          // Create b²
          const bSquared = new THREE.Group();
          const bText = createTextMesh("b", 0.15 * size, material.clone());
          bText.position.set(0.5 * size, 0, 0);
          
          const bSuperscript = createTextMesh("2", 0.08 * size, material.clone());
          bSuperscript.position.set(0.65 * size, 0.05 * size, 0);
          
          bSquared.add(bText, bSuperscript);
          
          // Create = sign
          const equals = createTextMesh("=", 0.15 * size, material.clone());
          equals.position.set(0.8 * size, 0, 0);
          
          // Create c²
          const cSquared = new THREE.Group();
          const cText = createTextMesh("c", 0.15 * size, material.clone());
          cText.position.set(1 * size, 0, 0);
          
          const cSuperscript = createTextMesh("2", 0.08 * size, material.clone());
          cSuperscript.position.set(1.15 * size, 0.05 * size, 0);
          
          cSquared.add(cText, cSuperscript);
          
          group.add(aSquared, plus, bSquared, equals, cSquared);
          break;
        }
        
        case "quadratic": {
          // ax² + bx + c = 0
          const material = new THREE.MeshStandardMaterial({ 
            color: new THREE.Color(color),
            metalness: 0.3,
            roughness: 0.6
          });
          
          const elements = [
            { text: "a", position: new THREE.Vector3(0, 0, 0), size: 0.15 * size },
            { text: "x", position: new THREE.Vector3(0.15 * size, 0, 0), size: 0.15 * size },
            { text: "2", position: new THREE.Vector3(0.3 * size, 0.05 * size, 0), size: 0.08 * size },
            { text: "+", position: new THREE.Vector3(0.4 * size, 0, 0), size: 0.15 * size },
            { text: "b", position: new THREE.Vector3(0.55 * size, 0, 0), size: 0.15 * size },
            { text: "x", position: new THREE.Vector3(0.7 * size, 0, 0), size: 0.15 * size },
            { text: "+", position: new THREE.Vector3(0.85 * size, 0, 0), size: 0.15 * size },
            { text: "c", position: new THREE.Vector3(1 * size, 0, 0), size: 0.15 * size },
            { text: "=", position: new THREE.Vector3(1.15 * size, 0, 0), size: 0.15 * size },
            { text: "0", position: new THREE.Vector3(1.3 * size, 0, 0), size: 0.15 * size }
          ];
          
          elements.forEach(element => {
            const mesh = createTextMesh(element.text, element.size, material.clone());
            mesh.position.copy(element.position);
            group.add(mesh);
          });
          
          break;
        }
        
        case "factorial": {
          // n! = n × (n-1) × ... × 2 × 1
          const material = new THREE.MeshStandardMaterial({ 
            color: new THREE.Color(color),
            metalness: 0.3,
            roughness: 0.6
          });
          
          const elements = [
            { text: "n", position: new THREE.Vector3(0, 0, 0), size: 0.15 * size },
            { text: "!", position: new THREE.Vector3(0.15 * size, 0, 0), size: 0.15 * size },
            { text: "=", position: new THREE.Vector3(0.3 * size, 0, 0), size: 0.15 * size },
            { text: "n", position: new THREE.Vector3(0.45 * size, 0, 0), size: 0.15 * size },
            { text: "×", position: new THREE.Vector3(0.6 * size, 0, 0), size: 0.15 * size },
            { text: "(n-1)", position: new THREE.Vector3(0.75 * size, 0, 0), size: 0.15 * size },
            { text: "×...", position: new THREE.Vector3(1.1 * size, 0, 0), size: 0.15 * size }
          ];
          
          elements.forEach(element => {
            const mesh = createTextMesh(element.text, element.size, material.clone());
            mesh.position.copy(element.position);
            group.add(mesh);
          });
          
          break;
        }
      }
      
      group.position.copy(position);
      scene.add(group);
      mathObjects.push(group);
      
      return group;
    };
    
    // Helper function to create text (mocked for this example)
    const createTextMesh = (text: string, size: number, material: THREE.Material) => {
      // In a real implementation, you'd use TextGeometry
      // Here we just create simple boxes to represent text
      const width = text.length * 0.1 * size;
      const geometry = new THREE.BoxGeometry(width, size, 0.01);
      return new THREE.Mesh(geometry, material);
    };
    
    // Create number objects
    for (let i = 0; i < 15; i++) {
      const geometries = [
        new THREE.TorusGeometry(0.3, 0.1, 16, 50),
        new THREE.TetrahedronGeometry(0.3, 0),
        new THREE.IcosahedronGeometry(0.3, 0)
      ];
      
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const material = new THREE.MeshStandardMaterial({ 
        color: new THREE.Color(colors[i % colors.length]),
        metalness: 0.3,
        roughness: 0.6,
        transparent: true,
        opacity: 0.8,
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      
      // Position randomly in space
      mesh.position.x = (Math.random() - 0.5) * 15;
      mesh.position.y = (Math.random() - 0.5) * 10;
      mesh.position.z = -8 - Math.random() * 10;
      
      // Random rotation
      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      
      scene.add(mesh);
      shapes.push(mesh);
    }
    
    // Create symbols (plus, minus, multiply, divide, etc.)
    const createSymbol = (type: string, position: THREE.Vector3, color: string, size: number = 1) => {
      let geometry, mesh1, mesh2, mesh3;
      const material = new THREE.MeshStandardMaterial({ 
        color: new THREE.Color(color),
        metalness: 0.3,
        roughness: 0.6,
        transparent: true,
        opacity: 0.8,
      });
      
      switch(type) {
        case 'plus':
          geometry = new THREE.BoxGeometry(0.8 * size, 0.2 * size, 0.2 * size);
          const verticalPart = new THREE.BoxGeometry(0.2 * size, 0.8 * size, 0.2 * size);
          mesh1 = new THREE.Mesh(geometry, material);
          mesh2 = new THREE.Mesh(verticalPart, material);
          mesh1.position.copy(position);
          mesh2.position.copy(position);
          scene.add(mesh1, mesh2);
          shapes.push(mesh1, mesh2);
          break;
          
        case 'minus':
          geometry = new THREE.BoxGeometry(0.8 * size, 0.2 * size, 0.2 * size);
          mesh1 = new THREE.Mesh(geometry, material);
          mesh1.position.copy(position);
          scene.add(mesh1);
          shapes.push(mesh1);
          break;
          
        case 'multiply':
          geometry = new THREE.BoxGeometry(0.8 * size, 0.2 * size, 0.2 * size);
          mesh1 = new THREE.Mesh(geometry, material);
          mesh2 = new THREE.Mesh(geometry.clone(), material);
          mesh1.position.copy(position);
          mesh2.position.copy(position);
          mesh1.rotation.z = Math.PI / 4;
          mesh2.rotation.z = -Math.PI / 4;
          scene.add(mesh1, mesh2);
          shapes.push(mesh1, mesh2);
          break;
          
        case 'divide':
          const lineGeometry = new THREE.BoxGeometry(0.8 * size, 0.2 * size, 0.2 * size);
          const dotGeometry = new THREE.SphereGeometry(0.1 * size, 16, 16);
          mesh1 = new THREE.Mesh(lineGeometry, material);
          mesh2 = new THREE.Mesh(dotGeometry, material);
          mesh3 = new THREE.Mesh(dotGeometry.clone(), material);
          mesh1.position.copy(position);
          mesh2.position.set(position.x, position.y + 0.4 * size, position.z);
          mesh3.position.set(position.x, position.y - 0.4 * size, position.z);
          scene.add(mesh1, mesh2, mesh3);
          shapes.push(mesh1, mesh2, mesh3);
          break;
          
        case 'percent':
          const circle1Geo = new THREE.TorusGeometry(0.2 * size, 0.05 * size, 16, 32);
          const circle2Geo = circle1Geo.clone();
          const lineGeo = new THREE.BoxGeometry(1 * size, 0.1 * size, 0.1 * size);
          mesh1 = new THREE.Mesh(circle1Geo, material);
          mesh2 = new THREE.Mesh(circle2Geo, material);
          mesh3 = new THREE.Mesh(lineGeo, material);
          mesh1.position.set(position.x - 0.3 * size, position.y + 0.3 * size, position.z);
          mesh2.position.set(position.x + 0.3 * size, position.y - 0.3 * size, position.z);
          mesh3.position.copy(position);
          mesh3.rotation.z = Math.PI / 4;
          scene.add(mesh1, mesh2, mesh3);
          shapes.push(mesh1, mesh2, mesh3);
          break;
          
        case 'sqrt':
          // For sqrt, instead of using Line which causes TypeScript issues,
          // we'll use small cube meshes to create the square root symbol
          const segmentCount = 10;
          const points = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0.2 * size, -0.4 * size, 0),
            new THREE.Vector3(0.4 * size, 0, 0),
            new THREE.Vector3(0.8 * size, 0, 0)
          ];
          
          // Create small segments to form the shape
          for (let i = 0; i < segmentCount - 1; i++) {
            const start = points[Math.floor(i / (segmentCount / points.length))];
            const end = points[Math.ceil(i / (segmentCount / points.length))];
            
            const t = (i % (segmentCount / points.length)) / (segmentCount / points.length);
            const segmentStart = new THREE.Vector3().lerpVectors(start, end, t);
            const segmentEnd = new THREE.Vector3().lerpVectors(start, end, t + 1 / segmentCount);
            
            const direction = new THREE.Vector3().subVectors(segmentEnd, segmentStart);
            const length = direction.length();
            
            const segmentGeo = new THREE.BoxGeometry(length, 0.05 * size, 0.05 * size);
            const segmentMesh = new THREE.Mesh(segmentGeo, material.clone());
            
            segmentMesh.position.copy(segmentStart.clone().add(direction.multiplyScalar(0.5)));
            segmentMesh.lookAt(segmentEnd);
            
            segmentMesh.position.add(position);
            
            scene.add(segmentMesh);
            shapes.push(segmentMesh);
          }
          break;
      }
    };
    
    // Create mathematical formulas
    createFormula("pythagoras", new THREE.Vector3(-4, 2, -10), 1, colors[0]);
    createFormula("quadratic", new THREE.Vector3(2, -2, -12), 1, colors[1]);
    createFormula("factorial", new THREE.Vector3(-2, -3, -8), 1, colors[3]);
    
    // Create various mathematical symbols
    createSymbol('plus', new THREE.Vector3(-5, 3, -15), colors[0], 0.8);
    createSymbol('minus', new THREE.Vector3(5, 2, -10), colors[1], 0.8);
    createSymbol('multiply', new THREE.Vector3(4, -3, -8), colors[2], 0.8);
    createSymbol('divide', new THREE.Vector3(-3, -1, -12), colors[3], 0.8);
    createSymbol('percent', new THREE.Vector3(3, 4, -13), colors[0], 0.8);
    createSymbol('sqrt', new THREE.Vector3(-1, 3, -9), colors[2], 1.2);
    
    // Create floating 3D numbers
    const createFloatingNumber = (value: number, position: THREE.Vector3, color: string, size: number = 1) => {
      // In a real implementation, you'd use TextGeometry
      // Here we create a simple box to represent a number
      const geometry = new THREE.BoxGeometry(0.5 * size, 0.8 * size, 0.1 * size);
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        metalness: 0.3,
        roughness: 0.6,
        transparent: true,
        opacity: 0.8
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(position);
      scene.add(mesh);
      shapes.push(mesh);
    };
    
    // Add some 3D numbers
    for (let i = 0; i < 10; i++) {
      createFloatingNumber(
        Math.floor(Math.random() * 10),
        new THREE.Vector3(
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 8,
          -10 - Math.random() * 10
        ),
        colors[Math.floor(Math.random() * colors.length)],
        0.7
      );
    }
    
    // Position camera
    camera.position.z = 5;
    
    // Mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    
    window.addEventListener('mousedown', (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    });
    
    window.addEventListener('mouseup', () => {
      isDragging = false;
    });
    
    window.addEventListener('mousemove', (e) => {
      // Update normalized mouse position for raycaster
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      
      // Rotate objects based on mouse movement when dragging
      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        
        shapes.forEach(shape => {
          shape.rotation.y += deltaX * 0.005;
          shape.rotation.x += deltaY * 0.005;
        });
        
        mathObjects.forEach(obj => {
          obj.rotation.y += deltaX * 0.001;
          obj.rotation.x += deltaY * 0.001;
        });
        
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    });
    
    // Animation loop
    let animationFrameId: number;
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Update raycaster and check for intersections
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(shapes);
      
      if (intersects.length > 0) {
        // Highlight intersected objects - need type checking
        const object = intersects[0].object;
        if (object instanceof THREE.Mesh) {
          // Check if material has emissive property (like MeshStandardMaterial)
          const material = object.material as THREE.Material;
          if (material instanceof THREE.MeshStandardMaterial || 
              material instanceof THREE.MeshPhongMaterial || 
              material instanceof THREE.MeshLambertMaterial) {
            material.emissive.set(0x222222);
          }
        }
      }
      
      // Rotate all shapes slightly
      shapes.forEach((shape, index) => {
        if (!isDragging) {
          shape.rotation.x += 0.002;
          shape.rotation.y += 0.003;
        }
        
        // Make them float up and down with different phases
        shape.position.y += Math.sin(Date.now() * 0.001 + index * 0.5) * 0.003;
      });
      
      // Rotate math formulas
      mathObjects.forEach((obj, index) => {
        if (!isDragging) {
          obj.rotation.y += 0.001;
        }
        obj.position.y += Math.sin(Date.now() * 0.0005 + index * 0.5) * 0.002;
      });
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!canvasRef.current) return;
      
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousedown', () => {});
      window.removeEventListener('mouseup', () => {});
      window.removeEventListener('mousemove', () => {});
      cancelAnimationFrame(animationFrameId);
      
      // Dispose geometries and materials
      shapes.forEach((shape) => {
        shape.geometry.dispose();
        if (shape.material instanceof THREE.Material) {
          shape.material.dispose();
        } else if (Array.isArray(shape.material)) {
          shape.material.forEach(material => material.dispose());
        }
        scene.remove(shape);
      });
      
      mathObjects.forEach(obj => {
        scene.remove(obj);
        obj.children.forEach(child => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (child.material instanceof THREE.Material) {
              child.material.dispose();
            }
          }
        });
      });
      
      renderer.dispose();
    };
  }, []);

  const handleOpenAuthModal = (view: "login" | "signup") => {
    setAuthModalView(view);
    setIsAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  return (
    <MainLayout>
      <canvas 
        ref={canvasRef} 
        className="fixed top-0 left-0 w-full h-full -z-10"
      />
      
      <div className="relative min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-4xl w-full bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-custom-darkBlue1">
            <span className="text-custom-gold">Aptitude</span> Ace
          </h1>
          
          <p className="text-xl mb-8 text-custom-darkBlue2 max-w-2xl mx-auto">
            Master aptitude skills with AI-powered training, personalized recommendations, 
            and interactive quizzes to prepare for technical interviews.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-2xl mx-auto">
            <div className="bg-white/80 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-custom-gold animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <h2 className="text-xl font-semibold mb-3 text-custom-darkBlue1">Aptitude Training</h2>
              <p className="text-custom-darkBlue2 mb-4">
                Practice with topic-specific quizzes, track your progress, and unlock the Grand Test.
              </p>
              <Link to="/aptitude">
                <Button className="w-full bg-custom-darkBlue1 hover:bg-custom-darkBlue2 text-white">
                  Start Training
                </Button>
              </Link>
            </div>
            
            <div className="bg-white/80 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-custom-peach animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <h2 className="text-xl font-semibold mb-3 text-custom-darkBlue1">Flashcards</h2>
              <p className="text-custom-darkBlue2 mb-4">
                Upload your notes and generate AI-powered flashcards to enhance your learning.
              </p>
              <Link to="/flashcards">
                <Button className="w-full bg-custom-darkBlue1 hover:bg-custom-darkBlue2 text-white">
                  Create Flashcards
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="flex flex-col items-center animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <div className="bg-custom-darkBlue1/5 rounded-lg p-6 mb-8 max-w-3xl">
              <h3 className="text-xl font-semibold text-custom-darkBlue1 mb-3">What makes Aptitude Ace special?</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <li className="flex items-start">
                  <div className="mr-3 bg-custom-gold/20 p-1 rounded-full mt-1">
                    <CheckIcon className="h-4 w-4 text-custom-gold" />
                  </div>
                  <span className="text-custom-darkBlue2">AI-driven personalized recommendations</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 bg-custom-gold/20 p-1 rounded-full mt-1">
                    <CheckIcon className="h-4 w-4 text-custom-gold" />
                  </div>
                  <span className="text-custom-darkBlue2">Topic-specific quizzes with detailed explanations</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 bg-custom-gold/20 p-1 rounded-full mt-1">
                    <CheckIcon className="h-4 w-4 text-custom-gold" />
                  </div>
                  <span className="text-custom-darkBlue2">Daily challenges to build learning habits</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 bg-custom-gold/20 p-1 rounded-full mt-1">
                    <CheckIcon className="h-4 w-4 text-custom-gold" />
                  </div>
                  <span className="text-custom-darkBlue2">AI-generated flashcards from your notes</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.8s" }}>
            <Button 
              className="bg-custom-gold text-custom-darkBlue1 hover:bg-custom-gold/90 px-8 py-6 text-lg font-semibold"
              onClick={() => handleOpenAuthModal("signup")}
            >
              Sign Up Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              className="border-custom-darkBlue1 text-custom-darkBlue1 hover:bg-custom-darkBlue1 hover:text-white px-8 py-6 text-lg font-semibold"
              onClick={() => handleOpenAuthModal("login")}
            >
              Log In
            </Button>
          </div>
        </div>
      </div>
      
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuthModal}
        onAuthenticated={handleAuthenticated}
        defaultView={authModalView}
      />
    </MainLayout>
  );
};

// CheckIcon component
const CheckIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default HomePage;
