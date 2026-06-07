// ======================
// INISIALISASI MAP
// ======================

const map = L.map('map').setView([-7.88, 112.52], 12);

L.tileLayer(
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        maxZoom: 19
    }
).addTo(map);

// ======================
// VARIABEL GLOBAL
// ======================

let semuaData = [];
let dataFilterAktif = [];
let markers = [];

let userLocation = null;
let userMarker = null;
let userBuffer = null;

const iconAlam = new L.Icon({
    iconUrl:'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl:'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize:[25,41],
    iconAnchor:[12,41],
    popupAnchor:[1,-34]
});

const iconEdukasi = new L.Icon({
    iconUrl:'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    shadowUrl:'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize:[25,41],
    iconAnchor:[12,41],
    popupAnchor:[1,-34]
});

const iconHiburan = new L.Icon({
    iconUrl:'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl:'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize:[25,41],
    iconAnchor:[12,41],
    popupAnchor:[1,-34]
});

const iconAgrowisata = new L.Icon({
    iconUrl:'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
    shadowUrl:'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize:[25,41],
    iconAnchor:[12,41],
    popupAnchor:[1,-34]
});

const iconRekreasi = new L.Icon({
    iconUrl:'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
    shadowUrl:'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize:[25,41],
    iconAnchor:[12,41],
    popupAnchor:[1,-34]
});

const gpsIcon = L.divIcon({
    html: `
        <div style="
            width:20px;
            height:20px;
            background:#2563eb;
            border:4px solid white;
            border-radius:50%;
            box-shadow:0 0 10px rgba(0,0,0,.5);
        "></div>
    `,
    className:"",
    iconSize:[20,20]
});

// ======================
// AMBIL DATA JSON
// ======================

fetch('WisataBatu.json')

.then(res => res.json())

.then(data => {

    console.log(data);
    console.log(data.wisatabatu);

    semuaData = data.wisatabatu;

    dataFilterAktif = data.wisatabatu;

    tampilkanMarker(data.wisatabatu);

});

// ======================
// TAMPILKAN MARKER
// ======================

function tampilkanMarker(data){

    markers.forEach(marker => {
        map.removeLayer(marker);
    });

    markers = [];

    data.forEach(w => {

        if(!w.latitude || !w.longitude) return;

        let iconWisata;

switch(w.kategori){

    case "Alam":
        iconWisata = iconAlam;
        break;

    case "Edukasi":
        iconWisata = iconEdukasi;
        break;

    case "Hiburan":
        iconWisata = iconHiburan;
        break;

    case "Agrowisata":
        iconWisata = iconAgrowisata;
        break;

    case "Rekreasi":
        iconWisata = iconRekreasi;
        break;

    default:
        iconWisata = iconEdukasi;
}

const marker = L.marker(
    [
        parseFloat(w.latitude),
        parseFloat(w.longitude)
    ],
    {
        icon: iconWisata
    }
).addTo(map);

        const bintang = "⭐".repeat(Math.round(w.rating || 0));

        marker.bindPopup(`

        <div style="
            width:300px;
            font-family:'Segoe UI', sans-serif;
            line-height:1.5;
        ">

            <img
                src="${w.foto || 'https://via.placeholder.com/300'}"
                alt="${w.nama_wisata}"
                style="
                    width:100%;
                    height:180px;
                    object-fit:cover;
                    border-radius:12px;
                    margin-bottom:12px;
                "
            >

            <h2 style="
                color:#643335;
                text-align:center;
                margin-bottom:10px;
                font-size:20px;
            ">
                ${w.nama_wisata}
            </h2>

            <div style="
                background:#f5f5f5;
                padding:10px;
                border-radius:8px;
                margin-bottom:12px;
                text-align:justify;
                font-size:13px;
            ">
                ${w.deskripsi || 'Deskripsi belum tersedia.'}
            </div>

            <table style="
                width:100%;
                font-size:13px;
                border-collapse:collapse;
            ">

                <tr>
                    <td style="padding:4px 0;"><b>📂 Kategori</b></td>
                    <td>: ${w.kategori}</td>
                </tr>

                <tr>
                    <td style="padding:4px 0;"><b>📍 Alamat</b></td>
                    <td>: ${w.alamat}</td>
                </tr>

                <tr>
                    <td style="padding:4px 0;"><b>🕒 Jam</b></td>
                    <td>: ${w.jam_buka} - ${w.jam_tutup}</td>
                </tr>

                <tr>
                    <td style="padding:4px 0;"><b>🎫 Tiket</b></td>
                    <td>: Rp ${Number(w.harga_tiket).toLocaleString('id-ID')}</td>
                </tr>

                <tr>
                    <td style="padding:4px 0;"><b>⭐ Rating</b></td>
                    <td>: ${bintang} (${w.rating}/5)</td>
                </tr>

            </table>
<div style="
display:flex;
gap:8px;
margin-top:15px;
">

<a
href="https://www.google.com/maps?q=${w.latitude},${w.longitude}"
target="_blank"
style="
flex:1;
text-align:center;
background:#475569;
color:white;
padding:10px;
border-radius:8px;
text-decoration:none;
font-weight:bold;
">
📍 Lihat Lokasi
</a>

<a
href="https://www.google.com/maps/dir/?api=1&destination=${w.latitude},${w.longitude}"
target="_blank"
style="
flex:1;
text-align:center;
background:#643335;
color:white;
padding:10px;
border-radius:8px;
text-decoration:none;
font-weight:bold;
">
🧭 Navigasi
</a>

</div>
        </div>

        `);

        markers.push(marker);

    });

}

