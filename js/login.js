const API_BASE_URL = "http://127.0.0.1:8000";

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");


function showMessage(message, type = "error") {
    if (!loginMessage) {
        return;
    }

    loginMessage.textContent = message;
    loginMessage.className = `login-message ${type}`;
}


loginForm?.addEventListener("submit", async (event) => {

    event.preventDefault();


    const username = document.getElementById("username")?.value.trim();
    const password = document.getElementById("password")?.value;


    if (!username || !password) {

        showMessage(
            "Please enter your username and password."
        );

        return;
    }


    showMessage("Signing in...", "loading");


    try {

        const formData = new URLSearchParams();

        formData.append("username", username);
        formData.append("password", password);


        const response = await fetch(
            `${API_BASE_URL}/auth/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded"
                },

                body: formData
            }
        );


        const data = await response.json();


        if (!response.ok) {

            showMessage(
                data.detail ||
                "Invalid username or password."
            );

            return;
        }


        if (!data.access_token) {

            showMessage(
                "Login succeeded but no access token was returned."
            );

            return;
        }


        localStorage.setItem(
            "wildguard_token",
            data.access_token
        );


        showMessage(
            "Login successful. Opening Video History...",
            "success"
        );


        setTimeout(() => {

            window.location.href =
                "video-history.html";

        }, 500);


    } catch (error) {

        console.error(
            "Login error:",
            error
        );


        showMessage(
            "Unable to connect to the WILDGUARD backend."
        );

    }

});