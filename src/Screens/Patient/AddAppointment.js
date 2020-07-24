import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image, ScrollView, Picker, Modal, CheckBox, ListItem, Body } from 'react-native';
import Icon from "react-native-vector-icons/AntDesign";

export default class AddAppointment extends Component {

    constructor() {
        super();

        this.state = {
            doctors: [],
        }
    }


    async componentDidMount() {
        await fetch("https://patientdoctor-app.herokuapp.com/doctor/getDoctorsList")
            .then(res => res.json()).then(response => {
                this.setState({
                    doctors: response.doctorsList
                })
            })
    }

    async PickerFunction(itemvalue) {
        await this.setState({ SelectedDoctor: itemvalue })
        fetch("https://patientdoctor-app.herokuapp.com/doctor/profile", {
            method: "POST",
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify({
                _id: this.state.SelectedDoctor,
            })
        }).then(res => res.json()).then(response => {
            console.log(response.profile[0].TimingAndLocation)
            this.setState({
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
                    doctorID: this.state.SelectedDoctor,
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
                    doctorID: this.state.SelectedDoctor,
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
        console.log(this.props.navigation.state.params.UserData);
        console.log(this.props.navigation.state.params.ComponentState);
        console.log(this.state.doctors);
        return (
            <View style={{ flex: 1 }}>
                <View style={{ width: "100%", height: 70, alignItems: "center", justifyContent: "flex-start", flexDirection: "row", padding: 20, backgroundColor: "#147562" }}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()} >
                        <Icon name="back" color="white" size={26} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 24, color: "white", marginLeft: 30 }}>AddAppointment</Text>
                    {/* <TouchableOpacity onPress={() => this.setState({ modalVisible: true })}><Icon name="edit" color="white" size={26} /></TouchableOpacity> */}
                </View>


                <ScrollView>
                    {this.state.doctors.length ? this.state.doctors.map((items, index) => {

                        console.log("MAP DATA ===>", items.TimingAndLocation)
                        return <TouchableOpacity onPress={() => this.props.navigation.push("DoctorRoom", { doctorID: items._id, UserData: this.props.navigation.state.params.UserData })}>
                            <View style={{
                                borderColor: '#147562',
                                borderWidth: 3,
                                borderLeftWidth: 10,
                                borderRadius: 20,
                                margin: 5,
                                backgroundColor: 'white',
                                padding: 2,
                                height: 155,
                                marginBottom: 15
                            }} key={index}>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 5, }}>
                                    <Text style={{ color: 'black', fontSize: 14, marginTop: 5, fontWeight: 'bold', }}>Doctor Name</Text>
                                    <Text style={{ marginTop: 4 }}>{items.FirstName + items.LastName}</Text>
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 5 }}>
                                    <Text style={{ color: 'black', fontSize: 14, marginTop: 5, fontWeight: 'bold', }}>Specialities</Text>
                                    <View style={{ flexDirection: "row" }}>
                                        {items.Specialities.length ? items.Specialities.map((spec, ids) => {
                                            return <Text style={{ marginTop: 4 }} key={ids}>{spec},</Text>
                                        }) : <Text style={{ marginTop: 4 }} >Not available</Text>}
                                    </View>
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 5, }}>
                                    <Text style={{ color: 'black', fontSize: 14, marginTop: 5, fontWeight: 'bold', }}>Day</Text>
                                    <View style={{ flexDirection: "row" }}>
                                        {items.TimingAndLocation.length ? items.TimingAndLocation.map((days, ids) => {
                                            return <Text style={{ marginTop: 4 }} key={ids}>{days.Day},</Text>
                                        }) : <Text style={{ marginTop: 4 }} >Not available</Text>}
                                    </View>
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 5, }}>
                                    <Text style={{ color: 'black', fontSize: 14, marginTop: 5, fontWeight: 'bold', }}>Location</Text>
                                    <Text style={{ fontSize: 13, marginTop: 4 }}>Institute of Cardiology</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    }) : null}
                </ScrollView>
                {/* <View style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: 20
                }}>

                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>Select Doctor</Text>
                    <Picker
                        style={{ height: 44, backgroundColor: "#d1dede", marginTop: 10, marginBottom: 20 }}
                        selectedValue={this.state.SelectedDoctor}
                        onValueChange={(itemvalue) => this.PickerFunction(itemvalue)}>
                        <Picker.Item label="select..." />
                        {this.props.navigation.state.params.ComponentState.DataLoaded && this.props.navigation.state.params.ComponentState.DoctorList.map((items, index) => {
                            return <Picker.Item label={items.FirstName + " " + items.LastName} value={items._id} key={index} />
                        })}
                    </Picker>

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
                </View> */}

                {/* {this.state.modalVisible && <Modal transparent={true}>
                    <View style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <View style={{
                            width: 300,
                            height: 400,
                            backgroundColor: "white",
                            elevation: 5,
                            borderRadius: 10,
                            padding: 20,
                            flexDirection: "column",
                        }}>

                            <Text style={{ fontSize: 18 }}>Filter Result by Specific Day</Text>
                            <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 20 }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <TouchableOpacity>
                                        <View style={{width : 20, height : 20, borderWidth : 1}}>

                                        </View>
                                    </TouchableOpacity>
                                    <Text>Monday</Text>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <CheckBox />
                                    <Text>Tuesday</Text>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <CheckBox />
                                    <Text>Wednesday</Text>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <CheckBox />
                                    <Text>Thursday</Text>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <CheckBox />
                                    <Text>Friday</Text>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <CheckBox />
                                    <Text>Saturday</Text>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <CheckBox />
                                    <Text>Sunday</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-evenly", }}>
                                <TouchableOpacity style={{ alignSelf: "center" }} >
                                    <View style={{ width: 80, height: 45, borderRadius: 5, alignItems: "center", justifyContent: "center", elevation: 2, backgroundColor: "#147562", marginTop: 10 }}>
                                        <Text style={{ fontSize: 18, color: "white" }}>Done</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ alignSelf: "center" }} onPress={() => this.setState({ modalVisible: false })}>
                                    <View style={{ width: 70, height: 45, borderRadius: 5, alignItems: "center", justifyContent: "center", elevation: 2, backgroundColor: "black", marginTop: 10 }}>
                                        <Text style={{ fontSize: 18, color: "white" }}>Reset</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>



                    </View>
                </Modal>} */}

            </View>
        )
    }
}