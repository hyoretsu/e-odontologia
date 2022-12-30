import notifee, { AndroidStyle } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import { StatusBar } from 'react-native';
import BackgroundFetch from 'react-native-background-fetch';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from 'rn-css';

import { AuthProvider } from '@contexts/auth';
import { StorageProvider } from '@contexts/storage';

import api from '@api';

import Routes from './routes';
import mainTheme from './ui/theme/main';

const App: React.FC = () => {
    LogBox.ignoreLogs([
        "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
    ]);

    useEffect(() => {
        notifee.requestPermission();

        BackgroundFetch.configure(
            {
                // Android
                enableHeadless: true,
                minimumFetchInterval: 24 * 60,
                requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
                startOnBoot: true,
                stopOnTerminate: false,
            },
            async taskId => {
                const storedContents = (await AsyncStorage.getItem('@ton:contents')) as string;
                const { data: contents } = await api.get('/contents');

                const channelId = await notifee.createChannel({
                    id: 'default',
                    name: 'Padrão',
                });

                if (contents.length - JSON.parse(storedContents).length) {
                    notifee.displayNotification({
                        title: 'Há um novo conteudo educacional disponível!',
                        body: contents[contents.length - 1].title,
                        android: {
                            channelId,
                            pressAction: { id: 'default' },
                            style: {
                                type: AndroidStyle.BIGTEXT,
                                text: contents[contents.length - 1].title,
                            },
                        },
                    });

                    await AsyncStorage.setItem('@ton:contents', JSON.stringify(contents));
                }

                BackgroundFetch.finish(taskId);
            },
            taskId => BackgroundFetch.finish(taskId),
        );
    }, []);

    return (
        <NavigationContainer>
            <StatusBar barStyle="dark-content" backgroundColor={mainTheme.colors.background} />
            <GestureHandlerRootView style={{ flex: 1, backgroundColor: mainTheme.colors.background }}>
                <StorageProvider>
                    <AuthProvider>
                        <ThemeProvider theme={mainTheme}>
                            <Routes />
                        </ThemeProvider>
                    </AuthProvider>
                </StorageProvider>
            </GestureHandlerRootView>
        </NavigationContainer>
    );
};

export default App;
