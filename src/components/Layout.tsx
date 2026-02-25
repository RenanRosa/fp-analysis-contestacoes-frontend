import { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Upload,
    History,
    LogOut,
    Building2,
    ChevronRight,
    Menu,
    Moon,
    Sun,
    MoreVertical,
    Sparkles,
} from 'lucide-react';
import './Layout.css';

const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/chat', icon: Sparkles, label: 'FP Legal AI' },
    { to: '/upload', icon: Upload, label: 'Nova Petição' },
    { to: '/history', icon: History, label: 'Histórico' },
];

export default function Layout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [isCollapsed, setIsCollapsed] = useState(() => localStorage.getItem('sidebar_collapsed') === 'true');
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        localStorage.setItem('sidebar_collapsed', isCollapsed.toString());
    }, [isCollapsed]);

    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    const toggleSidebar = () => setIsCollapsed(prev => !prev);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="layout">
            {/* Sidebar */}
            <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-brand">
                    <div className="brand-logo-wrapper">
                        <img
                            src={
                                isCollapsed
                                    ? (theme === 'dark' ? '/apenas_logo_fundo_preto.png' : '/apenas_logo_fundo_branco.png')
                                    : (theme === 'dark' ? '/logo_fundo_preto.png' : '/logo_fundo_branco.png')
                            }
                            alt="Logo"
                            className="brand-logo"
                        />
                    </div>
                    <div className="brand-sub">Contestações Jurídicas</div>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `nav-item ${isActive ? 'nav-item-active' : ''}`
                            }
                        >
                            <Icon size={18} />
                            <span>{label}</span>
                            <ChevronRight size={14} className="nav-chevron" />
                        </NavLink>
                    ))}
                </nav>

                <div className={`sidebar-footer ${isCollapsed ? 'collapsed' : ''}`} ref={menuRef}>
                    {isProfileMenuOpen && (
                        <div className="profile-menu-popup">
                            <div className="profile-menu-header">
                                <div className="user-email">{user?.user_name}</div>
                            </div>
                            <div className="profile-menu-divider"></div>

                            <button className="profile-menu-item" onClick={() => { toggleTheme(); setIsProfileMenuOpen(false); }}>
                                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                                <span>{theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}</span>
                            </button>

                            <button className="profile-menu-item" onClick={() => { toggleSidebar(); setIsProfileMenuOpen(false); }}>
                                <Menu size={16} />
                                <span>{isCollapsed ? 'Expandir Menu' : 'Recolher Menu'}</span>
                            </button>

                            <div className="profile-menu-divider"></div>

                            <button className="profile-menu-item text-danger" onClick={() => { handleLogout(); setIsProfileMenuOpen(false); }}>
                                <LogOut size={16} />
                                <span>Sair</span>
                            </button>
                        </div>
                    )}

                    <div
                        className={`user-profile-button ${isProfileMenuOpen ? 'active' : ''}`}
                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    >
                        <div className="user-info">
                            <div className="user-avatar">
                                {user?.user_name.charAt(0).toUpperCase()}
                            </div>
                            {!isCollapsed && (
                                <div className="user-details">
                                    <div className="user-name">{user?.user_name}</div>
                                    <div className="user-company">
                                        <Building2 size={11} />
                                        {user?.company_name}
                                    </div>
                                </div>
                            )}
                        </div>
                        {!isCollapsed && (
                            <MoreVertical size={16} className="profile-menu-icon" />
                        )}
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <main className={`main-content ${isCollapsed ? 'collapsed' : ''}`}>
                <Outlet />
            </main>
        </div>
    );
}
