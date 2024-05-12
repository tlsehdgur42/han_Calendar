import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import "../../css/calendar.css";
import { HttpHeadersContext } from '../context/HttpHeadersProvider';


const PopupEvent = ({ clickedDate, onClose, userSelectedColor,setUserSelectedColor }) => {

  const { headers, setHeaders } = useContext(HttpHeadersContext);

  const [title, setTitle] = useState('');
  const [color, setColor] = useState('');
  const [date, setDate] = useState('');
  const [summary, setSummary] = useState('');
  const [startingHour, setStartingHour] = useState('');
  const [endingHour, setEndingHour] = useState('');
  const [eventId, setEventId] = useState(null); // 수정 모드인 경우 일정 ID를 저장할 상태

  useEffect(() => {
    fetchEventData();
  }, [clickedDate, headers]);
  

  const fetchEventData = async () => {
    if (clickedDate) {
      const eventDate = new Date(clickedDate.year, clickedDate.month - 1, clickedDate.date + 1);
      const formattedDate = eventDate.toISOString().split('T')[0];

      try {
        const response = await axios.get(`http://localhost:8989/event/date/${formattedDate}`, { headers: headers });
        const eventData = response.data;
        console.log(eventData.id);
        setTitle(eventData.title);
        setColor(eventData.color);
        setSummary(eventData.summary);
        setStartingHour(eventData.startingHour);
        setEndingHour(eventData.endingHour);
        setEventId(eventData.id);
      } catch (error) {
        setTitle('');
        setColor('');
        setSummary('');
        setStartingHour('');
        setEndingHour('');
        setEventId(null);
      }
    }
  };


  const handleSave = () => {
    // 클릭된 날짜로부터 Date 객체 생성
    const eventDate = new Date(clickedDate.year, clickedDate.month - 1, clickedDate.date + 1);

    // ISO 8601 형식으로 변환 (YYYY-MM-DD)
    const formattedDate = eventDate.toISOString().split('T')[0];

    // color 상태가 비어 있는 경우 #000000으로 설정
    const selectedColor = color || '#000000';

    const eventData = {
      id : eventId,
      title: title,
      color: selectedColor,
      date: formattedDate, // YYYY-MM-DD 형식으로 조합
      startingHour: startingHour,
      endingHour: endingHour,
      summary: summary,
    };

    // eventId 값에 따라 일정을 추가하거나 수정합니다.
    const url = eventId ? `http://localhost:8989/event/${eventId}` : 'http://localhost:8989/event';
    const method = eventId ? 'PUT' : 'POST';

    axios({
      method: method,
      url: url,
      data: eventData,
      headers: headers
    })
    .then(response => {
      const savedColor = response.data.color; // 서버에서 반환한 색상 값
      setUserSelectedColor([...userSelectedColor.slice(0, clickedDate.date - 1), savedColor, ...userSelectedColor.slice(clickedDate.date)]); // 색상 값을 업데이트하여 뷰에 반영
      console.log('캘린더 일정이 성공적으로 저장되었습니다.');
      onClose(); // 저장 후 팝업 닫기
    })
    .catch(error => {
      console.error('캘린더 일정 저장에 실패했습니다.', error);
    });
  };

  const handleDelete = () => {
    if (!eventId) {
      return; // eventId가 없으면 삭제할 이벤트가 없으므로 아무 작업도 수행하지 않습니다.
    }

    const confirmed = window.confirm('정말로 이 일정을 삭제하시겠습니까?');
    if (!confirmed) {
      return; // 사용자가 취소하면 아무 작업도 수행하지 않습니다.
    }

    axios.delete(`http://localhost:8989/event/${eventId}`, { headers: headers })
      .then(response => {
        console.log('캘린더 일정이 성공적으로 삭제되었습니다.');
        setUserSelectedColor(''); // 삭제 후 색상 값을 초기화하여 뷰에 반영
        onClose();
      })
      .catch(error => {
        console.error('캘린더 일정 삭제에 실패했습니다.', error);
      });
  };

  const handleColorChange = (selectedColor) => {
    setColor(selectedColor);
    // setUserSelectedColor(selectedColor); // 사용자가 선택한 색상값 업데이트
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
        <button onClick={handleSave}>{eventId ? '수정' : '저장'}</button>
        {eventId && <button onClick={handleDelete}>삭제</button>}
      </div>
    </div>
  );
};

export default PopupEvent;