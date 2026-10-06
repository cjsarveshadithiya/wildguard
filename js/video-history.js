const API_BASE_URL = "http://127.0.0.1:8000";

const videoHistoryContainer = document.getElementById("videoHistory");


function getAuthToken() {
    return localStorage.getItem("wildguard_token");
}


function formatDateTime(timestamp) {
    if (!timestamp) {
        return "Unknown";
    }

    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
        return timestamp;
    }

    return date.toLocaleString();
}


function createVideoCard(video) {
    const card = document.createElement("article");

    card.className = "video-history-card";


    const confidence = Number(video.confidence || 0) * 100;

    card.innerHTML = `
        <div class="video-history-header">

            <div>
                <p class="eyebrow">
                    ${video.species || "Wildlife"}
                </p>

                <h3>
                    Detection #${video.id}
                </h3>
            </div>

            <span class="video-status">
                ${video.status || "available"}
            </span>

        </div>


        <div class="video-history-grid">

            <div>
                <span class="video-label">
                    Camera
                </span>

                <strong>
                    ${video.camera_id || "Unknown"}
                </strong>
            </div>


            <div>
                <span class="video-label">
                    Confidence
                </span>

                <strong>
                    ${confidence.toFixed(0)}%
                </strong>
            </div>


            <div>
                <span class="video-label">
                    Detection time
                </span>

                <strong>
                    ${formatDateTime(video.detection_time)}
                </strong>
            </div>


            <div>
                <span class="video-label">
                    Duration
                </span>

                <strong>
                    ${video.duration_seconds || 0} seconds
                </strong>
            </div>


            <div>
                <span class="video-label">
                    Latitude
                </span>

                <strong>
                    ${video.latitude}
                </strong>
            </div>


            <div>
                <span class="video-label">
                    Longitude
                </span>

                <strong>
                    ${video.longitude}
                </strong>
            </div>

        </div>


        <div class="video-recording">

            <span class="video-label">
                Recording
            </span>

            <code>
                ${video.video_path || "No recording reference"}
            </code>

        </div>

    `;


    return card;
}


async function loadVideoHistory() {

    if (!videoHistoryContainer) {
        return;
    }


    const token = getAuthToken();


    if (!token) {

        videoHistoryContainer.innerHTML = `
            <div class="history-message">

                <h3>
                    Authentication required
                </h3>

                <p>
                    Please sign in to view WILDGUARD video history.
                </p>

            </div>
        `;

        return;
    }


    try {

        const response = await fetch(
            `${API_BASE_URL}/videos/`,
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            }
        );


        if (response.status === 401) {

            localStorage.removeItem("wildguard_token");

            videoHistoryContainer.innerHTML = `
                <div class="history-message">

                    <h3>
                        Session expired
                    </h3>

                    <p>
                        Please sign in again to continue.
                    </p>

                </div>
            `;

            return;
        }


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        const data = await response.json();


        if (!data.videos || data.videos.length === 0) {

            videoHistoryContainer.innerHTML = `
                <div class="history-message">

                    <h3>
                        No recordings yet
                    </h3>

                    <p>
                        WILDGUARD has not recorded any historical
                        wildlife detections.
                    </p>

                </div>
            `;

            return;
        }


        videoHistoryContainer.innerHTML = "";


        data.videos.forEach(video => {

            videoHistoryContainer.appendChild(
                createVideoCard(video)
            );

        });


    } catch (error) {

        console.error(
            "Video History error:",
            error
        );


        videoHistoryContainer.innerHTML = `
            <div class="history-message">

                <h3>
                    Unable to load video history
                </h3>

                <p>
                    The WILDGUARD backend could not be reached.
                    Please make sure the backend server is running.
                </p>

            </div>
        `;

    }

}


loadVideoHistory();