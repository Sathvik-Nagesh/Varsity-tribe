'use client';

import { useThemeStore } from '@/stores/useThemeStore';
import { useUserStore, selectLevel } from '@/stores/useUserStore';
import { Card, Button } from '@/components/ui';
import { IconMoon, IconSun, IconDeviceDesktop, IconBell, IconLock, IconUserEdit } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { PageLayout } from "@/components/layout/PageLayout";

export default function SettingsPage() {
  const { theme, setTheme } = useThemeStore();
  const { currency, setCurrency } = useUserStore();
  const level = useUserStore(selectLevel);

  return (
    <PageLayout>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-8 pb-8"
        >
          <div>
            <h1 className="text-h1 font-bold text-brand-text-primary">Settings</h1>
            <p className="text-brand-text-secondary mt-1">Manage your account preferences and app settings.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Settings Nav */}
            <div className="space-y-1">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-primary/10 text-brand-primary font-medium text-left">
                <IconUserEdit size={20} />
                Profile Settings
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-brand-text-secondary hover:bg-brand-surface-elevated transition-colors text-left">
                <IconDeviceDesktop size={20} />
                Appearance
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-brand-text-secondary hover:bg-brand-surface-elevated transition-colors text-left">
                <IconBell size={20} />
                Notifications
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-brand-text-secondary hover:bg-brand-surface-elevated transition-colors text-left">
                <IconLock size={20} />
                Privacy & Security
              </button>
            </div>

            {/* Settings Content */}
            <div className="md:col-span-2 space-y-6">
              <Card className="p-6 glass-strong">
                <h3 className="text-h3 font-semibold mb-4 text-brand-text-primary">Appearance</h3>
                <div className="grid grid-cols-3 gap-4">
                  <button 
                    onClick={() => setTheme('light')}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${theme === 'light' ? 'border-brand-primary bg-brand-primary/5' : 'border-brand-border hover:border-brand-border-strong'}`}
                  >
                    <IconSun size={24} className={theme === 'light' ? 'text-brand-primary' : 'text-brand-text-secondary'} />
                    <span className={`text-small font-medium ${theme === 'light' ? 'text-brand-primary' : 'text-brand-text-secondary'}`}>Light</span>
                  </button>
                  <button 
                    onClick={() => setTheme('dark')}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${theme === 'dark' ? 'border-brand-primary bg-brand-primary/5' : 'border-brand-border hover:border-brand-border-strong'}`}
                  >
                    <IconMoon size={24} className={theme === 'dark' ? 'text-brand-primary' : 'text-brand-text-secondary'} />
                    <span className={`text-small font-medium ${theme === 'dark' ? 'text-brand-primary' : 'text-brand-text-secondary'}`}>Dark</span>
                  </button>
                  <button 
                    onClick={() => setTheme('system')}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${theme === 'system' ? 'border-brand-primary bg-brand-primary/5' : 'border-brand-border hover:border-brand-border-strong'}`}
                  >
                    <IconDeviceDesktop size={24} className={theme === 'system' ? 'text-brand-primary' : 'text-brand-text-secondary'} />
                    <span className={`text-small font-medium ${theme === 'system' ? 'text-brand-primary' : 'text-brand-text-secondary'}`}>System</span>
                  </button>
                </div>
              </Card>

              <Card className="p-6 glass-strong">
                <h3 className="text-h3 font-semibold mb-4 text-brand-text-primary">Preferences</h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-body font-medium text-brand-text-primary mb-2 block">Global Currency</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value as any)}
                      className="w-full md:w-1/2 rounded-xl border border-brand-border bg-brand-surface p-3 text-brand-text-primary focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                    >
                      <option value="INR">Indian Rupee (INR)</option>
                      <option value="USD">US Dollar (USD)</option>
                      <option value="EUR">Euro (EUR)</option>
                      <option value="GBP">British Pound (GBP)</option>
                    </select>
                    <p className="text-small text-brand-text-tertiary mt-2">
                      This currency will be used to display all monetary values across the app.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 glass-strong">
                <h3 className="text-h3 font-semibold mb-4 text-brand-text-primary">Notification Preferences</h3>
                <div className="space-y-4">
                  {[
                    { title: 'Goal Reminders', desc: 'Get reminded to update your financial goals' },
                    { title: 'Community Updates', desc: 'When someone replies to your post or comment' },
                    { title: 'Event Alerts', desc: 'Reminders for events you have RSVP\'d to' },
                    { title: 'Streak Warnings', desc: 'When you are about to lose your learning streak' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-brand-border/50 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium text-brand-text-primary">{item.title}</p>
                        <p className="text-small text-brand-text-tertiary">{item.desc}</p>
                      </div>
                      <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input type="checkbox" name="toggle" id={`toggle-${i}`} defaultChecked={i !== 1} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-brand-primary transition-transform duration-200 checked:translate-x-6 checked:border-brand-primary" />
                        <label htmlFor={`toggle-${i}`} className="toggle-label block overflow-hidden h-6 rounded-full bg-brand-border cursor-pointer"></label>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="ghost">Cancel</Button>
                <Button variant="primary">Save Changes</Button>
              </div>
            </div>
          </div>
        </motion.div>
      </PageLayout>
    );
}
