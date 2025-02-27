import { AxiosError } from 'axios';
import { Checkup } from 'backend';
import { differenceInMinutes, format, isSameDay } from 'date-fns';
import * as FileSystem from 'expo-file-system';
import { useEffect, useState } from 'react';
import { StatusBar, Text } from 'react-native';

import BottomBar from '@components/BottomBar';
import Header from '@components/Header';
import Modal from '@components/Modal';
import { useStorage } from '@context/storage';

import api from '@api';

import mainTheme from '@theme';

import { Container, ContentButton, ContentTitle } from './styles';

export default function History() {
    const [modalText, setModalText] = useState('');
    const [modalVisible, showModal] = useState(false);
    const { checkupHistory, sentCheckups, storeValue } = useStorage();

    useEffect(() => {
        const execute = async (): Promise<void> => {
            const { data: checkups } = await api.get<Checkup[]>('/checkup');

            storeValue(
                'sentCheckups',
                sentCheckups.map((sent, index) => {
                    if (!sent) {
                        const savedCheckupDate = new Date(checkupHistory[index].date);

                        for (const checkup of checkups) {
                            const checkupDate = new Date(checkup.createdAt);

                            if (
                                isSameDay(savedCheckupDate, checkupDate) &&
                                Math.abs(differenceInMinutes(savedCheckupDate, checkupDate)) <= 1
                            ) {
                                return true;
                            }
                        }
                    }

                    return sent;
                }),
            );
        };

        execute();
    }, [checkupHistory, sentCheckups, storeValue]);

    const sendCheckup = async (index: number): Promise<void> => {
        const formData = new FormData();

        const checkup = checkupHistory[index];

        for (const [key, uri] of Object.entries(checkup.photos)) {
            try {
                const fileInfo = await FileSystem.getInfoAsync(uri);

                if (!fileInfo.exists) {
                    setModalText(
                        'Lamentamos informar, mas ocorreu um erro com uma das fotos desse exame e ele não pode ser enviado.',
                    );
                    showModal(true);

                    return;
                }
            } catch {
                setModalText('Houve um erro ao recuperar as fotos desse exame.');
                showModal(true);

                return;
            }

            formData.append(key, {
                uri,
                type: 'image/jpeg',
                // @ts-ignore
                name: uri.match(/(?:Camera|checkup_photos)\/(.*\.jpg)/)[1],
            });
        }

        formData.append('answers', JSON.stringify(checkup.answers));
        formData.append('createdAt', checkup.date);

        try {
            await api.post('/checkup', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 120000,
            });
        } catch (e) {
            if (e instanceof AxiosError) {
                setModalText(
                    // @ts-ignore
                    `Mande print disso para o suporte:\n\n${e.code}\n${e.message}\n\n${e.response.data.message}`,
                );
            }
            // else {
            //     setModalText(JSON.stringify(e));
            // }

            showModal(true);
            return;
        }

        setModalText('O exame foi enviado com sucesso');

        showModal(true);

        const newSentCheckups = [...sentCheckups];
        newSentCheckups[index] = true;
        storeValue('sentCheckups', newSentCheckups);
    };

    return (
        <>
            <StatusBar backgroundColor={mainTheme.colors.purple} />

            <Header>Histórico</Header>

            <Container showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 0 }}>
                {checkupHistory.map(({ date }, index) => {
                    return (
                        <ContentButton key={date} onPress={() => sendCheckup(index)}>
                            <ContentTitle>
                                Exame do dia {format(new Date(date), 'dd/MM/yyyy')}, às{' '}
                                {format(new Date(date), 'HH:mm')}
                            </ContentTitle>

                            {sentCheckups[index] && <Text style={{ color: '#ddd' }}>Enviado</Text>}
                        </ContentButton>
                    );
                })}
            </Container>

            <BottomBar />

            {modalVisible && (
                <Modal
                    buttonBackground={mainTheme.colors.purple}
                    buttonBold
                    buttonText="Fechar"
                    buttonTextColor="#fff"
                    onConfirm={() => showModal(false)}
                    width={80}
                >
                    {modalText}
                </Modal>
            )}
        </>
    );
}
