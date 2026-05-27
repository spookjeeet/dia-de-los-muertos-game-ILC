let scene, camera, renderer, player, clock;
let timeLeft = 300;
let currentWorld = "village"; // village, heaven, hell

function startGame(avatarType) {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('hud').style.display = 'block';
    
    initGame(avatarType);
    startTimer();
}

function initGame(avatarType) {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Licht toevoegen
    const light = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(light);

    // De Avatar maken op basis van keuze
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    let color = 0xffffff;
    if(avatarType === 'skeleton') color = 0xdddddd;
    if(avatarType === 'coco') color = 0xffcc99; // Huidskleur
    if(avatarType === 'devil') color = 0xff0000;

    const material = new THREE.MeshStandardMaterial({ color: color });
    player = new THREE.Mesh(geometry, material);
    scene.add(player);

    camera.position.set(0, 5, 10);
    camera.lookAt(player.position);

    setWorldStyle();
    animate();
}

function setWorldStyle() {
    if(currentWorld === "village") {
        scene.background = new THREE.Color(0x2a0a4a); // Donkerpaars (Dia de los muertos)
        document.getElementById('world-name').innerText = "Wereld: Het Dorp";
    } else if(currentWorld === "heaven") {
        scene.background = new THREE.Color(0x87ceeb); // Blauw
        document.getElementById('world-name').innerText = "Wereld: De Hemel";
    } else {
        scene.background = new THREE.Color(0x330000); // Rood
        document.getElementById('world-name').innerText = "Wereld: De Hel";
    }
}

function startTimer() {
    const timerElement = document.getElementById('timer');
    const interval = setInterval(() => {
        timeLeft--;
        let mins = Math.floor(timeLeft / 60);
        let secs = timeLeft % 60;
        timerElement.innerText = `Tijd over: ${mins}:${secs < 10 ? '0' : ''}${secs}`;

        if(timeLeft <= 0) {
            clearInterval(interval);
            alert("TE LAAT! Je bent voor eeuwig een skelet.");
            location.reload();
        }
    }, 1000);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Bewegen met toetsen
window.addEventListener('keydown', (e) => {
    if(e.key === "ArrowUp") player.position.z -= 0.5;
    if(e.key === "ArrowDown") player.position.z += 0.5;
    if(e.key === "ArrowLeft") player.position.x -= 0.5;
    if(e.key === "ArrowRight") player.position.x += 0.5;
    
    // Simpele logica om van wereld te wisselen (bijv. als je ver genoeg loopt)
    if(player.position.z < -10) {
        player.position.z = 5;
        if(currentWorld === "village") currentWorld = "heaven";
        else if(currentWorld === "heaven") currentWorld = "hell";
        else currentWorld = "village";
        setWorldStyle();
    }
});