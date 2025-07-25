import { useState, useEffect } from 'react';
import axios from 'axios';

export default function SecurityGroupManager() {
  const [region, setRegion] = useState('');
  const [groups, setGroups] = useState([]);

  const fetchGroups = async () => {
    if (!region) return;
    const res = await axios.get(`/aws/ec2/security-groups?region=${region}`);
    setGroups(res.data);
  };

  const authorize = async (groupId) => {
    await axios.post(`/aws/ec2/security-groups/${groupId}/authorize?region=${region}`);
    fetchGroups();
  };

  const revoke = async (groupId) => {
    await axios.post(`/aws/ec2/security-groups/${groupId}/revoke?region=${region}`);
    fetchGroups();
  };

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

      {groups.map(group => (
        <div key={group.groupId} className="border p-2 mb-2">
          <div><strong>ID:</strong> {group.groupId}</div>
          <div><strong>Name:</strong> {group.groupName}</div>
          <button onClick={() => authorize(group.groupId)} className="text-green-600 mr-2">Authorize SSH</button>
          <button onClick={() => revoke(group.groupId)} className="text-red-600">Revoke SSH</button>
        </div>
      ))}
    </div>
  );
}
