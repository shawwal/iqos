import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';
// import * as Clipboard from 'expo-clipboard';
import { Text } from '@/components/Themed';
import { registerForPushNotificationsAsync } from '@/utils/pushNotification';

const AppVersionComponent: React.FC = () => {
  const [pushToken, setPushToken] = useState<string | null>(null);

  const savePushToken = async () => {
    try {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        setPushToken(token);
      }
    } catch (error) {
      // console.error('Error in savePushToken:', error);
    }
  };

  useEffect(() => {
    savePushToken();
  }, []);
  const handleLongPress = async () => {
    if (pushToken) {
      // await Clipboard.setStringAsync(pushToken);
      Alert.alert('Push Notification Token', `Token copied to clipboard:\n${pushToken}`);
    } else {
      Alert.alert('Push Notification Token', 'Token not available');
    }
  };

  return (
    <TouchableOpacity onLongPress={handleLongPress}>
      <Text style={styles.appVersion}>App Version: 0.1</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  appVersion: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'right',
  },
});

export default AppVersionComponent;
