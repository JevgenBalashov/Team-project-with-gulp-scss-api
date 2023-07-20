// e-mail: jvgnbal@gmail.com
// password: Toriando123

// TOKEN VLAD: 20295ff8-73ed-4e93-ae50-6574689fc9ec (vlad-soruk@ukr.net; sorvlad2023)
// TOKEN VLAD: bc22e245-7048-448e-9f5c-c525def0180e

let cardElem;


class App {
  constructor() {
    this.loginButton = document.getElementById("login__button");
    this.loginForm = document.querySelector(".login__form");
    this.createVisitButton = document.querySelector('.header_btn.second__btn');
    this.closeIcon = document.querySelector('.close-icon');
    this.logOutButton = document.getElementById("logout__button");
    this.visitWindow = document.querySelector('.visit__window');
    this.closeVisitWindow = document.querySelector('.icon-close');
    this.emailInput = document.getElementById("email");
    this.passwordInput = document.getElementById("password");
    this.registerForm = document.querySelector(".register__form");
    this.registerEmailInput = document.getElementById("register-email");
    this.registerPasswordInput = document.getElementById("register-password");

    this.initialize();
  }

  initialize() {
    this.addEventListeners();
    this.checkAuthentication();
  }

  addEventListeners() {
    // При натисненні користувачем на хрестик чи поза межами
    // модального вікна форми створення візиту, модальне вікно закривається
    this.visitWindow.addEventListener('click', (event) => {
      if ( event.target === document.querySelector('.visit__window') || event.target.classList.contains('fa-xmark') ){
        this.visitWindow.style.display = 'none';
        document.body.style.overflow = '';
      }
    });

    // При відкритті модального вікна
    // відключаємо можливість скролу сторінки
    this.createVisitButton.addEventListener("click", () => {
      window.scrollTo(0, 0);
      this.visitWindow.style.display = "block";
      document.body.style.overflow = 'hidden';
    });

    this.loginButton.addEventListener("click", () => {
      window.scrollTo(0, 0);
      this.loginForm.style.display = "block";
      document.body.style.overflow = 'hidden';
    });

    this.loginForm.addEventListener("submit", (event) => {
      document.body.style.overflow = '';
      event.preventDefault();
      this.handleLoginFormSubmit();
    });

    this.logOutButton.addEventListener("click", () => {
      this.logout();
    });

    // При натисненні користувачем на хрестик чи поза межами
    // модального вікна форми логіну, модальне вікно закривається
    this.loginForm.addEventListener('click', (event) => {
      if ( event.target === document.querySelector('div.form__baground') || event.target.classList.contains('fa-xmark') ){
        this.loginForm.style.display = 'none';
        document.body.style.overflow = '';
      }
    });

    if (this.registerForm) {
      this.registerForm.addEventListener("submit", (event) => {
        document.body.style.overflow = '';
        event.preventDefault();
        this.handleRegisterFormSubmit();
      });
    }
  }

  checkAuthentication() {
    if (this.isAuthenticated()) {
      this.showLoggedInState();
    } else {
      this.showLoggedOutState();
    }
  }

  handleLoginFormSubmit() {
    const email = this.emailInput.value;
    const password = this.passwordInput.value;

    this.login(email, password)
      .then((isAuthenticated) => {
        if (isAuthenticated) {
          console.log("Користувач успішно авторизований!");
          this.loginForm.style.display = 'none';
          this.showLoggedInState();
        }
      })
      .catch((error) => {
        console.log(`Помилка при авторизації: ${error.message}`);
      });
  }

  handleRegisterFormSubmit() {
    const email = this.registerEmailInput.value;
    const password = this.registerPasswordInput.value;

    this.register(email, password)
      .then((isRegistered) => {
        if (isRegistered) {
          console.log("Користувач успішно зареєстрований!");
        }
      })
      .catch((error) => {
        console.log(`Помилка при реєстрації: ${error.message}`);
      });
  }

  login(email, password) {
    const data = {
      email: email,
      password: password,
    };

    return fetch("https://ajax.test-danit.com/api/v2/cards/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          return response.text();
        } else {
          const errorMessage = `Помилка при отриманні токена: ${response.status}`;
          throw new Error(errorMessage);
        }
      })
      .then((token) => {
        this.saveToken(token);
        return true;
      })
      .catch((error) => {
        throw new Error(`Помилка при виконанні запиту: ${error}`);
      });
  }

  register(email, password) {
    const data = {
      email: email,
      password: password,
    };

    return fetch("https://ajax.test-danit.com/api/v2/cards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          return response.text();
        } else {
          return response.text().then((errorMessage) => {
            throw new Error(errorMessage);
          });
        }
      })
      .then((token) => {
        this.saveToken(token);
        return true;
      })
      .catch((error) => {
        throw new Error(`Помилка при виконанні запиту: ${error}`);
      });
  }

  logout() {
    this.removeToken();
    console.log("Користувач вийшов з аккаунту");
    this.showLoggedOutState();
  }

  saveToken(token) {
    localStorage.setItem("token", token);
  }

  getToken() {
    return localStorage.getItem("token");
  }

  removeToken() {
    localStorage.removeItem("token");
  }

  isAuthenticated() {
    const token = this.getToken();
    return token !== null && token !== undefined;
  }

  showLoggedInState() {
    this.loginButton.style.display = "none";
    this.createVisitButton.style.display = "inline-block";
    this.logOutButton.style.display = "block";
  }

  showLoggedOutState() {
    this.loginButton.style.display = "block";
    this.createVisitButton.style.display = "none";
    this.logOutButton.style.display = "none";
  }
}

