import React, { Component } from 'react';
import { View, TouchableOpacity, Text, ImageBackground, StatusBar, Image, TextInput, Dimensions } from 'react-native';
import Loading from '../../../images/loading.gif';
var screen =  Dimensions.get("screen");
export default class Login extends Component {

    constructor() {
        super();

        this.state = {
            email: null,
            Password: null,
            isloading: false
        }
    }


    async LoginUser() {
        const { email, Password, isDoctor } = this.state;
        if (email !== null && Password !== null) {
            if (email !== "" && Password !== "") {
                this.setState({ isloading: true })
                await fetch("https://patientdoctor-app.herokuapp.com/doctor/login", {
                    method: "POST",
                    headers: {
                        "content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        Email: this.state.email,
                        Password: this.state.Password
                    })
                })
                    .then(r => r.json().then(data => {
                        if (!r.ok) {
                            if (r.status == 500) {
                                fetch("https://patientdoctor-app.herokuapp.com/patient/login", {
                                    method: "POST",
                                    headers: {
                                        "content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                        Email: this.state.email,
                                        Password: this.state.Password
                                    })
                                }).then(res => res.json().then(data2 => {
                                    if (!res.ok) {
                                        this.setState({ isloading: false })
                                        alert(JSON.stringify(data2))
                                    }
                                    else {
                                        console.log("PatientHomeScreen ==>", data2.user[0])
                                        this.setState({ isloading: false })
                                        this.props.navigation.push("PatientHomeScreen", { UserData: data2.user[0] })
                                    }
                                }))
                            }
                            else if (r.status == 401) {
                                this.setState({ isloading: false })
                                alert(JSON.stringify(data))
                            }
                        }
                        else {
                            console.log("DoctorHomeScreen ==>", data.user[0])
                            this.setState({ isloading: false })
                            this.props.navigation.push("DoctorHomeScreen", { UserData: data.user[0] })
                        }
                    }))
            }
        }
    }


    render() {
        return (
            <View style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", }}>
                <StatusBar hidden={true} />
                <View style={{ height: 120, width: "100%", backgroundColor: "#147562", alignItems: "center", justifyContent: "center", flexDirection: "row" }}>
                    <Image source={require('../../../images/ric.jpg')} style={{ height: 70, width: 70, borderRadius: 100 }} />
                    <Text style={{ fontSize: 25, marginLeft: 20, color: "white" }}>Patient Care</Text>
                </View>

                <Text style={{ fontSize: 22, marginTop: 20, fontWeight: "bold", alignSelf: "center" }}>Rawalpindi Institute of Cardiology</Text>
                <Text style={{ fontSize: 23, marginTop: 20 }}>login to your account</Text>

                <View style={{ flexDirection: "column", width: "80%", marginTop: 30 }}>

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
                        <TouchableOpacity onPress={() => this.LoginUser()}>
                            <View style={{ width: 130, padding: 10, borderRadius: 40, borderWidth: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#147562", elevation: 5 }}>
                                <Text style={{ fontSize: 20, color: "white" }}>Login</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </View>
                <View style={{ flexDirection: "row", marginTop: 15 }}>
                    <Text style={{ fontSize: 16 }}>Don't have an account </Text><TouchableOpacity onPress={() => this.props.navigation.push("SignupScreen")}><Text style={{ fontWeight: "bold", fontSize: 17, color: "#37465e" }}>Signup</Text></TouchableOpacity>
                </View>

                {this.state.isloading && <View style={{position : "absolute", left: "50%"}}><Image source={Loading} style={{left: "-50%", width : 250, height : 250, position : "relative"}}/></View>}
            </View>
        )
    }
}