import { useState } from 'react';
import type { FormEvent } from 'react';
import { Modal } from '../Common/Modal';
import { Button } from '../Common/Button';
import { Input } from '../Forms/Input';
import { Select } from '../Forms/Select';
import { Checkbox } from '../Forms/Checkbox';
import { Mail, Lock, User, Briefcase, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';


export const AuthModal = () => {
  const { user, login, isInitialized } = useAuth();

  // States
  const [view, setView] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'donor',
    termsAccepted: false,
  });

  // Only show if initialization completed and no user exists
  if (!isInitialized || user) {
    return null;
  }

  const roleOptions = [
    { value: 'donor', label: 'Donor' },
    { value: 'agent', label: 'Agent' },
    { value: 'manager', label: 'Manager' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAuth = async (e: FormEvent) => {
    e.preventDefault();
    
    if (view === 'register' && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setIsLoading(true);

    // Simulate API process
    setTimeout(() => {
      setIsLoading(false);
      
      // Perform final Login operation saving into context and local storage folder service
      login({
        id: Math.random().toString(),
        fullName: view === 'register' ? formData.fullName : 'Vega User',
        email: formData.email,
        role: formData.role as any,
        token: 'mock-jwt-token-123',
      });
      
    }, 1500);
  };

  return (
    <Modal
      isOpen={true}
      onClose={() => {}}
      title={view === 'login' ? 'Welcome Back!' : 'Create an Account'}
      size="md"
      closeOnOverlayClick={false}
      showCloseButton={false}
    >
      <div className="p-2 space-y-4">
        <p className="text-slate-600 text-sm mb-4">
          {view === 'login'
            ? 'Sign in to access your dashboard and manage your impact.'
            : 'Join Vega to start making a real impact today.'}
        </p>

        <form onSubmit={handleAuth} className="space-y-4">
          {view === 'register' && (
            <Input
              id="fullName"
              name="fullName"
              label="Full Name"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              leftIcon={<User size={18} />}
              required
            />
          )}

          <Input
            id="email"
            name="email"
            type="email"
            label="Email Address"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            leftIcon={<Mail size={18} />}
            required
          />

          <Select
            id="role"
            name="role"
            label="Account Type"
            options={roleOptions}
            value={formData.role}
            onChange={handleChange}
            leftIcon={<Briefcase size={18} />}
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
            leftIcon={<Lock size={18} />}
            showPasswordToggle
            required
          />

          {view === 'register' && (
            <>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                label="Confirm Password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                leftIcon={<Shield size={18} />}
                showPasswordToggle
                required
              />
              <div className="pt-1">
                <Checkbox
                  id="termsAccepted"
                  name="termsAccepted"
                  label="I agree to the Terms of Service"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={isLoading}
            className="bg-primary hover:bg-primary-dark mt-4"
          >
            {view === 'login' ? 'Sign In' : 'Register Account'}
          </Button>

          <div className="mt-4 text-center text-sm text-slate-500">
            {view === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              className="text-primary-dark font-semibold hover:underline"
              onClick={() => setView(view === 'login' ? 'register' : 'login')}
            >
              {view === 'login' ? 'Sign up here' : 'Sign in here'}
            </button>
          </div>
        </form>
        {/* Removed 'Don’t show this popup again' option */}
      </div>
    </Modal>
  );
};
