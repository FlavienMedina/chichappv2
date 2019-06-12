import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions
} from 'react-native';

import SimplePicker from 'react-native-simple-picker';
import * as firebase from "firebase";
import { Input, Icon } from 'react-native-elements'
import { getDistance } from 'geolib';
import Geocode from "react-geocode";
Geocode.setApiKey(CONFIG.API_KEY);
// Geocode.enableDebug();

import { COLORS, CONFIG } from '../constants/index';
import chichas from '../db/chichas.json';
import zipcodes from '../db/zipcodes.json';
import { ScrollView } from 'react-native-gesture-handler';

const {height, width} = Dimensions.get('window');

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.navigate  = props.navigation;

    this.state = {
      isLoading: true,
      chichArray: [],
      latitude: null,
      longitude: null,
      address: null,
      city: null,
      zipcode: null,
      error: null,
      modalVisible: false,
      language: "javascript"
    };
  }
  
  static navigationOptions = {
    header: null
  };

render() {
  const { navigate } = this.props.navigation;
  if(this.state.isLoading){
    return(
      <View style={{backgroundColor:"white", height:"100%", justifyContent: 'center', alignItems: 'center'}}>
        <Image style={{width:"100%", height:"100%"}} source={require('../assets/hookah.gif')}/>
      </View>
    )
  }
  const chicha = this.state.chichArray.map((item, key) => {
      let getDistRes = getDistance({latitude: this.state.latitude,longitude: this.state.longitude},{latitude: item.lat,longitude: item.lng}).toString();
      let dist = getDistRes.length > 3 ? getDistRes.slice(0, getDistRes.length - 3) : getDistRes;
      let unit = getDistRes.length > 3 ? "km" : "m";      
      return(
        <TouchableOpacity key={item.id} style={styles.item} onPress={() => { navigate('Chicha', {item}) }}>
          {/* <Image style={styles.image} source={require('../assets/hookah.png')}/> */}
          <View style={{backgroundColor:COLORS.BLUE, width:"100%", height:"100%"}}></View>
          <View style={{flexDirection:'row', justifyContent: "space-between", paddingTop:10}}>
            <Text style={[{fontWeight:'bold', color:"black", fontSize:10},styles.captionText]}>{item.name}</Text>
            <Text style={{fontSize:15, color:"black"}}>{dist} {unit}</Text>
          </View>
          {/* <Text style={[{color:'black'},styles.captionText]}>{item.city} - {item.zipcode}</Text> */}
      </TouchableOpacity>
      )
    });
    return (
      <View>
        <View style={styles.container}>
          <View style={{marginTop:60, paddingRight:30, paddingLeft:30}}>
            <Input
              value={this.state.address}
              style={{borderBottomWidth:0.5, borderBottomColor: 'black'}}
            />
            <TouchableOpacity
              onPress={()=>{this.refs.picker.show()}}
              style={[styles.shadow, {backgroundColor:COLORS.BLUE, marginTop:15, alignItems:"center", borderRadius:15}]}>
              <Text style={{color:"white",padding:10,fontSize:22,fontWeight:"bold"}}>Département</Text>
            </TouchableOpacity>
            <SimplePicker
              ref={'picker'}
              options={zipcodes}
              confirmText={"Done"}
              confirmTextStyle={{fontSize:20, color:"blue"}}
              cancelText={" "}
              onSubmit={(zip) => {this.getChichasByDepartment(zip)}}
            />
          </View>
          <ScrollView style={{marginTop:10}}>
            {chicha}
          </ScrollView>
          <TouchableOpacity
              onPress={() => { navigate('create') }}
              style={[styles.circle, styles.shadow, {position: 'absolute', right: 150, bottom: 50, justifyContent: 'center', alignItems: 'center'}]}>
              <Text style={{color:"white", fontSize:35}}>+</Text>
            </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  componentDidMount() {
    // this.signup('flavien_94@hotmail.fr', "123456,");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let url =`${CONFIG.API_LOCATION}${position.coords.latitude},${position.coords.longitude}&key=${CONFIG.API_KEY}`;
        fetch(url)
        .then(res => res.json())
        .then(res => {
          let address = res.results[0].address_components;
          let city = address[2].long_name;
          let zipcode = address[address.length - 1].long_name;
          let fullAddress = `${address[0].long_name} ${address[1].long_name}, ${city} ${zipcode}`
          console.log("-------------- addresse --------------");
          console.log(fullAddress);
          console.log("-------------- addresse --------------");
          this.getDistChichas()
          // this.getChichasByDepartment(zipcode.slice(0,2))
          this.setState({
            address: fullAddress,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            zipcode: zipcode.slice(0,2),
          });            
          return;
        })
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }
  async getDistChichas(){
    chichasWithCoords = [];
    const promises= chichas.map(async (item) => {
      const res = await Geocode.fromAddress(item.fullAddress);
      const { lat, lng } = res.results[0].geometry.location;
      item.lat = lat;
      item.lng = lng;
      return item;
    })
    const results = await Promise.all(promises)  
    this.setState({
      chichArray: results,
      isLoading: false
    })
  }
  
  getChichasByDepartment(zipcode){
    let zipChichas = [];
    this.setState({ zipcode: zipcode })
    chichas.map((item) =>{
      let zip = item.zipcode.slice(0,2);      
      if (item.zipcode.slice(0,2) == zipcode) {
        zipChichas.push(item);
      }
    })
    this.setState({ chichArray: zipChichas })
    return true;
  }

  async signup(email, pass) {

    try {
        await firebase.auth()
            .createUserWithEmailAndPassword(email, pass);

        console.log("Account created");

        // Navigate to the Home page, the user is auto logged in

    } catch (error) {
        console.log(error.toString())
    }

}
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width:width,
    height:height,
    color:"black"
  },
  item:{
    padding: 5,
    height:250,
    width:width,
    padding:25
  },
  image:{
    width:"100%",
    height:200,
    backgroundColor:COLORS.BLUE,
  },
  caption:{
    flex:1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  captionText:{
    fontSize:15,
  },
  positionIcon: {
    marginRight:15,
    backgroundColor:'blue'
  },
  marginAuto:{
    marginTop: 0,
    marginRight: 'auto',
    marginBottom: 0,
    marginLeft: 'auto',
  },
  shadow:{
    shadowColor: "black",
    shadowOffset: {
      width: 0.5,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,

    elevation: 14
  },
  circle:{
    backgroundColor: COLORS.BLUE,
    width: 90,
    height: 90,
    borderRadius: 90/2,
  }
});
