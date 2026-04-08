import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faMapMarkerAlt, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { getStoryById, type Action } from './data';

const PlayView: React.FC = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const story = storyId ? getStoryById(storyId) : undefined;

  const [currentLocationId, setCurrentLocationId] = useState<string | null>(
    story?.initialLocationId || null
  );
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  if (!story) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center">
        <h2>Storia non trovata</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-blue-400 underline">Torna alla Home</button>
      </div>
    );
  }

  const currentLocation = currentLocationId ? story.locations[currentLocationId] : null;

  const handleAction = (action: Action) => {
    setActionMessage(null);
    if (action.message) {
      setActionMessage(action.message);
    }
    if (action.targetLocationId) {
      setCurrentLocationId(action.targetLocationId);
    }
  };

  const locationsList = Object.values(story.locations);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center font-sans">
      <div className="w-full flex-grow flex flex-col md:flex-row bg-zinc-900 overflow-hidden shadow-2xl relative">
        
        {/* Left Panel: Locations List */}
        <div className="w-full md:w-1/3 bg-zinc-950 border-r border-zinc-800 flex flex-col relative z-10 shadow-lg">
          <div className="p-6 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur">
            <button 
              onClick={() => navigate('/')}
              className="mb-4 text-zinc-400 hover:text-white transition flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Torna al Catalogo
            </button>
            <h1 className="text-2xl font-bold">{story.title}</h1>
            <p className="text-sm text-zinc-400 mt-1">Personaggio: {story.character}</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <h3 className="text-sm uppercase tracking-wider text-zinc-500 font-bold mb-4 px-2">Luoghi</h3>
            {locationsList.map(loc => {
              const active = loc.id === currentLocationId;
              return (
                <div 
                  key={loc.id}
                  className={`p-3 rounded-lg flex items-center gap-3 transition-colors ${
                    active 
                      ? 'bg-red-600/20 text-red-500 border border-red-900/50' 
                      : 'text-zinc-400 border border-transparent'
                  }`}
                >
                  <FontAwesomeIcon icon={faMapMarkerAlt} className={active ? 'animate-bounce' : ''} />
                  <span className="font-bold">{loc.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel: Current Location Details and Actions */}
        <div className="w-full md:w-2/3 flex flex-col relative">
          {currentLocation ? (
            <>
              {/* Location Header Image */}
              <div className="h-64 relative shrink-0">
                <img 
                  src={currentLocation.image} 
                  alt={currentLocation.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <h2 className="text-4xl font-bold drop-shadow-md">{currentLocation.name}</h2>
                </div>
              </div>

              {/* Location Body & Actions */}
              <div className="flex-1 p-8 overflow-y-auto">
                <p className="text-xl text-zinc-300 leading-relaxed mb-8">
                  {currentLocation.description}
                </p>

                {actionMessage && (
                  <div className="mb-8 p-4 bg-blue-900/30 border border-blue-800 text-blue-200 rounded-lg flex gap-3 items-start animate-fade-in">
                    <FontAwesomeIcon icon={faInfoCircle} className="mt-1 shrink-0" />
                    <p>{actionMessage}</p>
                  </div>
                )}

                <h3 className="text-lg font-bold text-zinc-500 mb-4 tracking-wider uppercase">Azioni Disponibili</h3>
                
                {currentLocation.actions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentLocation.actions.map(action => (
                      <button
                        key={action.id}
                        onClick={() => handleAction(action)}
                        className="group flex flex-col items-center justify-center p-6 bg-zinc-800/50 hover:bg-zinc-700 hover:shadow-lg border border-zinc-700 hover:border-zinc-500 rounded-xl transition duration-200"
                      >
                        <FontAwesomeIcon 
                          icon={action.icon} 
                          className="text-3xl mb-3 text-zinc-400 group-hover:text-white transition-colors" 
                        />
                        <span className="font-bold text-lg text-zinc-200 group-hover:text-white mb-2">
                          {action.name}
                        </span>
                        <span className="text-sm text-zinc-400 text-center">
                          {action.description}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-zinc-500 italic">Nessuna azione disponibile. Fine dell'avventura?</p>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-zinc-600">
              Seleziona un luogo valido.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default PlayView;
