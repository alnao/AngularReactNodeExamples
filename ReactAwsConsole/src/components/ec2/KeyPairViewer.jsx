import { useState, useEffect } from 'react';
import axios from 'axios';

export default function KeyPairViewer() {
  const [region, setRegion] = useState('');
  const [keys, setKeys] = useState([]);

  const fetchKeys = async () => {
    if (!region) return;
    const res = await axios.get(`/aws/ec2/key-pairs?region=${region}`);
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

      {keys.map((key) => (
        <div key={key.keyName} className="border p-2 mb-2">
          <div><strong>Name:</strong> {key.keyName}</div>
          <div><strong>Fingerprint:</strong> {key.keyFingerprint}</div>
        </div>
      ))}
    </div>
  );
}
