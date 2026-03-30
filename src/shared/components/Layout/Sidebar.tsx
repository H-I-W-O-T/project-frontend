import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Truck,
  BarChart3,
  ShieldCheck,
  PlusCircle,
  Users,
  Package,
  UserPlus,
  CheckCircle,
  DollarSign,
  History,
  WifiOff,
  Scan,
} from 'lucide-react';

interface NavItem {
  path: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
}

interface SidebarProps {
  userType: 'donor' | 'manager' | 'agent';
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ userType, isOpen, onClose }: SidebarProps) => {
  // Navigation item definitions (Same as your provided code)
  const donorNavItems: NavItem[] = [
    { path: '/donor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/donor/fund', icon: PlusCircle, label: 'Fund Program' },
    { path: '/donor/shipments', icon: Truck, label: 'Track Shipments' },
    { path: '/donor/impact', icon: BarChart3, label: 'Impact Reports' },
    { path: '/donor/verify', icon: ShieldCheck, label: 'Verify Proofs' },
  ];

  const managerNavItems: NavItem[] = [
    { path: '/manager/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/manager/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/manager/agents', icon: Users, label: 'Field Agents' },
    { path: '/manager/inventory', icon: Package, label: 'Inventory' },
  ];

  const agentNavItems: NavItem[] = [
    { path: '/agent/dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: 3 },
    { path: '/agent/register', icon: UserPlus, label: 'Register' },
    { path: '/agent/verify', icon: CheckCircle, label: 'Verify' },
    { path: '/agent/distribute', icon: DollarSign, label: 'Distribute' },
    { path: '/agent/scan', icon: Scan, label: 'Scan Batch' },
    { path: '/agent/history', icon: History, label: 'History' },
    { path: '/agent/offline', icon: WifiOff, label: 'Offline Queue', badge: 47 },
  ];

  const navItems = userType === 'donor' ? donorNavItems : userType === 'manager' ? managerNavItems : agentNavItems;

  const sidebarContent = (
    <aside className="h-full bg-white shadow-lg border-r border-gray-200 flex flex-col w-64">
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-primary-cyan text-primary-dark shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-primary-dark'
              }`
            }
          >
            <div className="flex items-center space-x-3">
              <item.icon size={18} className="group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            {item.badge && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                item.label === 'Offline Queue' ? 'bg-error text-white' : 'bg-primary-cyan text-primary-dark'
              }`}>
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center space-x-2 text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span>Stellar Testnet</span>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop View: Always Visible */}
      <div className="hidden lg:block h-full">
        {sidebarContent}
      </div>

      {/* Mobile View: Controlled by isOpen */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative h-full w-64 shadow-2xl">
          {sidebarContent}
        </div>
      </div>
    </>
  );
};