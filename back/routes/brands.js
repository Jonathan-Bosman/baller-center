const express = require('express');
const router = express.Router();
const db = require('../modules/database.js');
const authorizationJWT = require('../modules/auth.js');
const wordRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s\-']{1,255}$/;

/**
 * @swagger
 * /brands:
 *   get:
 *     summary: Récupère toutes les marques (accès réservé aux administrateurs)
 *     tags:
 *       - Brands
 *     responses:
 *       200:
 *         description: Liste de toutes les marques
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
 *                     example: "Nike"
 *       500:
 *         description: Erreur serveur
 */
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM brands';
    db.query(sql, (err, results) => {
        if(err){
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).json(results);
    });
});

/**
 * @swagger
 * /brands/{id}:
 *   get:
 *     summary: Récupère une marque spécifique par ID (accès réservé aux administrateurs)
 *     tags:
 *       - Brands
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la marque à récupérer
 *     responses:
 *       200:
 *         description: Détails de la marque spécifiée
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
 *                   example: "Nike"
 *       401:
 *         description: Non autorisé - Utilisateur non administrateur
 *       404:
 *         description: Marque non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', authorizationJWT, (req, res) => {
    if(req.user.role!=="admin"){
        return res.status(401).json({ error: 'Forbidden.' });
    }
    const { id } = req.params;
    const sql = 'SELECT * FROM brands WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if(err){
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).json(results);
    });
});

/**
 * @swagger
 * /brands/create:
 *   post:
 *     summary: Créer une nouvelle marque (accès réservé aux administrateurs)
 *     tags:
 *       - Brands
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
 *                 example: "Nike"
 *     responses:
 *       200:
 *         description: Marque créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Marque créée avec succès'
 *                 name:
 *                   type: string
 *                   example: "Nike"
 *       401:
 *         description: Non autorisé - Utilisateur non administrateur
 *       400:
 *         description: Erreur de validation - Nom de marque invalide
 *       500:
 *         description: Erreur serveur
 */
router.post('/create', authorizationJWT, async (req, res) => {
    if(req.user.role!=="admin"){
        return res.status(401).json({ error: 'Forbidden.' });
    }
    const {name} = req.body;
    if(!name || typeof(name)!=='string' || !name.match(wordRegex)){
        console.error('Nom invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Nom invalide.' });
    }
    const sql = 'INSERT INTO brands (name) VALUES (?)';
    db.query(sql, [name], (err, results) => {
        if (err) {
            console.error('Erreur SQL :', err);
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).send({ message: 'Marque créée avec succès', name: name });
    });
});

/**
 * @swagger
 * /brands/update/{id}:
 *   put:
 *     summary: Modifier une marque spécifique (accès réservé aux administrateurs)
 *     tags:
 *       - Brands
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la marque à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Nike"
 *     responses:
 *       200:
 *         description: Marque modifiée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Marque modifiée avec succès'
 *                 name:
 *                   type: string
 *                   example: "Nike"
 *       401:
 *         description: Non autorisé - Utilisateur non administrateur
 *       400:
 *         description: Erreur de validation - Nom de marque invalide
 *       500:
 *         description: Erreur serveur
 */
router.put('/update/:id', authorizationJWT, async (req, res) => {
    if(req.user.role!=="admin"){
        return res.status(401).json({ error: 'Forbidden.' });
    }
    const {name} = req.body;
    if(!name || typeof(name)!=='string' || !name.match(wordRegex)){
        console.error('Nom invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Nom invalide.' });
    }
    const id = req.params.id;
    const sql = 'UPDATE brands SET name = ? WHERE id = ?'
    db.query(sql, [name, id], (err, results) => {
        if(err){
            console.error('Erreur de requête à la base de donnée.');
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).send({ message: 'Marque modifiée avec succès', name: name });
    });
});

/**
 * @swagger
 * /brands/delete/{id}:
 *   delete:
 *     summary: Supprimer une marque par ID (accès réservé aux administrateurs)
 *     tags:
 *       - Brands
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la marque à supprimer
 *     responses:
 *       200:
 *         description: Marque supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Marque supprimée avec succès'
 *       400:
 *         description: Conflit - Produits associés à cette marque doivent être déplacés ou supprimés d'abord
 *       401:
 *         description: Non autorisé - Utilisateur non administrateur
 *       500:
 *         description: Erreur serveur
 */
router.delete('/delete/:id', authorizationJWT, async (req, res) => {
    if(req.user.role!=="admin"){
        return res.status(401).json({ error: 'Forbidden.' });
    }
    const id = req.params.id;
    const sql1 = 'SELECT * FROM products WHERE brand = ?'
    const sql2 = 'DELETE FROM brands WHERE id = ?'
    db.query(sql1, [id], (err, results) => {
        if(err){
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        if(results && results.length>0){
            console.log('Un produit correspond à cette marque, retirez le avant de supprimer la marque.');
            return res.status(400).json({ error: 'Erreur requête', details: 'Un produit correspond à cette marque, retirez le avant de supprimer la marque.' });
        }
        db.query(sql2, [id], (err, results) => {
            if(err){
                console.error('Erreur de requête à la base de donnée.');
                return res.status(500).json({ error: 'Erreur serveur', details: err });
            }
            return res.status(200).json({ message: 'Marque effacée avec succès' });
        });
    });
});


module.exports = router;