//////////////////A FAIRE//////////////////
//   -  Faire des boutons retour
//   - Régler le porblème des saves des filtres
//   - Ajouter la liste des menus et l'éditeur de menu
//   - Configurer le bouton 'Se connecter' (connexion pas obligatoire pour regarder les jeux et menus mais connexion obligatoire pour créer un jeu ou un menu)
//   - Réorganiser les scripts
///////////////////////////////////////////

window.onload = function(){
    jeuText.document.designMode = 'on';
    jeuText.document.body.style.fontFamily = "Arial";
    document.getElementById('select-fontFamily').selectedIndex = "Arial";
    jeuText.document.body.style.fontSize = "11";
    document.getElementById('input-fontSize').value = '11';
    jeuText.document.body.style.color = "black";
    document.getElementById('input-fontColor').value = 'black';
}

function jeuAfficherJeux(){
    document.getElementById('div-jeux').innerHTML = "<br>";
    fetch('GETjeux').then(resp => resp.json()).then(resp => {
        for (let jeu of resp) {
            document.getElementById('div-jeux').innerHTML += "<div id='div-jeu-"+jeu.ID+"' onclick='jeuAfficherJeu("+JSON.stringify(jeu)+")' style='background-color: white; border: solid 1px white; border-radius: 10px; padding: 10px; display: inline-block'><h1>"+jeu.titre+"</h1><br></div><br><br>";
        }
        if (resp.length == 0) {
            document.getElementById('div-jeux').innerHTML += "<br><label style='color: white;'>Il n'y  a aucun jeu publié</label>"
        }
    });
    document.getElementById('div-infos').style.display = 'none';
    document.getElementById('div-jeux').style.display = '';
    document.getElementById('div-editorJeux').style.display = 'none';
    document.getElementById('div-jeu').style.display = 'none';
    document.getElementById('div-editorJeu').style.display = 'none';
}
var activeMain = true;

function imageAppear() {
    document.getElementById('input-file').value = null;
    document.getElementById('input-link').value = "";
    document.getElementById('div-image').style.display = 'inline-block';
    document.getElementById('div-main').style.filter = "blur(2px)";
    jeuText.document.designMode = 'off';
    activeMain = false;
}

function imageDisappear() {
    document.getElementById('div-image').style.display = 'none';
    document.getElementById('div-main').style.filter = "blur(0px)";
    jeuText.document.designMode = 'on';
    activeMain = true;
}

function imageGenerate() {
    if (document.getElementById('input-file').value != "" && document.getElementById('input-link').value != "") {
        alert("Il faut remplir qu'une seule option !");
    }
    else if (document.getElementById('input-file').value != "") {
        // Problème : il faut le path comlpet de l'image pour la charger dans le iframe
        jeuText.document.designMode = 'on';
        jeuText.document.execCommand('insertImage', false, document.getElementById('input-file').files[0].name)
        imaeDisappear();
    }
    else if (document.getElementById('input-link').value != "") {
        jeuText.document.designMode = 'on';
        jeuText.document.execCommand('insertImage', false, document.getElementById('input-link').value);
        imageDisappear();
    }
}

var listeFiltres = [];
function jeuAjouterFiltre(filtre) {
    pass = true;
    for (let f of listeFiltres) {
        if (f == filtre) {
            alert("Ce filtre a déjà été ajouté.")
            pass = false;
            break
        }
    }
    if (pass == true) {
        listeFiltres.push(filtre)
        document.getElementById('div-jeuFiltres').innerHTML += '<div style=\'display: inline-block; color: #00395C; background-color: white; border: solid 1px white; border-radius: 5px; padding: 2px\'>'+filtre+'</div>';
    }
}

