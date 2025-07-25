import { useEffect, useState } from "react";
import AwsS3ConsoleServices from '../services/s3.js';

export const ElencoBucket = ({ onBucketSelect }) => {
    const [buckets, setBuckets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchBuckets = () => {
        setLoading(true);
        setError(null);
        AwsS3ConsoleServices.getBuckets().then(response => {
          console.log(response);
          setBuckets(response.data);
          setLoading(false);
        }).catch(err => {
          console.error("Errore nel recupero dei bucket:", err); // Log dell'errore per debugging
          setError('Errore durante il recupero dei bucket. Riprova più tardi.');
          setLoading(false);
        });
    }
    useEffect(() => {
      fetchBuckets();
    }, []); // Esegui solo al montaggio del componente

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
      <h4 className="text-info">Elenco Bucket S3</h4>
      <p className="text-muted">Clicca su un bucket per visualizzarne i file.</p>
      {buckets!==undefined && buckets.length > 0 ? (
        <ul className="list-group list-group-flush">
          {buckets.map((bucket, index) => (
            <li
              key={index}
              className="list-group-item list-group-item-action d-flex justify-content-between align-items-center rounded-md mb-2"
              onClick={() => onBucketSelect(bucket)}
              style={{ cursor: 'pointer', border: '1px solid #dee2e6' }}
            >
              {bucket}
              <i className="bi bi-chevron-right text-muted"></i> {/* Icona di esempio */}
            </li>
          ))}
        </ul>
      ) : (
        <div className="alert alert-warning text-center" role="alert">
          Nessun bucket trovato.
        </div>
      )}
      <button className="btn btn-outline-info btn-sm rounded-pill mt-3" onClick={() => window.location.reload()}>
        Aggiorna Elenco
      </button>
    </div>
  );
};