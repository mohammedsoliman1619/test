import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store';
import { useTheme } from '../common/ThemeProvider';
import { cn } from '@/lib/utils';
import {
  Monitor,
  Sun,
  Moon,
  Globe,
  Calendar,
  Clock,
  Bell,
  Volume2,
  Accessibility,
  Download,
  Upload,
  Trash2,
  Shield,
  Palette,
  Keyboard,
  Eye,
  Type,
  Zap,
  HardDrive,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' }
];

export function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const { settings, updateSettings, exportData, importData, clearAllData } = useStore();
  const [importFile, setImportFile] = useState<File | null>(null);

  if (!settings) {
    return (
      <div className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    updateSettings({ language: languageCode as any });
  };

  const handleExportData = async () => {
    try {
      await exportData();
      toast({
        title: t('settings.export.success.title', 'Export successful'),
        description: t('settings.export.success.description', 'Your data has been exported successfully.')
      });
    } catch (error) {
      toast({
        title: t('settings.export.error.title', 'Export failed'),
        description: t('settings.export.error.description', 'Failed to export data. Please try again.'),
        variant: 'destructive'
      });
    }
  };

  const handleImportData = async () => {
    if (!importFile) return;

    try {
      await importData(importFile);
      toast({
        title: t('settings.import.success.title', 'Import successful'),
        description: t('settings.import.success.description', 'Your data has been imported successfully.')
      });
    } catch (error) {
      toast({
        title: t('settings.import.error.title', 'Import failed'),
        description: t('settings.import.error.description', 'Failed to import data. Please check the file and try again.'),
        variant: 'destructive'
      });
    }
  };

  const handleClearAllData = async () => {
    if (confirm(t('settings.clear.confirm', 'Are you sure you want to clear all data? This action cannot be undone.'))) {
      try {
        await clearAllData();
        toast({
          title: t('settings.clear.success.title', 'Data cleared'),
          description: t('settings.clear.success.description', 'All data has been cleared successfully.')
        });
      } catch (error) {
        toast({
          title: t('settings.clear.error.title', 'Clear failed'),
          description: t('settings.clear.error.description', 'Failed to clear data. Please try again.'),
          variant: 'destructive'
        });
      }
    }
  };

  return (
    <div className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            {t('pages.settings.title', 'Settings')}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            {t('pages.settings.description', 'Customize your productivity experience')}
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general" className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">{t('settings.tabs.general', 'General')}</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center space-x-2">
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">{t('settings.tabs.appearance', 'Appearance')}</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">{t('settings.tabs.notifications', 'Notifications')}</span>
            </TabsTrigger>
            <TabsTrigger value="accessibility" className="flex items-center space-x-2">
              <Accessibility className="w-4 h-4" />
              <span className="hidden sm:inline">{t('settings.tabs.accessibility', 'Accessibility')}</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">{t('settings.tabs.security', 'Security')}</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center space-x-2">
              <HardDrive className="w-4 h-4" />
              <span className="hidden sm:inline">{t('settings.tabs.data', 'Data')}</span>
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="w-5 h-5" />
                  <span>{t('settings.language.title', 'Language & Region')}</span>
                </CardTitle>
                <CardDescription>
                  {t('settings.language.description', 'Choose your preferred language and regional settings')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">{t('settings.language.select', 'Language')}</Label>
                    <Select value={settings.language} onValueChange={handleLanguageChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.nativeName} ({lang.name})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">{t('settings.date_format.title', 'Date Format')}</Label>
                    <Select 
                      value={settings.dateFormat} 
                      onValueChange={(value) => updateSettings({ dateFormat: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timeFormat">{t('settings.time_format.title', 'Time Format')}</Label>
                    <Select 
                      value={settings.timeFormat} 
                      onValueChange={(value) => updateSettings({ timeFormat: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12h">12-hour</SelectItem>
                        <SelectItem value="24h">24-hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startPage">{t('settings.start_page.title', 'Default Start Page')}</Label>
                    <Select 
                      value={settings.defaultStartPage} 
                      onValueChange={(value) => updateSettings({ defaultStartPage: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tasks">{t('nav.tasks', 'Tasks')}</SelectItem>
                        <SelectItem value="calendar">{t('nav.calendar', 'Calendar')}</SelectItem>
                        <SelectItem value="goals">{t('nav.goals', 'Goals')}</SelectItem>
                        <SelectItem value="reminders">{t('nav.reminders', 'Reminders')}</SelectItem>
                        <SelectItem value="analytics">{t('nav.analytics', 'Analytics')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>{t('settings.working_hours.title', 'Working Hours')}</span>
                </CardTitle>
                <CardDescription>
                  {t('settings.working_hours.description', 'Set your typical working hours for better scheduling')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="workStart">{t('settings.working_hours.start', 'Start Time')}</Label>
                    <Input
                      id="workStart"
                      type="time"
                      value={settings.workingHours.start}
                      onChange={(e) => updateSettings({
                        workingHours: { ...settings.workingHours, start: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workEnd">{t('settings.working_hours.end', 'End Time')}</Label>
                    <Input
                      id="workEnd"
                      type="time"
                      value={settings.workingHours.end}
                      onChange={(e) => updateSettings({
                        workingHours: { ...settings.workingHours, end: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="w-5 h-5" />
                  <span>{t('settings.theme.title', 'Theme')}</span>
                </CardTitle>
                <CardDescription>
                  {t('settings.theme.description', 'Choose your preferred color scheme')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => setTheme('light')}
                    className={cn(
                      "flex flex-col items-center space-y-2 p-4 rounded-lg border-2 transition-colors",
                      theme === 'light' 
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20" 
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    )}
                  >
                    <Sun className="w-6 h-6" />
                    <span className="text-sm font-medium">{t('theme.light', 'Light')}</span>
                  </button>
                  
                  <button
                    onClick={() => setTheme('dark')}
                    className={cn(
                      "flex flex-col items-center space-y-2 p-4 rounded-lg border-2 transition-colors",
                      theme === 'dark' 
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20" 
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    )}
                  >
                    <Moon className="w-6 h-6" />
                    <span className="text-sm font-medium">{t('theme.dark', 'Dark')}</span>
                  </button>
                  
                  <button
                    onClick={() => setTheme('system')}
                    className={cn(
                      "flex flex-col items-center space-y-2 p-4 rounded-lg border-2 transition-colors",
                      theme === 'system' 
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20" 
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    )}
                  >
                    <Monitor className="w-6 h-6" />
                    <span className="text-sm font-medium">{t('theme.system', 'System')}</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>{t('settings.notifications.title', 'Notifications')}</span>
                </CardTitle>
                <CardDescription>
                  {t('settings.notifications.description', 'Control how and when you receive notifications')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableNotifications">
                      {t('settings.notifications.enable', 'Enable Notifications')}
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('settings.notifications.enable_description', 'Receive notifications for reminders and tasks')}
                    </p>
                  </div>
                  <Switch
                    id="enableNotifications"
                    checked={settings.enableNotifications}
                    onCheckedChange={(checked) => updateSettings({ enableNotifications: checked })}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableSounds">
                      {t('settings.notifications.sounds', 'Sound Effects')}
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('settings.notifications.sounds_description', 'Play sounds for notifications and actions')}
                    </p>
                  </div>
                  <Switch
                    id="enableSounds"
                    checked={settings.enableSounds}
                    onCheckedChange={(checked) => updateSettings({ enableSounds: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Accessibility Settings */}
          <TabsContent value="accessibility" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Accessibility className="w-5 h-5" />
                  <span>{t('settings.accessibility.title', 'Accessibility')}</span>
                </CardTitle>
                <CardDescription>
                  {t('settings.accessibility.description', 'Customize the interface for better accessibility')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="reducedMotion">
                      {t('settings.accessibility.reduced_motion', 'Reduced Motion')}
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('settings.accessibility.reduced_motion_description', 'Minimize animations and transitions')}
                    </p>
                  </div>
                  <Switch
                    id="reducedMotion"
                    checked={settings.accessibility.reducedMotion}
                    onCheckedChange={(checked) => updateSettings({
                      accessibility: { ...settings.accessibility, reducedMotion: checked }
                    })}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="fontSize">{t('settings.accessibility.font_size', 'Font Size')}</Label>
                  <Select 
                    value={settings.accessibility.fontSize} 
                    onValueChange={(value) => updateSettings({
                      accessibility: { ...settings.accessibility, fontSize: value as any }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">{t('settings.accessibility.font_size_small', 'Small')}</SelectItem>
                      <SelectItem value="medium">{t('settings.accessibility.font_size_medium', 'Medium')}</SelectItem>
                      <SelectItem value="large">{t('settings.accessibility.font_size_large', 'Large')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="highContrast">
                      {t('settings.accessibility.high_contrast', 'High Contrast')}
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('settings.accessibility.high_contrast_description', 'Increase contrast for better visibility')}
                    </p>
                  </div>
                  <Switch
                    id="highContrast"
                    checked={settings.accessibility.highContrast}
                    onCheckedChange={(checked) => updateSettings({
                      accessibility: { ...settings.accessibility, highContrast: checked }
                    })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>{t('settings.security.title', 'Security')}</span>
                </CardTitle>
                <CardDescription>
                  {t('settings.security.description', 'Protect your data with additional security measures')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="pinLock">
                      {t('settings.security.pin_lock', 'PIN Lock')}
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('settings.security.pin_lock_description', 'Require a PIN to access the application')}
                    </p>
                  </div>
                  <Switch
                    id="pinLock"
                    checked={settings.pinLock.enabled}
                    onCheckedChange={(checked) => updateSettings({
                      pinLock: { ...settings.pinLock, enabled: checked }
                    })}
                  />
                </div>
                
                {settings.pinLock.enabled && (
                  <div className="space-y-2">
                    <Label htmlFor="pin">{t('settings.security.pin', 'PIN')}</Label>
                    <Input
                      id="pin"
                      type="password"
                      placeholder={t('settings.security.pin_placeholder', 'Enter your PIN')}
                      value={settings.pinLock.pin || ''}
                      onChange={(e) => updateSettings({
                        pinLock: { ...settings.pinLock, pin: e.target.value }
                      })}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Management */}
          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <HardDrive className="w-5 h-5" />
                  <span>{t('settings.data.title', 'Data Management')}</span>
                </CardTitle>
                <CardDescription>
                  {t('settings.data.description', 'Backup, restore, and manage your data')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="autoBackup">
                        {t('settings.data.auto_backup', 'Auto Backup')}
                      </Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('settings.data.auto_backup_description', 'Automatically backup your data')}
                      </p>
                    </div>
                    <Switch
                      id="autoBackup"
                      checked={settings.backup.autoBackup}
                      onCheckedChange={(checked) => updateSettings({
                        backup: { ...settings.backup, autoBackup: checked }
                      })}
                    />
                  </div>
                  
                  {settings.backup.autoBackup && (
                    <div className="space-y-2">
                      <Label htmlFor="backupFrequency">{t('settings.data.backup_frequency', 'Backup Frequency')}</Label>
                      <Select 
                        value={settings.backup.backupFrequency} 
                        onValueChange={(value) => updateSettings({
                          backup: { ...settings.backup, backupFrequency: value as any }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">{t('settings.data.frequency_daily', 'Daily')}</SelectItem>
                          <SelectItem value="weekly">{t('settings.data.frequency_weekly', 'Weekly')}</SelectItem>
                          <SelectItem value="monthly">{t('settings.data.frequency_monthly', 'Monthly')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{t('settings.data.export_title', 'Export Data')}</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('settings.data.export_description', 'Download all your data as a JSON file')}
                      </p>
                    </div>
                    <Button onClick={handleExportData} className="flex items-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>{t('settings.data.export_button', 'Export')}</span>
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{t('settings.data.import_title', 'Import Data')}</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('settings.data.import_description', 'Import data from a JSON backup file')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="file"
                        accept=".json"
                        onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                        className="hidden"
                        id="import-file"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => document.getElementById('import-file')?.click()}
                        className="flex items-center space-x-2"
                      >
                        <FileText className="w-4 h-4" />
                        <span>{t('settings.data.select_file', 'Select File')}</span>
                      </Button>
                      <Button 
                        onClick={handleImportData} 
                        disabled={!importFile}
                        className="flex items-center space-x-2"
                      >
                        <Upload className="w-4 h-4" />
                        <span>{t('settings.data.import_button', 'Import')}</span>
                      </Button>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{t('settings.data.clear_title', 'Clear All Data')}</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('settings.data.clear_description', 'Permanently delete all your data. This cannot be undone.')}
                    </p>
                  </div>
                  <Button 
                    onClick={handleClearAllData} 
                    variant="destructive"
                    className="flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{t('settings.data.clear_button', 'Clear All')}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
