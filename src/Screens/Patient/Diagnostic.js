import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image, ScrollView } from 'react-native';
import Icon from "react-native-vector-icons/AntDesign";

export default class Diagnostic extends Component {

    constructor() {
        super();
        this.state = {
            CurrentUserProfile: []
        }
    }

    async componentDidMount() {
        await fetch("https://patientdoctor-app.herokuapp.com/patient/profile", {
            method: "POST",
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify({
                _id: this.props.navigation.state.params.UserData._id,
            })
        }).then(res => res.json()).then(response => {
            console.log(response.user)
            this.setState({
                CurrentUserProfile: response,
                profileLoaded: true
            })
        })
    }

    render() {
        return (
            <View>
                <View style={{ width: "100%", height: 70, alignItems: "center", justifyContent: "flex-start", flexDirection: "row", padding: 20, backgroundColor: "#147562" }}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()} >
                        <View style={{ flexDirection: "column" }}>
                        <Icon name="back" color="white" size={26} />
                        </View>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 24, color: "white", marginLeft: 30 }}>Diagnostic</Text>
                </View>

                <ScrollView>
                    {this.state.profileLoaded && this.state.CurrentUserProfile.user.map((items, index) => {
                        return items.AcceptedAppointments.map((items2, index2) => {
                            return <View style={{
                                // marginTop: 15,
                                borderColor: '#147562',
                                borderWidth: 3,
                                borderLeftWidth: 10,
                                borderRadius: 20,
                                margin: 5,
                                backgroundColor: 'white',
                                padding: 2,
                                height: 185,
                                marginBottom: 15
                            }} key={index2}>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 5, }}>
                                    <Text style={{ color: 'black', fontSize: 14, marginTop: 5, fontWeight: 'bold', }}>Prescribed By</Text>
                                    <Text>{items2.data.doctorName}</Text>
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 5, }}>
                                    <Text style={{ color: 'black', fontSize: 14, marginTop: 5, fontWeight: 'bold', }}>Visit time</Text>
                                    <Text>{items2.data.AppoitmentTiming.day + " " + items2.data.AppoitmentTiming.Time}</Text>
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 5, }}>
                                    <Text style={{ color: 'black', fontSize: 14, marginTop: 5, fontWeight: 'bold', }}>Test name</Text>
                                    <Text style={{ fontSize: 13 }}>...</Text>
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 5, }}>
                                    <Text style={{ color: 'black', fontSize: 14, marginTop: 5, fontWeight: 'bold', }}>Patient Status</Text>
                                    <Text style={{ fontSize: 13 }}>{items2.data.Status}</Text>
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 5, }}>
                                    <Text style={{ color: 'black', fontSize: 14, marginTop: 5, fontWeight: 'bold', }}>Report</Text>
                                    <Text>...</Text>
                                </View>
                            </View>
                        })
                    })}
                    <View style={{ height: 70 }}></View>
                </ScrollView>

            </View>
        )
    }
}