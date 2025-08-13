const animals = [
  {
    name: "Luna",
    type: "kucing",
    desc: "Kucing Persia manja dan ramah.",
    img: "https://placekitten.com/400/300"
  },
  {
    name: "Rex",
    type: "anjing",
    desc: "Anjing Golden Retriever aktif dan setia.",
    img: "https://placedog.net/400/300?id=1"
  },
  {
    name: "Milo",
    type: "kelinci",
    desc: "Kelinci lucu berbulu putih lembut.",
    img: "https://images.unsplash.com/photo-1580741366851-ec95efb8ce55?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Bella",
    type: "anjing",
    desc: "Anjing Pomeranian kecil dan ceria.",
    img: "https://placedog.net/400/300?id=2"
  },
  {
    name: "Snowball",
    type: "kucing",
    desc: "Kucing Anggora berbulu putih bersih.",
    img: "https://placekitten.com/401/300"
  }
];

const container = document.getElementById("animal-container");

function renderAnimals(data) {
  container.innerHTML = ""; // Kosongkan container
  data.forEach(animal => {
    const card = document.createElement("div");
    card.classList.add("animal-card");
    card.innerHTML = `
      <img src="${animal.img}" alt="${animal.name}" />
      <div class="animal-info">
        <h3>${animal.name}</h3>
        <p>${animal.desc}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

function filterAnimals(type) {
  if (type === "all") {
    renderAnimals(animals);
  } else {
    const filtered = animals.filter(a => a.type === type);
    renderAnimals(filtered);
  }
}

// Pertama kali tampilkan semua
renderAnimals(animals);
