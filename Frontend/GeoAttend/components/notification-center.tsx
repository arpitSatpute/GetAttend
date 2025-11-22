import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNotification } from '../contexts/NotificationContext';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface NotificationCenterProps {
  maxDisplay?: number;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ maxDisplay = 10 }) => {
  const { notifications, unreadCount, markAsRead, removeNotification, clearAllNotifications } = useNotification();

  const displayNotifications = notifications.slice(0, maxDisplay);

  const getNotificationColor = (type: 'check-in' | 'check-out' | 'alert' | 'info' | 'warning') => {
    switch (type) {
      case 'check-in':
        return '#4CAF50';
      case 'check-out':
        return '#2196F3';
      case 'alert':
        return '#FF9800';
      case 'warning':
        return '#F44336';
      default:
        return '#2196F3';
    }
  };

  const getNotificationIcon = (type: 'check-in' | 'check-out' | 'alert' | 'info' | 'warning') => {
    switch (type) {
      case 'check-in':
        return '✓';
      case 'check-out':
        return '✕';
      case 'alert':
        return '!';
      case 'warning':
        return '⚠';
      default:
        return 'ℹ';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <ThemedText style={styles.title}>Notifications</ThemedText>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <ThemedText style={styles.unreadText}>{unreadCount}</ThemedText>
            </View>
          )}
        </View>
        {notifications.length > 0 && (
          <TouchableOpacity onPress={clearAllNotifications}>
            <ThemedText style={styles.clearButton}>Clear All</ThemedText>
          </TouchableOpacity>
        )}
      </View>

      {displayNotifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>No notifications</ThemedText>
        </View>
      ) : (
        <ScrollView style={styles.notificationsList} showsVerticalScrollIndicator={false}>
          {displayNotifications.map((notification: any) => (
            <TouchableOpacity
              key={notification.id}
              onPress={() => markAsRead(notification.id)}
              style={[
                styles.notificationItem,
                !notification.read && styles.notificationItemUnread
              ]}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: getNotificationColor(notification.type) }
                ]}
              >
                <ThemedText style={styles.icon}>{getNotificationIcon(notification.type)}</ThemedText>
              </View>

              <View style={styles.content}>
                <ThemedText style={styles.notificationTitle} numberOfLines={1}>
                  {notification.title}
                </ThemedText>
                <ThemedText style={styles.notificationMessage} numberOfLines={2}>
                  {notification.message}
                </ThemedText>
                <ThemedText style={styles.timestamp}>
                  {formatTime(notification.timestamp)}
                </ThemedText>
              </View>

              <TouchableOpacity
                onPress={() => removeNotification(notification.id)}
                style={styles.removeButton}
              >
                <ThemedText style={styles.removeText}>✕</ThemedText>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  unreadBadge: {
    backgroundColor: '#F44336',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  clearButton: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '500',
  },
  notificationsList: {
    flex: 1,
    maxHeight: 400,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FAFAFA',
  },
  notificationItemUnread: {
    backgroundColor: '#F5F5F5',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 11,
    opacity: 0.5,
  },
  removeButton: {
    padding: 8,
    marginLeft: 8,
  },
  removeText: {
    color: '#999',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    opacity: 0.5,
  },
});
