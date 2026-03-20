import { Card } from '../../../shared/components/Common/Card';
import { Button } from '../../../shared/components/Common/Button';
import { Input } from '../../../shared/components/Forms/Input';
import { useToast } from '../../../shared/components/Common/ToastContainer';

export const Settings = () => {
  const toast = useToast();

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gradient">Donor Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and notification preferences.</p>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
        <div className="space-y-4">
          <Input label="Organization Name" defaultValue="Humanitarian Foundation" />
          <Input label="Email Address" defaultValue="contact@humanitarian.org" />
          <Input label="Wallet Address" defaultValue="0x7a4f3d8e2c1b..." readOnly />
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h2>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 text-primary" defaultChecked />
            <span className="text-sm text-gray-700">Email me when distributions complete</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 text-primary" defaultChecked />
            <span className="text-sm text-gray-700">Alert me when shipments are delayed</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 text-primary" />
            <span className="text-sm text-gray-700">Monthly impact report</span>
          </label>
        </div>
      </Card>
    </div>
  );
};