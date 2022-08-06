require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", express.static(path.join(__dirname, "../public")));

app.get("/:rover", async (req, res) => {
	const rover = req.params.rover.toLowerCase();

	if (rover !== "spirit" && rover !== "opportunity" && rover !== "curiosity") {
		res.send(
			"Invalid rover. Please choose in options: /opportunity, /spirit or /curiosity"
		);
		return;
	}

	try {
		const results = await fetch(
			`https://api.nasa.gov/mars-photos/api/v1/rovers/spirit/photos?sol=800&api_key=${process.env.API_KEY}`
		).then((res) => res.json());

		res.send({ photos: results.photos });
	} catch (err) {
		console.log("error:", err);
	}
});

app.listen(port, () =>
	console.log(`Mars Rover Dashboard app listening on port ${port}!`)
);
