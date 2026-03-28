import { useState } from 'react';
import { Menu, Bell, User, LogOut, Settings, ChevronDown, Wallet } from 'lucide-react';
import { useWallet } from '../../../contexts/Wallet';

interface HeaderProps {
  userType: 'donor' | 'manager' | 'agent';
  userName: string;
  userAvatar?: string;
  onMenuClick?: () => void;
  onLogout?: () => void;
}

export const Header = ({ userType, userName, userAvatar, onMenuClick, onLogout }: HeaderProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  // Wallet Context for connecting Hiwot Protocol
  const { isConnected, isConnecting, publicKey, usdcBalance, connect, disconnect } = useWallet();

  const userTypeLabels = {
    donor: 'Donor',
    manager: 'Program Manager',
    agent: 'Field Agent',
  };

  const notifications = [
    { id: 1, message: 'New program funded: $50,000', time: '5 min ago', read: false },
    { id: 2, message: 'Shipment #BISC-001 arrived at warehouse', time: '1 hour ago', read: false },
    { id: 3, message: 'Distribution target reached 75%', time: '3 hours ago', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-gradient-brand text-white shadow-lg sticky top-0 z-40">
      <div className="container-padding py-3">
        <div className="flex items-center justify-between">
          <div className='flex space-x-4'>
            {/* Mobile Menu Button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-primary-dark transition-colors"
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>

            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-cyan rounded-lg flex items-center justify-center shadow-md">
                <span className="text-primary-dark font-bold text-xl">H</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold tracking-tight">HIWOT</h1>
                <p className="text-xs text-primary-light">Humanitarian Coordination Protocol</p>
              </div>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            
            {/* Wallet Section */}
            <div className="hidden sm:flex items-center">
              {isConnected ? (
                <div className="flex items-center bg-primary-dark bg-opacity-40 rounded-lg overflow-hidden border border-primary/20">
                  <div className="px-3 py-1.5 text-sm font-medium border-r border-primary/20 flex items-center space-x-1">
                    <Wallet size={14} className="text-primary-cyan mr-1" />
                    <span>{usdcBalance.toFixed(2)} USDC</span>
                  </div>
                  <div className="px-3 py-1.5 text-sm bg-primary-dark/60 text-primary-cyan cursor-pointer hover:bg-primary-dark/80 transition-colors" title="Disconnect Wallet" onClick={disconnect}>
                    {publicKey?.substring(0, 4)}...{publicKey?.substring(publicKey.length - 4)}
                  </div>
                </div>
              ) : (
                <button
                  onClick={connect}
                  disabled={isConnecting}
                  className="flex items-center space-x-2 bg-primary-cyan text-primary-dark cursor-pointer px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-white transition-colors disabled:opacity-75"
                >
                  <Wallet size={16} />
                  <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
                </button>
              )}
            </div>

            {/* User Type Badge */}
            <div className="hidden md:block px-3 py-1 rounded-full bg-primary-dark bg-opacity-50 text-sm">
              {userTypeLabels[userType]}
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsDropdownOpen(false);
                }}
                className="relative p-2 rounded-lg hover:bg-primary-dark transition-colors"
                aria-label="Notifications"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-primary-cyan rounded-full animate-pulse"></span>
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 animate-fade-in">
                  <div className="p-3 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                          !notification.read ? 'bg-primary-light bg-opacity-5' : ''
                        }`}
                      >
                        <p className="text-sm text-gray-800">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 border-t border-gray-100">
                    <button className="text-sm text-primary hover:text-primary-dark w-full text-center py-1">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsDropdownOpen(!isDropdownOpen);
                  setIsNotificationsOpen(false);
                }}
                className="flex items-center space-x-2 hover:bg-primary-dark px-2 py-1 rounded-lg transition-colors"
                aria-label="User menu"
              >
                <div className="w-8 h-8 bg-primary-cyan rounded-full flex items-center justify-center shadow-md">
                  {userAvatar ? (
                    <img src={userAvatar} alt={userName} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-primary-dark font-bold text-sm">
                      {userName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="hidden md:inline text-sm font-medium">{userName}</span>
                <ChevronDown size={16} className="hidden md:block" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50 animate-fade-in">
                  <div className="p-3 border-b border-gray-100">
                    <p className="font-medium text-gray-900">{userName}</p>
                    <p className="text-xs text-gray-500 mt-1">{userTypeLabels[userType]}</p>
                  </div>
                  <div className="py-1">
                    <button className="dropdown-item flex items-center space-x-2 w-full">
                      <User size={16} />
                      <span>Profile</span>
                    </button>
                    <button className="dropdown-item flex items-center space-x-2 w-full">
                      <Settings size={16} />
                      <span>Settings</span>
                    </button>
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={onLogout}
                      className="dropdown-item flex items-center space-x-2 w-full text-error"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};