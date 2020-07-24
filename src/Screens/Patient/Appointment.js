import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Modal, Picker, ScrollView } from 'react-native';
import { Content, Tab, Tabs, ScrollableTab } from 'native-base';
import Icon from "react-native-vector-icons/AntDesign";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";


export default class Appointment extends Component {

    constructor() {
        super();
        this.state = {
            SelectedDoctor: null,
            DoctorList: [],
            DataLoaded: false,
            TimingLoaded: false,
            SelectedDoctor_Availibility: [],
            modalVisible: false,
            SelectedDoctorProfile: [],
            CurrentUserProfile: [],
            profileLoaded: false,
            isloading: false,
            runFetch: false
        }
    }

    async componentDidMount() {

        await fetch("https://patientdoctor-app.herokuapp.com/doctor/getDoctorsList")
            .then(res => res.json())
            .then(response => {
                console.log(response)
                this.setState({
                    DoctorList: response.doctorsList,
                    DataLoaded: true
                })
            })

        await fetch("https://patientdoctor-app.herokuapp.com/patient/profile", {
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
        })

    }

    async GetUpdatedResult () {
        await fetch("https://patientdoctor-app.herokuapp.com/doctor/getDoctorsList")
            .then(res => res.json())
            .then(response => {
                console.log(response)
                this.setState({
                    DoctorList: response.doctorsList,
                    DataLoaded: true
                })
            })

        await fetch("https://patientdoctor-app.herokuapp.com/patient/profile", {
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
        })
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ width: "100%", height: 70, alignItems: "center", justifyContent: "space-between", flexDirection: "row", padding: 20, backgroundColor: "#147562" }}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()} >
                        <View style={{ flexDirection: "column" }}>
                            <Icon name="back" color="white" size={26} />
                        </View>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 24, color: "white", }}>Appointment</Text>
                    <TouchableOpacity onPress={() => this.GetUpdatedResult()}><MaterialIcon name="refresh" color="white" size={25} /></TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.push("LoginScreen")}><Icon name="logout" color="white" size={25} /></TouchableOpacity>
                </View>
                <Tabs renderTabBar={() => <ScrollableTab />}>
                    <Tab heading="Pending Appointments" tabStyle={{ backgroundColor: '#147562' }} textStyle={{ color: '#fff' }} activeTabStyle={{ backgroundColor: '#147562' }} activeTextStyle={{ color: '#fff', fontWeight: 'normal' }}>
                        <ScrollView>
                            {this.state.profileLoaded && !this.state.isloading && this.state.CurrentUserProfile.user.map((items, index) => {
                                return items.Appointment.map((items2, index2) => {
                                    return <View style={{ width: "100%", height: 125, borderRadius: 1, padding: 12, borderBottomWidth: 1 }} key={index2}>
                                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                            <Text style={{ fontWeight: "bold" }}>Doctor Name</Text>
                                            <Text>{items2.data.doctorName}</Text>
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
                                })
                            })}
                        </ScrollView>
                    </Tab>
                    <Tab heading="Accepted Appointments" tabStyle={{ backgroundColor: '#147562' }} textStyle={{ color: '#fff' }} activeTabStyle={{ backgroundColor: '#147562' }} activeTextStyle={{ color: '#fff', fontWeight: 'normal' }}>
                        {this.state.profileLoaded && !this.state.isloading && this.state.CurrentUserProfile.user.map((items, index) => {
                            return items.AcceptedAppointments.map((items2, index2) => {
                                return <View style={{ width: "100%", height: 125, borderRadius: 1, padding: 12, borderBottomWidth: 1 }} key={index2}>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                        <Text style={{ fontWeight: "bold" }}>Doctor Name</Text>
                                        <Text>{items2.data.doctorName}</Text>
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
                            })
                        })}
                    </Tab>
                    <Tab heading="Rejected Appointments" tabStyle={{ backgroundColor: '#147562' }} textStyle={{ color: '#fff' }} activeTabStyle={{ backgroundColor: '#147562' }} activeTextStyle={{ color: '#fff', fontWeight: 'normal' }}>
                        {this.state.profileLoaded && !this.state.isloading && this.state.CurrentUserProfile.user.map((items, index) => {
                            return items.RejectedAppointments.map((items2, index2) => {
                                return <View style={{ width: "100%", height: 125, borderRadius: 1, padding: 12, borderBottomWidth: 1 }} key={index2}>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                        <Text style={{ fontWeight: "bold" }}>Doctor Name</Text>
                                        <Text>{items2.data.doctorName}</Text>
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
                            })
                        })}
                    </Tab>
                </Tabs>




                <View style={{ position: "absolute", bottom: 40, right: 20, }}>
                    <TouchableOpacity onPress={() => this.props.navigation.push("AddAppointment", { UserData: this.props.navigation.state.params.UserData, ComponentState: this.state })}>
                        <View style={{ justifyContent: "center", alignItems: "center", borderRadius: 30, height: 50, width: 150, backgroundColor: "#147562" }}>
                            <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>Add Appointment</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}




