const express = require('express');
const router = express.Router();
const db = require('../modules/database.js');
const authorizationJWT = require('../modules/auth.js');
const wordRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s\-']{1,255}$/;
const colorRegex = /^#[A-Fa-f0-9]{6}$/;

/**
 * @swagger
 * /teams:
 *   get:
 *     summary: Récupère toutes les équipes (accès réservé aux administrateurs)
 *     tags:
 *       - Teams
 *     responses:
 *       200:
 *         description: Liste de toutes les équipes
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
 *                     example: "Raptors"
 *                   color:
 *                     type: string
 *                     example: "#CE1141"
 *       500:
 *         description: Erreur serveur
 */
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM teams';
    db.query(sql, (err, results) => {
        if(err){
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).json(results);
    });
});

/**
 * @swagger
 * /teams/{id}:
 *   get:
 *     summary: Récupère une équipe spécifique par ID (accès réservé aux administrateurs)
 *     tags:
 *       - Teams
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la équipe à récupérer
 *     responses:
 *       200:
 *         description: Détails de la équipe spécifiée
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
 *                   example: "Raptors"
 *                 color:
 *                   type: string
 *                   example: "#CE1141"
 *       401:
 *         description: Non autorisé - Utilisateur non administrateur
 *       404:
 *         description: Équipe non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', authorizationJWT, (req, res) => {
    if(req.user.role!=="admin"){
        return res.status(401).json({ error: 'Forbidden.' });
    }
    const { id } = req.params;
    const sql = 'SELECT * FROM teams WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if(err){
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).json(results);
    });
});

/**
 * @swagger
 * /teams/create:
 *   post:
 *     summary: Créer une nouvelle équipe (accès réservé aux administrateurs)
 *     tags:
 *       - Teams
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
 *                 example: "Raptors"
 *               color:
 *                 type: string
 *                 example: "#CE1141"
 *     responses:
 *       200:
 *         description: Équipe créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Équipe créée avec succès'
 *                 name:
 *                   type: string
 *                   example: "Raptors"
 *                 color:
 *                   type: string
 *                   example: "#CE1141"
 *       401:
 *         description: Non autorisé - Utilisateur non administrateur
 *       400:
 *         description: Erreur de validation - Nom de équipe invalide
 *       500:
 *         description: Erreur serveur
 */
router.post('/create', authorizationJWT, async (req, res) => {
    if(req.user.role!=="admin"){
        return res.status(401).json({ error: 'Forbidden.' });
    }
    const {name, color} = req.body;
    if(!name || typeof(name)!=='string' || !name.match(wordRegex)){
        console.error('Nom invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Nom invalide.' });
    }
    if(!color || typeof(color)!=='string' || !color.match(colorRegex)){
        console.error('Nom invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Couleur invalide.' });
    }
    const sql = 'INSERT INTO teams (name, color) VALUES (?, ?)';
    db.query(sql, [name, color], (err, results) => {
        if (err) {
            console.error('Erreur SQL :', err);
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).send({ message: 'Équipe créée avec succès', name: name });
    });
});

/**
 * @swagger
 * /teams/update/{id}:
 *   put:
 *     summary: Modifier une équipe spécifique (accès réservé aux administrateurs)
 *     tags:
 *       - Teams
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la équipe à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Raptors"
 *               color:
 *                 type: string
 *                 example: "#CE1141"
 *     responses:
 *       200:
 *         description: Équipe modifiée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Équipe modifiée avec succès'
 *                 name:
 *                   type: string
 *                   example: "Raptors"
 *                 color:
 *                   type: string
 *                   example: "#CE1141"
 *       401:
 *         description: Non autorisé - Utilisateur non administrateur
 *       400:
 *         description: Erreur de validation - Nom de équipe invalide
 *       500:
 *         description: Erreur serveur
 */
router.put('/update/:id', authorizationJWT, async (req, res) => {
    if(req.user.role!=="admin"){
        return res.status(401).json({ error: 'Forbidden.' });
    }
    const {name, color} = req.body;
    if(!name || !name.match(wordRegex)){
        console.error('Nom invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Nom invalide.' });
    }
    if(!color || !color.match(colorRegex)){
        console.error('Nom invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Couleur invalide.' });
    }
    const id = req.params.id;
    const sql = 'UPDATE teams SET name = ?, color = ? WHERE id = ?'
    db.query(sql, [name, color, id], (err, results) => {
        if(err){
            console.error('Erreur de requête à la base de donnée.');
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).send({ message: 'Équipe modifiée avec succès', name: name });
    });
});

/**
 * @swagger
 * /teams/delete/{id}:
 *   delete:
 *     summary: Supprimer une équipe par ID (accès réservé aux administrateurs)
 *     tags:
 *       - Teams
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la équipe à supprimer
 *     responses:
 *       200:
 *         description: Équipe supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Équipe supprimée avec succès'
 *       400:
 *         description: Conflit - Produits associés à cette équipe doivent être déplacés ou supprimés d'abord
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
    const sql1 = 'SELECT * FROM products WHERE team = ?'
    const sql2 = 'DELETE FROM teams WHERE id = ?'
    db.query(sql1, [id], (err, results) => {
        if(err){
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        if(results && results.length>0){
            console.log('Un produit correspond à cette équipe, retirez le avant de supprimer la équipe.');
            return res.status(400).json({ error: 'Erreur requête', details: 'Un produit correspond à cette équipe, retirez le avant de supprimer la équipe.' });
        }
        db.query(sql2, [id], (err, results) => {
            if(err){
                console.error('Erreur de requête à la base de donnée.');
                return res.status(500).json({ error: 'Erreur serveur', details: err });
            }
            return res.status(200).json({ message: 'Équipe effacée avec succès' });
        });
    });
});


module.exports = router;