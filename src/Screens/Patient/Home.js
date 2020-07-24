import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image, ScrollView } from 'react-native';
import { Menu } from '../../component/Menu';
import OneSignal from 'react-native-onesignal';
import Icon from "react-native-vector-icons/AntDesign";


export default class Home extends Component {

    constructor(properties) {
        super(properties);

    }
    render() {
        console.log(this.props.navigation.state.params.UserData)
        return (
            <View style={{ flex: 1 }}>
                <View style={{ width: "100%", height: 70, alignItems: "center", justifyContent: "space-between", flexDirection: "row", padding: 20, backgroundColor: "#147562" }}>
                    <Image source={require('../../../images/ric.jpg')} style={{ borderRadius: 100, height: 50, width: 50 }} />
                    <Text style={{ fontSize: 24, color: "white" }}>Dashboard</Text>
                    <TouchableOpacity onPress={() => this.props.navigation.push("LoginScreen")}><Icon name="logout" color="white" size={25} /></TouchableOpacity>
                </View>
                <ScrollView>
                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                        <Menu Value="Appointment" IconName="stethoscope" onClick={() => this.props.navigation.push("Appointment", { UserData: this.props.navigation.state.params.UserData })} />
                        <Menu Value="Diagnostics" IconName="microscope" onClick={() => this.props.navigation.push("Diagnostic", { UserData: this.props.navigation.state.params.UserData })} />
                        <Menu Value="Lab Reports" IconName="plus-square" onClick={() => this.props.navigation.push("Lab Report", { UserData: this.props.navigation.state.params.UserData })}/>
                        <Menu Value="eRx" IconName="prescription" onClick={() => this.props.navigation.push("eRx", { UserData: this.props.navigation.state.params.UserData })}/>
                        <Menu Value="Health Summary" IconName="file-medical-alt" onClick={() => this.props.navigation.push("Health Summary", { UserData: this.props.navigation.state.params.UserData })}/>
                        <Menu Value="Discharge Reports" IconName="bed"  onClick={() => this.props.navigation.push("Discharge Report", { UserData: this.props.navigation.state.params.UserData })}/>
                        <Menu Value="Profile" IconName="product-hunt" onClick={() => this.props.navigation.push("Profile", { UserData: this.props.navigation.state.params.UserData })}/>
                    </View>
                </ScrollView>
            </View>
        )
    }
}