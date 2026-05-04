import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard, HeartPulse, Globe } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';


export default function Navbar() {
  const { t } = useTranslation();
  
  const navLinks = [
    { label: t('nav.treatments'), href: '/treatments' },
    { label: t('nav.hospitals'), href: '/hospitals' },
    { label: t('nav.doctors'), href: '/doctors' },
    { label: t('nav.packages'), href: '/packages' },
    { label: t('nav.why_india'), href: '/why-india' },
    { label: t('nav.blog'), href: '/blog' },
  ];
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const { isAuthenticated, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLangDropdownOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setDropdownOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-white/80 backdrop-blur-xl shadow-premium py-3' 
        : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              scrolled ? 'bg-primary-600 shadow-lg shadow-primary-500/20' : 'bg-white shadow-xl shadow-black/5'
            }`}>
              <HeartPulse className={`w-6 h-6 transition-colors duration-300 ${
                scrolled ? 'text-white' : 'text-primary-600'
              }`} />
            </div>
            <span className={`text-xl font-extrabold tracking-tight transition-colors duration-300 ${
              scrolled ? 'text-dark' : 'text-dark'
            }`}>
              Medi<span className="text-primary-500">Trip</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `text-sm font-bold tracking-wide uppercase transition-all duration-300 relative group
                  ${isActive ? 'text-primary-600' : 'text-slate-600 hover:text-dark'}`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary-500 transition-all duration-300 
                      ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Auth & Language */}
          <div className="hidden md:flex items-center gap-6">
            
            {/* Language Switcher */}
            <div className="relative">
              <button 
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors"
              >
                <Globe className="w-5 h-5" />
                <span className="text-xs font-bold uppercase">{i18n.language}</span>
              </button>
              {langDropdownOpen && (
                <div className="absolute right-0 mt-3 w-32 bg-white rounded-2xl shadow-2xl py-2 border border-slate-100 z-50">
                  <button onClick={() => changeLanguage('en')} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 font-bold text-dark">English</button>
                  <button onClick={() => changeLanguage('ar')} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 font-bold text-dark">العربية</button>
                  <button onClick={() => changeLanguage('hi')} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 font-bold text-dark">हिन्दी</button>
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 group p-1 pr-3 rounded-full hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                >
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold border-2 border-white shadow-sm overflow-hidden">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      profile?.full_name?.[0]?.toUpperCase() ?? 'U'
                    )}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-bold text-dark leading-none">{profile?.full_name?.split(' ')[0]}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Patient Account</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl py-2 border border-slate-100 z-50 animate-in fade-in zoom-in duration-200">
                    <div className="px-4 py-3 border-b border-slate-50 mb-1">
                      <p className="text-sm font-bold text-dark">{profile?.full_name}</p>
                      <p className="text-xs text-slate-500 truncate">{profile?.email}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-primary-600 hover:bg-primary-50 transition-all"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link
                      to="/dashboard/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-primary-600 hover:bg-primary-50 transition-all"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User className="w-4 h-4" /> Edit Profile
                    </Link>
                    <div className="h-px bg-slate-50 my-1" />
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-danger hover:bg-red-50 transition-all"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-dark tracking-wide uppercase">
                  Log In
                </Link>
                <Link to="/signup" className="btn-primary !px-6 !py-2.5 !text-sm !rounded-full shadow-none">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden p-2 rounded-xl transition-colors ${scrolled ? 'hover:bg-slate-100' : 'hover:bg-white/10'}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 top-[64px] bg-white z-40 animate-in slide-in-from-right duration-300">
          <div className="flex flex-col p-6 gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `px-6 py-4 rounded-2xl text-lg font-bold transition-all ${
                    isActive ? 'bg-primary-50 text-primary-600' : 'text-slate-600'
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <div className="h-px bg-slate-100 my-4" />
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="px-6 py-4 text-lg font-bold text-slate-600" onClick={() => setIsOpen(false)}>
                  Dashboard
                </Link>
                <button onClick={handleSignOut} className="px-6 py-4 text-lg font-bold text-danger text-left">
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid gap-4 mt-4">
                <Link to="/login" className="btn-secondary justify-center py-4" onClick={() => setIsOpen(false)}>
                  Log In
                </Link>
                <Link to="/signup" className="btn-primary justify-center py-4" onClick={() => setIsOpen(false)}>
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
