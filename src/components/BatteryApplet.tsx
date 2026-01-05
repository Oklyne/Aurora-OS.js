import { Battery, BatteryCharging } from 'lucide-react';
import { useState } from 'react';
import { useAppStorage } from '../hooks/useAppStorage';
import { useBattery } from '../hooks/useBattery';
import { useThemeColors } from '../hooks/useThemeColors';
import { useAppContext } from './AppContext';
import { CustomSwitch } from './ui/custom-switch';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from './ui/utils';

export function BatteryApplet() {
    const batteryInfo = useBattery();
    const { disableShadows, reduceMotion, accentColor } = useAppContext();
    const { blurStyle, getBackgroundColor } = useThemeColors();
    const [isOpen, setIsOpen] = useState(false);
    const [showPercentage, setShowPercentage] = useAppStorage('battery-show-percentage', true);

    // Hide component if no battery (desktop PC)
    if (batteryInfo === null) {
        return null;
    }

    const { level, charging } = batteryInfo;
    const percentage = Math.round(level * 100);

    // Select icon based on state (simplified to match design)
    const BatteryIcon = charging ? BatteryCharging : Battery;

    // Color based on level (more subtle to match design)
    const getBatteryColor = (): string => {
        if (charging) {
            return 'text-green-400';
        }
        if (level <= 0.2) {
            return 'text-red-400';
        }
        if (level <= 0.5) {
            return 'text-yellow-400';
        }
        // By default, use button color (text-white/70 or text-white)
        return '';
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <button
                    className={cn(
                        "transition-colors flex items-center gap-1.5",
                        isOpen ? 'text-white' : 'text-white/70 hover:text-white'
                    )}
                >
                    <BatteryIcon 
                        className={cn(
                            "w-4 h-4",
                            getBatteryColor() || (isOpen ? 'text-white' : 'text-white/70')
                        )} 
                    />
                    {showPercentage && (
                        <span className="text-xs font-medium">{percentage}%</span>
                    )}
                </button>
            </PopoverTrigger>

            <PopoverContent
                className={cn(
                    "w-80 p-0 overflow-hidden border-white/20 rounded-2xl",
                    !disableShadows ? 'shadow-2xl' : 'shadow-none',
                    reduceMotion ? 'animate-none! duration-0!' : ''
                )}
                style={{
                    background: getBackgroundColor(0.8),
                    ...blurStyle,
                }}
                align="end"
                sideOffset={12}
            >
                {/* Header */}
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <BatteryIcon 
                            className={cn(
                                "w-5 h-5",
                                getBatteryColor() || 'text-white/70'
                            )} 
                        />
                        <h2 className="text-white/90">Battery</h2>
                    </div>
                </div>

                {/* Battery Info */}
                <div className="p-4 space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-white/70">Level</span>
                            <span className={cn("font-medium", getBatteryColor())}>
                                {percentage}%
                            </span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                            <div
                                className={cn(
                                    "h-full transition-all duration-300",
                                    charging ? 'bg-green-500' : level <= 0.2 ? 'bg-red-500' : level <= 0.5 ? 'bg-yellow-500' : 'bg-white/70'
                                )}
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    </div>

                    <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-white/70">Status</span>
                            <span className="text-white/90">
                                {charging ? 'Charging' : 'Not charging'}
                            </span>
                        </div>
                        {charging && (
                            <div className="flex items-center justify-between">
                                <span className="text-white/70">Time to full</span>
                                <span className="text-white/90">
                                    {batteryInfo.chargingTime !== null 
                                        ? formatTime(batteryInfo.chargingTime)
                                        : 'Unknown'}
                                </span>
                            </div>
                        )}
                        {batteryInfo.dischargingTime !== null && !charging && (
                            <div className="flex items-center justify-between">
                                <span className="text-white/70">Time remaining</span>
                                <span className="text-white/90">
                                    {formatTime(batteryInfo.dischargingTime)}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Settings */}
                    <div className="pt-2 border-t border-white/5">
                        <div className="flex items-center justify-between">
                            <span className="text-white/70 text-sm">Show percentage</span>
                            <CustomSwitch
                                checked={showPercentage}
                                onCheckedChange={setShowPercentage}
                                accentColor={accentColor}
                            />
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}

/**
 * Format time in seconds to readable format (e.g., "2h 30m")
 */
function formatTime(seconds: number): string {
    if (seconds === Infinity || seconds <= 0) {
        return 'Unknown';
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0 && minutes > 0) {
        return `${hours}h ${minutes}m`;
    }
    if (hours > 0) {
        return `${hours}h`;
    }
    if (minutes > 0) {
        return `${minutes}m`;
    }
    return '< 1m';
}
