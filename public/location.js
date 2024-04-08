const form = document.querySelector("form");
const latitudeInput = document.getElementById("latitude");
const longitudeInput = document.getElementById("longitude");

function getLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocation is not supported by your browser.");
    }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position.coords),
      (error) => reject(error),
    );
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent immediate submission

  getLocation()
    .then((coords) => {
      latitudeInput.value = coords.latitude;
      longitudeInput.value = coords.longitude;
      form.submit(); // Submit the form after getting location
    })
    // Error catching
    .catch((error) => {
      console.error("Error getting location:", error);
    });
});
