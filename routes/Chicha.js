import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  TabBarIOS,
  StatusBar,
  SafeAreaView,
  Button,
  isAndroid,
  Dimensions
} from 'react-native';
import { showLocation } from 'react-native-map-link'

import { COLORS, CONFIG } from '../constants/index';
import chichas from '../db/chichas.json';

const {height, width} = Dimensions.get('window');


class ChichaScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({ title: navigation.state.params.item.name });
  render() {
    const navigation = this.props.navigation;       
    let chicha = navigation.state.params.item;
    return (
      <View style={styles.container}>
        <View style={{backgroundColor:COLORS.BLUE, width:"100%", height:200}}></View>
        <View style={styles.caption}>
          <View style={{marginBottom:20}}>
              <Text style={{fontWeight:'bold',fontSize:15}}>{chicha.name}</Text>
              <Text style={styles.captionText}>{chicha.fullAddress}</Text>
          </View>
        </View>
              <TouchableOpacity
              onPress={() => {showLocation({latitude: chicha.lat, longitude: chicha.lng, title: chicha.name})}}
              style={[{backgroundColor:COLORS.BLUE, width:200, alignItems:"center", borderRadius:20}, styles.marginAuto, styles.shadow]}
              >
              <Text style={{color:"white",padding:12,fontSize:22,fontWeight:"bold"}}>Y aller !</Text>
            </TouchableOpacity>
      </View>
    );
  }
}
export default ChichaScreen

const styles = StyleSheet.create({
  container: {
    flex:1,
    width:width,
    backgroundColor:"#fff",
  },
  searchSection: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingLeft: 20,
      paddingRight: 20,
      borderBottomWidth:1,
      borderBottomColor:"#E6ECEF",
      height: 60,
  },
  positionIcon: {
    marginRight:15,
    backgroundColor:COLORS.BLUE
  },
  items:{
    paddingTop:20,
  },
  item:{
    marginBottom:40,
    height:250,
    width:width - 30,
  },
  image:{
    width:"100%",
    height:200,
    backgroundColor:COLORS.BLUE,
  },
  caption:{
    padding:10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  captionText:{
    paddingTop:10,
    fontSize:15
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
  }
});
