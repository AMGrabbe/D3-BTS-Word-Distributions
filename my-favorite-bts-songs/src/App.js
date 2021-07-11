import './App.css';
import { Component } from 'react';
import Chord from './visualization/Chord'

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: {}
    }
  }

  async componentDidMount() {
    const fetch_response = await fetch(`${process.env.PUBLIC_URL || ""}/data.json`);
    const json = await fetch_response.json();
    console.log(json)
    this.setState({
      data: json
    })
   
  } 

  render(){
    const {data} = this.state;
    return (
      <div className="App">
        <div className="diagram">
          <Chord data = {data}/>
        </div>
       
      </div>
    );
  }    
}

export default App;
