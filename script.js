// Dane zapasowe. Strona zadziała nawet wtedy, gdy API będzie niedostępne.
let jobsData = [
    {
        id: 1,
        title: "Frontend Developer",
        company: "Tech Corp Sp. z o.o.",
        location: "Warszawa, ul. Prosta 1",
        nip: "525-000-11-22",
        phone: "+48 123 456 789",
        email: "kontakt@techcorp.pl",
        website: "techcorp.pl",
        description: "Poszukujemy osoby ze znajomością HTML, CSS i JS. Oferujemy stabilne zatrudnienie i owocowe czwartki."
    },
    {
        id: 2,
        title: "Backend Developer",
        company: "CodeHouse S.A.",
        location: "ul. Długa 10, Kraków (Zdalnie)",
        nip: "987-654-32-10",
        phone: "+48 600 987 654",
        email: "hr@codehouse.pl",
        website: "codehouse.pl",
        description: "Zatrudnimy osobę odpowiedzialną za logikę po stronie serwera oraz projektowanie bezpiecznych i wydajnych baz danych."
    },
    {
        id: 3,
        title: "UX/UI Designer",
        company: "DesignerPro Studio",
        location: "ul. Różana 2, Poznań (Stacjonarnie)",
        nip: "111-222-33-44",
        phone: "+48 700 111 222",
        email: "studio@designerpro.pl",
        website: "designerpro.pl",
        description: "Jeśli masz zmysł estetyczny i wiesz, jak projektować interfejsy przyjazne dla użytkownika, to stanowisko jest dla Ciebie."
    }
];

const apiUrl = "https://jsonplaceholder.typicode.com/users";
const postUrl = "https://jsonplaceholder.typicode.com/posts";

const jobTitles = [
    "Frontend Developer",
    "Backend Developer",
    "Tester aplikacji",
    "UX/UI Designer",
    "Specjalista IT",
    "Administrator systemów",
    "Junior JavaScript Developer",
    "Web Developer",
    "Analityk danych",
    "Support IT"
];

// Elementy strony
const views = document.querySelectorAll(".view");
const jobsContainer = document.getElementById("jobs-container");
const searchInput = document.getElementById("search");
const detailsContent = document.getElementById("details-content");
const applyForm = document.getElementById("apply-form");
const formMessage = document.getElementById("form-message");
const apiStatus = document.getElementById("api-status");
const reloadApiButton = document.getElementById("reload-api");

// Funkcja zmieniająca komunikat o API
function setApiStatus(text, statusClass) {
    apiStatus.textContent = text;
    apiStatus.className = "api-status " + statusClass;
}

// Zamiana danych z API na oferty pracy używane w projekcie
function createJobsFromApi(users) {
    return users.map(function(user, index) {
        return {
            id: user.id,
            title: jobTitles[index % jobTitles.length],
            company: user.company.name,
            location: user.address.street + " " + user.address.suite + ", " + user.address.city,
            nip: "API-" + user.id,
            phone: user.phone,
            email: user.email,
            website: user.website,
            description: user.company.catchPhrase + ". " + user.company.bs + "."
        };
    });
}

// Pobieranie ofert z API
function loadJobsFromApi() {
    setApiStatus("Ładowanie ofert z API...", "loading");

    fetch(apiUrl)
        .then(function(response) {
            if (!response.ok) {
                throw new Error("Błąd HTTP: " + response.status);
            }

            return response.json();
        })
        .then(function(users) {
            jobsData = createJobsFromApi(users);
            setApiStatus("Pobrano dane z API: JSONPlaceholder /users (" + jobsData.length + " ofert).", "success");
            handleRouting();
        })
        .catch(function(error) {
            console.log(error);
            setApiStatus("Nie udało się pobrać danych z API. Wyświetlam dane zapasowe.", "error");
            handleRouting();
        });
}

// Funkcja ukrywająca wszystkie sekcje i pokazująca tylko jedną
function showView(viewId) {
    views.forEach(function(view) {
        view.classList.remove("active");
    });

    const activeView = document.getElementById(viewId);

    if (activeView) {
        activeView.classList.add("active");
    } else {
        document.getElementById("not-found-view").classList.add("active");
    }
}

// Obsługa paska adresu, np. #home, #apply, #job/2
function handleRouting() {
    const hash = window.location.hash || "#home";

    if (hash === "#home") {
        renderJobsList(searchInput.value);
        showView("home-view");
    } else if (hash === "#apply") {
        showView("apply-view");
    } else if (hash.startsWith("#job/")) {
        const jobId = parseInt(hash.split("/")[1]);
        renderJobDetails(jobId);
    } else {
        showView("not-found-view");
    }
}

// Pomocnicza funkcja do tworzenia wiersza: etykieta + tekst
function createInfoLine(label, value) {
    const paragraph = document.createElement("p");
    const strong = document.createElement("strong");

    strong.textContent = label + ": ";

    paragraph.appendChild(strong);
    paragraph.appendChild(document.createTextNode(value));

    return paragraph;
}

// Pomocnicza funkcja do tworzenia wiersza z linkiem
function createLinkLine(label, text, url) {
    const paragraph = document.createElement("p");
    const strong = document.createElement("strong");
    const link = document.createElement("a");

    strong.textContent = label + ": ";
    link.href = url;
    link.textContent = text;
    link.target = "_blank";

    paragraph.appendChild(strong);
    paragraph.appendChild(link);

    return paragraph;
}

