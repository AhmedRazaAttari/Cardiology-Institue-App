import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image, ScrollView, Alert } from 'react-native';
import { Content, Tab, Tabs, ScrollableTab } from 'native-base';
import Icon from "react-native-vector-icons/AntDesign";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";


var current = [];

export default class Home extends Component {

    constructor(properties) {
        super(properties);

        this.state = {
            CurrentUserProfile: [],
            CurrentDoctorAppointments: null,
            isloading: true,
            profileLoaded: false
        }
    }

    async componentDidMount() {

        await fetch("https://patientdoctor-app.herokuapp.com/doctor/profile", {
            method: "POST",
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify({
                _id: this.props.navigation.state.params.UserData._id,
            })
        }).then(res => res.json()).then(response => {
            // console.log(response.user)
            this.setState({
                CurrentUserProfile: response,
                profileLoaded: true
            })
            this.extractData_Status()
        })
    }

    extractData_Status = () => {

        this.state.CurrentUserProfile.profile.map((items) => {
            // console.log(items.Appointment)
            items.Appointment.map((items2) => {

                // console.log("items2 ==> ", items2.data.userID)
                this.setState({
                    CurrentDoctorAppointments: items2,
                })
                // console.log(items2.AppoitmentTiming.Time)
            })
        })
    }


    async GetUpdatedResult () {
        await fetch("https://patientdoctor-app.herokuapp.com/doctor/profile", {
            method: "POST",
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify({
                _id: this.props.navigation.state.params.UserData._id,
            })
        }).then(res => res.json()).then(response => {
            // console.log(response.user)
            this.setState({
                CurrentUserProfile: response,
                profileLoaded: true
            })
            this.extractData_Status()
        })
    }

