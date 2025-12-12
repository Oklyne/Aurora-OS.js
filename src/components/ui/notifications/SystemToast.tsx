
import { CircleCheck, FileWarning, TriangleAlert } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';

interface SystemToastProps {
    type: 'success' | 'warning' | 'error';
    source: string;
    message: string;
}

export function SystemToast({ type, source, message }: SystemToastProps) {
    const { notificationBackground, blurStyle } = useThemeColors();

    const icons = {
        success: <CircleCheck className="w-5 h-5 text-green-500" />,
        warning: <TriangleAlert className="w-5 h-5 text-yellow-500" />,
        error: <FileWarning className="w-5 h-5 text-red-500" />,
    };

    const borderColors = {
        success: 'border-l-green-500',
        warning: 'border-l-yellow-500',
        error: 'border-l-red-500',
    };

    return (
        <div
            className={`flex items-start gap-3 w-full p-4 rounded-lg border border-white/10 shadow-lg ${borderColors[type]} border-l-4 transition-all duration-300`}
            style={{
                backgroundColor: notificationBackground,
                ...blurStyle
            }}
        >
            <div className="mt-0.5">{icons[type]}</div>
            <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-white/50 uppercase tracking-wider">
                    {source}
                </span>
                <p className="text-sm font-medium text-white leading-tight">
                    {message}
                </p>
            </div>
        </div>
    );
}
