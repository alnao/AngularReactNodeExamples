# Story-Game-Book Application

Un'applicazione React sviluppata con Vite in cui esplorare storie interattive ispirate ai classici libri game. Il progetto include un catalogo in un bellissimo stile visivo ("Netflix Style") e una dashboard di gioco divisa a colonne per esplorare luoghi e prendere decisioni.

## Stack Tecnologico
- **Vite & React (TypeScript)**: Base di sviluppo ultra rapida.
- **Tailwind CSS**: Applicato globalmente per posizionamento rapido e layout dark mode avanzati (effetto sfumature, ombre per la home Netflix-style).
- **React-Bootstrap**: Utilizzato per componentistica robusta, come il Modale dei dettagli avventura, per assicurare massima accessibilità.
- **FontAwesome**: Utilizzato per icone intuitive nella lista delle azioni e nei menu.
- **React Router**: Utilizzato per il routing tra la Home Page (`/`) e la schermata di Gioco (`/play/:storyId`).

## Struttura del Progetto

- `src/App.tsx`: Definisce il routing principale tra l'home catalog e il play view.
- `src/Home.tsx`: Mostra una griglia orizzontale a scorrimento, categorizzata in generi. Presenta gli effetti hover-scale e apre il Modale di Info Storia (React-Bootstrap Modal) con la sinossi ed il pulsante per iniziare l'avventura.
- `src/PlayView.tsx`: Il cuore interattivo, diviso in un layout a due colonne:
  - **Colonna di Sinistra**: Elenca tutti i luoghi presenti in una storia per contesto, evidenziando il luogo attuale (`currentLocationId`).
  - **Colonna di Destra**: Mostra un'immagine prominente del luogo attuale, la descrizione narrativa, e la griglia con i pulsanti `Azioni` possibili. Ogni azione scatena messaggi nel pannello contestuale o porta il giocatore in un nuovo Luogo (`targetLocationId`).
- `src/data.ts`: Contiene le definizioni di tipo TypeScript (`Action`, `Location`, `Story`) ed espone i mock con la lista delle avventure. 

## Come Avviare l'Applicazione

1. Installa le dipendenze: `npm install`
2. Avvia in locale: `npm run dev`
3. Genera la build ottimizzata: `npm run build`


# Creazione del progetto
Prompt usato con Gemini 3.1:
> ciao, voglio creare un progetto "story-game-book" nella cartella "ViteBase" , voglio usare React, Vite, Tailwind & bootstrap5 & font-awesome per sviluppare un grande progetto con miliaia di componenti. ho una pagina di home con una lista di storie con grafica stile homepage di netflix. quando si seleziona una storia si apre un popup con il dettaglio della storia e un bottone "Inizia". quando si inizia si mostra un componente dove sono elencate a sinistra l'elenco dei luoghi e a destra l'elenco delle azioni possibili in quel luogo. fai tutto in una nuova cartella "ViteBase"e alla fine scrivi un bel README.md dove spieghi tutti i dettagli tecnici e spiegoni sui componenti, usa react-router e typescript e react-bootstrap e fortawesome  

- ```mkdir -p ViteBase && cd ViteBase && npx -y create-vite@latest ./ --template react-ts && npm install && npm install react-router-dom bootstrap react-bootstrap @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome tailwindcss postcss autoprefixer && npx tailwindcss init -p```
- ```npm install react-router-dom bootstrap react-bootstrap @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome tailwindcss@^3.4 postcss autoprefixer && npx -y tailwindcss init -p```
- ```npm run dev```




## Scelte Architetturali
Abbiamo optato per uno stile UI marcatamente scuro ("Netflix Style") per immergere istantaneamente l'utente. React-Bootstrap viene usato per componenti intrinsecamente complessi (come i popup Modali) evitando l'overhead di ricreare logiche per la gestione dello scroll-lock, lasciando invece a Tailwind CSS la formattazione visuale custom.
L'app sfrutta Typescript in Data Mocking per avere auto-completamento assicurato tra Azioni e le loro interazioni nel `PlayView`.







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


