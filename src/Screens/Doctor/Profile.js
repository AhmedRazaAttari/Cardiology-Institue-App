import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image, ScrollView, TextInput, Dimensions, Modal, Picker } from 'react-native';
var screen = Dimensions.get("screen")
import Icon from "react-native-vector-icons/AntDesign";

export default class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            SpecialitiesModal: false,
            TimingModal: false,
            SelectedSpeciality: null,
            SelectedLocation: "Rawalpindi Institute of Cardiology",
            userSpecialities: [],
            userTimings: [],
            SelectedDay: null,
            SelectedTiming: null,
            Dataloaded: false
        }
    }

    async AddingSpeciality() {
        const { SelectedSpeciality } = this.state;
        if (SelectedSpeciality !== null) {
            await fetch("https://patientdoctor-app.herokuapp.com/doctor/updateprofile/speciality", {
                method: "POST",
                headers: {
                    "content-Type": "application/json"
                },
                body: JSON.stringify({
                    _id: this.props.navigation.state.params.Profile._id,
                    Specialities: this.state.SelectedSpeciality
                })
            })
                .then(r => r.json().then(data => {
                    if (!r.ok) {
                        alert(JSON.stringify(data))
                    }
                    else {
                        this.setState({
                            SpecialitiesModal: false
                        })
                        this.getUpdatedResult()
                        // this.props.navigation.push("DoctorHomeScreen", { UserData: this.props.navigation.state.params.Profile })
                    }
                }))
        } else {
            alert("Please select Speciality")
        }
    }

    async AddingTime() {
        const { SelectedLocation, SelectedDay, SelectedTiming } = this.state;
        if (SelectedLocation !== null && SelectedDay !== null && SelectedTiming !== null) {
            await fetch("https://patientdoctor-app.herokuapp.com/doctor/updateprofile/Timing", {
                method: "POST",
                headers: {
                    "content-Type": "application/json"
                },
                body: JSON.stringify({
                    _id: this.props.navigation.state.params.Profile._id,
                    TimingAndLocation: {
                        Timing: this.state.SelectedTiming,
                        Day: this.state.SelectedDay,
                        Venue: this.state.SelectedLocation,
                    }
                })
            })
                .then(r => r.json().then(data => {
                    if (!r.ok) {
                        alert(JSON.stringify(data))
                    }
                    else {
                        this.setState({
                            TimingModal: false
                        })
                        this.getUpdatedResult()
                        // this.props.navigation.push("DoctorHomeScreen", { UserData: this.props.navigation.state.params.Profile })
                    }
                }))
        } else {
            alert("Please select fields first")
        }
    }

    async getUpdatedResult(){
        await fetch("https://patientdoctor-app.herokuapp.com/doctor/profile", {
            method: "POST",
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify({
                _id: this.props.navigation.state.params.Profile._id,
            })
        }).then(res => res.json()).then(response => response.profile.map(item => this.setState({ userSpecialities: item.Specialities, userTimings: item.TimingAndLocation, Dataloaded: true })))
    }

    async componentDidMount() {
        await fetch("https://patientdoctor-app.herokuapp.com/doctor/profile", {
            method: "POST",
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify({
                _id: this.props.navigation.state.params.Profile._id,
            })
        }).then(res => res.json()).then(response => response.profile.map(item => this.setState({ userSpecialities: item.Specialities, userTimings: item.TimingAndLocation, Dataloaded: true })))
    }

    render() {
        // console.log(this.state)
        var data = this.props.navigation.state.params.Profile
        // this.state.userData.map(item => console.log(item))
        return (
            <View style={{ flex: 1 }}>
                <View style={{ width: "100%", height: 70, alignItems: "center", justifyContent: "flex-start", flexDirection: "row", padding: 20, backgroundColor: "#16A085" }}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Icon name="back" color="white" size={26} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 24, color: "white", marginLeft: 30 }}>Profile</Text>
                </View>
                <ScrollView>
                    <View style={{ padding: 25 }}>
                        <Text style={{ fontSize: 22, fontWeight: "bold" }}>Your Personal info</Text>
                        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: 25 }}>
                            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Name : </Text>
                            <Text style={{ fontSize: 20, marginLeft: 25 }}>{data.FirstName + " " + data.LastName}</Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: 15 }}>
                            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Email : </Text>
                            <Text style={{ fontSize: 20, marginLeft: 25 }}>{data.Email}</Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: 25 }}>
                            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Phone# : </Text>
                            <Text style={{ fontSize: 20, marginLeft: 25 }}>{data.PhoneNo}</Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: 15 }}>
                            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Gender : </Text>
                            <Text style={{ fontSize: 20, marginLeft: 25 }}>{data.Gender}</Text>
                        </View>
                        <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "flex-start", marginTop: 15 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Specialities : </Text>
                                <TouchableOpacity onPress={() => this.setState({ SpecialitiesModal: true })}>
                                    <View style={{ justifyContent: "center", alignItems: "center", borderRadius: 100, padding: 5, backgroundColor: "#16A085" }}>
                                        <Icon name="plus" color="white" size={20} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                                {this.state.Dataloaded && this.state.userSpecialities.length ? this.state.userSpecialities.map((items, index) => {
                                    return <View style={{ minWidth: 120, padding: 10, maxWidth: 'auto', height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center", elevation: 2, margin: 5, marginTop: 10 }} key={index}>
                                        <Text style={{ fontSize: 20, color: "black" }}>{items}</Text>
                                    </View>
                                }) : <Text>No Specialities added yet</Text>}
                            </View>
                        </View>
                        <View style={{ flexDirection: "column", alignItems: "flex-start", marginTop: 15 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Your Available timings : </Text>
                                <TouchableOpacity onPress={() => this.setState({ TimingModal: true })}>
                                    <View style={{ justifyContent: "center", alignItems: "center", borderRadius: 100, padding: 5, backgroundColor: "#16A085" }}>
                                        <Icon name="plus" color="white" size={20} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: "row", width: "auto", height: 250 }}>
                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                    {this.state.Dataloaded && this.state.userTimings.length ? this.state.userTimings.map((items, index) => {
                                        console.log(items)
                                        return <View style={{ width: 200, padding: 10, height: 160, borderRadius: 10, alignItems: "center", justifyContent: "center", elevation: 2, marginTop: 15, borderLeftWidth: 7, borderLeftColor: "#16A085", marginLeft: 10 }} key={index}>
                                            <View style={{ flexDirection: "column" }}>
                                                <Text style={{ fontSize: 20, color: "black", fontWeight: "bold" }}>{items.Venue}</Text>
                                                <Text style={{ fontSize: 20, color: "black" }}>Day : {items.Day}</Text>
                                                <Text style={{ fontSize: 20, color: "black" }}>Timings : {items.Timing}</Text>
                                            </View>
                                        </View>
                                    }) : <Text>No Timings added yet</Text>}
                                </ScrollView>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                {this.state.SpecialitiesModal ? <Modal transparent={true}>
                    <View style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <View style={{
                            width: 300,
                            height: 200,
                            backgroundColor: "white",
                            elevation: 5,
                            borderRadius: 10,
                            padding: 20,
                            flexDirection: "column",
                        }}>

                            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Select Speciality</Text>
                            <Picker
                                style={{ height: 44, backgroundColor: "#d1dede", marginTop: 10, marginBottom: 20 }}
                                selectedValue={this.state.SelectedSpeciality}
                                onValueChange={(itemvalue, indexitem) =>
                                    this.setState({ SelectedSpeciality: itemvalue })
                                }>
                                <Picker.Item label="select..." />
                                <Picker.Item label="Surgery" value="Surgery" />
                                <Picker.Item label="Pediatrics" value="Pediatrics" />
                                <Picker.Item label="Hemotology" value="Hemotology" />
                                <Picker.Item label="Radiology" value="Radiology" />
                                <Picker.Item label="Neurology" value="Neurology" />
                                <Picker.Item label="Dermatology" value="Dermatology" />
                                <Picker.Item label="Psychiatry" value="Psychiatry" />
                                <Picker.Item label="Cardiology" value="Cardiology" />
                                <Picker.Item label="Ophthalmology" value="Ophthalmology" />
                                <Picker.Item label="Pathology" value="Pathology" />
                                <Picker.Item label="Urology" value="Urology" />
                                <Picker.Item label="Endocrinology" value="Endocrinology" />
                                <Picker.Item label="Neurosurgery" value="Neurosurgery" />
                                <Picker.Item label="Immunology" value="Immunology" />
                                <Picker.Item label="Pathology" value="Pathology" />
                                <Picker.Item label="Urology" value="Urology" />
                                <Picker.Item label="Endocrinologist" value="Endocrinologist" />
                                <Picker.Item label="Oncologist" value="Oncologist" />
                            </Picker>
                            <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                                <TouchableOpacity onPress={() => this.AddingSpeciality()}>
                                    <View style={{ justifyContent: "center", alignItems: "center", alignSelf: "center", borderRadius: 30, height: 50, width: 100, backgroundColor: "#16A085" }}>
                                        <Text style={{ color: "white", fontSize: 16 }}>Add</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.setState({ SpecialitiesModal: false })}>
                                    <View style={{ justifyContent: "center", alignItems: "center", alignSelf: "center", borderRadius: 30, height: 50, width: 100, backgroundColor: "black" }}>
                                        <Text style={{ color: "white", fontSize: 16 }}>cancel</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal> : null}
                {this.state.TimingModal ? <Modal transparent={true}>
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
                            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Select Location</Text>
                            <Picker
                                mode="dropdown"
                                style={{ height: 44, backgroundColor: "#d1dede", marginTop: 10, marginBottom: 20 }}
                                selectedValue={this.state.SelectedLocation}
                                onValueChange={(itemvalue, indexitem) =>
                                    this.setState({ SelectedLocation: itemvalue })
                                }>
                                <Picker.Item label="Rawalpindi Institute of Cardiology" value="Rawalpindi Institute of Cardiology" />
                            </Picker>
                            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Select Day</Text>
                            <Picker
                                style={{ height: 44, backgroundColor: "#d1dede", marginTop: 10, marginBottom: 20 }}
                                selectedValue={this.state.SelectedDay}
                                onValueChange={(itemvalue, indexitem) =>
                                    this.setState({ SelectedDay: itemvalue })
                                }>
                                <Picker.Item label="select..." />
                                <Picker.Item label="Monday" value="Monday" />
                                <Picker.Item label="Tueday" value="Tueday" />
                                <Picker.Item label="Wednesday" value="Wednesday" />
                                <Picker.Item label="Thursday" value="Thursday" />
                                <Picker.Item label="Friday" value="Friday" />
                                <Picker.Item label="Saturday" value="Saturday" />
                                <Picker.Item label="Sunday" value="Sunday" />
                            </Picker>
                            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Select Timing</Text>
                            <Picker
                                style={{ height: 44, backgroundColor: "#d1dede", marginTop: 10, marginBottom: 20 }}
                                selectedValue={this.state.SelectedTiming}
                                onValueChange={(itemvalue, indexitem) =>
                                    this.setState({ SelectedTiming: itemvalue })
                                }>
                                <Picker.Item label="select..." />
                                <Picker.Item label="10:00AM - 12:00PM" value="10:00AM - 12:00PM" />
                                <Picker.Item label="11:00AM - 12:00PM" value="11:00AM - 12:00PM" />
                                <Picker.Item label="02:00PM - 04:00PM" value="02:00PM - 04:00PM" />
                                <Picker.Item label="05:00PM - 07:00PM" value="05:00PM - 07:00PM" />
                                <Picker.Item label="08:00PM - 10:00PM" value="08:00PM - 10:00PM" />
                            </Picker>
                            <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                                <TouchableOpacity onPress={() => this.AddingTime()}>
                                    <View style={{ justifyContent: "center", alignItems: "center", alignSelf: "center", borderRadius: 30, height: 50, width: 100, backgroundColor: "#16A085" }}>
                                        <Text style={{ color: "white", fontSize: 16 }}>Add</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.setState({ TimingModal: false })}>
                                    <View style={{ justifyContent: "center", alignItems: "center", alignSelf: "center", borderRadius: 30, height: 50, width: 100, backgroundColor: "black" }}>
                                        <Text style={{ color: "white", fontSize: 16 }}>cancel</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal> : null}


            </View>

        )
    }
}