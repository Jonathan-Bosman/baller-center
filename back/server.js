require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./modules/database.js');
const usersRoutes = require('./routes/users.js');
const productsRoutes = require('./routes/products.js');
const categoriesRoutes = require('./routes/categories.js');
const teamsRoutes = require('./routes/teams.js');
const brandsRoutes = require('./routes/brands.js');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const app = express();
app.use(cors({
    origin: 'http://localhost:8080'
}))
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API quiz',
            version: '0.0.1',
            description: '',
            contact: {
                name: 'Brandon, Jean-Baptiste, Jonathan, Laurence'
            },
        },
        servers: [{url: 'http://localhost:3000/api'}]
    },
    apis: ['./routes/*js']
}
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(bodyParser.json());
app.use('/api/users', usersRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/brands', brandsRoutes);

db.connect((err) => {
    if (err) {console.log(err);}
    else {console.log('bravo');}
});

const port = process.env.PORT || 3333;
app.listen(port, () => {console.log('SERVEUR DEMMARÉ');});