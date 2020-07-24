import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image, ScrollView } from 'react-native';
import Icon from "react-native-vector-icons/AntDesign";

export default class Glocose extends Component {
    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ width: "100%", height: 70, alignItems: "center", justifyContent: "flex-start", flexDirection: "row", padding: 20, backgroundColor: "#147562" }}>
                    <TouchableOpacity onPress={() => this.props.navigation.toggleDrawer()} >
                        <View style={{ flexDirection: "column" }}>
                        <Icon name="back" color="white" size={26} />
                        </View>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 24, color: "white", marginLeft : 30 }}>Glocose</Text>
                </View>
            </View>
        )
    }
}