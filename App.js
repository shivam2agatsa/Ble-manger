/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import BleManager from 'react-native-ble-manager';
import {NativeAppEventEmitter} from 'react-native';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [devices, setDevices] = useState(['']);
  const BleManagerModule = NativeModules.BleManager;
  const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

  let handlePress = () => {
    console.log('Btn Pressed');
    BleManager.start().then(() => {
      //console.log('Module initialized');
      handlerDiscover = bleManagerEmitter.addListener(
        'BleManagerDiscoverPeripheral',
        data => {
          console.log(
            'device name',
            data.name,
            data.advertising.manufacturerData,
          );
          handleDiscoverPeripheral(data);
          //setDevices([...devices, data.name]);
        },
      );

      handlerStop = bleManagerEmitter.addListener(
        'BleManagerStopScan',
        handleStopScan(),
      );
    });
    BleManager.scan([], 2).then(() => {
      // Success code
      //console.log('Scan started');
    });
  };

  let handleDiscoverPeripheral = data => {
    //setDevices([...data]);
    setDevices([...devices, data.name]);
    // connectPeripheral();
  };
  let connectPeripheral = () => {
    BleManager.connect('00001510-0000-1000-8000-00805f9b34fc')
      .then(() => {
        // Success code
        //console.log('Connected');
      })
      .catch(error => {
        // Failure code
        //console.log(error);
      });
  };
  let handleStopScan = () => {};

  let handleShow = () => {
    console.log('devicesData', devices);
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View
        style={{
          backgroundColor: 'white',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={{padding: '4%', backgroundColor: 'purple', marginBottom: '5%'}}
          onPress={handlePress}>
          <Text style={{color: 'white'}}>Connect</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{padding: '4%', backgroundColor: 'red'}}
          onPress={handleShow}>
          <Text>Show</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
