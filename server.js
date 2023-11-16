const express = require("express");
const app = express();
const path = require("path");
const { logger } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const PORT = process.env.PORT || 3500;

//allow the application to use the custom middleware "logger" that allows us to generate logs
app.use(logger);
//allow the application to solve cross origins problems.
app.use(cors(corsOptions));

// allow the application to handle JSON files and parse Json
app.use(express.json());
//allow the application to handle cookies.
app.use(cookieParser());

//indicates the application where to find the static files to be serve through the entire application.
app.use("/", express.static(path.join(__dirname, "public")));

//indicates the application where to find the Root html.
app.use("/", require("./routes/root"));

// Handles all the 404 Not found events in the app. if it can, it'll answer with HTML, else it'll answer with json els it'll answer with plain text.
app.all("*", (req, res) => {
	res.status(404);
	if (req.accepts("html")) {
		res.sendFile(path.join(__dirname, "views", "404.html"));
	} else if (req.accepts("json")) {
		res.json({ message: "404 Not Found" });
	} else {
		res.type("txt").send("404 Not Found");
	}
});

//allows the use of the custom error Handler middleware
app.use(errorHandler);

//Makes the server Run in the selected Port.
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
