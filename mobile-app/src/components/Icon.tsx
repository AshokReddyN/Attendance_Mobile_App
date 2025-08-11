import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { COLORS } from '../constants/theme';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: TextStyle;
}

const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 24, 
  color = COLORS.textPrimary, 
  style 
}) => {
  // Simple emoji-based icons for now
  // In a real app, you'd use a proper icon library like @expo/vector-icons
  const iconMap: { [key: string]: string } = {
    'calendar': '📅',
    'clock': '⏰',
    'user': '👤',
    'users': '👥',
    'event': '🎯',
    'payment': '💳',
    'money': '💰',
    'check': '✅',
    'close': '❌',
    'edit': '✏️',
    'delete': '🗑️',
    'add': '➕',
    'arrow-right': '➡️',
    'arrow-left': '⬅️',
    'home': '🏠',
    'settings': '⚙️',
    'logout': '🚪',
    'search': '🔍',
    'filter': '🔧',
    'sort': '📊',
  };

  const icon = iconMap[name] || '❓';

  return (
    <Text style={[styles.icon, { fontSize: size, color }, style]}>
      {icon}
    </Text>
  );
};

const styles = StyleSheet.create({
  icon: {
    textAlign: 'center',
  },
});

export default Icon; 