import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image, ScrollView, Picker, Modal, CheckBox, ListItem } from 'react-native';
import FilePickerManager from 'react-native-file-picker';
import Icon from "react-native-vector-icons/AntDesign";
import Pdf from 'react-native-pdf';

var extractedeRx = [], extractedLabReports = [];
export default class PatientRoom extends Component {

    constructor() {
        super();

        this.state = {
            doctorProfile: []
        }
    }

    async componentDidMount() {
        await fetch("https://patientdoctor-app.herokuapp.com/doctor/profile", {
            method: "POST",
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify({
                _id: this.props.navigation.state.params.doctorID,
            })
        }).then(res => res.json()).then(response => {
            console.log("DOCTOR PROFILE FETCHED SUCCESFULL ===>", response)
            this.setState({
                doctorProfile: response.profile,
                SelectedDoctorProfile: response.profile[0],
                SelectedDoctor_Availibility: response.profile[0].TimingAndLocation,
                NotificationToken: response.profile[0].NotificationToken,
                TimingLoaded: true
            })
        })
    }

    async SelectedDay(itemvalue) {
        await this.setState({ SelectedDay: itemvalue })
        console.log(this.state.SelectedDoctor_Availibility)
        var SpecificDayTiming = [];
        for (var i = 0; i < this.state.SelectedDoctor_Availibility.length; i++) {
            console.log(this.state.SelectedDoctor_Availibility[i].Day)
            if (this.state.SelectedDoctor_Availibility[i].Day === itemvalue) {
                console.log(this.state.SelectedDoctor_Availibility[i])
                SpecificDayTiming.push(this.state.SelectedDoctor_Availibility[i])
            }
        }
        this.setState({
            Timing: SpecificDayTiming,
            TimingLoad: true
        })
    }


    createAppointment() {
        var AppointmentID = Math.floor(100000 + Math.random() * 900000);
        fetch("https://patientdoctor-app.herokuapp.com/patient/Appointment/create", {
            method: "POST",
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify({
                _id: this.props.navigation.state.params.UserData._id,
                AppointmentID: AppointmentID,
                Appointment: {
                    doctorID: this.props.navigation.state.params.doctorID,
                    doctorName: this.state.SelectedDoctorProfile.FirstName + "" + this.state.SelectedDoctorProfile.LastName,
                    AppoitmentTiming: {
                        day: this.state.SelectedDay,
                        Time: this.state.SelectedTiming
                    },
                    Status: "Pending"
                }
            })
        }).then(res => res.json()).then(response => {
            fetch("https://patientdoctor-app.herokuapp.com/doctor/sendAppointment", {
                method: "POST",
                headers: {
                    "content-Type": "application/json"
                },
                body: JSON.stringify({
                    doctorID: this.props.navigation.state.params.doctorID,
                    AppointmentID: AppointmentID,
                    NotificationToken: this.props.navigation.state.params.UserData.NotificationToken,
                    Appointment: {
                        userID: this.props.navigation.state.params.UserData._id,
                        userName: this.props.navigation.state.params.UserData.FirstName + " " + this.props.navigation.state.params.UserData.LastName,
                        AppoitmentTiming: {
                            day: this.state.SelectedDay,
                            Time: this.state.SelectedTiming
                        },
                        Status: "Pending"
                    }
                })
            }).then(res2 => res2.json()).then(response2 => {
                this.props.navigation.push("Appointment", { UserData: this.props.navigation.state.params.UserData })
            })
        })
    }


    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ width: "100%", height: 70, alignItems: "center", justifyContent: "flex-start", flexDirection: "row", padding: 20, backgroundColor: "#147562" }}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()} >
                        <Icon name="back" color="white" size={26} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 24, color: "white", marginLeft: 30 }}>Doctor Room</Text>
                </View>
                <ScrollView>
                    {this.state.doctorProfile.length ? this.state.doctorProfile.map((items, index) => {
                        return <View style={{ padding: 20 }} key={index}>
                            <Text style={{ fontSize: 22, fontWeight: "bold" }}>Doctor info</Text>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: 25 }}>
                                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Name : </Text>
                                <Text style={{ fontSize: 20, marginLeft: 25 }}>{items.FirstName + items.LastName}</Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: 15 }}>
                                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Email : </Text>
                                <Text style={{ fontSize: 20, marginLeft: 25 }}>{items.Email}</Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: 15 }}>
                                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Gender :</Text>
                                <Text style={{ fontSize: 20, marginLeft: 25 }}>{items.Gender}</Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: 15 }}>
                                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Phone# :</Text>
                                <Text style={{ fontSize: 20, marginLeft: 25 }}>{items.PhoneNo}</Text>
                            </View>

                            <Text style={{ fontSize: 26, fontWeight: "bold", marginTop: 40 }}>Book an Appointment</Text>

                            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Select Day</Text>
                            <Picker
                                style={{ height: 44, backgroundColor: "#d1dede", marginTop: 10, marginBottom: 20 }}
                                selectedValue={this.state.SelectedDay}
                                onValueChange={(itemvalue) => this.SelectedDay(itemvalue)}>
                                <Picker.Item label="select..." />
                                {this.state.TimingLoaded && this.state.SelectedDoctor_Availibility.map((items, index) => {
                                    return <Picker.Item label={items.Day} value={items.Day} key={index} />
                                })}
                            </Picker>

                            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Select Timing</Text>
                            <Picker
                                style={{ height: 44, backgroundColor: "#d1dede", marginTop: 10, marginBottom: 20 }}
                                selectedValue={this.state.SelectedTiming}
                                onValueChange={(itemvalue, indexitem) =>
                                    this.setState({ SelectedTiming: itemvalue })
                                }>
                                <Picker.Item label="select..." />
                                {this.state.TimingLoad && this.state.Timing.map((items, index) => {
                                    return <Picker.Item label={items.Timing} value={items.Timing} key={index} />
                                })}
                            </Picker>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
                                <TouchableOpacity style={{ alignSelf: "center" }} onPress={() => this.createAppointment()}>
                                    <View style={{ width: 180, height: 45, borderRadius: 5, alignItems: "center", justifyContent: "center", elevation: 2, backgroundColor: "#147562", marginTop: 10 }}>
                                        <Text style={{ fontSize: 18, color: "white" }}>Create Appointment</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                        </View>
                    }) : null}

                </ScrollView>
            </View>
        )
    }
}