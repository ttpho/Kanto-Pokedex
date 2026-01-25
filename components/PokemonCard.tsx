import React, { useRef, useState, MouseEvent, useEffect } from 'react';
import { Pokemon } from '../types';

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick?: () => void;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  const [badgesVisible, setBadgesVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
        setBadgesVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation:
    // Center of card is (width/2, height/2)
    // Range x: -1 to 1, y: -1 to 1
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Rotation X is controlled by Mouse Y (up/down tilts card around X axis)
    // Rotation Y is controlled by Mouse X (left/right tilts card around Y axis)
    const rotateX = ((y - centerY) / centerY) * -15; // Max 15 deg tilt
    const rotateY = ((x - centerX) / centerX) * 15;

    setRotation({ x: rotateX, y: rotateY });
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setOpacity(0);
    setIsPressed(false);
  };

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);

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

  const isHovered = opacity > 0;
  // Scale logic: Normal 1, Hover 1.05, Pressed 0.95
  const scale = isPressed ? 0.95 : (isHovered ? 1.05 : 1);

  return (
    <div 
        className={`card-container perspective-1000 w-64 h-96 m-4 relative group ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
    >
      <div
        ref={cardRef}
        className="w-full h-full relative transition-transform duration-100 ease-linear transform-style-3d shadow-xl rounded-xl"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${scale})`,
          boxShadow: isPressed 
            ? '0 5px 15px rgba(0,0,0,0.3)'
            : (isHovered 
                ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 25px rgba(255, 255, 255, 0.4)' 
                : undefined)
        }}
      >
        {/* Card Background & Content */}
        <div className={`absolute inset-0 bg-white rounded-xl overflow-hidden border-[6px] ${getTypeBorderColor(pokemon.types[0])} flex flex-col backface-hidden`}>
            {/* Header */}
            <div className="w-full flex justify-between items-center p-4 bg-white text-gray-800 z-10">
                <span className="font-bold text-xl">{pokemon.name}</span>
                <span className="text-sm font-bold text-gray-500">{pokemon.index}</span>
            </div>

            {/* Image Area - Fills available space */}
            <div className="flex-1 relative flex items-center justify-center -mt-4 mb-2">
                <img 
                    src={pokemon.imageUrl} 
                    alt={pokemon.name} 
                    className="w-full h-full object-contain p-2 z-10 max-h-[260px]"
                    loading="lazy"
                />
            </div>

            {/* Types Area - Aligned to bottom */}
            <div className="w-full p-4 pt-0 flex justify-center items-end z-10">
                 <div className="flex gap-2">
                    {pokemon.types.map((t, i) => (
                        <span 
                            key={t} 
                            className={`text-xs px-4 py-1.5 rounded-full text-white font-bold uppercase tracking-wide shadow-md ${getTypeColor(t)} transition-all duration-700 ease-out transform ${badgesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                            style={{ transitionDelay: `${i * 150}ms` }}
                        >
                            {t}
                        </span>
                    ))}
                 </div>
            </div>
        </div>

        {/* Holographic Overlay */}
        <div 
            className="absolute inset-0 holo-gradient rounded-xl z-20 pointer-events-none"
            style={{
                backgroundPosition: `${rotation.y * 5}% ${rotation.x * 5}%`,
                opacity: opacity ? 0.7 : 0 
            }}
        />
        
        {/* Shine/Glare Effect */}
        <div 
            className="absolute inset-0 z-30 pointer-events-none rounded-xl"
            style={{
                background: `linear-gradient(135deg, rgba(255,255,255,${opacity * 0.4}) 0%, transparent 40%, transparent 100%)`,
                transform: `translateX(${rotation.y * -2}px) translateY(${rotation.x * -2}px)`
            }}
        />

      </div>
    </div>
  );
};

export default PokemonCard;