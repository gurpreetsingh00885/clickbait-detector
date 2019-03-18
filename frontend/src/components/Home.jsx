import React, { Component } from 'react';
import axios from 'axios';
// https://api.fakenewsdetector.org/votes_by_content?content=Protests against Donald Trump have occurred in the United States, Europe and elsewhere since his entry into the 2016 presidential campaign
//https://api.fakenewsdetector.org/votes?url=https://en.wikipedia.org/wiki/Al_Arabiya&title=
class Home extends Component {
  state = {
    data: false,
    content: ""
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
    e.preventDefault();
    const data = new FormData(e.target);
    const content = data.get('content');
    if(this.isValidURL(content)) {
      const url = 'https://api.fakenewsdetector.org/votes?url='+content+'&title=';
      axios.get(url)
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
    }
    else {
      const url = 'https://api.fakenewsdetector.org/votes_by_content?content='+content;
      axios.get(url)
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
    }
  }

  onContentChange = (e) => {
    this.setState({content: e.target.value});
  }

  render() {
    return (
      <div>
        <center>
          <h1> Fake News Detector </h1>
          <h3>
            Team Dirty Bits' Deloitte Technoutsav 2.0 project
          </h3>
        </center>

        This is a demo website for our project. Just enter some text or a link in the text box below and press the button for the magic.

        <br/><br/>
        <form onSubmit={this.process} action="" method="POST">
          <input
            required={true}
            type="text"
            onChange={this.onContentChange}
            name="content"
          />
          <input type="submit"/>
        </form>

        
      </div>
    );
  }
}

export default Home;
