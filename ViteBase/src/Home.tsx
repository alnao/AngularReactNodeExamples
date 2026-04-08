import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { mockStories, getCategories, type Story } from './data';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const Home: React.FC = () => {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const categories = getCategories();
  const navigate = useNavigate();

  const handleStart = () => {
    if (selectedStory) {
      navigate(`/play/${selectedStory.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20">
      {/* Hero Section */}
      {mockStories.length > 0 && (
        <div className="relative h-[60vh] md:h-[80vh] w-full">
          <div className="absolute inset-0">
            <img 
              src={mockStories[0].coverImage} 
              alt="Hero Cover" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>
          </div>
          <div className="absolute bottom-0 left-0 p-8 md:p-16 w-full md:w-2/3">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg">{mockStories[0].title}</h1>
            <p className="text-lg md:text-xl mb-6 text-gray-200 drop-shadow-md line-clamp-3">{mockStories[0].synopsis}</p>
            <div className="flex gap-4">
              <button 
                onClick={() => navigate(`/play/${mockStories[0].id}`)}
                className="bg-white text-black px-6 py-2 md:px-8 md:py-3 rounded hover:bg-gray-200 transition font-bold flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faPlay} /> Inizia
              </button>
              <button 
                onClick={() => setSelectedStory(mockStories[0])}
                className="bg-zinc-600/70 text-white px-6 py-2 md:px-8 md:py-3 rounded hover:bg-zinc-500/70 transition font-bold flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faInfoCircle} /> Altre info
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Catalog Rows */}
      <div className="px-4 md:px-12 -mt-8 relative z-10 space-y-12">
        {categories.map((category) => {
          const categoryStories = mockStories.filter(s => s.genre === category);
          if (categoryStories.length === 0) return null;

          return (
            <div key={category} className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100">{category}</h2>
              <div className="flex gap-4 overflow-x-auto hide-scroll-bar pb-4">
                {categoryStories.map((story) => (
                  <div 
                    key={story.id} 
                    className="flex-none w-48 md:w-64 relative group cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-20"
                    onClick={() => setSelectedStory(story)}
                  >
                    <img 
                      src={story.coverImage} 
                      alt={story.title} 
                      className="w-full h-28 md:h-36 object-cover rounded shadow-lg"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
                      <p className="font-bold text-center px-2">{story.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Story Details Modal */}
      <Modal 
        show={!!selectedStory} 
        onHide={() => setSelectedStory(null)} 
        centered
        contentClassName="bg-zinc-900 text-white border-0 shadow-2xl rounded-lg overflow-hidden"
      >
        {selectedStory && (
          <>
            <div className="relative h-64">
              <img 
                src={selectedStory.coverImage} 
                alt="Modal header" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent"></div>
              <button 
                onClick={() => setSelectedStory(null)}
                className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/50 rounded-full w-8 h-8 flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <Modal.Body className="px-6 py-8">
              <h3 className="text-3xl font-bold mb-2">{selectedStory.title}</h3>
              <div className="flex gap-2 text-sm text-gray-400 mb-6">
                <span className="font-bold text-green-500">Consigliato per te</span>
                <span>•</span>
                <span>{selectedStory.genre}</span>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                {selectedStory.synopsis}
              </p>
              <div className="bg-zinc-800 p-4 rounded text-sm mb-6">
                <span className="text-gray-400">Personaggio: </span>
                <span className="font-bold">{selectedStory.character}</span>
              </div>
              
              <Button 
                variant="light" 
                className="w-full font-bold py-3 text-lg flex items-center justify-center gap-2 hover:bg-zinc-200"
                onClick={handleStart}
              >
                <FontAwesomeIcon icon={faPlay} /> Inizia Avventura
              </Button>
            </Modal.Body>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Home;
