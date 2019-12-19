import { getId } from "./cmm";

const pickerEvent = () => {
    yearPickerRender(new Date(event.target.innerText))
    getId('refYearPicker').setAttribute('value', event.target.innerText)
    pickerClose()
}   

const pickerClose = () => {
    document.getElementById('year_picker-container').style.display = 'none';
}

const yearPickerRender = (today) => {
    const date = today 
    let container = getId('year_picker_body');
    let thisYear = date.getFullYear();
        getId('year_title').innerText = thisYear;
    if(today === thisYear.toString() ) {
        return false;
    } else {
        container.innerText = '';
    }
    let startYear = date.getFullYear() - 4;
    let body = '';
    let flag = 0;
    for(let i = 0; i < 2; i++) {
        body = document.createElement('div')
        body.classList.add('picker-body__group')
        for (let x = 0; x < 3; x++) {
            const item = document.createElement('div')
            item.innerText = `${startYear + flag}`
            item.innerText === thisYear.toString() ? item.style.color = 'red' : ''
            item.onclick = () => {
                pickerEvent()
            }
            flag++
            body.appendChild(item)
        }
        container.appendChild(body)
    }
    getId('year_picker_close').addEventListener('click', pickerClose)
}
const yearPickerPrev = () => {
    getId('year_prev').addEventListener('click', () => {
        yearPickerRender(new Date((parseInt(getId('year_title').innerText) - 5).toString()))
    })
}

const yearPickerNext = () => {
    getId('year_next').addEventListener('click', () => {
        yearPickerRender(new Date((parseInt(getId('year_title').innerText) + 5).toString()))
    })
}

export const yearPickerInit = () => {
    getId('refYearPicker').setAttribute('value', new Date().getFullYear())
    getId('refYearPicker').addEventListener('click', () => {
        document.getElementById('year_picker-container').style.display = 'block';
    })
    yearPickerRender(new Date(getId('refYearPicker').getAttribute('value')))
    yearPickerPrev()
    yearPickerNext()
}