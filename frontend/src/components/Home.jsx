import React, { Component } from 'react';
import axios from 'axios';
import Loader from 'react-loader-spinner';

const classes = {
  parent: {
    "display" : "flex",
    "flex-direction" : "row",
    "width" : "50%",
    "border" : "1px dotted black",
    "border-radius" : "5px",
    "padding" : "10px",
    "background-color" : "#efefef"
  },
  column1: {
    "flex" : "1 1 0px",
    "text-align" : "initial",
    "padding-left" : "15px"
  },
  column2: {
    "flex" : "1 1 0px",
    "text-align" : "initial",
    "border-left" : "1px dotted black",
    "padding-left" : "15px"
  },
  textbox: {
    "width" : "500px",
    "height" : "40px",
    "padding-right": "20px"
  },
  submit: {
    "height" : "40px",
    "text-decoration": "none",
    "cursor": "pointer"
  },
  cell: {
    "padding" : "5px",
    "padding-right" : "30px"
  }
};


class Home extends Component {
  state = {
    fake: 0,
    clickbait: 0,
    biased: 0,
    data: "",
    content: "",
    working: false,
    feedback: false
  }

  isValidURL = (str) => {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
  }

  process = (e) => {
    this.setState({data : ""});
    e.preventDefault();
    const data = new FormData(e.target);
    const content = data.get('content');
    var url = "";
    if(this.isValidURL(content)) {
      url = 'https://api.fakenewsdetector.org/votes?url='+content+'&title=';
    }
    else {
      url = 'https://api.fakenewsdetector.org/votes_by_content?content='+content;
    }
    this.setState({working: true});
    axios.get(url)
      .then((response) => { 
          this.setState({ data:JSON.stringify(response.data, null, 4) })
          this.setState({
            working: false,
            feedback: false,
            fake: Math.ceil(response.data.robot.fake_news * 100),
            clickbait: Math.ceil(response.data.robot.clickbait),
            biased: Math.ceil(response.data.robot.extremely_biased * 100)
          });
        }
      )
      .catch((err) => {
          this.setState({ data:JSON.stringify(err, null, 4) })
          this.setState({working: false});
        }
      );

  }

  onContentChange = (e) => {
    this.setState({content: e.target.value});
  }

  submitFeedback = (e) => {
    e.preventDefault();
    this.setState({feedbackWorking: true});
    setTimeout(() => {
      this.setState({feedbackWorking: false, feedback: true});
    }, 2000);
  }

  render() {
    return (
      <div style={classes.base}>
        <center>
          <h1> Fake News Detector </h1>
          <h3>
            Team Dirty Bits' Deloitte Technoutsav 2.0 project
          </h3>

          This is a demo website for our project. Just enter some text or a link in the text box below and press the button for the magic to happen.

          <br/><br/><br/><br/>
          <form onSubmit={this.process} action="" method="POST">
            <input
              required={true}
              type="text"
              onChange={this.onContentChange}
              name="content"
              style={classes.textbox}
              placeholder="URL or news text"
            />
            &nbsp;&nbsp;
            <input
              type="submit"
              disabled={this.state.working}
              style={classes.submit}
              value="Analyze"
            />
          </form>

          <br/><br/>
          {
            this.state.data !== "" && (
              <div style = {classes.parent}>
                <div style = {classes.column1}>
                  <h2>Response</h2>
                  <pre style={{"font-size":"15px"}}>
                    {this.state.data}
                  </pre>
                </div>
                <div style = {classes.column2}>
                  <h2>Verdict</h2>
                  <table>
                    <tr>
                      <td style={classes.cell}>Fake News</td>
                      <td style={classes.cell}><b>{this.state.fake}%</b></td>
                    </tr>
                    <tr>
                      <td style={classes.cell}>Clickbait</td>
                      <td style={classes.cell}><b>{this.state.clickbait}%</b></td>
                    </tr>
                    <tr>
                      <td style={classes.cell}>Extremely Biased</td>
                      <td style={classes.cell}><b>{this.state.biased}%</b></td>
                    </tr>
                  </table>
                  <br/><br/>
                  <hr style={{"border-top" : "1px dotted black", "border-bottom" : "none"}}/>
                  <br/>
                  {
                    !this.state.feedback ? (
                      <div>
                        Think this is wrong? Help us by telling us what it is.
                        <br/><br/>
                        <form onSubmit={this.submitFeedback}>
                          <input
                            type="radio"
                            name="class"
                            value="fake"
                            style={{"margin-right":"12px"}}
                          />
                          Fake news<br/><br/>
                          <input
                            type="radio"
                            name="class"
                            value="bait"
                            style={{"margin-right":"12px"}}
                          />
                          Clickbait<br/><br/>
                          <input
                            type="radio"
                            name="class"
                            value="bias"
                            style={{"margin-right":"12px"}}
                          />
                          Extremely Biased<br/><br/>
                          <input
                            type="radio"
                            name="class"
                            value="legit"
                            style={{"margin-right":"12px"}}
                          />
                          Legitimate<br/><br/><br/>
                          {
                            this.state.feedbackWorking
                            ? <div style={{"margin-left" : "20px"}}>
                                <Loader
                                  type="Puff"
                                  color="#b0b0b0"
                                  height="30" 
                                  width="30"
                                />
                              </div>
                            : <input type="submit" value="Submit"/>
                          }
                        </form>
                      </div>
                    ) : (
                      <div>
                        <h2> Thanks! </h2>
                        <br/>
                        Your feedback has been submitted.<br/><br/>
                        Thank you for helping us out!
                        <br/><br/>
                      </div>
                    )
                  }
                  


                </div>
              </div>
            )
          }
          {
            this.state.working &&
            <div>
              <div style={{"height" : "100px"}} />
              <Loader 
                type="Puff"
                color="#b0b0b0"
                height="50" 
                width="50"
              />
            </div>
          }
        </center>
      </div>
    );
  }
}

export default Home;
