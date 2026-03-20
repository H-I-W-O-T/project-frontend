import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Truck,
  BarChart3,
  ShieldCheck,
  PlusCircle,
  MapPin,
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
  const donorNavItems: NavItem[] = [
    { path: '/donor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/donor/fund', icon: PlusCircle, label: 'Fund Program' },
    { path: '/donor/shipments', icon: Truck, label: 'Track Shipments' },
    { path: '/donor/impact', icon: BarChart3, label: 'Impact Reports' },
    { path: '/donor/verify', icon: ShieldCheck, label: 'Verify Proofs' },
  ];

  const managerNavItems: NavItem[] = [
    { path: '/manager/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/manager/create', icon: PlusCircle, label: 'Create Program' },
    { path: '/manager/geofence', icon: MapPin, label: 'Geofence Map' },
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

  let navItems: NavItem[];
  switch (userType) {
    case 'donor':
      navItems = donorNavItems;
      break;
    case 'manager':
      navItems = managerNavItems;
      break;
    case 'agent':
      navItems = agentNavItems;
      break;
    default:
      navItems = [];
  }

  const sidebarContent = (
    <aside className="h-full bg-white shadow-lg border-r border-gray-200 flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-brand">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-cyan rounded-lg flex items-center justify-center">
            <span className="text-primary-dark font-bold text-sm">H</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm">HIWOT</p>
            <p className="text-primary-light text-xs">v1.0.0</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-primary'
              }`
            }
          >
            <div className="flex items-center space-x-3">
              <item.icon size={18} />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            {item.badge && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  item.label === 'Offline Queue'
                    ? 'bg-warning text-white'
                    : 'bg-primary-light text-primary-dark'
                }`}
              >
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Connected to Stellar Testnet</span>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Blockchain: {new Date().toLocaleDateString()}
        </p>
      </div>
    </aside>
  );

  // Mobile drawer version
  if (!isOpen) {
    return (
      <>
        {/* Desktop version - always visible on lg screens */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          {sidebarContent}
        </div>
      </>
    );
  }

  // Mobile drawer
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden animate-fade-in"
        onClick={onClose}
      />
      {/* Drawer */}
      <div className="fixed left-0 top-0 bottom-0 w-64 z-50 animate-slide-up lg:hidden">
        {sidebarContent}
      </div>
    </>
  );
};