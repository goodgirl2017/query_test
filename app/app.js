// get the url
var url = window.location.href;
console.log(url.split("#")[0].split("=")[1]);
//getting the access token from url
var access_token = url.split("#")[1].split("=")[1].split("&")[0];
// get the userid
var userId = url.split("#")[1].split("=")[2].split("&")[0];
console.log(access_token);
console.log(userId);

// var access_token = 'a1ba0c905847fb4cc7d3919be113dd16';
// var userId = '22BCFK';
// console.log(access_token);
// console.log(userId);
var xhr = new XMLHttpRequest();
// xhr.open('GET', 'https://api.fitbit.com/1/user/' + userId + '/activities.json');
console.log('Updated log');
xhr.open('GET', 'https://api.fitbit.com/1/user/' + userId + '/activities/heart/date/today/1w.json');
xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
xhr.onload = function () {
    console.log(xhr.status)
    if (xhr.status === 200) {
        console.log(xhr.responseText)
        document.write(xhr.responseText)
    }
};

xhr.send()
