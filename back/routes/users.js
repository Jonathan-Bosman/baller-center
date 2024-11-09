const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../modules/database.js');
const jwt = require('jsonwebtoken');
const authorizationJWT = require('../modules/auth.js');
const wordRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s\-']{1,255}$/;
const emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
const telRegex = /^[0-9]{10,13}$/;
const addressRegex = /^[A-Za-z0-9À-ÖØ-öø-ÿ\s\-']{1,255}$/;
const zipRegex = /^[0-9]{5}$/;

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Récupère tous les utilisateurs (accès réservé aux administrateurs)
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste de tous les utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 25
 *                   role:
 *                     type: string
 *                     example: "user"
 *                   firstname:
 *                     type: string
 *                     example: "Alice"
 *                   lastname:
 *                     type: string
 *                     example: "Bidule"
 *                   email:
 *                     type: string
 *                     example: "bidulalice@gmail.com"
 *                   password:
 *                     type: string
 *                     example: "hashedpassword"
 *                   telephone:
 *                     type: string
 *                     example: "0033600000000"
 *                   address:
 *                     type: string
 *                     example: "1312 rue de Bidule bis"
 *                   zipcode:
 *                     type: string
 *                     example: "10000"
 *                   created_at:
 *                     type: string
 *                     format: date
 *                     example: "2020-01-01"
 *       401:
 *         description: Non autorisé - Utilisateur non administrateur
 *       500:
 *         description: Erreur serveur
 */
router.get('/', authorizationJWT, (req, res) => {
    if(req.user.role!=="admin"){
        return res.status(401).json({ error: 'Forbidden.' });
    }
    const sql = 'SELECT * FROM users';
    db.query(sql, (err, results) => {
        if(err){
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).json(results);
    });
});

/**
 * @swagger
 * /users/latest:
 *   get:
 *     summary: Récupère les cinq derniers utilisateurs (accès réservé aux administrateurs)
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des cinq derniers utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 25
 *                   role:
 *                     type: string
 *                     example: "user"
 *                   firstname:
 *                     type: string
 *                     example: "Alice"
 *                   lastname:
 *                     type: string
 *                     example: "Bidule"
 *                   email:
 *                     type: string
 *                     example: "bidulalice@gmail.com"
 *                   password:
 *                     type: string
 *                     example: "hashedpassword"
 *                   telephone:
 *                     type: string
 *                     example: "0033600000000"
 *                   address:
 *                     type: string
 *                     example: "1312 rue de Bidule bis"
 *                   zipcode:
 *                     type: string
 *                     example: "10000"
 *                   created_at:
 *                     type: string
 *                     format: date
 *                     example: "2020-01-01"
 *       401:
 *         description: Non autorisé - Utilisateur non administrateur
 *       500:
 *         description: Erreur serveur
 */
router.get('/latest', authorizationJWT, (req, res) => {
    if(req.user.role!=="admin"){
        return res.status(401).json({ error: 'Forbidden.' });
    }
    const sql = 'SELECT * FROM users ORDER BY created_at DESC LIMIT 5';
    db.query(sql, (err, results) => {
        if(err){
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).json(results);
    });
});

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Récupère les détails du profil de l'utilisateur connecté
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Détails de l'utilisateur connecté
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 25
 *                 firstname:
 *                   type: string
 *                   example: "Alice"
 *                 lastname:
 *                   type: string
 *                   example: "Bidule"
 *                 email:
 *                   type: string
 *                   example: "bidulalice@gmail.com"
 *                 role:
 *                   type: string
 *                   example: "user"
 *       401:
 *         description: Non autorisé - Jeton invalide ou utilisateur non connecté
 *       500:
 *         description: Erreur serveur
 */
router.get('/profile', authorizationJWT, (req, res) => {
    const { id } = req.user;
    const sql = 'SELECT * FROM users WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if(err){
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).json(results);
    });
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Récupère un utilisateur spécifique par ID (accès réservé aux administrateurs)
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur à récupérer
 *     responses:
 *       200:
 *         description: Détails de l'utilisateur spécifié
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 25
 *                 firstname:
 *                   type: string
 *                   example: "Alice"
 *                 lastname:
 *                   type: string
 *                   example: "Bidule"
 *                 email:
 *                   type: string
 *                   example: "bidulalice@gmail.com"
 *                 role:
 *                   type: string
 *                   example: "user"
 *       401:
 *         description: Non autorisé - Utilisateur non administrateur
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', authorizationJWT, (req, res) => {
    if(req.user.role!=="admin"){
        return res.status(401).json({ error: 'Forbidden.' });
    }
    const { id } = req.params;
    const sql = 'SELECT * FROM users WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if(err){
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).json(results);
    });
});

