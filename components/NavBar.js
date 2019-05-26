import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Container, Header, Content, Tab, Tabs, TabHeading } from "native-base";
import EntypoIcon from "react-native-vector-icons/Entypo";
import Octicon from "react-native-vector-icons/Octicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Main from "./MainPage/Main";
import Explore from "./ExplorePage/Explore";
import FriendDisplay from "./ProfilePage/FriendDisplay";

export default class NavBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Tabs tabBarPosition="bottom">
          <Tab
            heading={
              <TabHeading>
                <EntypoIcon name="globe" size={30} />
              </TabHeading>
            }
          >
            <Explore user={this.props.user} />
          </Tab>

          <Tab
            heading={
              <TabHeading>
                <EntypoIcon name="location" size={30} />
              </TabHeading>
            }
          >
            <Main user={this.props.user} />
          </Tab>

          <Tab
            heading={
              <TabHeading>
                <Octicon name="diff-added" size={30} />
              </TabHeading>
            }
          >
            <View style={styles.container}>
              <Text style={{ textAlign: "center" }}>Add pins tab</Text>
            </View>
          </Tab>

          <Tab
            heading={
              <TabHeading>
                <FontAwesome name="users" size={30} />
              </TabHeading>
            }
          >
            <View style={styles.container}>
              <FriendDisplay user={this.props.user} />
            </View>
          </Tab>
        </Tabs>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "stretch"
  }
});
