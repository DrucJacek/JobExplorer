const jobsData = [
    {
        id: 1,
        title: "Frontend Developer",
        company: "Tech Corp Sp. z o.o.",
        location: "Warszawa, ul. Prosta 1",
        nip: "525-000-11-22",
        phone: "+48 123 456 789",
        description: "Poszukujemy osoby ze znajomością HTML, CSS i JS. Oferujemy stabilne zatrudnienie i owocowe czwartki."
    },
    {
        id: 2,
        title: "Backend Developer",
        company: "CodeHouse S.A.",
        location: "ul. Długa 10, Kraków (Zdalnie)",
        nip: "987-654-32-10",
        phone: "+48 600 987 654",
        description: "Zatrudnimy osobę odpowiedzialną za logikę po stronie serwera oraz projektowanie bezpiecznych i wydajnych baz danych."
    },
    {
        id: 3,
        title: "UX/UI Designer",
        company: "DesignerPro Studio",
        location: "ul. Różana 2, Poznań (Stacjonarnie)",
        nip: "111-222-33-44",
        phone: "+48 700 111 222",
        description: "Jeśli masz zmysł estetyczny i wiesz, jak projektować interfejsy przyjazne dla użytkownika, to stanowisko jest dla Ciebie."
    },
    {
        id: 4,
        title: "UX/UI Designer",
        company: "DesignerPro Studio",
        location: "ul. Różana 2, Poznań (Stacjonarnie)",
        nip: "111-222-33-44",
        phone: "+48 700 111 222",
        description: "Jeśli masz zmysł estetyczny i wiesz, jak projektować interfejsy przyjazne dla użytkownika, to stanowisko jest dla Ciebie."
    },
    {
        id: 5,
        title: "UX/UI Designer",
        company: "DesignerPro Studio",
        location: "ul. Różana 2, Poznań (Stacjonarnie)",
        nip: "111-222-33-44",
        phone: "+48 700 111 222",
        description: "Jeśli masz zmysł estetyczny i wiesz, jak projektować interfejsy przyjazne dla użytkownika, to stanowisko jest dla Ciebie."
    }
];

//elementy strony
const views = document.querySelectorAll(".view");
const jobsContainer = document.getElementById("jobs-container");
const searchInput = document.getElementById("search");
const detailsContent = document.getElementById("details-content");
const applyForm = document.getElementById("apply-form");
const formMessage = document.getElementById("form-message");


// Funkcja ukrywająca wszystkie sekcje i pokazująca tylko jedną
function showView(viewId) {
    views.forEach(view => view.classList.remove("active"));
    const activeView = document.getElementById(viewId);
    if (activeView) {
        activeView.classList.add("active");
    } else {
        document.getElementById("not-found-view").classList.add("active");
    }
}

// Obsługa paska adresu (wykrywanie np. #home, #apply, #job/2)
function handleRouting() {
    const hash = window.location.hash || "#home";

    if (hash === "#home") {
        renderJobsList(searchInput.value);
        showView("home-view");
    } else if (hash === "#apply") {
        showView("apply-view");
    } else if (hash.startsWith("#job/")) {
        // Wyciąganie ID z adresu (np. z #job/2 wyciągamy 2)
        const jobId = parseInt(hash.split("/")[1]);
        renderJobDetails(jobId);
    } else {
        showView("not-found-view");
    }
}


// Renderowanie listy na stronie głównej + filtrowanie
function renderJobsList(filterText = "") {
    jobsContainer.innerHTML = ""; // Czyszczenie starych wyników
    const normalizedFilter = filterText.trim().toLowerCase();

    // Filtrowanie tablicy
    const filteredJobs = jobsData.filter(job => {
        if (!normalizedFilter) return true;
        return (
            job.title.toLowerCase().includes(normalizedFilter) ||
            job.company.toLowerCase().includes(normalizedFilter) ||
            job.location.toLowerCase().includes(normalizedFilter)
        );
    });

    if (filteredJobs.length === 0) {
        jobsContainer.innerHTML = `<p>Brak wyników dla podanego hasła.</p>`;
        return;
    }

    // Tworzenie kafelków (kart)
    filteredJobs.forEach(job => {
        const article = document.createElement("article");
        article.className = "card";
        article.innerHTML = `
            <h3>${job.title}</h3>
            <p><strong>Firma:</strong> ${job.company.split(" ")[0]}</p>
            <p><strong>Lokalizacja:</strong> ${job.location.split(",")[0]}</p>
            <button onclick="window.location.hash='#job/${job.id}'">Szczegóły</button>
        `;
        jobsContainer.appendChild(article);
    });
}

// Renderowanie szczegółów wybranej oferty
function renderJobDetails(jobId) {
    const job = jobsData.find(j => j.id === jobId);

    if (!job) {
        showView("not-found-view");
        return;
    }

    detailsContent.innerHTML = `
        <h2 style="margin-bottom: 1rem; color: var(--primary-color);">${job.title}</h2>
        <p><strong>Firma:</strong> ${job.company}</p>
        <p><strong>NIP:</strong> ${job.nip}</p>
        <p><strong>Lokalizacja:</strong> ${job.location}</p>
        <p><strong>Kontakt:</strong> ${job.phone}</p>
        <hr style="margin: 20px 0; border: 0; border-top: 1px solid #ddd;">
        <p>${job.description}</p>
        <div style="margin-top: 2rem; display: flex; gap: 1rem; flex-wrap: wrap;">
            <button onclick="window.location.hash='#apply'">Aplikuj na to stanowisko</button>
            <button style="background-color: #6c757d;" onclick="window.location.hash='#home'">Wróć do listy</button>
        </div>
    `;
    
    showView("details-view");
}


// Wywołanie routingu po każdej zmianie adresu kliknięcie linku,przycisku
window.addEventListener("hashchange", handleRouting);

// Obsługa wyszukiwarki bo uruchamia się po każdym wpisanym znaku
searchInput.addEventListener("input", (e) => {
    renderJobsList(e.target.value);
});

// Obsługa i walidacja formularza aplikacyjnego
applyForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Zapobiega przeładowaniu całej strony

    const name = document.getElementById("name").value.trim();
    const message = document.getElementById("message").value.trim();

    // Własna walidacja JavaScript
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

    // wiadomosc sukcesu
    formMessage.textContent = "Sukces! Aplikacja została wysłana pomyślnie.";
    formMessage.className = "msg-success";
    
    // Czyszczenie pól formularza
    applyForm.reset();
});

// Generowanie strony przy pierwszym wejściu
handleRouting();