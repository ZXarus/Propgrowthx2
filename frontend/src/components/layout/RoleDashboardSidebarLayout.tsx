import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  BarChart3,
  Home,
  DollarSign,
  FileText,
  HelpCircle,
  Settings,
  LogOut,
  User,
  X,
} from 'lucide-react';

type RoleDashboardSidebarLayoutProps = {
  children: React.ReactNode;
  activeItem?: string;
};

const ownerNavItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-bar', path: '/dashboard-nav' },
  { id: 'properties', label: 'Properties', icon: 'fa-building', path: '/properties-manage' },
  { id: 'payments', label: 'Payments', icon: 'fa-receipt', path: '/payments' },
  { id: 'support', label: 'Support', icon: 'fa-headset', path: '/contact' },
  { id: 'complaints', label: 'Complaints', icon: 'fa-folder', path: '/dashboard/owner/complaints' },
  { id: 'profile', label: 'Profile', icon: 'fa-user', path: '/profile' },
  { id: 'settings', label: 'Settings', icon: 'fa-cog', path: '/profile#settings' },
];

const RoleDashboardSidebarLayout = ({ children, activeItem = 'settings' }: RoleDashboardSidebarLayoutProps) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isOwner = sessionStorage.getItem('role') === 'owner';

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const ownerMobileGoTo = (path: string) => {
    setSidebarOpen(false);
    navigate(path);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {isOwner ? (
        <>
          {!sidebarOpen && (
            <button
              className="md:hidden fixed top-3 left-3 z-50 w-10 h-10 flex items-center justify-center
                bg-white border border-gray-200 rounded-xl shadow-md hover:bg-gray-50 transition-all duration-200"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <i className="fas fa-bars text-gray-700 text-sm"></i>
            </button>
          )}

          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <aside
            className={`md:hidden fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 z-50
              flex flex-col transform transition-transform duration-300 ease-in-out
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
          >
            <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-md overflow-hidden shadow-sm flex-shrink-0">
                <img src="/logo.png" alt="PropGrowthX Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-semibold text-gray-900 text-base">PropGrowthX</span>
              <button onClick={() => setSidebarOpen(false)} className="ml-auto p-1.5 rounded-md hover:bg-gray-50 text-gray-500" aria-label="Close menu">
                <i className="fas fa-times text-sm"></i>
              </button>
            </div>
            <nav className="px-2 py-4 flex-1 overflow-y-auto">
              {ownerNavItems.map((item) => (
                <OwnerMobileNavItem
                  key={item.id}
                  label={item.label}
                  icon={item.icon}
                  active={item.id === activeItem}
                  onClick={() => ownerMobileGoTo(item.path)}
                />
              ))}
              <OwnerMobileNavItem
                label="Logout"
                icon="fa-sign-out-alt"
                onClick={() => { sessionStorage.clear(); window.location.href = '/'; }}
              />
            </nav>
            <div className="px-3 py-4 border-t border-gray-100">
              <div className="text-xs text-gray-500">© {new Date().getFullYear()} PropGrowthX</div>
            </div>
          </aside>

          <aside
            className={`hidden md:flex flex-col flex-shrink-0 bg-white border-r border-gray-100 h-screen sticky top-0 z-40
              transition-all duration-200 ease-in-out ${sidebarOpen ? 'w-64' : 'w-20'}`}
            aria-label="Sidebar"
          >
            <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
              <div className="w-12 h-12 rounded-md overflow-hidden shadow-sm flex-shrink-0">
                <img src="/logo.png" alt="PropGrowthX Logo" className="w-full h-full object-contain" />
              </div>
              {sidebarOpen && <span className="font-semibold text-gray-900 text-lg">PropGrowthX</span>}
              <button
                onClick={() => setSidebarOpen((s) => !s)}
                className="ml-auto bg-transparent p-2 rounded-md hover:bg-gray-50"
                aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              >
                <i className={`fas ${sidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'} text-gray-600 text-sm`}></i>
              </button>
            </div>
            <nav className="px-2 py-4 flex-1 overflow-y-auto">
              {ownerNavItems.map((item) => (
                <OwnerNavItem
                  key={item.id}
                  label={item.label}
                  icon={item.icon}
                  collapsed={!sidebarOpen}
                  active={item.id === activeItem}
                  onClick={() => navigate(item.path)}
                />
              ))}
              <OwnerNavItem
                label="Logout"
                icon="fa-sign-out-alt"
                collapsed={!sidebarOpen}
                onClick={() => { sessionStorage.clear(); window.location.href = '/'; }}
              />
            </nav>
            <div className="px-3 py-4 border-t border-gray-100">
              {sidebarOpen
                ? <div className="text-xs text-gray-500">© {new Date().getFullYear()} PropGrowthX</div>
                : <div className="text-center text-xs text-gray-400">©PG</div>
              }
            </div>
          </aside>
        </>
      ) : (
        <>
          <button
            className="md:hidden fixed top-3 left-3 z-50 w-10 h-10 flex items-center justify-center
              bg-white border border-gray-200 rounded-xl shadow-md
              transition-all duration-200 hover:bg-gray-50"
            style={{ display: sidebarOpen ? 'none' : undefined }}
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>

          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/40 z-30 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <aside
            className={`md:hidden fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-40
              flex flex-col transform transition-transform duration-300 ease-in-out
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
          >
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="Logo" className="w-8 h-8 flex-shrink-0" />
                <span className="text-base font-bold text-gray-900 whitespace-nowrap">PropGrowthX</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Close menu">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
              <SidebarItem icon={BarChart3} label="Dashboard" onClick={() => { navigate('/dashboard/tenant'); setSidebarOpen(false); }} sidebarOpen />
              <SidebarItem icon={Home} label="My Properties" onClick={() => { navigate('/properties'); setSidebarOpen(false); }} sidebarOpen />
              <SidebarItem icon={DollarSign} label="Transactions" onClick={() => { navigate('/dashboard/tenant/transactions'); setSidebarOpen(false); }} sidebarOpen />
              <SidebarItem icon={FileText} label="Complaints" onClick={() => { navigate('/dashboard/tenant/complaints'); setSidebarOpen(false); }} sidebarOpen />
            </nav>
            <div className="px-2 py-4 border-t border-gray-200 space-y-1">
              <SidebarItem icon={User} label="Profile" onClick={() => { navigate('/profile'); setSidebarOpen(false); }} sidebarOpen />
              <SidebarItem icon={HelpCircle} label="Support" onClick={() => { navigate('/dashboard/tenant/support'); setSidebarOpen(false); }} sidebarOpen />
              <SidebarItem icon={Settings} label="Settings" active={activeItem === 'settings'} onClick={() => { navigate('/settings'); setSidebarOpen(false); }} sidebarOpen />
              <SidebarItem icon={LogOut} label="Logout" onClick={() => { sessionStorage.clear(); window.location.href = '/'; }} sidebarOpen />
            </div>
          </aside>

          <aside
            className={`hidden md:flex ${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 z-40 flex-col md:relative flex-shrink-0`}
          >
            <div className="flex items-center justify-between h-20 px-4 border-b border-gray-200">
              {sidebarOpen ? (
                <div className="flex items-center gap-3 flex-1">
                  <img src="/logo.png" alt="Logo" className="w-10 h-10 flex-shrink-0" />
                  <span className="text-lg font-bold text-gray-900 whitespace-nowrap">PropGrowthX</span>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Expand sidebar">
                    <Menu className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              )}
              {sidebarOpen && (
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-2" aria-label="Toggle sidebar">
                  <Menu className="w-5 h-5 text-gray-600" />
                </button>
              )}
            </div>
            <nav className="flex-1 px-2 py-6 space-y-2 overflow-y-auto">
              <SidebarItem icon={BarChart3} label="Dashboard" onClick={() => navigate('/dashboard/tenant')} sidebarOpen={sidebarOpen} />
              <SidebarItem icon={Home} label="My Properties" onClick={() => navigate('/properties')} sidebarOpen={sidebarOpen} />
              <SidebarItem icon={DollarSign} label="Transactions" onClick={() => navigate('/dashboard/tenant/transactions')} sidebarOpen={sidebarOpen} />
              <SidebarItem icon={FileText} label="Complaints" onClick={() => navigate('/dashboard/tenant/complaints')} sidebarOpen={sidebarOpen} />
            </nav>
            <div className="px-2 py-4 border-t border-gray-200 space-y-2">
              <SidebarItem icon={User} label="Profile" onClick={() => navigate('/profile')} sidebarOpen={sidebarOpen} />
              <SidebarItem icon={HelpCircle} label="Support" onClick={() => navigate('/dashboard/tenant/support')} sidebarOpen={sidebarOpen} />
              <SidebarItem icon={Settings} label="Settings" active={activeItem === 'settings'} onClick={() => navigate('/settings')} sidebarOpen={sidebarOpen} />
              <SidebarItem icon={LogOut} label="Logout" onClick={() => { sessionStorage.clear(); window.location.href = '/'; }} sidebarOpen={sidebarOpen} />
            </div>
          </aside>
        </>
      )}

      <main className="flex-1 overflow-y-auto min-w-0 transition-all duration-300">
        {children}
      </main>
    </div>
  );
};

function OwnerNavItem({ label, icon, collapsed = false, active = false, onClick }: { label: string; icon: string; collapsed?: boolean; active?: boolean; onClick?: () => void }) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-md transition-colors duration-150
        ${active ? 'bg-red-50' : 'hover:bg-gray-50'}`}
      aria-label={label}
      title={collapsed ? label : undefined}
      onClick={onClick}
    >
      <span className={`w-8 h-8 flex items-center justify-center rounded-md flex-shrink-0 ${active ? 'bg-red-100' : 'bg-gray-50'}`}>
        <i className={`fas ${icon} text-sm ${active ? 'text-red-600' : 'text-gray-600'}`}></i>
      </span>
      {!collapsed && (
        <span className={`text-sm font-medium ${active ? 'text-red-600 font-semibold' : 'text-gray-900'}`}>{label}</span>
      )}
    </button>
  );
}

function OwnerMobileNavItem({ label, icon, active = false, onClick }: { label: string; icon: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-md transition-colors duration-150
        ${active ? 'bg-red-50' : 'hover:bg-gray-50'}`}
      aria-label={label}
    >
      <span className={`w-8 h-8 flex items-center justify-center rounded-md flex-shrink-0 ${active ? 'bg-red-100' : 'bg-gray-50'}`}>
        <i className={`fas ${icon} text-sm ${active ? 'text-red-600' : 'text-gray-600'}`}></i>
      </span>
      <span className={`text-sm font-medium ${active ? 'text-red-600 font-semibold' : 'text-gray-700'}`}>{label}</span>
    </button>
  );
}

const SidebarItem = ({
  icon: Icon,
  label,
  active = false,
  onClick,
  sidebarOpen = true,
}: {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
  sidebarOpen?: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 text-base ${
        active ? 'bg-red-50 text-red-600 font-semibold' : 'text-gray-700 hover:bg-gray-50 font-medium'
      }`}
      title={!sidebarOpen ? label : ''}
    >
      <Icon className="w-6 h-6 flex-shrink-0" />
      {sidebarOpen && <span>{label}</span>}
    </button>
  );
};

export default RoleDashboardSidebarLayout;