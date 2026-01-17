const express = require("express");
const uploadRoutes = require("./routes/upload.routes");

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/upload", uploadRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