// Renderowanie listy na stronie głównej + filtrowanie
function renderJobsList(filterText = "") {
    jobsContainer.innerHTML = "";

    const normalizedFilter = filterText.trim().toLowerCase();

    const filteredJobs = jobsData.filter(function(job) {
        if (!normalizedFilter) {
            return true;
        }

        return (
            job.title.toLowerCase().includes(normalizedFilter) ||
            job.company.toLowerCase().includes(normalizedFilter) ||
            job.location.toLowerCase().includes(normalizedFilter) ||
            job.email.toLowerCase().includes(normalizedFilter)
        );
    });

    if (filteredJobs.length === 0) {
        const emptyInfo = document.createElement("p");
        emptyInfo.textContent = "Brak wyników dla podanego hasła.";
        jobsContainer.appendChild(emptyInfo);
        return;
    }

    filteredJobs.forEach(function(job) {
        const article = document.createElement("article");
        const title = document.createElement("h3");
        const company = createInfoLine("Firma", job.company);
        const location = createInfoLine("Lokalizacja", job.location.split(",")[0]);
        const button = document.createElement("button");

        article.className = "card";
        title.textContent = job.title;
        button.textContent = "Szczegóły";

        button.addEventListener("click", function() {
            window.location.hash = "#job/" + job.id;
        });

        article.appendChild(title);
        article.appendChild(company);
        article.appendChild(location);
        article.appendChild(button);

        jobsContainer.appendChild(article);
    });
}

// Renderowanie szczegółów wybranej oferty
function renderJobDetails(jobId) {
    const job = jobsData.find(function(item) {
        return item.id === jobId;
    });

    if (!job) {
        showView("not-found-view");
        return;
    }

    detailsContent.innerHTML = "";

    const title = document.createElement("h2");
    const separator = document.createElement("hr");
    const description = document.createElement("p");
    const buttonsBox = document.createElement("div");
    const applyButton = document.createElement("button");
    const backButton = document.createElement("button");

    title.textContent = job.title;
    description.textContent = job.description;

    separator.style.margin = "20px 0";
    separator.style.border = "0";
    separator.style.borderTop = "1px solid #ddd";

    buttonsBox.className = "details-actions";

    applyButton.textContent = "Aplikuj na to stanowisko";
    backButton.textContent = "Wróć do listy";
    backButton.className = "secondary-button";

    applyButton.addEventListener("click", function() {
        window.location.hash = "#apply";
    });

    backButton.addEventListener("click", function() {
        window.location.hash = "#home";
    });

    detailsContent.appendChild(title);
    detailsContent.appendChild(createInfoLine("Firma", job.company));
    detailsContent.appendChild(createInfoLine("NIP", job.nip));
    detailsContent.appendChild(createInfoLine("Lokalizacja", job.location));
    detailsContent.appendChild(createInfoLine("Telefon", job.phone));
    detailsContent.appendChild(createInfoLine("E-mail", job.email));
    detailsContent.appendChild(createLinkLine("Strona", job.website, "https://" + job.website));
    detailsContent.appendChild(separator);
    detailsContent.appendChild(description);

    buttonsBox.appendChild(applyButton);
    buttonsBox.appendChild(backButton);
    detailsContent.appendChild(buttonsBox);

    showView("details-view");
}

// Wysłanie formularza do testowego API
function sendApplication(name, email, message) {
    const application = {
        title: "Aplikacja JobExplorer",
        body: message,
        userId: 1,
        name: name,
        email: email
    };

    formMessage.textContent = "Wysyłanie aplikacji do API...";
    formMessage.className = "msg-info";

    fetch(postUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(application)
    })
        .then(function(response) {
            if (!response.ok) {
                throw new Error("Błąd HTTP: " + response.status);
            }

            return response.json();
        })
        .then(function(data) {
            formMessage.textContent = "Sukces! Aplikacja została wysłana do API. Numer zgłoszenia: " + data.id + ".";
            formMessage.className = "msg-success";
            applyForm.reset();
        })
        .catch(function(error) {
            console.log(error);
            formMessage.textContent = "Nie udało się wysłać aplikacji do API. Spróbuj ponownie później.";
            formMessage.className = "msg-error";
        });
}

// Wywołanie routingu po każdej zmianie adresu
window.addEventListener("hashchange", handleRouting);

// Obsługa wyszukiwarki
searchInput.addEventListener("input", function(event) {
    renderJobsList(event.target.value);
});

// Odświeżenie danych z API przyciskiem
reloadApiButton.addEventListener("click", function() {
    loadJobsFromApi();
});

// Obsługa i walidacja formularza aplikacyjnego
applyForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (name.length < 3) {
        formMessage.textContent = "Błąd: Imię i nazwisko musi mieć minimum 3 znaki.";
        formMessage.className = "msg-error";
        return;
    }

    if (message.length < 10) {
        formMessage.textContent = "Błąd: Twoja wiadomość jest zbyt krótka.";
        formMessage.className = "msg-error";
        return;
    }

    sendApplication(name, email, message);
});

// Pierwsze renderowanie i pobranie danych z API
handleRouting();
loadJobsFromApi();
