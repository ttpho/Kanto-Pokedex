import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ImageSize } from '../types';

const Generator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<ImageSize>(ImageSize.SIZE_1K);
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [apiKeyReady, setApiKeyReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkApiKey = async () => {
    const aiStudio = (window as any).aistudio;
    if (aiStudio) {
        const hasKey = await aiStudio.hasSelectedApiKey();
        setApiKeyReady(hasKey);
    }
  };

  useEffect(() => {
    checkApiKey();
  }, []);

  const handleSelectKey = async () => {
    const aiStudio = (window as any).aistudio;
    if (aiStudio) {
        try {
            await aiStudio.openSelectKey();
            // Assume success if no error, as per instructions
            setApiKeyReady(true);
        } catch (e) {
            console.error("Key selection failed", e);
            setError("Failed to select API Key. Please try again.");
        }
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
        // Create new instance right before call as per instructions
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: {
                parts: [
                    { text: prompt }
                ]
            },
            config: {
                imageConfig: {
                    imageSize: size,
                    aspectRatio: "3:4" // Best for card format
                }
            }
        });

        if (response.candidates && response.candidates[0].content.parts) {
            let foundImage = false;
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData && part.inlineData.data) {
                    const base64Data = part.inlineData.data;
                    const mimeType = part.inlineData.mimeType || 'image/png';
                    setGeneratedImage(`data:${mimeType};base64,${base64Data}`);
                    foundImage = true;
                    break;
                }
            }
            if (!foundImage) {
                setError("No image generated. The model might have returned text only.");
            }
        } else {
            setError("Invalid response from API.");
        }

    } catch (e: any) {
        console.error("Generation error:", e);
        if (e.message && e.message.includes("Requested entity was not found")) {
             setApiKeyReady(false);
             setError("API Key invalid or expired. Please select a new key.");
        } else {
             setError("Failed to generate image. Please try again.");
        }
    } finally {
        setLoading(false);
    }
  };

  if (!apiKeyReady) {
      return (
          <div className="flex flex-col items-center justify-center p-12 bg-gray-800 rounded-xl shadow-lg border border-gray-700 text-center max-w-lg mx-auto mt-10">
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">Unlock the Lab</h2>
              <p className="text-gray-300 mb-6">
                  To access the secret Pokemon cloning facility (Image Generation), you need to provide a valid paid API Key for the high-performance Gemini 3 Pro model.
              </p>
              <button 
                onClick={handleSelectKey}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-md transition-all transform hover:scale-105"
              >
                  Select API Key
              </button>
              <p className="mt-4 text-xs text-gray-500">
                  <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-300">
                      Learn more about billing
                  </a>
              </p>
          </div>
      );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6 max-w-6xl mx-auto bg-gray-800 rounded-xl border border-gray-700 shadow-2xl mt-8">
        {/* Controls */}
        <div className="flex-1 flex flex-col gap-6">
            <div>
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500 mb-2">
                    Cloning Lab
                </h2>
                <p className="text-gray-400 text-sm">
                    Describe a new species of Pokemon to bring it to life using Gemini 3 Pro technology.
                </p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Description Prompt</label>
                    <textarea 
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none transition-all"
                        rows={4}
                        placeholder="E.g., A ghost type Pokemon that looks like a floating lantern with blue flames..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Resolution Quality</label>
                    <div className="flex gap-4">
                        {Object.values(ImageSize).map((s) => (
                            <button
                                key={s}
                                onClick={() => setSize(s)}
                                className={`flex-1 py-2 px-4 rounded-lg border transition-all ${
                                    size === s 
                                    ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400' 
                                    : 'bg-gray-900 border-gray-600 text-gray-400 hover:border-gray-500'
                                }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <button
                onClick={handleGenerate}
                disabled={loading || !prompt}
                className={`w-full py-4 rounded-lg font-bold text-lg shadow-lg transition-all transform hover:scale-[1.02] ${
                    loading || !prompt
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500'
                }`}
            >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Synthesizing DNA...
                    </span>
                ) : (
                    'Generate Pokemon'
                )}
            </button>
        </div>

        {/* Preview Area */}
        <div className="flex-1 flex items-center justify-center bg-gray-900 rounded-xl border-2 border-dashed border-gray-700 min-h-[400px]">
            {generatedImage ? (
                <div className="relative group perspective-1000">
                    <div className="relative transform-style-3d transition-transform duration-200 hover:rotate-y-12 hover:rotate-x-12">
                         <img 
                            src={generatedImage} 
                            alt="Generated Pokemon" 
                            className="max-w-full max-h-[500px] rounded-lg shadow-2xl object-contain border-4 border-yellow-500/50"
                        />
                         {/* Simple glow for generated image */}
                         <div className="absolute inset-0 rounded-lg shadow-[0_0_50px_rgba(234,179,8,0.3)] pointer-events-none"></div>
                    </div>
                </div>
            ) : (
                <div className="text-center text-gray-500">
                    <div className="text-6xl mb-4 opacity-30">🧬</div>
                    <p>No specimen created yet.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default Generator;