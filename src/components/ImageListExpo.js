import React, { Component } from "react";
import { View, Text } from "react-native";
import { Image, CacheManager } from "react-native-expo-image-cache";

class ImageListExpo extends Component {
  render() {
    return <View>{this.renderImages()}</View>;
  }

  renderImages = () => {
    const { images } = this.props;
    return images.map(img => {
      const uri = img.url;
      CacheManager.get(uri)
        .getPath()
        .then(path => {
          console.log(path);
        });

      return (
        <View style={styles.imageContainer} key={img.id}>
          <Image {...{ uri }} style={styles.image} />
          <Text style={styles.label}>{img.label}</Text>
        </View>
      );
    });
  };
}

const styles = {
  label: {
    padding: 10,
    fontSize: 14,
    alignSelf: "center"
  },
  imageContainer: {
    marginTop: 20
  },
  image: {
    width: 300,
    height: 250
  }
};

export default ImageListExpo;
