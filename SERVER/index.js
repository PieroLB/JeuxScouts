const express = require('express');
const App = express();

const mysql = require('mysql');
const connexion = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'jeuxscouts'
})

connexion.connect((err) => {
    if (err) throw err;
    console.log('Connexion à la base de donnée réussie !')
})

// readHTML est un fichier qui retourne un fichier html
const pageAccueil = require('./readHTML.js');
App.get('/', async (req, res) => {
    // await car il ne faut pas que la récupération ne bloque l'éxécution des autres lignes
    res.send(await pageAccueil());
})
// Lecture de la requête d'un dossier ('/assets/') et retourne le contenu du dossier
App.use('/script.js', express.static('../CLIENT/script.js'));
App.use('/assets', express.static('../CLIENT/assets/'));
App.use('/font', express.static('../CLIENT/font/'));

App.get('/GETjeux', (req, res) => {
    connexion.query("SELECT * FROM jeux", (err, result) => {
        if (err) throw err;
        res.send(result)
    });
});
App.get('/GETbrouillons', (req, res) => {
    connexion.query("SELECT * FROM brouillons", (err, result) => {
        if (err) throw err;
        res.send(result)
    });
});

App.use(express.json({limit:'1mb'}));
App.post('/POSTjeu', (req, res) => {
    connexion.query("INSERT INTO `jeux`(`titre`, `content`, `filtres`) VALUES ('"+req.body.titre+"','"+req.body.content+"','"+req.body.filtres+"')", (err, result) => {
        if (err) throw err;
    });
});

App.post('/POSTbrouillon', (req, res) => {
    connexion.query("SELECT * FROM `brouillons` WHERE titre='"+req.body.ancienTitre+"'", (err, result) => {
        if (err) throw err;
        if (result.length == 0) {
            connexion.query("INSERT INTO `brouillons` (`titre`,`content`,`filtres`) VALUES ('"+req.body.titre+"','"+req.body.content+"','"+req.body.filtres+"')", (err, result) => {
                if (err) throw err;
            });        
        }
        else {
            connexion.query("UPDATE `brouillons` SET `titre`='"+req.body.titre+"',`content`='"+req.body.content+"',`filtres`='"+req.body.filtres+"' WHERE titre='"+req.body.ancienTitre+"'", (err, result) => {
                if (err) throw err;
            });        
        }
    });
});
App.post('/POSTdeleteBrouillon', (req, res) => {
    connexion.query("DELETE FROM `brouillons` WHERE ID='"+req.body.ID+"'", (err, result) => {
        if (err) throw err;
    });
});
App.post('/POSTconnexion', (req, res) => {
    connexion.query("SELECT password FROM `users` WHERE identifiant='"+req.body.identifiant+"'", (err, result) => {
        if (err) throw err;
        res.send(result[0])
    });
});


App.listen(5000, () => {
    console.log('Server is running on port 5000');
})