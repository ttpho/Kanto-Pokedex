import React, { useState, useMemo } from 'react';
import { POKEMON_DATA } from './constants';
import PokemonCard from './components/PokemonCard';
import Pokemon3DViewer from './components/Pokemon3DViewer';
import { Pokemon } from './types';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  const filteredPokemon = useMemo(() => {
    return POKEMON_DATA.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.types.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans overflow-x-hidden">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo / Title */}
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20">
                <div className="w-4 h-4 bg-white rounded-full border-2 border-gray-800"></div>
             </div>
             <h1 className="text-2xl font-extrabold tracking-tight text-white">
              <span className="text-yellow-400">Pokemon</span>
             </h1>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search Pokemon or Type..."
              className="w-full bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-full focus:ring-2 focus:ring-yellow-500 focus:border-transparent block w-full pl-10 p-2.5 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg aria-hidden="true" className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-end mb-6 border-b border-gray-800 pb-2">
            <h2 className="text-xl font-bold text-gray-300">Kanto Pokedex</h2>
            <span className="text-sm text-gray-500">{filteredPokemon.length} specimens found</span>
        </div>
        
        {filteredPokemon.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <p className="text-lg">No Pokemon found matching your criteria.</p>
                <button 
                    onClick={() => setSearchTerm('')}
                    className="mt-4 text-yellow-500 hover:underline"
                >
                    Clear Search
                </button>
            </div>
        ) : (
            <div className="flex flex-wrap justify-center gap-4">
            {filteredPokemon.map((pokemon) => (
                <PokemonCard 
                    key={pokemon.index} 
                    pokemon={pokemon} 
                    onClick={() => setSelectedPokemon(pokemon)}
                />
            ))}
            </div>
        )}
      </main>

      {/* 3D Model Viewer Modal */}
      {selectedPokemon && (
        <Pokemon3DViewer 
            pokemon={selectedPokemon} 
            onClose={() => setSelectedPokemon(null)} 
        />
      )}

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900 mt-auto py-8 text-center text-gray-500 text-sm">
        <p>HoloPoke 3D © 2025. Fan made application.</p>
        <p className="mt-2 text-xs opacity-60">Pokemon images and names are property of Nintendo/Game Freak.</p>
      </footer>
    </div>
  );
};

export default App;