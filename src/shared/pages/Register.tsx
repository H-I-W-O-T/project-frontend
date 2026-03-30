import React, { useState } from 'react';
import { useStellar } from '../../contexts/StellarContext';
import { CONTRACTS } from '../api/contracts/config';
import { Card, Button } from '../components/Common';
import { Input } from '../components/Forms/Input';
import { ShieldCheck, UserCircle, Building2, Briefcase } from 'lucide-react';

export const Register = () => {
  const { publicKey, callContract } = useStellar();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    role: '0', // 0: Donor, 1: Manager, 2: Agent
    organization: ''
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey) return;

    setLoading(true);
    try {
      // This hits the 'register_user' function you added to the Rust contract
      await callContract({
        contractId: CONTRACTS.IDENTITY,
        method: "register_user",
        args: [
          publicKey,
          formData.name,
          Number(formData.role), 
          formData.organization || ""
        ]
      });

      // Success! Reload the page. 
      // The StellarProvider will re-run 'syncProfile', 
      // see the new user, and App.tsx will route them to their dashboard.
      window.location.href = '/'; 
      
    } catch (err) {
      console.error("Registration failed", err);
      alert("Registration failed. Ensure you have enough Testnet XLM for the transaction fee.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-cyan/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="text-primary-dark" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Finalize Identity</h2>
          <p className="text-gray-500 mt-2">Create your on-chain profile to access HIWOT</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <UserCircle size={18} /> Full Name
            </label>
            <Input 
              placeholder="e.g. John Doe"
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              required 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Briefcase size={18} /> Select Your Role
            </label>
            <div className="grid grid-cols-1 gap-3">
              {[
                { id: '0', label: 'Donor', desc: 'Fund programs and track global impact.' },
                { id: '1', label: 'Program Manager', desc: 'Design programs and manage supply chains.' },
                { id: '2', label: 'Field Agent', desc: 'Verify beneficiaries and distribute goods.' }
              ].map((role) => (
                <label 
                  key={role.id}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all flex items-center gap-4 ${
                    formData.role === role.id 
                    ? 'border-primary-cyan bg-primary-cyan/5 shadow-sm' 
                    : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <input 
                    type="radio" 
                    name="role" 
                    value={role.id}
                    className="w-4 h-4 text-primary"
                    checked={formData.role === role.id}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  />
                  <div>
                    <p className="font-bold text-gray-900">{role.label}</p>
                    <p className="text-xs text-gray-500">{role.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Building2 size={18} /> Organization (Optional)
            </label>
            <Input 
              placeholder="e.g. Red Cross, UN, etc."
              value={formData.organization} 
              onChange={(e) => setFormData({...formData, organization: e.target.value})} 
            />
          </div>

          <Button 
            type="submit" 
            loading={loading} 
            className="w-full h-12 text-lg bg-gradient-brand hover:shadow-lg transition-all"
          >
            Create On-Chain Identity
          </Button>

          <p className="text-[10px] text-center text-gray-400 mt-4 uppercase tracking-widest">
            Transaction will be signed via Freighter Wallet
          </p>
        </form>
      </Card>
    </div>
  );
};