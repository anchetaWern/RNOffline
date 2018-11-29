import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Button
} from "react-native";
import { connect } from "react-redux";

import Card from "./Card";
import pokeball from "../img/pokeball.jpg";

class PokemonLoader extends Component {
  render() {
    const { fetching, pokemon, requestPokemon, error } = this.props;

    return (
      <View style={styles.textContainer}>
        <TouchableOpacity onPress={requestPokemon} testID="action_button">
          <View style={styles.content}>
            {!error && pokemon && <Card data={pokemon} fetching={fetching} />}

            {!pokemon &&
              !fetching && (
                <Image
                  source={pokeball}
                  resizeMode={"contain"}
                  style={styles.pokeBall}
                  testID="pokeball_image"
                />
              )}

            {fetching && (
              <View style={styles.loaderContainer}>
                <ActivityIndicator
                  size="large"
                  color="#0000ff"
                  testID="loader"
                />
              </View>
            )}

            {error && (
              <View>
                <View style={styles.smallTextContainer}>
                  <Text style={styles.errorText}>Something went wrong</Text>
                  <Text>Would you like to view the last Pokemon instead?</Text>
                </View>
                <Button onPress={this.rehydrate} title="Yes" color="#841584" />
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  rehydrate = () => {
    this.props.requestPersistedPokemon();
  };
}

const styles = {
  textContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff"
  },
  content: {
    alignItems: "center",
    justifyContent: "center"
  },
  pokeBall: {
    width: 120,
    height: 120,
    marginTop: 50
  },
  errorText: {
    alignSelf: "center",
    fontSize: 20,
    fontWeight: "bold"
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center"
  },
  smallTextContainer: {
    marginTop: 20,
    marginBottom: 20
  }
};

const mapStateToProps = state => {
  return {
    fetching: state.fetching,
    pokemon: state.pokemon,
    error: state.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    requestPokemon: () => dispatch({ type: "API_CALL_REQUEST" }),
    requestPersistedPokemon: () => dispatch({ type: "API_CALL_RESTORE" })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PokemonLoader);
