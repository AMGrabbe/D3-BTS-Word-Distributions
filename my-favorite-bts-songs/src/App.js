import "./App.css";
import { React, Component } from "react";
import Chord from "./visualization/Chord";
import TestSlider from "./visualization/TestSlider";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      value: 0,
    };
  }

  async componentDidMount() {
    const fetch_response = await fetch(
      `${process.env.PUBLIC_URL || ""}/data.json`
    );
    const json = await fetch_response.json();
    this.setState({
      data: json,
    });
  }

  handleChange = (value) => this.setState({ value: value });

  render() {
    const { data } = this.state;
    const { value } = this.state;
    return (
      <div className="App">
        <div className="diagram">
          <Chord data={data}  value={value}/>
          <TestSlider getValue={this.handleChange} />
        </div>
      </div>
    );
  }
}

export default App;
