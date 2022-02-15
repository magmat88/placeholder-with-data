// let frenchMenData: Array<FrenchMen>;
// let frenchMenAges: Array<number> = [];
function getUsers() {
    return fetch('https://randomuser.me/api/?results=1000&gender=male&nat=fr&inc=name,location,dob,picture&noinfo')
        .then(function (res) { return res.json(); })
        .then(function (res) {
        return res.results;
        // frenchMenData = res.results;
        // let frenchMen: FrenchMen;
        // for (let frenchMen in frenchMenData) {
        //     frenchMenAges.push((frenchMen.dob.age);
        //     console.log(`${frenchMenData[0].name.first} ${frenchMenData[0].name.last}, age: ${frenchMenData[0].dob.age}, city: ${frenchMenData[0].location.city}`)
        // }
    });
}
// const result: HTMLElement | null = document.getElementById('result');
// const myResults = getUsers().then((users) => {
//   for (let user in users) {
//       console.log(user);
//   }
// });
function compareAge(a, b) {
    if (a.dob.age < b.dob.age) {
        return -1;
    }
    if (a.dob.age > b.dob.age) {
        return 1;
    }
    return 0;
}
var tableResults = document.getElementById('tableResults');
getUsers().then(function (users) {
    users.sort(compareAge);
    for (var i = 999; i >= 990; i--) {
        var newTableRow = document.createElement('tr');
        var newDataCellWithThumbnail = document.createElement('td');
        var newThumbnail = document.createElement('img');
        newThumbnail.setAttribute('src', "".concat(users[i].picture.thumbnail));
        newThumbnail.setAttribute('class', 'thumbnail');
        newDataCellWithThumbnail.appendChild(newThumbnail);
        newTableRow.appendChild(newDataCellWithThumbnail);
        var newDataCellWithAge = document.createElement('td');
        newDataCellWithAge.innerHTML = users[i].dob.age.toString();
        newTableRow.appendChild(newDataCellWithAge);
        var newDataCellWithName = document.createElement('td');
        newDataCellWithName.innerHTML = "".concat(users[i].name.first, " ").concat(users[i].name.last);
        newTableRow.appendChild(newDataCellWithName);
        var newDataCellWithCity = document.createElement('td');
        newDataCellWithCity.innerHTML = users[i].location.city.toString();
        newTableRow.appendChild(newDataCellWithCity);
        tableResults.appendChild(newTableRow);
    }
});
