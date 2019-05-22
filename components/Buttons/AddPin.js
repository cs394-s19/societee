import React, { Component } from "react";
import { Container, Header, Content, Button, Icon, Text } from "native-base";
import EntypoIcon from "react-native-vector-icons/Entypo";

export default class ButtonIconExample extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Button danger iconLeft>
        <EntypoIcon name="pin" size={30} />
        <Text>Add Pin</Text>
      </Button>
    );
  }
}