/**
 * @swagger
 * /users/create:
 *   post:
 *     summary: Créer un/e nouvel/le utilisateur/trice
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 example: 'aaa'
 *               lastname:
 *                 type: string
 *                 example: 'aaa'
 *               email:
 *                 type: string
 *                 example: 'aaa@example.com'
 *               pass:
 *                 type: string
 *                 example: 'password123'
 *               role:
 *                 type: string
 *                 example: 'user'
 *     responses:
 *       200:
 *         description: Utilisateur/trice créé/e avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Utilisateur/trice créé/e'
 */
router.post('/create', async (req, res) => {
    if(req.body.role!=='admin'){
        console.error('Rôle invalide.');
        req.body.role = 'user';
    }
    const {role, firstname, lastname, email, password, telephone, address, zipcode} = req.body;
    if(!firstname || !firstname.match(wordRegex)){
        console.error('Prénom invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Prénom invalide.' });
    }
    if(!lastname || !lastname.match(wordRegex)){
        console.error('Nom invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Nom invalide.' });
    }
    if(!email || !email.match(emailRegex)){
        console.error('E-mail invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'E-mail invalide.' });
    }
    if(!telephone || !telephone.match(telRegex)){
        return res.status(400).json({ error: 'Erreur requête', details: 'Téléphone invalide.' });
    }
    if(!address || !address.match(addressRegex)){
        console.error('Adresse invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Adresse invalide.' });
    }
    if(!zipcode || !zipcode.match(zipRegex)){
        console.error('Code postal invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Code postal invalide.' });
    }
    if(!password || !password.match(/.{10,255}/)){
        console.error('Mot de passe trop court.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Mot de passe trop court.' });    
    }
    if(!password || !password.match(/[a-z]/)){
        console.error('Aucune minuscule dans le mot de passe.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Aucune minuscule dans le mot de passe.' });    
    }
    if(!password || !password.match(/[A-Z]/)){
        console.error('Aucune majuscule dans le mot de passe.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Aucune majuscule dans le mot de passe.' });    
    }
    if(!password || !password.match(/[0-9]/)){
        console.error('Aucun numéro dans le mot de passe.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Aucun numéro dans le mot de passe.' });    
    }
    if(!password || !password.match(/[!@#$%^&*(),;.?":{}|<>]/)){
        console.error('Aucun caractère spécial dans le mot de passe.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Aucun caractère spécial dans le mot de passe.' });    
    }
    bcrypt.hash(password, 10).then((hashedPassword) => {
        const sql = 'INSERT INTO users (role, firstname, lastname, email, password, telephone, address, zipcode) VALUES (?,?,?,?,?,?,?,?)';
        db.query(sql, [role, firstname, lastname, email, hashedPassword, telephone, address, zipcode], (err, results) => {
            if (err) {
                console.error('Erreur SQL :', err);
                return res.status(500).json({ error: 'Erreur serveur', details: err });
            }
            return res.status(200).send({ message: 'Utilisateur/trice créé/e avec succès', name: firstname });
        });
    }).catch(err => {
        console.error('Erreur bcrypt :', err);
        return res.status(500).send({ error: 'Erreur de hachage' });
    });
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Se connecter
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: 'aaa@example.com'
 *               pass:
 *                 type: string
 *                 example: 'password123'
 *     responses:
 *       200:
 *         description: Utilisateur/trice connecté/e avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 25
 *                 firstname:
 *                   type: string
 *                   example: 'aaa'
 *                 lastname:
 *                   type: string
 *                   example: 'aaa'
 *                 token:
 *                   type: string
 *                   example: 'very.long.gibberish'
 *       401:
 *         description: Échec de la connexion - E-mail ou mot de passe incorrect
 *       500:
 *         description: Erreur serveur
 */
router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    const sql1 = 'SELECT * FROM users WHERE email = ?';
    const sql2 = 'UPDATE users SET created_at = NOW() WHERE email = ?';
    if(!email){
        return res.status(401).json({ error: 'E-mail ou mot de passe incorrect.' });
    }
    db.query(sql1, [email], async (err, results) => {
        if(err){
            console.error('Erreur de requête à la base de donnée.');
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        if(results.length<1){
            return res.status(401).json({ error: 'E-mail ou mot de passe incorrect.' });
        }
        
        const user = results[0];
        if(user.password && password){
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch){
                return res.status(401).json({ error: 'E-mail ou mot de passe incorrect.' });
            }
        } else {
            return res.status(401).json({ error: 'E-mail ou mot de passe incorrect.' });
        }
        db.query(sql2, [email], async (err, results) => {
            if(err){
                console.error('Erreur de requête à la base de donnée.');
                return res.status(500).json({ error: 'Erreur serveur', details: err });
            }
        });
        const {id, firstname, lastname} = user;
        const token = jwt.sign({ id : user.id, role : user.role}, process.env.PRIVATE_KEY, {expiresIn: '1d' });
        return res.status(200).json({ message: "Connecté/e", id: id, firstname: firstname, lastname: lastname, token: token });
    });
});

