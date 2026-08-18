import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Key, Bell, ChevronRight, LogOut, Moon, HelpCircle, Info } from 'lucide-react';

export const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const name = user?.fullName || user?.username || 'User';
  const role = user?.role || 'SUBSCRIBER';
  const email = user?.email || 'user@example.com';

  const initials = name.split(' ').map((n: string) => n[0]).join('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuSections = [
    {
      title: 'Account',
      items: [
        { icon: Shield, label: 'Security Settings', desc: 'PIN, Password, Trusted Devices', action: () => {} },
        { icon: Key, label: 'API Keys', desc: role === 'VENDOR' ? 'Manage your API keys' : 'Upgrade to Vendor first', action: () => {} },
        { icon: Bell, label: 'Notifications', desc: 'Manage alerts & preferences', action: () => {} },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { icon: Moon, label: 'Appearance', desc: 'Dark Mode (Coming Soon)', action: () => {} },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help & FAQ', desc: 'Get answers to common questions', action: () => {} },
        { icon: Info, label: 'About Depayhub', desc: 'Version 1.0.0', action: () => {} },
      ]
    }
  ];

  return (
    <>
      <header className="p-6 bg-surface rounded-b-3xl shadow-sm">
        <h1 className="text-xl font-bold text-primary mb-6">Profile</h1>

        {/* User Card */}
        <div className="flex items-center gap-4 mb-2">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xl font-bold">
            {initials}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                role === 'VENDOR' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
              }`}>
                {role}
              </span>
              <span className="text-xs text-gray-400">{email}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6 space-y-6">
        {menuSections.map((section, sIdx) => (
          <div key={sIdx}>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{section.title}</h3>
            <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100 shadow-sm overflow-hidden">
              {section.items.map((item, iIdx) => (
                <button
                  key={iIdx}
                  onClick={item.action}
                  className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{item.label}</p>
                      <p className="text-[11px] text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Logout */}
        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 font-semibold rounded-2xl hover:bg-red-100 transition mt-4">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>

        <p className="text-center text-[10px] text-gray-300 mt-4">Depayhub v1.0.0 • © 2026</p>
      </main>
    </>
  );
};
