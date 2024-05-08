import React, { useState, useContext } from 'react';
import axios from 'axios';
import "../../css/calendar.css";
import { HttpHeadersContext } from '../context/HttpHeadersProvider';


const PopupEvent = ({ clickedDate, onClose, setUserSelectedColor }) => {

  const { headers, setHeaders } = useContext(HttpHeadersContext);

  const [title, setTitle] = useState('');
  const [color, setColor] = useState('');
  const [date, setDate] = useState('');
  const [summary, setSummary] = useState('');
  const [startingHour, setStartingHour] = useState('');
  const [endingHour, setEndingHour] = useState('');

  
  const handleSave = () => {
    const eventData = {
      title: title,
      color: color,
      date: `${clickedDate.year}. ${clickedDate.month}. ${clickedDate.date}`,
      startingHour: startingHour,
      endingHour: endingHour,
      summary: summary,
    };

    axios.post('http://localhost:8989/event', eventData, { headers: headers })
    .then(response => {
      console.log('캘린더 일정이 성공적으로 저장되었습니다.');
      onClose(); // 저장 후 팝업 닫기
      setUserSelectedColor(color);
    })
    .catch(error => {
      console.error('캘린더 일정 저장에 실패했습니다.', error);
    });


  };

  return (
    <div className="popup">
      <div className="popup-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>일정 넣기</h2>
        <label htmlFor="title">제목:</label>
        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <p>클릭한 날짜: {clickedDate.year}. {clickedDate.month}. {clickedDate.date}</p> {/* 클릭한 날짜 출력 */}
        <label htmlFor='startingHour'>시작 시간:</label>
        <input type='time' id='startingHour' value={startingHour} onChange={(e) => setStartingHour(e.target.value)}/>
        <label htmlFor='endingHour'>끝 시간:</label>
        <input type='time' id='endingHour' value={endingHour} onChange={(e) => setEndingHour(e.target.value)}/>
        <br/>
        <label htmlFor="color">색상:</label>
        <input type="color" id="color" value={color} onChange={(e) => setColor(e.target.value)} />
        <br/>
        <label htmlFor="summary">메모:</label>
        <input type="text" id="summary" value={summary} onChange={(e) => setSummary(e.target.value)} />
        <button onClick={handleSave}>저장</button>
      </div>
    </div>
  );
};

export default PopupEvent;

