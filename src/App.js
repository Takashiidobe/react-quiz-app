import React, { Component } from "react";
import "./App.css";
import axios from "axios";

const quizURL = `http://jservice.io/api`;
let value;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionBank: [],
      error: false,
      points: 0,
      answer: "",
      disableButtons: null
    };
  }

  componentDidMount() {
    const previousPoints = localStorage.getItem("points");
    this.setState({
      points: previousPoints || 0
    });
  }

  fetchRandomQuestion = () => {
    axios
      .get(`${quizURL}/random`)
      .then(res =>
        this.setState({
          questionBank: res.data
        })
      )
      .catch(err =>
        this.setState({
          error: true
        })
      );
    this.setState({
      disableButtons: null
    });
  };

  onNumChange = e => {
    if (this.state.count > 100) {
      this.setState({
        count: 100
      });
    } else if (this.state.count > 0 && this.state.count <= 100) {
      this.setState({
        count: e.target.value
      });
    } else {
      this.setState({
        count: 1
      });
    }
  };

  showAnswer = () => {
    const hiddenAnswer = document.getElementById("hidden");
    const hiddenButtons = document.getElementById("point-buttons");
    hiddenButtons.removeAttribute("id");
    hiddenAnswer.removeAttribute("id");
  };

  rightAnswer = () => {
    this.setState({
      points: this.state.points + parseInt(value, 10),
      disableButtons: true
    });
    localStorage.setItem(
      "points",
      parseInt(this.state.points, 10) + parseInt(value, 10)
    );
  };

  wrongAnswer = () => {
    this.setState({
      points: this.state.points - parseInt(value, 10),
      disableButtons: true
    });
    localStorage.setItem(
      "points",
      parseInt(this.state.points, 10) - parseInt(value, 10)
    );
  };

  resetPoints = () => {
    this.setState({
      points: 0
    });
    localStorage.setItem("points", 0);
  };

  render() {
    return (
      <div className="App">
        <div className="App-intro">
          {this.state.error === false ? (
            <div>
              <p>Grab a random question!</p>
              <button onClick={this.fetchRandomQuestion}>
                Random Question
              </button>
            </div>
          ) : (
            <p>Oh no, there was an error fetching your question!</p>
          )}
        </div>
        <p>Points: {this.state.points}</p>
        <button onClick={this.resetPoints}>Reset Points:</button>
        <div className="question">
          {this.state.questionBank.length > 0
            ? this.state.questionBank.map((item, index) => {
                {
                  value = parseInt(item.value, 10) || 200;
                }
                return (
                  <ul>
                    <li key={index + Math.random() * 255}>
                      Question:{" "}
                      {item.question ||
                        "looks like there's no question, feel free to skip this one."}
                    </li>
                    <li key={index + Math.random() * 255}>
                      Category Title:{" "}
                      {item.category.title ||
                        "there's no category for this one"}
                    </li>
                    <li key={index + Math.random() * 255} className="points">
                      Points: {item.value || 200}
                    </li>
                    <button className="check-answer" onClick={this.showAnswer}>
                      Check Answer
                    </button>
                    <li key={index + Math.random() * 255} id="hidden">
                      Answer: {`What is ${item.answer}?`}
                    </li>
                    <li key={index + Math.random() * 255} id="point-buttons">
                      <button
                        onClick={this.rightAnswer}
                        disabled={this.state.disableButtons}
                      >
                        I got it right!
                      </button>
                      <button
                        onClick={this.wrongAnswer}
                        disabled={this.state.disableButtons}
                      >
                        I got it wrong.
                      </button>
                    </li>
                  </ul>
                );
              })
            : null}
        </div>
      </div>
    );
  }
}

export default App;
