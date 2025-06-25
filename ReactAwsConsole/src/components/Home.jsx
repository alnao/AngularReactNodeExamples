import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
//import FileExplorer from "./S3/FileExplorer";
import { EC2ListInstances, EC2StartInstance, EC2StopInstance, EC2TerminateInstance } from "./Todo";
import { S3CreateBucket, S3DestroyBucket, S3UploadFile} from "./S3";
import { ElencoBucket } from "./s3/ElencoBucket";
import { S3ListFiles } from "./s3/ListFiles";

// Il componente Home principale
const Home = () => {
  // Stato per il servizio attualmente selezionato (es. 'S3' o 'EC2')
  const [selectedService, setSelectedService] = useState('S3');
  // Stato per la funzione attualmente selezionata all'interno del servizio
  const [selectedFunction, setSelectedFunction] = useState(null);
  // Nuovo stato per memorizzare il nome del bucket selezionato per S3ListFiles
  const [selectedBucketForS3List, setSelectedBucketForS3List] = useState(null);
  // Nuovo stato per il percorso corrente all'interno del bucket S3 selezionato
  const [currentS3Path, setCurrentS3Path] = useState('');

  // Mappa delle funzioni per ogni servizio, ora include il componente da renderizzare
  const serviceFunctionsMap = {
    S3: [
      { name: 'Elenco Bucket', component: ElencoBucket, key: 's3-list-buckets', needsBucket: false },
      { name: 'Elenco File', component: S3ListFiles, key: 's3-list', needsBucket: false }, // Elenco File can show message if no bucket selected
      { name: 'Upload File', component: S3UploadFile, key: 's3-upload', needsBucket: true },
      { name: 'Crea Bucket', component: S3CreateBucket, key: 's3-create', needsBucket: false },
      { name: 'Elimina Bucket', component: S3DestroyBucket, key: 's3-destroy', needsBucket: true },
    ],
    EC2: [
      { name: 'Elenco Istanze', component: EC2ListInstances, key: 'ec2-list', needsBucket: false },
      { name: 'Avvia Istanza', component: EC2StartInstance, key: 'ec2-start', needsBucket: false },
      { name: 'Ferma Istanza', component: EC2StopInstance, key: 'ec2-stop', needsBucket: false },
      { name: 'Termina Istanza', component: EC2TerminateInstance, key: 'ec2-terminate', needsBucket: false },
    ],
  };

  // Resetta la funzione selezionata, il bucket e il path quando il servizio cambia
  useEffect(() => {
    if (selectedService && serviceFunctionsMap[selectedService] && serviceFunctionsMap[selectedService].length > 0) {
      setSelectedFunction(serviceFunctionsMap[selectedService][0]); // Seleziona la prima funzione di default
      setSelectedBucketForS3List(null); // Resetta il bucket selezionato quando il servizio cambia
      setCurrentS3Path(''); // Resetta il path S3
    } else {
      setSelectedFunction(null);
    }
  }, [selectedService]);

  // Gestisce il cambio di servizio
  const handleServiceChange = (service) => {
    setSelectedService(service);
  };

  // Gestisce il cambio di funzione all'interno del servizio
  const handleFunctionChange = (func) => {
    setSelectedFunction(func);
    // Se la funzione selezionata non è "Elenco File", resetta il path S3
    if (func.key !== 's3-list') {
        setCurrentS3Path('');
    }
  };

  // Funzione per gestire la selezione di un bucket da ElencoBucket
  const handleBucketSelection = (bucketName) => {
    setSelectedBucketForS3List(bucketName); // Imposta il bucket selezionato
    setCurrentS3Path(''); // Resetta il path alla root del nuovo bucket
    // Trova l'oggetto funzione per S3ListFiles e impostalo come funzione corrente
    const s3ListFilesFunc = serviceFunctionsMap.S3.find(f => f.key === 's3-list');
    if (s3ListFilesFunc) {
      setSelectedFunction(s3ListFilesFunc);
    }
  };

  // Funzione per gestire il cambio di percorso all'interno di S3ListFiles
  const handleS3PathChange = (newPath) => {
    setCurrentS3Path(newPath);
    // Assicurati che S3ListFiles sia la funzione selezionata se navighi i path
    const s3ListFilesFunc = serviceFunctionsMap.S3.find(f => f.key === 's3-list');
    if (s3ListFilesFunc && selectedFunction !== s3ListFilesFunc) {
      setSelectedFunction(s3ListFilesFunc);
    }
  };

  // Funzione per gestire la richiesta di upload da S3ListFiles
  const handleUploadRequest = (bucket, path) => {
    setSelectedBucketForS3List(bucket); // Assicurati che il bucket sia impostato
    setCurrentS3Path(path); // Imposta il path per l'upload
    // Seleziona la funzione di upload
    const s3UploadFunc = serviceFunctionsMap.S3.find(f => f.key === 's3-upload');
    if (s3UploadFunc) {
      setSelectedFunction(s3UploadFunc);
    }
  };

  // Determina il componente da renderizzare e le sue props
  const CurrentFunctionComponent = selectedFunction ? selectedFunction.component : null;
  const componentProps = {};

  if (CurrentFunctionComponent === ElencoBucket) {
    componentProps.onBucketSelect = handleBucketSelection;
  } else if (CurrentFunctionComponent === S3ListFiles) {
    componentProps.bucketName = selectedBucketForS3List;
    componentProps.currentPath = currentS3Path;
    componentProps.onPathSelect = handleS3PathChange;
    componentProps.onUploadRequest = handleUploadRequest; // Passa la nuova funzione
  } else if (CurrentFunctionComponent === S3UploadFile) { // Props per S3UploadFile
    componentProps.bucketName = selectedBucketForS3List;
    componentProps.currentPath = currentS3Path;
  } else if (CurrentFunctionComponent === S3DestroyBucket) { // Props per S3DestroyBucket
    componentProps.bucketName = selectedBucketForS3List;
  }
  // Aggiungi qui altre condizioni se altri componenti necessitano di props specifiche

  return (
    <div className="container-fluid p-0">
      {/* Navbar superiore per i Servizi */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm rounded-bottom-md">
        <div className="container-fluid">
          <a className="navbar-brand text-warning fw-bold px-3 py-2 rounded-lg" href="#">ReactAwsConsole</a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#serviceNavbar"
            aria-controls="serviceNavbar"
            aria-expanded="false"
            aria-label="Toggle service navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="serviceNavbar">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {Object.keys(serviceFunctionsMap).map((service) => (
                <li className="nav-item" key={service}>
                  <button
                    className={`nav-link btn btn-link text-decoration-none ${selectedService === service ? 'active text-primary bg-light rounded-md' : 'text-light'}`}
                    onClick={() => handleServiceChange(service)}
                    aria-current={selectedService === service ? 'page' : undefined}
                  >
                    {service}
                  </button>
                </li>
              ))}
            </ul>
            <span className="navbar-text text-white-50">
              Utente: DemoUser
            </span>
          </div>
        </div>
      </nav>

      {/* Sottobarra per le Funzionalità (visibile solo se un servizio è selezionato) */}
      {selectedService && serviceFunctionsMap[selectedService] && (
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm mt-0 rounded-bottom-md">
          <div className="container-fluid">
            <span className="navbar-text text-dark fw-bold me-3">Funzioni {selectedService}:</span>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#functionNavbar"
              aria-controls="functionNavbar"
              aria-expanded="false"
              aria-label="Toggle function navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="functionNavbar">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                {serviceFunctionsMap[selectedService].map((func) => (
                  <li className="nav-item" key={func.key}>
                    <button
                      className={`nav-link btn btn-link text-decoration-none ${selectedFunction && selectedFunction.key === func.key ? 'active text-primary bg-info-subtle rounded-md' : 'text-dark'}`}
                      onClick={() => handleFunctionChange(func)}
                      aria-current={selectedFunction && selectedFunction.key === func.key ? 'page' : undefined}
                      // Disabilita le funzioni S3 se richiedono un bucket e nessuno è selezionato
                      disabled={selectedService === 'S3' && func.needsBucket && !selectedBucketForS3List}
                      title={selectedService === 'S3' && func.needsBucket && !selectedBucketForS3List ? "Seleziona un bucket per abilitare questa funzione" : undefined}
                    >
                      {func.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>
      )}

      {/* Area del Contenuto Dinamico */}
      <div className="container mt-4">
        <h3 className="mb-4 text-center text-secondary">
          {selectedService && selectedFunction ? `Servizio: ${selectedService} - Funzione: ${selectedFunction.name}` : 'Seleziona un Servizio e una Funzione'}
        </h3>

        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-7">
            {CurrentFunctionComponent ? (
              // Il componente viene renderizzato con le props determinate dinamicamente
              <CurrentFunctionComponent {...componentProps} />
            ) : (
              <div className="alert alert-info text-center" role="alert">
                Seleziona una funzione dalla sottobarra per visualizzare i dettagli.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;