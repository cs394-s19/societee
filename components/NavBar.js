import React from "react";
import { View, StyleSheet } from "react-native";
import {
  Container,
  Header,
  Content,
  Tab,
  Tabs,
  TabHeading,
  Text
} from "native-base";
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
      <Tabs
        tabBarUnderlineStyle={{ display: "none" }}
        tabBarPosition="overlayBottom"
        tabBarUnderlineStyle={{backgroundColor:"red"}}
      >
        <Tab
          heading={
            <TabHeading>
              <EntypoIcon
                style={{ textAlign: "center" }}
                name="globe"
                size={30}
                color="#282828"
              />
            </TabHeading>
          }
        >
          <Explore FetchState={this.props.FetchState} user={this.props.user} />
        </Tab>

        <Tab
          heading={
            <TabHeading>
              <EntypoIcon
                style={{ textAlign: "center" }}
                name="location"
                size={30}
                color="#282828"
              />
            </TabHeading>
          }
        >
          <Main FetchState={this.props.FetchState} user={this.props.user} />
        </Tab>

        <Tab
          heading={
            <TabHeading style={styles.container}>
              <FontAwesome
                style={{ textAlign: "center" }}
                name="users"
                size={30}
                color="#282828"
              />
            </TabHeading>
          }
        >
          <View style={styles.container}>
            <FriendDisplay
              user={this.props.user}
              allUsers={this.props.FetchState.allUsers}
              friendIDs={this.props.FetchState.friendIDs}
            />
          </View>
        </Tab>
      </Tabs>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center"
  }
});
