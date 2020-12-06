module.exports = date;

function date() {

    let today = new Date();

    let options = {
        day: "2-digit",
        month: "long",
        weekday: "long"
    };

    let day = today.toLocaleDateString("en-US", options);

    return day;

}

