function getUsers() {
    return fetch('https://randomuser.me/api/?results=1000&gender=male&nat=fr&inc=name,location,dob,picture&noinfo')
        .then((res) => res.json())
        .then((res) => {
        return res.results;
    });
}
function compareAge(a, b) {
    if (a.dob.age < b.dob.age) {
        return -1;
    }
    if (a.dob.age > b.dob.age) {
        return 1;
    }
    return 0;
}
function sortByAge(users) {
    users.sort(compareAge);
}
const ageDistribution = {
    '20-29': 0,
    '30-39': 0,
    '40-49': 0,
    '50-59': 0,
    '60-69': 0,
    '70-79': 0,
    '80-89': 0,
    '90-99': 0,
};
function countUsersInRanges(users) {
    users.forEach(user => {
        if (user.dob.age >= 20 && user.dob.age < 30) {
            ageDistribution['20-29']++;
        }
        if (user.dob.age >= 30 && user.dob.age < 40) {
            ageDistribution['30-39']++;
        }
        if (user.dob.age >= 40 && user.dob.age < 50) {
            ageDistribution['40-49']++;
        }
        if (user.dob.age >= 50 && user.dob.age < 60) {
            ageDistribution['50-59']++;
        }
        if (user.dob.age >= 60 && user.dob.age < 70) {
            ageDistribution['60-69']++;
        }
        if (user.dob.age >= 70 && user.dob.age < 80) {
            ageDistribution['70-79']++;
        }
        if (user.dob.age >= 80 && user.dob.age < 90) {
            ageDistribution['80-89']++;
        }
        if (user.dob.age >= 90 && user.dob.age < 100) {
            ageDistribution['90-99']++;
        }
    });
}
const infoArr = ['Thumbnail', 'Age', 'Name', 'City'];
function showTableHeader(infoArr) {
    const tableHeader = document.getElementById('tableHeader');
    const newTableRow = document.createElement('tr');
    infoArr.forEach(info => {
        const newHeader = document.createElement('th');
        newHeader.innerHTML = info;
        newTableRow.appendChild(newHeader);
    });
    tableHeader.appendChild(newTableRow);
}
function showTable(users) {
    const tableResults = document.getElementById('tableResults');
    showTableHeader(infoArr);
    for (let i = 999; i >= 990; i--) {
        const newTableRow = document.createElement('tr');
        const newDataCellWithThumbnail = document.createElement('td');
        const newThumbnail = document.createElement('img');
        newThumbnail.setAttribute('src', `${users[i].picture.thumbnail}`);
        newThumbnail.setAttribute('class', 'thumbnail');
        newDataCellWithThumbnail.appendChild(newThumbnail);
        newTableRow.appendChild(newDataCellWithThumbnail);
        const newDataCellWithAge = document.createElement('td');
        newDataCellWithAge.innerHTML = users[i].dob.age.toString();
        newTableRow.appendChild(newDataCellWithAge);
        const newDataCellWithName = document.createElement('td');
        newDataCellWithName.innerHTML = `${users[i].name.first} ${users[i].name.last}`;
        newTableRow.appendChild(newDataCellWithName);
        const newDataCellWithCity = document.createElement('td');
        newDataCellWithCity.innerHTML = users[i].location.city.toString();
        newTableRow.appendChild(newDataCellWithCity);
        tableResults.appendChild(newTableRow);
    }
}
function showChart(users) {
    const labels = [];
    const amountInRange = [];
    for (const range in ageDistribution) {
        labels.push(range);
        amountInRange.push(ageDistribution[range]);
    }
    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Distribution of French Men Age',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: amountInRange,
            },
        ],
    };
    const config = {
        type: 'bar',
        data: chartData,
        options: {
            responsive: true,
        },
    };
    const myChart = new Chart(document.getElementById('myChart'), config);
}
function showLoadingIndicator() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator === null || loadingIndicator === void 0 ? void 0 : loadingIndicator.setAttribute('class', 'visible');
}
function hideLoadingIndicator() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator === null || loadingIndicator === void 0 ? void 0 : loadingIndicator.setAttribute('class', 'hidden');
}
const chartTitle = document.getElementById('chartTitle');
const tableTitle = document.getElementById('tableTitle');
function showTitles(chartTitle, tableTitle) {
    chartTitle.setAttribute('class', 'visible');
    tableTitle.setAttribute('class', 'visible');
}
function loadData() {
    return getUsers().then((users) => {
        sortByAge(users);
        countUsersInRanges(users);
        hideLoadingIndicator();
        showTitles(chartTitle, tableTitle);
        showChart(users);
        showTable(users);
    });
}
const onClickHandler = () => {
    showLoadingIndicator();
    loadData();
    console.log('clicked');
};
