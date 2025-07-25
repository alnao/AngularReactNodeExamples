import { useState, useEffect } from 'react';
import AwsEC2ConsoleServices from '../services/ec2.js';


export default function EC2InstanceManager() {
  const [instances, setInstances] = useState([]);
  const [form, setForm] = useState({
    region: 'eu-central-1',
    amiId: '',
    instanceType: '',
    keyName: '',
    securityGroupId: ''
  });

  const fetchInstances = async () => {
    if (!form.region) return;
    const res = await AwsEC2ConsoleServices.fetchInstances(form.region);
    setInstances(res.data);
  };

  const createInstance = async () => {
    await AwsEC2ConsoleServices.createInstance(form);
    fetchInstances();
  };

  const stopInstance = async (id) => {
    await AwsEC2ConsoleServices.stopInstance(form.region,id);
    fetchInstances();
  };

  const startInstance = async (id) => {
    await AwsEC2ConsoleServices.startInstance(form.region,id);
    fetchInstances();
  };

  const terminateInstance = async (id) => {
    await AwsEC2ConsoleServices.terminateInstance(form.region,id);
    fetchInstances();
  };

  useEffect(() => {
    fetchInstances();
  }, []); // Esegui solo al montaggio del componente

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">EC2 Instance Manager</h2>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {Object.keys(form).map((key) => (
          <input
            key={key}
            placeholder={key}
            className="border p-2"
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          />
        ))}
        <button onClick={createInstance} className="bg-green-600 text-white p-2 col-span-2">Create Instance</button>
      </div>

      <h3 className="font-semibold">Instances</h3>
      {instances.map((res) =>
        res.instances.map((inst) => (
          <div key={inst.instanceId} className="border p-2 mb-2">
            <div>ID: {inst.instanceId}</div>
            <div>State: {inst.state.name}</div>
            <button onClick={() => startInstance(inst.instanceId)} className="text-blue-600 mr-2">Start</button>
            <button onClick={() => stopInstance(inst.instanceId)} className="text-yellow-600 mr-2">Stop</button>
            <button onClick={() => terminateInstance(inst.instanceId)} className="text-red-600">Terminate</button>
          </div>
        ))
      )}
    </div>
  );
}
