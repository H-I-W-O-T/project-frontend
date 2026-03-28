import { useState } from 'react';
import { Card, Button } from '../shared/components/Common';
import { Input } from '../shared/components/Forms/Input';
import { Select } from '../shared/components/Forms/Select';
import { Checkbox } from '../shared/components/Forms/Checkbox';
import { Mail, Lock, User, Briefcase, Shield } from 'lucide-react';

export const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    termsAccepted: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  // Available roles for users to choose
  const roleOptions = [
    { value: 'donor', label: 'Donor' },
    { value: 'agent', label: 'Agent' },
    { value: 'manager', label: 'Manager' },
  ];

  // Handle generalized input binding
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // Special case for checkbox to capture boolean instead of string
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    // Simulate API registration request
    setTimeout(() => {
      setIsLoading(false);
      console.log('User registered with payload:', formData);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-dark mb-2 tracking-tight">Vega App</h1>
          <p className="text-slate-600">Create your account to get started</p>
        </div>

        {/* Card Component using 'elevated' custom variant */}
        <Card variant="elevated" padding="lg" className="border-t-4 border-t-primary">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="fullName"
              name="fullName"
              label="Full Name"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              leftIcon={<User size={18} className="text-slate-400" />}
              required
            />

            <Input
              id="email"
              name="email"
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              leftIcon={<Mail size={18} className="text-slate-400" />}
              required
            />

            <Select
              id="role"
              name="role"
              label="Account Type"
              options={roleOptions}
              value={formData.role}
              onChange={handleChange}
              placeholder="Select a role..."
              leftIcon={<Briefcase size={18} className="text-slate-400" />}
              required
            />

            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              leftIcon={<Lock size={18} className="text-slate-400" />}
              showPasswordToggle
              required
            />

            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              leftIcon={<Shield size={18} className="text-slate-400" />}
              showPasswordToggle
              required
            />

            <div className="pt-2">
              <Checkbox
                id="termsAccepted"
                name="termsAccepted"
                label="I agree to the Terms of Service and Privacy Policy"
                checked={formData.termsAccepted}
                onChange={handleChange}
                required
              />
            </div>

            {/* Custom Primary Button referencing app-specific tailwind classes */}
            <Button 
              type="submit" 
              fullWidth 
              size="lg" 
              loading={isLoading}
              className="bg-primary hover:bg-primary-dark text-white transition-colors mt-4"
            >
              Register Account
            </Button>
            
            <div className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <a href="/login" className="text-primary-dark font-semibold hover:underline">
                Sign in here
              </a>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
