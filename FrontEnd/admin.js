if(localStorage.getItem("isLogin") !== "true"){
    window.location.href = "login.html";
}

const bookingTable = document.getElementById("bookingTable");
const searchInput = document.getElementById("searchInput");

const totalBooking = document.getElementById("totalBooking");
const todayBooking = document.getElementById("todayBooking");
const monthBooking = document.getElementById("monthBooking");

let unitChart;
let bookingData = [];

async function getBookings() {
    try {
        const response = await fetch("http://localhost:3000/booking");
        bookingData = await response.json();

        tampilkanBooking(bookingData);
        tampilkanStatistik(bookingData);
        tampilkanGrafikUnit(bookingData);

    } catch (error) {
        console.error(error);
        alert("Gagal mengambil data booking");
    }
}

function tampilkanStatistik(bookings) {
    const today = new Date();

    totalBooking.textContent = bookings.length;

    todayBooking.textContent = bookings.filter((booking) => {
        const date = new Date(booking.created_at);
        return date.toDateString() === today.toDateString();
    }).length;

    monthBooking.textContent = bookings.filter((booking) => {
        const date = new Date(booking.created_at);
        return (
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    }).length;
}

function tampilkanBooking(bookings) {
    bookingTable.innerHTML = "";

    bookings.forEach((booking, index) => {
        const tanggalKunjungan = new Date(booking.tanggal_kunjungan)
            .toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric"
            });

        const waktuBooking = new Date(booking.created_at)
            .toLocaleString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });

        const status = booking.status || "Menunggu";

        bookingTable.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${booking.nama}</td>
                <td>${booking.nomor_hp}</td>
                <td>${booking.email}</td>
                <td>${tanggalKunjungan}</td>
                <td>${booking.tipe_unit || "-"}</td>
                <td>
                    <select class="status-select" onchange="ubahStatus(${booking.id}, this.value)">
                        <option value="Menunggu" ${status === "Menunggu" ? "selected" : ""}>Menunggu</option>
                        <option value="Dikonfirmasi" ${status === "Dikonfirmasi" ? "selected" : ""}>Dikonfirmasi</option>
                        <option value="Selesai" ${status === "Selesai" ? "selected" : ""}>Selesai</option>
                    </select>
                </td>
                <td>${waktuBooking}</td>
                <td>
                    <button onclick="hapusBooking(${booking.id})" class="delete-btn">
                        Hapus
                    </button>
                </td>
            </tr>
        `;
    });
}

searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.toLowerCase();

    const hasilFilter = bookingData.filter((booking) => {
        return (
            booking.nama.toLowerCase().includes(keyword) ||
            booking.nomor_hp.toLowerCase().includes(keyword) ||
            booking.email.toLowerCase().includes(keyword) ||
            (booking.tipe_unit || "").toLowerCase().includes(keyword) ||
            (booking.status || "").toLowerCase().includes(keyword)
        );
    });

    tampilkanBooking(hasilFilter);
});

async function ubahStatus(id, status) {
    try {
        const response = await fetch(`http://localhost:3000/booking/${id}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ status })
        });

        const result = await response.json();

        alert(result.message);
        getBookings();

    } catch (error) {
        console.error(error);
        alert("Gagal mengubah status");
    }
}

async function hapusBooking(id) {
    const yakin = confirm("Yakin mau hapus booking ini?");
    if (!yakin) return;

    try {
        const response = await fetch(`http://localhost:3000/booking/${id}`, {
            method: "DELETE"
        });

        const result = await response.json();

        alert(result.message);
        getBookings();

    } catch (error) {
        console.error(error);
        alert("Gagal menghapus data");
    }
}

function tampilkanGrafikUnit(bookings) {

    const studio = bookings.filter(
        b => b.tipe_unit === "Studio Room"
    ).length;

    const oneBedroom = bookings.filter(
        b => b.tipe_unit === "One Bedroom"
    ).length;

    const twoBedroom = bookings.filter(
        b => b.tipe_unit === "Two Bedroom"
    ).length;

    const ctx = document.getElementById("unitChart");

    if (unitChart) {
        unitChart.destroy();
    }

    unitChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: [
                "Studio Room",
                "One Bedroom",
                "Two Bedroom"
            ],
            datasets: [{
                label: "Jumlah Booking",
                data: [
                    studio,
                    oneBedroom,
                    twoBedroom
                ]
            }]
        }
    });
}

function exportExcel() {
    if (bookingData.length === 0) {
        alert("Data booking masih kosong");
        return;
    }

    let csv = "No,Nama,No HP,Email,Tanggal Kunjungan,Tipe Unit,Status,Waktu Booking\n";

    bookingData.forEach((booking, index) => {
        csv += `${index + 1},${booking.nama},${booking.nomor_hp},${booking.email},${booking.tanggal_kunjungan},${booking.tipe_unit || "-"},${booking.status || "Menunggu"},${booking.created_at}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "data-booking-aparhouse.csv";
    a.click();

    window.URL.revokeObjectURL(url);
}

getBookings();

function logout() {

    localStorage.removeItem("isLogin");

    window.location.href = "login.html";

}