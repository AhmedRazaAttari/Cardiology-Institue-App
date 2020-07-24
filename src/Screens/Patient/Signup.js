import React, { Component } from 'react';
import { View, TouchableOpacity, Text, ImageBackground, StatusBar, Image, TextInput,Picker , Alert, ScrollView, Dimensions, AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import Loading from '../../../images/loading.gif';
var screen = Dimensions.get("screen");
import OneSignal from 'react-native-onesignal';

export default class Signup extends Component {

    constructor() {
        super();
        OneSignal.init("75c9bfef-9601-4422-b826-53c93cb2b292");

        this.state = {
            FName: null,
            LName: null,
            email: null,
            phoneno: null,
            Gender : null,
            cnic: null,
            Password: null,
            isDoctor: false,
            DoctorData: [],
            dataLoaded: false,
            PatientData: [],
            isloading: false
        }

        this.RegisterUser = this.RegisterUser.bind(this)

    }

    componentDidMount() {
        OneSignal.addEventListener('ids', this.onIds);
    }

    componentWillUnmount() {
        OneSignal.removeEventListener('ids', this.onIds);
    }

    onIds(device) {
        console.log('Device info: ', device);
    }

    async RegisterUser() {

        const { FName, LName, email, phoneno, Password, isDoctor } = this.state;
        if (FName !== null && LName !== null && email !== null && phoneno !== null && Password !== null) {
            if (FName !== "" && LName !== "" && email !== "" && phoneno !== null && Password !== "") {
                if (isDoctor == true) {
                    this.setState({ isloading: true })
                    await fetch("https://patientdoctor-app.herokuapp.com/doctor/register", {
                        method: "POST",
                        headers: {
                            "content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            FirstName: this.state.FName,
                            LastName: this.state.LName,
                            Email: this.state.email,
                            PhoneNo: this.state.phoneno,
                            Gender : this.state.Gender,
                            Password: this.state.Password
                        })
                    }).then(r => r.json().then(data => {
                        if (!r.ok) {
                            this.setState({ isloading: false })
                            alert(JSON.stringify(data))
                        }
                        else {
                            var DoctorData = {}
                            var response = Object.values(data)
                            for (let [key, value] of Object.entries(response[0])) {
                                DoctorData[`${key}`] = `${value}`
                                // console.log(`${key}: ${value}`);
                            }
                            this.setState({ isloading: false })
                            this.props.navigation.push("DoctorHomeScreen", { UserData: DoctorData })
                        }
                    }))
                }
                else {
                    this.setState({ isloading: true })
                    await fetch("https://patientdoctor-app.herokuapp.com/patient/register", {
                        method: "POST",
                        headers: {
                            "content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            FirstName: this.state.FName,
                            LastName: this.state.LName,
                            Email: this.state.email,
                            PhoneNo: this.state.phoneno,
                            Gender : this.state.Gender,
                            Password: this.state.Password
                        })
                    })
                        .then(r2 => r2.json().then(data2 => {
                            if (!r2.ok) {
                                this.setState({ isloading: false })

                                alert(JSON.stringify(data2))
                            }
                            else {

                                var patientData = {}
                                var response = Object.values(data2)
                                for (let [key, value] of Object.entries(response[0])) {
                                    patientData[`${key}`] = `${value}`
                                    // console.log(`${key}: ${value}`);
                                }
                                this.setState({ isloading: false })

                                this.props.navigation.push("PatientHomeScreen", { UserData: patientData })
                            }
                        }))
                }
            }
        }
    }


    render() {
        return (
            <View style={{ flex: 1 }}>
                <StatusBar hidden={true} />
                <View style={{ height: 100, width: "100%", backgroundColor: "#147562", alignItems: "center", justifyContent: "center", flexDirection: "row" }}>
                    <Image source={require('../../../images/ric.jpg')} style={{ height: 70, width: 70, borderRadius: 100 }} />
                    <Text style={{ fontSize: 25, marginLeft: 20, color: "white" }}>Patient Care</Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ fontSize: 26, marginTop: 15, fontWeight: "bold" }}>Register</Text>
                        <View style={{ flexDirection: "column", width: "80%", marginTop: 20, }}>
                            <Text style={{ fontSize: 22, alignSelf: "flex-start", marginLeft: 10, marginBottom: 5 }}>I am</Text>
                            <View style={{ flexDirection: "row", justifyContent: "space-around", width: "100%", marginBottom: 20 }}>
                                <TouchableOpacity onPress={() => this.setState({ isDoctor: false })}>
                                    <View style={{ width: 120, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center", elevation: 2, backgroundColor: !this.state.isDoctor ? "#147562" : null }}>
                                        <Text style={{ fontSize: 20, color: !this.state.isDoctor ? "white" : "black" }}>Patient</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.setState({ isDoctor: true })}>
                                    <View style={{ width: 120, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center", elevation: 2, backgroundColor: this.state.isDoctor ? "#147562" : null }}>
                                        <Text style={{ fontSize: 20, color: this.state.isDoctor ? "white" : "black" }}>Doctor</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <TextInput
                                placeholder="First name"
                                placeholderTextColor="black"
                                onChangeText={FName => this.setState({ FName })}
                                value={this.state.FName}
                                style={{
                                    marginTop: 10,
                                    borderRadius: 10,
                                    padding: 10,
                                    color: 'black',
                                    width: 285,
                                    height: 50,
                                    elevation: 1
                                }}
                            />
                            <TextInput
                                placeholder="Last name"
                                placeholderTextColor="black"
                                onChangeText={LName => this.setState({ LName })}
                                value={this.state.LName}
                                style={{
                                    marginTop: 10,
                                    borderRadius: 10,
                                    padding: 10,
                                    color: 'black',
                                    width: 285,
                                    height: 50,
                                    elevation: 1
                                }}
                            />
                            <TextInput
                                placeholder="Email"
                                placeholderTextColor="black"
                                onChangeText={email => this.setState({ email })}
                                value={this.state.email}
                                style={{
                                    marginTop: 10,
                                    borderRadius: 10,
                                    padding: 10,
                                    color: 'black',
                                    width: 285,
                                    height: 50,
                                    elevation: 1
                                }}
                            />
                            <TextInput
                                placeholder="Phone number"
                                placeholderTextColor="black"
                                onChangeText={phoneno => this.setState({ phoneno })}
                                value={this.state.phoneno}
                                style={{
                                    marginTop: 10,
                                    borderRadius: 10,
                                    padding: 10,
                                    color: 'black',
                                    width: 285,
                                    height: 50,
                                    elevation: 1
                                }}
                            />
                            <Picker
                                style={{ height: 44, backgroundColor: "#d1dede", marginTop: 10 }}
                                selectedValue={this.state.Gender}
                                onValueChange={(itemvalue) => this.setState({ Gender: itemvalue })}>
                                <Picker.Item label="select gender" />
                                <Picker.Item label="Male" value="Male" />
                                <Picker.Item label="female" value="female" />
                            </Picker>
                            <TextInput
                                placeholder="Password"
                                placeholderTextColor="black"
                                onChangeText={Password => this.setState({ Password })}
                                value={this.state.Password}
                                style={{
                                    marginTop: 10,
                                    borderRadius: 10,
                                    padding: 10,
                                    color: 'black',
                                    width: 285,
                                    height: 50,
                                    elevation: 1
                                }}
                            />
                            <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 20 }}>
                                <TouchableOpacity onPress={() => this.RegisterUser()}>
                                    <View style={{ width: 130, padding: 10, borderRadius: 40, borderWidth: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#147562", elevation: 5 }}>
                                        <Text style={{ fontSize: 20, color: "white" }}>{this.state.isloading ? "Loading..." : "Register"}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                        </View>
                        <View style={{ flexDirection: "row", marginTop: 15, marginBottom: 10 }}>
                            <Text style={{ fontSize: 16 }}>Already have an account </Text><TouchableOpacity onPress={() => this.props.navigation.push("LoginScreen")}><Text style={{ fontWeight: "bold", fontSize: 17, color: "#37465e" }}>Login</Text></TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>

                {/* {this.state.isloading && <View style={{ position: "absolute", left: "50%" }}><Image source={Loading} style={{ left: "-50%", width: 250, height: 250, position: "relative" }} /></View>} */}
            </View>
        )
    }
}