/**
 * @swagger
 * /users/profile/update:
 *   put:
 *     summary: Modifier un utilisateur/trice
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'utilisateur/trice
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 example: 'aaa'
 *               lastname:
 *                 type: string
 *                 example: 'aaa'
 *               email:
 *                 type: string
 *                 example: 'aaa@example.com'
 *               pass:
 *                 type: string
 *                 example: 'hashed-word-salad'
 *               role:
 *                 type: string
 *                 example: 'user'
 *     responses:
 *       200:
 *         description: Utilisateur/trice modifié/e avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Utilisateur/trice modifié/e'
 */
router.put('/profile/update', authorizationJWT, async (req, res) => {
    const {firstname, lastname, email, password, telephone, address, zipcode} = req.body;
    if(!firstname || !firstname.match(wordRegex)){
        console.error('Prénom invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Prénom invalide.' });
    }
    if(!lastname || !lastname.match(wordRegex)){
        console.error('Nom invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Nom invalide.' });
    }
    if(!email || !email.match(emailRegex)){
        console.error('E-mail invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'E-mail invalide.' });
    }
    if(!telephone || !telephone.match(telRegex)){
        return res.status(400).json({ error: 'Erreur requête', details: 'Téléphone invalide.' });
    }
    if(!address || !address.match(addressRegex)){
        console.error('Adresse invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Adresse invalide.' });
    }
    if(!zipcode || !zipcode.match(zipRegex)){
        console.error('Code postal invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Code postal invalide.' });
    }
    if(!password || !password.match(/.{10,255}/)){
        console.error('Mot de passe trop court.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Mot de passe trop court.' });    
    }
    if(!password || !password.match(/[a-z]/)){
        console.error('Aucune minuscule dans le mot de passe.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Aucune minuscule dans le mot de passe.' });    
    }
    if(!password || !password.match(/[A-Z]/)){
        console.error('Aucune majuscule dans le mot de passe.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Aucune majuscule dans le mot de passe.' });    
    }
    if(!password || !password.match(/[0-9]/)){
        console.error('Aucun numéro dans le mot de passe.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Aucun numéro dans le mot de passe.' });    
    }
    if(!password || !password.match(/[!@#$%^&*(),;.?":{}|<>]/)){
        console.error('Aucun caractère spécial dans le mot de passe.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Aucun caractère spécial dans le mot de passe.' });    
    }
    const id = req.user.id;
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'UPDATE users SET firstname = ?, lastname = ?, email = ?, password = ?, telephone = ?, address = ?, zipcode = ?, created_at = NOW() WHERE id = ?'
    db.query(sql, [firstname, lastname, email, hashedPassword, telephone, address, zipcode, id], (err, results) => {
        if(err){
            console.error('Erreur de requête à la base de donnée.');
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).send({ message: 'Utilisateur/trice modifié/e avec succès', name: firstname });
    });
});

/**
 * @swagger
 * /users/update/{id}:
 *   put:
 *     summary: Modifier un utilisateur/trice
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'utilisateur/trice
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 example: 'aaa'
 *               lastname:
 *                 type: string
 *                 example: 'aaa'
 *               email:
 *                 type: string
 *                 example: 'aaa@example.com'
 *               pass:
 *                 type: string
 *                 example: 'hashed-word-salad'
 *               role:
 *                 type: string
 *                 example: 'user'
 *     responses:
 *       200:
 *         description: Utilisateur/trice modifié/e avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Utilisateur/trice modifié/e'
 */
