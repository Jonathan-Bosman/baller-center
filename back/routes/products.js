const express = require('express');
const router = express.Router();
const db = require('../modules/database.js');
const authorizationJWT = require('../modules/auth.js');
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });
const wordRegex = /^[A-Za-z0-9À-ÖØ-öø-ÿ\s\-']{1,255}$/;
const descriptionRegex = /^[A-Za-z0-9À-ÖØ-öø-ÿ\s\-'.,;µ!#£€$%&'*+=?^_`¤[({|})\]~-]{1,255}$/gm;
const yearRegex = /^[0-9]{4}$/;

/**
 * @swagger
 * components:
 *   schemas:
 *     Produit:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         category:
 *           type: integer
 *         team:
 *           type: integer
 *         variation:
 *           type: string
 *           enum: [Domicile, Extérieur, Alternative]
 *         brand:
 *           type: integer
 *         creation_year:
 *           type: string
 *         size:
 *           type: string
 *         price:
 *           type: integer
 *         quantity:
 *           type: integer
 *         filename:
 *           type: string
 *         filepath:
 *           type: string
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: Produits
 *   description: API pour la gestion des produits
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Récupérer tous les produits
 *     tags: [Produits]
 *     responses:
 *       200:
 *         description: Liste de tous les produits
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Produit'
 *       500:
 *         description: Erreur serveur
 */
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM products';
    db.query(sql, (err, results) => {
        if(err){
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).json(results);
    });
});

/**
 * @swagger
 * /products/best:
 *   get:
 *     summary: Récupérer les 3 meilleurs produits vendus (admin uniquement)
 *     tags: [Produits]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des 3 meilleurs produits
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Produit'
 *       401:
 *         description: Accès non autorisé (admin uniquement)
 *       500:
 *         description: Erreur serveur
 */
router.get('/best', authorizationJWT, (req, res) => {
    if(req.user.role!=="admin"){
        return res.status(401).json({ error: 'Forbidden.' });
    }
    const sql = 'SELECT * FROM products ORDER BY sold LIMIT 3';
    db.query(sql, (err, results) => {
        if(err){
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).json(results);
    });
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Récupérer un produit par son ID
 *     tags: [Produits]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Un produit spécifique
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produit'
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM products WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if(err){
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).json(results);
    });
});

/**
 * @swagger
 * /products/create:
 *   post:
 *     summary: Créer un nouveau produit (admin uniquement)
 *     tags: [Produits]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: integer
 *               team:
 *                 type: integer
 *               variation:
 *                 type: string
 *                 enum: [Domicile, Extérieur, Alternative]
 *               brand:
 *                 type: integer
 *               creation_year:
 *                 type: string
 *               size:
 *                 type: string
 *               price:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Produit créé avec succès
 *       400:
 *         description: Entrée non valide
 *       401:
 *         description: Accès non autorisé (admin uniquement)
 *       500:
 *         description: Erreur serveur
 */
router.post('/create', authorizationJWT, upload.single('image'), async (req, res) => {
    if(req.user.role!=="admin"){
        return res.status(401).json({ error: 'Forbidden.' });
    }
    const { name, description, category, team, variation, brand, creation_year, size, price, quantity } = req.body;
    if(!name || typeof(name)!=='string' || !name.match(wordRegex)){
        console.error('Nom invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Nom invalide.' });
    }
    if(!description || typeof(description)!=='string' || !description.match(descriptionRegex)){
        console.error('Description invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Description invalide.' });
    }
    if(!category || isNaN(category)){
        console.error('Catégorie invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Catégorie invalide.' });
    }
    if(!team || isNaN(team)){
        console.error('Equipe invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Equipe invalide.' });
    }
    if(!(variation==='Domicile' || variation==='Extérieur' || variation==='Alternative' || variation==='Non applicable')){
        console.error('Variation invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Variation invalide.' });
    }
    if(!brand || isNaN(brand)){
        console.error('Marque invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Marque invalide.' });
    }
    if(!creation_year || typeof(creation_year)!=='string'|| !creation_year.match(yearRegex)){
        console.error('Année invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Année invalide.' });
    }
    if(!size || typeof(size)!=='string' || !size.match(wordRegex)){
        console.error('Taille invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Taille invalide.' });
    }
    if(!price || isNaN(price)){
        console.error('Prix invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Prix invalide.' });
    }
    if(!quantity || isNaN(quantity)){
        console.error('Quantité invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Quantité invalide.' });
    }
    const filepath = req.file?req.file.path:'';
    const filename = req.file?req.file.filename:'';
    const sql = 'INSERT INTO products (name, description, category, team, variation, brand, creation_year, size, price, quantity, filename, filepath) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)';
    db.query(sql, [name, description, category, team, variation, brand, creation_year, size, price, quantity, filename, filepath], (err, results) => {
        if (err) {
            console.error('Erreur SQL :', err);
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).send({ message: 'Produit créée avec succès', name: name });
    });
});

/**
 * @swagger
 * /products/update/{id}:
 *   put:
 *     summary: Mettre à jour un produit existant (admin uniquement)
 *     tags: [Produits]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: integer
 *               team:
 *                 type: integer
 *               variation:
 *                 type: string
 *                 enum: [Domicile, Extérieur, Alternative]
 *               brand:
 *                 type: integer
 *               creation_year:
 *                 type: string
 *               size:
 *                 type: string
 *               price:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Produit mis à jour avec succès
 *       400:
 *         description: Entrée non valide
 *       401:
 *         description: Accès non autorisé (admin uniquement)
 *       500:
 *         description: Erreur serveur
 */
router.put('/update/:id', authorizationJWT, upload.single('image'), async (req, res) => {
    if(req.user.role!=="admin"){
        return res.status(401).json({ error: 'Forbidden.' });
    }
    const { name, description, category, team, variation, brand, creation_year, size, price, quantity } = req.body;
    if(!name || typeof(name)!=='string' || !name.match(wordRegex)){
        console.error('Nom invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Nom invalide.' });
    }
    if(!description || typeof(description)!=='string' || !description.match(descriptionRegex)){
        console.error('Description invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Description invalide.' });
    }
    if(!category || isNaN(category)){
        console.error('Catégorie invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Catégorie invalide.' });
    }
    if(!team || isNaN(team)){
        console.error('Equipe invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Equipe invalide.' });
    }
    if(!(variation==='Domicile' || variation==='Extérieur' || variation==='Alternative' || variation==='Non applicable')){
        console.error('Variation invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Variation invalide.' });
    }
    if(!brand || isNaN(brand)){
        console.error('Marque invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Marque invalide.' });
    }
    if(!creation_year || typeof(creation_year)!=='string'|| !creation_year.match(yearRegex)){
        console.error('Année invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Année invalide.' });
    }
    if(!size || typeof(size)!=='string' || !size.match(wordRegex)){
        console.error('Taille invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Taille invalide.' });
    }
    if(!price || isNaN(price)){
        console.error('Prix invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Prix invalide.' });
    }
    if(!quantity || isNaN(quantity)){
        console.error('Quantité invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Quantité invalide.' });
    }
    const filepath = req.file?req.file.path:'';
    const filename = req.file?req.file.filename:'';
    const id = req.params.id;
    const sql = 'UPDATE products SET name = ?, description = ?, category = ?, team = ?, variation = ?, brand = ?, creation_year = ?, size = ?, price = ?, quantity = ?, filename = ?, filepath = ? WHERE id = ?'
    db.query(sql, [name, description, category, team, variation, brand, creation_year, size, price, quantity, filename, filepath, id], (err, results) => {
        if(err){
            console.error('Erreur de requête à la base de donnée.');
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).send({ message: 'Catégorie modifiée avec succès', name: name });
    });
});

/**
 * @swagger
 * /products/delete/{id}:
 *   delete:
 *     summary: Supprimer un produit par ID (admin uniquement)
 *     tags: [Produits]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produit supprimé avec succès
 *       401:
 *         description: Accès non autorisé (admin uniquement)
 *       500:
 *         description: Erreur serveur
 */
router.delete('/delete/:id', authorizationJWT, async (req, res) => {
    if(req.user.role!=="admin"){
        return res.status(401).json({ error: 'Forbidden.' });
    }
    const id = req.params.id;
    const sql = 'DELETE FROM products WHERE id = ?'
    db.query(sql, [id], (err, results) => {
        if(err){
            console.error('Erreur de requête à la base de donnée.');
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).json({ message: 'Catégorie effacée avec succès' });
    });
});


module.exports = router;