function jeuEditorJeux() {
    document.getElementById('div-editorJeux').innerHTML = "<br><button onclick=\"document.getElementById('div-editorJeux').style.display = 'none'; document.getElementById('div-editorJeu').style.display = '';\">Créer un nouveau jeu</button><br><br><h3 style='color :white'>Vos brouillons : </h3><br>";
    fetch('GETbrouillons').then(resp => resp.json()).then(resp => {
        for (let brouillon of resp) {
            document.getElementById('div-editorJeux').innerHTML += "<div id='div-brouillon-"+brouillon.ID+"' onmouseover=\"document.getElementById('img-delete-"+brouillon.ID+"').style.display = ''\" onmouseout=\"document.getElementById('img-delete-"+brouillon.ID+"').style.display = 'none'\" onclick='jeuAfficherBrouillon("+JSON.stringify(brouillon)+")' style='background-color: white; border: solid 1px white; border-radius: 10px; padding: 10px; display: inline-block'><label style='font-size: larger'>"+brouillon.titre+"</label><img id='img-delete-"+brouillon.ID+"' src='./assets/delete.png' height='20' style='display: none; margin-left: 5px;' onclick='jeuDeleteBrouillon("+brouillon.ID+")'></div><br><br>";
        }
    });
    document.getElementById('div-jeux').style.display = 'none';
    document.getElementById('div-editorJeux').style.display = '';
    document.getElementById('div-infos').style.display = 'none';
}

function jeuDeleteBrouillon(ID) {
    if (confirm('Voulez-vous vraiment supprimer ce brouillon ?')) {
        fetch('POSTdeleteBrouillon', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({ID:ID})
        })
        alert('Votre brouillon a été suprimé !');
    }
    window.open('/', '_self')    
}

function jeuPublier(titre, content) {
    if (titre != "" && jeuText.document.body.textContent != "") {
        if (confirm('Voulez-vous vraiment publier votre jeu ?')) {
            fetch('/POSTjeu', {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({titre:titre, content:"\""+JSON.stringify(content)+"\"", filtres:""})
            });
            alert('Votre jeu a été publié !')
            listeFiltres = [];
            window.open('/', '_self')   
        }
    }
    else {
        alert("Vous devez remplir avant de valider.")
    }
}

function jeuBrouillon(titre, content) {
    if (titre != "" && jeuText.document.body.textContent != "") {
        fetch('/POSTbrouillon', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({ancienTitre:ancienBrouillon, titre:titre, content:"\""+JSON.stringify(content)+"\"", filtres:""})
        });
        alert('Votre brouillon a été enregistré !')
        // document.getElementById('div-editorJeu').style.display = 'none';
        // document.getElementById('div-jeux').style.display = '';
        ancienBrouillon = "";
        listeFiltres = [];
        window.open('/', '_self')
    }
    else {
        alert("Vous devez remplir avant de valider.")
    }
}

var ancienBrouillon = "";
function jeuAfficherBrouillon(brouillon) {
    result = "Aucun filtre"
    for (let filtre of brouillon.filtres) {
        result += "<div style=\'display: inline-block; color: #00395C; background-color: white; border: solid 1px white; border-radius: 5px; padding: 2px\'>"+filtre+"</div>"
    }
    ancienBrouillon = brouillon.titre;
    document.getElementById('input-jeuTitre').value = brouillon.titre;
    jeuText.document.body.outerHTML = brouillon.content.substring(2,brouillon.content.length-2);
    document.getElementById('div-editorJeux').style.display = 'none';
    document.getElementById('div-editorJeu').style.display = '';
}

function jeuAfficherJeu(jeu) {
    console.log(jeu.filtres)
    result = "Aucun filtre"
    for (let filtre of jeu.filtres) {
        result += "<div style=\'display: inline-block; color: #00395C; background-color: white; border: solid 1px white; border-radius: 5px; padding: 2px\'>"+filtre+"</div>"
    }
    document.getElementById('div-jeu').innerHTML = "<h1>"+jeu.titre+"</h1>Filtre(s) : "+result+"<br><br><iframe name='lol' style='background-color: white;'></iframe>";
    lol.document.body.outerHTML = jeu.content.substring(1,jeu.content.length-1);
    document.getElementById('div-jeux').style.display = 'none';
    document.getElementById('div-jeu').style.display = '';
}

function connexion(identifiant, password) {
    if (identifiant != "" && password != "") {
        fetch('POSTconnexion', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({identifiant:identifiant,password:password})
        }).then(resp => resp.json()).then(resp => {
            if (resp.password == password) {
                alert('Connexion réussie !')
                window.open('/', '_self')
            }
            else {
                alert("Votre mot de passe n'est pas correct.")
            }
        })
    }
    else {
        alert('Vous devez remplir obligatoirement les 2 champs.')
    }
}