router.put('/update/:id', authorizationJWT, async (req, res) => {
    if(req.user.role!=="admin"){
        return res.status(401).json({ error: 'Forbidden.' });
    }
    if(req.body.role!=='admin'){
        console.error('Rôle invalide.');
        req.body.role = 'user';
    }
    const {role, firstname, lastname, email, password, telephone, address, zipcode} = req.body;
    if(!firstname || !firstname.match(wordRegex)){
        console.error('Prénom invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Prénom invalide.' });
    }
    if(!lastname || !lastname.match(wordRegex)){
        console.error('Nom invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Nom invalide.' });
    }
    if(!email || !email.match(emailRegex)){
        console.error('E-mail invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'E-mail invalide.' });
    }
    if(!telephone || !telephone.match(telRegex)){
        return res.status(400).json({ error: 'Erreur requête', details: 'Téléphone invalide.' });
    }
    if(!address || !address.match(addressRegex)){
        console.error('Adresse invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Adresse invalide.' });
    }
    if(!zipcode || !zipcode.match(zipRegex)){
        console.error('Code postal invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Code postal invalide.' });
    }
    if(!password || !password.match(/.{10,255}/)){
        console.error('Mot de passe trop court.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Mot de passe trop court.' });    
    }
    if(!password || !password.match(/[a-z]/)){
        console.error('Aucune minuscule dans le mot de passe.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Aucune minuscule dans le mot de passe.' });    
    }
    if(!password || !password.match(/[A-Z]/)){
        console.error('Aucune majuscule dans le mot de passe.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Aucune majuscule dans le mot de passe.' });    
    }
    if(!password || !password.match(/[0-9]/)){
        console.error('Aucun numéro dans le mot de passe.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Aucun numéro dans le mot de passe.' });    
    }
    if(!password || !password.match(/[!@#$%^&*(),;.?":{}|<>]/)){
        console.error('Aucun caractère spécial dans le mot de passe.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Aucun caractère spécial dans le mot de passe.' });    
    }
    const id = req.params.id;
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'UPDATE users SET role = ?, firstname = ?, lastname = ?, email = ?, password = ?, telephone = ?, address = ?, zipcode = ?, created_at = NOW() WHERE id = ?'
    db.query(sql, [role, firstname, lastname, email, hashedPassword, telephone, address, zipcode, id], (err, results) => {
        if(err){
            console.error('Erreur de requête à la base de donnée.');
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).send({ message: 'Utilisateur/trice modifié/e avec succès', name: firstname });
    });
});

/**
 * @swagger
 * /users/profile/delete:
 *   delete:
 *     summary: Supprimer l'utilisateur/trice correspondant à l'ID de l'utilisateur connecté
 *     tags:
 *       - Users
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Token d'authentification JWT pour identifier l'utilisateur connecté
 *     responses:
 *       200:
 *         description: Utilisateur/trice supprimé(e) avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Utilisateur/trice supprimé(e) avec succès'
 *       401:
 *         description: Non autorisé - L'utilisateur n'a pas le droit de supprimer son propre compte
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Non autorisé'
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Erreur serveur'
 */
router.delete('/profile/delete', authorizationJWT, async (req, res) => {
    const { id } = req.user;
    const sql = 'DELETE FROM users WHERE id = ?'
    db.query(sql, [id], (err, results) => {
        if(err){
            console.error('Erreur de requête à la base de donnée.');
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).json({ message: 'Utilisateur/trice effacé/e avec succès' });
    });
});

/**
 * @swagger
 * /users/delete/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur/trice spécifique par son ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'utilisateur/trice à supprimer
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Token d'authentification JWT pour vérifier les droits administratifs
 *     responses:
 *       200:
 *         description: Utilisateur/trice supprimé(e) avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Utilisateur/trice supprimé(e) avec succès'
 *       401:
 *         description: Non autorisé - L'utilisateur connecté n'a pas les droits d'administrateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Non autorisé'
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Erreur serveur'
 */
router.delete('/delete/:id', authorizationJWT, async (req, res) => {
    if(req.user.role!=="admin"){
        return res.status(401).json({ error: 'Forbidden.' });
    }
    const { id } = req.params.id;
    const sql = 'DELETE FROM users WHERE id = ?'
    db.query(sql, [id], (err, results) => {
        if(err){
            console.error('Erreur de requête à la base de donnée.');
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).json({ message: 'Utilisateur/trice effacé/e avec succès' });
    });
});


module.exports = router;