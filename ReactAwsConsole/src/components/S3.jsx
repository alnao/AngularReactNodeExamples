import { useState } from "react";

// --- Componenti per le Funzionalità S3 (S3ListFiles modificato) ---
// Questo componente visualizza file e cartelle di un bucket specifico e un path.

export  const S3UploadFile = ({ bucketName, currentPath }) => (
  <div className="card shadow-sm p-4 rounded-lg bg-light">
    <h4 className="text-info">Upload File S3</h4>
    <p className="text-muted">Carica un nuovo file nel tuo bucket S3.</p>
    <div className="mb-3">
      <label htmlFor="fileInput" className="form-label">Seleziona File</label>
      <input type="file" className="form-control" id="fileInput" />
    </div>
    <div className="mb-3">
      <label htmlFor="bucketName" className="form-label">Nome Bucket</label>
      <input type="text" className="form-control" id="bucketName" placeholder="Es. my-data-bucket" value={bucketName || ''} readOnly={!!bucketName} />
      {bucketName && <small className="form-text text-muted">Bucket selezionato.</small>}
    </div>
    <div className="mb-3">
      <label htmlFor="uploadPath" className="form-label">Percorso Caricamento</label>
      <input type="text" className="form-control" id="uploadPath" value={currentPath || '/'} readOnly />
      <small className="form-text text-muted">Il file verrà caricato in questo percorso nel bucket.</small>
    </div>
    <button className="btn btn-outline-info rounded-pill">Carica</button>
  </div>
);

export const S3CreateBucket = () => (
  <div className="card shadow-sm p-4 rounded-lg bg-light">
    <h4 className="text-info">Crea Bucket S3</h4>
    <p className="text-muted">Definisci un nome per il nuovo bucket S3.</p>
    <div className="mb-3">
      <label htmlFor="newBucketName" className="form-label">Nome Nuovo Bucket</label>
      <input type="text" className="form-control" id="newBucketName" placeholder="Nome univoco del bucket" />
    </div>
    <button className="btn btn-outline-info rounded-pill">Crea</button>
  </div>
);

export const S3DestroyBucket = ({ bucketName }) => {
  const [confirmBucketName, setConfirmBucketName] = useState('');

  const handleConfirmChange = (event) => {
    setConfirmBucketName(event.target.value);
  };

  const handleDeleteClick = () => {
    if (bucketName && confirmBucketName === bucketName) {
      alert(`Simulazione eliminazione bucket: "${bucketName}".`);
      // In una vera app, qui faresti la chiamata API per eliminare il bucket.
    } else {
      alert('Il nome del bucket non corrisponde o nessun bucket è selezionato.');
    }
  };

  return (
    <div className="card shadow-sm p-4 rounded-lg bg-light">
      <h4 className="text-info">Elimina Bucket S3</h4>
      <p className="text-danger">
        Attenzione: l'eliminazione di un bucket è irreversibile e ne eliminerà tutti i contenuti.
      </p>
      {bucketName ? (
        <div className="alert alert-warning">
          Stai per eliminare il bucket: <strong className="text-danger">{bucketName}</strong>.
          Per confermare, digita il nome del bucket qui sotto.
        </div>
      ) : (
        <div className="alert alert-info">
          Nessun bucket selezionato. Seleziona un bucket dalla funzione "Elenco Bucket" per eliminarlo.
        </div>
      )}
      <div className="mb-3">
        <label htmlFor="bucketToDelete" className="form-label">Digita il nome del bucket per confermare</label>
        <input
          type="text"
          className="form-control"
          id="bucketToDelete"
          placeholder="Conferma nome bucket"
          value={confirmBucketName}
          onChange={handleConfirmChange}
          disabled={!bucketName} // Disabilita l'input se nessun bucket è selezionato
        />
      </div>
      <button
        className="btn btn-outline-danger rounded-pill"
        onClick={handleDeleteClick}
        disabled={!bucketName || confirmBucketName !== bucketName}
        title={!bucketName ? "Seleziona un bucket per abilitare l'eliminazione" : (confirmBucketName !== bucketName ? "Digita il nome del bucket per confermare" : "Elimina il bucket selezionato")}
      >
        Elimina
      </button>
    </div>
  );
};