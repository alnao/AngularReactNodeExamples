import { useState, useEffect } from 'react';
import AwsEC2ConsoleServices from '../services/ec2.js';


export default function KeyPairViewer() {
  const [region, setRegion] = useState('eu-central-1');
  const [keys, setKeys] = useState([]);

  const fetchKeys = async () => {
    if (!region) return;
    const res = AwsEC2ConsoleServices.fetchKeys(region);
    setKeys(res.data);
  };

  useEffect(() => { if (region) fetchKeys(); }, [region]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Key Pair Viewer</h2>

      <input
        placeholder="Region (e.g. eu-west-1)"
        className="border p-2 mb-4 w-full"
        value={region}
        onChange={(e) => setRegion(e.target.value)}
      />
      {keys!==undefined && <div>
        {keys.map((key) => (
          <div key={key.keyName} className="border p-2 mb-2">
            <div><strong>Name:</strong> {key.keyName}</div>
            <div><strong>Fingerprint:</strong> {key.keyFingerprint}</div>
          </div>
        ))}
      </div>}
    </div>
  );
}
