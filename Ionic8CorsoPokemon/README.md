# 🎮 Ionic 8 Pokemon App

Una moderna applicazione mobile sviluppata con **Ionic 8** e **Angular 20** per esplorare il mondo dei Pokemon utilizzando le **PokeAPI**.

Esempio liberamente ispirata alle guide [Building an Ionic 4 Pokédex](https://www.youtube.com/watch?v=Nc1RqvDY-B8) e [devdactic.com](https://devdactic.com/ionic-4-pokedex-search-scroll), esempio aggiornato alla versione 8 di Ionic nell'estate 2025.

![Ionic](https://img.shields.io/badge/Ionic-8.0-blue?style=flat-square&logo=ionic)
![Angular](https://img.shields.io/badge/Angular-20.0-red?style=flat-square&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/License-GPLv3-blue?style=flat-square)

## 🚀 Caratteristiche

- 📱 Interfaccia Moderna
    - **Design responsivo** ottimizzato per dispositivi mobili e desktop
    - **Navigazione a tab** intuitiva e user-friendly
    - **Componenti standalone** per migliori performance
    - **Animazioni fluide** e transizioni native
- 🔍 Funzionalità Pokemon
    - **Esplorazione Pokemon**: Naviga attraverso centinaia di Pokemon
    - **Dettagli completi**: Visualizza statistiche, abilità e sprite
    - **Ricerca avanzata**: Trova rapidamente i tuoi Pokemon preferiti
    - **Immagini dinamiche**: Sprite ufficiali ad alta qualità
- ❤️ Sistema Preferiti
    - **Aggiungi/Rimuovi**: Gestisci facilmente i tuoi Pokemon preferiti
    - **Conferma rimozione**: Dialog di sicurezza per evitare cancellazioni accidentali
    - **Feedback visivo**: Toast informativi per ogni azione
    - **Persistenza locale**: I preferiti vengono salvati sul dispositivo
- 🔗 Condivisione Social
    - **Condivisione nativa**: Usa l'API Web Share quando disponibile
    - **Fallback clipboard**: Copia automatica negli appunti su dispositivi non supportati
    - **Link personalizzati**: Include riferimenti al sito alnao.it
- 🛠️ Stack Tecnologico
    - **Ionic 8**: Framework per app ibride
    - **Angular 20**: Framework JavaScript moderno
    - **TypeScript**: Tipizzazione statica per JavaScript
    - **RxJS**: Programmazione reattiva e Observable
    - **Ionic Storage**: Persistenza dati locale
    - **PokeAPI**: API REST gratuita per dati Pokemon
- 📁 Struttura del Progetto
    ```
    src/
    ├── app/
    │   ├── home/                    # Pagina principale con lista Pokemon
    │   │   ├── home.page.html
    │   │   ├── home.page.ts
    │   │   └── home.page.scss
    │   ├── favoriti/               # Gestione Pokemon preferiti
    │   │   ├── favoriti.page.html
    │   │   ├── favoriti.page.ts
    │   │   └── favoriti.page.scss
    │   ├── contatti/               # Informazioni contatto
    │   │   ├── contatti.page.html
    │   │   ├── contatti.page.ts
    │   │   └── contatti.page.scss
    │   ├── pages/
    │   │   └── pokemon-detail/     # Dettagli Pokemon
    │   ├── services/
    │   │   └── pokemon-api.service.ts  # Servizio API Pokemon
    │   ├── toolbar/                # Componente toolbar condiviso
    │   └── tabs/                   # Navigazione a tab
    ├── environments/               # Configurazioni ambiente
    └── assets/                    # Risorse statiche
    ```

## 🚀 Installazione e Setup
- Prerequisiti
    - **Node.js** (v18 o superiore)
    - **npm** o **yarn**
    - **Ionic CLI** (`npm install -g @ionic/cli`)
    - **Angular CLI** (`npm install -g @angular/cli`)
- Creazione del progetto
    ```bash
	npm install -g @ionic/cli
	ionic start nome-progetto blank --type=angular
	cd nome-progetto
	ionic serve
	npm install typescript@latest --save-dev
	npm install @ionic/angular@latest @ionic/core@latest --save
	npm install @stencil/core@latest --save-dev
	npm update @ionic/angular @ionic/core @angular/core
    ```
- Installare le Dipendenze
    ```bash
    npm install
    ```
- Avviare il Server di Sviluppo
    ```bash
    ionic serve
    ```
    - l'applicazione sarà disponibile su `http://localhost:8100`
- 📱 Build e Deploy
    ```bash
    ionic build --prod
    ```
    Build per Piattaforme Native
    ```bash
    ionic capacitor add android
    ionic capacitor build android
    ```



# &lt; AlNao /&gt;
Tutti i codici sorgente e le informazioni presenti in questo repository sono frutto di un attento e paziente lavoro di sviluppo da parte di AlNao, che si è impegnato a verificarne la correttezza nella misura massima possibile. Qualora parte del codice o dei contenuti sia stato tratto da fonti esterne, la relativa provenienza viene sempre citata, nel rispetto della trasparenza e della proprietà intellettuale. 


Alcuni contenuti e porzioni di codice presenti in questo repository sono stati realizzati anche grazie al supporto di strumenti di intelligenza artificiale, il cui contributo ha permesso di arricchire e velocizzare la produzione del materiale. Ogni informazione e frammento di codice è stato comunque attentamente verificato e validato, con l’obiettivo di garantire la massima qualità e affidabilità dei contenuti offerti. 


Per ulteriori dettagli, approfondimenti o richieste di chiarimento, si invita a consultare il sito [AlNao.it](https://www.alnao.it/).


## License
Made with ❤️ by <a href="https://www.alnao.it">AlNao</a>
&bull; 
Public projects 
<a href="https://www.gnu.org/licenses/gpl-3.0"  valign="middle"> <img src="https://img.shields.io/badge/License-GPL%20v3-blue?style=plastic" alt="GPL v3" valign="middle" /></a>
*Free Software!*


Il software è distribuito secondo i termini della GNU General Public License v3.0. L'uso, la modifica e la ridistribuzione sono consentiti, a condizione che ogni copia o lavoro derivato sia rilasciato con la stessa licenza. Il contenuto è fornito "così com'è", senza alcuna garanzia, esplicita o implicita.


The software is distributed under the terms of the GNU General Public License v3.0. Use, modification, and redistribution are permitted, provided that any copy or derivative work is released under the same license. The content is provided "as is", without any warranty, express or implied.



