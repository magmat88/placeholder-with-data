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

function getUsers(): Promise<Array<User>> {
  return fetch(
    'https://randomuser.me/api/?results=1000&gender=male&nat=fr&inc=name,location,dob,picture&noinfo'
  )
    .then((res) => res.json())
    .then((res) => {
      return res.results as Array<User>;
    });
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
    if (user.dob.age >= 90 && user.dob.age < 100) {
      ageDistribution['90-99']++;
    }
  });
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
    } else {
      cells += `
      <td>${user[key]}</td>
    `;
    }
  }
  return `<tr>${cells}</tr>`;
}

function createTable(users) {
  const rows = users.map((user) => createTableRow(user));
  const headerRow = createTableHeader(users[0]);
  let tableBody = '';
  rows.forEach((row) => (tableBody += row));
  document.getElementById('table')!.innerHTML = `
    <thead>${headerRow}</thead>
    <tbody>${tableBody}</tbody>
    `;
}

function showChart(users) {
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

  const myChart: Chart = new Chart(
    document.getElementById('myChart') as HTMLCanvasElement,
    config
  );
}

function showLoadingIndicator() {
  document.getElementById('loadingIndicator')!.setAttribute('class', 'visible');
}

function hideLoadingIndicator() {
  document.getElementById('loadingIndicator')!.setAttribute('class', 'hidden');
}

function showTitles() {
  document.getElementById('chartTitle')!.setAttribute('class', 'visible');
  document.getElementById('tableTitle')!.setAttribute('class', 'visible');
}
const basicUserInfos: Array<any> = [];

function getBasicUserInfos(users) {
  users.forEach(user => {
    const basicUserInfo = {
    photo: user.picture.thumbnail, 
    age: user.dob.age.toString(),
    name: `${user.name.first} ${user.name.last}`, 
    city: user.location.city
  };
  basicUserInfos.push(basicUserInfo);
  return basicUserInfos;
  })
}

function sliceTenFirstUsers(users) {
  return users.slice(0, 10);
}

function loadData() {
  return getUsers().then((users) => {
    sortByAge(users);
    countUsersInRanges(users);
    users = sliceTenFirstUsers(users);
    hideLoadingIndicator();
    showTitles();
    showChart(users);
    getBasicUserInfos(users)
    console.log(basicUserInfos);
    createTable(basicUserInfos);
  });
}

const onClickHandler = () => {
  showLoadingIndicator();
  loadData();
  console.log('clicked');
};
