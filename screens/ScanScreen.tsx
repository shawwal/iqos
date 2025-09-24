import { Ionicons } from '@expo/vector-icons';
import { Camera, CameraView } from 'expo-camera';
import * as Clipboard from 'expo-clipboard';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Animated, Easing, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ScanScreen() {
  const [hasPermission, setHasPermission] = React.useState(null);
  const [scanned, setScanned] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [scannedData, setScannedData] = React.useState({ type: '', data: '' });
  const [animation] = React.useState(new Animated.Value(0));
  const [copyButtonText, setCopyButtonText] = React.useState('Copy to Clipboard');

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  React.useEffect(() => {
    // Starts the scanning line animation
    const startAnimation = () => {
      animation.setValue(0);
      Animated.timing(animation, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => startAnimation());
    };
    startAnimation();
  }, [animation]);

  const handleBarCodeScanned = (scanningResult) => {
    if (scanningResult.data) {
        setScanned(true);
        setScannedData({ type: scanningResult.type || 'N/A', data: scanningResult.data });
        setModalVisible(true);
        // Optional: Vibrate or play a sound
    }
  };

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(scannedData.data);
    setCopyButtonText('Copied!');
    setTimeout(() => setCopyButtonText('Copy to Clipboard'), 2000); // Reset after 2 seconds
  };
  
  const resetScanner = () => {
    setModalVisible(false);
    setScanned(false);
    setCopyButtonText('Copy to Clipboard');
  };

  const renderCamera = () => {
    if (hasPermission === null) {
      return <View style={styles.permissionContainer}><Text style={styles.permissionText}>Requesting for camera permission...</Text></View>;
    }
    if (hasPermission === false) {
      return <View style={styles.permissionContainer}><Text style={styles.permissionText}>No access to camera. Please grant permission in your settings.</Text></View>;
    }
    
    const animatedStyle = {
      transform: [
        {
          translateY: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 240], // The height of the scan box
          }),
        },
      ],
    };

    return (
      <View style={{ flex: 1 }}>
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.overlay}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Scan Code</Text>
          </View>
          <View style={styles.scannerContainer}>
            <View style={styles.scannerBox}>
               {/* Corner markers */}
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
              <Animated.View style={[styles.scanLine, animatedStyle]} />
            </View>
          </View>
          <View style={styles.footer}>
            <Ionicons name="qr-code-outline" size={40} color="rgba(255, 255, 255, 0.6)" />
            <Text style={styles.footerText}>Point your camera at a QR or Barcode</Text>
          </View>
        </View>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      {renderCamera()}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={resetScanner}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Scan Result</Text>
            <View style={styles.resultBox}>
               <Text style={styles.resultLabel}>Type: {scannedData.type}</Text>
               <Text style={styles.resultData} selectable>{scannedData.data}</Text>
            </View>

            <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
              <Ionicons name="copy-outline" size={20} color="#FFFFFF" />
              <Text style={styles.buttonText}>{copyButtonText}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.scanAgainButton} onPress={resetScanner}>
              <Ionicons name="refresh-outline" size={20} color="#333" />
              <Text style={styles.scanAgainButtonText}>Scan Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  permissionText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  header: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 20,
  },
  scannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerBox: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  corner: {
    width: 40,
    height: 40,
    borderColor: '#20B2AA',
    borderWidth: 5,
    position: 'absolute',
  },
  topLeft: { top: -2, left: -2, borderRightWidth: 0, borderBottomWidth: 0 },
  topRight: { top: -2, right: -2, borderLeftWidth: 0, borderBottomWidth: 0 },
  bottomLeft: { bottom: -2, left: -2, borderRightWidth: 0, borderTopWidth: 0 },
  bottomRight: { bottom: -2, right: -2, borderLeftWidth: 0, borderTopWidth: 0 },
  scanLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#20B2AA',
    position: 'absolute',
    top: 0,
    shadowColor: '#20B2AA',
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  footer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: '#F8F9FA',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  resultBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 24,
    borderColor: '#E5E5E5',
    borderWidth: 1,
  },
  resultLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  resultData: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#20B2AA',
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    marginBottom: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  scanAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    borderColor: '#E5E5E5',
    borderWidth: 1,
  },
  scanAgainButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

