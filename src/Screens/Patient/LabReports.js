import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image, ScrollView, PermissionsAndroid, Platform, Dimensions } from 'react-native';
import { Menu } from '../../component/Menu';
import Icon from "react-native-vector-icons/AntDesign";
import Pdf from 'react-native-pdf';
import RNFetchBlob from 'rn-fetch-blob';

export default class LabReport extends Component {

    constructor() {
        super();
        this.state = {
            LabReports: []
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

            this.setState({
                LabReports: response.user[0].LabReports,
            })
        })
    }

    async checkPermission(imgURL) {

        if (Platform.OS === 'ios') {
            downloadImage();
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'Storage Permission Required',
                        message: 'This app needs access to your storage to download Files',
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    //Once user grant the permission start downloading
                    console.log('Storage Permission Granted.');
                    this.downloadImage(imgURL);
                } else {
                    //If permission denied then show alert 'Storage Permission Not Granted'
                    alert('Storage Permission Not Granted');
                }
            } catch (err) {
                //To handle permission related issue
                console.warn(err);
            }
        }
    }


    downloadImage(imageURL) {
        let date = new Date();
        //Image URL which we want to download
        let image_URL = imageURL
        //Getting the extention of the file
        let ext = this.getExtention(image_URL);
        ext = '.' + ext[0];


        const { config, fs } = RNFetchBlob;
        let PictureDir = fs.dirs.PictureDir;
        let options = {
            fileCache: true,
            addAndroidDownloads: {
                //Related to the Android only
                useDownloadManager: true,
                notification: true,
                path:
                    PictureDir +
                    '/files' + Math.floor(date.getTime() + date.getSeconds() / 2) + ext,
                description: 'file',
            },
        };
        config(options)
            .fetch('GET', image_URL)
            .then(res => {
                //Showing alert after successful downloading
                console.log('res -> ', JSON.stringify(res));
                alert('file Downloaded Successfully.');
            });
    };

    getExtention = filename => {
        //To get the file extension
        return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
    };

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ width: "100%", height: 70, alignItems: "center", justifyContent: "flex-start", flexDirection: "row", padding: 20, backgroundColor: "#147562" }}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()} >
                        <View style={{ flexDirection: "column" }}>
                            <Icon name="back" color="white" size={26} />
                        </View>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 24, color: "white", marginLeft: 30 }}>Lab Report</Text>
                </View>

                <View style={{ padding: 15, width: Dimensions.get("screen").width }}>
                    <View style={{ flexDirection: "row", flexWrap : "wrap" }}>
                        {this.state.LabReports.length ? this.state.LabReports.map((items, index) => {
                            return <View  key={index} style={{margin : 5}}>
                                <Pdf style={{ width: 150, height: 160 }} source={{ uri: items.ReportLink, cache: true }} onLoadComplete={(numberOfPages, filePath) => console.log(`number of pages: ${numberOfPages}`)} />
                                <TouchableOpacity onPress={() => this.checkPermission(items.ReportLink)}>
                                    <View style={{ borderRadius: 5, backgroundColor : "#bfd5d9",  alignItems: "center", justifyContent: "center", marginTop: 10, height : 25 }}>
                                        <Text>Download</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        }) : <Text style={{ fontSize: 14 }}>Your Lab Reports Appear Here</Text>}
                    </View>
                </View>
            </View>
        )
    }
}