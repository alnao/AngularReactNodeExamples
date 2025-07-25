
//import { useState } from "react";
import { useEffect, useState } from 'react';
import AwsS3ConsoleServices from '../services/s3.js';

// Permette il download di file e la navigazione nelle cartelle.
export const S3ListFiles = ({ bucketName, currentPath, onPathSelect, onUploadRequest }) => {
    const [contents, setContents] = useState([]);  //const contents = bucketName ? getSimulatedContents(bucketName, currentPath) : [];
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBuckets = async () => {
        setLoading(true);
        setError(null);
        AwsS3ConsoleServices.getFiles(bucketName, currentPath).then(response => {
            setContents(response.data);
            setLoading(false);
        }).catch (err =>{
            console.error("Errore nel recupero dei bucket:", err); // Log dell'errore per debugging
            setError('Errore durante il recupero dei bucket. Riprova più tardi.');
            setLoading(false);
        });
    };
    useEffect(() => {
      fetchBuckets();
    }, []); // Esegui solo al montaggio del componente


    const handleItemClick = (item) => { 
        if (item.type === 'file') {
        // Simula il download del file
        alert(`Download simulato del file: "${bucketName}/${currentPath}${item.name}"`);
        // In una vera applicazione, qui faresti una fetch API per scaricare il file
        } else if (item.type === 'folder') {
        // Naviga nella cartella
        onPathSelect(`${currentPath}${item.name}`);
        }
    };

    const handleBackClick = () => {
        if (currentPath === '') return;
        const pathParts = currentPath.split('/').filter(Boolean); // Rimuove stringhe vuote
        pathParts.pop(); // Rimuove l'ultima parte (cartella corrente)
        const newPath = pathParts.length > 0 ? `${pathParts.join('/')}/` : '';
        onPathSelect(newPath);
    };
    if (loading) {
        return (
        <div className="card shadow-sm p-4 rounded-lg bg-light text-center">
            <h4 className="text-secondary">Caricamento Bucket...</h4>
            <div className="spinner-border text-info" role="status">
            <span className="visually-hidden">Loading...</span>
            </div>
        </div>
        );
    }
    if (error) {
        return (
        <div className="card shadow-sm p-4 rounded-lg bg-danger text-white">
            <h4>Errore!</h4>
            <p>{error}</p>
        </div>
        );
    }
    return (
        <div className="card shadow-sm p-4 rounded-lg bg-light">
        <h4 className="text-info">Elenco File S3 {bucketName ? `per il bucket: "${bucketName}"` : ''}</h4>
        <p className="text-muted">
            {bucketName ? `Percorso attuale: ${currentPath || '/'}` : 'Seleziona un bucket per visualizzare i file.'}
        </p>

        {bucketName ? (
            <>
            {currentPath !== '' && (
                <button
                className="btn btn-outline-secondary btn-sm mb-3 rounded-pill"
                onClick={handleBackClick}
                >
                <i className="bi bi-arrow-left me-2"></i> Torna indietro
                </button>
            )}
            {contents.length > 0 ? (
                <ul className="list-group list-group-flush">
                {contents.map((item, index) => (
                    <li
                    key={index}
                    className="list-group-item list-group-item-action d-flex justify-content-between align-items-center rounded-md mb-2"
                    onClick={() => handleItemClick(item)}
                    style={{ cursor: 'pointer', border: '1px solid #dee2e6' }}
                    >
                    <span className="d-flex align-items-center">
                        {item.type === 'folder' ? (
                        <i className="bi bi-folder-fill me-2 text-warning"></i>
                        ) : (
                        <i className="bi bi-file-earmark-text me-2 text-primary"></i>
                        )}
                        {item.name}
                    </span>
                    {item.type === 'folder' && (
                        <i className="bi bi-chevron-right text-muted"></i>
                    )}
                    {item.type === 'file' && (
                        <i className="bi bi-download text-success"></i>
                    )}
                    </li>
                ))}
                </ul>
            ) : (
                <div className="alert alert-info text-center" role="alert">
                Nessun contenuto trovato nel percorso: "{currentPath || '/'}"
                </div>
            )}
            <div className="d-flex justify-content-between mt-3">
                <button className="btn btn-outline-info btn-sm rounded-pill" onClick={() => onUploadRequest(bucketName, currentPath)}>
                <i className="bi bi-upload me-2"></i> Carica File in questa posizione
                </button>
                <button className="btn btn-outline-info btn-sm rounded-pill">
                Aggiorna Elenco
                </button>
            </div>
            </>
        ) : (
            <div className="alert alert-warning text-center" role="alert">
            Seleziona un bucket dalla funzione "Elenco Bucket" per visualizzare i file.
            </div>
        )}
        </div>
    );
};

/*
    const contents = bucketName ? getSimulatedContents(bucketName, currentPath) : [];

  // Simulazione di file e cartelle per un bucket e path specifici
  const getSimulatedContents = (bucket, path) => {
    // Simulazione di dati nidificati per i bucket
    const data = {
      'my-personal-photos-bucket': {
        '': [
          { name: 'vacation/', type: 'folder' },
          { name: 'family/', type: 'folder' },
          { name: 'selfie.jpeg', type: 'file' },
          { name: 'document.pdf', type: 'file' }
        ],
        'vacation/': [
          { name: 'beach.jpg', type: 'file' },
          { name: 'mountains.png', type: 'file' },
          { name: 'europe/', type: 'folder' }
        ],
        'vacation/europe/': [
          { name: 'italy.jpg', type: 'file' },
          { name: 'france.png', type: 'file' }
        ],
        'family/': [
          { name: 'reunion.png', type: 'file' },
          { name: 'grandparents.jpg', type: 'file' }
        ],
      },
      'company-documents-archive': {
        '': [
          { name: 'reports/', type: 'folder' },
          { name: 'report-q1-2025.pdf', type: 'file' },
          { name: 'meeting-notes.docx', type: 'file' }
        ],
        'reports/': [
          { name: 'annual-report-2024.pdf', type: 'file' },
          { name: 'quarterly-report-q2.xlsx', type: 'file' }
        ]
      },
      'website-assets-2025': {
        '': [
          { name: 'index.html', type: 'file' },
          { name: 'style.css', type: 'file' },
          { name: 'script.js', type: 'file' },
          { name: 'images/', type: 'folder' }
        ],
        'images/': [
          { name: 'logo.png', type: 'file' },
          { name: 'background.jpg', type: 'file' }
        ]
      },
      'backup-data-server': {
        '': [
          { name: 'server-logs/', type: 'folder' },
          { name: 'database-dump-2025-06-25.sql', type: 'file' }
        ],
        'server-logs/': [
          { name: 'access.log', type: 'file' },
          { name: 'error.log', type: 'file' }
        ]
      },
      'logs-application-prod': {
        '': [
          { name: 'app-log-2025-06-25.txt', type: 'file' }
        ]
      }
    };

    // Assicurati che il path finisca con '/' se è una cartella, e sia vuoto per la root
    const normalizedPath = path.endsWith('/') || path === '' ? path : path + '/';
    return data[bucket] ? data[bucket][normalizedPath] || [] : [];

  };
  */