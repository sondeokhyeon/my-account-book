import flatpickr from "flatpickr";
import handlebars, { create } from 'handlebars';
import axios from 'axios';
import { getId } from "../cmm";
import loadImage from "blueimp-load-image"

const closure = function () {
    const __form = '';
    return {
        setForm: function (formData) {
            this.__form = formData;
        },
        getForm: function () {
            return this.__form;
        }
    }
}

let formClosure = new closure();

export const ModalHandler = {
    init: () => {
        ModalHandler.show();
    },
    show: () => {
        getId('report-add__btn').addEventListener('click', () => {
            let formTemplate = handlebars.compile(document.getElementById('report-modal__insert-template').innerHTML);
            let template = handlebars.compile(document.getElementById('report-modal__template').innerHTML);
            let data = { title: '등록하기' }
            getId('report-modal__territory').innerHTML = '<div class="report-modal__background" id="report-modal__background"></div>';
            getId('report-modal__territory').innerHTML += template(data);
            getId('report-modal__body').innerHTML = formTemplate();
            getId('report-modal__territory').style.display = 'flex';
            ModalHandler.timeCheck();

            ModalHandler.close();
            ModalHandler.sourceHandler();
            ModalHandler.spendHandler();
            ModalHandler.submitHandler();
            ModalHandler.commentEventHandler();
            ModalHandler.imageUploadHadnler();
        })
    },
    close: () => {
        getId('report-modal__background').addEventListener('click', () => {
            getId('report-modal__territory').style.display = 'none';
        })
        getId('report-modal__close').addEventListener('click', () => {
            getId('report-modal__territory').style.display = 'none';
        })
        getId('report-modal__close-bottom').addEventListener('click', () => {
            getId('report-modal__territory').style.display = 'none';
        })
    },
    sourceHandler: () => {
        const srcContainer = getId('source-handler');
        const { origin } = location
        axios.get(origin + '/rf/sources')
            .then(result => {
                Array.from(result.data).map(item => {
                    srcContainer.innerHTML += '<option value=' + item.SRC_NO + '>' + item.SRC_NAME + '</option>'
                })
            })
    },
    spendHandler: () => {
        const first = getId('spen-first-handler')
        const second = getId('spen-second-handler')
        const third = getId('spen-third-handler')
        first.addEventListener('change', (event) => {
            ModalHandler.spendSelectHandler(event.target.selectedOptions[0].value, first, second, third)
        }, false);
    },
    timeAfterEventCheck: () => {
        getId('report_time').addEventListener('focusout', (event) => {
            getId('report-datetime').value = getId('report_date').value + ' ' + event.target.value
        })
    },
    timeCheck: () => {
        Array.from(document.getElementsByClassName('timerChk')).map(item => {
            item.addEventListener('click', () => {
                if (item.getAttribute('value') === 'now') {
                    const date = new Date();
                    const day = `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}`
                    const hour = `${date.getHours()}:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}`
                    getId('report_date').setAttribute('value', day);
                    getId('report_time').setAttribute('value', hour);
                    getId('report-datetime').value = day + ' ' + hour
                } else {
                    getId('report_date').setAttribute('value', '')
                    getId('report_time').setAttribute('value', '')
                }
                flatpickr(getId('report_date'));
                ModalHandler.timeAfterEventCheck();
            })
        })
    },
    commentEventHandler: () => {
        const comment = getId('comment')
        comment.addEventListener('focus', (event) => {
            comment.style.position = 'absolute'
            comment.style.width = '400px'
            comment.style.height = '200px'
            comment.style.left = '107px'
            comment.style.overflow = 'scroll'
        })
        comment.addEventListener('focusout', () => {
            comment.style.position = ''
            comment.style.width = '168px'
            comment.style.height = '50px'
        })
    },
    imageUploadHadnler: () => {
        getId('upload-photo').onchange = (e) => {
            console.log('123')
            const image = e.target.files[0];
            const fileType = image.type;
            loadImage(
                image,
                img => {
                    img.toBlob(blob => {
                        const createFile = new File([blob], image.name)
                        var formData = new FormData(getId('report-modal__form'));
                        formData.append('photo', createFile)
                        formClosure.setForm(formData);
                    }, fileType)
                },
                {
                    maxWidth: 1024,
                    orientation: true
                }
            )
        }
    },
    submitVaildate: () => {
        if (getId('report_date').getAttribute('value') === '') {
            alert('날짜가 지정이 안되었네요')
            return false;
        }
        if (getId('spen-first-handler').value === '선택하시오') {
            alert('대분류 지정했나요?')
            return false;
        }
        if (getId('spen-second-handler').value === '분류') {
            alert('소분류도 지정해야죠 지출 항목일땐 아래항목도 잊지 말고요')
            return false;
        }
        if (getId('report_money').value === '') {
            alert('금액을 빼먹으면 안되죠')
            return false;
        }
        return true;
    },
    submitHandler: () => {
        const form = getId('report-modal__form');
        let formData = '';
        getId('pen-major__add-btn').addEventListener('click', (event) => {
            if (ModalHandler.submitVaildate() === true) {
                if (confirm('등록하시겠소?') === true) {
                    if (formClosure.getForm() === undefined) {
                        formData = new FormData(form)
                    } else {
                        formData = formClosure.getForm()
                    }
                    axios.post('/rf/spen', formData, { headers: { 'Content-Type': 'application/json' } })
                        .then(result => {
                            if (result.data === 'success') {
                                if (confirm('이 창을 닫을까요?\n추가로 입력하려면 취소를 눌러요') === true) {
                                    location.reload();
                                } else {
                                    form.reset();
                                }
                            } else {
                                alert('저장실패했어요... 왜일까... 물어보세요')
                            }
                        })
                }

            }
            return false;
        })
    },
    spendSelectHandler: (item, first, second, third) => {
        if (item === '지출') {
            getId('spen-third-container').style.display = 'flex'
            second.addEventListener('change', async (event) => {
                ModalHandler.thirdOptionHandler(event.target.value, third)
            }, false);
        } else {
            getId('spen-third-container').style.display = 'none'
        }
        ModalHandler.secondOptionHandler(first, second)
    }, // spendSelectHandler

    secondOptionHandler: async (first, second) => {
        second.innerHTML = '';
        await axios.get(origin + '/rf/spend-first-handler', {
            params: {
                sort: first.value
            }
        }).then(result => {
            second.innerHTML = "<option selected disabled >분류</option>"
            Array.from(result.data).map(item => {
                if (item.ISMJ_NO) {
                    second.innerHTML += `<option value=${item.ISMJ_NO}>${item.ISMJ_MN_NM}</option>`
                } else {
                    second.innerHTML += `<option value=${item.ISMJ_MN_NM}>${item.ISMJ_MN_NM}</option>`
                }
            })
        }) //then
    }, // secondOptionHandler

    thirdOptionHandler: async (value, third) => {
        await axios.get(origin + '/rf/spend-sub-handler', {
            params: {
                sort: value
            }
        }).then(result => {
            third.innerHTML = "<option selected disabled >분류</option>"
            Array.from(result.data).map(item => {
                third.innerHTML += `<option value=${item.ISMJ_NO}>${item.ISMJ_MS_NM}</option>`
            })
        })
    }//thirdOptionHandler
} // ModalHandler

