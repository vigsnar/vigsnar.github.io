(function () {
    function closeLightbox(modal, image) {
        modal.hidden = true;
        image.removeAttribute("src");
        document.body.classList.remove("project-lightbox-open");
    }

    document.addEventListener("DOMContentLoaded", function () {
        var modal = document.getElementById("project-lightbox");
        var image = document.getElementById("project-lightbox-image");
        var closeButton = modal ? modal.querySelector(".project-lightbox-close") : null;
        var triggers = document.querySelectorAll("[data-project-lightbox]");

        if (!modal || !image || !closeButton || !triggers.length) {
            return;
        }

        triggers.forEach(function (trigger) {
            trigger.addEventListener("click", function () {
                image.src = trigger.getAttribute("src");
                image.alt = trigger.getAttribute("alt") || "";
                modal.hidden = false;
                document.body.classList.add("project-lightbox-open");
            });
        });

        closeButton.addEventListener("click", function () {
            closeLightbox(modal, image);
        });

        modal.addEventListener("click", function (event) {
            if (event.target === modal) {
                closeLightbox(modal, image);
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && !modal.hidden) {
                closeLightbox(modal, image);
            }
        });
    });
})();
