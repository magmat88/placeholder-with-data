const API_URL = 'https://randomuser.me/api/?results=1000&gender=male&nat=fr&inc=name,location,dob,picture&noinfo';
const CHART_LABEL = 'Distribution of French Men Age';
const CHART_TITLE = '#chartTitle';
const CHART_TYPE = 'bar';
const CLASS_HIDDEN = 'hidden';
const CLASS_TEXT_WITH_BACKGROUND = 'text--with-background';
const CLASS_VISIBLE = 'visible';
const LOADING_INDICATOR = '#loadingIndicator';
const MY_CHART = '#myChart';
const PAGE_REFRESH_COUNT = 'pageRefreshCount';
const TABLE = '#table';
const TABLE_TITLE = '#tableTitle';
const TEXT_WITH_BACKGROUND = '#textWithBackground';
const USERS_COUNT = 10;
var AGE_RANGES;
(function (AGE_RANGES) {
    AGE_RANGES["TWENTY_YEAR_OLDS"] = "20-29";
    AGE_RANGES["THIRTY_YEAR_OLDS"] = "30-39";
    AGE_RANGES["FOURTY_YEAR_OLDS"] = "40-49";
    AGE_RANGES["FIFTY_YEAR_OLDS"] = "50-59";
    AGE_RANGES["SIXTY_YEAR_OLDS"] = "60-69";
    AGE_RANGES["SEVENTY_YEAR_OLDS"] = "70-79";
    AGE_RANGES["EIGHTY_YEAR_OLDS"] = "80-89";
})(AGE_RANGES || (AGE_RANGES = {}));
const ageDistribution = {
    [AGE_RANGES.TWENTY_YEAR_OLDS]: 0,
    [AGE_RANGES.THIRTY_YEAR_OLDS]: 0,
    [AGE_RANGES.FOURTY_YEAR_OLDS]: 0,
    [AGE_RANGES.FIFTY_YEAR_OLDS]: 0,
    [AGE_RANGES.SIXTY_YEAR_OLDS]: 0,
    [AGE_RANGES.SEVENTY_YEAR_OLDS]: 0,
    [AGE_RANGES.EIGHTY_YEAR_OLDS]: 0,
};
function showLoadingIndicator() {
    var _a;
    (_a = document
        .querySelector(LOADING_INDICATOR)) === null || _a === void 0 ? void 0 : _a.setAttribute('class', CLASS_VISIBLE);
}
function onClickHandler() {
    var _a, _b, _c, _d;
    if (((_a = document.querySelector(CHART_TITLE)) === null || _a === void 0 ? void 0 : _a.className) === CLASS_VISIBLE) {
        (_b = document.querySelector(CHART_TITLE)) === null || _b === void 0 ? void 0 : _b.setAttribute('class', CLASS_HIDDEN);
    }
    if (((_c = document.querySelector(TABLE_TITLE)) === null || _c === void 0 ? void 0 : _c.className) === CLASS_VISIBLE) {
        (_d = document.querySelector(TABLE_TITLE)) === null || _d === void 0 ? void 0 : _d.setAttribute('class', CLASS_HIDDEN);
    }
    clearChart();
    clearTable();
    showLoadingIndicator();
    loadData();
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
        createChart(users);
        createTable(basicUserInfos);
    });
}
function hideLoadingIndicator() {
    var _a;
    (_a = document
        .querySelector(LOADING_INDICATOR)) === null || _a === void 0 ? void 0 : _a.setAttribute('class', CLASS_HIDDEN);
}
function getUsers() {
    return fetch(API_URL)
        .then((res) => res.json())
        .then((res) => {
        return res.results;
    });
}
function countUsersInRanges(users) {
    users.forEach((user) => {
        if (user.dob.age >= 20 && user.dob.age < 30) {
            ageDistribution[AGE_RANGES.TWENTY_YEAR_OLDS]++;
        }
        if (user.dob.age >= 30 && user.dob.age < 40) {
            ageDistribution[AGE_RANGES.THIRTY_YEAR_OLDS]++;
        }
        if (user.dob.age >= 40 && user.dob.age < 50) {
            ageDistribution[AGE_RANGES.FOURTY_YEAR_OLDS]++;
        }
        if (user.dob.age >= 50 && user.dob.age < 60) {
            ageDistribution[AGE_RANGES.FIFTY_YEAR_OLDS]++;
        }
        if (user.dob.age >= 60 && user.dob.age < 70) {
            ageDistribution[AGE_RANGES.SIXTY_YEAR_OLDS]++;
        }
        if (user.dob.age >= 70 && user.dob.age < 80) {
            ageDistribution[AGE_RANGES.SEVENTY_YEAR_OLDS]++;
        }
        if (user.dob.age >= 80 && user.dob.age < 90) {
            ageDistribution[AGE_RANGES.EIGHTY_YEAR_OLDS]++;
        }
    });
}
function showTitles() {
    document.querySelector(CHART_TITLE).setAttribute('class', CLASS_VISIBLE);
    document.querySelector(TABLE_TITLE).setAttribute('class', CLASS_VISIBLE);
}
function createTable(basicUserInfos) {
    const headerRow = createTableHeader(basicUserInfos[0]);
    const rows = basicUserInfos.map((basicUserInfo) => createTableRow(basicUserInfo));
    let tableBody = '';
    rows.forEach((row) => (tableBody += row));
    document.querySelector(TABLE).innerHTML = `
    <thead>${headerRow}</thead>
    <tbody>${tableBody}</tbody>
    `;
}
function createTableHeader(basicUserInfo) {
    let cells = '';
    for (const key in basicUserInfo) {
        cells += `
      <th>${key.toUpperCase()}</th>
    `;
    }
    return `<tr>${cells}</tr>`;
}
function createTableRow(basicUserInfo) {
    let cells = '';
    for (const key in basicUserInfo) {
        if (key === 'photo') {
            cells += `
      <td><img src=${basicUserInfo[key]} class=${key} /></td>
    `;
        }
        else {
            cells += `
      <td>${basicUserInfo[key]}</td>
    `;
        }
    }
    return `<tr>${cells}</tr>`;
}
function clearTable() {
    document.querySelector(TABLE).innerHTML = '';
}
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
function createChart(users) {
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
                label: CHART_LABEL,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: amountInRange,
            },
        ],
    };
    const config = {
        type: CHART_TYPE,
        data: chartData,
        options: {
            responsive: true,
        },
    };
    const myChart = new Chart(document.querySelector(MY_CHART), config);
}
function clearChart() {
    document.querySelector("#chart").innerHTML = '<canvas id="myChart"></canvas>';
}
function changeParagraphColorOnFifthRefresh() {
    var _a;
    const refreshCount = (sessionStorage.getItem(PAGE_REFRESH_COUNT) &&
        parseInt(sessionStorage.getItem(PAGE_REFRESH_COUNT))) ||
        0;
    if (refreshCount % 5 === 0) {
        (_a = document
            .querySelector(TEXT_WITH_BACKGROUND)) === null || _a === void 0 ? void 0 : _a.setAttribute('class', CLASS_TEXT_WITH_BACKGROUND);
    }
}
changeParagraphColorOnFifthRefresh();
