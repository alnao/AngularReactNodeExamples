# React Native Pocket App

Esempio/tutorial preso dal video [Build Your Own Pocket Clone with React Native (Expo, SQLite, Reanimated, API Routes, IAP)](https://www.youtube.com/watch?v=GSs4Dnz274k)

I principali passi eseguiti sono stati:
1. Creato il progetto con i comandi 
   ```
   npm install -g @expo/cli
   npx create-expo pocket-app --template default
   cd cartell
   npm start
   ```
   - nota: nel video usa il comando `brunx` ma io preferiso usare `npm` e `npx`!
   - in caso di errore `CommandError: No Android connected device found, and no emulators could be started automatically.` bisogna installare nel sistema l'emulatore andoid, vedi punto specifico
2. Pulizia del template di default per usare *native-tabs*
   ```
   npx expo install expo-dev-client
   npm run reset-project
   ```
   - Attenzione : Native tabs is an experimental feature available in SDK 54 and later, and its API is subject to change, vedi la [documentazione ufficiale](https://docs.expo.dev/versions/latest/sdk/router-native-tabs/)
3. Creazione struttura base
   - modificato _layout aggiungengo NativeTabs e le proprietà
   - create home.tsx e settings.tsx nelle rispettive sotto-cartelle e _layout per ogni cartella
4. Fermato al punto `16:30` del video
   - da vedere perchè la versione andoid non va
   - da capire perchè nella versione web le icone non compaiono!




# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.


To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.


Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.





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
