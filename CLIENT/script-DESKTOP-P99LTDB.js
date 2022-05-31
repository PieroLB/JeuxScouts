window.onload = function(){
    fetch('GetJeux.json').then(resp => resp.json()).then(resp => {
        console.log(resp)
    });
    text.document.designMode = 'on';
    text.document.body.style.fontFamily = "Arial";
    document.getElementById('select-fontFamily').selectedIndex = "Arial";
    text.document.body.style.fontSize = "11";
    document.getElementById('input-fontSize').value = '11';
    text.document.body.style.color = "black";
    document.getElementById('input-fontColor').value = 'black';
}
var activeMain = true;

function imageAppear() {
    document.getElementById('input-file').value = null;
    document.getElementById('input-link').value = "";
    document.getElementById('div-image').style.display = 'inline-block';
    document.getElementById('div-main').style.filter = "blur(2px)";
    text.document.designMode = 'off';
    activeMain = false;
}

function imageDisappear() {
    document.getElementById('div-image').style.display = 'none';
    document.getElementById('div-main').style.filter = "blur(0px)";
    text.document.designMode = 'on';
    activeMain = true;
}

function imageGenerate() {
    if (document.getElementById('input-file').value != "" && document.getElementById('input-link').value != "") {
        alert("Il faut remplir qu'une seule option !");
    }
    else if (document.getElementById('input-file').value != "") {
        // Problème : il faut le path comlpet de l'image pour la charger dans le iframe
        text.document.designMode = 'on';
        text.document.execCommand('insertImage', false, document.getElementById('input-file').files[0].name)
        imageDisappear();
    }
    else if (document.getElementById('input-link').value != "") {
        text.document.designMode = 'on';
        text.document.execCommand('insertImage', false, document.getElementById('input-link').value);
        imageDisappear();
    }
}

function valider(titre, content) {
    var result = "";
    let n = -1;
    for (l of content) {
        n ++;
        if (l == "\"") {
            console.log(n)
            result.push("\'")
        }
        else {
            result.push(l);
        }
    }
    console.log(result)
    // if (titre != "" && text.document.body.textContent != "") {
    //     fetch('/post', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type':'application/json'
    //         },
    //         body: JSON.stringify({titre:titre, content:"\""+content+"\"", filtres:""})
    //     });    
    // }
    // else {
    //     alert("Vous devez remplir avant de valider.")
    // }
}