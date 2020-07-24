import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image, ScrollView, TextInput } from 'react-native';
import { Content, Tab, Tabs, ScrollableTab } from 'native-base';
import Icon from "react-native-vector-icons/AntDesign";

export default class Measurement extends Component {

    constructor() {
        super();

        this.state = {
            height: null,
            Weight: null
        }
    }

    AddMeasurement() {
        fetch("https://patientdoctor-app.herokuapp.com/patient/AddMeasurment", {
            method: "POST",
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify({
                patientID: this.props.navigation.state.params.UserData._id,
                MeasurementData: {
                    Height: this.state.height,
                    Weight: this.state.Weight
                }
            })
        }).then(res => res.json()).then((response) => {
            this.setState({
                height: null,
                Weight: null
            })
            this.GetupdatedResult()
        })
    }

    async componentDidMount() {
        await await fetch("https://patientdoctor-app.herokuapp.com/patient/profile", {
            method: "POST",
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify({
                _id: this.props.navigation.state.params.UserData._id,
            })
        }).then(res => res.json()).then(response => {
            console.log(response.user[0].Measurment)
            this.setState({
                BloodPressure: response.user[0].BloodPressure,
                Measurment: response.user[0].Measurment
            })
        })
    }

    async GetupdatedResult() {
        await await fetch("https://patientdoctor-app.herokuapp.com/patient/profile", {
            method: "POST",
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify({
                _id: this.props.navigation.state.params.UserData._id,
            })
        }).then(res => res.json()).then(response => {
            console.log(response.user[0].Measurment)
            this.setState({
                BloodPressure: response.user[0].BloodPressure,
                Measurment: response.user[0].Measurment
            })
        })
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ width: "100%", height: 70, alignItems: "center", justifyContent: "flex-start", flexDirection: "row", padding: 20, backgroundColor: "#147562" }}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()} >
                        <View style={{ flexDirection: "column" }}>
                            <Icon name="back" color="white" size={26} />
                        </View>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 24, color: "white", marginLeft: 30 }}>Measurement</Text>
                </View>
                <Tabs>
                    <Tab heading="Latest" tabStyle={{ backgroundColor: '#147562' }} textStyle={{ color: '#fff' }} activeTabStyle={{ backgroundColor: '#147562' }} activeTextStyle={{ color: '#fff', fontWeight: 'normal' }}>
                        <View style={{ padding: 25, alignItems: "center", justifyContent: "center" }}>
                            <Text style={{ fontSize: 24, fontWeight: "bold" }}>Manually Record</Text>
                            <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: 30 }}>
                                <View style={{ height: 120, width: 250, elevation: 3, borderLeftWidth: 8, borderRadius: 8, borderLeftColor: "#147562", padding: 15 }}>
                                    <Text style={{ alignSelf: "center", fontSize: 18 }}>Height (cm)</Text>
                                    <View style={{ flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", marginTop: 30 }}>
                                        <Text>Height</Text>
                                        <TextInput style={{ width: 40, height: 40, borderWidth: 1 }}
                                            onChangeText={height => this.setState({ height })}
                                            value={this.state.height} />
                                    </View>
                                </View>
                                <View style={{ height: 120, width: 250, elevation: 3, borderLeftWidth: 8, borderRadius: 8, borderLeftColor: "#147562", marginTop: 10, padding: 15 }}>
                                    <Text style={{ alignSelf: "center", fontSize: 18 }}>Weight (cm)</Text>
                                    <View style={{ flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", marginTop: 30 }}>
                                        <Text>Weight</Text>
                                        <TextInput style={{ width: 40, height: 40, borderWidth: 1 }}
                                            onChangeText={Weight => this.setState({ Weight })}
                                            value={this.state.Weight} />
                                    </View>
                                </View>
                            </View>

                            <TouchableOpacity style={{ alignSelf: "center", marginTop: 20 }} onPress={() => this.AddMeasurement()}>
                                <View style={{ width: 90, height: 45, borderRadius: 5, alignItems: "center", justifyContent: "center", elevation: 2, backgroundColor: "#147562", marginTop: 10 }}>
                                    <Text style={{ fontSize: 18, color: "white" }}>Save</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </Tab>
                    <Tab heading="History" tabStyle={{ backgroundColor: '#147562' }} textStyle={{ color: '#fff' }} activeTabStyle={{ backgroundColor: '#147562' }} activeTextStyle={{ color: '#fff', fontWeight: 'normal' }}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {this.state.Measurment && this.state.Measurment.map((items, index) => {
                                console.log(items.Date)
                                return <TouchableOpacity key={index}>
                                    <View style={{ height: 130, borderLeftWidth: 7, borderLeftColor: "#147562", elevation: 3, borderRadius: 8, padding: 15, }}>
                                        <Text style={{ alignSelf: "center", fontWeight: "bold", fontSize: 19 }}>{items.Date + " " + items.Time}</Text>
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
                                            <View style={{ flexDirection: "column", alignItems: "center" }}>
                                                <Text style={{ fontSize: 20 }}>Height</Text>
                                                <Text style={{ fontSize: 20 }}>{items.MeasuremntObj.Height}</Text>
                                            </View>
                                            <View style={{ flexDirection: "column", alignItems: "center" }}>
                                                <Text style={{ fontSize: 20 }}>Weight</Text>
                                                <Text style={{ fontSize: 20 }}>{items.MeasuremntObj.Weight}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            })}
                        </ScrollView>
                    </Tab>
                </Tabs>
            </View>
        )
    }
}