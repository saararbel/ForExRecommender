import axios from "axios";
import React, { Component } from 'react';
import {
  Button,
  FormGroup,
  FormControl,
  FormLabel,
  ControlLabel,
  Table
} from "react-bootstrap";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      current_curr: "USD",
      investmentRes : undefined,
      lastRatios: undefined
    };

    this.checkInvestment = this.checkInvestment.bind(this);
    this.renderRecommendation = this.renderRecommendation.bind(this);
    this.renderLastRatios = this.renderLastRatios.bind(this);
  }

  checkInvestment() {
    axios.get("http://localhost:5000/shouldInvest?curr="+this.state.current_curr).then(({data}) => {
      this.setState({investmentRes: data})
    });
  }

  fetchLastRatios() {
    axios.get("http://localhost:5000/getLastDaysRatios").then(({data}) => {
      this.setState({lastRatios: data})
    });
    
  }

  renderRecommendation() {
    if(this.state.investmentRes == undefined) {
      return <div></div>
    }

    if(this.state.investmentRes == "SELL") {
      return <div style={{color:'red', fontWeight: 'bold'}}>You should: SELL</div>
    }

    return <div style={{color:'green', fontWeight: 'bold'}}>You should: BUY/HOLD</div>
  }

  renderLastRatios() {
    let data = this.state.lastRatios;
    if(data !== undefined) {
    let keys = Object.keys(data);

    return (
      <Table striped bordered hover size="sm">
      <thead>
        <tr>
          <th>Date</th>
          <th>Ratio (USD/EUR)</th>
        </tr>
      </thead>
      <tbody>
      {keys.map((date, index) => {
        console.log(date)
            return (
                <tr key={index}>
                    <td>{date}</td>
                    <td>{data[date]}</td>
                </tr>
            )
        })}
      </tbody>
    </Table>
    );
    }
    
  }

  render() {
    console.log("Current current is: " + this.state.current_curr);
    return (
      <div style={{ paddingTop: '4%'}}>
          <h1 style={{ color: 'rgb(12, 124, 189)', textAlign: 'center' }}>
            Welcome to ForEx Recommender!
        </h1><br></br>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            
      <form>
      <FormGroup controlId="exampleForm.ControlSelect1">
        <FormLabel>You are holding:</FormLabel>
        <FormControl as="select"
         onChange={e => this.setState({current_curr: e.target.value})}
         style={{ width: '350px' }}>
          <option value="USD">USD $</option>
          <option value="EUR">EUR €</option>
        </FormControl>
      </FormGroup>
      <FormGroup>
      <Button bsStyle="primary" onClick={() => this.checkInvestment()}>Check out!</Button>
      </FormGroup>
      {this.renderRecommendation()}
      <br/>
      <FormGroup>
      <Button style={{paddingLeft: "4%"}} bsStyle="primary" onClick={() => this.fetchLastRatios()}>Load last Ratios</Button>
      <br/><br/>
      {this.renderLastRatios()}
      </FormGroup>
      </form>
      </div>
      </div>
    );
  }
}

export default App;
