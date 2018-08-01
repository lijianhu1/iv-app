import React from 'react'
import {
	TouchableOpacity,
	StyleSheet,
	Platform,
	ActivityIndicator,
	View,
	Text,
	ToastAndroid,
	Image
} from 'react-native'

import ImagePicker from 'react-native-image-picker';
import tool from '../../js/utils/Tool';

const options = {
	title: '选择图片',
	cancelButtonTitle: '取消',
	takePhotoButtonTitle: '拍照',
	chooseFromLibraryButtonTitle: '图片库',
	cameraType: 'back',
	mediaType: 'photo',
	videoQuality: 'high',
	durationLimit: 10,
	maxWidth: 600,
	maxHeight: 600,
	width: 300,
	height: 300,
	aspectX: 2,
	aspectY: 1,
	quality: 0.8,
	angle: 0,
	allowsEditing: false,
	noData: false,
	storageOptions: {
		skipBackup: true,
		path: 'images'
	}
};

class CameraButton extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false
		}
	}
	render() {
		const {
			photos,
			type,
			src
		} = this.props;
		let conText;
		return(
			<TouchableOpacity
                onPress={this.showImagePicker.bind(this)}
                style={this.props.style}>
                {src?<Image style={styles.basicHead} source={{uri:src}}/>:null}
            </TouchableOpacity>
		)
	}

	showImagePicker() {
		ImagePicker.showImagePicker(options, (response) => {
			if(response.didCancel) {
				console.log('User cancelled image picker');
			} else if(response.error) {
				console.log('ImagePicker Error: ', response.error);
			} else {

				let source;

				if(Platform.OS === 'android') {
					source = {
						uri: response.uri,
						isStatic: true
					}
				} else {
					source = {
						uri: response.uri.replace('file://', ''),
						isStatic: true
					}
				}

				let file;
				if(Platform.OS === 'android') {
					file = response.uri
				} else {
					file = response.uri.replace('file://', '')
				}

				this.setState({
					loading: true
				});
				this.uploadImage(file, response.fileName || '未命名文件.jpg')
//				this.props.onFileUpload(file, response.fileName || '未命名文件.jpg')
//					.then(result => {
//						this.setState({
//							loading: false
//						})
//					})
			}
		});
	}
	uploadImage(fileData,fileName) {
		let formData = new FormData();
		let file = {
			uri: fileData,
			type: 'multipart/form-data',
			name: 'image.png'
		}; //这里的key(uri和type和name)不能改变,
		formData.append("file", file); //这里的files就是后台需要的key
		formData.append("rd_session", '594cbb19-cfa4-4965-a594-81767b0ae8c1'); 
		fetch(tool.serviceUrl+'/resumeControllOperation/uploadHeadImg', {
				method: 'POST',
				headers: {
					'Content-Type': 'multipart/form-data',
				},
				body: formData,
			})
			.then((response) => response.text())
			.then((responseData) => {
				this.props.cback(JSON.parse(responseData));
				this.setState({
					loading: false
				})
				
				console.log('responseData', responseData);
			})
			.catch((error) => {
				this.props.cback(JSON.parse(responseData));
				this.setState({
					loading: false
				})
				console.error('error', error)
			});
	}
}
const styles = StyleSheet.create({
	cameraBtn: {
		padding: 5
	},
	count: {
		color: '#fff',
		fontSize: 12
	},
	fullBtn: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#fff'
	},
	countBox: {
		position: 'absolute',
		right: -5,
		top: -5,
		alignItems: 'center',
		backgroundColor: '#34A853',
		width: 16,
		height: 16,
		borderRadius: 8,
		justifyContent: 'center'
	},
	basicHead: {
		width: 64,
		height: 64,
		borderRadius: 100,
	},
});

export default CameraButton;