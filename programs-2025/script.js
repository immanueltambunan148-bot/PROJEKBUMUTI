// function resizeCanvas() {
// 	const canvas = document.getElementById('myCanvas');
// 	canvas.width = window.innerWidth - 140; // Menyesuaikan lebar canvas
// 	canvas.height = window.innerHeight - 70; // Menyesuaikan tinggi canvas
// }

// document.addEventListener('DOMContentLoaded', () => {
// 	resizeCanvas(); // Atur ukuran saat halaman dimuat
// });

// window.addEventListener('resize', () => {
// 	resizeCanvas(); // Atur ulang ukuran saat jendela diubah ukurannya
// });
document.addEventListener('DOMContentLoaded', () => {
	const landingPage = document.getElementById('landing-page');
	const coloringPage = document.getElementById('coloring-page');
	const themeButtonsContainer = document.getElementById('theme-buttons');
	const themeDescription = document.getElementById('theme-description');
	const backButton = document.getElementById('back-button');
	const canvas = document.getElementById("myCanvas");
	const saveButton = document.getElementById('save-button');
	const ctx = canvas.getContext("2d", { willReadFrequently: true });
	let painting = false;
	let coord = { x: 0, y: 0 };
	let restore_array = [];
	let index = -1;
	// Menyimpan posisi awal penghapusan
	window.addEventListener('beforeunload', () => {
		// Hentikan semua pembacaan teks
		if (window.speechSynthesis.speaking) {
			window.speechSynthesis.cancel();
		}
	});
	// Adjust canvas size
	canvas.width = window.innerWidth * 0.9; // Mengambil 90% lebar layar
	canvas.height = window.innerHeight * 0.8; // Mengambil 80% tinggi layar
// speakText("Selamat datang di halaman mewarnai Binatang Laut! Ayo langsung pilih binatang laut dan warnaiiii!");
//   // Fungsi brush baru
// 	document.getElementById('btnBrush').addEventListener('click', function () {
// 		ctx.strokeStyle = document.getElementById('colorChange').value;
// 		ctx.lineWidth = document.getElementById('penSize').value;
// 		console.log("Brush size changed to: ", ctx.lineWidth);
// 	});          
// Fungsi untuk membaca teks dalam bagian-bagian kecil
	function speakText(text) {
		speechSynthesis.cancel(); // Hentikan pembacaan sebelumnya

		const maxLength = 150; // Maksimum panjang teks untuk setiap bagian
		const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g); // Potong teks berdasarkan kalimat

		// let index = 0;
		//       speakText("Selamat datang di halaman mewarnai! Di halaman ini, kamu dapat memilih topik yang ingin kamu warnai, mulai dari binatang laut, ekosistem, keindahan bawah laut, hingga aktivitas manusia di laut. Selamat berkreasi!");
			
		function speakPart() {
			if (index < sentences.length) {
				const part = sentences.slice(index, index + 1).join(' ');
				const utterance = new SpeechSynthesisUtterance(part);
				utterance.lang = 'id-ID';
				utterance.rate = 1.2; // Mengatur kecepatan pembicara sedikit lebih cepat
				utterance.pitch = 1.1; // Menyesuaikan nada suara
				utterance.onend = () => {
					index++;
					speakPart(); // Lanjutkan ke bagian berikutnya setelah yang sekarang selesai
				};
				speechSynthesis.speak(utterance);
			}
		}

		speakPart(); // Mulai pembacaan dengan bagian pertama
	}
	let selectedThemeName = '';  // Variabel global untuk menyimpan nama tema yang dipilih
	// Load themes (fetch data and populate buttons)
	fetch('data/themes.json')
		.then(response => response.json())
		.then(data => {
			data.themes.forEach(theme => {
				const button = document.createElement('button');
				button.classList.add('theme-button');
				button.textContent = theme.name;
				button.setAttribute('data-theme', theme.id);
				button.setAttribute('data-description', theme.description);
				button.addEventListener('click', () => {
					loadTheme(theme.id, theme.description);
					landingPage.style.display = 'none';
					coloringPage.style.display = 'block';
					selectedThemeName = theme.name;  // Simpan nama tema yang dipili
				});
				themeButtonsContainer.appendChild(button);
			});
		});
	let selectedThemeDescription = '';  // Variabel global untuk menyimpan deskripsi tema yang dipilih
	// Function to load theme
	function loadTheme(theme, description) {
		backgroundImage = new Image();
		backgroundImage.src = `images/${theme}.png`;
		backgroundImage.onload = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
			restore_array.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
			index += 1;
		};

		const descriptionElement = document.getElementById('theme-description');
		selectedThemeDescription = description;
		setTimeout(() => {
			speakText(description);
		}, 100);
	}

		// Event listeners for drawing tools
		document.getElementById('colorChange').addEventListener('change', function () {
			ctx.strokeStyle = this.value;
		});

		document.getElementById('penSize').addEventListener('change', function () {
			ctx.lineWidth = this.value;
			// Set properti garis agar lebih halus
			ctx.lineCap = 'round';  // Membuat ujung garis lebih bulat
			ctx.lineJoin = 'round'; // Membuat sambungan garis lebih halus
		});

		// document.getElementById('btnPencil').addEventListener('click', function () {
		// 	ctx.strokeStyle = document.getElementById('colorChange').value;
		// 	ctx.lineWidth = document.getElementById('penSize').value;
		// 	ctx.globalCompositeOperation = 'source-over'; // Mode untuk menggambar normal
		// });
		

		// document.getElementById('btnBucket').addEventListener('click', function () {
		// 	ctx.fillStyle = document.getElementById('colorChange').value;
		// 	ctx.fillRect(0, 0, canvas.width, canvas.height);
		// 	restore_array.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
		// 	index += 1;
		// });

		document.getElementById('btnEraser').addEventListener('click', function () {
			ctx.globalCompositeOperation = 'destination-out'; // Mode untuk menghapus
			ctx.lineWidth = document.getElementById('penSize').value;
			ctx.lineCap = 'round'; // Membuat ujung penghapus bulat
			ctx.lineJoin = 'round'; // Membuat sambungan penghapus bulat
		});
		
		document.getElementById('btnPencil').addEventListener('click', function () {
			ctx.globalCompositeOperation = 'source-over'; // Kembali ke mode menggambar biasa
			ctx.strokeStyle = document.getElementById('colorChange').value;
			ctx.lineWidth = document.getElementById('penSize').value;
			ctx.lineCap = 'round'; // Membuat ujung pensil bulat
			ctx.lineJoin = 'round'; // Membuat sambungan pensil bulat
		});
		
		
		document.getElementById('btnUndo').addEventListener('click', function () {
			undo_last();
		});

		document.getElementById('btnClear').addEventListener('click', function () {
			if (index == -1) {
				return;
			}
			else {
				var c = confirm("WARNAA AKANN DIHAPUSS!! 🧐🧐🧐");
				if (c == true) {
					clearcanvas();
				}
				else {
					return false;
				}
			}
		});

		backButton.addEventListener('click', () => {
			speechSynthesis.cancel();  // Hentikan speakText saat tombol Back ditekan
			landingPage.style.display = 'block';
			coloringPage.style.display = 'none';
		});

		// Coordinates of cursor
		function getPos(event) {
			const rect = canvas.getBoundingClientRect(); // Dapatkan ukuran dan posisi kanvas
			coord.x = event.clientX - rect.left; // Sesuaikan posisi dengan offset
			coord.y = event.clientY - rect.top;
		}

		// Start drawing
		function startPos(event) {
			painting = true;
			getPos(event);
			draw(event);
		}

		// Stop drawing
		function endPos(event) {
			if (painting) {
				ctx.closePath();
				painting = false;
			}
			if (event.type !== 'mouseout') {
				restore_array.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
				index += 1;
			}
		}

		// Draw on canvas
		function draw(event) {
			if (!painting) return;
			ctx.beginPath();
			ctx.moveTo(coord.x, coord.y);
			getPos(event);
			ctx.lineTo(coord.x, coord.y);
				// Menambahkan multiple strokes untuk ketebalan
			for (let i = 0; i < 15; i++) {  // Angka 3 bisa diganti sesuai dengan ketebalan yang diinginkan
				ctx.stroke();
			}
			ctx.closePath();  // Pastikan path ditutu
		}

		// Clear canvas
		function clearcanvas() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			if (backgroundImage) {
				ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // Gambar ulang latar belakang
			}
			restore_array = [];
			index = -1;
		}
		
		function saveState() {
			// Simpan state canvas saat ini ke dalam restore_array
			if (index < restore_array.length - 1) {
				restore_array.length = index + 1;  // Hapus data yang ada setelah index saat ini jika ada perubahan baru
			}
			restore_array.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
			index++;
		}
		
		function undo_last() {
			if (index <= 0) {
				clearcanvas();
				index = -1;
			} else {
				index--;
				ctx.clearRect(0, 0, canvas.width, canvas.height); // Hapus canvas
				if (backgroundImage) {
					ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // Gambar ulang latar belakang
				}
				ctx.putImageData(restore_array[index], 0, 0);
			}
		}
		
		// Panggil saveState setiap kali ada perubahan di canvas
		canvas.addEventListener('mousedown', function () {
			saveState();
		});
		

		// Event listeners for canvas drawing
		// Event listeners for canvas drawing
		canvas.addEventListener('touchstart', function(event) {
			event.preventDefault(); // Mencegah scrolling saat mewarnai
			startPos(event.touches[0]); // Mengambil posisi sentuhan pertama
		}, false);
		canvas.addEventListener('touchmove', function(event) {
			event.preventDefault();
			draw(event.touches[0]);
		}, false);
		canvas.addEventListener('touchend', function(event) {
			event.preventDefault();
			endPos(event.changedTouches[0]); // Mengambil posisi akhir sentuhan
		}, false);

		canvas.addEventListener('mousedown', startPos);
		canvas.addEventListener('mouseup', endPos);
		canvas.addEventListener('mousemove', draw);
		canvas.addEventListener('mouseout', endPos);

		// Function to handle export
		saveButton.addEventListener('click', () => {
			const link = document.createElement('a');
			link.download = 'coloring-page.png';
			link.href = canvas.toDataURL();
			link.click();
		});

		// Audio player
		const audioPlayer = document.getElementById('audioPlayer');
		const songs = [
			'assets/audio/song2.mp3', // Ganti dengan nama file lagu Anda
			'assets/audio/song1.mp3',
			'assets/audio/song3.mp3'
		];

		let currentSongIndex = 0;

		const playSong = (index) => {
			audioPlayer.src = songs[index];
			audioPlayer.play();
		};
		// Set volume (misalnya, 0.5 untuk setengah volume)
		audioPlayer.volume = 0.1;
		audioPlayer.addEventListener('ended', () => {
			currentSongIndex = (currentSongIndex + 1) % songs.length;
			playSong(currentSongIndex);
		});

		// Memulai pemutaran lagu pertama
		playSong(currentSongIndex);
		
		document.getElementById('save-button').addEventListener('click', function() {
			// Pause all other playing audio elements and save their state
			const allAudioElements = document.querySelectorAll('audio');
			let previouslyPlayingAudio = null;
			allAudioElements.forEach(audioElement => {
				if (!audioElement.paused) {
					audioElement.pause();
					previouslyPlayingAudio = audioElement;
				}
			});
		
			// Check if speakText is active and pause it
			let isSpeakTextActive = false;
			if (window.speechSynthesis.speaking) {
				isSpeakTextActive = true;
				window.speechSynthesis.cancel(); // Pause speakText
			}
		
			// Munculkan popup
			const popup = document.getElementById('popup');
			const themeNameElement = document.getElementById('theme-name1'); 
			const selectedThemeName = "MEWARNAI SELESAI!"; 
			themeNameElement.textContent = selectedThemeName;
			popup.classList.add('active');
		
			// Mainkan audio
			const audio = new Audio('assets/audio/congratula.mp3');
			audio.volume = 0.3;
			audio.play();
		
			// Sembunyikan popup dan resume previous audio after the song ends
			audio.addEventListener('ended', function() {
				popup.classList.remove('active');
				
				// Resume the previously playing audio if there was one
				if (previouslyPlayingAudio) {
					previouslyPlayingAudio.play();
				}
		
				// Resume speakText if it was active before the popup
				if (isSpeakTextActive) {
					speakText(selectedThemeDescription);  // Gunakan deskripsi yang disimpan sebelumnya
				}
			});
		});
		
		// document.getElementById('close-popup').addEventListener('click', function() {
		// 	// Sembunyikan popup
		// 	const popup = document.getElementById('popup');
		// 	popup.classList.remove('active');
		// });
});