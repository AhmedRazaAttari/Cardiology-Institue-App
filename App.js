import React from 'react';
import { Image, Text } from 'react-native';
import { createAppContainer, NavigationActions } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import PatientNavigation from './Patientnavigation';
import PatientHomePage from './src/Screens/Patient/Home';
import SignupPage from './src/Screens/Patient/Signup';
import LoginPage from './src/Screens/Patient/Login';
import DoctorHomePage from './src/Screens/Doctor/Home';
import PatientRoom from './src/Screens/Doctor/PatientRoom';
import DoctorProfilePage from './src/Screens/Doctor/Profile';
import DiagnosticPage from './src/Screens/Patient/Diagnostic';
import AppointmentPage from './src/Screens/Patient/Appointment';
import AddAppointmentPage from './src/Screens/Patient/AddAppointment';
import LabReportsPage from './src/Screens/Patient/LabReports';
import ProfilePage from './src/Screens/Patient/Profile';
import BloodPressurePage from './src/Screens/Patient/BloodPressure';
import GlucosePage from './src/Screens/Patient/Glucose';
import MeasurementPage from './src/Screens/Patient/Measurement';
import eRxPage from './src/Screens/Patient/eRx';
import HealthSummPage from './src/Screens/Patient/HealthSumm';
import DischargeReportPage from './src/Screens/Patient/DischargeReport';
import DoctorRoomPage from './src/Screens/Patient/DoctorRoom';
console.disableYellowBox = true;


const StackNavigator = createStackNavigator({
  SignupScreen: {
    screen: SignupPage,
    navigationOptions: {
      headerShown: false
    }
  },
  LoginScreen: {
    screen: LoginPage,
    navigationOptions: {
      headerShown: false
    }
  },
  PatientHomeScreen: {
    screen: PatientHomePage,
    navigationOptions: {
      headerShown: false
    }
  },
  PatientDrawer: {
    screen: PatientNavigation,
    navigationOptions: {
      headerShown: false,
    }
  },
  Appointment: {
    screen: AppointmentPage,
    navigationOptions: {
      headerShown: false,
    }
  },
  AddAppointment: {
    screen: AddAppointmentPage,
    navigationOptions: {
      headerShown: false,
    }
  },
  Diagnostic: {
    screen: DiagnosticPage,
    navigationOptions: {
      headerShown: false,
    }
  },
  "Lab Report": {
    screen: LabReportsPage,
    navigationOptions: {
      headerShown: false,
    }
  },
  eRx: {
    screen: eRxPage,
    navigationOptions: {
      headerShown: false,
    }
  },
  "Health Summary": {
    screen: HealthSummPage,
    navigationOptions: {
      headerShown: false,
    }
  },
  "Discharge Report": {
    screen: DischargeReportPage,
    navigationOptions: {
      headerShown: false,
    }
  },
  Profile: {
    screen: ProfilePage,
    navigationOptions: {
      headerShown: false,
    }
  },
  DoctorHomeScreen: {
    screen: DoctorHomePage,
    navigationOptions: {
      headerShown: false,
    }
  },
  DoctorProfile: {
    screen: DoctorProfilePage,
    navigationOptions: {
      headerShown : false
    }
  },
  BloodPressure : {
    screen : BloodPressurePage,
    navigationOptions : {
      headerShown : false
    }
  },
  Measurement : {
    screen : MeasurementPage,
    navigationOptions : {
      headerShown : false
    }
  },
  Glucose : {
    screen : GlucosePage,
    navigationOptions : {
      headerShown : false
    }
  },
  PatientRoomPage : {
    screen : PatientRoom,
    navigationOptions : {
      headerShown : false
    }
  },
  DoctorRoom : {
    screen : DoctorRoomPage,
    navigationOptions : {
      headerShown : false
    }
  }
}, {
  mode: "modal",
});

export default createAppContainer(StackNavigator);