import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import {
  fetchAnnotazioni,
  fetchAnnotazioneById,
  createAnnotazione,
  updateAnnotazione,
  cambiaStato,
  prenotaAnnotazione,
  rilasciaPrenotazione,
  clearSelectedAnnotazione,
} from '../store/annotazioniSlice';
import Toast from '../components/Toast';

const ElencoAnnotazioni = () => {
  const dispatch = useDispatch();
  const { items, selectedAnnotazione, loading, error } = useSelector((state) => state.annotazioni);
  const { user } = useSelector((state) => state.auth);
  
  const [selectedOption, setSelectedOption] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [createMode, setCreateMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [lockTimer, setLockTimer] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [filtroStato, setFiltroStato] = useState('INSERITA');

  useEffect(() => {
    dispatch(fetchAnnotazioni());
    
    return () => {
      dispatch(clearSelectedAnnotazione());
      if (lockTimer) clearTimeout(lockTimer);
    };
  }, [dispatch, lockTimer]);

  useEffect(() => {
    if (selectedAnnotazione) {
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

  const handleSelectChange = async (option) => {
    setSelectedOption(option);
    setEditMode(false);
    setCreateMode(false);
    
    if (option) {
      await dispatch(fetchAnnotazioneById(option.value));
      // Attiva automaticamente la modalità modifica SOLO se lo stato è INSERITA o MODIFICATA
      const annotazione = items.find(item => item.id === option.value);
      if (annotazione && (annotazione.stato === 'INSERITA' || annotazione.stato === 'MODIFICATA')) {
        setEditMode(true);
      }
    } else {
      dispatch(clearSelectedAnnotazione());
    }
  };

  const canEdit = selectedAnnotazione && 
    (selectedAnnotazione.stato === 'INSERITA' || selectedAnnotazione.stato === 'MODIFICATA');

  const handleNuovaAnnotazione = () => {
    setCreateMode(true);
    setEditMode(true);
    setSelectedOption(null);
    dispatch(clearSelectedAnnotazione());
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

  const handleCreaAnnotazione = async () => {
    if (!formData.descrizione || !formData.valoreNota) {
      setToast({
        message: 'Descrizione e Valore Nota sono obbligatori',
        type: 'warning'
      });
      return;
    }

    setSaving(true);
    try {
      await dispatch(createAnnotazione(formData)).unwrap();
      
      setToast({
        message: 'Annotazione creata con successo!',
        type: 'success'
      });
      
      setCreateMode(false);
      setEditMode(false);
      setFormData({});
      
      // Ricarica la lista
      dispatch(fetchAnnotazioni());
    } catch (err) {
      setToast({
        message: err || 'Errore nella creazione dell\'annotazione',
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedAnnotazione) return;

    try {
      // Prenota l'annotazione per 120 secondi
      await dispatch(prenotaAnnotazione({
        id: selectedAnnotazione.id,
        utente: user?.username,
        secondi: 120
      })).unwrap();
      
      setEditMode(true);
      
      // Auto-rilascio dopo 2 minuti
      const timer = setTimeout(async () => {
        await handleCancelEdit();
      }, 120000);
      
      setLockTimer(timer);
    } catch (err) {
      setToast({
        message: err || 'Impossibile prenotare l\'annotazione',
        type: 'error'
      });
    }
  };

  const handleCancelEdit = async () => {
    if (selectedAnnotazione && editMode && !createMode) {
      try {
        await dispatch(rilasciaPrenotazione({
          id: selectedAnnotazione.id,
          utente: user?.username
        }));
      } catch (err) {
        console.error('Errore nel rilascio:', err);
      }
    }
    
    setEditMode(false);
    setCreateMode(false);
    if (lockTimer) {
      clearTimeout(lockTimer);
      setLockTimer(null);
    }
    
    // Ricarica i dati originali
    if (selectedAnnotazione) {
      dispatch(fetchAnnotazioneById(selectedAnnotazione.id));
    }
  };

  const handleSave = async () => {
    if (!selectedAnnotazione) return;

    setSaving(true);
    try {
      // Aggiorna l'annotazione - includi id e versioneNota nel payload
      const dataToSave = {
        ...formData,
        id: selectedAnnotazione.id,
        versioneNota: selectedAnnotazione.versioneNota
      };
      
      await dispatch(updateAnnotazione({
        id: selectedAnnotazione.id,
        data: dataToSave
      })).unwrap();

      // Cambia lo stato in MODIFICATA se non lo è già
      if (selectedAnnotazione.stato !== 'MODIFICATA') {
        try {
          await dispatch(cambiaStato({
            id: selectedAnnotazione.id,
            vecchioStato: selectedAnnotazione.stato,
            nuovoStato: 'MODIFICATA',
            utente: user?.username
          })).unwrap();
        } catch (stateErr) {
          console.warn('Impossibile cambiare stato:', stateErr);
          // Continua anche se il cambio stato fallisce
        }
      }

      // Rilascia la prenotazione
      await dispatch(rilasciaPrenotazione({
        id: selectedAnnotazione.id,
        utente: user?.username
      }));

      if (lockTimer) {
        clearTimeout(lockTimer);
        setLockTimer(null);
      }

      setToast({
        message: 'Annotazione salvata con successo e stato cambiato in MODIFICATA!',
        type: 'success'
      });
      
      // Ricarica la lista e riseleziona l'annotazione
      await dispatch(fetchAnnotazioni());
      await dispatch(fetchAnnotazioneById(selectedAnnotazione.id));
      setEditMode(true); // Mantiene la modalità edit attiva
    } catch (err) {
      setToast({
        message: err || 'Errore nel salvataggio dell\'annotazione',
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Stati disponibili
  const statiDisponibili = [
    'INSERITA',
    'MODIFICATA',
    'CONFERMATA',
    'RIFIUTATA',
    'DAINVIARE',
    'INVIATA',
    'SCADUTA',
    'BANNATA',
    'ERRORE'
  ];

  // Opzioni per react-select filtrate per stato
  const options = items
    .filter(item => item.stato === filtroStato)
    .map(item => ({
      value: item.id,
      label: `${item.descrizione} - ${item.stato}`,
      ...item
    }));

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: '45px',
      boxShadow: 'none',
      borderColor: '#dee2e6',
      '&:hover': {
        borderColor: '#0d6efd'
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#0d6efd' : state.isFocused ? '#e7f3ff' : 'white',
    }),
  };

  return (
    <div className="container mt-4">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">
              <i className="bi bi-list-ul me-2"></i>
              Elenco Annotazioni
            </h2>
            <button
              className="btn btn-success"
              onClick={handleNuovaAnnotazione}
              disabled={createMode}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Nuova Annotazione
            </button>
          </div>

          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
              <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
          )}

          {!createMode && (
            <div className="card shadow-sm mb-4">
              <div className="card-body" style={{ backgroundColor: '#E8F4F8' }}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="filtro-stato" className="form-label fw-bold">
                      Filtra per Stato
                    </label>
                    <select
                      id="filtro-stato"
                      className="form-select"
                      value={filtroStato}
                      onChange={(e) => {
                        setFiltroStato(e.target.value);
                        setSelectedOption(null);
                        dispatch(clearSelectedAnnotazione());
                        setEditMode(false);
                      }}
                    >
                      {statiDisponibili.map(stato => (
                        <option key={stato} value={stato}>{stato}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">
                      <i className="bi bi-info-circle me-2"></i>
                      Info
                    </label>
                    <div className="alert alert-info mb-0 py-2">
                      {filtroStato === 'INSERITA' || filtroStato === 'MODIFICATA' ? (
                        <span className="text-success fw-bold">
                          <i className="bi bi-check-circle me-2"></i>
                          Annotazioni modificabili
                        </span>
                      ) : (
                        <span className="text-warning fw-bold">
                          <i className="bi bi-lock me-2"></i>
                          Annotazioni in sola lettura
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <label htmlFor="annotazione-select" className="form-label fw-bold">
                  Seleziona un'annotazione
                </label>
                <Select
                  id="annotazione-select"
                  options={options}
                  value={selectedOption}
                  onChange={handleSelectChange}
                  placeholder={`Cerca annotazioni in stato ${filtroStato}...`}
                  isClearable
                  isSearchable
                  isLoading={loading}
                  styles={customStyles}
                  noOptionsMessage={() => `Nessuna annotazione in stato ${filtroStato}`}
                  loadingMessage={() => "Caricamento..."}
                />
              </div>
            </div>
          )}

          {(selectedAnnotazione || createMode) && (
            <div className="card shadow-sm">
              <div className="card-header d-flex justify-content-between align-items-center" style={{ backgroundColor: '#FFF9E6' }}>
                <h5 className="mb-0">
                  <i className="bi bi-file-earmark-text me-2"></i>
                  {createMode ? 'Nuova Annotazione' : 'Dettaglio Annotazione'}
                </h5>
                <div className="d-flex gap-2 align-items-center">
                  {editMode && !createMode && canEdit && (
                    <button
                      className="btn btn-sm btn-success"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-1"></span>
                          Salvataggio...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-save me-1"></i>
                          Salva Modifiche
                        </>
                      )}
                    </button>
                  )}
                  {selectedAnnotazione && (
                    <span className={`badge ${
                      selectedAnnotazione.stato === 'CONFERMATA' ? 'bg-success' :
                      selectedAnnotazione.stato === 'RIFIUTATA' ? 'bg-danger' :
                      selectedAnnotazione.stato === 'INSERITA' ? 'bg-info' :
                      'bg-warning'
                    }`}>
                      {selectedAnnotazione.stato}
                    </span>
                  )}
                </div>
              </div>
              <div className="card-body">

                {!canEdit && !createMode && selectedAnnotazione && (
                  <div className="alert alert-warning">
                    <i className="bi bi-lock me-2"></i>
                    Questa annotazione è in stato <strong>{selectedAnnotazione.stato}</strong> e non può essere modificata.
                    Solo le annotazioni in stato <strong>INSERITA</strong> o <strong>MODIFICATA</strong> possono essere modificate.
                  </div>
                )}

                {editMode && !createMode && canEdit && (
                  <div className="alert alert-info d-flex justify-content-between align-items-center">
                    <span>
                      <i className="bi bi-lock me-2"></i>
                      Modalità modifica attiva (scade tra 2 minuti)
                    </span>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={handleCancelEdit}
                      disabled={saving}
                    >
                      Annulla
                    </button>
                  </div>
                )}

                {createMode && (
                  <div className="alert alert-success">
                    <i className="bi bi-plus-circle me-2"></i>
                    Creazione nuova annotazione - Stato: <strong>INSERITA</strong>
                  </div>
                )}

                {editMode && (
                  <button
                    className="btn btn-success w-100 mb-3"
                    onClick={createMode ? handleCreaAnnotazione : handleSave}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        {createMode ? 'Creazione...' : 'Salvataggio...'}
                      </>
                    ) : (
                      <>
                        <i className="bi bi-save me-2"></i>
                        {createMode ? 'Crea Annotazione' : 'Salva Modifiche'}
                      </>
                    )}
                  </button>
                )}

                {selectedAnnotazione && !createMode && (
                  <>
                    <div className="row mb-3">
                      <div className="col-md-2 text-end">
                        <label className="form-label fw-bold mt-2">ID:</label>
                      </div>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className="form-control"
                          value={selectedAnnotazione.id}
                          disabled
                        />
                      </div>
                      <div className="col-md-2 text-end">
                        <label className="form-label fw-bold mt-2">Versione:</label>
                      </div>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className="form-control"
                          value={selectedAnnotazione.versioneNota}
                          disabled
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="row mb-3">
                  <div className="col-md-2 text-end">
                    <label className="form-label fw-bold mt-2">Descrizione:</label>
                  </div>
                  <div className="col-md-10">
                    <input
                      type="text"
                      className="form-control"
                      value={formData.descrizione || ''}
                      onChange={(e) => handleInputChange('descrizione', e.target.value)}
                      maxLength="500"
                      required
                      readOnly={!createMode && !canEdit}
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-2 text-end">
                    <label className="form-label fw-bold mt-2">Categoria:</label>
                  </div>
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control"
                      value={formData.categoria || ''}
                      onChange={(e) => handleInputChange('categoria', e.target.value)}
                      maxLength="100"
                      readOnly={!createMode && !canEdit}
                    />
                  </div>
                  <div className="col-md-1 text-end">
                    <label className="form-label fw-bold mt-2">Tags:</label>
                  </div>
                  <div className="col-md-5">
                    <input
                      type="text"
                      className="form-control"
                      value={formData.tags || ''}
                      onChange={(e) => handleInputChange('tags', e.target.value)}
                      maxLength="500"
                      placeholder="tag1, tag2, tag3"
                      readOnly={!createMode && !canEdit}
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-2 text-end">
                    <label className="form-label fw-bold mt-2">Priorità:</label>
                  </div>
                  <div className="col-md-4">
                    <select
                      className="form-select"
                      value={formData.priorita || 1}
                      onChange={(e) => handleInputChange('priorita', parseInt(e.target.value))}
                      disabled={!createMode && !canEdit}
                    >
                      <option value="1">1 - Bassa</option>
                      <option value="2">2</option>
                      <option value="3">3 - Media</option>
                      <option value="4">4</option>
                      <option value="5">5 - Alta</option>
                    </select>
                  </div>
                  <div className="col-md-2 text-end">
                    <label className="form-label fw-bold mt-2">Pubblica:</label>
                  </div>
                  <div className="col-md-4">
                    <div className="form-check form-switch mt-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={formData.pubblica || false}
                        onChange={(e) => handleInputChange('pubblica', e.target.checked)}
                        disabled={!createMode && !canEdit}
                      />
                      <label className="form-check-label">
                        {formData.pubblica ? 'Sì' : 'No'}
                      </label>
                    </div>
                  </div>
                </div>

                {selectedAnnotazione && !createMode && (
                  <>
                    <div className="row mb-3">
                      <div className="col-md-2 text-end">
                        <label className="form-label fw-bold mt-2">Utente Creazione:</label>
                      </div>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className="form-control"
                          value={selectedAnnotazione.utenteCreazione}
                          disabled
                        />
                      </div>
                      <div className="col-md-2 text-end">
                        <label className="form-label fw-bold mt-2">Data Inserimento:</label>
                      </div>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className="form-control"
                          value={new Date(selectedAnnotazione.dataInserimento).toLocaleString('it-IT')}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-2 text-end">
                        <label className="form-label fw-bold mt-2">Ultima Modifica:</label>
                      </div>
                      <div className="col-md-10">
                        <input
                          type="text"
                          className="form-control"
                          value={new Date(selectedAnnotazione.dataUltimaModifica).toLocaleString('it-IT')}
                          disabled
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="mb-3">
                  <label className="form-label fw-bold">Valore Nota</label>
                  <textarea
                    className="form-control"
                    rows="10"
                    value={formData.valoreNota || ''}
                    onChange={(e) => handleInputChange('valoreNota', e.target.value)}
                    maxLength="10000"
                    style={{ fontFamily: 'monospace' }}
                    required
                    readOnly={!createMode && !canEdit}
                  />
                  <small className="text-muted">
                    {formData.valoreNota?.length || 0} / 10000 caratteri
                  </small>
                </div>

                {(editMode && (createMode || canEdit)) && (
                  <button
                    className="btn btn-success w-100 mb-3"
                    onClick={createMode ? handleCreaAnnotazione : handleSave}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        {createMode ? 'Creazione...' : 'Salvataggio...'}
                      </>
                    ) : (
                      <>
                        <i className="bi bi-save me-2"></i>
                        {createMode ? 'Crea Annotazione' : 'Salva Modifiche'}
                      </>
                    )}
                  </button>
                )}

                {!editMode && selectedAnnotazione && canEdit && (
                  <button
                    className="btn btn-warning w-100"
                    onClick={handleEdit}
                  >
                    <i className="bi bi-pencil me-2"></i>
                    Modifica Annotazione
                  </button>
                )}
              </div>
            </div>
          )}

          {!selectedAnnotazione && !loading && !createMode && (
            <div className="card shadow-sm">
              <div className="card-body text-center py-5">
                <i className="bi bi-journal-text" style={{ fontSize: '4rem', color: '#dee2e6' }}></i>
                <p className="text-muted mt-3">
                  Seleziona un'annotazione dall'elenco sopra per visualizzarne i dettagli
                </p>
                <p className="text-muted">
                  oppure clicca su "Nuova Annotazione" per crearne una nuova
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ElencoAnnotazioni;
