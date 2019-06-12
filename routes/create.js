import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

import t from 'tcomb-form-native'; // 0.6.9

const Form = t.form.Form;

var types = t.enums({
  Foot: 'Foot',
  Chill: 'Chill',
  Restaurant: 'Restaurant',
  Terrasse: 'Terrasse',
  'Boite de Nuit': 'Boite de Nuit'
});

const User = t.struct({
  name: t.String,
  address: t.String,
  ville: t.String,
  zipcode: t.Number,
});
export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Form 
        type={User}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
    backgroundColor: '#ffffff',
  },
});