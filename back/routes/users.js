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
 *     summary: Récupérer tous les utilisateurs
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
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
 *                     example: 'user'
 *                   firstname:
 *                     type: string
 *                     example: 'Aïcha'
 *                   lastname:
 *                     type: string
 *                     example: 'aaa'
 *                   email:
 *                     type: string
 *                     example: 'aaa'
 *                   password:
 *                     type: string
 *                     example: 'aaa'
 *                   telephone:
 *                     type: string
 *                     example: '0033600000000'
 *                   address:
 *                     type: string
 *                     example: '0033600000000'
 *                   zipcode:
 *                     type: string
 *                     example: '10000'
 *                   created_at:
 *                     type: string
 *                     example: '2020'
 */
router.get('/', (req, res) => {
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
 * /users/create:
 *   post:
 *     summary: Créer un/e nouvel/le utilisateur/trice
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
    if(!firstname.match(wordRegex)){
        console.error('Prénom invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Prénom invalide.' });
    }
    if(!lastname.match(wordRegex)){
        console.error('Nom invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Nom invalide.' });
    }
    if(!email.match(emailRegex)){
        console.error('E-mail invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'E-mail invalide.' });
    }
    if(!telephone.match(telRegex)){
        return res.status(400).json({ error: 'Erreur requête', details: 'Téléphone invalide.' });
    }
    if(!address.match(addressRegex)){
        console.error('Adresse invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Adresse invalide.' });
    }
    if(!zipcode.match(zipRegex)){
        console.error('Code postal invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Code postal invalide.' });
    }
    if(!password.match(/.{10,255}/)){
        console.error('Mot de passe trop court.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Mot de passe trop court.' });    
    }
    if(!password.match(/[a-z]/)){
        console.error('Aucune minuscule dans le mot de passe.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Aucune minuscule dans le mot de passe.' });    
    }
    if(!password.match(/[A-Z]/)){
        console.error('Aucune majuscule dans le mot de passe.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Aucune majuscule dans le mot de passe.' });    
    }
    if(!password.match(/[0-9]/)){
        console.error('Aucun numéro dans le mot de passe.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Aucun numéro dans le mot de passe.' });    
    }
    if(!password.match(/[!@#$%^&*(),;.?":{}|<>]/)){
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
 */
router.post('/login', async (req, res) => {
    const {email, pass} = req.body;
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], async (err, results) => {
        if(err){
            console.error('Erreur de requête à la base de donnée.');
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        if(results.length<1){
            console.log('Aucun utilisateur avec l\'e-mail ', email, '.');
            return res.status(401).json({ error: 'E-mail ou mot de passe incorrect.' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(pass, user.pass);

        if(!isMatch){
            console.log('Le mot de passe ne correspond pas pour l\'utilisateur');
            return res.status(401).json({ error: 'E-mail ou mot de passe incorrect.' });
        }

        const {id, firstname, lastname} = user;
        const token = jwt.sign({ id : user.id, role : user.role}, process.env.PRIVATE_KEY, {expiresIn: '1d' });
        return res.status(200).json({ message: "Connecté/e", id: id, firstname: firstname, lastname: lastname, token: token });
    });
});

/**
 * @swagger
 * /users/update/{id}:
 *   put:
 *     summary: Modifier un utilisateur/trice
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
router.put('/update/:id', async (req, res) => {
    if(req.body.role!=='admin'){
        console.error('Rôle invalide.');
        req.body.role = 'user';
    }
    const {role, firstname, lastname, email, password, telephone, address, zipcode} = req.body;
    if(!firstname.match(wordRegex)){
        console.error('Prénom invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Prénom invalide.' });
    }
    if(!lastname.match(wordRegex)){
        console.error('Nom invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Nom invalide.' });
    }
    if(!email.match(emailRegex)){
        console.error('E-mail invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'E-mail invalide.' });
    }
    if(!telephone.match(telRegex)){
        return res.status(400).json({ error: 'Erreur requête', details: 'Téléphone invalide.' });
    }
    if(!address.match(addressRegex)){
        console.error('Adresse invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Adresse invalide.' });
    }
    if(!zipcode.match(zipRegex)){
        console.error('Code postal invalide.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Code postal invalide.' });
    }
    if(!password.match(/.{10,255}/)){
        console.error('Mot de passe trop court.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Mot de passe trop court.' });    
    }
    if(!password.match(/[a-z]/)){
        console.error('Aucune minuscule dans le mot de passe.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Aucune minuscule dans le mot de passe.' });    
    }
    if(!password.match(/[A-Z]/)){
        console.error('Aucune majuscule dans le mot de passe.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Aucune majuscule dans le mot de passe.' });    
    }
    if(!password.match(/[0-9]/)){
        console.error('Aucun numéro dans le mot de passe.');
        return res.status(400).json({ error: 'Erreur requête', details: 'Aucun numéro dans le mot de passe.' });    
    }
    if(!password.match(/[!@#$%^&*(),;.?":{}|<>]/)){
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
 * /users/delete/{id}:
 *   delete:
 *     summary: Éffacer l'utilisateur/trice correspondant à l'url
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'utilisateur/trice
 *     responses:
 *       200:
 *         description: Éffacement d'un/e utilisateur/trice
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: 'Utilisateur/trice éffacé/e'
 */
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params.id;
    const sql = 'DELETE FROM users WHERE id = ?'
    db.query(sql, [id], (err, results) => {
        if(err){
            console.error('Erreur de requête à la base de donnée.');
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).json({ message: 'Utilisateur/trice éffacé/e avec succès' });
    });
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Récupérer l'utilisateur/trice correspondant à l'url
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'utilisateur/trice
 *     responses:
 *       200:
 *         description: Détails d'un/e utilisateur/trice
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
 *                   firstname:
 *                     type: string
 *                     example: 'aaa'
 *                   lastname:
 *                     type: string
 *                     example: 'aaa'
 *                   email:
 *                     type: string
 *                     example: 'aaa'
 *                   pass:
 *                     type: string
 *                     example: 'aaa'
 *                   role:
 *                     type: string
 *                     example: 'user'
 */
router.get('/:id', authorizationJWT, (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM users WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if(err){
            return res.status(500).json({ error: 'Erreur serveur', details: err });
        }
        return res.status(200).json(results);
    });
});

module.exports = router;