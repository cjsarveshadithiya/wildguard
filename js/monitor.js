const API_BASE_URL = "http://127.0.0.1:8000";


function getAuthToken() {
    return localStorage.getItem("wildguard_token");
}


function formatTime(timestamp) {
    if (!timestamp) {
        return "Unknown";
    }

    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
        return timestamp;
    }

    return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
}


function formatCoordinates(latitude, longitude) {
    if (
        latitude === undefined ||
        longitude === undefined
    ) {
        return "Unknown";
    }

    const latDirection = latitude >= 0 ? "N" : "S";
    const lonDirection = longitude >= 0 ? "E" : "W";

    return `${Math.abs(latitude).toFixed(5)}° ${latDirection}<br>${Math.abs(longitude).toFixed(5)}° ${lonDirection}`;
}


function updateMonitor(detection) {

    const species =
        detection.species || "Unknown";

    const confidence =
        Number(detection.confidence || 0);

    const confidencePercent =
        Math.round(confidence * 100);

    const nodeId =
        detection.node_id || "Unknown";

    const detectionTime =
        formatTime(detection.timestamp);

    const coordinates =
        formatCoordinates(
            detection.latitude,
            detection.longitude
        );


    /* Primary detection */

    const infoValues =
        document.querySelectorAll(".info-value");

    if (infoValues[0]) {
        infoValues[0].textContent =
            species.charAt(0).toUpperCase() +
            species.slice(1);
    }


    /* Confidence */

    const confidenceValue =
        document.querySelector(".confidence-value");

    if (confidenceValue) {
        confidenceValue.textContent =
            `${confidencePercent}%`;
    }


    const confidenceFill =
        document.querySelector(".confidence-fill");

    if (confidenceFill) {
        confidenceFill.style.width =
            `${confidencePercent}%`;
    }


    /* Field node */

    if (infoValues[1]) {
        infoValues[1].textContent =
            nodeId;
    }


    /* Detection location */

    const coordinatesElement =
        document.querySelector(".coordinates");

    if (coordinatesElement) {
        coordinatesElement.innerHTML =
            coordinates;
    }


    /* Camera feed detection label */

    const aiLabel =
        document.querySelector(".ai-label");

    if (aiLabel) {
        aiLabel.textContent =
            `${species.toUpperCase()} · ${confidencePercent}%`;
    }


    /* Camera footer time */

    const cameraFooter =
        document.querySelector(".camera-footer");

    if (cameraFooter) {

        const footerSpans =
            cameraFooter.querySelectorAll("span");

        if (footerSpans[1]) {
            footerSpans[1].textContent =
                detectionTime;
        }
    }


    /* Active alert */

    const alertHeading =
        document.querySelector(".alert-heading");

    if (alertHeading) {
        alertHeading.textContent =
            `${species.charAt(0).toUpperCase() + species.slice(1)} detected nearby.`;
    }


    const alertMeta =
        document.querySelectorAll(".alert-meta strong");

    if (alertMeta[0]) {
        alertMeta[0].textContent =
            detectionTime;
    }

    if (alertMeta[1]) {
        alertMeta[1].textContent =
            nodeId;
    }

    if (alertMeta[2]) {
        alertMeta[2].textContent =
            `${confidencePercent}%`;
    }
}


async function loadLatestDetection() {

    const token =
        getAuthToken();


    if (!token) {

        window.location.href =
            "login.html";

        return;
    }


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/detections/`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`,

                        "Accept":
                            "application/json"
                    }
                }
            );


        if (response.status === 401) {

            localStorage.removeItem(
                "wildguard_token"
            );

            window.location.href =
                "login.html";

            return;
        }


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );
        }


        const data =
            await response.json();


        if (
            !data.detections ||
            data.detections.length === 0
        ) {

            console.log(
                "No detections available."
            );

            return;
        }


        const latestDetection =
            data.detections[0];


        updateMonitor(
            latestDetection
        );


        console.log(
            "WILDGUARD latest detection:",
            latestDetection
        );


    } catch (error) {

        console.error(
            "Live Monitor error:",
            error
        );
    }
}


loadLatestDetection();