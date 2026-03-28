import { Card } from '../../../shared/components/Common/Card';
import { Button } from '../../../shared/components/Common/Button';

const Settings = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">General Settings</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Email Notifications</div>
                <div className="text-sm text-gray-500">Receive email updates about programs</div>
              </div>
              <input type="checkbox" className="toggle" />
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Dark Mode</div>
                <div className="text-sm text-gray-500">Switch to dark theme</div>
              </div>
              <input type="checkbox" className="toggle" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">API Settings</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">API Environment</div>
                <div className="text-sm text-gray-500">Current: Mock Data</div>
              </div>
              <Button variant="secondary" size="sm">
                Configure
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;