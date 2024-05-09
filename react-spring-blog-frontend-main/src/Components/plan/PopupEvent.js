import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import "../../css/calendar.css";
import { HttpHeadersContext } from '../context/HttpHeadersProvider';


const PopupEvent = ({ clickedDate, onClose, setUserSelectedColor }) => {

  const { headers, setHeaders } = useContext(HttpHeadersContext);

  const [title, setTitle] = useState('');
  const [color, setColor] = useState('#000000');
  const [date, setDate] = useState('');
  const [summary, setSummary] = useState('');
  const [startingHour, setStartingHour] = useState('');
  const [endingHour, setEndingHour] = useState('');
  const [eventId, setEventId] = useState(null); // 수정 모드인 경우 일정 ID를 저장할 상태


  useEffect(() => {
    // 클릭된 날짜 정보가 있고, 해당 날짜에 일정이 있는지 확인
    if (clickedDate) {
      const eventDate = new Date(clickedDate.year, clickedDate.month - 1, clickedDate.date + 1);
      const formattedDate = eventDate.toISOString().split('T')[0];

      axios.get(`http://localhost:8989/event/date/${formattedDate}`, { headers: headers })
      .then(response => {
        // 해당 날짜에 일정이 존재하는 경우, 일정 정보를 상태에 설정
        const eventData = response.data;

        setTitle(eventData.title);
        setColor(eventData.color);
        setSummary(eventData.summary);
        setStartingHour(eventData.startingHour);
        setEndingHour(eventData.endingHour);
        setEventId(eventData.id); // 수정 모드이므로 일정 ID 설정

        
      })
      .catch(error => {
        // 해당 날짜에 일정이 없는 경우, 초기화
        setTitle('');
        setColor('');
        setSummary('');
        setStartingHour('');
        setEndingHour('');
        setEventId(null);
      });
    }else{
      console.log("일정 없습니다.");
    }
  }, [clickedDate, headers]); // clickedDate가 변경될 때마다 실행


  const handleSave = () => {
    // 클릭된 날짜로부터 Date 객체 생성
    const eventDate = new Date(clickedDate.year, clickedDate.month - 1, clickedDate.date + 1);

    // ISO 8601 형식으로 변환 (YYYY-MM-DD)
    const formattedDate = eventDate.toISOString().split('T')[0];

    const eventData = {
      title: title,
      color: color,
      date: formattedDate, // YYYY-MM-DD 형식으로 조합
      startingHour: startingHour,
      endingHour: endingHour,
      summary: summary,
    };

    axios.post('http://localhost:8989/event', eventData, { headers: headers })
    .then(response => {
      console.log('캘린더 일정이 성공적으로 저장되었습니다.');
      console.log(color);
      onClose(); // 저장 후 팝업 닫기
    })
    .catch(error => {
      console.error('캘린더 일정 저장에 실패했습니다.', error);
    });
  };

  const handleColorChange = (selectedColor) => {
    setColor(selectedColor);
    setUserSelectedColor(selectedColor); // 사용자가 선택한 색상값 업데이트
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
        <input type="color" id="color" value={color} onChange={(e) => handleColorChange(e.target.value)} />
        <br/>
        <label htmlFor="summary">메모:</label>
        <input type="text" id="summary" value={summary} onChange={(e) => setSummary(e.target.value)} />
        <button onClick={handleSave}>저장</button>
      </div>
    </div>
  );
};

export default PopupEvent;

