import React, { Component } from 'react';
import axios from 'axios';
import Loader from 'react-loader-spinner';
// https://api.fakenewsdetector.org/votes_by_content?content=Protests against Donald Trump have occurred in the United States, Europe and elsewhere since his entry into the 2016 presidential campaign
//https://api.fakenewsdetector.org/votes?url=https://en.wikipedia.org/wiki/Al_Arabiya&title=

const results = props => (<h1> Results </h1>);


const classes = {
  parent: {
    "display" : "flex",
    "flex-direction" : "row",
    "width" : "50%",
    "border" : "1px dotted black",
    "border-radius" : "5px",
    "padding" : "10px",
    "background-color" : "lightgray"
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
    height : "40px"
  }
};


class Home extends Component {
  state = {
    data: "",
    content: "",
    working: false
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
          this.setState({working: false});
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

  render() {
    return (
      <div style={classes.base}>
        <center>
          <h1> Fake News Detector </h1>
          <h3>
            Team Dirty Bits' Deloitte Technoutsav 2.0 project
          </h3>

          This is a demo website for our project. Just enter some text or a link in the text box below and press the button for the magic.

          <br/><br/>
          <form onSubmit={this.process} action="" method="POST">
            <input
              required={true}
              type="text"
              onChange={this.onContentChange}
              name="content"
              style={classes.textbox}
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
                  <pre>
                    {this.state.data}
                  </pre>
                </div>
                <div style = {classes.column2}>
                  <results />
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
                color="#0f0f0f"
                height="100" 
                width="100"
              />
            </div>
          }
          
        </center>
      </div>
    );
  }
}

export default Home;
