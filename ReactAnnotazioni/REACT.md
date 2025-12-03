# React - Guida Completa del Progetto Annotazioni

## Indice
1. [Introduzione a React](#introduzione-a-react)
2. [Componente ElencoAnnotazioni](#componente-elencoannotazioni)
3. [useState - Gestione Stato Locale](#usestate---gestione-stato-locale)
4. [useEffect - Effetti Collaterali](#useeffect---effetti-collaterali)
5. [Funzioni Handle](#funzioni-handle)
6. [Ciclo di Vita del Componente](#ciclo-di-vita-del-componente)
7. [Best Practices](#best-practices)

---

## Introduzione a React

**React** è una libreria JavaScript per costruire interfacce utente basate su **componenti**.

### Concetti Base

```
┌─────────────────────────────────────┐
│         COMPONENTE REACT            │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  Props (dati in ingresso)     │  │
│  └───────────────────────────────┘  │
│               ↓                     │
│  ┌───────────────────────────────┐  │
│  │  State (dati interni)         │  │
│  └───────────────────────────────┘  │
│               ↓                     │
│  ┌───────────────────────────────┐  │
│  │  Render (JSX → HTML)          │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

**Quando lo stato cambia, React ri-renderizza il componente automaticamente!**

---

## Componente ElencoAnnotazioni

Analizziamo il componente principale pagina per pagina.

### Struttura Generale

```javascript
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const ElencoAnnotazioni = () => {
  // 1. Hooks (useState, useEffect, useSelector, etc.)
  // 2. Funzioni handle (eventi)
  // 3. Variabili calcolate
  // 4. Return (JSX - struttura HTML-like)
};

export default ElencoAnnotazioni;
```

---

## useState - Gestione Stato Locale

**useState** permette di aggiungere stato locale al componente.

### Sintassi Base

```javascript
const [valore, setValore] = useState(valoreIniziale);
//     ↑         ↑                    ↑
//  variabile  funzione          valore di partenza
//              per modificare
```

### Tutti gli useState del Progetto

```javascript
const ElencoAnnotazioni = () => {
  // ============================================
  // 1. SELEZIONE ANNOTAZIONE
  // ============================================
  const [selectedOption, setSelectedOption] = useState(null);
  /*
   * Descrizione: Tiene traccia dell'opzione selezionata nel dropdown
   * Valore iniziale: null (nessuna selezione)
   * Tipo: { value: id, label: "descrizione", ...dati }
   * 
   * Esempio utilizzo:
   * setSelectedOption({ value: 123, label: "Mia nota" })
   */

  // ============================================
  // 2. MODALITÀ MODIFICA
  // ============================================
  const [editMode, setEditMode] = useState(false);
  /*
   * Descrizione: Indica se siamo in modalità modifica
   * Valore iniziale: false
   * 
   * true  → Campi modificabili, bottone "Salva" visibile
   * false → Campi readonly, bottone "Modifica" visibile
   */

  // ============================================
  // 3. MODALITÀ CREAZIONE
  // ============================================
  const [createMode, setCreateMode] = useState(false);
  /*
   * Descrizione: Indica se stiamo creando una nuova annotazione
   * Valore iniziale: false
   * 
   * Quando true:
   * - Form vuoto
   * - Bottone "Crea Annotazione"
   * - Select annotazioni nascosta
   */

  // ============================================
  // 4. DATI DEL FORM
  // ============================================
  const [formData, setFormData] = useState({});
  /*
   * Descrizione: Contiene tutti i dati del form
   * Valore iniziale: {} (oggetto vuoto)
   * 
   * Struttura:
   * {
   *   descrizione: "...",
   *   categoria: "...",
   *   tags: "...",
   *   valoreNota: "...",
   *   priorita: 1,
   *   pubblica: false
   * }
   * 
   * Aggiornamento:
   * setFormData(prev => ({ ...prev, descrizione: "nuovo valore" }))
   */

  // ============================================
  // 5. TIMER PRENOTAZIONE
  // ============================================
  const [lockTimer, setLockTimer] = useState(null);
  /*
   * Descrizione: Riferimento al timer di scadenza prenotazione
   * Valore iniziale: null
   * 
   * Tipo: setTimeout ID
   * 
   * Esempio:
   * const timer = setTimeout(() => {...}, 120000);
   * setLockTimer(timer);
   * 
   * Per cancellarlo:
   * clearTimeout(lockTimer);
   * setLockTimer(null);
   */

  // ============================================
  // 6. STATO SALVATAGGIO
  // ============================================
  const [saving, setSaving] = useState(false);
  /*
   * Descrizione: Indica se un'operazione di salvataggio è in corso
   * Valore iniziale: false
   * 
   * Usato per:
   * - Disabilitare bottoni durante il salvataggio
   * - Mostrare spinner di caricamento
   */

  // ============================================
  // 7. TOAST NOTIFICATION
  // ============================================
  const [toast, setToast] = useState(null);
  /*
   * Descrizione: Dati per il messaggio toast
   * Valore iniziale: null (nessun messaggio)
   * 
   * Struttura:
   * {
   *   message: "Operazione completata!",
   *   type: "success" | "error" | "warning" | "info"
   * }
   * 
   * Per mostrare un toast:
   * setToast({ message: "Salvato!", type: "success" })
   * 
   * Per nasconderlo:
   * setToast(null)
   */

  // ============================================
  // 8. FILTRO STATO
  // ============================================
  const [filtroStato, setFiltroStato] = useState('INSERITA');
  /*
   * Descrizione: Stato corrente del filtro annotazioni
   * Valore iniziale: 'INSERITA'
   * 
   * Valori possibili:
   * - INSERITA
   * - MODIFICATA
   * - CONFERMATA
   * - RIFIUTATA
   * - DAINVIARE
   * - INVIATA
   * - SCADUTA
   * - BANNATA
   * - ERRORE
   * 
   * Filtra quali annotazioni mostrare nel dropdown
   */
};
```

### Pattern Comuni di useState

```javascript
// ============================================
// Pattern 1: Valore Semplice
// ============================================
const [count, setCount] = useState(0);

// Incrementare
setCount(count + 1);

// O meglio, usa la funzione callback
setCount(prev => prev + 1);  // ✅ PREFERITO

// ============================================
// Pattern 2: Oggetto
// ============================================
const [user, setUser] = useState({ nome: '', email: '' });

// ❌ SBAGLIATO: Sovrascrive tutto
setUser({ nome: 'Mario' });  // Perde email!

// ✅ CORRETTO: Spread operator
setUser(prev => ({ ...prev, nome: 'Mario' }));

// ============================================
// Pattern 3: Array
// ============================================
const [items, setItems] = useState([]);

// Aggiungere elemento
setItems(prev => [...prev, nuovoItem]);

// Rimuovere elemento
setItems(prev => prev.filter(item => item.id !== idDaRimuovere));

// Aggiornare elemento
setItems(prev => prev.map(item => 
  item.id === idDaAggiornare 
    ? { ...item, ...nuoviDati } 
    : item
));

// ============================================
// Pattern 4: Boolean Toggle
// ============================================
const [isOpen, setIsOpen] = useState(false);

// Toggle
setIsOpen(prev => !prev);
```

---

## useEffect - Effetti Collaterali

**useEffect** permette di eseguire codice in risposta a cambiamenti o eventi del ciclo di vita.

### Sintassi Base

```javascript
useEffect(() => {
  // Codice da eseguire
  
  return () => {
    // Cleanup (opzionale)
  };
}, [dipendenze]);
```

### useEffect #1: Caricamento Iniziale

```javascript
useEffect(() => {
  // ============================================
  // ESEGUITO: Una volta al montaggio del componente
  // ============================================
  
  // Carica tutte le annotazioni dal backend
  dispatch(fetchAnnotazioni());
  
  // ============================================
  // CLEANUP: Quando il componente viene smontato
  // ============================================
  return () => {
    // Pulisce l'annotazione selezionata dallo store
    dispatch(clearSelectedAnnotazione());
    
    // Cancella il timer se esiste
    if (lockTimer) clearTimeout(lockTimer);
  };
}, [dispatch, lockTimer]);
/*
 * DIPENDENZE: [dispatch, lockTimer]
 * 
 * - dispatch: Non cambia mai, ma è buona pratica includerlo
 * - lockTimer: Quando cambia, l'effetto si ri-esegue
 * 
 * PROBLEMA POTENZIALE: lockTimer nelle dipendenze può causare loop!
 * SOLUZIONE MIGLIORE: Rimuovere lockTimer dalle dipendenze
 */
```

**Versione Corretta:**
```javascript
useEffect(() => {
  dispatch(fetchAnnotazioni());
  
  return () => {
    dispatch(clearSelectedAnnotazione());
    // Usa una variabile locale per il cleanup
  };
}, [dispatch]);  // Solo dispatch nelle dipendenze
```

### useEffect #2: Sincronizzazione Form

```javascript
useEffect(() => {
  // ============================================
  // ESEGUITO: Ogni volta che selectedAnnotazione o user cambiano
  // ============================================
  
  if (selectedAnnotazione) {
    // Popola il form con i dati dell'annotazione selezionata
    setFormData({
      valoreNota: selectedAnnotazione.valoreNota || '',
      descrizione: selectedAnnotazione.descrizione || '',
      utente: user?.username || '',
      categoria: selectedAnnotazione.categoria || '',
      tags: selectedAnnotazione.tags || '',
      pubblica: selectedAnnotazione.pubblica || false,
      priorita: selectedAnnotazione.priorita || 1,
    });
  }
}, [selectedAnnotazione, user]);
/*
 * QUANDO SI ESEGUE:
 * 1. Al primo render (se selectedAnnotazione o user sono già valorizzati)
 * 2. Ogni volta che l'utente seleziona un'altra annotazione
 * 3. Ogni volta che user cambia (poco probabile)
 * 
 * SCOPO:
 * Mantiene il form sincronizzato con l'annotazione corrente
 */
```

### Timing degli useEffect

```javascript
// ============================================
// SEQUENZA DI ESECUZIONE
// ============================================

// 1. PRIMO RENDER
Component monta
  ↓
Esegue il corpo del componente (useState, variabili, etc.)
  ↓
Renderizza JSX
  ↓
Browser aggiorna il DOM
  ↓
Esegue tutti gli useEffect

// 2. AGGIORNAMENTO (stato cambia)
Stato cambia (es: setFormData(...))
  ↓
Esegue il corpo del componente
  ↓
Renderizza JSX
  ↓
Browser aggiorna il DOM
  ↓
Esegue solo gli useEffect le cui dipendenze sono cambiate

// 3. SMONTAGGIO
Componente viene rimosso
  ↓
Esegue tutti i cleanup (return degli useEffect)
```

### Esempi Pratici di useEffect

```javascript
// ============================================
// Esempio 1: Chiamata API al montaggio
// ============================================
useEffect(() => {
  const loadData = async () => {
    const data = await api.getData();
    setData(data);
  };
  loadData();
}, []);  // Array vuoto = solo al montaggio

// ============================================
// Esempio 2: Timer/Intervallo
// ============================================
useEffect(() => {
  const interval = setInterval(() => {
    console.log('Tick ogni secondo');
  }, 1000);
  
  // IMPORTANTE: Cleanup per evitare memory leak
  return () => clearInterval(interval);
}, []);

// ============================================
// Esempio 3: Event Listener
// ============================================
useEffect(() => {
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };
  
  window.addEventListener('resize', handleResize);
  
  // Rimuovi listener al cleanup
  return () => window.removeEventListener('resize', handleResize);
}, []);

// ============================================
// Esempio 4: Sincronizzazione con LocalStorage
// ============================================
useEffect(() => {
  localStorage.setItem('formData', JSON.stringify(formData));
}, [formData]);  // Salva ogni volta che formData cambia

// ============================================
// Esempio 5: Chiamata API Condizionale
// ============================================
useEffect(() => {
  if (userId) {
    api.getUserData(userId).then(setUserData);
  }
}, [userId]);  // Richiama quando userId cambia
```

---

## Funzioni Handle

Le funzioni **handle** gestiscono gli eventi dell'utente (click, change, submit, etc.).

### Pattern di Naming

```javascript
handle + Azione + Target

handleSelectChange     // Gestisce cambio select
handleSave            // Gestisce salvataggio
handleNuovaAnnotazione // Gestisce click bottone nuova
handleInputChange     // Gestisce cambio input
```

### Tutte le Funzioni Handle del Progetto

#### 1. handleSelectChange

```javascript
const handleSelectChange = async (option) => {
  /*
   * TRIGGER: Quando l'utente seleziona un'annotazione dal dropdown
   * PARAMETRI:
   *   option: { value: id, label: "...", ...dati } | null
   */
  
  // Salva l'opzione selezionata
  setSelectedOption(option);
  
  // Reset modalità modifica e creazione
  setEditMode(false);
  setCreateMode(false);
  
  if (option) {
    // ============================================
    // SE È STATA SELEZIONATA UN'ANNOTAZIONE
    // ============================================
    
    // 1. Carica i dettagli completi dell'annotazione
    await dispatch(fetchAnnotazioneById(option.value));
    
    // 2. Verifica se può essere modificata
    const annotazione = items.find(item => item.id === option.value);
    
    // 3. Abilita modifica solo se stato è INSERITA o MODIFICATA
    if (annotazione && 
        (annotazione.stato === 'INSERITA' || 
         annotazione.stato === 'MODIFICATA')) {
      setEditMode(true);
    }
  } else {
    // ============================================
    // SE LA SELEZIONE È STATA CANCELLATA (null)
    // ============================================
    dispatch(clearSelectedAnnotazione());
  }
};
```

**Flusso visivo:**
```
Utente clicca su annotazione nel dropdown
  ↓
handleSelectChange({ value: 123, label: "..." })
  ↓
setSelectedOption(...)  → selectedOption = {...}
setEditMode(false)      → editMode = false
  ↓
dispatch(fetchAnnotazioneById(123))
  ↓
API call → Backend restituisce annotazione completa
  ↓
Redux store aggiornato → selectedAnnotazione = {...}
  ↓
useEffect si attiva (dipendenza: selectedAnnotazione)
  ↓
setFormData(...) → Form popolato con i dati
  ↓
Controllo stato annotazione
  ↓
Se INSERITA o MODIFICATA → setEditMode(true)
  ↓
Componente si ri-renderizza con form editabile
```

#### 2. handleNuovaAnnotazione

```javascript
const handleNuovaAnnotazione = () => {
  /*
   * TRIGGER: Click su bottone "Nuova Annotazione"
   * SCOPO: Prepara il form per creare una nuova annotazione
   */
  
  // Entra in modalità creazione
  setCreateMode(true);
  setEditMode(true);
  
  // Resetta selezione
  setSelectedOption(null);
  dispatch(clearSelectedAnnotazione());
  
  // Inizializza form con valori di default
  setFormData({
    valoreNota: '',
    descrizione: '',
    utente: user?.username || '',
    categoria: '',
    tags: '',
    pubblica: false,
    priorita: 1,
  });
};
```

**Flusso visivo:**
```
Utente clicca "Nuova Annotazione"
  ↓
handleNuovaAnnotazione()
  ↓
setCreateMode(true)  → Nasconde select annotazioni
setEditMode(true)    → Abilita modifica form
  ↓
Componente si ri-renderizza
  ↓
Mostra form vuoto con:
- Alert verde "Creazione nuova annotazione"
- Bottone "Crea Annotazione"
- Campi tutti editabili
```

#### 3. handleCreaAnnotazione

```javascript
const handleCreaAnnotazione = async () => {
  /*
   * TRIGGER: Click su "Crea Annotazione"
   * SCOPO: Invia i dati al backend per creare una nuova annotazione
   */
  
  // ============================================
  // VALIDAZIONE
  // ============================================
  if (!formData.descrizione || !formData.valoreNota) {
    setToast({
      message: 'Descrizione e Valore Nota sono obbligatori',
      type: 'warning'
    });
    return;  // Esce dalla funzione
  }

  // ============================================
  // SALVATAGGIO
  // ============================================
  setSaving(true);  // Mostra spinner
  
  try {
    // Chiamata API per creare l'annotazione
    await dispatch(createAnnotazione(formData)).unwrap();
    
    // ============================================
    // SUCCESSO
    // ============================================
    setToast({
      message: 'Annotazione creata con successo!',
      type: 'success'
    });
    
    // Reset stato
    setCreateMode(false);
    setEditMode(false);
    setFormData({});
    
    // Ricarica lista annotazioni
    dispatch(fetchAnnotazioni());
    
  } catch (err) {
    // ============================================
    // ERRORE
    // ============================================
    setToast({
      message: err || 'Errore nella creazione dell\'annotazione',
      type: 'error'
    });
  } finally {
    // ============================================
    // SEMPRE (successo o errore)
    // ============================================
    setSaving(false);  // Nasconde spinner
  }
};
```

**Flusso con try-catch-finally:**
```
try {
  // Codice che può fallire
  await apiCall();
  // ✅ Se arriviamo qui, tutto ok
  setToast({ success });
}
catch (err) {
  // ❌ Se c'è un errore, eseguiamo questo
  setToast({ error });
}
finally {
  // ⚙️ SEMPRE eseguito (ok o errore)
  setSaving(false);
}
```

#### 4. handleEdit

```javascript
const handleEdit = async () => {
  /*
   * TRIGGER: Click su "Modifica Annotazione"
   * SCOPO: Prenota l'annotazione per 2 minuti e abilita modifica
   */
  
  if (!selectedAnnotazione) return;

  try {
    // ============================================
    // PRENOTA ANNOTAZIONE
    // ============================================
    await dispatch(prenotaAnnotazione({
      id: selectedAnnotazione.id,
      utente: user?.username,
      secondi: 120  // 2 minuti
    })).unwrap();
    
    // ============================================
    // ABILITA MODIFICA
    // ============================================
    setEditMode(true);
    
    // ============================================
    // IMPOSTA TIMER AUTO-RILASCIO
    // ============================================
    const timer = setTimeout(async () => {
      await handleCancelEdit();
    }, 120000);  // 120000 ms = 2 minuti
    
    setLockTimer(timer);
    
  } catch (err) {
    // ============================================
    // ERRORE (es: già prenotata da altro utente)
    // ============================================
    setToast({
      message: err || 'Impossibile prenotare l\'annotazione',
      type: 'error'
    });
  }
};
```

**Sistema di Prenotazione:**
```
┌─────────────────────────────────────────────────────┐
│ Utente A clicca "Modifica"                          │
│   ↓                                                  │
│ Backend: Registra prenotazione per 120 secondi      │
│   ↓                                                  │
│ Utente A può modificare                             │
│                                                      │
│ Nel frattempo...                                     │
│                                                      │
│ Utente B cerca di modificare la stessa annotazione  │
│   ↓                                                  │
│ Backend: ERRORE "Annotazione già in uso"            │
│   ↓                                                  │
│ Toast di errore per Utente B                        │
│                                                      │
│ Dopo 120 secondi...                                 │
│   ↓                                                  │
│ Timer scatta → handleCancelEdit()                   │
│   ↓                                                  │
│ Prenotazione rilasciata automaticamente             │
└─────────────────────────────────────────────────────┘
```

#### 5. handleCancelEdit

```javascript
const handleCancelEdit = async () => {
  /*
   * TRIGGER: 
   *   1. Click su "Annulla"
   *   2. Timer di 2 minuti scaduto
   * SCOPO: Rilascia la prenotazione e disabilita modifica
   */
  
  // ============================================
  // RILASCIA PRENOTAZIONE
  // ============================================
  if (selectedAnnotazione && editMode && !createMode) {
    try {
      await dispatch(rilasciaPrenotazione({
        id: selectedAnnotazione.id,
        utente: user?.username
      }));
    } catch (err) {
      console.error('Errore nel rilascio:', err);
      // Non mostriamo errore all'utente, logghiamo solo
    }
  }
  
  // ============================================
  // RESET STATO
  // ============================================
  setEditMode(false);
  setCreateMode(false);
  
  // Cancella timer se esiste
  if (lockTimer) {
    clearTimeout(lockTimer);
    setLockTimer(null);
  }
  
  // ============================================
  // RICARICA DATI ORIGINALI
  // ============================================
  if (selectedAnnotazione) {
    // Re-fetch dell'annotazione (annulla modifiche non salvate)
    dispatch(fetchAnnotazioneById(selectedAnnotazione.id));
  }
};
```

#### 6. handleSave

```javascript
const handleSave = async () => {
  /*
   * TRIGGER: Click su "Salva Modifiche"
   * SCOPO: Salva le modifiche e cambia stato in MODIFICATA
   */
  
  if (!selectedAnnotazione) return;

  setSaving(true);
  
  try {
    // ============================================
    // STEP 1: AGGIORNA ANNOTAZIONE
    // ============================================
    const dataToSave = {
      ...formData,
      id: selectedAnnotazione.id,
      versioneNota: selectedAnnotazione.versioneNota
    };
    
    await dispatch(updateAnnotazione({
      id: selectedAnnotazione.id,
      data: dataToSave
    })).unwrap();

    // ============================================
    // STEP 2: CAMBIA STATO IN MODIFICATA
    // ============================================
    if (selectedAnnotazione.stato !== 'MODIFICATA') {
      try {
        await dispatch(cambiaStato({
          id: selectedAnnotazione.id,
          vecchioStato: selectedAnnotazione.stato,
          nuovoStato: 'MODIFICATA',
          utente: user?.username
        })).unwrap();
      } catch (stateErr) {
        // Cambio stato fallito, ma continuiamo
        console.warn('Impossibile cambiare stato:', stateErr);
      }
    }

    // ============================================
    // STEP 3: RILASCIA PRENOTAZIONE
    // ============================================
    await dispatch(rilasciaPrenotazione({
      id: selectedAnnotazione.id,
      utente: user?.username
    }));

    // ============================================
    // STEP 4: CLEANUP TIMER
    // ============================================
    if (lockTimer) {
      clearTimeout(lockTimer);
      setLockTimer(null);
    }

    // ============================================
    // STEP 5: SUCCESSO
    // ============================================
    setToast({
      message: 'Annotazione salvata con successo e stato cambiato in MODIFICATA!',
      type: 'success'
    });
    
    // ============================================
    // STEP 6: RICARICA DATI
    // ============================================
    await dispatch(fetchAnnotazioni());
    await dispatch(fetchAnnotazioneById(selectedAnnotazione.id));
    
    // Mantiene modalità edit attiva
    setEditMode(true);
    
  } catch (err) {
    // ============================================
    // ERRORE
    // ============================================
    setToast({
      message: err || 'Errore nel salvataggio dell\'annotazione',
      type: 'error'
    });
  } finally {
    setSaving(false);
  }
};
```

**Sequenza completa handleSave:**
```
1. setSaving(true) → Mostra spinner nei bottoni

2. updateAnnotazione → POST /api/annotazioni/:id
   ✅ Annotazione aggiornata

3. cambiaStato → POST /api/annotazioni/:id/stato
   ✅ Stato cambiato INSERITA → MODIFICATA

4. rilasciaPrenotazione → DELETE /api/annotazioni/:id/prenotazione
   ✅ Prenotazione rilasciata

5. clearTimeout(lockTimer) → Timer cancellato

6. setToast({ success }) → Mostra messaggio verde

7. fetchAnnotazioni → GET /api/annotazioni
   ✅ Lista aggiornata

8. fetchAnnotazioneById → GET /api/annotazioni/:id
   ✅ Dettaglio aggiornato

9. setEditMode(true) → Rimane in modifica

10. setSaving(false) → Nasconde spinner
```

#### 7. handleInputChange

```javascript
const handleInputChange = (field, value) => {
  /*
   * TRIGGER: Qualsiasi cambio in un campo del form
   * PARAMETRI:
   *   field: Nome del campo ('descrizione', 'categoria', etc.)
   *   value: Nuovo valore
   */
  
  setFormData(prev => ({
    ...prev,        // Mantiene tutti gli altri campi
    [field]: value  // Aggiorna solo il campo specificato
  }));
};

// ============================================
// UTILIZZO NEL JSX
// ============================================

// Input Text
<input 
  value={formData.descrizione || ''}
  onChange={(e) => handleInputChange('descrizione', e.target.value)}
/>

// Select
<select
  value={formData.priorita || 1}
  onChange={(e) => handleInputChange('priorita', parseInt(e.target.value))}
>

// Checkbox
<input
  type="checkbox"
  checked={formData.pubblica || false}
  onChange={(e) => handleInputChange('pubblica', e.target.checked)}
/>

// Textarea
<textarea
  value={formData.valoreNota || ''}
  onChange={(e) => handleInputChange('valoreNota', e.target.value)}
/>
```

**Come funziona lo spread operator:**
```javascript
// Stato precedente
formData = {
  descrizione: "Vecchia",
  categoria: "Test",
  priorita: 3
}

// Utente modifica descrizione
handleInputChange('descrizione', 'Nuova')

// Dentro setFormData
{
  ...prev,              // Espande: descrizione: "Vecchia", categoria: "Test", priorita: 3
  descrizione: 'Nuova'  // Sovrascrive solo descrizione
}

// Risultato
formData = {
  descrizione: "Nuova",  // ✅ Aggiornato
  categoria: "Test",     // ✅ Mantenuto
  priorita: 3            // ✅ Mantenuto
}
```

---

## Ciclo di Vita del Componente

### Sequenza Completa

```javascript
// ============================================
// 1. MONTAGGIO (Component Mount)
// ============================================
ElencoAnnotazioni viene renderizzato per la prima volta
  ↓
Esegue tutti gli useState (crea stato iniziale)
  ↓
Esegue useSelector (legge dallo store Redux)
  ↓
Calcola variabili (options, canEdit, etc.)
  ↓
Renderizza JSX → Browser mostra la UI
  ↓
Esegue useEffect #1 → dispatch(fetchAnnotazioni())
  ↓
Esegue useEffect #2 (se selectedAnnotazione esiste)

// ============================================
// 2. AGGIORNAMENTO (Component Update)
// ============================================

// 2a. Cambio stato locale
setEditMode(true)
  ↓
React ri-calcola tutto
  ↓
Confronta nuovo JSX con precedente (Virtual DOM)
  ↓
Aggiorna solo le parti cambiate nel DOM reale
  ↓
Esegue useEffect se dipendenze cambiate

// 2b. Cambio Redux store
dispatch(fetchAnnotazioni()) completa
  ↓
Redux store aggiornato → items = [...]
  ↓
useSelector si accorge del cambiamento
  ↓
Componente si ri-renderizza
  ↓
Nuove options calcolate
  ↓
JSX aggiornato

// ============================================
// 3. SMONTAGGIO (Component Unmount)
// ============================================
Utente naviga ad altra pagina
  ↓
React rimuove ElencoAnnotazioni dal DOM
  ↓
Esegue cleanup di useEffect:
  - dispatch(clearSelectedAnnotazione())
  - clearTimeout(lockTimer)
```

### Esempio Pratico: Selezione Annotazione

```
┌─────────────────────────────────────────────┐
│ STATO INIZIALE                              │
│ selectedOption = null                       │
│ selectedAnnotazione = null                  │
│ formData = {}                               │
│ editMode = false                            │
└─────────────────────────────────────────────┘
          ↓
┌─────────────────────────────────────────────┐
│ UTENTE: Clicca annotazione nel dropdown     │
└─────────────────────────────────────────────┘
          ↓
┌─────────────────────────────────────────────┐
│ handleSelectChange({ value: 123, ... })     │
│                                             │
│ 1. setSelectedOption({...})                 │
│    → selectedOption = {...}                 │
│    → Re-render #1                           │
│                                             │
│ 2. setEditMode(false)                       │
│    → editMode = false                       │
│    → Re-render #2                           │
│                                             │
│ 3. dispatch(fetchAnnotazioneById(123))      │
│    → Chiamata API                           │
└─────────────────────────────────────────────┘
          ↓
┌─────────────────────────────────────────────┐
│ API RISPONDE                                │
│ Redux store aggiornato                      │
│ selectedAnnotazione = { id: 123, ... }      │
└─────────────────────────────────────────────┘
          ↓
┌─────────────────────────────────────────────┐
│ useSelector si attiva                       │
│ → Re-render #3                              │
└─────────────────────────────────────────────┘
          ↓
┌─────────────────────────────────────────────┐
│ useEffect #2 si attiva                      │
│ (dipendenza: selectedAnnotazione cambiata)  │
│                                             │
│ setFormData({                               │
│   descrizione: "...",                       │
│   categoria: "...",                         │
│   ...                                       │
│ })                                          │
│ → formData = {...}                          │
│ → Re-render #4                              │
└─────────────────────────────────────────────┘
          ↓
┌─────────────────────────────────────────────┐
│ Controllo stato annotazione                 │
│ if (stato === 'INSERITA' || 'MODIFICATA')   │
│   setEditMode(true)                         │
│   → editMode = true                         │
│   → Re-render #5                            │
└─────────────────────────────────────────────┘
          ↓
┌─────────────────────────────────────────────┐
│ STATO FINALE                                │
│ selectedOption = { value: 123, ... }        │
│ selectedAnnotazione = { id: 123, ... }      │
│ formData = { descrizione: "...", ... }      │
│ editMode = true                             │
│                                             │
│ UI: Form compilato e modificabile           │
└─────────────────────────────────────────────┘
```

**Note sui Re-render:**
- React raggruppa più setState consecutivi in un singolo re-render per performance
- In realtà potrebbero esserci meno di 5 re-render
- Non c'è problema se ci sono molti re-render, React è ottimizzato

---

## Best Practices

### 1. Destructuring Props e State

```javascript
// ❌ MALE
const items = useSelector((state) => state.annotazioni.items);
const loading = useSelector((state) => state.annotazioni.loading);
const error = useSelector((state) => state.annotazioni.error);

// ✅ BENE
const { items, loading, error } = useSelector((state) => state.annotazioni);
```

### 2. Callback nelle Dipendenze useEffect

```javascript
// ❌ MALE: Può causare re-render infiniti
useEffect(() => {
  loadData();
}, [loadData]);  // loadData viene ricreata ad ogni render

// ✅ BENE: Usa useCallback
const loadData = useCallback(async () => {
  const data = await api.getData();
  setData(data);
}, []);  // Crea la funzione una sola volta

useEffect(() => {
  loadData();
}, [loadData]);
```

### 3. Aggiornamento Stato con Funzione

```javascript
// ❌ POTENZIALMENTE PROBLEMATICO
setCount(count + 1);
setCount(count + 1);  // Potrebbe non funzionare come previsto

// ✅ SEMPRE SICURO
setCount(prev => prev + 1);
setCount(prev => prev + 1);  // Funziona sempre correttamente
```

### 4. Gestione Errori Async/Await

```javascript
// ❌ MALE: Errore non gestito
const handleSave = async () => {
  await api.save(data);
  setToast({ success });
};

// ✅ BENE: Sempre try-catch
const handleSave = async () => {
  try {
    await api.save(data);
    setToast({ success });
  } catch (err) {
    setToast({ error: err.message });
  } finally {
    setLoading(false);  // Sempre eseguito
  }
};
```

### 5. Conditional Rendering

```javascript
// ✅ BENE: Diverse tecniche
{loading && <Spinner />}
{error && <Alert>{error}</Alert>}
{data ? <DataView data={data} /> : <EmptyState />}
{items.length > 0 && <List items={items} />}
```

### 6. Key nelle Liste

```javascript
// ❌ MALE: Index come key (problemi con ordinamento)
{items.map((item, index) => <div key={index}>{item.name}</div>)}

// ✅ BENE: ID univoco come key
{items.map(item => <div key={item.id}>{item.name}</div>)}
```

---

## Riepilogo Hooks Utilizzati

| Hook | Scopo | Esempio |
|------|-------|---------|
| `useState` | Stato locale del componente | `const [count, setCount] = useState(0)` |
| `useEffect` | Effetti collaterali e lifecycle | `useEffect(() => {}, [deps])` |
| `useSelector` | Legge dati da Redux store | `const user = useSelector(state => state.auth.user)` |
| `useDispatch` | Invia azioni a Redux | `const dispatch = useDispatch()` |

---

## Riepilogo Pattern Comuni

### 1. Form Controllato
```javascript
const [formData, setFormData] = useState({});

<input
  value={formData.field || ''}
  onChange={(e) => setFormData(prev => ({ ...prev, field: e.target.value }))}
/>
```

### 2. Chiamata API con Loading
```javascript
const [loading, setLoading] = useState(false);

const loadData = async () => {
  setLoading(true);
  try {
    const data = await api.getData();
    setData(data);
  } finally {
    setLoading(false);
  }
};
```

### 3. Toggle Boolean
```javascript
const [isOpen, setIsOpen] = useState(false);
const toggle = () => setIsOpen(prev => !prev);
```

### 4. Conditional Effect
```javascript
useEffect(() => {
  if (userId) {
    loadUserData(userId);
  }
}, [userId]);
```

Spero questa guida ti sia utile per comprendere a fondo React nel progetto! 🚀



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



