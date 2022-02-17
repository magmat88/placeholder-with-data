interface BasicUserInfo {
  photo: string;
  age: string;
  name: string;
  city: string;
}

interface User {
  dob: {
    age: number;
    date: string;
  };

  location: {
    city: string;
    coordinates: {
      latitude: string;
      longitude: string;
    };
    country: string;
    postcode: number;
    state: string;
    street: {
      name: string;
      number: number;
    };
    timezone: {
      description: string;
      offset: string;
    };
  };
  name: {
    title: string;
    first: string;
    last: string;
  };
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
}

type Users = Array<User>;

const API_URL =
  'https://randomuser.me/api/?results=1000&gender=male&nat=fr&inc=name,location,dob,picture&noinfo';
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

enum AGE_RANGES {
  TWENTY_YEAR_OLDS = '20-29',
  THIRTY_YEAR_OLDS = '30-39',
  FOURTY_YEAR_OLDS = '40-49',
  FIFTY_YEAR_OLDS = '50-59',
  SIXTY_YEAR_OLDS = '60-69',
  SEVENTY_YEAR_OLDS = '70-79',
  EIGHTY_YEAR_OLDS = '80-89',
}

const ageDistribution = {
  [AGE_RANGES.TWENTY_YEAR_OLDS]: 0,
  [AGE_RANGES.THIRTY_YEAR_OLDS]: 0,
  [AGE_RANGES.FOURTY_YEAR_OLDS]: 0,
  [AGE_RANGES.FIFTY_YEAR_OLDS]: 0,
  [AGE_RANGES.SIXTY_YEAR_OLDS]: 0,
  [AGE_RANGES.SEVENTY_YEAR_OLDS]: 0,
  [AGE_RANGES.EIGHTY_YEAR_OLDS]: 0,
};

function showLoadingIndicator(): void {
  document
    .querySelector(LOADING_INDICATOR)
    ?.setAttribute('class', CLASS_VISIBLE);
}

function onClickHandler(): void {   
  if (document.querySelector(CHART_TITLE)?.className === CLASS_VISIBLE) {
    document.querySelector(CHART_TITLE)?.setAttribute('class', CLASS_HIDDEN);
  }
  if (document.querySelector(TABLE_TITLE)?.className === CLASS_VISIBLE) {
    document.querySelector(TABLE_TITLE)?.setAttribute('class', CLASS_HIDDEN);
  }
  clearChart();
  clearTable();
  showLoadingIndicator();
  loadData();
}

function loadData(): Promise<void> {
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

function hideLoadingIndicator(): void {
  document
    .querySelector(LOADING_INDICATOR)
    ?.setAttribute('class', CLASS_HIDDEN);
}

function getUsers(): Promise<Users> {
  return fetch(API_URL)
    .then((res) => res.json())
    .then((res) => {
      return res.results as Array<User>;
    });
}

function countUsersInRanges(users: Users): void {
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

function showTitles(): void {
  document.querySelector(CHART_TITLE)!.setAttribute('class', CLASS_VISIBLE);
  document.querySelector(TABLE_TITLE)!.setAttribute('class', CLASS_VISIBLE);
}

function createTable(basicUserInfos: Array<BasicUserInfo>) {
  const headerRow = createTableHeader(basicUserInfos[0]);
  const rows = basicUserInfos.map((basicUserInfo) =>
    createTableRow(basicUserInfo)
  );
  let tableBody = '';
  rows.forEach((row) => (tableBody += row));
  document.querySelector(TABLE)!.innerHTML = `
    <thead>${headerRow}</thead>
    <tbody>${tableBody}</tbody>
    `;
}

function createTableHeader(basicUserInfo: BasicUserInfo) {
  let cells = '';
  for (const key in basicUserInfo) {
    cells += `
      <th>${key.toUpperCase()}</th>
    `;
  }
  return `<tr>${cells}</tr>`;
}

function createTableRow(basicUserInfo: BasicUserInfo) {
  let cells = '';
  for (const key in basicUserInfo) {
    if (key === 'photo') {
      cells += `
      <td><img src=${basicUserInfo[key]} class=${key} /></td>
    `;
    } else {
      cells += `
      <td>${basicUserInfo[key]}</td>
    `;
    }
  }
  return `<tr>${cells}</tr>`;
}

function clearTable(): void {
  document.querySelector(TABLE)!.innerHTML = '';
}

function compareAge(a: User, b: User): number {
  if (a.dob.age > b.dob.age) {
    return -1;
  }
  if (a.dob.age < b.dob.age) {
    return 1;
  }
  return 0;
}

function sortByAge(users: Users) {
  users.sort(compareAge);
}

function createChart(users: Users) {
  const labels: Array<string> = [];
  const amountInRange: Array<number> = [];

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

  const myChart: Chart = new Chart(
    document.querySelector(MY_CHART) as HTMLCanvasElement,
    config
  );
}

function clearChart():void {
  document.querySelector("#chart")!.innerHTML = '<canvas id="myChart"></canvas>';
}

function changeParagraphColorOnFifthRefresh(): void {
  const refreshCount =
    (sessionStorage.getItem(PAGE_REFRESH_COUNT) &&
      parseInt(sessionStorage.getItem(PAGE_REFRESH_COUNT) as string)) ||
    0;

  if (refreshCount % 5 === 0) {
    document
      .querySelector(TEXT_WITH_BACKGROUND)
      ?.setAttribute('class', CLASS_TEXT_WITH_BACKGROUND);
  }
}

changeParagraphColorOnFifthRefresh();
