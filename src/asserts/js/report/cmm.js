
export const getId = (id) => {
    return document.getElementById(id);
}

export const commaSetup = (num) => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g,'$1,')
}