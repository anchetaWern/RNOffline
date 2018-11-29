import React, { Component } from "react";
import { View, Text } from "react-native";
import {
  CachedImage,
  ImageCacheProvider,
  ImageCacheManager
} from "react-native-cached-image";

const ImageManager = ImageCacheManager({});

class ImageList extends Component {
  componentDidMount() {
    ImageManager.getCacheInfo().then(res => {
      console.log("files: ", res.files);
    });
  }

  render() {
    const { images } = this.props;
    var urls = images.map(img => {
      return img.url;
    });

    return (
      <ImageCacheProvider urlsToPreload={urls}>
        <View>{this.renderImages(images)}</View>
      </ImageCacheProvider>
    );
  }

  renderImages = images => {
    return images.map(img => {
      const uri = img.url;
      return (
        <View style={styles.imageContainer} key={img.id}>
          <CachedImage source={{ uri: uri }} style={styles.image} />
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

export default ImageList;
