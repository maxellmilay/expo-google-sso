import * as React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

export default function HomeScreen() {
  const [userInfo, setUserInfo] = React.useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
  })

  React.useEffect(() => {
    handleSignInWithGoogle();
  }, [response]);

  async function handleSignInWithGoogle() {
    const user = await AsyncStorage.getItem('@user');
    if (!user) {
      if (response?.type === 'success') {
        await getUserInfo(response.authentication?.accessToken);
      }
    } else {
      setUserInfo(JSON.parse(user));
    }
  }

  const getUserInfo = async (token: any) => {
    if (!token) return;
    try {
      const response = await fetch('https://www.googleapis.com/userinfo/v2/me',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const user = await response.json();
      await AsyncStorage.setItem('@user', JSON.stringify(user));
      setUserInfo(user)
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <View style={styles.container}>
      <Text>
        {JSON.stringify(userInfo, null, 2)}
      </Text>
      <Text>
        Badge Guru
      </Text>
      <Button title='Sign in with Google' onPress={() => promptAsync()} />
      <Button title='Delete Local Storage' onPress={() => AsyncStorage.removeItem('@user')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  }
});
