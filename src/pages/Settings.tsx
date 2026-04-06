import React from 'react';
import { User, Lock, Palette, Bell, Shield, Moon, Sun, Monitor, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Card, Button, Input } from '@/components/ui/Common';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import { toast } from 'sonner';

export default function Settings() {
  const { user, updateUser, logout } = useStore();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = React.useState('profile');
  const [name, setName] = React.useState(user?.name || '');
  const [theme, setTheme] = React.useState(() => 
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );
  const [notifications, setNotifications] = React.useState({
    email: true,
    push: true,
    sms: false
  });

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name });
    toast.success('Profile updated successfully');
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Password updated successfully');
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const toggleTheme = (newTheme: string) => {
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    toast.success(`Theme switched to ${newTheme}`);
  };

  const sections = [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'security', icon: Lock, label: 'Security' },
    { id: 'appearance', icon: Palette, label: 'Appearance' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'privacy', icon: Shield, label: 'Privacy' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-text-muted mt-1">Manage your account and app preferences.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1 space-y-1">
          {sections.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSection === item.id ? 'bg-primary/10 text-primary' : 'text-text-muted hover:bg-surface hover:text-text-primary'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </aside>

        <div className="md:col-span-3 space-y-6">
          {activeSection === 'profile' && (
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Profile Information
              </h3>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Full Name</label>
                  <Input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Enter your name" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Email Address</label>
                  <Input value={user?.email || "user@example.com"} disabled className="bg-surface/50 opacity-70" />
                  <p className="text-xs text-text-muted">Email cannot be changed.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Preferred Currency</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => updateUser({ currency: 'INR' })}
                      className={cn(
                        "px-4 py-2 rounded-lg border-2 text-sm font-bold transition-all",
                        user?.currency === 'INR' ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-border/80 text-text-muted"
                      )}
                    >
                      ₹ Rupees (INR)
                    </button>
                    <button
                      type="button"
                      onClick={() => updateUser({ currency: 'USD' })}
                      className={cn(
                        "px-4 py-2 rounded-lg border-2 text-sm font-bold transition-all",
                        user?.currency === 'USD' ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-border/80 text-text-muted"
                      )}
                    >
                      $ Dollars (USD)
                    </button>
                  </div>
                </div>
                <Button type="submit">Save Changes</Button>
              </form>
            </Card>
          )}

          {activeSection === 'security' && (
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-danger" />
                Change Password
              </h3>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Current Password</label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">New Password</label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Confirm New Password</label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <Button variant="secondary">Update Password</Button>
              </form>
            </Card>
          )}

          {activeSection === 'appearance' && (
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5 text-accent" />
                Appearance
              </h3>
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-text-secondary">Theme Mode</label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: 'light', icon: Sun, label: 'Light' },
                      { id: 'dark', icon: Moon, label: 'Dark' },
                      { id: 'system', icon: Monitor, label: 'System' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => toggleTheme(t.id)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                          theme === t.id ? 'border-primary bg-primary/5' : 'border-border hover:border-border/80'
                        }`}
                      >
                        <t.icon className={`w-6 h-6 ${theme === t.id ? 'text-primary' : 'text-text-muted'}`} />
                        <span className={`text-xs font-bold ${theme === t.id ? 'text-primary' : 'text-text-muted'}`}>{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-border/30 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm">Compact Mode</p>
                    <p className="text-xs text-text-muted">Reduce spacing to show more content.</p>
                  </div>
                  <div className="w-10 h-5 bg-surface-elevated rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-3 h-3 bg-text-muted rounded-full" />
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeSection === 'notifications' && (
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-warning" />
                Notifications
              </h3>
              <div className="space-y-4">
                {[
                  { id: 'email', label: 'Email Notifications', desc: 'Receive daily market summaries via email.' },
                  { id: 'push', label: 'Push Notifications', desc: 'Get instant alerts on your mobile device.' },
                  { id: 'sms', label: 'SMS Alerts', desc: 'Receive critical account alerts via text.' },
                ].map((n) => (
                  <div key={n.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-elevated transition-colors">
                    <div>
                      <p className="font-medium text-sm">{n.label}</p>
                      <p className="text-xs text-text-muted">{n.desc}</p>
                    </div>
                    <button 
                      onClick={() => setNotifications(prev => ({ ...prev, [n.id]: !prev[n.id as keyof typeof notifications] }))}
                      className={cn(
                        "w-10 h-5 rounded-full relative transition-colors",
                        notifications[n.id as keyof typeof notifications] ? "bg-primary" : "bg-surface-elevated"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
                        notifications[n.id as keyof typeof notifications] ? "right-1" : "left-1"
                      )} />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeSection === 'privacy' && (
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-success" />
                Privacy & Data
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-border/50 space-y-3">
                  <p className="text-sm font-medium">Data Sharing</p>
                  <p className="text-xs text-text-muted">Allow InvestIQ to share anonymized data with partners to improve AI insights.</p>
                  <Button variant="secondary" size="sm">Manage Sharing</Button>
                </div>
                <div className="p-4 rounded-lg border border-border/50 space-y-3">
                  <p className="text-sm font-medium">Account Visibility</p>
                  <p className="text-xs text-text-muted">Make your portfolio public to share with friends.</p>
                  <Button variant="secondary" size="sm">Set to Private</Button>
                </div>
              </div>
            </Card>
          )}

          {/* Logout Section - Always visible or at bottom */}
          <Card className="p-6 border-danger/20 bg-danger/5">
            <h3 className="text-lg font-bold mb-2 text-danger">Danger Zone</h3>
            <p className="text-sm text-text-muted mb-6">Once you log out, you will need to sign in again to access your portfolio.</p>
            <Button variant="danger" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Log Out of InvestIQ
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
