# Ionic React PhotoGallery

| Scheda | |
|---|---|
| **Stack** | Ionic 8, React 18, Capacitor 6, Vite 5, TypeScript |
| **Node** | 20 (vedi [`.nvmrc`](./.nvmrc), poi `nvm use`) |
| **Avvio** | `npm install && npm run dev` (oppure `ionic serve`) |
| **Backend** | Nessuno: foto salvate sul dispositivo con Capacitor |
| **Stato** | Attivo |
| **Ultima verifica** | Giugno 2024 |

Progetto Ionic con React per la creazione di una photogallery, esempio preso dalla [documentazione ufficiale](https://ionicframework.com/docs/react/your-first-app).

- Creazione del progetto
    ```
    npm install -g @ionic/cli native-run cordova-res
    ionic start IonicReactPhotoGallery tabs --type=react --capacitor
    cd IonicReactPhotoGallery
    npm install @capacitor/camera @capacitor/preferences @capacitor/filesystem
    npm install @ionic/pwa-elements
    ```
- Gestione fotocamera e salvataggio foto
    - Creazione tab per la fotocamera modificando i file `main.tsx`, `Tab2.tsx` e `App.tsx` con i componenti grafici
    - Creato il file `src/hooks/usePhotoGallery.ts` che usa la libreria *capacitor* e importato nel `Tab2.tsx`
    - Creata interfaccia `UserPhoto` e modificato codice per usare l'interfaccia
    
- Continuare dalla pagina [salvare la foto](https://ionicframework.com/docs/react/your-first-app/saving-photos)

## Changelog

| Data | Descrizione |
|---|---|
| ≤ 2026-01-13 | Versione iniziale; storico precedente non ricostruito |
| 2026-11-11 | Aggiunti `.nvmrc` e scheda standard nel README |


# &lt; AlNao /&gt;
Tutti i codici sorgente e le informazioni presenti in questo repository sono frutto di un attento e paziente lavoro di sviluppo da parte di AlNao, che si è impegnato a verificarne la correttezza nella misura massima possibile. Qualora parte del codice o dei contenuti sia stato tratto da fonti esterne, la relativa provenienza viene sempre citata, nel rispetto della trasparenza e della proprietà intellettuale. 


Alcuni contenuti e porzioni di codice presenti in questo repository sono stati realizzati anche grazie al supporto di strumenti di intelligenza artificiale, il cui contributo ha permesso di arricchire e velocizzare la produzione del materiale. Ogni informazione e frammento di codice è stato comunque attentamente verificato e validato, con l’obiettivo di garantire la massima qualità e affidabilità dei contenuti offerti. 


Per ulteriori dettagli, approfondimenti o richieste di chiarimento, si invita a consultare il sito [AlNao.it](https://www.alnao.it/).


## License
Made with ❤️ by [@alnao](https://github.com/alnao)
&bull; 
Public projects 
<a href="https://www.gnu.org/licenses/gpl-3.0"  valign="middle"> <img src="https://img.shields.io/badge/License-GPL%20v3-blue?style=plastic" alt="GPL v3" valign="middle" /></a>
*Free Software!*


Il software è distribuito secondo i termini della GNU General Public License v3.0. L'uso, la modifica e la ridistribuzione sono consentiti, a condizione che ogni copia o lavoro derivato sia rilasciato con la stessa licenza. Il contenuto è fornito "così com'è", senza alcuna garanzia, esplicita o implicita.


The software is distributed under the terms of the GNU General Public License v3.0. Use, modification, and redistribution are permitted, provided that any copy or derivative work is released under the same license. The content is provided "as is", without any warranty, express or implied.
