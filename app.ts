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

// let frenchMenData: Array<FrenchMen>;
// let frenchMenAges: Array<number> = [];

function getUsers(): Promise<Array<User>> {
  return fetch(
    'https://randomuser.me/api/?results=1000&gender=male&nat=fr&inc=name,location,dob,picture&noinfo'
  )
    .then((res) => res.json())
    .then((res) => {
      return res.results as Array<User>;
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

const tableResults = document.getElementById('tableResults');
getUsers().then((users) => {
  users.sort(compareAge);
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

    tableResults!.appendChild(newTableRow);
  }
});
