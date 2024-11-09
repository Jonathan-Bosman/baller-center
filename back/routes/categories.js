const express = require('express');
const router = express.Router();
const db = require('../modules/database.js');
const authorizationJWT = require('../modules/auth.js');
const wordRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s\-']{1,255}$/;

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Récupère toutes les catégories (accès réservé aux administrateurs)
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: Liste de toutes les catégories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Maillot"
 *       500:
 *         description: Erreur serveur
 */
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM categories';
    db.query(sql, (err, results) => {
        if(err){
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).json(results);
    });
});

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Récupère une catégorie spécifique par ID (accès réservé aux administrateurs)
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la catégorie à récupérer
 *     responses:
 *       200:
 *         description: Détails de la catégorie spécifiée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "Maillot"
 *       401:
 *         description: Non autorisé - Utilisateur non administrateur
 *       404:
 *         description: Catégorie non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', authorizationJWT, (req, res) => {
    if(req.user.role!=="admin"){
        return res.status(401).json({ error: 'Forbidden.' });
    }
    const { id } = req.params;
    const sql = 'SELECT * FROM categories WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if(err){
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).json(results);
    });
});

/**
 * @swagger
 * /categories/create:
 *   post:
 *     summary: Créer une nouvelle catégorie (accès réservé aux administrateurs)
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Maillot"
 *     responses:
 *       200:
 *         description: Catégorie créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Catégorie créée avec succès'
 *                 name:
 *                   type: string
 *                   example: "Maillot"
 *       401:
 *         description: Non autorisé - Utilisateur non administrateur
 *       400:
 *         description: Erreur de validation - Nom de catégorie invalide
 *       500:
 *         description: Erreur serveur
 */
router.post('/create', authorizationJWT, async (req, res) => {
    if(req.user.role!=="admin"){
        return res.status(401).json({ error: 'Forbidden.' });
    }
    const {name} = req.body;
    if(!name || !name.match(wordRegex)){
        console.error('Nom invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Nom invalide.' });
    }
    const sql = 'INSERT INTO categories (name) VALUES (?)';
    db.query(sql, [name], (err, results) => {
        if (err) {
            console.error('Erreur SQL :', err);
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).send({ message: 'Catégorie créée avec succès', name: name });
    });
});

/**
 * @swagger
 * /categories/update/{id}:
 *   put:
 *     summary: Modifier une catégorie spécifique (accès réservé aux administrateurs)
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la catégorie à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Maillot"
 *     responses:
 *       200:
 *         description: Catégorie modifiée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Catégorie modifiée avec succès'
 *                 name:
 *                   type: string
 *                   example: "Maillot"
 *       401:
 *         description: Non autorisé - Utilisateur non administrateur
 *       400:
 *         description: Erreur de validation - Nom de catégorie invalide
 *       500:
 *         description: Erreur serveur
 */
router.put('/update/:id', authorizationJWT, async (req, res) => {
    if(req.user.role!=="admin"){
        return res.status(401).json({ error: 'Forbidden.' });
    }
    const {name} = req.body;
    if(!name || !name.match(wordRegex)){
        console.error('Nom invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Nom invalide.' });
    }
    const id = req.params.id;
    const sql = 'UPDATE categories SET name = ? WHERE id = ?'
    db.query(sql, [name, id], (err, results) => {
        if(err){
            console.error('Erreur de requête à la base de donnée.');
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).send({ message: 'Catégorie modifiée avec succès', name: name });
    });
});

/**
 * @swagger
 * /categories/delete/{id}:
 *   delete:
 *     summary: Supprimer une catégorie par ID (accès réservé aux administrateurs)
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la catégorie à supprimer
 *     responses:
 *       200:
 *         description: Catégorie supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Catégorie supprimée avec succès'
 *       400:
 *         description: Conflit - Produits associés à cette catégorie doivent être déplacés ou supprimés d'abord
 *       401:
 *         description: Non autorisé - Utilisateur non administrateur
 *       500:
 *         description: Erreur serveur
 */
router.delete('/delete/:id', authorizationJWT, async (req, res) => {
    if(req.user.role!=="admin"){
        return res.status(401).json({ error: 'Forbidden.' });
    }
    const { id } = req.params.id;
    const sql1 = 'SELECT * FROM products WHERE category = ?'
    const sql2 = 'DELETE FROM categories WHERE id = ?'
    db.query(sql1, [id], (err, results) => {
        if(err){
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        if(results && results.length>0){
            console.log('Un produit correspond à cette catégorie, retirez le avant de supprimer la catégorie.');
            return res.status(400).json({ error: 'Erreur requête', details: 'Un produit correspond à cette catégorie, retirez le avant de supprimer la catégorie.' });
        }
    });
    db.query(sql2, [id], (err, results) => {
        if(err){
            console.error('Erreur de requête à la base de donnée.');
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).json({ message: 'Catégorie effacée avec succès' });
    });
});


module.exports = router;