import axios from "axios";

export const getId = (id) => {
    return document.getElementById(id);
}

export const commaSetup = (num) => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
export const formSerialize = (form) => {
    var field, s = [];
    if (typeof form == 'object' && form.nodeName == "FORM") {
        var len = form.elements.length;
        for (var i = 0; i < len; i++) {
            field = form.elements[i];
            if (field.name && !field.disabled && field.type != 'file' && field.type != 'reset' && field.type != 'submit' && field.type != 'button') {
                if (field.type == 'select-multiple') {
                    for (j = form.elements[i].options.length - 1; j >= 0; j--) {
                        if (field.options[j].selected)
                            s[s.length] = encodeURIComponent(field.name) + "=" + encodeURIComponent(field.options[j].value);
                    }
                } else if ((field.type != 'checkbox' && field.type != 'radio') || field.checked) {
                    s[s.length] = encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value);
                }
            }
        }
    }
    return s.join('&').replace(/%20/g, '+');
};

export const axiosHandler = async (url, method, data) => {
    let result;
    await axios[method](url, data)
        .then((res) => {
            result = res;
        }).catch(err => {
            console.log(err)
        })
    return result;
}
