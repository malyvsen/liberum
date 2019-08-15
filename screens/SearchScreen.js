import * as React from "react";
import { Searchbar } from "react-native-paper";

export default class SearchScreen extends React.Component {
  state = {
    firstQuery: ""
  };

  render() {
    const { firstQuery } = this.state;
    return (
      <Searchbar
        style={{ marginTop: 60 }}
        placeholder="Search"
        onChangeText={query => {
          this.setState({ firstQuery: query });
        }}
        value={firstQuery}
      />
    );
  }
}
