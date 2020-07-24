import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image, ScrollView, Alert } from 'react-native';
import Icon from "react-native-vector-icons/AntDesign";
import ImagePicker from 'react-native-image-picker';

const options = {
    title: 'Select File',
    customButtons: [{ name: 'fb', title: 'Choose Photo' }],
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};

export default class Profile extends Component {

    constructor() {
        super();
        this.state = {
            OwnFile: []
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
            console.log(response.user[0])
            this.setState({
                Name: response.user[0].FirstName + " " + response.user[0].LastName,
                Email: response.user[0].Email,
                Gender: response.user[0].Gender,
                PhoneNo: response.user[0].PhoneNo,
                OwnFile: response.user[0].OwnFile,
                BloodPressure: response.user[0].BloodPressure,
                Measurment: response.user[0].Measurment,
                LabReports: response.user[0].LabReports,
                eRx: response.user[0].eRx,
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

    async GetUpdatedResult() {
        await fetch("https://patientdoctor-app.herokuapp.com/patient/profile", {
            method: "POST",
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify({
                _id: this.props.navigation.state.params.UserData._id,
            })
        }).then(res => res.json()).then(response => {
            console.log(response.user[0])
            this.setState({
                Name: response.user[0].FirstName + " " + response.user[0].LastName,
                Email: response.user[0].Email,
                Gender: response.user[0].Gender,
                PhoneNo: response.user[0].PhoneNo,
                OwnFile: response.user[0].OwnFile,
                BloodPressure: response.user[0].BloodPressure,
                Measurment: response.user[0].Measurment,
                LabReports: response.user[0].LabReports,
                eRx: response.user[0].eRx,
            })
        })
    }

    uploadFile() {
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                // const source = { uri: response.uri };
                let Newfile = {
                    uri: response.uri,
                    type: `test/${response.uri.split(".")[1]}`,
                    name: `test/${response.uri.split(".")[1]}`,
                }
                this.handleUpload_OwnFile(Newfile)
            }
        });
    }

    handleUpload_OwnFile(file) {
        const data = new FormData();
        data.append("file", file)
        data.append("upload_preset", "HospitalApp")
        data.append("cloud_name", "djnxfvhbh")

        fetch("https://api.cloudinary.com/v1_1/djnxfvhbh/image/upload", {
            method: "POST",
            body: data
        }).then((res => res.json())).then((data) => {
            fetch("https://patientdoctor-app.herokuapp.com/patient/AddOwnFile", {
                method: "POST",
                headers: {
                    "content-Type": "application/json"
                },
                body: JSON.stringify({
                    FileLink: data.secure_url,
                    patientID: this.props.navigation.state.params.UserData._id,
                })
            }).then(res2 => res2.json()).then(response2 => this.GetUpdatedResult())
        })
    }

    Delete(imageURL) {
        Alert.alert(
            '',
            'Do you want to want to delete this file',
            [
                {
                    text: 'Yes', onPress: (() => {
                        fetch("https://patientdoctor-app.herokuapp.com/patient/RemoveOwnFile", {
                            method: "POST",
                            headers: {
                                "content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                FileLink: imageURL,
                                patientID: this.props.navigation.state.params.UserData._id,
                            })
                        }).then(res2 => res2.json()).then(response2 => this.GetUpdatedResult())
                    })
                },
                { text: 'Cancel', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false }
        )

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
                    <Text style={{ fontSize: 24, color: "white", marginLeft: 30 }}>Profile</Text>
                </View>
                <ScrollView>
                    <View style={{ padding: 25 }}>
                        <Text style={{ fontSize: 22, fontWeight: "bold" }}>Your Personal info</Text>
                        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: 25 }}>
                            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Name : {this.state.Name}</Text>
                            <Text style={{ fontSize: 20, marginLeft: 25 }}></Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: 15 }}>
                            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Email : {this.state.Email}</Text>
                            <Text style={{ fontSize: 20, marginLeft: 25 }}></Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: 15 }}>
                            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Gender : {this.state.Gender}</Text>
                            <Text style={{ fontSize: 20, marginLeft: 25 }}></Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: 15 }}>
                            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Phone# : {this.state.PhoneNo}</Text>
                            <Text style={{ fontSize: 20, marginLeft: 25 }}></Text>
                        </View>

                        <Text style={{ fontSize: 16, marginTop: 30 }}>Add your previous eRx that prescribed by other doctor for better treatment </Text>

                        <View style={{ marginTop: 20 }}>
                            <Text style={{ fontSize: 22, fontWeight: "bold" }}>your own uploaded files</Text>
                            <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 30 }}>
                                {this.state.OwnFile.length ? this.state.OwnFile.map((items, index) => {
                                    return <View key={index} style={{ margin: 5 }}>
                                        <Image source={{ uri: items.ReportLink }} style={{ width: 150, height: 160 }} />
                                        <TouchableOpacity onPress={() => this.checkPermission(items.ReportLink)}>
                                            <View style={{ borderRadius: 5, backgroundColor: "#bfd5d9", alignItems: "center", justifyContent: "center", marginTop: 10, height: 25 }}>
                                                <Text>Download</Text>
                                            </View>
                                        </TouchableOpacity>
                                        {/* <TouchableOpacity onPress={() => this.Delete(items.ReportLink)}>
                                            <View style={{ borderRadius: 5, backgroundColor: "#bfd5d9", alignItems: "center", justifyContent: "center", marginTop: 5, height: 25 }}>
                                                <Text>Delete</Text>
                                            </View>
                                        </TouchableOpacity> */}
                                    </View>
                                }) : <Text style={{ fontSize: 14 }}>Patient eRx Appear Here</Text>}
                            </View>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 30 }}>
                            <TouchableOpacity style={{ alignSelf: "center" }} onPress={() => this.uploadFile()}>
                                <View style={{ width: 110, height: 45, borderRadius: 5, alignItems: "center", justifyContent: "center", elevation: 2, marginTop: 10, borderWidth: 2 }}>
                                    <Text style={{ fontSize: 18, }}>Upload file</Text>
                                </View>
                            </TouchableOpacity>
                        </View>


                    </View>
                </ScrollView>


            </View>
        )
    }
}