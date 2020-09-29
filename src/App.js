import React, { Component } from 'react';
import Calendar from 'react-calendar';
import './App.css';
import'bootstrap/dist/css/bootstrap.min.css';
import 'react-calendar/dist/Calendar.css';
import {app} from './config.js';
import Firebase from "firebase";
import MicRecorder from 'mic-recorder-to-mp3';
import "firebase/storage";
var database = Firebase.database();
var storage=Firebase.storage();
const Mp3Recorder = new MicRecorder({ bitRate: 128 });
class App extends Component {

  async componentWillMount() {
    await this.aud()
  }
  async aud(){
    navigator.getUserMedia({ audio: true },
    () => {
      console.log('Permission Granted');
      this.setState({ isBlocked: false });
    },
    () => {
      console.log('Permission Denied');
      this.setState({ isBlocked: true })
    },
  );
  }
  onEmId=(event)=>{
      this.setState({em:event.target.value})
    }
  textChange=(event)=>{
        this.setState({text:event.target.value})
      }
  onCalChange = date => this.setState({ date })
  onSubmitClick=()=>{

    var di=new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(this.state.date)
    var obj={name:this.state.em,
             date:di,
             slot:this.state.slot,
             audioUrl:this.state.urlo,
             descreption:this.state.text}
    database.ref('/').push(obj);
    this.setState({em:''})
  }

start = () => {
  if (this.state.isBlocked) {
    console.log('Permission Denied');
  } else {
    this.setState({ isRecording: true });
    Mp3Recorder.start()
  }
};
stop = () => {
  const setUrl=(url)=>{
      this.setState({urlo:url})
  }
  Mp3Recorder
    .stop()
    .getMp3()
    .then(([buffer, blob]) => {
      const blobURL = URL.createObjectURL(blob)
      const audName='audio/'+this.state.em+'.mp3'
      this.setState({ blobURL, isRecording: false });
      let filey = new File(buffer,audName, {
      type: blob.type,
      lastModified: Date.now()
      });
      this.setState({file:filey});
      let storageRef = app.storage().ref()
      let fileRef = storageRef.child(this.state.file.name)
      fileRef.put(this.state.file).then(() => {
        var starsRef = storage.ref().child(this.state.file.name);
        starsRef.getDownloadURL().then(function(url) {
          setUrl(url)
        })
        console.log("Uploaded a file")

      });

    }).catch((e) => console.log(e));

};

retake= ()=>{
  this.setState({blobURL:''});
}
onSlotChange=(event)=>{
  this.setState({slot:event.target.value});
}

constructor(props){
  super(props)
  this.state = {
  em:'',
  isRecording: false,
  blobURL: '',
  isBlocked: false,
  urlo:'',
  file:'',
  slot:'',
  text:'',
  date: new Date()
  }
  }
  render() {
  return (
    <div>
    <div className="container mx-auto">
    <form onSubmit={this.onSubmitClick}>
    <div className="form-group">
      <label for="exampleInputEmail1">Name</label>
      <input type="text" className="form-control" id="name" placeholder="Enter name" onChange={this.onEmId}/>
    </div>
      <label for="appointmentDate">appointment Date:</label>
    <Calendar
         onChange={this.onCalChange}
         value={this.state.date}
       />
    <label for="appointmentDate">appointment Slot:</label>
    <div onChange={this.onSlotChange} className="form-group">
      <input type="radio" value="10:00am-11:00am" name="slot" /> 10:00am-11:00am
      <input type="radio" value="11:00am-12:00pm" name="slot" />11:00am-12:00pm
      <input type="radio" value="12:00pm-1:00pm" name="slot" /> 12:00pm-1:00pm
      <input type="radio" value="1:00pm-2:00pm" name="slot" /> 1:00pm-2:00pm
    </div>
    <br/>
    <label for="Record">Record your Message</label>
    <div className="container">
    <button onClick={this.start} disabled={this.state.isRecording}>
     Record
    </button>
    <button onClick={this.stop} disabled={!this.state.isRecording}>
     Stop
    </button>
    <button onClick={this.retake} disabled={this.state.isRecording}>
     Retake
    </button>
    <br/>
    <audio src={this.state.blobURL} controls="controls" />
    </div>
    <div className="form-group">
    <label for="exampleInputEmail1">Descreption</label>
    <input type="text" className="form-control" id="name" placeholder="Enter name" onChange={this.textChange}/>
  </div>
    <button type="submit" className="btn btn-primary">Submit</button>
  </form>
  </div>
  </div>
  );
}
}

export default App;
