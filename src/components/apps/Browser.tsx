import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, RotateCw, Home, Star, Lock, AlertTriangle, X } from 'lucide-react';
import { AppTemplate } from './AppTemplate';
import { useAppStorage } from '../../hooks/useAppStorage';
import { cn } from '../ui/utils';
import { useI18n } from '../../i18n/index';
import { getWebsiteByDomain } from '../websites/registry';
import type { HistoryEntry } from '../websites/types';

export function Browser({ owner }: { owner?: string }) {
  const { t } = useI18n();

  // Persisted state
  const [appState, setAppState] = useAppStorage('browser', {
    url: 'browser://welcome',
    bookmarks: [] as string[],
    history: [] as HistoryEntry[],
  }, owner);

  const [currentUrl, setCurrentUrl] = useState(appState.url);
  const [urlInput, setUrlInput] = useState(appState.url);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const historyRef = useRef<HistoryEntry[]>(appState.history || []);

  // Get current website and parse query parameters
  const [urlPath, queryString] = currentUrl.split('?');
  const currentWebsite = getWebsiteByDomain(urlPath);

  // Parse query parameters
  const params: Record<string, string> = {};
  if (queryString) {
    const searchParams = new URLSearchParams(queryString);
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
  }

  // Update URL input when navigating
  useEffect(() => {
    setUrlInput(currentUrl);
  }, [currentUrl]);

  // Navigate to URL
  const navigate = (url: string) => {
    const website = getWebsiteByDomain(url);
    const finalUrl = website ? website.domain : url;

    setCurrentUrl(finalUrl);
    setAppState((s) => ({ ...s, url: finalUrl }));

    // Add to history
    const historyEntry: HistoryEntry = {
      url: finalUrl,
      title: website?.name || finalUrl,
      timestamp: new Date(),
      favicon: website?.color,
    };

    historyRef.current = [...historyRef.current.slice(0, historyIndex + 1), historyEntry];
    setHistoryIndex(historyRef.current.length - 1);
    setAppState((s) => ({ ...s, history: historyRef.current }));
  };

  // Handle URL bar submission
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      navigate(urlInput.trim());
    }
  };

  // Navigation controls
  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < appState.history.length - 1;

  const goBack = () => {
    if (canGoBack) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentUrl(historyRef.current[newIndex].url);
    }
  };

  const goForward = () => {
    if (canGoForward) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentUrl(historyRef.current[newIndex].url);
    }
  };

  const goHome = () => {
    navigate('browser://welcome');
  };

  const reload = () => {
    // Force re-render by navigating to same URL
    const url = currentUrl;
    setCurrentUrl('');
    setTimeout(() => setCurrentUrl(url), 0);
  };

  const [tabs] = useState([
    { id: 1, title: currentWebsite?.name || t('browser.tabs.welcome'), url: currentUrl, active: true },
  ]);

  const tabBar = (
    <div className="flex items-center w-full gap-1">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={cn(
            "h-8 px-3 rounded-md flex items-center gap-2 min-w-0 max-w-xs transition-colors",
            tab.active ? "bg-white/10" : "hover:bg-white/5"
          )}
        >
          <span className="text-white/80 text-xs truncate flex-1">{tab.title}</span>
          <button className="text-white/40 hover:text-white/80 transition-colors">
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
      <button className="h-8 w-8 flex items-center justify-center rounded-md text-white/60 hover:text-white/90 hover:bg-white/5 transition-colors">
        +
      </button>
    </div>
  );

  // Render security indicator
  const getSecurityIcon = () => {
    if (!currentWebsite) return <Lock className="w-3.5 h-3.5 text-gray-400" />;

    switch (currentWebsite.security) {
      case 'secure':
        return <Lock className="w-3.5 h-3.5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-3.5 h-3.5 text-yellow-600" />;
      case 'insecure':
      case 'phishing':
        return <AlertTriangle className="w-3.5 h-3.5 text-red-600" />;
      default:
        return <Lock className="w-3.5 h-3.5 text-gray-400" />;
    }
  };

  const content = (
    <div className="flex flex-col min-h-full">
      {/* Navigation Bar - Sticky */}
      <div className="sticky top-0 z-10 bg-gray-900/30 backdrop-blur-md border-b border-white/10 flex items-center px-3 py-2 gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={goBack}
            disabled={!canGoBack}
            className={cn(
              "p-1.5 rounded transition-colors",
              canGoBack ? "hover:bg-white/10 text-white/70" : "text-white/30 cursor-not-allowed"
            )}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={goForward}
            disabled={!canGoForward}
            className={cn(
              "p-1.5 rounded transition-colors",
              canGoForward ? "hover:bg-white/10 text-white/70" : "text-white/30 cursor-not-allowed"
            )}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={reload}
            className="p-1.5 hover:bg-white/10 rounded transition-colors text-white/70"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={goHome}
            className="p-1.5 hover:bg-white/10 rounded transition-colors text-white/70"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>

        {/* URL Bar */}
        <form onSubmit={handleUrlSubmit} className="flex-1">
          <div className="flex items-center gap-2 bg-black/20 rounded-lg px-3 py-1.5 border border-white/10 focus-within:ring-2 focus-within:ring-white/20 transition-all">
            {getSecurityIcon()}
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder={t('browser.searchPlaceholder')}
              className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder-white/30"
            />
            <Star className="w-3.5 h-3.5 text-white/50 hover:text-white/80 cursor-pointer transition-colors" />
          </div>
        </form>
      </div>

      {/* Website Content */}
      <div className="flex-1 overflow-y-auto">
        {currentWebsite ? (
          <currentWebsite.component
            domain={currentWebsite.domain}
            onNavigate={navigate}
            params={params}
            owner={owner}
          />
        ) : (
          <div className="min-h-full flex items-center justify-center bg-gray-900 text-white p-8">
            <div className="text-center max-w-md">
              <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">{t('browser.error.pageNotFound')}</h1>
              <p className="text-white/60 mb-6">
                {t('browser.error.pageNotFoundDesc', { url: currentUrl })}
              </p>
              <button
                onClick={goHome}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                {t('browser.error.goHome')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return <AppTemplate toolbar={tabBar} content={content} hasSidebar={false} contentClassName="overflow-y-auto" />;
}

import { AppMenuConfig } from '../../types';

export const browserMenuConfig: AppMenuConfig = {
  menus: ['File', 'Edit', 'View', 'History', 'Bookmarks', 'Window', 'Help'],
  items: {
    'File': [
      { label: 'New Tab', labelKey: 'browser.menu.newTab', shortcut: '⌘T', action: 'new-tab' },
      { label: 'New Window', labelKey: 'menubar.items.newWindow', shortcut: '⌘N', action: 'new-window' },
      { type: 'separator' },
      { label: 'Close Tab', labelKey: 'browser.menu.closeTab', shortcut: '⌘W', action: 'close-tab' }
    ],
    'View': [
      { label: 'Reload', labelKey: 'menubar.items.reload', shortcut: '⌘R', action: 'reload' },
      { label: 'Stop', labelKey: 'browser.menu.stop', shortcut: 'Esc', action: 'stop' },
      { type: 'separator' },
      { label: 'Zoom In', labelKey: 'browser.menu.zoomIn', shortcut: '⌘+', action: 'zoom-in' },
      { label: 'Zoom Out', labelKey: 'browser.menu.zoomOut', shortcut: '⌘-', action: 'zoom-out' }
    ],
    'History': [
      { label: 'Back', labelKey: 'menubar.items.back', shortcut: '⌘[', action: 'back' },
      { label: 'Forward', labelKey: 'menubar.items.forward', shortcut: '⌘]', action: 'forward' },
      { type: 'separator' },
      { label: 'Show Full History', labelKey: 'browser.menu.showFullHistory', shortcut: '⌘Y', action: 'history' }
    ]
  }
};
