
export const S3UploadFile = () => (
  <div className="card shadow-sm p-4 rounded-lg bg-light">
    <h4 className="text-info">Upload File S3</h4>
    <p className="text-muted">Carica un nuovo file nel tuo bucket S3.</p>
    <div className="mb-3">
      <label htmlFor="fileInput" className="form-label">Seleziona File</label>
      <input type="file" className="form-control" id="fileInput" />
    </div>
    <div className="mb-3">
      <label htmlFor="bucketName" className="form-label">Nome Bucket</label>
      <input type="text" className="form-control" id="bucketName" placeholder="Es. my-data-bucket" />
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

export const S3DestroyBucket = () => (
  <div className="card shadow-sm p-4 rounded-lg bg-light">
    <h4 className="text-info">Elimina Bucket S3</h4>
    <p className="text-danger">Attenzione: l'eliminazione di un bucket è irreversibile e ne eliminerà tutti i contenuti.</p>
    <div className="mb-3">
      <label htmlFor="bucketToDelete" className="form-label">Nome Bucket da Eliminare</label>
      <input type="text" className="form-control" id="bucketToDelete" placeholder="Conferma nome bucket" />
    </div>
    <button className="btn btn-outline-danger rounded-pill">Elimina</button>
  </div>
);

// --- Componenti per le Funzionalità EC2 ---
export const EC2ListInstances = () => (
  <div className="card shadow-sm p-4 rounded-lg bg-light">
    <h4 className="text-success">Elenco Istanze EC2</h4>
    <p className="text-muted">Qui verranno mostrate le tue istanze EC2 in esecuzione.</p>
    <ul className="list-unstyled">
      <li>i-1234567890 (Running)</li>
      <li>i-abcdefghij (Stopped)</li>
    </ul>
    <button className="btn btn-outline-success btn-sm rounded-pill mt-3">Aggiorna Elenco</button>
  </div>
);

export const EC2StartInstance = () => (
  <div className="card shadow-sm p-4 rounded-lg bg-light">
    <h4 className="text-success">Avvia Istanza EC2</h4>
    <p className="text-muted">Scegli un'istanza da avviare.</p>
    <div className="mb-3">
      <label htmlFor="instanceToStart" className="form-label">ID Istanza</label>
      <input type="text" className="form-control" id="instanceToStart" placeholder="Es. i-1234567890" />
    </div>
    <button className="btn btn-outline-success rounded-pill">Avvia</button>
  </div>
);

export const EC2StopInstance = () => (
  <div className="card shadow-sm p-4 rounded-lg bg-light">
    <h4 className="text-success">Ferma Istanza EC2</h4>
    <p className="text-muted">Scegli un'istanza da fermare.</p>
    <div className="mb-3">
      <label htmlFor="instanceToStop" className="form-label">ID Istanza</label>
      <input type="text" className="form-control" id="instanceToStop" placeholder="Es. i-1234567890" />
    </div>
    <button className="btn btn-outline-warning rounded-pill">Ferma</button>
  </div>
);

export const EC2TerminateInstance = () => (
  <div className="card shadow-sm p-4 rounded-lg bg-light">
    <h4 className="text-success">Termina Istanza EC2</h4>
    <p className="text-danger">Attenzione: la terminazione di un'istanza è irreversibile e ne eliminerà i dati.</p>
    <div className="mb-3">
      <label htmlFor="instanceToTerminate" className="form-label">ID Istanza da Terminare</label>
      <input type="text" className="form-control" id="instanceToTerminate" placeholder="Conferma ID istanza" />
    </div>
    <button className="btn btn-outline-danger rounded-pill">Termina</button>
  </div>
);


