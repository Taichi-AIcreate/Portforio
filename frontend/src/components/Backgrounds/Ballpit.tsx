import React, { useRef, useEffect } from "react";
import * as THREE from "three";

interface BallpitProps {
  className?: string;
  followCursor?: boolean;
  colors?: number[];
  count?: number;
}

const Ballpit: React.FC<BallpitProps> = ({
  className = "",
  followCursor = true,
  colors = [0x7dd3fc, 0xfca5a5, 0xfde68a, 0x86efac, 0xd8b4fe],
  count = 200,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const spheresRef = useRef<THREE.Mesh[]>([]);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 15;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      canvas, 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    // Create spheres
    const spheres: THREE.Mesh[] = [];
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);

    for (let i = 0; i < count; i++) {
      const color = colors[i % colors.length];
      const material = new THREE.MeshPhongMaterial({ 
        color: color,
        transparent: true,
        opacity: 0.8,
        shininess: 100
      });
      const sphere = new THREE.Mesh(geometry, material);
      
      // Random position
      sphere.position.x = (Math.random() - 0.5) * 20;
      sphere.position.y = (Math.random() - 0.5) * 20;
      sphere.position.z = (Math.random() - 0.5) * 10;
      
      // Add velocity for floating effect
      (sphere as any).velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02
      );
      
      spheres.push(sphere);
      scene.add(sphere);
    }
    spheresRef.current = spheres;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);

    // Mouse interaction
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    let mouseSphere: THREE.Mesh | null = null;

    function onMouseMove(event: MouseEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(spheres);
      
      if (intersects.length > 0) {
        mouseSphere = intersects[0].object as THREE.Mesh;
      } else {
        mouseSphere = null;
      }
    }

    if (followCursor) {
      canvas.addEventListener('mousemove', onMouseMove);
    }

    // Animation
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      // Update sphere positions for floating effect
      spheres.forEach((sphere, index) => {
        const velocity = (sphere as any).velocity;
        sphere.position.add(velocity);
        
        // Bounce off boundaries
        if (Math.abs(sphere.position.x) > 10) {
          velocity.x *= -0.8;
        }
        if (Math.abs(sphere.position.y) > 10) {
          velocity.y *= -0.8;
        }
        if (Math.abs(sphere.position.z) > 5) {
          velocity.z *= -0.8;
        }
        
        // Add slight gravity effect
        velocity.y -= 0.001;
        
        // Add some rotation
        sphere.rotation.x += 0.01;
        sphere.rotation.y += 0.01;
        
        // Mouse interaction effect
        if (mouseSphere === sphere && followCursor) {
          (sphere.material as THREE.MeshPhongMaterial).color.setHex(0xffffff);
          sphere.scale.setScalar(1.2);
        } else {
          const color = colors[index % colors.length];
          (sphere.material as THREE.MeshPhongMaterial).color.setHex(color);
          sphere.scale.setScalar(1.0);
        }
      });
      
      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (followCursor) {
        canvas.removeEventListener('mousemove', onMouseMove);
      }
      window.removeEventListener('resize', handleResize);
      
      // Dispose of resources
      geometry.dispose();
      spheres.forEach(sphere => {
        (sphere.material as THREE.Material).dispose();
      });
      renderer.dispose();
    };
  }, [count, followCursor, colors]);

  return <canvas className={`${className} w-full h-full`} ref={canvasRef} />;
};

export default Ballpit;
