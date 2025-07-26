import { useState, useEffect } from 'react';
import AwsEC2ConsoleServices from '../services/ec2.js';

export default function SecurityGroupManager() {
  const [region, setRegion] = useState('eu-central-1');
  const [groups, setGroups] = useState([]);

  const fetchGroups = async () => {
    if (!region) return;
    const res = AwsEC2ConsoleServices.fetchGroups(region);
    setGroups(res.data);
  };

  const authorize = async (groupId) => {
    AwsEC2ConsoleServices.authorize(region, groupId);
    fetchGroups();
  };

  const revoke = async (groupId) => {
    AwsEC2ConsoleServices.revoke(region, groupId);
    fetchGroups();
  };
  useEffect(() => {
    fetchGroups();
    setRegion('eu-central-1'); // Set default region
  }, []); // Esegui solo al montaggio del componente


  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Security Group Manager</h2>

      <input
        placeholder="Region (e.g. eu-west-1)"
        className="border p-2 mb-2 w-full"
        value={region}
        onChange={(e) => setRegion(e.target.value)}
        onBlur={fetchGroups}
      />
      {groups!==undefined && <div>
        {groups.map(group => (
          <div key={group.groupId} className="border p-2 mb-2">
            <div><strong>ID:</strong> {group.groupId}</div>
            <div><strong>Name:</strong> {group.groupName}</div>
            <button onClick={() => authorize(group.groupId)} className="text-green-600 mr-2">Authorize SSH</button>
            <button onClick={() => revoke(group.groupId)} className="text-red-600">Revoke SSH</button>
          </div>
        ))}
      </div>}
    </div>
  );
}
