import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAnnotazioni,
  fetchTransizioniStato,
  cambiaStato,
} from '../store/annotazioniSlice';
import Toast from '../components/Toast';

const CambioStato = () => {
  const dispatch = useDispatch();
  const { items, transizioni, loading } = useSelector((state) => state.annotazioni);
  const { user } = useSelector((state) => state.auth);

  const [filtroStato, setFiltroStato] = useState('');
  const [filtroRicerca, setFiltroRicerca] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    dispatch(fetchAnnotazioni());
    dispatch(fetchTransizioniStato()).then((result) => {
      console.log('Transizioni caricate dall\'API:', result.payload);
    });
  }, [dispatch]);

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

  // Filtra annotazioni
  const annotazioniFiltrate = useMemo(() => {
    return items.filter(item => {
      const matchStato = !filtroStato || item.stato === filtroStato;
      const matchRicerca = !filtroRicerca ||
        item.descrizione.toLowerCase().includes(filtroRicerca.toLowerCase()) ||
        item.valoreNota.toLowerCase().includes(filtroRicerca.toLowerCase());
      
      return matchStato && matchRicerca;
    });
  }, [items, filtroStato, filtroRicerca]);

  // Ottieni transizioni valide per un dato stato (senza duplicati)
  const getTransizioniValide = (daStato) => {
    console.log('Transizioni disponibili:', transizioni);
    console.log('Cercando transizioni da:', daStato);
    
    const valide = transizioni
      .filter(t => t.statoPartenza === daStato)
      .map(t => t.statoArrivo);
    
    // Rimuovi duplicati
    const valideUniche = [...new Set(valide)];
    
    console.log('Transizioni valide per', daStato, ':', valideUniche);
    
    return valideUniche;
  };

  const handleCambiaStato = async (annotazione, nuovoStato) => {
    const conferma = window.confirm(
      `Vuoi cambiare lo stato dell'annotazione "${annotazione.descrizione.substring(0, 50)}..." da ${annotazione.stato} a ${nuovoStato}?`
    );

    if (!conferma) return;

    setProcessingId(annotazione.id);

    try {
      await dispatch(cambiaStato({
        id: annotazione.id,
        vecchioStato: annotazione.stato,
        nuovoStato: nuovoStato,
        utente: user?.username
      })).unwrap();
      
      // Ricarica le annotazioni
      await dispatch(fetchAnnotazioni());
      
      setToast({
        message: `Stato cambiato con successo: ${annotazione.stato} → ${nuovoStato}`,
        type: 'success'
      });
    } catch (err) {
      setToast({
        message: `Errore nel cambio stato: ${err}`,
        type: 'error'
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getBadgeColor = (stato) => {
    switch (stato) {
      case 'CONFERMATA': return 'success';
      case 'RIFIUTATA': return 'danger';
      case 'INSERITA': return 'info';
      case 'MODIFICATA': return 'warning';
      case 'INVIATA': return 'primary';
      case 'BANNATA': return 'dark';
      case 'ERRORE': return 'danger';
      default: return 'secondary';
    }
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
          <h2 className="mb-4">
            <i className="bi bi-arrow-repeat me-2"></i>
            Cambio Stato Annotazioni
          </h2>

          {/* Card Filtri */}
          <div className="card shadow-sm mb-4">
            <div className="card-header" style={{ backgroundColor: '#E8F4F8' }}>
              <h5 className="mb-0">
                <i className="bi bi-funnel me-2"></i>
                Filtri
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 mb-3 mb-md-0">
                  <label htmlFor="filtroStato" className="form-label fw-bold">
                    Filtra per Stato
                  </label>
                  <select
                    id="filtroStato"
                    className="form-select"
                    value={filtroStato}
                    onChange={(e) => setFiltroStato(e.target.value)}
                  >
                    <option value="">Tutti gli stati</option>
                    {statiDisponibili.map(stato => (
                      <option key={stato} value={stato}>{stato}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4 mb-3 mb-md-0">
                  <label htmlFor="filtroRicerca" className="form-label fw-bold">
                    Cerca
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      id="filtroRicerca"
                      className="form-control"
                      placeholder="Cerca in descrizione o valore..."
                      value={filtroRicerca}
                      onChange={(e) => setFiltroRicerca(e.target.value)}
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-bold">Risultati</label>
                  <div className="alert alert-info mb-0 py-2">
                    <i className="bi bi-info-circle me-2"></i>
                    <strong>{annotazioniFiltrate.length}</strong> annotazione/i trovata/e
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabella Annotazioni */}
          <div className="card shadow-sm">
            <div className="card-header" style={{ backgroundColor: '#F0E6FF' }}>
              <h5 className="mb-0">
                <i className="bi bi-table me-2"></i>
                Elenco Annotazioni
              </h5>
            </div>
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Caricamento...</span>
                  </div>
                  <p className="text-muted mt-2">Caricamento annotazioni...</p>
                </div>
              ) : annotazioniFiltrate.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-inbox" style={{ fontSize: '4rem', color: '#dee2e6' }}></i>
                  <p className="text-muted mt-3">
                    {filtroStato || filtroRicerca
                      ? 'Nessuna annotazione trovata con i filtri selezionati'
                      : 'Nessuna annotazione disponibile'}
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Descrizione</th>
                        <th>Stato</th>
                        <th>Categoria</th>
                        <th>Utente</th>
                        <th>Priorità</th>
                        <th>Ultima Modifica</th>
                        <th width="250">Azioni</th>
                      </tr>
                    </thead>
                    <tbody>
                      {annotazioniFiltrate.map(item => {
                        const transizioniValide = getTransizioniValide(item.stato);
                        return (
                          <tr key={item.id}>
                            <td>
                              <div className="text-truncate" style={{ maxWidth: '250px' }}>
                                {item.descrizione}
                              </div>
                              <small className="text-muted text-truncate d-block" style={{ maxWidth: '250px' }}>
                                {item.valoreNota.substring(0, 50)}...
                              </small>
                            </td>
                            <td>
                              <span className={`badge bg-${getBadgeColor(item.stato)}`}>
                                {item.stato}
                              </span>
                            </td>
                            <td>{item.categoria || '-'}</td>
                            <td>{item.utenteCreazione}</td>
                            <td>
                              <span className="badge bg-secondary">
                                {item.priorita}
                              </span>
                            </td>
                            <td>
                              <small>
                                {new Date(item.dataUltimaModifica).toLocaleDateString('it-IT')}
                              </small>
                            </td>
                            <td>
                              {transizioniValide.length > 0 ? (
                                <div className="d-flex gap-1" style={{ flexWrap: 'nowrap', overflow: 'auto' }}>
                                  {transizioniValide.map(nuovoStato => (
                                    <button
                                      key={nuovoStato}
                                      className={`btn btn-xs btn-outline-${getBadgeColor(nuovoStato)}`}
                                      onClick={() => handleCambiaStato(item, nuovoStato)}
                                      disabled={processingId === item.id}
                                      title={`Cambia in ${nuovoStato}`}
                                      style={{ 
                                        fontSize: '0.7rem', 
                                        padding: '0.15rem 0.4rem',
                                        whiteSpace: 'nowrap',
                                        minWidth: 'auto'
                                      }}
                                    >
                                      {processingId === item.id ? (
                                        <span className="spinner-border spinner-border-sm"></span>
                                      ) : (
                                        <>
                                          <i className="bi bi-arrow-right" style={{ fontSize: '0.6rem' }}></i>
                                          {nuovoStato}
                                        </>
                                      )}
                                    </button>
                                  ))}
                                </div>
                              ) : (
                                <small className="text-muted">Nessuna transizione</small>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Info Transizioni */}
          {transizioni.length > 0 && (
            <div className="card shadow-sm mt-4">
              <div className="card-header" style={{ backgroundColor: '#E6F9F0' }}>
                <h6 className="mb-0">
                  <i className="bi bi-diagram-3 me-2"></i>
                  Transizioni di Stato Disponibili
                </h6>
              </div>
              <div className="card-body">
                <div className="row">
                  {statiDisponibili.map(stato => {
                    const transizioniDaStato = transizioni.filter(t => t.statoPartenza === stato);
                    if (transizioniDaStato.length === 0) return null;
                    
                    // Rimuovi stati duplicati
                    const statiArrivo = [...new Set(transizioniDaStato.map(t => t.statoArrivo))];
                    
                    return (
                      <div key={stato} className="col-md-6 mb-2">
                        <strong>{stato}</strong>
                        <i className="bi bi-arrow-right mx-2"></i>
                        {statiArrivo.map(statoArrivo => (
                          <span key={statoArrivo} className={`badge bg-${getBadgeColor(statoArrivo)} me-1`}>
                            {statoArrivo}
                          </span>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CambioStato;
