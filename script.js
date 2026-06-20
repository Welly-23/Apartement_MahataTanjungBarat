const form = document.getElementById("bookingForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
    nama: document.getElementById("nama").value,
    nomor_hp: document.getElementById("nomor_hp").value,
    email: document.getElementById("email").value,
    tanggal: document.getElementById("tanggal").value,
    tipe_unit: document.getElementById("tipe_unit").value
};

    try {
        const response = await fetch("http://localhost:3000/booking", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        showSuccessPopup();

        form.reset();

    } catch (error) {
        alert("Gagal terhubung ke server");
        console.error(error);
    }


});

const units = [
    {
        title: "Studio Room",
        desc: "Unit studio modern yang dirancang untuk kenyamanan sehari-hari, dengan tata ruang efisien dan suasana yang hangat.",
        size: "23 m²",
        bedroom: "1 Kamar",
        bathroom: "1 KM",
        price: "Mulai Rp 600 Jt",
        image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200",
        link: "detail-unit.html"
    },
    {
        title: "One Bedroom",
        desc: "Hunian ideal dengan ruang yang lebih luas, menghadirkan kenyamanan dan privasi untuk aktivitas sehari-hari.",
        size: "35 m²",
        bedroom: "1 Kamar",
        bathroom: "1 KM",
        price: "Mulai Rp 1 M",
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200",
         link: "One-Bedroom.html"
    },
    {
        title: "Two Bedroom",
        desc: "Unit luas dengan dua kamar tidur yang nyaman, cocok untuk keluarga kecil maupun kebutuhan ruang yang lebih fleksibel.",
        size: "45 m²",
        bedroom: "2 Kamar",
        bathroom: "1 KM",
        price: "Mulai Rp 1,2 M",
        image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200",
        link: "Two-Bedroom.html"
    }
];

let currentUnit = 0;

function showUnit(index) {
    document.getElementById("unitImage").src = units[index].image;
    document.getElementById("unitTitle").textContent = units[index].title;
    document.getElementById("unitDesc").textContent = units[index].desc;
    document.getElementById("unitSize").textContent = units[index].size;
    document.getElementById("unitBedroom").textContent = units[index].bedroom;
    document.getElementById("unitBathroom").textContent = units[index].bathroom;
    document.getElementById("unitPrice").textContent = units[index].price;
   document.getElementById("detailBtn").href = units[index].link;

   const dots = document.querySelectorAll(".dot");

dots.forEach(dot => {
    dot.classList.remove("active");
});

dots[index].classList.add("active");

showDotsTemporarily();
showButtonsTemporarily();

}

let dotTimer;

function showDotsTemporarily() {

    const slideDots = document.querySelector(".slide-dots");

    slideDots.classList.add("show");

    clearTimeout(dotTimer);

    dotTimer = setTimeout(() => {
        slideDots.classList.remove("show");
    }, 1200);

}

let buttonTimer;

function showButtonsTemporarily(){

    const controls =
    document.querySelector(".slider-controls");

    controls.classList.add("show");

    clearTimeout(buttonTimer);

    buttonTimer = setTimeout(() => {
        controls.classList.remove("show");
    }, 1200);

}

function nextUnit() {
    currentUnit++;

    if (currentUnit >= units.length) {
        currentUnit = 0;
    }

    showUnit(currentUnit);
}

function prevUnit() {
    currentUnit--;

    if (currentUnit < 0) {
        currentUnit = units.length - 1;
    }

    showUnit(currentUnit);
}

const roomImages = {
    studio: [
        "images/studio-1.jpg",
        "images/studio-2.jpg",
        "images/studio-3.jpg"
    ],
    one: [
        "images/one-1.jpg",
        "images/one-2.jpg",
        "images/one-3.jpg"
    ],
    two: [
        "images/two-1.jpg",
        "images/two-2.jpg",
        "images/two-3.jpg"
    ]
};

const roomIndex = {
    studio: 0,
    one: 0,
    two: 0
};

function showRoomImage(room) {
    document.getElementById(room + "Image").src =
        roomImages[room][roomIndex[room]];
}

function nextRoomImage(room) {
    roomIndex[room]++;

    if (roomIndex[room] >= roomImages[room].length) {
        roomIndex[room] = 0;
    }

    showRoomImage(room);
}

function prevRoomImage(room) {
    roomIndex[room]--;

    if (roomIndex[room] < 0) {
        roomIndex[room] = roomImages[room].length - 1;
    }

    showRoomImage(room);
}

function showGallery(id) {
    const contents = document.querySelectorAll(".gallery-content");
    const buttons = document.querySelectorAll(".tab-btn");

    contents.forEach(content => {
        content.classList.remove("active");
    });

    buttons.forEach(button => {
        button.classList.remove("active");
    });

    document.getElementById(id).classList.add("active");
    event.target.classList.add("active");
}

document.querySelector('.hero-main-btn').addEventListener('click', function(e){
    e.preventDefault();

    document.querySelector('#booking').scrollIntoView({
        behavior: 'smooth'
    });
});

document.querySelector(".hero-main-btn").addEventListener("click", function(e) {
    e.preventDefault();

    document.querySelector("#booking").scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
});

function scrollBooking(e) {
    e.preventDefault();

    const booking = document.getElementById("booking");

    booking.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

window.addEventListener("load", () => {

    const params = new URLSearchParams(window.location.search);
    const targetId = params.get("scroll");

    if (targetId) {
        const target = document.getElementById(targetId);

        if (target) {
            setTimeout(() => {
                window.scrollTo({
                    top: target.offsetTop + 180,
                    behavior: "smooth"
                });
            }, 200);
        }
    }
});

let startX = 0;
let endX = 0;

const unitImageArea = document.querySelector(".unit-main-image");

if (unitImageArea) {
    unitImageArea.addEventListener("mousedown", function(e) {
        startX = e.clientX;
    });

    unitImageArea.addEventListener("mouseup", function(e) {
        endX = e.clientX;
        handleSwipe();
    });

    unitImageArea.addEventListener("touchstart", function(e) {
        startX = e.touches[0].clientX;
    });

    unitImageArea.addEventListener("touchend", function(e) {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });
}

function handleSwipe() {
    if (startX - endX > 50) {
        nextUnit();
    }

    if (endX - startX > 50) {
        prevUnit();
    }
}

const reveals = document.querySelectorAll(".reveal");

function revealOnScroll(){

    reveals.forEach(item => {

        const windowHeight = window.innerHeight;
        const itemTop = item.getBoundingClientRect().top;

        if(itemTop < windowHeight - 100){
            item.classList.add("show");
        }

    });

}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

function showSuccessPopup() {

    const popup = document.createElement("div");

    popup.className = "success-popup";

    popup.innerHTML = `
        <div class="success-box">
            <i class="fas fa-circle-check"></i>
            <h3>Booking Berhasil!</h3>
            <p>
                Jadwal kunjungan Anda berhasil dikirim.
                Tim kami akan segera menghubungi Anda.
            </p>
            <button onclick="closePopup()">
                Tutup
            </button>
        </div>
    `;

    document.body.appendChild(popup);
}

function closePopup() {

    const popup = document.querySelector(".success-popup");

    if(popup){
        popup.remove();
    }
}