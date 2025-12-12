import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Mail, MessageSquare, Download, Bell } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useAppContext } from './AppContext';
import { useThemeColors } from '../hooks/useThemeColors';
import { useState } from 'react';

const notifications = [
  {
    id: 1,
    icon: Mail,
    title: 'New Email',
    message: 'You have 3 unread messages',
    time: '5m ago',
    color: 'text-blue-500',
  },
  {
    id: 2,
    icon: Calendar,
    title: 'Meeting Reminder',
    message: 'Team sync in 15 minutes',
    time: '10m ago',
    color: 'text-red-500',
  },
  {
    id: 3,
    icon: MessageSquare,
    title: 'New Message',
    message: 'Sarah: Hey, are you available?',
    time: '1h ago',
    color: 'text-green-500',
  },
  {
    id: 4,
    icon: Download,
    title: 'Download Complete',
    message: 'project-files.zip is ready',
    time: '2h ago',
    color: 'text-purple-500',
  },
];

export function NotificationCenter() {
  const { accentColor, reduceMotion, disableShadows } = useAppContext();
  const { notificationBackground, blurStyle } = useThemeColors();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className={`transition-colors ${isOpen ? 'text-white' : 'text-white/70 hover:text-white'}`}
        >
          <Bell className="w-4 h-4" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        className={`w-96 p-0 overflow-hidden border-white/20 rounded-2xl ${!disableShadows ? 'shadow-2xl' : ''} ${reduceMotion ? '!animate-none !duration-0' : ''}`}
        style={{ background: notificationBackground, ...blurStyle }}
        align="end"
        sideOffset={12}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-white/70" />
            <h2 className="text-white/90">Notifications</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="max-h-[500px] overflow-y-auto">
          <AnimatePresence>
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                initial={{ opacity: 0, x: reduceMotion ? 0 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: reduceMotion ? 0 : notification.id * 0.05 }}
              >
                <div className="flex gap-3">
                  <div className={`flex-shrink-0 ${notification.color}`}>
                    <notification.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm text-white/90">
                        {notification.title}
                      </h3>
                      <span className="text-xs text-white/40 whitespace-nowrap">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-sm text-white/60 mt-1">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-3 bg-black/40 border-t border-white/5">
          <button
            className="w-full text-sm hover:opacity-80 transition-opacity"
            style={{ color: accentColor }}
          >
            Clear All
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}