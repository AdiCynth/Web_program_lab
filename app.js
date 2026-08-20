document.addEventListener("DOMContentLoaded", () => {
    const alertContainer = document.getElementById("alertContainer");
    alertContainer.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show shadow-sm" role="alert">
            <i class="bi bi-tag-fill me-2"></i>
            <strong>Flash Sale!</strong> Get 20% off all organic greens this weekend.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;

    const products = [
        {
            name: "Fresh Broccoli",
            price: "$2.99 / lb",
            image: "fresh_broccoli.jpg"
        },
        {
            name: "Organic Tomatoes",
            price: "$3.49 / lb",
            image: "organic_tomatoes.jpg"
        },
        {
            name: "Crunchy Carrots",
            price: "$1.99 / lb",
            image: "crunchy_carrots.jpg"
        }
    ];

    const productGrid = document.getElementById("productGrid");
    products.forEach(product => {
        const col = document.createElement("div");
        col.className = "col-md-4 col-sm-12";
        col.innerHTML = `
            <div class="card h-100 border-0 shadow-sm rounded-3">
                <img src="${product.image}" class="card-img-top rounded-top" alt="${product.name}" style="height: 200px; object-fit: cover;">
                <div class="card-body text-center">
                    <h5 class="card-title text-veg fw-bold">${product.name}</h5>
                    <p class="card-text text-secondary">${product.price}</p>
                    <button class="btn btn-outline-success btn-sm addToCartBtn"><i class="bi bi-cart-plus me-1"></i> Add to Cart</button>
                </div>
            </div>
        `;
        productGrid.appendChild(col);
    });

    const paginationContainer = document.getElementById("paginationContainer");
    paginationContainer.innerHTML = `
        <li class="page-item disabled">
            <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a>
        </li>
        <li class="page-item active" aria-current="page">
            <a class="page-link" href="#">1</a>
        </li>
        <li class="page-item"><a class="page-link" href="#">2</a></li>
        <li class="page-item"><a class="page-link" href="#">3</a></li>
        <li class="page-item">
            <a class="page-link" href="#">Next</a>
        </li>
    `;

    document.querySelectorAll(".addToCartBtn").forEach(btn => {
        btn.addEventListener("click", function() {
            this.innerHTML = `<i class="bi bi-check2-circle me-1"></i> Added`;
            this.classList.replace("btn-outline-success", "btn-success");
            setTimeout(() => {
                this.innerHTML = `<i class="bi bi-cart-plus me-1"></i> Add to Cart`;
                this.classList.replace("btn-success", "btn-outline-success");
            }, 2000);
        });
    });

    const searchForm = document.getElementById("searchForm");
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const searchInput = document.getElementById("searchInput").value;
        if(searchInput.trim() !== "") {
            alert("Searching for: " + searchInput);
        }
    });
});
