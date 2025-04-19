
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

    // Create shapes for aptitude theme (numbers, symbols, formulas)
    const shapes: THREE.Mesh[] = [];
    
    // Create number objects (1-9)
    for (let i = 0; i < 9; i++) {
      const geometry = new THREE.TorusGeometry(0.3, 0.1, 16, 50);
      const material = new THREE.MeshBasicMaterial({ 
        color: new THREE.Color(
          i % 3 === 0 ? "#D4A72B" : i % 3 === 1 ? "#2A3C41" : "#D9B8A7"
        ),
        transparent: true,
        opacity: 0.7,
      });
      const torus = new THREE.Mesh(geometry, material);
      
      // Position randomly in space
      torus.position.x = (Math.random() - 0.5) * 10;
      torus.position.y = (Math.random() - 0.5) * 10;
      torus.position.z = -5 - Math.random() * 10;
      
      scene.add(torus);
      shapes.push(torus);
    }
    
    // Create symbols (plus, minus, multiply, divide)
    const createSymbol = (type: string, position: THREE.Vector3, color: string) => {
      let geometry;
      
      if (type === 'plus') {
        geometry = new THREE.BoxGeometry(0.8, 0.2, 0.2);
        const verticalPart = new THREE.BoxGeometry(0.2, 0.8, 0.2);
        const material = new THREE.MeshBasicMaterial({ 
          color: new THREE.Color(color),
          transparent: true,
          opacity: 0.7,
        });
        
        const horizontalMesh = new THREE.Mesh(geometry, material);
        const verticalMesh = new THREE.Mesh(verticalPart, material);
        
        horizontalMesh.position.copy(position);
        verticalMesh.position.copy(position);
        
        scene.add(horizontalMesh);
        scene.add(verticalMesh);
        shapes.push(horizontalMesh, verticalMesh);
      } else if (type === 'minus') {
        geometry = new THREE.BoxGeometry(0.8, 0.2, 0.2);
        const material = new THREE.MeshBasicMaterial({ 
          color: new THREE.Color(color),
          transparent: true,
          opacity: 0.7,
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(position);
        
        scene.add(mesh);
        shapes.push(mesh);
      } else if (type === 'multiply') {
        geometry = new THREE.BoxGeometry(0.8, 0.2, 0.2);
        const material = new THREE.MeshBasicMaterial({ 
          color: new THREE.Color(color),
          transparent: true,
          opacity: 0.7,
        });
        
        const mesh1 = new THREE.Mesh(geometry, material);
        const mesh2 = new THREE.Mesh(geometry, material);
        
        mesh1.position.copy(position);
        mesh2.position.copy(position);
        mesh1.rotation.z = Math.PI / 4;
        mesh2.rotation.z = -Math.PI / 4;
        
        scene.add(mesh1);
        scene.add(mesh2);
        shapes.push(mesh1, mesh2);
      } else if (type === 'divide') {
        // Line
        const lineGeometry = new THREE.BoxGeometry(0.8, 0.2, 0.2);
        const dotGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const material = new THREE.MeshBasicMaterial({ 
          color: new THREE.Color(color),
          transparent: true,
          opacity: 0.7,
        });
        
        const lineMesh = new THREE.Mesh(lineGeometry, material);
        const dotMesh1 = new THREE.Mesh(dotGeometry, material);
        const dotMesh2 = new THREE.Mesh(dotGeometry, material);
        
        lineMesh.position.copy(position);
        dotMesh1.position.set(position.x, position.y + 0.4, position.z);
        dotMesh2.position.set(position.x, position.y - 0.4, position.z);
        
        scene.add(lineMesh);
        scene.add(dotMesh1);
        scene.add(dotMesh2);
        shapes.push(lineMesh, dotMesh1, dotMesh2);
      }
    };
    
    // Create various mathematical symbols spread across the scene
    createSymbol('plus', new THREE.Vector3(-3, 2, -8), "#D4A72B");
    createSymbol('minus', new THREE.Vector3(3, -2, -10), "#2A3C41");
    createSymbol('multiply', new THREE.Vector3(2, 3, -12), "#D9B8A7");
    createSymbol('divide', new THREE.Vector3(-2, -3, -7), "#D4A72B");
    createSymbol('plus', new THREE.Vector3(4, 1, -15), "#D9B8A7");
    
    // Add percentage symbol (%)
    const createPercentSymbol = (position: THREE.Vector3, color: string) => {
      const material = new THREE.MeshBasicMaterial({ 
        color: new THREE.Color(color),
        transparent: true,
        opacity: 0.7,
      });
      
      // First circle
      const circle1 = new THREE.Mesh(
        new THREE.RingGeometry(0.1, 0.2, 16),
        material
      );
      circle1.position.set(position.x - 0.2, position.y + 0.2, position.z);
      
      // Second circle
      const circle2 = new THREE.Mesh(
        new THREE.RingGeometry(0.1, 0.2, 16),
        material
      );
      circle2.position.set(position.x + 0.2, position.y - 0.2, position.z);
      
      // Line
      const line = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.1, 0.1),
        material
      );
      line.position.copy(position);
      line.rotation.z = Math.PI / 4;
      
      scene.add(circle1);
      scene.add(circle2);
      scene.add(line);
      shapes.push(circle1, circle2, line);
    };
    
    createPercentSymbol(new THREE.Vector3(0, 0, -9), "#2A3C41");
    
    // Position camera
    camera.position.z = 5;
    
    // Animation loop
    let animationFrameId: number;
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Rotate all shapes slightly
      shapes.forEach((shape, index) => {
        shape.rotation.x += 0.002;
        shape.rotation.y += 0.003;
        
        // Make them float up and down with different phases
        shape.position.y += Math.sin(Date.now() * 0.001 + index * 0.5) * 0.003;
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
      cancelAnimationFrame(animationFrameId);
      
      // Dispose geometries and materials
      shapes.forEach((shape) => {
        shape.geometry.dispose();
        (shape.material as THREE.Material).dispose();
        scene.remove(shape);
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
