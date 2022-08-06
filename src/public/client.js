let store = {
	user: { name: "LuongNK1", company: "FPT Software - VietNam" },
	selectedRover: "",
	photos: [],
	rovers: Immutable.List(["Spirit", "Opportunity", "Curiosity"]),
};

// add our markup to the page
const root = document.getElementById("root");

const updateStore = (newState) => {
	store = Object.assign(store, newState);
	render(root, store);
};

const render = async (root, state) => {
	console.log(state);
	root.innerHTML = App(state);
};

// create content
const App = (state) => {
	return `
        <header><h1>Mars Rover Dashboard</h1></header>
        <main>
            <section>
                ${RoverDashboard(state)}
            </section>
        </main>
        <footer>
            <h3>${state.user.name}(${
		state.user.company
	}) Udacity's Intermediate JavaScript Nanodegree</h3>
        </footer>
    `;
};

// listening for load event because page should load before any JS is called
window.addEventListener("load", () => {
	render(root, store);
});

// ------------------------------------------------------  COMPONENTS

const RoverDashboard = (state) => {
	if (!state.selectedRover) {
		return `
            ${wrapInDiv(
							"rover-item-container",
							state.rovers,
							joinWithBlank,
							roverElementMaker
						)}
        `;
	}

	if (!state.photos || !state.photos.length) {
		getRoverPhotos(state);
		return "";
	}

	return `<button onclick="updateStore({ selectedRover: '', photos: [] })" class="back-button">Back</button>
    ${wrapInDiv(
			"photo-container",
			state.photos,
			joinWithBlank,
			photoElementMaker
		)}
    <button onclick="updateStore({ selectedRover: '', photos: [] })" class="back-button">Back</button>`;
};

const roverElementMaker = (rover) => {
	return `
    <button class="rover-button" onclick="updateStore({ selectedRover: '${rover}' })">
        <h2 class="rover-title">${rover}</h2>
    </button>
    `;
};

const photoElementMaker = (photoData) => {
	const { img_src, earth_date, rover } = photoData;
	const { name, launch_date, landing_date, status } = rover;

	return `
        <div class="photo-item">
            <img class="photo" src="${img_src}" alt="Mars photo"/>
            <ul class="info-container">
                <li>Rover name: <span>${name}</span></li>
                <li>Launched from Earth on: <span>${launch_date}</span></li>
                <li>Landed on Mars on: <span>${landing_date}</span></li>
                <li>Mission status: <span>${status}</span></li>
                <li>Photos taken on: <span>${earth_date}</span></li>
            </ul>
            <hr />
        </div>
    `;
};

const wrapElement =
	(tagname) => (classname, dataMap, mapperCb, elementRenderCb) => {
		return `
    <${tagname} class="${classname}">
        ${mapperCb(dataMap, elementRenderCb)}
    </${tagname}>
    `;
	};

const wrapInDiv = wrapElement("div");

const joinMapperHOF =
	(separator = "") =>
	(dataMap, callback) => {
		return `
        ${dataMap.map((e) => callback(e)).join(separator)}
    `;
	};

const joinWithBlank = joinMapperHOF();

const getRoverPhotos = (state) => {
	const { selectedRover } = state;

	fetch(`/${selectedRover}`)
		.then((res) => res.json())
		.then(({ photos }) => updateStore({ photos }));
};
