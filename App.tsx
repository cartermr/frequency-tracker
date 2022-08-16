import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native';
import { NativeBaseProvider, Center, Box } from 'native-base';
import Timer from './components/timer/Timer';
import AppBar from './components/AppBar';
import Counter from './components/counter/CounterComponent';

export default function App() {
  return (
    <NativeBaseProvider>
      <SafeAreaView>
        <StatusBar style="auto" />
        <AppBar />
        <Center w="100%">
          <Timer />
        </Center>
      </SafeAreaView>
    </NativeBaseProvider>
  );
}