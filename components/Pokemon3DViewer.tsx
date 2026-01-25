import React, { useState, useRef, useEffect } from 'react';
import { Pokemon } from '../types';

interface Pokemon3DViewerProps {
  pokemon: Pokemon;
  onClose: () => void;
}

const Pokemon3DViewer: React.FC<Pokemon3DViewerProps> = ({ pokemon, onClose }) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const startRef = useRef({ x: 0, y: 0 });
  const lastRotationRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize automatic rotation for effect
  useEffect(() => {
    let animationFrameId: number;
    
    const animate = () => {
      if (!isDragging) {
        setRotation(prev => ({
          x: prev.x * 0.95, // Return to upright slowly
          y: prev.y + 0.2 // Slow spin
        }));
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    startRef.current = { x: clientX, y: clientY };
    lastRotationRef.current = { ...rotation };
  };

  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;

    const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;

    const deltaX = clientX - startRef.current.x;
    const deltaY = clientY - startRef.current.y;

    // RotateY is affected by X movement, RotateX by Y movement
    setRotation({
      x: lastRotationRef.current.x - deltaY * 0.5,
      y: lastRotationRef.current.y + deltaX * 0.5
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Attach global listeners for dragging outside container
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  // Helpers duplicated from PokemonCard for consistent styling
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'grass': return 'bg-green-500';
      case 'fire': return 'bg-red-500';
      case 'water': return 'bg-blue-500';
      case 'electric': return 'bg-yellow-400';
      case 'psychic': return 'bg-pink-500';
      case 'normal': return 'bg-gray-400';
      case 'ice': return 'bg-cyan-300';
      case 'fighting': return 'bg-orange-600';
      case 'poison': return 'bg-purple-500';
      case 'ground': return 'bg-yellow-700';
      case 'flying': return 'bg-indigo-300';
      case 'bug': return 'bg-lime-500';
      case 'rock': return 'bg-yellow-800';
      case 'ghost': return 'bg-purple-700';
      case 'dragon': return 'bg-indigo-600';
      case 'steel': return 'bg-gray-300';
      case 'fairy': return 'bg-pink-300';
      default: return 'bg-gray-500';
    }
  };

  const getTypeBorderColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'grass': return 'border-green-500';
      case 'fire': return 'border-red-500';
      case 'water': return 'border-blue-500';
      case 'electric': return 'border-yellow-400';
      case 'psychic': return 'border-pink-500';
      case 'normal': return 'border-gray-400';
      case 'ice': return 'border-cyan-300';
      case 'fighting': return 'border-orange-600';
      case 'poison': return 'border-purple-500';
      case 'ground': return 'border-yellow-700';
      case 'flying': return 'border-indigo-300';
      case 'bug': return 'border-lime-500';
      case 'rock': return 'border-yellow-800';
      case 'ghost': return 'border-purple-700';
      case 'dragon': return 'border-indigo-600';
      case 'steel': return 'border-gray-300';
      case 'fairy': return 'border-pink-300';
      default: return 'border-gray-500';
    }
  };

  return (
    <div 
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md perspective-1000 overflow-hidden"
    >
        <div 
            className="absolute top-4 right-4 z-[101]"
        >
            <button 
                onClick={onClose}
                className="text-white bg-gray-800/50 hover:bg-gray-700/80 rounded-full p-2 transition-colors border border-white/20"
            >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <div className="absolute bottom-10 left-0 right-0 text-center pointer-events-none z-[101]">
            <p className="text-white/70 text-sm bg-black/40 inline-block px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
                <span className="mr-2">🖱️</span> Click & Drag to inspect 3D Model
            </p>
        </div>

        {/* 3D Scene Container */}
        <div 
            ref={containerRef}
            className="relative w-80 h-[28rem] transform-style-3d cursor-grab active:cursor-grabbing"
            style={{ 
                transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                transition: isDragging ? 'none' : 'transform 0.1s linear' // Smooth auto-rotate, instant drag
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
        >
            {/* Front Face */}
            <div className="absolute inset-0 backface-hidden">
                 <div className={`w-full h-full bg-white rounded-xl overflow-hidden border-[6px] ${getTypeBorderColor(pokemon.types[0])} flex flex-col shadow-2xl relative`}>
                    {/* Header */}
                    <div className="w-full flex justify-between items-center p-4 bg-white text-gray-800 z-10">
                        <span className="font-bold text-xl">{pokemon.name}</span>
                        <span className="text-sm font-bold text-gray-500">{pokemon.index}</span>
                    </div>

                    {/* Image Area */}
                    <div className="flex-1 relative flex items-center justify-center -mt-4 mb-2 bg-white">
                        <img 
                            src={pokemon.imageUrl} 
                            alt={pokemon.name} 
                            className="w-full h-full object-contain p-4 z-10"
                        />
                    </div>

                    {/* Types Area */}
                    <div className="w-full p-4 pt-0 flex justify-center items-end z-10 bg-white">
                        <div className="flex gap-2">
                            {pokemon.types.map(t => (
                                <span key={t} className={`text-xs px-4 py-1.5 rounded-full text-white font-bold uppercase tracking-wide shadow-md ${getTypeColor(t)}`}>
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Holo Effects for Front */}
                    <div 
                        className="absolute inset-0 holo-gradient rounded-xl z-20 pointer-events-none opacity-50"
                        style={{
                            backgroundPosition: `${rotation.y * 5}% ${rotation.x * 5}%`,
                        }}
                    />
                     <div 
                        className="absolute inset-0 z-30 pointer-events-none rounded-xl"
                        style={{
                            background: `linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 40%, transparent 100%)`,
                        }}
                    />
                </div>
            </div>

            {/* Back Face */}
            <div 
                className="absolute inset-0 backface-hidden rounded-xl overflow-hidden shadow-2xl border-[6px] border-blue-900 bg-[#1a4da0]"
                style={{ transform: 'rotateY(180deg)' }}
            >
                <div className="w-full h-full relative flex items-center justify-center">
                     {/* Pokeball Design Pattern */}
                     <div className="absolute inset-0 opacity-20" 
                          style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #ffffff 2px, transparent 2.5px)', backgroundSize: '20px 20px' }}>
                     </div>
                     
                     {/* Central Pokeball Graphic */}
                     <div className="w-40 h-40 rounded-full border-[12px] border-white bg-red-600 relative overflow-hidden shadow-xl">
                        {/* Bottom half white */}
                        <div className="absolute bottom-0 w-full h-1/2 bg-white border-t-[12px] border-black/20"></div>
                        {/* Center button */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full border-[6px] border-blue-900 z-10"></div>
                        {/* Horizontal Line */}
                        <div className="absolute top-1/2 left-0 w-full h-[12px] bg-blue-900 transform -translate-y-1/2"></div>
                     </div>
                </div>
            </div>
            
            {/* Thickness simulation (Side Faces) - Simple white layers to hide the gap */}
            {/* We can skip this for simple CSS 3D, or add if requested. Sticking to simple planes for performance/cleanliness */}

        </div>
    </div>
  );
};

export default Pokemon3DViewer;