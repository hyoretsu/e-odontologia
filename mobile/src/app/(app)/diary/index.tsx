import { router } from 'expo-router';
import { StatusBar } from 'react-native';

import BottomBar from '@components/BottomBar';
import ObjectivesList from '@components/ObjectivesList';
import PatientPhoto from '@components/PatientPhoto';
import Row from '@components/Row';
import { vh, vw } from '@utils';

import mainTheme from '@theme';

import HealthProfileSvg from 'assets/healthProfile.svg';
import PersonalDataSvg from 'assets/personalData.svg';
import TreatmentSvg from 'assets/treatment.svg';

import {
    Container,
    Header,
    HeaderTitle,
    HeaderCircle,
    HeaderPhotoView,
    HeaderPhotoDesc,
    InfoTitle,
    InfoCircle,
    InfoCircleText,
    InfoView,
} from './styles';

export default function Diary() {
    return (
        <>
            <StatusBar backgroundColor="#fff" />

            <Header>
                <HeaderCircle
                    style={{
                        backgroundColor: mainTheme.colors.purple,
                        left: -0.5 * 15 * vh,
                    }}
                />
                <HeaderCircle
                    style={{
                        backgroundColor: mainTheme.colors.gold,
                        left: -0.75 * 15 * vh,
                        top: 6 * vh,
                    }}
                />

                <HeaderTitle>Diário</HeaderTitle>

                <HeaderPhotoDesc>Meu perfil</HeaderPhotoDesc>
                <HeaderPhotoView>
                    <PatientPhoto size={5 * vh} onPress={() => router.push('/profile')} />
                </HeaderPhotoView>
            </Header>

            <ObjectivesList style={{ flex: 1, paddingBottom: 7 * vh, paddingHorizontal: 7 * vw, paddingTop: 6 * vh }} />

            <Container>
                <InfoTitle>Informações:</InfoTitle>

                <Row style={{ justifyContent: 'space-between', width: '100%' }}>
                    <InfoView>
                        <InfoCircle onPress={() => router.push('/personal-data')}>
                            <PersonalDataSvg height={4 * vh} />
                        </InfoCircle>
                        <InfoCircleText>Dados pessoais</InfoCircleText>
                    </InfoView>
                    <InfoView>
                        <InfoCircle onPress={() => router.push('/health-profile')}>
                            <HealthProfileSvg width={9 * vw} />
                        </InfoCircle>
                        <InfoCircleText>Perfil de saúde</InfoCircleText>
                    </InfoView>
                    <InfoView>
                        <InfoCircle onPress={() => router.push('/treatment')}>
                            <TreatmentSvg height={4 * vh} />
                        </InfoCircle>
                        <InfoCircleText>Tratamento</InfoCircleText>
                    </InfoView>
                </Row>
            </Container>

            <BottomBar />
        </>
    );
}
