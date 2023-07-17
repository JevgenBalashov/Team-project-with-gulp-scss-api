// e-mail: jvgnbal@gmail.com
// password: Toriando123



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
    this.closeVisitWindow.addEventListener("click", () => {
      this.visitWindow.style.display = "none";
    });

    this.createVisitButton.addEventListener("click", () => {
      this.visitWindow.style.display = "block";
    });

    this.loginButton.addEventListener("click", () => {
      this.loginForm.style.display = "block";
    });

    this.loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      this.handleLoginFormSubmit();
    });

    this.logOutButton.addEventListener("click", () => {
      this.logout();
    });

    this.closeIcon.addEventListener('click', () => {
      this.loginForm.style.display = 'none';
    });

    if (this.registerForm) {
      this.registerForm.addEventListener("submit", (event) => {
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
  
    this.hideCardiologistFields();
    this.hideDentistFields();
    this.hideTherapistFields();
  
    document.querySelector('.visit__info-doctor').addEventListener('change', () => {
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
  
    document.querySelector('.visit__info-form').addEventListener('submit', event => {
      event.preventDefault();
    
      const fullName = document.querySelector('.visit__info-fullname').value;
      const doctor = document.querySelector('.visit__info-doctor').value;
      const purpose = document.querySelector('.visit__info-purpose').value;
      const description = document.querySelector('.visit__info-description').value;
      const urgency = document.querySelector('.visit__info-urgency').value;
    
      let additionalFields = {};
      if (doctor === 'cardiologist') {
        additionalFields.bp = this.cardiologistFields.typicalPressure.value;
        additionalFields.age = this.cardiologistFields.ageCardiologist.value;
      } else if (doctor === 'dentist') {
        additionalFields.lastVisitDate = this.dentistFields.lastVisitDate.value;
      } else if (doctor === 'therapist') {
        additionalFields.age = this.therapistFields.ageTherapist.value;
      }
    
      const cardData = {
        title: `${fullName} - ${doctor}`,
        description: `${purpose} - ${description}`,
        doctor,
        ...additionalFields
      };
    
      fetch("https://ajax.test-danit.com/api/v2/cards", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ad62d8cc-c743-41e0-918c-cc6bfc73a2fe' // замініть 'ad62d8cc-c743-41e0-918c-cc6bfc73a2fe' на ваш токен або змінну з токеном
        },
        body: JSON.stringify(cardData)
      })
        .then(response => response.json())
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.error('Помилка при виконанні запиту:', error);
        });
    });
  }
}

const modal = new Modal();