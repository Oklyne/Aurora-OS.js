import { useState, useEffect } from 'react';
import { BatteryInfo, BatteryManager } from '../types';

/**
 * Hook personnalisé pour obtenir les informations de batterie
 * Retourne null si l'API n'est pas disponible (PC fixe)
 */
export function useBattery(): BatteryInfo | null {
    const [batteryInfo, setBatteryInfo] = useState<BatteryInfo | null>(null);

    useEffect(() => {
        // Vérifier si l'API est disponible
        if (!('getBattery' in navigator)) {
            return;
        }

        let battery: BatteryManager | null = null;
        let isMounted = true;

        const updateBatteryInfo = (): void => {
            if (!battery || !isMounted) return;

            setBatteryInfo({
                level: battery.level,
                charging: battery.charging,
                chargingTime: battery.chargingTime === Infinity ? null : battery.chargingTime,
                dischargingTime: battery.dischargingTime === Infinity ? null : battery.dischargingTime,
            });
        };

        const handleChargingChange = (): void => {
            updateBatteryInfo();
        };

        const handleLevelChange = (): void => {
            updateBatteryInfo();
        };

        const handleChargingTimeChange = (): void => {
            updateBatteryInfo();
        };

        const handleDischargingTimeChange = (): void => {
            updateBatteryInfo();
        };

        // Initialiser la batterie
        const initBattery = async (): Promise<void> => {
            try {
                const batteryPromise = (navigator as { getBattery?: () => Promise<BatteryManager> }).getBattery?.();
                if (!batteryPromise) {
                    return;
                }

                const batteryResult = await batteryPromise;
                if (!isMounted) return;

                battery = batteryResult as BatteryManager;

                // Mettre à jour l'état initial
                updateBatteryInfo();

                // Ajouter les event listeners
                battery.addEventListener('chargingchange', handleChargingChange);
                battery.addEventListener('levelchange', handleLevelChange);
                battery.addEventListener('chargingtimechange', handleChargingTimeChange);
                battery.addEventListener('dischargingtimechange', handleDischargingTimeChange);
            } catch (error) {
                console.warn('Failed to get battery information:', error);
                if (isMounted) {
                    setBatteryInfo(null);
                }
            }
        };

        initBattery();

        // Cleanup: retirer les event listeners
        return () => {
            isMounted = false;
            if (battery) {
                battery.removeEventListener('chargingchange', handleChargingChange);
                battery.removeEventListener('levelchange', handleLevelChange);
                battery.removeEventListener('chargingtimechange', handleChargingTimeChange);
                battery.removeEventListener('dischargingtimechange', handleDischargingTimeChange);
            }
        };
    }, []);

    return batteryInfo;
}
