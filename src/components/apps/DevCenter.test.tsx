import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DevCenter } from './DevCenter';
import { notify } from '../../lib/notifications';
import { feedback } from '../../lib/soundFeedback';

// Mock dependencies
vi.mock('../../lib/notifications', () => ({
    notify: {
        system: vi.fn(),
    },
}));

vi.mock('../../lib/soundFeedback', () => ({
    feedback: {
        click: vi.fn(),
        hover: vi.fn(),
        folder: vi.fn(),
        windowOpen: vi.fn(),
        windowClose: vi.fn(),
    },
}));

// Mock AppContext
vi.mock('../../components/AppContext', () => ({
    useAppContext: () => ({
        accentColor: '#3b82f6',
    }),
}));

// Mock useThemeColors
vi.mock('../../hooks/useThemeColors', () => ({
    useThemeColors: () => ({
        sidebarBackground: 'rgba(0,0,0,0.5)',
        windowBackground: 'rgba(0,0,0,0.8)',
    }),
}));

// Mock useElementSize
vi.mock('../../hooks/useElementSize', () => ({
    useElementSize: () => [null, { width: 800, height: 600 }],
}));

// Mock useFileSystem
vi.mock('../../components/FileSystemContext', () => ({
    useFileSystem: () => ({
        fileSystem: { id: 'root', name: 'root', type: 'directory', children: [] },
        resetFileSystem: vi.fn(),
    }),
}));

// Mock getStorageStats
vi.mock('../../utils/memory', () => ({
    getStorageStats: () => ({
        softMemory: { keys: 5, bytes: 1024 },
        hardMemory: { keys: 10, bytes: 2048 },
        total: { keys: 15, bytes: 3072 },
    }),
    formatBytes: (bytes: number) => `${bytes} B`,
}));


describe('DevCenter', () => {
    it('renders default dashboard tab', () => {
        render(<DevCenter />);
        expect(screen.getByText('Developer Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Welcome to the Aurora OS Developer Center.')).toBeInTheDocument();
    });

    it('switches to UI & Sounds tab', () => {
        render(<DevCenter />);
        const uiTab = screen.getByText('UI & Sounds');
        fireEvent.click(uiTab);

        expect(screen.getByText('System Notifications')).toBeInTheDocument();
        expect(screen.getByText('Sound Feedback')).toBeInTheDocument();
    });

    it('triggers notifications', () => {
        render(<DevCenter />);
        fireEvent.click(screen.getByText('UI & Sounds'));

        const successBtn = screen.getByText('Success Toast');
        fireEvent.click(successBtn);

        expect(notify.system).toHaveBeenCalledWith('success', 'DevCenter', expect.any(String));
    });

    it('triggers sound feedback', () => {
        render(<DevCenter />);
        fireEvent.click(screen.getByText('UI & Sounds'));

        const clickBtn = screen.getByText('Click');
        fireEvent.click(clickBtn);

        expect(feedback.click).toHaveBeenCalled();
    });

    it('switches to Storage tab', () => {
        render(<DevCenter />);
        const storageTab = screen.getByText('Storage');
        fireEvent.click(storageTab);

        expect(screen.getByText('Storage Inspector')).toBeInTheDocument();
        expect(screen.getByText('Soft Memory (Preferences)')).toBeInTheDocument();
    });
});
