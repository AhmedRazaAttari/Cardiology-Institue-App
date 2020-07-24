import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image, ScrollView, PermissionsAndroid, Platform, Dimensions, Alert } from 'react-native';
import FilePickerManager from 'react-native-file-picker';
import Icon from "react-native-vector-icons/AntDesign";
import Pdf from 'react-native-pdf';
import RNFetchBlob from 'rn-fetch-blob';

var extractedeRx = [], extractedLabReports = [];
export default class PatientRoom extends Component {

    constructor() {
        super();

        this.state = {
            Email: null,
            Height: null,
            Weight: null,
            BPDiastolic: null,
            BPSystolic: null,
            OwnFile: []
        }
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


    async componentDidMount() {
        await fetch("https://patientdoctor-app.herokuapp.com/patient/profile", {
            method: "POST",
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify({
                _id: this.props.navigation.state.params.Clicked_NodeData.data.userID,
            })
        }).then(res => res.json()).then(response => {
            if (response.user[0].eRx.length) {
                for (var i = 0; i < response.user[0].eRx.length; i++) {
                    if (response.user[0].eRx[i].doctorID === this.props.navigation.state.params.UserData._id) {
                        extractedeRx = response.user[0].eRx
                    }
                }
            }
            if (response.user[0].LabReports.length) {
                for (var i = 0; i < response.user[0].LabReports.length; i++) {
                    if (response.user[0].LabReports[i].doctorID === this.props.navigation.state.params.UserData._id) {
                        extractedLabReports = response.user[0].LabReports
                    }
                }
            }
            if (response.user[0].BloodPressure.length) {
                var LastValue = response.user[0].BloodPressure.pop()
                var BPDiastolic = LastValue.BloodPressureObj.BPDiastolic
                var BPSystolic = LastValue.BloodPressureObj.BPSystolic

                this.setState({
                    BPDiastolic: BPDiastolic,
                    BPSystolic: BPSystolic,
                })
            }
            if (response.user[0].Measurment.length) {
                var LastValue2 = response.user[0].Measurment.pop()
                var Weight = LastValue2.MeasuremntObj.Weight
                var Height = LastValue2.MeasuremntObj.Height

                this.setState({
                    Weight: Weight,
                    Height: Height,
                })
            }
            this.setState({
                Email: response.user[0].Email,
                PhoneNo: response.user[0].PhoneNo,
                Gender: response.user[0].Gender,
                OwnFile: response.user[0].OwnFile,
                LabReports: response.user[0].LabReports,
                eRx: response.user[0].eRx,
                ProfileLoaded: true
            })
        })
    }

    AssignERX() {
        FilePickerManager.showFilePicker(null, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled file picker');
            }
            else if (response.error) {
                console.log('FilePickerManager Error: ', response.error);
            }
            else {
                console.log(response)
                let Newfile = {
                    uri: response.uri,
                    type: `test/${response.uri.split(".")[1]}`,
                    name: `test/${response.uri.split(".")[1]}`,
                }
                this.handleUploadeRX(Newfile)

            }
        });
    }

    async GetUpdatedResult() {
        await fetch("https://patientdoctor-app.herokuapp.com/patient/profile", {
            method: "POST",
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify({
                _id: this.props.navigation.state.params.Clicked_NodeData.data.userID,
            })
        }).then(res => res.json()).then(response => {

            if (response.user[0].eRx.length) {
                for (var i = 0; i < response.user[0].eRx.length; i++) {
                    if (response.user[0].eRx[i].doctorID === this.props.navigation.state.params.UserData._id) {
                        extractedeRx = response.user[0].eRx
                    }
                }
            }
            if (response.user[0].LabReports.length) {
                for (var i = 0; i < response.user[0].LabReports.length; i++) {
                    if (response.user[0].LabReports[i].doctorID === this.props.navigation.state.params.UserData._id) {
                        extractedLabReports = response.user[0].LabReports
                    }
                }
            }
            this.setState({
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

    AssignLabReport() {
        FilePickerManager.showFilePicker(null, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled file picker');
            }
            else if (response.error) {
                console.log('FilePickerManager Error: ', response.error);
            }
            else {
                console.log(response)
                let Newfile = {
                    uri: response.uri,
                    type: `test/${response.uri.split(".")[1]}`,
                    name: `test/${response.uri.split(".")[1]}`,
                }
                this.handleUpload_LabReport(Newfile)

            }
        });
    }

    handleUpload_LabReport = (file) => {
        const data = new FormData();
        data.append("file", file)
        data.append("upload_preset", "HospitalApp")
        data.append("cloud_name", "djnxfvhbh")

        fetch("https://api.cloudinary.com/v1_1/djnxfvhbh/image/upload", {
            method: "POST",
            body: data
        }).then((res => res.json())).then((data) => {
            fetch("https://patientdoctor-app.herokuapp.com/doctor/PatientLabReport", {
                method: "POST",
                headers: {
                    "content-Type": "application/json"
                },
                body: JSON.stringify({
                    FileLink: data.secure_url,
                    doctorID: this.props.navigation.state.params.UserData._id,
                    patientID: this.props.navigation.state.params.Clicked_NodeData.data.userID,
                })
            }).then(res => res.json()).then((response) => {
                fetch("https://patientdoctor-app.herokuapp.com/patient/LabReport", {
                    method: "POST",
                    headers: {
                        "content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        FileLink: data.secure_url,
                        doctorID: this.props.navigation.state.params.UserData._id,
                        patientID: this.props.navigation.state.params.Clicked_NodeData.data.userID,
                    })
                }).then(res2 => res2.json()).then(response2 => this.GetUpdatedResult())
            })
        })
    }


    handleUploadeRX = (file) => {
        const data = new FormData();
        data.append("file", file)
        data.append("upload_preset", "HospitalApp")
        data.append("cloud_name", "djnxfvhbh")

        fetch("https://api.cloudinary.com/v1_1/djnxfvhbh/image/upload", {
            method: "POST",
            body: data
        }).then((res => res.json())).then((data) => {
            fetch("https://patientdoctor-app.herokuapp.com/doctor/PatienteRx", {
                method: "POST",
                headers: {
                    "content-Type": "application/json"
                },
                body: JSON.stringify({
                    FileLink: data.secure_url,
                    doctorID: this.props.navigation.state.params.UserData._id,
                    patientID: this.props.navigation.state.params.Clicked_NodeData.data.userID,
                })
            }).then(res => res.json()).then((response) => {
                fetch("https://patientdoctor-app.herokuapp.com/patient/eRx", {
                    method: "POST",
                    headers: {
                        "content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        FileLink: data.secure_url,
                        doctorID: this.props.navigation.state.params.UserData._id,
                        patientID: this.props.navigation.state.params.Clicked_NodeData.data.userID,
                    })
                }).then(res2 => res2.json()).then(response2 => this.GetUpdatedResult())
            })
        })
    }


    DeleteeRx(imageURL) {
        Alert.alert(
            '',
            'Do you want to want to delete this file',
            [
                {
                    text: 'Yes', onPress: (() => {
                        fetch("https://patientdoctor-app.herokuapp.com/doctor/RemovePatienteRx", {
                            method: "POST",
                            headers: {
                                "content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                FileLink: imageURL,
                                doctorID: this.props.navigation.state.params.UserData._id,
                                patientID: this.props.navigation.state.params.Clicked_NodeData.data.userID,
                            })
                        }).then(res => res.json()).then((response) => {
                            fetch("https://patientdoctor-app.herokuapp.com/patient/RemoveeRx", {
                                method: "POST",
                                headers: {
                                    "content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    FileLink: imageURL,
                                    doctorID: this.props.navigation.state.params.UserData._id,
                                    patientID: this.props.navigation.state.params.Clicked_NodeData.data.userID,
                                })
                            }).then(res2 => res2.json()).then(response2 => this.GetUpdatedResult())
                        })
                    })
                },
                { text: 'Cancel', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false }
        )

    }

    DeleteLabReport(imageURL) {
        Alert.alert(
            '',
            'Do you want to want to delete this file',
            [
                {
                    text: 'Yes', onPress: (() => {
                        fetch("https://patientdoctor-app.herokuapp.com/doctor/RemoveLabReport", {
                            method: "POST",
                            headers: {
                                "content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                FileLink: imageURL,
                                doctorID: this.props.navigation.state.params.UserData._id,
                                patientID: this.props.navigation.state.params.Clicked_NodeData.data.userID,
                            })
                        }).then(res => res.json()).then((response) => {
                            fetch("https://patientdoctor-app.herokuapp.com/patient/RemoveLabReport", {
                                method: "POST",
                                headers: {
                                    "content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    FileLink: imageURL,
                                    doctorID: this.props.navigation.state.params.UserData._id,
                                    patientID: this.props.navigation.state.params.Clicked_NodeData.data.userID,
                                })
                            }).then(res2 => res2.json()).then(response2 => this.GetUpdatedResult())
                        })
                    })
                },
                { text: 'Cancel', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false }
        )

    }



    render() {
        console.log(this.state.eRx)
        var PropsData = this.props.navigation.state.params.Clicked_NodeData;
        return (
            <View style={{ flex: 1 }}>
                <View style={{ width: "100%", height: 70, alignItems: "center", justifyContent: "flex-start", flexDirection: "row", padding: 20, backgroundColor: "#147562" }}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()} >
                        <Icon name="back" color="white" size={26} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 24, color: "white", marginLeft: 30 }}>Patient Room</Text>
                </View>
                <ScrollView>

                    <View style={{ padding: 20, width: Dimensions.get("screen").width }}>
                        <Text style={{ fontSize: 22, fontWeight: "bold" }}>Patient info</Text>
                        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: 25 }}>
                            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Name : </Text>
                            <Text style={{ fontSize: 20, marginLeft: 25 }}>{PropsData.data.userName}</Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: 15 }}>
                            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Email : </Text>
                            <Text style={{ fontSize: 20, marginLeft: 25 }}>{this.state.Email}</Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: 15 }}>
                            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Gender :</Text>
                            <Text style={{ fontSize: 20, marginLeft: 25 }}>{this.state.Gender}</Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: 15 }}>
                            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Phone# :</Text>
                            <Text style={{ fontSize: 20, marginLeft: 25 }}>{this.state.PhoneNo}</Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: 25 }}>
                            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Status : </Text>
                            <Text style={{ fontSize: 20, marginLeft: 25 }}>{PropsData.data.Status === "Accept" ? "Regular Customer" : "Admitted"}</Text>
                        </View>
                        <View style={{ marginTop: 35 }}>
                            <Text style={{ fontSize: 22, fontWeight: "bold" }}>Patient Health Summary</Text>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={{ padding: 10, flexDirection: "row", marginTop: 15 }}>
                                    <View style={{ height: 90, width: 150, borderRadius: 7, elevation: 3, justifyContent: "center", alignItems: "center", padding: 10 }}>
                                        <Text style={{ fontWeight: "bold", fontSize: 15 }}>Last BP Test Result</Text>
                                        <Text style={{ fontWeight: "bold", fontSize: 16, marginTop: 10 }}>{this.state.ProfileLoaded ? [this.state.BPDiastolic ? this.state.BPDiastolic + "/" + this.state.BPSystolic : "50/77"] : "50/77"}</Text>
                                    </View>
                                    <View style={{ height: 90, width: 150, borderRadius: 7, elevation: 3, justifyContent: "center", alignItems: "center", padding: 10 }}>
                                        <Text style={{ fontWeight: "bold", fontSize: 15 }}>Last Measurement Test Result</Text>
                                        <Text style={{ fontWeight: "bold", fontSize: 16, marginTop: 10 }}>{this.state.ProfileLoaded ? [this.state.Height ? this.state.Height + "/" + this.state.Weight : "150"] : "150"}</Text>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                        <View style={{ marginTop: 35 }}>
                            <Text style={{ fontSize: 22, fontWeight: "bold" }}>Patient eRx</Text>
                            <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 30 }}>
                                {extractedeRx.length ? extractedeRx.map((items, index) => {
                                    return <View key={index} style={{ margin: 5 }}>
                                        <Pdf style={{ width: 150, height: 160 }} source={{ uri: items.ReportLink, cache: true }} onLoadComplete={(numberOfPages, filePath) => console.log(`number of pages: ${numberOfPages}`)} />
                                        <TouchableOpacity onPress={() => this.checkPermission(items.ReportLink)}>
                                            <View style={{ borderRadius: 5, backgroundColor: "#bfd5d9", alignItems: "center", justifyContent: "center", marginTop: 10, height: 25 }}>
                                                <Text>Download</Text>
                                            </View>
                                        </TouchableOpacity>
                                        {/* <TouchableOpacity onPress={() => this.DeleteeRx(items.ReportLink)}>
                                            <View style={{ borderRadius: 5, backgroundColor: "#bfd5d9", alignItems: "center", justifyContent: "center", marginTop: 5, height: 25 }}>
                                                <Text>Delete</Text>
                                            </View>
                                        </TouchableOpacity> */}
                                    </View>
                                }) : <Text style={{ fontSize: 14 }}>Patient eRx Appear Here</Text>}
                            </View>
                        </View>
                        <View style={{ marginTop: 35 }}>
                            <Text style={{ fontSize: 22, fontWeight: "bold" }}>Patient Lab Reports</Text>
                            <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 30 }}>
                                {extractedLabReports.length ? extractedLabReports.map((items, index) => {
                                    return <View key={index} style={{ margin: 5 }}>
                                        <Pdf style={{ width: 150, height: 160 }} source={{ uri: items.ReportLink, cache: true }} onLoadComplete={(numberOfPages, filePath) => console.log(`number of pages: ${numberOfPages}`)} />
                                        <TouchableOpacity onPress={() => this.checkPermission(items.ReportLink)}>
                                            <View style={{ borderRadius: 5, backgroundColor: "#bfd5d9", alignItems: "center", justifyContent: "center", marginTop: 10, height: 25 }}>
                                                <Text>Download</Text>
                                            </View>
                                        </TouchableOpacity>
                                        {/* <TouchableOpacity onPress={() => this.DeleteLabReport(items.ReportLink)}>
                                            <View style={{ borderRadius: 5, backgroundColor: "#bfd5d9", alignItems: "center", justifyContent: "center", marginTop: 5, height: 25 }}>
                                                <Text>Delete</Text>
                                            </View>
                                        </TouchableOpacity> */}
                                    </View>
                                }) : <Text style={{ fontSize: 14 }}>Patient Lab Reports Appear Here</Text>}
                            </View>
                        </View>
                        <View style={{ marginTop: 20 }}>
                            <Text style={{ fontSize: 22, fontWeight: "bold" }}>Patient own uploaded files</Text>
                            <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 30 }}>
                                {this.state.OwnFile.length ? this.state.OwnFile.map((items, index) => {
                                    return <View key={index} style={{ margin: 5 }}>
                                        <Image source={{ uri: items.ReportLink }} style={{ width: 150, height: 160 }} />
                                        <TouchableOpacity onPress={() => this.checkPermission(items.ReportLink)}>
                                            <View style={{ borderRadius: 5, backgroundColor: "#bfd5d9", alignItems: "center", justifyContent: "center", marginTop: 10, height: 25 }}>
                                                <Text>Download</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                }) : <Text style={{ fontSize: 14 }}>Patient eRx Appear Here</Text>}
                            </View>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 30 }}>
                            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Give eRx to Patient</Text>
                            <TouchableOpacity style={{ alignSelf: "center" }} onPress={() => this.AssignERX()}>
                                <View style={{ width: 130, height: 45, borderRadius: 5, alignItems: "center", justifyContent: "center", elevation: 2, marginTop: 10, borderWidth: 2 }}>
                                    <Text style={{ fontSize: 18 }}>Share eRx</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 30 }}>
                            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Share Patient Lab Report</Text>
                            <TouchableOpacity style={{ alignSelf: "center" }} onPress={() => this.AssignLabReport()}>
                                <View style={{ width: 110, height: 45, borderRadius: 5, alignItems: "center", justifyContent: "center", elevation: 2, marginTop: 10, borderWidth: 2 }}>
                                    <Text style={{ fontSize: 18 }}>Lab Report</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                </ScrollView>
            </View>
        )
    }
}