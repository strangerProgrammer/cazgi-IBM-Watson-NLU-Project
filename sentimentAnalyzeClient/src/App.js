import './bootstrap.min.css';
import './App.css';
import SentimentInfo from './SentimentInfo.js';
import EmotionTable from './EmotionTable.js';
import React from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';

class App extends React.Component {
  state = {innercomp:<textarea rows="4" cols="50" id="textinput"/>,
            mode: "text",
          sentimentOutput:[],
          sentiment:true
        }
  
  renderTextArea = ()=>{
    document.getElementById("textinput").value = "";
    if(this.state.mode === "url") {
      this.setState({innercomp:<textarea rows="4" cols="50" id="textinput"/>,
      mode: "text",
      sentimentOutput:[],
      sentiment:true
    })
    } 
  }

  renderTextBox = ()=>{
    document.getElementById("textinput").value = "";
    if(this.state.mode === "text") {
      this.setState({innercomp:<textarea rows="1" cols="50" id="textinput"/>,
      mode: "url",
      sentimentOutput:[],
      sentiment:true
    })
    }
  }

  sendForSentimentAnalysis = () => {
    this.setState({sentiment:true});
    let ret = "";
    let url = ".";

    if(this.state.mode === "url") {
      url = url+"/url/sentiment?url="+document.getElementById("textinput").value;
    } else {
      url = url+"/text/sentiment?text="+document.getElementById("textinput").value;
    }
    ret = axios.get(url);
    ret.then((response)=>{
      //Include code here to check the sentiment and fomrat the data accordingly
       
        if(response.data.result && response.data.result.keywords){
            
               
          this.setState({sentimentOutput:<SentimentInfo keywords={response.data.result.keywords}/>}); 
        }       
       
           
    }).catch(err => {      
      if(err.response){
        this.setState({sentimentOutput:<SentimentInfo keywords={err.response}/>});
        console.log(err.response);
      }else{
        console.log(err);       
      }
  });
  }

  sendForEmotionAnalysis = () => {
    this.setState({sentiment:false});
    let ret = "";
    let url = ".";
    if(this.state.mode === "url") {
      url = url+"/url/emotion?url="+document.getElementById("textinput").value;
    } else {
      url = url+"/text/emotion/?text="+document.getElementById("textinput").value;
    }
    ret = axios.get(url);

    ret.then((response)=>{
        this.setState({sentimentOutput:<EmotionTable emotions={response.data}/>});   
        console.log(response);   
     
    }).catch(err => {
      if(err.response){
        this.setState({sentimentOutput:<EmotionTable emotions={err.response}/>});
        console.log(err);
      }else{
        console.log(err);        
      }
    
    });

 
  }
  
  render() {
    return (  
      
      <div className="App">
        <Helmet>
          <title>Sentiment Analyzer</title>
        </Helmet>
      <button className="btn btn-info" onClick={this.renderTextArea}>Text</button>
        <button className="btn btn-dark"  onClick={this.renderTextBox}>URL</button>
        <br/><br/>
        {this.state.innercomp}
        <br/>
        <button className="btn-primary" onClick={this.sendForSentimentAnalysis}>Analyze Sentiment</button>
        <button className="btn-primary" onClick={this.sendForEmotionAnalysis}>Analyze Emotion</button>
        <br/>
            {this.state.sentimentOutput}
      </div>
    );
    }
}

export default App;