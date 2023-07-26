// e-mail: jvgnbal@gmail.com
// password: Toriando123

// TOKEN VLAD: 20295ff8-73ed-4e93-ae50-6574689fc9ec (vlad-soruk@ukr.net; sorvlad2023)

let cardElem;

let input_search__title = document.querySelector('.search__title');
let value_search__title;

let select_search__doctor = document.querySelector('.search__doctor');
let value_search__doctor;

let select_search__urgency = document.querySelector('.search__urgency');
let value_search__urgency;

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
        // Коли користувач натискає на іконку редагування картки кнопка 'Створити візит' пропадає та
        // на її місці з'являється кнопка 'Редагувати', а також замість надпису 'Створити візит' 
        // з'являється надпис 'Редагувати дані про візит'. Якщо ж користувач захоче вийти з модального
        // вікна редагування картки, так і не натиснувши кнопку 'Редагувати', ми одразу ж ховаємо
        // кнопку 'Редагувати', змінюючи її на кнопку 'Створити візит', а також змінюємо назву модального
        // вікна на підходящий.
        document.querySelector('.visit__edit-btn').style.display = 'none';
        document.querySelector('button.visit__create-btn').style.display = 'block';
        document.querySelector('span.visit__form-title').textContent = 'Створити візит';
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
    // Видаляємо всі карточки з екрану, якщо користувач натиснув кнопку 'Вийти'
    document.getElementById('root').innerHTML = '<span class="visit__cards-notification">no items have been added</span>';
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
    // Показуємо всі карточки з сервера, якщо користувач авторизований
    getAllCards();
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
    // За замовчуванням картка не перебуває в стані редагування. Маніпуляції зі значенням this.isEditing
    // потрібні через те, що якщо ми НЕ будемо відстежувати стан редагування, кожного разу, як користувач
    // натисне на кнопку 'Редагувати', на неї буде 'навішуватись' подія кліку з колбеком  
    // handleEditButtonClick. Тобто якщо натиснути перший раз на кнопку 'Редагувати' буде надісланий
    // один PUT запит на сервер, якщо другий раз - два запити, третій раз - три запити і так до 
    // нескінченності. Так як ми стежимо за станом редагування картки, ми уникаємо цієї проблеми.
    this.isEditing = false;
    this.additionalData = false;
    this.editBtn = document.querySelector('.visit__edit-btn');
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

    document.querySelector('.visit__info-doctor').addEventListener('change', () => {
      const selectedDoctor = document.querySelector('.visit__info-doctor').value;

      this.hideCardiologistFields();
      this.hideDentistFields();
      this.hideTherapistFields();

      if (selectedDoctor === 'cardiologist') {
        this.showFields(this.cardiologistFields);

      } else if (selectedDoctor === 'dentist') {
        this.showFields(this.dentistFields);
      } else if (selectedDoctor === 'therapist') {
        this.showFields(this.therapistFields);
      }
    });

    document.querySelector('.visit__create-btn').addEventListener('click', (event) => {
      event.preventDefault();
      // Функціонал, щоб усі поля були заповнені користувачем, інакше виводиться alert повідомлення
      if (!this.allFieldsAreFilled()) {
        alert ("Будь ласка, заповніть усі поля форми!");
        return
      }

      input_search__title.value = '';
      select_search__doctor.value = null;
      select_search__urgency.value = null;
    
      value_search__doctor = null;
      value_search__urgency = null;
      value_search__title = '';

      document.querySelector('.visit__window').style.display = 'none';
      document.body.style.overflow = '';
      
      const fullName = document.querySelector('.visit__info-fullname').value;
      const doctor = document.querySelector('.visit__info-doctor').value;
      const purpose = document.querySelector('.visit__info-purpose').value;
      const description = document.querySelector('.visit__info-description').value;
      const urgency = document.querySelector('.visit__info-urgency').value;
      let additionalFields = {};

      if (doctor === 'cardiologist') {
        additionalFields.bp = this.cardiologistFields.typicalPressure.value;
        additionalFields.bodyMassIndex = this.cardiologistFields.bodyMassIndex.value;
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
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(cardData)
      })
      .then(response => response.json())
      .then(response => {
        document.querySelector('.visit__cards-notification').style.display = 'none';
        this.showCard(response);
        this.setupEventListeners(cardElem, response.id, response);
        console.log(response);
      })
      .catch(error => {
        console.error('Помилка при виконанні POST запиту:', error);
      });
    });
  }

  // Функція для перевірки полів форми на заповнення. Ми проходимося циклом
  // по кожному елементу з класом visit-info--showed (цей клас за замовчуванням має поле імені
  // користувача, поле вибору доктора, мета візиту, короткий опис візиту та терміновість).
  // Також цей клас можуть отримати додаткові поля, що відображаються при виборі кардіолога, 
  // стоматолога чи терапевта. Це ми реалізували завдяки функції showFields(fields), що показує необхідні 
  // поля та додає клас visit-info--showed; а також завдяки hideCardiologistFields, hideDentistFields,
  // hideTherapistFields, що скривають необхідні поля та видаляють клас visit-info--showed.
  // При проходженні циклом по елементам з класом visit-info--showed, якщо хоча б один елемент має falsy 
  // значення або користувач не обрав лікаря чи терміновість візиту з випадаючого списку (тобто значення 
  // поля дорівнює null), функція припиняє своє проходження циклом, повертаючи значення false. Якщо ж усі 
  // поля заповнені, функція поверне значення true. 
  
  allFieldsAreFilled() {
    const fields = document.querySelectorAll('.visit-info--showed');
    for (let field of fields) {
      if (!field.value || field.value === "null") {
        return false
      }
    }
    return true
  }

  hideCardiologistFields() {
    Object.values(this.cardiologistFields).forEach(field => {
      field.style.display = 'none';
      field.classList.remove('visit-info--showed');
    });
  }

  hideDentistFields() {
    Object.values(this.dentistFields).forEach(field => {
      field.style.display = 'none';
      field.classList.remove('visit-info--showed');
    });
  }

  hideTherapistFields() {
    Object.values(this.therapistFields).forEach(field => {
      field.style.display = 'none';
      field.classList.remove('visit-info--showed');
    });
  }

  showFields(fields) {
    Object.values(fields).forEach(field => {
      field.style.display = 'block';
      field.classList.add('visit-info--showed');
    });
  }

  handleEditButtonClick = (cardId, event) => {
      event.preventDefault();

      // Якщо this.isEditing = true зупиняємо подальше виконання коду
      if (this.isEditing) return;
      // Функціонал, щоб усі поля були заповнені користувачем, інакше виводиться alert повідомлення
      if (!this.allFieldsAreFilled()) {
        alert ("Будь ласка, заповніть усі поля форми!");
        return
      }

      // Вказуємо, що картка перебуває в стані редагування
      this.isEditing = true;

      console.log(cardId);
      const fullName = document.querySelector('.visit__info-fullname').value;
      const doctor = document.querySelector('.visit__info-doctor').value;
      const purpose = document.querySelector('.visit__info-purpose').value;
      const description = document.querySelector('.visit__info-description').value;
      const urgency = document.querySelector('.visit__info-urgency').value;
      let additionalFields = {};

      if (doctor === 'cardiologist') {
        additionalFields.bp = this.cardiologistFields.typicalPressure.value;
        additionalFields.bodyMassIndex = this.cardiologistFields.bodyMassIndex.value;
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
        // Після виконання PUT запиту вказуємо, що картка вже не перебуває в стані редагування
        this.isEditing = false;
        document.querySelector('button.visit__create-btn').style.display = 'block';
        this.editBtn.style.display = 'none';
        document.querySelector('span.visit__form-title').textContent = 'Створити візит';
        document.querySelector('.visit__window').style.display = 'none';
        document.body.style.overflow = '';
        cardElem.style.display = 'none';
        this.showCard(response);
        this.setupEventListeners(cardElem, response.id, response);
        console.log('Put запит пройшов успішно!');
        console.log(response);
      })
      .catch(error => {
        // Після неуспішного виконання PUT запиту також вказуємо, що картка 
        // вже не перебуває в стані редагування
        this.isEditing = false;
        console.log("Помилка при виконанні PUT запиту: ", error);
      })
  };

  setupEventListeners(cardElement, cardId, response) {
    cardElement.addEventListener('click', (event) => {
      if (event.target.classList.contains('fa-trash')) {
        document.getElementById('root').removeChild(cardElement);
        fetch(`https://ajax.test-danit.com/api/v2/cards/${cardId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        })
          .then( () => {
            console.log(`Картка з id '${cardId}' була успішно видалена`);
            if (document.getElementById('root').children.length === 1) {
              document.querySelector('.visit__cards-notification').style.display = 'block';
            }
          })
          .catch(error => {
            console.error('Помилка при видаленні карти: ', error);
          });
      } else if (event.target.classList.contains('fa-note-sticky')) {
        window.scrollTo(0, 0);
        document.querySelector('.visit__window').style.display = "block";
        document.querySelector('button.visit__create-btn').style.display = 'none';
        this.editBtn.style.display = 'block';
        document.body.style.overflow = 'hidden';
        const editTitle = document.querySelector('span.visit__form-title');
        editTitle.textContent = 'Редагувати дані про візит';

        // Якщо користувач натиснув на іконку 'Редагувати' та this.isEditing = false,
        // ми 'вішаємо' на кнопку 'Редагувати' подію кліка
        if (!this.isEditing) {
          this.editBtn.addEventListener('click', (ev) => this.handleEditButtonClick(cardId, ev))
        }

      } else if (event.target.classList.contains('fa-circle-info')) {

        if (!this.additionalData) {
          const desc = document.createElement('h3');
          const pressure = document.createElement('h3');
          const age = document.createElement('h3');
          const lastVisit = document.createElement('h3');
          const massIndex = document.createElement('h3');
          const heartDiseases = document.createElement('h3');
          const urgency = document.createElement('h3');

          if (response.description) {
            desc.style.paddingTop = '10px';
            desc.textContent = `Description of visit: ${response.description}`;
            desc.classList.add('card__doc-profile');
            desc.classList.add('card__doc-profile--additional');
          }

          if (response.bp) {
            pressure.style.paddingTop = '10px';
            pressure.textContent = `Typical pressure: ${response.bp}`;
            pressure.classList.add('card__doc-profile');
            pressure.classList.add('card__doc-profile--additional');
          }

          if (response.age) {
            age.style.paddingTop = '10px';
            age.textContent = `Age of client: ${response.age}`;
            age.classList.add('card__doc-profile');
            age.classList.add('card__doc-profile--additional');
          }

          if (response.lastVisitDate) {
            lastVisit.style.paddingTop = '10px';
            lastVisit.textContent = `Last visit: ${response.lastVisitDate}`;
            lastVisit.classList.add('card__doc-profile');
            lastVisit.classList.add('card__doc-profile--additional');
          }

          if (response.bodyMassIndex) {
            massIndex.style.paddingTop = '10px';
            massIndex.textContent = `Body mass index: ${response.bodyMassIndex}`;
            massIndex.classList.add('card__doc-profile');
            massIndex.classList.add('card__doc-profile--additional');
          }

          if (response.heartDiseases) {
            heartDiseases.style.paddingTop = '10px';
            heartDiseases.textContent = `Heart diseases: ${response.heartDiseases}`;
            heartDiseases.classList.add('card__doc-profile');
            heartDiseases.classList.add('card__doc-profile--additional');
          }

          if (response.urgency) {
            urgency.style.paddingTop = '10px';
            urgency.textContent = `Urgency of the visit: ${response.urgency}`;
            urgency.classList.add('card__doc-profile');
            urgency.classList.add('card__doc-profile--additional');
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

          this.additionalData = true;
        }
        else {
          cardElement.querySelectorAll('.card__doc-profile.card__doc-profile--additional').forEach(el => {
            el.style.display = 'none';
          })
          
          this.additionalData = false;
        }
      }
    });
  };

  showCard(data) {
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
    cardContainer.prepend(card);
    cardElem = card;
  }
}

// При перезавантаженні сторінки, всі картки з сервера показуються на екран.
// Вже після того, як дані про картки дістані із сервера, ми створюємо екземпляр модального вікна
// створюємо всі картки в DOM дереві та 'вішаємо' на картки івенти через метод класу Modal  
// під назвою setupEventListeners, передаючи в параметри цього методу посилання на створену картку,
// її id та дані про карточку з сервера. 

// function getAllCards(){
//   return fetch('https://ajax.test-danit.com/api/v2/cards', {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${localStorage.getItem('token')}`
//     }
//   })
//   .then(response => response.json())
//   .then(response => {
//     const modal = new Modal();
//     // Якщо користувач авторизувався, але ще не робив жодної картки,
//     // то повинен з'являтися заголовок no items have been added,
//     // інакше, цей заголовок буде приховано
//     if (response.length === 0) {
//       document.querySelector('.visit__cards-notification').style.display = 'block';
//     }
//     else {
//       document.querySelector('.visit__cards-notification').style.display = 'none';
//     }
//     response.forEach(data => {
//       modal.editingCard = false;
//       const cardContainer = document.getElementById('root');
//       const card = document.createElement('div');
//       card.classList.add('card');
//       const nameInfo = document.createElement('h1');
//       nameInfo.classList.add('card__title');
//       nameInfo.textContent = data.clientName;
//       card.append(nameInfo);
//       const doctor = document.createElement('h3');
//       doctor.classList.add('card__doc-profile');
//       doctor.textContent = data.doctor;
//       card.append(doctor);

//       const cardButtons = document.createElement('div');
//       cardButtons.classList.add('card__btn');
//       cardButtons.innerHTML = `<button class="card__btn-optional card__btn-more-info"><i class="fa-solid fa-circle-info"></i></button>
//       <button class="card__btn-optional card__btn-edit-info"><i class="fa-solid fa-note-sticky"></i></button>
//       <button class="card__btn-optional card__btn-delete"><i class="fa-solid fa-trash"></i></button>`;

//       card.append(cardButtons);
//       // cardContainer.append(card);
//       cardContainer.prepend(card);
//       cardElem = card;
//       // modal.showCard(cardInformation);

//       modal.setupEventListeners(card, data.id, data);
//     })
//     console.log(response)
//   })
//   .catch (error => console.log('An error occured while fetching all cards from server: ', error))
// }






function printCard(data, modal){
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
  cardContainer.prepend(card);

  cardElem = card;
  modal.setupEventListeners(card, data.id, data);
  return card;
}

function getAllCards(){
  return fetch('https://ajax.test-danit.com/api/v2/cards', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
  .then(response => response.json())
  .then(response => {
    const modal = new Modal();
    // Якщо користувач авторизувався, але не створював жодної картки чи повидаляв усі,
    // у нього відображатиметься надпис 'no items have been added'
    if (response.length === 0) {
      document.querySelector('.visit__cards-notification').style.display = 'block'
    }
    else {
      document.querySelector('.visit__cards-notification').style.display = 'none';
    }
    document.querySelectorAll('.card').forEach(element => {
      element.remove();
    });

    let cardsMatchFilter = false;

    response.forEach(data => {
      if(value_search__title == '' && (value_search__doctor == null || value_search__doctor == 'null') && (value_search__urgency == null || value_search__urgency == 'null'))
      {
        modal.editingCard = false;
        printCard(data, modal);
        cardsMatchFilter = true;
      }
      if(value_search__title != ''){
        if (data.clientName.replaceAll(" ", "").toLowerCase().search(value_search__title) != -1) {
          modal.editingCard = false;
          printCard(data, modal);
          cardsMatchFilter = true;
        }
        else {
          console.log(data.clientName.replaceAll(" ", "").toLowerCase());
          console.log(value_search__title);
        }
      }else if(value_search__doctor != null){
        if (data.doctor.search(value_search__doctor) != -1) {
          modal.editingCard = false;
          printCard(data, modal);
          cardsMatchFilter = true;
        }
      }else if(value_search__urgency != null){
        if (data.urgency.search(value_search__urgency) != -1) {
          modal.editingCard = false;
          printCard(data, modal);
          cardsMatchFilter = true;
        }
      }
    })

    if (!cardsMatchFilter) {
      document.querySelector('.visit__cards-notification').style.display = 'block';
      document.querySelector('.visit__cards-notification').textContent = 'There are no cards that match this filter';
    }
    else {
      document.querySelector('.visit__cards-notification').textContent = 'no items have been added';
      document.querySelector('.visit__cards-notification').style.display = 'none';
    }

    console.log(response)
  })
  .catch (error => console.log('An error occured while fetching all cards from server: ', error))
}

input_search__title.oninput = function() {
  value_search__title = this.value.replaceAll(" ", "").toLowerCase();

  select_search__doctor.value = null;
  select_search__urgency.value = null;

  value_search__doctor = null;
  value_search__urgency = null;
  getAllCards();
}

select_search__doctor.addEventListener('change', () => {
  value_search__doctor = select_search__doctor.value;

  input_search__title.value = '';
  select_search__urgency.value = null;

  value_search__title = '';
  value_search__urgency = null;
  getAllCards();
});

select_search__urgency.addEventListener('change', () => {
  value_search__urgency = select_search__urgency.value;

  input_search__title.value = '';
  select_search__doctor.value = null;

  value_search__title = '';
  value_search__doctor = null;
  getAllCards();
});




