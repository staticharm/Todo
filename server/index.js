const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const express = require("express");
const app = express();
// const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require('cors');



const todos = require('./routes/routes');


//MIDDLEWARE
// app.use(morgan('dev'));
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({
    limit: "5mb",
    extended: true
}));
app.use(cors());



app.use('/api', todos);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));



const port = process.env.PORT || 9000

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});