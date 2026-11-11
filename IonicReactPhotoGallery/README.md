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