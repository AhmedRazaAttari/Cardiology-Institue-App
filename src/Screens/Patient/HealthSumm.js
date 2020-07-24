import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image, ScrollView } from 'react-native';
import { Menu } from '../../component/Menu';
import Icon from "react-native-vector-icons/AntDesign";

export default class HealthSumm extends Component {
    constructor() {
        super();
        this.state = {

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
            // console.log(response.user[0])
            var LastValue = response.user[0].BloodPressure.pop();
            var BPDiastolic = LastValue.BloodPressureObj.BPDiastolic
            var BPSystolic = LastValue.BloodPressureObj.BPSystolic
            var LastValue2 = response.user[0].Measurment.pop();
            var Weight = LastValue2.MeasuremntObj.Weight
            var Height = LastValue2.MeasuremntObj.Height
            this.setState({
                Name: response.user[0].FirstName + " " + response.user[0].LastName,
                Email: response.user[0].Email,
                BPDiastolic: BPDiastolic,
                BPSystolic: BPSystolic,
                Weight: Weight,
                Height: Height,
                LabReports: response.user[0].LabReports,
                eRx: response.user[0].eRx,
                ProfileLoaded: true
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
                    <Text style={{ fontSize: 24, color: "white", marginLeft: 30 }}>HealthSummary</Text>
                </View>

                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
                    <View style={{ padding: 10, flexDirection: "row", height: 200 }}>
                        
                        <TouchableOpacity onPress={() => this.props.navigation.push("BloodPressure", { UserData: this.props.navigation.state.params.UserData })}>
                            <View style={{ height: 120, width: 190, borderLeftWidth: 7, borderLeftColor: "#147562", elevation: 3, borderRadius: 8, marginLeft: 5, padding: 10 }}>
                                <Text style={{ alignSelf: "center", fontWeight: "bold", fontSize: 21, }}>Blood Pressure</Text>
                                <Text style={{ alignSelf: "center", fontWeight: "bold", fontSize: 20, marginTop: 10 }}>{this.state.ProfileLoaded ? this.state.BPDiastolic + "/" + this.state.BPSystolic : "50/77"}</Text>
                                <View style={{ alignSelf: "flex-end", marginTop: 10 }}>
                                    <Text>mmHg</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.push("Measurement", { UserData: this.props.navigation.state.params.UserData })}>
                            <View style={{ height: 120, width: 190, borderLeftWidth: 7, borderLeftColor: "#147562", elevation: 3, borderRadius: 8, marginLeft: 5, padding: 10 }}>
                                <Text style={{ alignSelf: "center", fontWeight: "bold", fontSize: 21, }}>Measurments</Text>
                                <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                                    <Text style={{ fontSize: 18 }}>Height</Text>
                                    <Text style={{ fontSize: 18 }}>Weight</Text>
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>{this.state.ProfileLoaded ? this.state.Height : "100"}</Text>
                                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>{this.state.ProfileLoaded ? this.state.Weight : "150"}</Text>
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                                    <Text>cm</Text>
                                    <Text>kg</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ padding: 10, flexDirection: "column", marginTop: 30 }}>
                        <TouchableOpacity>
                            <View style={{ height: 130, borderLeftWidth: 7, borderLeftColor: "#147562", elevation: 3, borderRadius: 8, padding: 15, marginTop: 5 }}>
                                <Text style={{ alignSelf: "center", fontWeight: "bold", fontSize: 19 }}>Alergies</Text>
                                <View
                                    style={{
                                        marginTop: 20,
                                        borderBottomColor: '#c0c4cc',
                                        borderBottomWidth: 1,
                                    }}
                                />
                                <View style={{ padding: 20, paddingLeft: 10 }}>
                                    <Text>No Known Alergies</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={{ height: 130, borderLeftWidth: 7, borderLeftColor: "#147562", elevation: 3, borderRadius: 8, padding: 15, marginTop: 10 }}>
                                <Text style={{ alignSelf: "center", fontWeight: "bold", fontSize: 19 }}>Diagnosis</Text>
                                <View
                                    style={{
                                        marginTop: 20,
                                        borderBottomColor: '#c0c4cc',
                                        borderBottomWidth: 1,
                                    }}
                                />
                                <View style={{ padding: 13, paddingLeft: 10, display: "flex", flexDirection : "row",  justifyContent: "space-between", alignItems: "center" }}>
                                    <View style={{ flexDirection: "column", alignItems: "center" }}>
                                        <Text style={{ fontSize: 20 }}>Test</Text>
                                        <Text style={{ fontSize: 16 }}>X-Ray KUB</Text>
                                    </View>
                                    <View style={{ flexDirection: "column", alignItems: "center" }}>
                                        <Text style={{ fontSize: 20 }}>Status</Text>
                                        <Text style={{ fontSize: 16 }}>Pending</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={{ height: 130, borderLeftWidth: 7, borderLeftColor: "#147562", elevation: 3, borderRadius: 8, padding: 15, marginTop: 10 }}>
                                <Text style={{ alignSelf: "center", fontWeight: "bold", fontSize: 19 }}>Last Lab Reports</Text>
                                <View
                                    style={{
                                        marginTop: 20,
                                        borderBottomColor: '#c0c4cc',
                                        borderBottomWidth: 1,
                                    }}
                                />
                                <View style={{ padding: 15, paddingLeft: 10, display: "flex", flexDirection : "row", justifyContent: "space-between", alignItems: "center" }}>
                                    <View style={{ flexDirection: "column", alignItems: "center" }}>
                                        <Text style={{ fontSize: 20 }}>Test</Text>
                                        <Text style={{ fontSize: 20 }}>---</Text>
                                    </View>
                                    <View style={{ flexDirection: "column", alignItems: "center" }}>
                                        <Text style={{ fontSize: 20 }}>Status</Text>
                                        <Text style={{ fontSize: 20 }}>---</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={{ height: 130, borderLeftWidth: 7, borderLeftColor: "#147562", elevation: 3, borderRadius: 8, padding: 15, marginTop: 10 }}>
                                <Text style={{ alignSelf: "center", fontWeight: "bold", fontSize: 19 }}>Last Medicines</Text>
                                <View
                                    style={{
                                        marginTop: 20,
                                        borderBottomColor: '#c0c4cc',
                                        borderBottomWidth: 1,
                                    }}
                                />
                                <View style={{ padding: 20, paddingLeft: 10 }}>
                                    <Text>No Known Medicines</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        )
    }
}