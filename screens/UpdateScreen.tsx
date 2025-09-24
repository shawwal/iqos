import AppVersionComponent from '@/components/AppVersionComponent';
import { Text, View } from '@/components/Themed';
import { tintColorLight } from '@/constants/Colors';
import * as Updates from 'expo-updates';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, StyleSheet } from 'react-native';

export default function UpdatesScreen() {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isUpdatePending, setIsUpdatePending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [runTypeMessage, setRunTypeMessage] = useState('');

  useEffect(() => {
    checkForUpdates();
    // Check the initial running state
    setRunTypeMessage(
      Updates.isEmbeddedLaunch
        ? 'This app is running the original built-in version.'
        : 'This app is running a newer version\ninstalled via in-app update.'
    );
  }, []);

  const checkForUpdates = async () => {
    setIsLoading(true); // Start loading
    try {
      const update = await Updates.checkForUpdateAsync();
      setIsUpdateAvailable(update.isAvailable);
    } catch (error) {
      // @ts-ignore
      Alert.alert('Error checking for updates:', error?.message || 'something went wrong, please contact support!');
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const fetchUpdate = async () => {
    setIsLoading(true); // Start loading
    try {
      const update = await Updates.fetchUpdateAsync();
      if (update.isNew) {
        setIsUpdatePending(true);
      }
    } catch (error) {
      console.error('Error fetching updates:', error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  useEffect(() => {
    if (isUpdatePending) {
      // Update has successfully downloaded; apply it now
      Updates.reloadAsync();
    }
  }, [isUpdatePending]);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Update App</Text>
      <Text style={styles.runMessage}>{runTypeMessage}</Text>
      {isLoading ? (
        <ActivityIndicator size="small" color={tintColorLight} />
      ) : (
        <>
          <Button color={tintColorLight} onPress={checkForUpdates} title="Check manually for updates" />
          {isUpdateAvailable && !isUpdatePending && (
            <View style={styles.downloadButton}>
              <Button color={tintColorLight} onPress={fetchUpdate} title="Download and run update" />
            </View>
          )}
        </>
      )}
      <AppVersionComponent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center'
  },
  headerText: {
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  runMessage: {
    fontSize: 17,
    paddingVertical: 15,
    textAlign: 'center',
  },
  downloadButton: {
    marginVertical: 30,
  }
});
