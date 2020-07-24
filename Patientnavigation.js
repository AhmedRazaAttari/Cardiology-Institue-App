import React from 'react';
import { SafeAreaView, Text, View, Image } from 'react-native';
import { createDrawerNavigator, DrawerNavigatorItems } from 'react-navigation-drawer';
import DiagnosticPage from './src/Screens/Patient/Diagnostic';
import AppointmentPage from './src/Screens/Patient/Appointment';
import LabReportsPage from './src/Screens/Patient/LabReports';
import ProfilePage from './src/Screens/Patient/Profile';
import eRxPage from './src/Screens/Patient/eRx';
import HealthSummPage from './src/Screens/Patient/HealthSumm';
import DischargeReportPage from './src/Screens/Patient/DischargeReport';

const MyDrawerNavigator = createDrawerNavigator({
    Appointment: {
        screen: AppointmentPage,
    },
    Diagnostic: {
        screen: DiagnosticPage,
    },
    "Lab Report" : {
        screen : LabReportsPage
    },
    eRx: {
        screen: eRxPage,
    },
    "Health Summary": {
        screen: HealthSummPage,
    },
    "Discharge Report": {
        screen: DischargeReportPage,
    },
    Profile: {
        screen: ProfilePage,
    },
    
}, {
    // initialRouteName : "Diagnostic",
    drawerType: "front",
    contentComponent: (props) => (
        <SafeAreaView style={{ flex: 1, }}>
            <View style={{ height: 150, alignItems: 'center', justifyContent: 'space-around', padding: 10 }}>
                <Image source={require('./images/ric.jpg')} style={{ borderRadius: 100, height: 80, width: 80 }} />
                <Text style={{ fontSize: 30 }}>Hospital App</Text>
            </View>
            <DrawerNavigatorItems {...props} />
        </SafeAreaView>
    )
}
);

const MyApp = MyDrawerNavigator;

export default MyApp;