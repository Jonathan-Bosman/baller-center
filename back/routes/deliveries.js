const express = require('express');
const router = express.Router();
const db = require('../modules/database.js');
const authorizationJWT = require('../modules/auth.js');
const wordRegex = /^[A-Za-z0-9À-ÖØ-öø-ÿ\s\-']{1,255}$/;

/**
 * @swagger
 * /deliveries:
 *   get:
 *     summary: Récupère toutes les livraisons (accès réservé aux administrateurs)
 *     tags:
 *       - Deliveries
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste de toutes les livraisons
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
 *                   user:
 *                     type: integer
 *                     example: 42
 *                   address:
 *                     type: string
 *                     example: "123 Rue de Exemple, Ville"
 *                   products:
 *                     type: array
 *                     description: Liste des produits inclus dans la livraison
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: "Produit A"
 *                         price:
 *                           type: number
 *                           format: float
 *                           example: 19.99
 *                         quantity:
 *                           type: integer
 *                           example: 2
 *                   total_price:
 *                     type: number
 *                     format: float
 *                     example: 39.98
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-01-01T12:00:00Z"
 *       401:
 *         description: Non autorisé - Utilisateur non administrateur
 *       500:
 *         description: Erreur serveur
 */
router.get('/', (req, res) => {
    if(req.user.role!=="admin"){
        return res.status(401).json({ error: 'Forbidden.' });
    }
    const sql = 'SELECT * FROM deliveries SORT BY created_at DESC';
    db.query(sql, (err, results) => {
        if(err){
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).json(results);
    });
});

/**
 * @swagger
 * /deliveries/today:
 *   get:
 *     summary: Récupérer le total des ventes pour aujourd'hui (admin uniquement)
 *     tags: [Livraisons]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Total des ventes pour aujourd'hui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_today:
 *                   type: number
 *                   description: Total des ventes pour aujourd'hui
 *       401:
 *         description: Accès non autorisé
 *       500:
 *         description: Erreur serveur
 */
router.get('/today', authorizationJWT, (req, res) => {
    if(req.user.role!=="admin"){
        return res.status(401).json({ error: 'Forbidden.' });
    }
    const date = new Date();
    const dateString = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
    const sql = 'SELECT SUM(total_price) FROM deliveries WHERE created_at > ?';
    db.query(sql, [dateString], (err, results) => {
        if(err){
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).json(results);
    });
});

/**
 * @swagger
 * /deliveries/yesterday:
 *   get:
 *     summary: Récupérer le total des ventes pour hier (admin uniquement)
 *     tags: [Livraisons]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Total des ventes pour hier
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_yesterday:
 *                   type: number
 *                   description: Total des ventes pour hier
 *       401:
 *         description: Accès non autorisé
 *       500:
 *         description: Erreur serveur
 */
router.get('/yesterday', authorizationJWT, (req, res) => {
    if(req.user.role!=="admin"){
        return res.status(401).json({ error: 'Forbidden.' });
    }
    const dateToday = new Date();
    const yesterday = Date.now() + -1*24*3600*1000;
    const dateYeseterday = new Date(yesterday);
    const todayString = `${dateToday.getFullYear()}-${dateToday.getMonth()+1}-${dateToday.getDate()}`;
    const yesterdayString = `${dateYeseterday.getFullYear()}-${dateYeseterday.getMonth()+1}-${dateYeseterday.getDate()}`;
    const sql = 'SELECT SUM(total_price) FROM deliveries WHERE created_at BETWEEN ? AND ?';
    db.query(sql, [yesterdayString, todayString], (err, results) => {
        if(err){
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).json(results);
    });
});

/**
 * @swagger
 * /deliveries/lastmonth:
 *   get:
 *     summary: Récupérer le total des ventes pour le mois dernier (admin uniquement)
 *     tags: [Livraisons]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Total des ventes pour le mois dernier
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_last_month:
 *                   type: number
 *                   description: Total des ventes pour le mois dernier
 *       401:
 *         description: Accès non autorisé
 *       500:
 *         description: Erreur serveur
 */
router.get('/lastmonth', authorizationJWT, (req, res) => {
    if(req.user.role!=="admin"){
        return res.status(401).json({ error: 'Forbidden.' });
    }
    const dateToday = new Date();
    let lastMonth = new Date(dateToday);
    lastMonth.setMonth(dateToday.getMonth()-1);
    const todayString = `${dateToday.getFullYear()}-${dateToday.getMonth()+1}-01`;
    const lastMonthString = `${lastMonth.getFullYear()}-${lastMonth.getMonth()+1}-01`;
    const sql = 'SELECT SUM(total_price) FROM deliveries WHERE created_at BETWEEN ? AND ?';
    db.query(sql, [lastMonthString, todayString], (err, results) => {
        if(err){
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).json(results);
    });
});

/**
 * @swagger
 * /deliveries/profile:
 *   get:
 *     summary: Récupère les livraisons de l'utilisateur authentifié
 *     tags:
 *       - Deliveries
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des livraisons de l'utilisateur
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
 *                   user:
 *                     type: integer
 *                     example: 42
 *                   address:
 *                     type: string
 *                     example: "123 Rue de Exemple, Ville"
 *                   products:
 *                     type: array
 *                     description: Liste des produits inclus dans la livraison
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: "Produit A"
 *                         price:
 *                           type: number
 *                           format: float
 *                           example: 19.99
 *                         quantity:
 *                           type: integer
 *                           example: 2
 *                   total_price:
 *                     type: number
 *                     format: float
 *                     example: 39.98
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-01-01T12:00:00Z"
 *       500:
 *         description: Erreur serveur
 */
router.get('/profile', authorizationJWT, (req, res) => {
    const { id } = req.user;
    const sql = 'SELECT * FROM deliveries WHERE user = ? ORDER BY created_at DESC';
    db.query(sql, [id], (err, results) => {
        if(err){
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).json(results);
    });
});

/**
 * @swagger
 * /deliveries/profile/{id}:
 *   get:
 *     summary: Récupère une livraison spécifique de l'utilisateur authentifié par ID
 *     tags:
 *       - Deliveries
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la livraison à récupérer
 *     responses:
 *       200:
 *         description: Détails de la livraison spécifiée
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
 *                   user:
 *                     type: integer
 *                     example: 42
 *                   address:
 *                     type: string
 *                     example: "123 Rue de Exemple, Ville"
 *                   products:
 *                     type: array
 *                     description: Liste des produits inclus dans la livraison
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: "Produit A"
 *                         price:
 *                           type: number
 *                           format: float
 *                           example: 19.99
 *                         quantity:
 *                           type: integer
 *                           example: 2
 *                   total_price:
 *                     type: number
 *                     format: float
 *                     example: 39.98
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-01-01T12:00:00Z"
 *       404:
 *         description: Livraison non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/profile/:id', authorizationJWT, (req, res) => {
    const userId = req.user.id;
    const id = req.params.id;
    const sql = 'SELECT * FROM deliveries WHERE user = ? AND id= ?';
    db.query(sql, [userId, id], (err, results) => {
        if(err){
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).json(results);
    });
});

/**
 * @swagger
 * /deliveries/from/{id}:
 *   get:
 *     summary: Récupère les livraisons d'un utilisateur spécifique (accès réservé aux administrateurs)
 *     tags:
 *       - Deliveries
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur dont les livraisons sont à récupérer
 *     responses:
 *       200:
 *         description: Liste des livraisons de l'utilisateur spécifié
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
 *                   user:
 *                     type: integer
 *                     example: 42
 *                   address:
 *                     type: string
 *                     example: "123 Rue de Exemple, Ville"
 *                   products:
 *                     type: array
 *                     description: Liste des produits inclus dans la livraison
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: "Produit A"
 *                         price:
 *                           type: number
 *                           format: float
 *                           example: 19.99
 *                         quantity:
 *                           type: integer
 *                           example: 2
 *                   total_price:
 *                     type: number
 *                     format: float
 *                     example: 39.98
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-01-01T12:00:00Z"
 *       401:
 *         description: Non autorisé - Utilisateur non administrateur
 *       500:
 *         description: Erreur serveur
 */
router.get('/from/:id', authorizationJWT, (req, res) => {
    if(req.user.role!=="admin"){
        return res.status(401).json({ error: 'Forbidden.' });
    }
    const { id } = req.params;
    const sql = 'SELECT * FROM deliveries WHERE user = ? ORDER BY created_at DESC';
    db.query(sql, [id], (err, results) => {
        if(err){
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).json(results);
    });
});

/**
 * @swagger
 * /deliveries/{id}:
 *   get:
 *     summary: Récupère une livraison spécifique par ID (accès réservé aux administrateurs)
 *     tags:
 *       - Deliveries
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la livraison à récupérer
 *     responses:
 *       200:
 *         description: Détails de la livraison spécifiée
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
 *                   user:
 *                     type: integer
 *                     example: 42
 *                   address:
 *                     type: string
 *                     example: "123 Rue de Exemple, Ville"
 *                   products:
 *                     type: array
 *                     description: Liste des produits inclus dans la livraison
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: "Produit A"
 *                         price:
 *                           type: number
 *                           format: float
 *                           example: 19.99
 *                         quantity:
 *                           type: integer
 *                           example: 2
 *                   total_price:
 *                     type: number
 *                     format: float
 *                     example: 39.98
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-01-01T12:00:00Z"
 *       401:
 *         description: Non autorisé - Utilisateur non administrateur
 *       404:
 *         description: Livraison non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', authorizationJWT, (req, res) => {
    if(req.user.role!=="admin"){
        return res.status(401).json({ error: 'Forbidden.' });
    }
    const { id } = req.params;
    const sql = 'SELECT * FROM deliveries WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if(err){
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).json(results);
    });
});

/**
 * @swagger
 * /deliveries/create:
 *   post:
 *     summary: Crée une nouvelle livraison pour l'utilisateur authentifié
 *     tags:
 *       - Deliveries
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *                 example: "123 Rue de Exemple, Ville"
 *               products:
 *                 type: array
 *                 description: Une liste d'objets produits contenant ID, nom, prix et quantité
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Produit A"
 *                     price:
 *                       type: number
 *                       format: float
 *                       example: 19.99
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *     responses:
 *       200:
 *         description: Livraison créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Livraison créée avec succès'
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Produit A"
 *                       price:
 *                         type: number
 *                         format: float
 *                         example: 19.99
 *                       quantity:
 *                         type: integer
 *                         example: 2
 *       400:
 *         description: Erreur de validation - Produits ou format des produits invalide
 *       500:
 *         description: Erreur serveur
 */
router.post('/create', authorizationJWT, async (req, res) => {
    const userId = req.user.id;
    const { address, products } = req.body;
    const sql1 = 'SELECT id, quantity FROM products WHERE id IN (?)';
    const sql2 = 'INSERT INTO deliveries (user, address, products, total_price) VALUES (?, ?, ?, ?)';
    const sql3 = 'UPDATE products SET quantity = quantity - ?, sold = sold + ? WHERE id = ?';
    let productArray;
    try {
        productArray = JSON.parse(products);
    } catch (e) {
        console.error('Erreur de requête à la base de donnée.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Format des produits invalide.' });
    }
    if (!Array.isArray(productArray)) {
        console.error('Erreur de requête à la base de donnée.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Format des produits invalide.' });
    }
    let totalPrice = 0;
    const productQuantities = productArray.map(product => [product.id, product.quantity]);
    for (const product of productArray) {
        if (!product.id || isNaN(product.id)) {
            console.error('Erreur de requête à la base de donnée.');
            return res.status(400).json({ error: 'Erreur requête', details: 'ID produits invalide.' });
        }
        if (!product.name || !product.name.match(wordRegex)) {
            console.error('Erreur de requête à la base de donnée.');
            return res.status(400).json({ error: 'Erreur requête', details: 'Nom produits invalide.' });
        }
        if (!product.price || isNaN(product.price) || !product.quantity || isNaN(product.quantity)) {
            console.error('Erreur de requête à la base de donnée.');
            return res.status(400).json({ error: 'Erreur requête', details: 'Prix ou quantité produits invalide.' });
        }
        totalPrice += product.price * product.quantity;
    }
    const productIds = productArray.map(product => product.id);
    db.query(sql1, [productIds], async (err, stockResults) => {
        if (err) {
            console.error('Erreur de requête à la base de donnée.');
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        const insufficientStock = stockResults.some(stock => {
            const requestedQuantity = productQuantities.find(pq => pq[0] === stock.id)[1];
            return stock.quantity < requestedQuantity;
        });
        if (insufficientStock) {
            return res.status(400).json({ error: 'Erreur requête', details: 'Pas assez de stock pour un ou plusieurs produits.' });
        }
        db.beginTransaction(async (err) => {
            if (err) return res.status(500).json({ error: 'Erreur serveur', details: err });
            db.query(sql2, [userId, address, JSON.stringify(products), totalPrice], (err, deliveryResult) => {
                if (err) {
                    db.rollback(() => res.status(500).json({ error: 'Erreur serveur', details: err }));
                    return;
                }
                const updateStockValues = productArray.map(product => [product.quantity, product.quantity, product.id]);
                db.query(sql3, [updateStockValues], (err) => {
                    if (err) {
                        db.rollback(() => res.status(500).json({ error: 'Erreur serveur', details: err }));
                        return;
                    }
                    db.commit((err) => {
                        if (err) {
                            db.rollback(() => res.status(500).json({ error: 'Erreur serveur', details: err }));
                        } else {
                            res.status(200).json({ message: 'Livraison créée avec succès', products });
                        }
                    });
                });
            });
        });
    });
});