// ======================
// FILTER
// ======================

document
.getElementById('search')
.addEventListener('input', filterData);

document
.getElementById('kategori')
.addEventListener('change', filterData);

document
.getElementById('jam')
.addEventListener('change', filterData);

function filterData(){

    const keyword =
    document.getElementById('search')
    .value
    .toLowerCase();

    const kategori =
    document.getElementById('kategori')
    .value
    .toLowerCase();

    const jam =
    document.getElementById('jam')
    .value;

   const hasil = semuaData.filter(w => {

        const cocokNama =
        (w.nama_wisata || '')
        .toLowerCase()
        .includes(keyword);

        const dataKategori =
        (w.kategori || '')
        .toLowerCase();

        const cocokKategori =
        kategori === 'semua'
        ||
        dataKategori.includes(kategori);

        let cocokJam = true;

        let jamBuka = 0;

        if(w.jam_buka){

            jamBuka =
            parseInt(
                w.jam_buka.toString().split(':')[0]
            );

        }

        if(jam === 'Pagi'){

            cocokJam = jamBuka < 12;

        }

        else if(jam === 'Siang'){

            cocokJam =
            jamBuka >= 12 &&
            jamBuka < 18;

        }

        else if(jam === 'Malam'){

            cocokJam = jamBuka >= 18;

        }

        return (
    cocokNama &&
    cocokKategori &&
    cocokJam
);

});

dataFilterAktif = hasil;

tampilkanMarker(hasil);

}

// ======================
// LOKASI USER + BUFFER
// ======================

navigator.geolocation.getCurrentPosition(

(position) => {

    userLocation = [

        position.coords.latitude,
        position.coords.longitude

    ];

    userMarker = L.marker(
    userLocation,
    {
        icon:gpsIcon
    }
)
.addTo(map)
.bindPopup("📍 Lokasi Anda");

    // BUFFER 100 KM
    // karena Jogja - Batu sekitar 250 km
    // nanti bisa diganti

    userBuffer = L.circle(
        userLocation,
        {
            radius: 100000,
            color: 'blue',
            fillColor: '#3b82f6',
            fillOpacity: 0.15
        }
    ).addTo(map);

    map.setView(userLocation, 10);

},

(error) => {

    console.log(error);

}

);

// ======================
// HITUNG JARAK
// ======================

function hitungJarak(lat1, lon1, lat2, lon2){

    return map.distance(
        [lat1, lon1],
        [lat2, lon2]
    );

}

// ======================
// WISATA TERDEKAT
// ======================

function cariTerdekat(){

    if(!userLocation){

        alert("Lokasi user belum ditemukan");

        return;

    }

    const radius = parseInt(
        document.getElementById("radius").value
    );

    // hapus buffer lama

    if(userBuffer){

        map.removeLayer(userBuffer);

    }

    // buat buffer baru

    userBuffer = L.circle(
        userLocation,
        {
            radius: radius,
            color: "blue",
            fillColor: "#60a5fa",
            fillOpacity: 0.2
        }
    ).addTo(map);

    const hasil = dataFilterAktif.filter(w => {

        const jarak = map.distance(

            userLocation,

            [
                parseFloat(w.latitude),
                parseFloat(w.longitude)
            ]

        );

        return jarak <= radius;

    });

tampilkanMarker(hasil);

if(hasil.length > 0){

    const group = L.featureGroup(markers);

    map.fitBounds(
        group.getBounds(),
        {
            padding:[50,50]
        }
    );

    L.popup()
    .setLatLng(userLocation)
    .setContent(
        "📍 Ditemukan <b>" +
        hasil.length +
        "</b> wisata dalam radius <b>" +
        (radius/1000) +
        " km</b>"
    )
    .openOn(map);

}
else{

    alert("Tidak ada wisata dalam radius tersebut");

}

}
let lokasiAwalMarker = null;
async function cariAlamat(){

    const alamat =
    document.getElementById("alamat").value;

    if(!alamat){

        alert("Masukkan alamat terlebih dahulu");

        return;
    }

    try{

        const response = await fetch(

            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(alamat)}`

        );

        const data = await response.json();

        if(data.length === 0){

            alert("Alamat tidak ditemukan");

            return;
        }

        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);

        userLocation = [lat, lon];

        if(lokasiAwalMarker){

            map.removeLayer(lokasiAwalMarker);

        }

        lokasiAwalMarker = L.marker(
            userLocation
        )
        .addTo(map)
        .bindPopup("📍 Lokasi Awal")
        .openPopup();

        map.setView(userLocation, 13);

    }

    catch(error){

        console.error(error);

        alert("Gagal mencari alamat");

    }

}
map.on('click', function(e){

    userLocation = [
        e.latlng.lat,
        e.latlng.lng
    ];

    if(lokasiAwalMarker){

        map.removeLayer(lokasiAwalMarker);

    }

    lokasiAwalMarker = L.marker(
        userLocation
    )
    .addTo(map)
    .bindPopup("📍 Lokasi Pilihan")
    .openPopup();

});