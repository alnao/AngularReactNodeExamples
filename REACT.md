# Appunti REACT

*Writted by AlNao*. Questo README raccoglie una selezione di articoli tecnici scritti da [alnao.it](https://www.alnao.it). Sono riproposti in formato Markdown per conservarli e renderli facilmente consultabili. Alcuni contenuti potrebbero essere datati, ma possono ancora fornire spunti e soluzioni interessanti.


- [React state](#React-state)
    - [Spread operator](#Spread-operator)
- [Vite](#Vite)
- [Tailwind](#Tailwind)

## React class to function
La community di React (e il team di Meta) si è spostata totalmente verso le Function Components e i Hooks.
1. Perché abbandonare le Classi? Il tuo codice attuale ha alcuni problemi tipici delle classi:
    - Logica frammentata: La logica di "caricamento dati" è divisa tra componentDidMount, componentDidUpdate e vari metodi custom.
    - Ereditarietà complessa: extends MyWeb12ListComponent rende difficile capire da dove arrivino certi metodi o stati. In React moderno si preferisce la composizione (usare Hook comuni).
    - Verbocità: Devi scrivere molto più codice (constructor, bind, render, ecc.) rispetto a una funzione.
2. Lo strumento magico: useEffect
    - Se `useState` sostituisce `this.state`, `useEffect` sostituisce tutti i metodi del ciclo di vita: `componentDidMount`, `componentDidUpdate` e `componentWillUnmount`.
    - La sintassi di base
        ```JavaScript
        useEffect(() => {
            // 1. Qui scrivi il codice da eseguire (es: API call)
            return () => {
              // 2. Opzionale: Codice di "pulizia" (cleanup)
            };
        }, [dipendenze]); // 3. L'array di dipendenze
        ```
    - Come interpretare l'array di dipendenze: 
        - `[]` (Array vuoto): Esegue il codice solo una volta al montaggio (come componentDidMount).
        - `[variabile]`: Esegue il codice ogni volta che variabile cambia (come componentDidUpdate).
        - Senza array: Esegue il codice ad ogni render (da evitare quasi sempre).
3. Trasformiamo il tuo codice (Esempio pratico) Prendiamo la parte iniziale del tuo SchemaComponent e trasformiamola in una Function Component moderna con Vite e Tailwind.
    - Prima (Classe):
        ```JavaScript
        componentDidMount(){
            this.setState( { showModal:true } );
            this.getList('rendicontoSchema');
            // ... settaggio variabili ...
        }
        ```
    - Dopo (Funzione + Hooks):
        ```TypeScript
        import React, { useState, useEffect } from 'react';

        const RendicontoSchema = () => {
            const [showModal, setShowModal] = useState(true);
            const [elements, setElements] = useState([]);
            const [variabile5, setVariabile5] = useState('0'); // Anno
            // Sostituisce componentDidMount
            useEffect(() => {
                const fetchData = async () => {
                    try {
                        const response = await MyWebServices.get('schema');
                        setElements(response.data);
                    } finally {
                        setShowModal(false);
                    }
                };
                fetchData();
            }, []); // [] significa: fallo solo all'avvio
            // Sostituisce la logica di "elaboraListaConFiltro" quando cambia l'anno
            useEffect(() => {
                console.log("L'anno è cambiato in:", variabile5);
                // Qui chiameresti la logica di filtraggio
            }, [variabile5]); 
            return (
                <div className="p-4 bg-slate-900 text-white">
                  {showModal ? <Loading /> : <Table data={elements} />}
                </div>
            );
        };
        ```
4. Come gestire la tua "Base Class" (ListComponent): Nel tuo vecchio codice, estendi una classe per ereditare funzioni come getList o applicaFiltroCustom. Nel nuovo progetto, creerai dei Custom Hooks.
    - Invece di: `class MiaPagina extends ListComponent`
    - Farai: `const { elements, getList, filter } = useMyWebList('rendicontoSchema');`
    - Esempio di Custom Hook:
        ```TypeScript
        // src/hooks/useMyWebList.ts
        export const useMyWebList = (endpoint: string) => {
            const [elements, setElements] = useState([]);
            const getList = async () => { /* logica fetch */ };
            const applyFilter = (data: any) => { /* logica filtro */ }; 
            return { elements, getList, applyFilter };
        };
        ```
5. Riassunto per il tuo nuovo progetto:
    - Usa solo Funzioni: Sono più veloci e facili da testare.
    - Usa useEffect per le API: Tutto quello che deve succedere "all'avvio" o "al cambio di un filtro" va lì dentro.
    - Dimentica this: Niente più this.state o this.cambiaAnno. Solo variabili locali e funzioni.


## React state
Qui c'è un piccolo chiarimento da fare: `setState` è il metodo che usavi nelle vecchie Class Components di React. Con l'avvento dei **Hooks** (React 16.8+), nelle Function Components si usa esclusivamente `useState`. Se stai iniziando un progetto moderno con Vite e  TypeScript, userai quasi sicuramente le funzioni, quindi `useState` è il tuo nuovo migliore amico. Ecco come passare dal vecchio mondo al nuovo, con la precisione di TypeScript.
1. Da this.setState a useState: Nelle classi avevi un unico grande oggetto state. In un progetto grande, questo diventava un incubo. Con useState, separi lo stato in pezzi piccoli e gestibili. 
    - Il vecchio modo (Classi)
        ```TypeScript
        // Scomodo, logica mescolata
        this.state = { playerHealth: 100, playerName: "Guerriero" };
        this.setState({ playerHealth: this.state.playerHealth - 10 });
        ```
    - Il nuovo modo (Hooks)
        ```TypeScript
        import { useState } from 'react';
        // Ogni pezzo di stato è indipendente
        const [health, setHealth] = useState<number>(100);
        const [name, setName] = useState<string>("Guerriero");
        // Per aggiornare:
        setHealth(health - 10);
        ```
2. Come funziona useState (I 3 pilastri)
    - Quando chiami useState, React ti restituisce un array con due elementi:   
        - Il valore attuale: La variabile che usi nel JSX.
        - La funzione di aggiornamento: Quella che userai per cambiare il valore.
    - Aggiornamento Semplice
        ```TypeScript
        const [count, setCount] = useState(0);
        const increment = () => setCount(count + 1);
        ```
    - Aggiornamento Funzionale (Cruciale per i Giochi)
        - Se il nuovo stato dipende dal precedente (es. punti esperienza, danno, movimento), usa sempre la funzione di callback. Questo evita bug quando React processa più aggiornamenti velocemente.
        ```TypeScript
        // MODO CORRETTO per calcolare i danni
        const takeDamage = (amount: number) => {
            setHealth((prevHealth) => prevHealth - amount);
        };
        ```
3. Gestire lo stato di Oggetti e Array: Dato che il tuo gioco avrà migliaia di componenti, spesso avrai stati complessi (es. le statistiche di un mostro). Attenzione: a differenza di this.setState, useState non fonde automaticamente gli oggetti. Devi farlo tu con lo spread operator (...).
    ```TypeScript
    interface Stats {
        str: number;
        dex: number;
        int: number;
    }
    const [stats, setStats] = useState<Stats>({ str: 10, dex: 10, int: 10 });
    // Se vuoi aumentare solo la forza (STR):
    const levelUpStr = () => {
        setStats((prev) => ({
            ...prev,     // Copio tutti i valori vecchi
            str: prev.str + 1 // Sovrascrivo solo quello che mi serve
        }));
    };
    ```
4. Perché useState è meglio per il tuo progetto grande?
    - Meno codice: Niente più this.bind(this) o costruttori infiniti.
    - Logic Sharing (Custom Hooks): Questa è la vera magia. Se hai 100 nemici diversi, puoi creare un Hook personalizzato che gestisce la loro vita e riutilizzarlo ovunque.
    - Esempio di Custom Hook: useEntityHealth
        ```TypeScript
        // src/hooks/useEntityHealth.ts
        export const useEntityHealth = (initialHealth: number) => {
            const [health, setHealth] = useState(initialHealth);

            const damage = (amount: number) => setHealth(h => Math.max(0, h - amount));
            const heal = (amount: number) => setHealth(h => h + amount);
            const isDead = health === 0;

            return { health, damage, heal, isDead };
        };
        // In un componente nemico:
        const Orc = () => {
            const { health, damage, isDead } = useEntityHealth(200);
            return <div onClick={() => damage(20)}>Orc Health: {health} {isDead && "💀"}</div>;
        };
        ```
5. Un piccolo avvertimento: Se ti accorgi che in un componente stai usando 15 useState diversi, probabilmente è il momento di passare a useReducer (per logiche locali complesse) o a Zustand (per lo stato globale del gioco).

6. Riepilogo
    | Caratteristica | this.setState | useState (Hooks) | 
    | --- | --- | --- |    
    | Sintassi | Oggetto unico | Variabili multiple/atomiche |
    | Merging | Automatico | Manuale (usando ...spread) |
    | Riusabilità | Difficile (HOC o Render Props) | Facile (Custom Hooks) |
    | Performance | Più pesante | Più leggero e veloce |

### Spread operator
Lo Spread Operator (rappresentato dai tre puntini `...`) è uno degli strumenti più potenti di JavaScript moderno (ES6+). In React, è letteralmente indispensabile per gestire lo stato senza fare pasticci.

Esempio Pratico: Aggiornare le statistiche di un Personaggio
```Typescript
interface Player {
  name: string;
  class: string;
  level: number;
  hp: number;
}

const player: Player = {
  name: "Aragorn",
  class: "Ranger",
  level: 20,
  hp: 150
};

// --- MODO CORRETTO (con Spread Operator) ---
const leveledUpPlayer = {
  ...player,        // 1. "Spalma" qui dentro tutte le proprietà di player
  level: 21         // 2. Sovrascrivi SOLO la proprietà level
};

console.log(leveledUpPlayer);
// Risultato: { name: "Aragorn", class: "Ranger", level: 21, hp: 150 }
```
In React, lo stato è **immutabile**. Non puoi fare player.level = 21. Devi sempre creare un nuovo oggetto. Lo spread operator è il modo più veloce per dire a React: "Prendi tutto quello che c'era prima e cambia solo questo dettaglio".

```Typescript
const [gameState, setGameState] = useState({ score: 0, items: [] });

// Per aggiornare il punteggio senza cancellare l'inventario (items):
setGameState(prev => ({
  ...prev,
  score: prev.score + 10
}));
```
**Trucco da pro**: Se hai un progetto con migliaia di componenti, userai lo spread operator continuamente anche per passare le "props" ai componenti figli in modo rapido: `<Componente {...props} />`.



## Vite
**Vite** è un build tool di nuova generazione. Fondato da Evan You (lo stesso creatore di Vue.js), è diventato lo standard de facto per quasi tutti i framework moderni, superando il vecchio Create React App (CRA/Webpack).

- **Il problema del passato (Webpack/CRA)**: Nelle vecchie architetture, ogni volta che salvavi un file, il bundler doveva analizzare e ricostruire gran parte dell'applicazione. Con 2.000 componenti, questo processo poteva richiedere 10-20 secondi. Ogni. Singola. Volta.
- **La soluzione di Vite**: Vite divide il codice in due categorie:
  - Dependencies: Le librerie che non cambiano spesso (React, Zustand, Tailwind). Vite le pre-assembla una sola volta usando esbuild (scritto in Go, incredibilmente veloce).
  - Source Code: Il tuo codice. Vite non lo "impacchetta" durante lo sviluppo; lo serve direttamente al browser usando i Native ES Modules (ESM). Il browser richiede solo il file che hai appena modificato.

Come iniziare un progetto Vite + TypeScript
  ```npm create vite@latest il-tuo-gioco```
Segui i passaggi:
  - Seleziona un framework: React
  - Seleziona una variante: TypeScript (fondamentale per i tuoi mille componenti!)
  - Poi entra nella cartella, installa le dipendenze e avvia:
    ```bash
    cd il-tuo-gioco
    npm install
    npm run dev
    ```

Esempio Pratico: Configurazione per un Grande Progetto: in un progetto enorme, non puoi usare percorsi relativi infiniti come `import ../../../components/Button`. Vite ti permette di usare gli Aliasing.
1. Configura `vite.config.ts`:
    ```TypeScript
    import { defineConfig } from 'vite'
    import react from '@vitejs/plugin-react'
    import path from 'path'

    export default defineConfig({
      plugins: [react()],
      resolve: {
        alias: {
          // Questo ti permette di scrivere '@features/...' invece di percorsi lunghi
          '@': path.resolve(__dirname, './src'),
          '@features': path.resolve(__dirname, './src/features'),
          '@core': path.resolve(__dirname, './src/core'),
        },
      },
    })```
2. Configura `tsconfig.json` (per TypeScript)
    ```JSON
    {
      "compilerOptions": {
        "baseUrl": ".",
        "paths": {
          "@/*": ["src/*"],
          "@features/*": ["src/features/*"]
        }
      }
    }
    ```
Perché Vite è vitale per il tuo progetto da 1000+ componenti?
- Avvio istantaneo: Non importa quanti file hai, il server di sviluppo parte in millisecondi.
- Build ottimizzata: Per la messa online, Vite usa Rollup, che genera file JavaScript pulitissimi e performanti, rimuovendo automaticamente il codice che non usi (Tree-shaking).
- Gestione Asset: Vite gestisce immagini, JSON e file audio (fondamentali per un gioco) in modo intelligente, permettendoti di importarli come URL o persino come stringhe base64 se piccoli.
- Consiglio pratico: Dato che prevedi migliaia di componenti, abilita fin da subito nel file vite.config.ts il supporto per i file .svg come componenti React (usando il plugin vite-plugin-svgr), ti renderà la gestione delle icone del gioco molto più semplice!




## Tailwind
**Tailwind CSS** è un framework CSS utility-first. A differenza di Bootstrap o Bulma, non ti offre componenti pre-confezionati (come un .btn o una .card). Ti offre invece delle "classi atomiche" che controllano singole proprietà CSS (es. flex, pt-4, text-center).-
- **Velocità di sviluppo**: Non devi inventare nomi di classi (come story-container-v2-final) o saltare continuamente tra il file HTML e il file CSS.
- **Manutenibilità**: In un progetto grande, il CSS tende a crescere all'infinito perché si ha paura di cancellare classi vecchie. Con Tailwind, se cancelli un componente, lo stile sparisce con esso.
- **Bundle Size ridotto**: Tailwind scansiona il tuo codice e genera un file CSS che contiene solo le classi che hai usato.

1. Usare Tailwind SENZA React (Vanilla TypeScript)
In un contesto senza framework, Tailwind viene solitamente compilato tramite la sua CLI. Immaginiamo di voler creare una card per una "Story" del tuo gioco usando solo TypeScript.
  - Il Markup (index.html):
    ```HTML
    <div id="app" class="bg-slate-900 min-h-screen p-8 text-white">
    </div>
    ```
  - La Logica (main.ts):
    ```TypeScript
    interface Story {
      title: string;
      isActive: boolean;
    }
    const story: Story = { title: "La Foresta Incantata", isActive: true };
    const app = document.getElementById('app');
    if (app) {
      const card = document.createElement('div');
      // Usiamo le utility classes di Tailwind direttamente nelle stringhe
      card.className = `
        max-w-sm p-6 rounded-lg shadow-xl border-l-4 
        ${story.isActive ? 'border-green-500 bg-slate-800' : 'border-gray-500 bg-slate-700'}
      `;

      card.innerHTML = `
        <h2 class="text-xl font-bold mb-2">${story.title}</h2>
        <p class="text-slate-400">Clicca per esplorare questa storia.</p>
        <button class="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors">
          Apri
        </button>
      `;

      app.appendChild(card);
    }
    ```
2. Usare Tailwind CON React (e TypeScript)
  - In React, Tailwind brilla davvero perché puoi comporre le classi in base allo "stato" del componente. Qui è dove la scalabilità diventa reale.
  - Il Componente (StoryCard.tsx):
    ```TypeScript
    import React from 'react';

    interface StoryProps {
      title: string;
      description: string;
      status: 'active' | 'locked' | 'completed';
    }

    // Definiamo dei "piani" di stile per mantenere il TS pulito
    const statusStyles: Record<string, string> = {
      active: 'border-blue-500 bg-blue-900/20 ring-1 ring-blue-500',
      locked: 'border-gray-700 bg-gray-900 opacity-50 grayscale',
      completed: 'border-green-500 bg-green-900/20'
    };

    export const StoryCard: React.FC<StoryProps> = ({ title, description, status }) => {
      return (
        <div className={`p-5 border-2 rounded-2xl transition-all duration-300 ${statusStyles[status]}`}>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
            {status === 'completed' && <span className="text-green-400 text-xs">✓ Completata</span>}
          </div>
          
          <p className="text-slate-400 text-sm leading-relaxed">
            {description}
          </p>

          <button 
            disabled={status === 'locked'}
            className={`mt-6 w-full py-2 rounded-lg font-semibold uppercase text-xs tracking-widest
              ${status === 'locked' 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-white text-black hover:bg-blue-400 transition-colors'}
            `}
          >
            {status === 'locked' ? 'Bloccata' : 'Inizia Avventura'}
          </button>
        </div>
      );
    };
    ```
  - Perché questa combo è imbattibile per un progetto grande?
    - Constraint-based Design: Tailwind non ti permette di usare "qualsiasi" colore o margine. Ti costringe a usare una scala (es. p-1, p-2, p-4). Questo garantisce che 2000 componenti diversi abbiano tutti gli stessi spazi e colori, creando coerenza visiva.
    - Varianti Responsive: Vuoi che una griglia di storie passi da 1 colonna a 4 colonne? Ti basta scrivere grid-cols-1 md:grid-cols-2 lg:grid-cols-4. Niente Media Queries scritte a mano.
    - Integrazione con IDE: Se usi VS Code, l'estensione Tailwind CSS IntelliSense ti suggerisce le classi mentre scrivi e ti mostra l'anteprima del colore. Con TypeScript attivo, se sbagli a passare una prop allo stile, il compilatore ti ferma prima ancora di aprire il browser.








# &lt; AlNao /&gt;
Tutti i codici sorgente e le informazioni presenti in questo repository sono frutto di un attento e paziente lavoro di sviluppo da parte di AlNao, che si è impegnato a verificarne la correttezza nella misura massima possibile. Qualora parte del codice o dei contenuti sia stato tratto da fonti esterne, la relativa provenienza viene sempre citata, nel rispetto della trasparenza e della proprietà intellettuale. 


Alcuni contenuti e porzioni di codice presenti in questo repository sono stati realizzati anche grazie al supporto di strumenti di intelligenza artificiale, il cui contributo ha permesso di arricchire e velocizzare la produzione del materiale. Ogni informazione e frammento di codice è stato comunque attentamente verificato e validato, con l’obiettivo di garantire la massima qualità e affidabilità dei contenuti offerti. 


Per ulteriori dettagli, approfondimenti o richieste di chiarimento, si invita a consultare il sito [AlNao.it](https://www.alnao.it/).


## License
Made with ❤️ by Made with ❤️ by [@alnao](https://github.com/alnao)
&bull; 
Public projects 
<a href="https://www.gnu.org/licenses/gpl-3.0"  valign="middle"> <img src="https://img.shields.io/badge/License-GPL%20v3-blue?style=plastic" alt="GPL v3" valign="middle" /></a>
*Free Software!*


Il software è distribuito secondo i termini della GNU General Public License v3.0. L'uso, la modifica e la ridistribuzione sono consentiti, a condizione che ogni copia o lavoro derivato sia rilasciato con la stessa licenza. Il contenuto è fornito "così com'è", senza alcuna garanzia, esplicita o implicita.


The software is distributed under the terms of the GNU General Public License v3.0. Use, modification, and redistribution are permitted, provided that any copy or derivative work is released under the same license. The content is provided "as is", without any warranty, express or implied.



