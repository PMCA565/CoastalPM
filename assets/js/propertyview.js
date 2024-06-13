// Global variable to hold property data
let properties = [];

document.addEventListener("DOMContentLoaded", function () {
    axios.get("https://coastalpm.nbnerds.ca/properties")
        .then(function (response) {
            properties = response.data; // Store fetched properties globally
            const container = document.querySelector(".posts");
            properties.forEach((property) => {
                let imageHtml = property.images.length ? getPublicImageUrl(property.images[0].url) : 'path/to/default/image.jpg';
                let abbreviatedDescription = property.description.length > 150 ? property.description.substring(0, 150) + '...' : property.description;

                const propertyHTML = `
                    <article>
                        <a href="#" class="image" onclick="toggleModal('${property.id}')"><img src="${imageHtml}" alt="" /></a>
                        <h3>${property.name}</h3>
                        <p>${marked.parse(abbreviatedDescription)}</p>
                        <ul class="actions">
                            <li><button onclick="toggleModal('${property.id}')" class="button">More</button></li>
                        </ul>
                    </article>
                `;
                container.innerHTML += propertyHTML;
            });
        })
        .catch(function (error) {
            console.error("Error fetching properties:", error);
        });
});

function toggleModal(propertyId) {
    const property = properties.find(p => p.id.toString() === propertyId);
    if (!property) {
        console.error('Property not found');
        return;
    }

    let imagesHtml = property.images.map(img => `
        <img src="${getPublicImageUrl(img.url)}" class="carousel-image" alt="Property Image">
    `).join('');

    const modalContent = `
        <div class="modal-content">
            <span class="close" onclick="closeModal(this)">&times;</span>
            <img src="${getPublicImageUrl(property.images[0].url)}" class="large-image" alt="Main Property Image">
            ${property.images.length > 1 ? `<div class="carousel">${imagesHtml}</div>` : ''}
            <p>${marked.parse(property.description)}</p>
        </div>
    `;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
    modal.style.display = 'block';
}

function closeModal(element) {
    element.closest('.modal').style.display = 'none';
    document.body.removeChild(element.closest('.modal'));
}

function getPublicImageUrl(privateUrl) {
    const publicBaseUrl = 'https://coastalpm-assets.nbnerds.ca';
    const urlParts = privateUrl.split('/');
    const imageFilename = urlParts.pop();
    return `${publicBaseUrl}/${imageFilename}`;
}