/**
 * @swagger
 * /deliveries/update/{id}:
 *   put:
 *     summary: Met à jour le statut d'une livraison (accès réservé aux administrateurs)
 *     tags:
 *       - Deliveries
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la livraison à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "Livrée"
 *                 enum: ["Livrée", "En cours"]
 *                 description: Statut de la livraison (doit être "Livrée" ou "En cours")
 *     responses:
 *       200:
 *         description: Livraison mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Livraison modifiée avec succès'
 *       400:
 *         description: Erreur de validation - Statut invalide
 *       401:
 *         description: Non autorisé - Utilisateur non administrateur
 *       500:
 *         description: Erreur serveur
 */
router.put('/update/:id', authorizationJWT, async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(401).json({ error: 'Forbidden.' });
    }
    const { status } = req.body;
    if (!(status === 'Livrée' || status === 'En cours')) {
        return res.status(400).json({ error: 'Erreur requête', details: 'Status invalide.' });
    }
    const id = req.params.id;
    const sql = 'UPDATE categories SET status = ? WHERE id = ?'
    db.query(sql, [status, id], (err, results) => {
        if(err){
            console.error('Erreur de requête à la base de donnée.');
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).send({ message: 'Livraison modifiée avec succès', name: name });
    });
});


module.exports = router;