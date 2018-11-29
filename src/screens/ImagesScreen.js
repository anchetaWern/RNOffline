import React, { Component } from "react";
import { ScrollView } from "react-native";

import image_urls from "../data/images";

import ImageList from "../components/ImageList";
// import ImageListExpo from "../components/ImageListExpo"; // if you're using Expo

export default class ImagesScreen extends Component {
  static navigationOptions = {
    title: "Image Caching"
  };

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <ImageList images={image_urls} />
      </ScrollView>
    );
  }
}

const styles = {
  container: {
    alignItems: "center"
  }
};
