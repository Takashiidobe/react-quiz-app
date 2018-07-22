import React, { Component } from "react";
import "./App.css";
import axios from "axios";

const quizURL = `http://jservice.io/api`;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      questionBank: [],
      error: false,
      points: 0,
      answer: ""
    };
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
    const hiddenAnswer = document.querySelectorAll(".hidden");
    console.log(hiddenAnswer);
    hiddenAnswer.classList.remove("hidden");
  };

  rightAnswer = () => {
    this.setState({
      points: this.state.points + 100
    });
  };

  wrongAnswer = () => {
    this.setState({
      points: this.state.points - 100
    });
  };

  render() {
    return (
      <div className="App">
        <div className="App-intro">
          {this.state.error === false ? (
            <div>
              <form>
                <p>Would you like to refine your question?</p>
                <label htmlFor="category">Category:</label>
                <br />
                <input type="text" name="category" />
              </form>

              <p>Or just get a random one?</p>
              <button onClick={this.fetchRandomQuestion}>
                Random Question
              </button>
              <p>Maybe you'd like to ask more than one random question?</p>
              <label htmlFor="count">Number of Questions:</label>
              <input type="number" name="count" onChange={this.onNumChange} />
            </div>
          ) : (
            <p>Oh no, there was an error fetching your question!</p>
          )}
        </div>
        <p>Points: {this.state.points}</p>
        <div className="question">
          {this.state.questionBank.length > 0
            ? this.state.questionBank.map((item, index) => {
                return (
                  <ul>
                    <li key={index + Math.random() * 255}>
                      Question: {item.question}
                    </li>
                    <li key={index + Math.random() * 255}>
                      Category Title: {item.category.title || ""}
                    </li>
                    <li key={index + Math.random() * 255} className="points">
                      Points: {item.value}
                    </li>
                    <button className="check-answer" onClick={this.showAnswer}>
                      Check Answer
                    </button>
                    <li key={index + Math.random() * 255} className="hidden">
                      Answer: {item.answer}
                    </li>
                    <li key={index + Math.random() * 255} className="hidden">
                      <button onClick={this.rightAnswer}>
                        I got it right!
                      </button>
                      <button onClick={this.wrongAnswer}>
                        I didn't get it right.
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
