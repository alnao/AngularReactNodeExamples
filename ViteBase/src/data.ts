export interface Action {
  id: string;
  name: string;
  description: string;
  icon: any; // FontAwesome icon object
  targetLocationId?: string;
  message?: string;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  image: string;
  actions: Action[];
}

export interface Story {
  id: string;
  title: string;
  synopsis: string;
  character: string;
  coverImage: string;
  genre: string;
  initialLocationId: string;
  locations: Record<string, Location>;
}

import { faMagnifyingGlass, faDoorOpen, faWalking, faHand, faBrain } from '@fortawesome/free-solid-svg-icons';

export const mockStories: Story[] = [
  {
    id: "1",
    title: "Il Castello Dimenticato",
    synopsis: "Un'oscura avventura tra le rovine di un antico maniero senza tempo. Troverai la via d'uscita prima che cali la notte?",
    character: "Eroe Ramingo",
    coverImage: "https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?auto=format&fit=crop&q=80&w=800",
    genre: "Fantasy",
    initialLocationId: "ingresso",
    locations: {
      "ingresso": {
        id: "ingresso",
        name: "Ingresso Principale",
        description: "Ti trovi davanti al massiccio portone di legno del castello ignoto. L'aria è gelida.",
        image: "https://images.unsplash.com/photo-1621508210350-0a25fa2566ec?auto=format&fit=crop&w=1200",
        actions: [
          { id: "a1", name: "Esamina Portone", description: "Cerca di capire come aprirlo.", icon: faMagnifyingGlass, message: "Il portone è socchiuso, puoi spingerlo per entrare." },
          { id: "a2", name: "Entra", description: "Spingi il portone e scivola all'interno.", icon: faDoorOpen, targetLocationId: "salone" }
        ]
      },
      "salone": {
        id: "salone",
        name: "Salone Reale",
        description: "Il grande salone è addobbato con arazzi laceri dal tempo. Ci sono due passaggi.",
        image: "https://images.unsplash.com/photo-1622322300055-6df3b9247657?auto=format&fit=crop&w=1200",
        actions: [
          { id: "s1", name: "Esplora gli arazzi", description: "Guarda dietro la tela rossa.", icon: faHand, message: "Dietro l'arazzo trovi solo vecchie ragnatele ed un ragno." },
          { id: "s2", name: "Vai in Armeria", description: "Dirigiti verso la stanza delle armi.", icon: faWalking, targetLocationId: "armeria" },
          { id: "s3", name: "Torna indietro", description: "Torna all'ingresso.", icon: faDoorOpen, targetLocationId: "ingresso" }
        ]
      },
      "armeria": {
        id: "armeria",
        name: "Vecchia Armeria",
        description: "Un mucchio di scudi arrugginiti copre il pavimento polveroso.",
        image: "https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&w=1200",
        actions: [
          { id: "ar1", name: "Ricorda", description: "Pensa al motivo per cui sei qui.", icon: faBrain, message: "Stai cercando la spada magica per salvare il reame." },
          { id: "ar2", name: "Torna al Salone", description: "Ritorna sui tuoi passi.", icon: faDoorOpen, targetLocationId: "salone" }
        ]
      }
    }
  },
  {
    id: "2",
    title: "Missione Kepler",
    synopsis: "Inviato nello spazio profondo, ti trovi alla guida di una navetta verso il pianeta Kepler-186f. Scegli le tue azioni con cautela.",
    character: "Comandante Shepard",
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
    genre: "Sci-Fi",
    initialLocationId: "ponte",
    locations: {
      "ponte": {
        id: "ponte",
        name: "Ponte di Comando",
        description: "Le luci al neon lampeggiano attorno a te. Nessun segnale dai radar.",
        image: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1200",
        actions: [
          { id: "p1", name: "Analizza radar", description: "Esegui una scansione di prossimità.", icon: faMagnifyingGlass, message: "Nessuna anomalia rilevata. Settore pulito." },
          { id: "p2", name: "Vai in Stiva", description: "Scendi ai piani inferiori.", icon: faWalking, targetLocationId: "stiva" }
        ]
      },
      "stiva": {
        id: "stiva",
        name: "Stiva di Carico",
        description: "Contenitori di merci e macchinari pesanti sono ammassati per il viaggio.",
        image: "https://images.unsplash.com/photo-1586528116311-ad8ed7c66364?auto=format&fit=crop&w=1200",
        actions: [
          { id: "st1", name: "Apri Cassa A", description: "Controlla le rifornimenti.", icon: faHand, message: "Sono solo razioni di cibo disidratato." },
          { id: "st2", name: "Torna al Ponte", description: "Usa l'ascensore principale.", icon: faWalking, targetLocationId: "ponte" }
        ]
      }
    }
  },
  {
    id: "3",
    title: "Ombre sulla Città",
    synopsis: "Un thriller noir ambientato nel 1930. Sei un investigatore privato col compito di svelare un mistero macabro.",
    character: "Detective Marlowe",
    coverImage: "https://images.unsplash.com/photo-1543355529-6de8b4b7c62d?auto=format&fit=crop&q=80&w=800",
    genre: "Noir",
    initialLocationId: "ufficio",
    locations: {
      "ufficio": {
        id: "ufficio",
        name: "Ufficio del Detective",
        description: "Il tuo vecchio ufficio, odore di fumo e caffè freddo.",
        image: "https://images.unsplash.com/photo-1517409088616-5cbbaac56b26?auto=format&fit=crop&q=80&w=1200",
        actions: [
          { id: "u1", name: "Guarda la scrivania", description: "Esamina il fascicolo aperto.", icon: faMagnifyingGlass, message: "Le foto non mentono. Il caso è difficile." },
          { id: "u2", name: "Esci in strada", description: "Vai in Downtown.", icon: faDoorOpen, targetLocationId: "strada" }
        ]
      },
      "strada": {
        id: "strada",
        name: "Strada Bassa",
        description: "Piove. Le luci dei lampioni si riflettono sull'asfalto bagnato.",
        image: "https://images.unsplash.com/photo-1601618228516-728bdf61c5c9?auto=format&fit=crop&w=1200",
        actions: [
          { id: "st1", name: "Parla con l'informatore", description: "Interroga il tizio all'angolo.", icon: faHand, message: "Ti dice che qualcuno ti sta cercando." },
          { id: "st2", name: "Ritorna all'ufficio", description: "Vai al riparo dalla pioggia.", icon: faDoorOpen, targetLocationId: "ufficio" }
        ]
      }
    }
  },
  {
    id: "4",
    title: "Eco nella Valle",
    synopsis: "Sopravvivenza post-apocalittica nella roccia e nella sabbia. La ricerca dell'oasi verde.",
    character: "Viandante delle terre perdute",
    coverImage: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&q=80&w=800",
    genre: "Adventure",
    initialLocationId: "deserto",
    locations: {
      "deserto": {
        id: "deserto",
        name: "Deserto di Vetro",
        description: "Tratti di sabbia fusa brillano al sole spietato.",
        image: "https://images.unsplash.com/photo-1535492167732-c1724699564f?auto=format&fit=crop&w=1200",
        actions: []
      }
    }
  },
  {
    id: "5",
    title: "La Cripta Perduta",
    synopsis: "Indiana Jones ti fa un baffo. Esplora le piramidi per trovare un artefatto antico.",
    character: "Archeologo Esperto",
    coverImage: "https://images.unsplash.com/photo-1539667468225-eebb663053e6?auto=format&fit=crop&q=80&w=800",
    genre: "Adventure",
    initialLocationId: "tenda",
    locations: {
      "tenda": {
        id: "tenda",
        name: "Tenda Archeologica",
        description: "Il campo base è montato. Fuori c'è un caldo infernale.",
        image: "https://images.unsplash.com/photo-1596404987679-b1dca0e5d4cb?auto=format&fit=crop&w=1200",
        actions: []
      }
    }
  }
];

export const getStoryById = (id: string) => mockStories.find(s => s.id === id);
export const getCategories = () => Array.from(new Set(mockStories.map(s => s.genre)));
