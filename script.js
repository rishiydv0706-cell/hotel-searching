// =========================
// API URL
// =========================

const API_URL = "https://demohotelsapi.pythonanywhere.com/hotels/";

// =========================
// DOM Elements
// =========================

const hotelContainer = document.getElementById("hotelContainer");
const searchInput = document.getElementById("search");
const sortPrice = document.getElementById("sortPrice");
const ratingFilter = document.getElementById("rating");
const totalHotels = document.getElementById("totalHotels");
const avgRating = document.getElementById("avgRating");
const avgPrice = document.getElementById("avgPrice");

// Modal Elements
const modal = document.getElementById("hotelModal");
const closeModal = document.getElementById("closeModal");

const modalImage = document.getElementById("modalImage");
const modalName = document.getElementById("modalName");
const modalLocation = document.getElementById("modalLocation");
const modalRating = document.getElementById("modalRating");
const modalPrice = document.getElementById("modalPrice");
const modalDescription = document.getElementById("modalDescription");

// Store all hotels
let allHotels = [];

// =========================
// Fetch Hotels
// =========================

async function fetchHotels() {

    try {

        hotelContainer.innerHTML = "<h2>Loading Hotels...</h2>";

        const response = await fetch(API_URL);

        const data = await response.json();

        if (Array.isArray(data)) {
            allHotels = data;
        }
        else if (Array.isArray(data.results)) {
            allHotels = data.results;
        }
        else if (Array.isArray(data.data)) {
            allHotels = data.data;
        }

        displayHotels(allHotels);
updateStatistics(allHotels);

    } catch (error) {

        console.error(error);

        hotelContainer.innerHTML =
            "<h2>Failed to load hotels.</h2>";

    }

}

// =========================
// Display Hotels
// =========================

function updateStatistics(hotels){

    totalHotels.innerText = hotels.length;

    const ratingTotal = hotels.reduce(

        (sum, hotel) => sum + Number(hotel.rating || 0),

        0

    );

    const averageRating =

        (ratingTotal / hotels.length).toFixed(1);

    avgRating.innerText = averageRating + " ⭐";

    const priceTotal = hotels.reduce(

        (sum, hotel) =>

            sum + Number(hotel.price || hotel.price_per_night || 0),

        0

    );

    const averagePrice =

        Math.round(priceTotal / hotels.length);

    avgPrice.innerText = "₹" + averagePrice;

}
function displayHotels(hotels) {

    hotelContainer.innerHTML = "";

    if (hotels.length === 0) {

        hotelContainer.innerHTML = "<h2>No Hotels Found 😔</h2>";
        return;

    }

    let cards = "";

    const favorites =
        JSON.parse(localStorage.getItem("favorites")) || [];

    hotels.forEach((hotel) => {

        cards += `
        <div class="hotel-card">

            <img
                src="${hotel.image || hotel.image_url}"
                alt="${hotel.name || hotel.hotel_name}">

            <div class="hotel-info">

                <h2>${hotel.name || hotel.hotel_name}</h2>

                <div class="card-footer">

                    <p class="price">
                        ₹${hotel.price || hotel.price_per_night}
                    </p>

                    <i
                        class="${favorites.includes(hotel.id) ? 'fa-solid active' : 'fa-regular'} fa-heart favorite-icon"
                        onclick="toggleFavorite(${hotel.id}, this)">
                    </i>

                </div>

                <button onclick="showDetails(${hotel.id})">
                    View Details
                </button>

            </div>

        </div>
        `;

    });

    hotelContainer.innerHTML = cards;

}


// =========================
// Toggle Favorite
// =========================

function toggleFavorite(id, icon) {

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorites.includes(id)) {

        favorites = favorites.filter(fav => fav !== id);

        icon.classList.remove("active");
        icon.classList.remove("fa-solid");
        icon.classList.add("fa-regular");

    } else {

        favorites.push(id);

        icon.classList.add("active");
        icon.classList.remove("fa-regular");
        icon.classList.add("fa-solid");

    }

    localStorage.setItem("favorites", JSON.stringify(favorites));

}
// =========================
// Show Hotel Details
// =========================

function showDetails(id) {

    const hotel = allHotels.find(h => h.id == id);

    if (!hotel) return;

    modal.style.display = "flex";

    // Hotel Image
    const image =
        hotel.image ||
        hotel.image_url ||
        hotel.hotel_image ||
        hotel.thumbnail ||
        hotel.photo ||
        hotel.photo_url ||
        hotel.img ||
        "https://placehold.co/600x400?text=No+Image";

    modalImage.src = image;

    // Hotel Name
    modalName.innerText =
        hotel.name || hotel.hotel_name || "Hotel";

    // Location
    modalLocation.innerText =
        "📍 " + (hotel.city || hotel.location || "Unknown");

    // Rating
    modalRating.innerText =
        "⭐ " + (hotel.rating || "N/A");

    // Price
    modalPrice.innerText =
        "₹ " + (hotel.price || hotel.price_per_night || "N/A") + " / Night";

    // Description
    modalDescription.innerText =
        hotel.description ||
        hotel.hotel_description ||
        "No description available.";

}
// =========================
// Search
// =========================

searchInput.addEventListener("input", () => {

    const searchValue = searchInput.value.toLowerCase();

    const filteredHotels = allHotels.filter(hotel => {

        const hotelName =
            (hotel.name || hotel.hotel_name).toLowerCase();

        return hotelName.includes(searchValue);

    });

    displayHotels(filteredHotels);

});

// =========================
// Sort
// =========================

sortPrice.addEventListener("change", () => {

    let sortedHotels = [...allHotels];

    if (sortPrice.value === "low-high") {

        sortedHotels.sort((a, b) =>
            (a.price || a.price_per_night) -
            (b.price || b.price_per_night));

    }

    if (sortPrice.value === "high-low") {

        sortedHotels.sort((a, b) =>
            (b.price || b.price_per_night) -
            (a.price || a.price_per_night));

    }

    displayHotels(sortedHotels);

});

// =========================
// Rating Filter
// =========================

ratingFilter.addEventListener("change", () => {

    if (ratingFilter.value === "") {

        displayHotels(allHotels);

        return;

    }

    const rating = Number(ratingFilter.value);

    const filteredHotels = allHotels.filter(hotel =>
        hotel.rating >= rating
    );

    displayHotels(filteredHotels);

});

// =========================
// Close Modal
// =========================

closeModal.onclick = function () {

    modal.style.display = "none";

}

window.onclick = function (event) {

    if (event.target === modal) {

        modal.style.display = "none";

    }

}

// =========================
// Start
// =========================

fetchHotels();
