import { useEffect, useRef } from 'react';
import { useTheme } from '../lib/theme-provider';

interface BinaryRainProps {
  active: boolean;
}

const BinaryRain = ({ active }: BinaryRainProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  
  // Check if we're in dark mode (either explicitly or via system preference)
  const isDarkMode = () => {
    if (theme === 'dark') return true;
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Only run the effect if we're in dark mode and the effect is active
    if (!isDarkMode() || !active) {
      // Clear the canvas when not active
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    setCanvasDimensions();

    // Characters to display (binary and a few special characters)
    const chars = '01';
    const fontSize = 14;
    ctx.font = `${fontSize}px monospace`;
    
    // Calculate columns based on canvas width, with spacing
    const columnSpacing = 1.5; // Add some space between columns
    const columns = Math.floor(canvas.width / (fontSize * columnSpacing));
    
    // Initialize drops position - start above the canvas
    const drops: number[] = Array(columns).fill(0).map(() => -Math.floor(Math.random() * 20));
    
    // Set primary color - matching the header theme yellow
    const primaryColor = '#f6e05e'; // Yellow that matches the IK.AM gradient
    
    // Draw the binary rain effect
    const draw = () => {
      // Semi-transparent black background to create fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Set the font style
      ctx.font = `${fontSize}px monospace`;
      
      // Loop through every column
      for (let i = 0; i < columns; i++) {
        // Generate a random character
        const char = chars.charAt(Math.floor(Math.random() * chars.length));
        
        // Calculate x coordinate with spacing
        const x = i * (fontSize * columnSpacing);
        
        // Calculate y coordinate based on the drop position
        const y = drops[i] * fontSize;
        
        // Gradient color for the head of the drop
        if (drops[i] >= 0 && drops[i] < canvas.height / fontSize) {
          // Head of the drop is brightest
          ctx.fillStyle = primaryColor;
          ctx.fillText(char, x, y);
        }
        
        // Move the drop down
        drops[i]++;
        
        // Reset when the drop reaches the bottom
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.98) {
          drops[i] = -Math.floor(Math.random() * 20);
        }
      }
    };
    
    // Animation loop
    let animationId: number;
    const animate = () => {
      draw();
      animationId = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Event listener for window resize
    window.addEventListener('resize', setCanvasDimensions);
    
    // Cleanup on component unmount
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      cancelAnimationFrame(animationId);
    };
  }, [active, theme]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};

export default BinaryRain;
