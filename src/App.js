import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { readableDate } from "./readableDate";
const socket = io.connect("https://videoserverwithsocket.onrender.com/");
function App() {
  const videoRef = useRef();
  const [message, setMessage] = useState({
    name: "",
    message: "",
    time: "",
  });
  const [timerArr, setTimerArr] = useState([]);
  const [timer, setTimer] = useState();
  const [date, setDate] = useState();
  const [time, setTime] = useState("");
  const trackTime = (e) => {
    setMessage({ ...message, time: e.target.value });
  };
  const trackDate = (e) => {
    setDate(e.target.value);
  };
  const [showMessage, setShowMessage] = useState([]);
  const trackMessage = (e) => {
    setMessage({ ...message, message: e.target.value });
  };
  const trackName = (e) => {
    setMessage({ ...message, name: e.target.value });
  };
  const sendMessage = (e) => {
    e.preventDefault();
    const inputYear = date?.split("-")[0];
    const inputMonth = date?.split("-")[1];
    const inputDay = date?.split("-")[2];
    let myDate = new Date(
      `${inputMonth} ${inputDay}, ${inputYear} ${message.time}`
    );

    socket.emit("send_message", { ...message, time: myDate });
    setMessage({ ...message, message: "" });
  };

  useEffect(() => {
    if (timerArr.length === 0) return;
    console.log("Hi world, Hello, ", timerArr[0]);
    videoRef.current.onloadstart = () => { 
      console.log('i want time', timerArr[0])
      const recentTime = timerArr[0];
      console.log('loading video')
      videoRef.current.currentTime = recentTime
    }
    
  }, [timerArr[0], time]);

  useEffect(() => {
    socket.on("receive_message", (msg) => {
      setShowMessage([...msg]);
    });
    socket.on("start_video", (msg) => {
      setTime(msg);
    });

    socket.on("count", (msg) => {
      setTimer(msg);
      if (timerArr.length < 1) {
        setTimerArr([...timerArr, msg]);
      } else {
        setTimerArr([...timerArr]);
      }
    });
  }, [socket, timer]);
  useEffect(() => {
    if (time) {
      socket.emit("give_time", "give time");
    }
  }, [time]);

  return (
    <div>
      {timerArr.length > 0 && time ? (
        <>
          <video
            ref={videoRef}
            width="100%"
            height="540"
            controls
            muted
            autoPlay
          >
            <source src="Assets/videos/parenting.mp4" type="video/mp4" />
          </video>
        </>
      ) : (
        <h2>Video will start soon, please wait...</h2>
      )}

      {/* {time ? <h1> {time}</h1> : ""} */}
      <form onSubmit={sendMessage}>
        <div>
          <input
            onChange={trackName}
            type="text"
            placeholder="Your name"
            value={message.name}
          />
        </div>

        <input
          onChange={trackMessage}
          type="text"
          placeholder="message"
          value={message.message}
        />
        <div>
          <input onChange={trackDate} type="date" />
        </div>
        <div>
          <input onChange={trackTime} type="time" value={message.time} />
        </div>
        <div>
          <button type="submit">Send message</button>
        </div>
      </form>
    </div>
  );
}

export default App;
