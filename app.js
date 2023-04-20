const container = document.querySelector('.image-container');
const inputFile = document.getElementById('input-file');
const btnSubmit = document.getElementById('btn-submit');
const img = new Image();
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const imageParts = [];
const arrayOrder = [
	'image-0-0',
	'image-1-0',
	'image-2-0',
	'image-0-1',
	'image-1-1',
	'image-2-1',
	'image-0-2',
	'image-1-2',
	'image-2-2',
	'image-0-3',
	'image-1-3',
	'image-2-3',
];

// Función para manejar el evento de arrastre de las imágenes
function handleDragStart(e) {
	e.dataTransfer.setData('text/plain', e.target.id);
}

// Función para manejar el evento de soltar la imagen sobre otra
function handleDrop(e) {
	e.preventDefault();
	const sourceId = e.dataTransfer.getData('text/plain');
	const sourceImage = document.getElementById(sourceId);
	const targetImage = e.target.closest('img');

	if (targetImage && targetImage !== sourceImage) {
		const tempId = targetImage.id;
		targetImage.id = sourceImage.id;
		sourceImage.id = tempId;

		const tempSrc = targetImage.src;
		targetImage.src = sourceImage.src;
		sourceImage.src = tempSrc;

		const images = container.querySelectorAll('img');
		const idArray = [...images].map((e) => {
			return e.id;
		});

		const isOrdered = idArray.every(
			(val, index) => val === arrayOrder[index]
		);

		console.log(isOrdered);

		if (isOrdered) {
			const popup = document.getElementById('popup');
			popup.style.display = 'block';

			const closePopupButton = document.getElementById('close-popup');
			closePopupButton.addEventListener('click', () => {
				popup.style.display = 'none';
			});
		}
	}
}

function handleDragOver(e) {
	e.preventDefault();
}

function handleDragEnter(e) {
	e.preventDefault();
	e.target.classList.add('dragover');
}

function handleDragLeave(e) {
	e.preventDefault();
	e.target.classList.remove('dragover');
}

btnSubmit.addEventListener('click', () => {
	container.innerHTML = '';
	imageParts.length = 0;
	const file = inputFile.files[0];

	if (file) {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function () {
			const imageSrc = reader.result;
			img.src = imageSrc;
		};
	}
});

img.onload = function () {
	const rows = 3;
	const cols = 4;

	container.style.padding = '10px';
	if (img.height < img.width) {
		container.style.maxWidth = '700px';
	} else {
		container.style.maxWidth = '410px';
	}

	const pieceWidth = img.width / rows;
	const pieceHeight = img.height / cols;

	canvas.width = img.width;
	canvas.height = img.height;

	ctx.drawImage(img, 0, 0);

	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			const x = i * pieceWidth;
			const y = j * pieceHeight;

			const imageData = ctx.getImageData(x, y, pieceWidth, pieceHeight);

			const canvasTemp = document.createElement('canvas');

			canvasTemp.width = pieceWidth;
			canvasTemp.height = pieceHeight;

			const ctxTemp = canvasTemp.getContext('2d');

			ctxTemp.putImageData(imageData, 0, 0);

			const image = new Image();
			image.src = canvasTemp.toDataURL();
			image.id = `image-${i}-${j}`;
			image.setAttribute('draggable', 'true');
			image.addEventListener('dragstart', handleDragStart);

			// ajustar la relación de aspecto de la imagen para que coincida con la imagen original
			image.width = pieceWidth;
			image.height = pieceHeight;

			imageParts.push(image);
		}
	}

	shuffle(imageParts);

	for (let i = 0; i < imageParts.length; i++) {
		const image = imageParts[i];
		container.appendChild(image);
	}

	container.addEventListener('dragover', handleDragOver);
	container.addEventListener('dragenter', handleDragEnter);
	container.addEventListener('dragleave', handleDragLeave);
	container.addEventListener('drop', handleDrop);
};

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}
