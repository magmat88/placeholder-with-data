const API_URL = 'https://randomuser.me/api/?results=1000&gender=male&nat=fr&inc=name,location,dob,picture&noinfo';
const TEXT_WITH_BACKGROUND = "#textWithBackground";
const USERS_COUNT = 10;
function compareAge(a, b) {
    if (a.dob.age > b.dob.age) {
        return -1;
    }
    if (a.dob.age < b.dob.age) {
        return 1;
    }
    return 0;
}
function sortByAge(users) {
    users.sort(compareAge);
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
function onClickHandler() {
    showLoadingIndicator();
    loadData();
}
function showLoadingIndicator() {
    document.getElementById('loadingIndicator').setAttribute('class', 'visible');
}
function loadData() {
    return getUsers().then((users) => {
        sortByAge(users);
        countUsersInRanges(users);
        users = users.slice(0, USERS_COUNT);
        const basicUserInfos = [
            ...users.map((user) => {
                return {
                    photo: user.picture.thumbnail,
                    age: user.dob.age.toString(),
                    name: `${user.name.first} ${user.name.last}`,
                    city: user.location.city,
                };
            }),
        ];
        hideLoadingIndicator();
        showTitles();
        showChart(users);
        createTable(basicUserInfos);
    });
}
function hideLoadingIndicator() {
    document.getElementById('loadingIndicator').setAttribute('class', 'hidden');
}
function getUsers() {
    return fetch(API_URL)
        .then((res) => res.json())
        .then((res) => {
        return res.results;
    });
}
const ageDistribution = {
    '20-29': 0,
    '30-39': 0,
    '40-49': 0,
    '50-59': 0,
    '60-69': 0,
    '70-79': 0,
    '80-89': 0,
};
function countUsersInRanges(users) {
    users.forEach((user) => {
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
    });
}
function showTitles() {
    document.getElementById('chartTitle').setAttribute('class', 'visible');
    document.getElementById('tableTitle').setAttribute('class', 'visible');
}
function createTable(users) {
    const headerRow = createTableHeader(users[0]);
    const rows = users.map((user) => createTableRow(user));
    let tableBody = '';
    rows.forEach((row) => (tableBody += row));
    document.getElementById('table').innerHTML = `
    <thead>${headerRow}</thead>
    <tbody>${tableBody}</tbody>
    `;
}
function createTableHeader(user) {
    let cells = '';
    for (const key in user) {
        cells += `
      <th>${key.toUpperCase()}</th>
    `;
    }
    return `<tr>${cells}</tr>`;
}
function createTableRow(user) {
    let cells = '';
    for (const key in user) {
        if (key === 'photo') {
            cells += `
      <td><img src=${user[key]} class=${key} /></td>
    `;
        }
        else {
            cells += `
      <td>${user[key]}</td>
    `;
        }
    }
    return `<tr>${cells}</tr>`;
}
function changeParagraphColorOnFifthRefresh() {
    var _a;
    const refreshCount = sessionStorage.getItem("pageRefreshCount") && parseInt(sessionStorage.getItem("pageRefreshCount")) || 0;
    if (refreshCount % 5 === 0) {
        (_a = document.querySelector(TEXT_WITH_BACKGROUND)) === null || _a === void 0 ? void 0 : _a.setAttribute('class', 'text--with-background');
    }
}
changeParagraphColorOnFifthRefresh();
