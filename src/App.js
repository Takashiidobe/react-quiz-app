import React, { Component } from "react";
import "./App.css";
import axios from "axios";

//set some variables that we want to use later
const quizURL = `http://jservice.io/api`;
let value;

//we want to use state to hold some values
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionBank: [],
      error: false,
      points: 0,
      answer: "",
      disableButtons: null,
      hideButtons: true
    };
  }

  //fetch the previous points after mounting, or default to 0
  componentDidMount() {
    const previousPoints = localStorage.getItem("points");
    this.setState({
      points: previousPoints || 0
    });
  }

  //fetch a random question and assign it to the state so other components can use it
  fetchRandomQuestion = () => {
    axios
      .get(`${quizURL}/random`)
      .then(res =>
        this.setState({
          questionBank: res.data
        })
      )
      //if there is an error, set the error to true, and report an error message
      .catch(err =>
        this.setState({
          error: true
        })
      );
    //also reset the state of the buttons
    this.setState({
      disableButtons: null,
      hideButtons: true
    });
  };

  showAnswer = () => {
    this.setState({
      hideButtons: false
    });
  };

  //use parseInt to avoid string concatenation
  //set disable buttons to true so players can't continually press for more points
  rightAnswer = () => {
    this.setState({
      points: parseInt(this.state.points, 10) + parseInt(value, 10),
      disableButtons: true
    });
    //push to local storage
    localStorage.setItem(
      "points",
      parseInt(this.state.points, 10) + parseInt(value, 10)
    );
  };

  //use parseInt to avoid string concatenation
  //set disableButtons to true so the players can't press for more points
  wrongAnswer = () => {
    this.setState({
      points: parseInt(this.state.points, 10) - parseInt(value, 10),
      disableButtons: true
    });
    //push to local storage
    localStorage.setItem(
      "points",
      parseInt(this.state.points, 10) - parseInt(value, 10)
    );
  };

  //set the points to 0 and push to localstorage on function click
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
          {/* this block either renders a random question or an error if it can't connect to the api */}
          {this.state.error === false ? (
            <div>
              <p>Get a random question!</p>
              <button onClick={this.fetchRandomQuestion}>
                Random Question
              </button>
            </div>
          ) : (
            <p>
              Oh no, there was an error fetching your question! <br />
              Please check your internet connection.
            </p>
          )}
        </div>
        {/* This displays the amount of points to the user. */}
        <p>Points: {this.state.points}</p>
        <button onClick={this.resetPoints}>Reset Points:</button>
        <div className="question">
          {/* if we have a question from the api, please display this. */}
          {this.state.questionBank.length > 0
            ? this.state.questionBank.map((item, index) => {
                //if the value is not sent by the api, default it to 200
                value = parseInt(item.value, 10) || 200;
                //else we'll return this
                return (
                  //Render the question or if the api doesn't give one, render a message that says to skip this question.
                  <ul>
                    <li key={index + Math.random() * 255}>
                      Question:{" "}
                      {item.question ||
                        "looks like there's no question, feel free to skip this one."}
                    </li>
                    {/* sometimes the category won't show, if so, then render a message saying there is no category. */}
                    <li key={index + Math.random() * 255}>
                      Category Title:{" "}
                      {item.category.title || "This question has no category."}
                    </li>
                    {/* render the points that the question is worth.  If the api sends nothing, then it'll say 200. */}
                    <li key={index + Math.random() * 255} className="points">
                      Value: {item.value || 200}
                    </li>
                    {/* This button will show the answers if the contestant wants to know */}
                    <button
                      className="check-answer"
                      onClick={this.showAnswer}
                      disabled={this.state.disableButtons}
                    >
                      Check Answer
                    </button>
                    {/* renders the answer, hidden normally but when the check answer is clicked, it will show. */}
                    <li
                      key={index + Math.random() * 255}
                      hidden={this.state.hideButtons}
                    >
                      Answer: {`What is ${item.answer}?`}
                    </li>
                    {/* the correct answer button which will add points to our current total */}
                    <li
                      key={index + Math.random() * 255}
                      hidden={this.state.hideButtons}
                    >
                      <button
                        onClick={this.rightAnswer}
                        disabled={this.state.disableButtons}
                        className="button-primary"
                      >
                        I got it right!
                      </button>
                      <button
                        onClick={this.wrongAnswer}
                        disabled={this.state.disableButtons}
                        className="button-primary"
                      >
                        I got it wrong.
                      </button>
                      <br />
                      {/* allows you to get another question from right here. */}
                      <button onClick={this.fetchRandomQuestion}>
                        Get another question!
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