    AcceptAppointment(indexnumber, userID) {
        console.log(indexnumber)
        console.log(userID)
        Alert.alert(
            '',
            'Do you want to accept the appointment',
            [
                {
                    text: 'Yes', onPress: (() => {
                        fetch("https://patientdoctor-app.herokuapp.com/doctor/acceptAppointment", {
                            method: "POST",
                            headers: {
                                "content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                doctorID: this.props.navigation.state.params.UserData._id,
                                index: indexnumber
                            })
                        }).then(res => res.json()).then(response => {
                            console.log("RESPONSE ===>", response)
                            fetch("https://patientdoctor-app.herokuapp.com/patient/Appointment/accept", {
                                method: "POST",
                                headers: {
                                    "content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    patientID: userID,
                                    index: indexnumber
                                })
                            }).then(res => res.json()).then(response2 => this.GetUpdatedResult())
                        })

                    })
                },
                { text: 'Cancel', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false }
        )
    }


    RejectAppointment(indexnumber, userID) {
        console.log(indexnumber)
        Alert.alert(
            '',
            'Do you want to Reject the appointment',
            [
                {
                    text: 'Yes', onPress: (() => {
                        fetch("https://patientdoctor-app.herokuapp.com/doctor/RejectAppointment", {
                            method: "POST",
                            headers: {
                                "content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                doctorID: this.props.navigation.state.params.UserData._id,
                                index: indexnumber
                            })
                        })
                            .then(res => res.json()).then(response => {
                                console.log("RESPONSE ===>", response)
                                fetch("https://patientdoctor-app.herokuapp.com/patient/Appointment/reject", {
                                    method: "POST",
                                    headers: {
                                        "content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                        patientID: userID,
                                        index: indexnumber
                                    })
                                }).then(res => res.json()).then(response2 => this.GetUpdatedResult())
                            })
                    })
                },
                { text: 'Cancel', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false }
        )
    }

    AdmitPatient(indexnumber, userID) {
        console.log(indexnumber)
        Alert.alert(
            '',
            'Do you want to Admit the Patient',
            [
                {
                    text: 'Yes', onPress: (() => {
                        fetch("https://patientdoctor-app.herokuapp.com/doctor/admitPatient", {
                            method: "POST",
                            headers: {
                                "content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                doctorID: this.props.navigation.state.params.UserData._id,
                                index: indexnumber
                            })
                        }).then(res => res.json()).then(response => this.GetUpdatedResult())
                    })
                },
                { text: 'Cancel', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false }
        )
    }


    DischargePatient(indexnumber, userID, AppointmentID) {
        console.log(indexnumber)
        Alert.alert(
            '',
            'Do you want to Discharge the Patient',
            [
                {
                    text: 'Yes', onPress: (() => {
                        fetch("https://patientdoctor-app.herokuapp.com/doctor/DischargePatient", {
                            method: "POST",
                            headers: {
                                "content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                doctorID: this.props.navigation.state.params.UserData._id,
                                AppointmentID : AppointmentID,
                                index: indexnumber
                            })
                        })
                            .then(res => res.json()).then(response => {
                                console.log("RESPONSE ===>", response)

                                fetch("https://patientdoctor-app.herokuapp.com/patient/DischargeReports", {
                                    method: "POST",
                                    headers: {
                                        "content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                        patientID: userID,
                                        AppointmentID : AppointmentID,
                                        index: indexnumber
                                    })
                                }).then(res => res.json()).then(response2 => this.GetUpdatedResult())
                            })
                    })
                },
                { text: 'Cancel', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false }
        )
    }

    render() {
        // console.log(this.state.CurrentDoctorAppointments)
        return (
            <View style={{ flex: 1 }}>
                <View style={{ width: "100%", height: 70, alignItems: "center", justifyContent: "space-between", flexDirection: "row", padding: 20, backgroundColor: "#147562" }}>
                    <Image source={require('../../../images/ric.jpg')} style={{ borderRadius: 100, height: 50, width: 50 }} />
                    <Text style={{ fontSize: 24, color: "white", marginLeft: -50 }}>Dashboard</Text>
                    <TouchableOpacity onPress={() => this.GetUpdatedResult()}><MaterialIcon name="refresh" color="white" size={30} /></TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.push("LoginScreen")}><Icon name="logout" color="white" size={25} /></TouchableOpacity>
                </View>
                <Tabs renderTabBar={() => <ScrollableTab />}>
                    <Tab heading="Pending Appointments" tabStyle={{ backgroundColor: '#147562' }} textStyle={{ color: '#fff' }} activeTabStyle={{ backgroundColor: '#147562' }} activeTextStyle={{ color: '#fff', fontWeight: 'normal' }}>
                        <ScrollView>
                            {this.state.CurrentDoctorAppointments ?
                                this.state.CurrentUserProfile.profile.map((items, index) => {
                                    return items.Appointment.map((items2, index2) => {
                                        // console.log(items2.data.userID)
                                        // console.log("items", items)
                                        return <TouchableOpacity key={index2} onPress={() => console.log(index2)}><View style={{ width: "100%", borderRadius: 1, padding: 12, borderBottomWidth: 1 }} >
                                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                <Text style={{ fontWeight: "bold" }}>Patient Name</Text>
                                                <Text>{items2.data.userName}</Text>
                                            </View>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                <Text style={{ fontWeight: "bold" }}>Appointment Time</Text>
                                                <Text>{items2.data.AppoitmentTiming.Time}</Text>
                                            </View>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                <Text style={{ fontWeight: "bold" }}>Appointment Day</Text>
                                                <Text>{items2.data.AppoitmentTiming.day}</Text>
                                            </View>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
                                                <Text style={{ fontWeight: "bold" }}>Appointment Venue</Text>
                                                <Text style={{ fontSize: 13 }}>Rawalpindi institute of Cardiology</Text>
                                            </View>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
                                                <Text style={{ fontWeight: "bold" }}>Status</Text>
                                                <Text>{items2.data.Status}</Text>
                                            </View>
                                            <View style={{ flexDirection: "row", justifyContent: "space-around", }}>
                                                <TouchableOpacity style={{ alignSelf: "center" }} onPress={() => this.AcceptAppointment(index2, items2.data.userID)}>
                                                    <View style={{ width: 100, height: 45, borderRadius: 5, alignItems: "center", justifyContent: "center", elevation: 2, backgroundColor: "#147562", marginTop: 10 }}>
                                                        <Text style={{ fontSize: 18, color: "white" }}>Accept</Text>
                                                    </View>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={{ alignSelf: "center" }} onPress={() => this.RejectAppointment(index2, items2.data.userID)}>
                                                    <View style={{ width: 100, height: 45, borderRadius: 5, alignItems: "center", justifyContent: "center", elevation: 2, backgroundColor: "black", marginTop: 10 }}>
                                                        <Text style={{ fontSize: 18, color: "white" }}>Reject</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        </TouchableOpacity>
                                    })
                                })
                                : <Text style={{ fontSize: 22, marginLeft: 20, margin: 10 }}>No Appointments yet</Text>}
                        </ScrollView>
                    </Tab>
                    <Tab heading="Patients" tabStyle={{ backgroundColor: '#147562' }} textStyle={{ color: '#fff' }} activeTabStyle={{ backgroundColor: '#147562' }} activeTextStyle={{ color: '#fff', fontWeight: 'normal' }}>
                        <ScrollView>
                            {this.state.profileLoaded ?
                                this.state.CurrentUserProfile.profile.map((items, index) => {
                                    return items.Patients.map((items2, index2) => {
                                        // console.log(items2.data.userName)
                                        return <TouchableOpacity key={index2} onPress={() => this.props.navigation.push("PatientRoomPage", { Clicked_NodeData: items2, UserData: this.props.navigation.state.params.UserData })}><View style={{ width: "100%", borderRadius: 1, padding: 12, borderBottomWidth: 1 }} >
                                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                <Text style={{ fontWeight: "bold" }}>Patient Name</Text>
                                                <Text>{items2.data.userName}</Text>
                                            </View>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                <Text style={{ fontWeight: "bold" }}>Appointment Time</Text>
                                                <Text>{items2.data.AppoitmentTiming.Time}</Text>
                                            </View>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                <Text style={{ fontWeight: "bold" }}>Appointment Day</Text>
                                                <Text>{items2.data.AppoitmentTiming.day}</Text>
                                            </View>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
                                                <Text style={{ fontWeight: "bold" }}>Appointment Venue</Text>
                                                <Text style={{ fontSize: 13 }}>Rawalpindi institute of Cardiology</Text>
                                            </View>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
                                                <Text style={{ fontWeight: "bold" }}>Status</Text>
                                                <Text>{items2.data.Status}</Text>
                                            </View>
                                            {items2.data.Status === "Admitted" ? null : <View style={{ flexDirection: "row", justifyContent: "space-around", }}>
                                                <TouchableOpacity style={{ alignSelf: "center" }} onPress={() => this.AdmitPatient(index2, items2.data.userID)}>
                                                    <View style={{ width: 100, height: 45, borderRadius: 5, alignItems: "center", justifyContent: "center", elevation: 2, backgroundColor: "#147562", marginTop: 10 }}>
                                                        <Text style={{ fontSize: 18, color: "white" }}>Admit</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>}
                                        </View>
                                        </TouchableOpacity>
                                    })
                                })
                                : <Text style={{ fontSize: 22, marginLeft: 20, margin: 10 }}>No Patients yet</Text>}
                        </ScrollView>
                    </Tab>
                    <Tab heading="Admitted Patients" tabStyle={{ backgroundColor: '#147562' }} textStyle={{ color: '#fff' }} activeTabStyle={{ backgroundColor: '#147562' }} activeTextStyle={{ color: '#fff', fontWeight: 'normal' }}>
                        <ScrollView>
                            {this.state.profileLoaded ?
                                this.state.CurrentUserProfile.profile.map((items, index) => {
                                    return items.AdmittedPatient.map((items2, index2) => {
                                        // console.log(items2.data.userName)
                                        return <TouchableOpacity key={index2} onPress={() => this.props.navigation.push("PatientRoomPage", { Clicked_NodeData: items2, UserData: this.props.navigation.state.params.UserData })}><View style={{ width: "100%", borderRadius: 1, padding: 12, borderBottomWidth: 1 }} >
                                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                <Text style={{ fontWeight: "bold" }}>Patient Name</Text>
                                                <Text>{items2.data.userName}</Text>
                                            </View>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                <Text style={{ fontWeight: "bold" }}>Appointment Time</Text>
                                                <Text>{items2.data.AppoitmentTiming.Time}</Text>
                                            </View>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                <Text style={{ fontWeight: "bold" }}>Appointment Day</Text>
                                                <Text>{items2.data.AppoitmentTiming.day}</Text>
                                            </View>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
                                                <Text style={{ fontWeight: "bold" }}>Appointment Venue</Text>
                                                <Text style={{ fontSize: 13 }}>Rawalpindi institute of Cardiology</Text>
                                            </View>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
                                                <Text style={{ fontWeight: "bold" }}>Status</Text>
                                                <Text>{items2.data.Status}</Text>
                                            </View>
                                            {items2.data.Status === "Admitted" ? <View style={{ flexDirection: "row", justifyContent: "space-around", }}>
                                                <TouchableOpacity style={{ alignSelf: "center" }} onPress={() => this.DischargePatient(index2, items2.data.userID, items2.AppointmentID)}>
                                                    <View style={{ width: 100, height: 45, borderRadius: 5, alignItems: "center", justifyContent: "center", elevation: 2, backgroundColor: "#147562", marginTop: 10 }}>
                                                        <Text style={{ fontSize: 18, color: "white" }}>Discharge</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View> : null}
                                        </View>
                                        </TouchableOpacity>

                                    })
                                })
                                : <Text style={{ fontSize: 22, marginLeft: 20, margin: 10 }}>No Admitted Patient yet</Text>}
                        </ScrollView>
                    </Tab>
                    <Tab heading="Dicharge Patients" tabStyle={{ backgroundColor: '#147562' }} textStyle={{ color: '#fff' }} activeTabStyle={{ backgroundColor: '#147562' }} activeTextStyle={{ color: '#fff', fontWeight: 'normal' }}>
                        <ScrollView>
                            {this.state.profileLoaded ?
                                this.state.CurrentUserProfile.profile.map((items, index) => {
                                    return items.DischargePatient.map((items2, index2) => {
                                        var DateOfDischarge = items2.Date;
                                        var TimeOfDischarge = items2.Time;
                                        return items2.updatedAdmittedPatient.map((items3, index3) => {
                                            return <TouchableOpacity key={index3} onPress={() => console.log(index3)}><View style={{ width: "100%", borderRadius: 1, padding: 12, borderBottomWidth: 1 }} >
                                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                <Text style={{ fontWeight: "bold" }}>Patient Name</Text>
                                                <Text>{items3.data.userName}</Text>
                                            </View>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                <Text style={{ fontWeight: "bold" }}>Discharge Date</Text>
                                                <Text>{DateOfDischarge}</Text>
                                            </View>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                <Text style={{ fontWeight: "bold" }}>Discharge Time</Text>
                                                <Text>{TimeOfDischarge}</Text>
                                            </View>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
                                                <Text style={{ fontWeight: "bold" }}>Appointment Venue</Text>
                                                <Text style={{ fontSize: 13 }}>Rawalpindi institute of Cardiology</Text>
                                            </View>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
                                                <Text style={{ fontWeight: "bold" }}>Status</Text>
                                                <Text>{items3.data.Status}</Text>
                                            </View>
                                        </View>
                                        </TouchableOpacity>

                                        })
                                    })
                                })
                                : <Text style={{ fontSize: 22, marginLeft: 20, margin: 10 }}>No Discharge Patient yet</Text>}
                        </ScrollView>
                    </Tab>
                    <Tab heading="Rejected Appointments" tabStyle={{ backgroundColor: '#147562' }} textStyle={{ color: '#fff' }} activeTabStyle={{ backgroundColor: '#147562' }} activeTextStyle={{ color: '#fff', fontWeight: 'normal' }}>
                        <ScrollView>
                            {this.state.profileLoaded ?
                                this.state.CurrentUserProfile.profile.map((items, index) => {
                                    return items.RejectedAppointments.map((items2, index2) => {
                                        // console.log(items2.data.userName)
                                        return <TouchableOpacity key={index2} onPress={() => console.log(index2)}><View style={{ width: "100%", borderRadius: 1, padding: 12, borderBottomWidth: 1 }} >
                                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                <Text style={{ fontWeight: "bold" }}>Patient Name</Text>
                                                <Text>{items2.data.userName}</Text>
                                            </View>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                <Text style={{ fontWeight: "bold" }}>Appointment Time</Text>
                                                <Text>{items2.data.AppoitmentTiming.Time}</Text>
                                            </View>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                <Text style={{ fontWeight: "bold" }}>Appointment Day</Text>
                                                <Text>{items2.data.AppoitmentTiming.day}</Text>
                                            </View>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
                                                <Text style={{ fontWeight: "bold" }}>Appointment Venue</Text>
                                                <Text style={{ fontSize: 13 }}>Rawalpindi institute of Cardiology</Text>
                                            </View>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
                                                <Text style={{ fontWeight: "bold" }}>Status</Text>
                                                <Text>{items2.data.Status}</Text>
                                            </View>
                                        </View>
                                        </TouchableOpacity>

                                    })
                                })
                                : <Text style={{ fontSize: 22, marginLeft: 20, margin: 10 }}>No Rejected Appointments yet</Text>}
                        </ScrollView>
                    </Tab>
                </Tabs>
                <View style={{ position: "absolute", bottom: 40, right: 20, }}>
                    <TouchableOpacity onPress={() => this.props.navigation.push("DoctorProfile", { Profile: this.props.navigation.state.params.UserData })}>
                        <View style={{ justifyContent: "center", alignItems: "center", borderRadius: 30, height: 50, width: 150, backgroundColor: "#147562" }}>
                            <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>Edit Profile</Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </View>
        )
    }
}