const app = new App();



// =================================================================
// =================================================================
// =================================================================
// =================================================================




class Modal {
  constructor() {
    // Спочатку властивість editingCard класу Modal має значення false
    // Проте коли користувач натисне на іконку редагування картки, 
    // властивість змінить значення на true
    this.editingCard = false;

    this.editBtn = document.querySelector('.visit__edit-btn');
    // this.editBtn.addEventListener('click', this.onEditButtonClick)

    this.cardiologistFields = {
      typicalPressure: document.querySelector('.visit__info-typical-pressure'),
      bodyMassIndex: document.querySelector('.visit__info-body-mass-index'),
      heartDiseases: document.querySelector('.visit__info-heart-diseases'),
      ageCardiologist: document.querySelector('.visit__info-age-cardiologist')
    };
  
    this.dentistFields = {
      lastVisitDate: document.querySelector('.visit__info-last-visit-date')
    };
  
    this.therapistFields = {
      ageTherapist: document.querySelector('.visit__info-age-therapist')
    };
  
    this.hideCardiologistFields = () => {
      Object.values(this.cardiologistFields).forEach(field => {
        field.style.display = 'none';
      });
    };
  
    this.hideDentistFields = () => {
      Object.values(this.dentistFields).forEach(field => {
        field.style.display = 'none';
      });
    };
  
    this.hideTherapistFields = () => {
      Object.values(this.therapistFields).forEach(field => {
        field.style.display = 'none';
      });
    };
  
    // this.hideCardiologistFields();
    // this.hideDentistFields();
    // this.hideTherapistFields();
  
    document.querySelector('.visit__info-doctor').addEventListener('change', (event) => {
      console.log(event);
      const selectedDoctor = document.querySelector('.visit__info-doctor').value;
    
      this.hideCardiologistFields();
      this.hideDentistFields();
      this.hideTherapistFields();
    
      if (selectedDoctor === 'cardiologist') {
        Object.values(this.cardiologistFields).forEach(field => {
          field.style.display = 'block';
        });
      } else if (selectedDoctor === 'dentist') {
        Object.values(this.dentistFields).forEach(field => {
          field.style.display = 'block';
        });
      } else if (selectedDoctor === 'therapist') {
        Object.values(this.therapistFields).forEach(field => {
          field.style.display = 'block';
        });
      }
    });

    // document.querySelector('.visit__info-form').addEventListener('submit', event => {
  
    document.querySelector('.visit__create-btn').addEventListener('click', event => {
      event.preventDefault();
      
      // Закриваємо модальне вікно
      document.querySelector('.visit__window').style.display = 'none';

      // Дозволяємо скролити сторінку
      document.body.style.overflow = '';
    
      if (!this.editingCard) {
        const fullName = document.querySelector('.visit__info-fullname').value;
        const doctor = document.querySelector('.visit__info-doctor').value;
        const purpose = document.querySelector('.visit__info-purpose').value;
        const description = document.querySelector('.visit__info-description').value;
        const urgency = document.querySelector('.visit__info-urgency').value;
      
        let additionalFields = {};
        if (doctor === 'cardiologist') {
          additionalFields.bp = this.cardiologistFields.typicalPressure.value;
          // Body mass index
          additionalFields.bodyMassIndex = this.cardiologistFields.bodyMassIndex.value;
          // Heart diseases
          additionalFields.heartDiseases = this.cardiologistFields.heartDiseases.value;
          additionalFields.age = this.cardiologistFields.ageCardiologist.value;
        } else if (doctor === 'dentist') {
          additionalFields.lastVisitDate = this.dentistFields.lastVisitDate.value;
        } else if (doctor === 'therapist') {
          additionalFields.age = this.therapistFields.ageTherapist.value;
        }
      
        const cardData = {
          clientName: fullName,
          doctor,
          description: `${purpose} - ${description}`,
          urgency,
          ...additionalFields
        };

        fetch("https://ajax.test-danit.com/api/v2/cards", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // замініть 'ad62d8cc-c743-41e0-918c-cc6bfc73a2fe' на ваш токен або змінну з токеном
        },
        body: JSON.stringify(cardData)
      })
        .then(response => response.json())
        .then(response => {
          // Видаляємо надпис "No items here yet"
          document.querySelector('.visit__cards-notification').style.display = 'none';
          this.showCard(response);
          this.setupDeleteEventListener(cardElem, response.id, response);
          // this.setupEditEventListener(cardElem, response.id);
          // this.setupMoreInfoEventListener(cardElem, response.id);
          console.log(response);
        })
        .catch(error => {
          console.error('Помилка при виконанні запиту:', error);
        });

      }
    })
  }

  // onEditButtonClick (event) {
    // event.preventDefault();
    // document.querySelector('.visit__window').style.display = 'none';
    // document.body.style.overflow = '';

  //   console.log('Editing card info...');
  //         const fullName = document.querySelector('.visit__info-fullname').value;
  //         const doctor = document.querySelector('.visit__info-doctor').value;
  //         const purpose = document.querySelector('.visit__info-purpose').value;
  //         const description = document.querySelector('.visit__info-description').value;
  //         const urgency = document.querySelector('.visit__info-urgency').value;

  //         console.log(fullName, doctor, purpose, description, urgency);

  //         let additionalFields = {};
  //         if (doctor === 'cardiologist') {
  //           additionalFields.bp = document.querySelector('.visit__info-typical-pressure');
  //           // Body mass index
  //           additionalFields.bodyMassIndex = document.querySelector('.visit__info-body-mass-index');
  //           // Heart diseases
  //           additionalFields.heartDiseases = document.querySelector('.visit__info-heart-diseases');
  //           additionalFields.age = document.querySelector('.visit__info-age-cardiologist');
  //         } else if (doctor === 'dentist') {
  //           additionalFields.lastVisitDate = document.querySelector('.visit__info-last-visit-date');
  //         } else if (doctor === 'therapist') {
  //           additionalFields.age =  document.querySelector('.visit__info-age-therapist');
  //         }
        
  //         const cardData = {
  //           clientName: fullName,
  //           doctor,
  //           description: `${purpose} - ${description}`,
  //           urgency,
  //           ...additionalFields
  //         };

  //         fetch(`https://ajax.test-danit.com/api/v2/cards/${cardIdentifier}`, {
  //         method: 'PUT',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${localStorage.getItem('token')}`
  //         },
  //           body: JSON.stringify(cardData)
  //         })
  //         .then(response => response.json())
  //         .then(response => {
  //           cardElem.style.display = 'none';
  //           console.log(response);
  //           // Створюємо картку та 'вішаємо' на неї події кліків по іконкам
  //           this.showCard(response);
  //           this.setupDeleteEventListener(cardElem, response.id, response);
  //         })
  // }

  setupDeleteEventListener (cardElement, cardId, response) {
    cardElement.addEventListener('click', (event) => {
      console.log(event.target);
      if (event.target.classList.contains('fa-trash')) {
        cardElement.style.display = 'none';
        console.log(cardId);

        fetch(`https://ajax.test-danit.com/api/v2/cards/${cardId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        })
          .then(response => {
            console.log(`Картка з id '${cardId}' була успішно видалена`);
          })
          .catch(error => {
            console.error('Помилка при видаленні карти:', error);
          });
      }

      else if (event.target.classList.contains('fa-note-sticky')) {
        window.scrollTo(0, 0);
        this.editingCard = true;
        document.querySelector('.visit__window').style.display = "block";

        document.querySelector('button.visit__create-btn').style.display = 'none';
        this.editBtn.style.display = 'block';

        document.body.style.overflow = 'hidden';

        const editTitle = document.querySelector('span.visit__form-title');
        editTitle.textContent = 'EDIT VISIT INFORMATION:';

        this.editBtn.addEventListener('click', (event) => {
          event.preventDefault();
          document.querySelector('.visit__window').style.display = 'none';
          document.body.style.overflow = '';

          console.log('Editing card info...');
          const fullName = document.querySelector('.visit__info-fullname').value;
          const doctor = document.querySelector('.visit__info-doctor').value;
          const purpose = document.querySelector('.visit__info-purpose').value;
          const description = document.querySelector('.visit__info-description').value;
          const urgency = document.querySelector('.visit__info-urgency').value;

          let additionalFields = {};
          if (doctor === 'cardiologist') {
            additionalFields.bp = this.cardiologistFields.typicalPressure.value;
            // Body mass index
            additionalFields.bodyMassIndex = this.cardiologistFields.bodyMassIndex.value;
            // Heart diseases
            additionalFields.heartDiseases = this.cardiologistFields.heartDiseases.value;
            additionalFields.age = this.cardiologistFields.ageCardiologist.value;
          } else if (doctor === 'dentist') {
            additionalFields.lastVisitDate = this.dentistFields.lastVisitDate.value;
          } else if (doctor === 'therapist') {
            additionalFields.age = this.therapistFields.ageTherapist.value;
          }
        
          const cardData = {
            clientName: fullName,
            doctor,
            description: `${purpose} - ${description}`,
            urgency,
            ...additionalFields
          };

          console.log(fullName, doctor, purpose, description, urgency);
          fetch(`https://ajax.test-danit.com/api/v2/cards/${cardId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
            body: JSON.stringify(cardData)
          })
          .then(response => response.json())
          .then(response => {
            cardElement.style.display = 'none';
            console.log(response);
            // Створюємо картку та 'вішаємо' на неї події кліків по іконкам
            this.showCard(response);
            this.setupDeleteEventListener(cardElem, response.id, response);
          })


        })
      }

      else if (event.target.classList.contains('fa-circle-info')) {
        event.target.style.display = 'none';

        const desc = document.createElement('h3');
        const pressure = document.createElement('h3');
        const age = document.createElement('h3');
        const lastVisit = document.createElement('h3');
        const massIndex = document.createElement('h3');
        const heartDiseases = document.createElement('h3');
        const urgency = document.createElement('h3');

        if (response.description) {
          desc.style.paddingTop = '10px';
          desc.textContent = response.description;
          desc.classList.add('card__doc-profile');
        }

        if (response.bp) {
          pressure.style.paddingTop = '10px';
          pressure.textContent = `Typical pressure: ${response.bp}`;
          pressure.classList.add('card__doc-profile');
        }

        if (response.age) {
          age.style.paddingTop = '10px';
          age.textContent = `Age of client: ${response.age}`;
          age.classList.add('card__doc-profile');  
        }

        if (response.lastVisitDate) {
          lastVisit.style.paddingTop = '10px';
          lastVisit.textContent = `Last visit: ${response.lastVisitDate}`;
          lastVisit.classList.add('card__doc-profile');
        }

        if (response.bodyMassIndex) {
          massIndex.style.paddingTop = '10px';
          massIndex.textContent = `Body mass index: ${response.bodyMassIndex}`;
          massIndex.classList.add('card__doc-profile');
        }

        if (response.heartDiseases) {
          heartDiseases.style.paddingTop = '10px';
          heartDiseases.textContent = `Body mass index: ${response.heartDiseases}`;
          heartDiseases.classList.add('card__doc-profile');
        }

        if (response.urgency) {
          urgency.style.paddingTop = '10px';
          urgency.textContent = `Urgency of the visit: ${response.urgency}`;
          urgency.classList.add('card__doc-profile');
        }

        // В cardElement записаний cardElem (записується в момент виклику функції showCard), 
        // що являється посиланням на конкретну карточку в документі.
        // Тобто спочатку ми створюємо карточку та відображаємо її на сторінці за допомогою
        // функції showCard, а далі "вішаємо" на кожну карточку подію кліку, 
        // передаючи при цьому унікальні посилання на кожну карточку та відповідь від сервера 
        cardElement.append(desc);
        cardElement.append(pressure);
        cardElement.append(age);
        cardElement.append(lastVisit);
        cardElement.append(massIndex);
        cardElement.append(heartDiseases);
        cardElement.append(urgency);
      }
    });
  };

  // Створюємо картку й показуємо її на екрані
  showCard (data) {
    // Встановлюємо значення editingCard у false
    this.editingCard = false;

    const cardContainer = document.getElementById('root');

    const card = document.createElement('div');
    card.classList.add('card');

    const nameInfo = document.createElement('h1');
    nameInfo.classList.add('card__title');
    nameInfo.textContent = data.clientName;
    card.append(nameInfo);

    const doctor = document.createElement('h3');
    doctor.classList.add('card__doc-profile');
    doctor.textContent = data.doctor;
    card.append(doctor);

    const cardButtons = document.createElement('div');
    cardButtons.classList.add('card__btn');
    cardButtons.innerHTML = `<button class="card__btn-optional card__btn-more-info"><i class="fa-solid fa-circle-info"></i></button>
    <button class="card__btn-optional card__btn-edit-info"><i class="fa-solid fa-note-sticky"></i></button>
    <button class="card__btn-optional card__btn-delete"><i class="fa-solid fa-trash"></i></button>`;

    card.append(cardButtons);
    cardContainer.append(card);

    // Записуємо у відокремлену змінну створену картку
    cardElem = card;
  }
}

const modal = new Modal();


function getAllCards(){
  return fetch('https://ajax.test-danit.com/api/v2/cards', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
  .then(response => response.json())
  .then(response => console.log(response))
}

// При перезавантаженні сторінки, робимо так, щоб створені карточки не зникали
if (localStorage.getItem('token')) {
  getAllCards()
}