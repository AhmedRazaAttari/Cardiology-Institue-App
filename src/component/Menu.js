import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
// import { Icon } from 'native-base';
import Icon from "react-native-vector-icons/FontAwesome5";

class Menu extends Component {
    render() {
        return (
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    marginTop: 10,
                    height: 80, width: 320,
                    alignItems: "center",
                    justifyContent: "space-around",
                    backgroundColor: 'white',
                    borderLeftWidth: 10,
                    borderBottomLeftRadius: 20,
                    borderTopLeftRadius: 20,
                    borderLeftColor: '#16A085',
                }}
                onPress={this.props.onClick}
            >
                <Icon name={this.props.IconName} size={33} color="#147562" />
                <Text
                    style={{
                        color: '#16A085',
                        fontSize: 18,
                        fontWeight: 'bold',
                        // alignItems: "center",
                        // flexDirection: 'row',
                    }}>
                    {this.props.Value}
                </Text>
            </TouchableOpacity>
        )
    }
}

export {
    Menu
}