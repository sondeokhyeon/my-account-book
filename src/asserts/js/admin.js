import handlebars from "handlebars"

const {pathname} = location

if(pathname.split('/')[1] === 'admin') {
    if(pathname.split('/')[2] === 'src') {
      const modalBtn    =  document.getElementById('modal-btn')
      const modalCloseBtn  =  document.getElementById('modal-close')
      const regiSubmitBtn  =  document.getElementById('regi-submit')
      const regiCancleBtn =  document.getElementById('regi-cancle')
            async function modalOpen() {
                const { origin } = location
                await fetch(origin + '/af/src-add', {
                    method: 'get'}
                )
                .then(result => {
                    return result.text();
                })
                .then(text => {
                    const select = document.getElementById('user_no');
                    const names = JSON.parse(text);
                    for (let index in names) {
                        select.innerHTML += `<option value=${names[index].USER_NO}> ${names[index].USER_NM} </option>`
                    }
                })
                document.getElementById('modals').style.display = 'flex'
            }

            function modalClose() {
                document.getElementById('modals').style.display = 'none'
            }

            function regiCancle() {
                document.getElementById('src-form').reset();
                document.getElementById('modals').style.display = 'none'
            }
            function regiSubmit() {
                if(confirm('등록할꺼에유?') === true) {
                    document.getElementById('src-form').submit();
                    return;
                } 
                return false;
            }

            function init() {
                modalBtn.addEventListener('click', modalOpen)
                modalCloseBtn.addEventListener('click', modalClose)
                regiSubmitBtn.addEventListener('click', regiSubmit)
                regiCancleBtn.addEventListener('click', regiCancle)
            }
            init();
    } 
    if(pathname.split('/')[2] === 'pen') {

        function penMajorManagerInit() {
            const src = document.getElementById("temp").innerHTML;
            const test = {item : 'test!'}
            const template = handlebars.compile(src)
            document.getElementById('body').innerHTML = template(test)
        }
        function penMinorManagerInit() {
            console.log('hello2')
        }

        function init() {
            document.getElementById('major').addEventListener('click', penMajorManagerInit)
            document.getElementById('minor').addEventListener('click', () => {
                console.log('123')
            })
        }
        init();
    } 
}

