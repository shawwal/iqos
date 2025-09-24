// components/UpdateModal.tsx
import React from 'react';
import { Modal, Button, StyleSheet } from 'react-native';
import { GrayView as View, Text } from '@/components/Themed';
import { tintColorLight } from '@/constants/Colors';

interface UpdateModalProps {
  visible: boolean;
  onUpdate: () => void;
  onCancel: () => void;
}

export default function UpdateModal({ visible, onUpdate, onCancel }: UpdateModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Update Available</Text>
          <Text style={styles.modalMessage}>
            A new version of the app is available. Would you like to update now?
          </Text>
          <View style={styles.buttonRow}>
            <Button title="Later" color={tintColorLight} onPress={onCancel} />
            <Button title="Update" color={tintColorLight} onPress={onUpdate} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    borderRadius: 8,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
