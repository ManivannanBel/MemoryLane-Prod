import React, {useRef, useEffect} from 'react'
import './DatePicker.css';

function DatePicker(props : any) {
    const datePickerElement : any = useRef();
    const selectedDateElement : any = useRef();
    const datesElement : any = useRef();
    const mthElement : any = useRef();
    const nextMthElement : any = useRef();
    const prevMthElement : any = useRef();
    const daysElement : any = useRef();

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();

    let selectedDate = date;
    let selectedDay = day;
    let selectedMonth = month;
    let selectedYear = year;

    let timeout : any; 

    useEffect(() => {
        //if(mthElement.current)
        //props.setDate(date);
        mthElement.current.textContent =  months[month] + ' ' + year;
        selectedDateElement.current.textContent = formatDate(date);
        props.setDate(date);
        populateDates();
    })

    const onFocusHandler = () => {
        clearTimeout(timeout);
    }

    const hideCalender = () => {
        timeout = setTimeout(() => {
            datesElement.current.classList.toggle('active');
          });
    }

    const toggleDatePicker = (e) => {
        if(!datesElement.current.contains(e.target)){
            datesElement.current.classList.toggle('active');
        }
    }

    const goToNextMonth = () => {
        month++;
        if (month > 11) {
            month = 0;
            year++;
        }
        mthElement.current.textContent = months[month] + ' ' + year;
        populateDates();
    }

    const goToPrevMonth = () => {
        month--;
        if (month < 0) {
            month = 11;
            year--;
        }
        mthElement.current.textContent = months[month] + ' ' + year;
        populateDates();
    }

    const populateDates = () => {
        daysElement.current.innerHTML = '';
        let amount_days = 31;
    
        if (month == 1) {
            amount_days = 28;
        }
    
        for (let i = 0; i < amount_days; i++) {
            const day_element : any = document.createElement('div');
            day_element.classList.add('day');
            day_element.classList.add('noselect');
            day_element.textContent = i + 1;
    
            if (selectedDay == (i + 1) && selectedYear == year && selectedMonth == month) {
                day_element.classList.add('selected');
            }
    
            day_element.addEventListener('click', function () {
                selectedDate = new Date(year + '-' + (month + 1) + '-' + (i + 1));
                selectedDay = (i + 1);
                selectedMonth = month;
                selectedYear = year;

                selectedDateElement.current.textContent = formatDate(selectedDate);
                selectedDateElement.current.dataset.value = selectedDate;
    
                props.setDate(selectedDate);
                populateDates();
            });
    
            daysElement.current.appendChild(day_element);
        }
    }

    const checkEventPathForClass = (path, selector) => {
        for (let i = 0; i < path.length; i++) {
            if (path[i].classList && path[i].classList.contains(selector)) {
                return true;
            }
        }
        
        return false;
    }

    const formatDate = (d : any) => {
        let day = d.getDate();
        if (day < 10) {
            day = '0' + day;
        }
    
        let month = d.getMonth() + 1;
        if (month < 10) {
            month = '0' + month;
        }
    
        let year = d.getFullYear();
    
        return `${months[month - 1]} ${day}, ${year}`;
    }
    
    return (
        <div ref={datePickerElement} className={'datePicker noselect'}  onClick={toggleDatePicker} >
		<div className={'resDateWrape'}>
            <div ref={selectedDateElement} className={'selectedDate noselect'} ></div>
		</div>
        <div ref={datesElement} className={'dates'} >
			<div className={'month'}>
				<div ref={prevMthElement} className={`arrows arrowL prevMth noselect`} onClick={goToPrevMonth}>&lt;</div>
				<div ref={mthElement} className={`mth noselect`} ></div>
				<div ref={nextMthElement} className={`arrows arrowR nextMth noselect`} onClick={goToNextMonth}>&gt;</div>
			</div>

			<div ref={daysElement} className={'days'}></div>
		</div>
	</div>
    )
}

export default DatePicker
