
$("#StartButton").click(function () {
    $("#SplashScreen").hide();
    $("#monCanvas").show();
});



let canvas = document.getElementById('monCanvas');
let ctx = canvas.getContext("2d");




// La position initiale de la ball

let x = canvas.width / 2;
let y = canvas.height - 30;

// la direction de la ball
let dx = 2;
let dy = -2;
let rayonDeLaBall = 25;

let hauteurRaquette = 25;
let largeurRaquette = 200;
let pointDepartRaquetteAxeX = (canvas.width - largeurRaquette) / 2;

// initialisation des touches (les touches ne sont pas appuyées donc false)
let touchePresserDroite = false;
let touchePresserGauche = false;

// nombre de ligne et colonne brique, hauteur et largeur, espace entre les brique haut et gauche
let nombreDeligneDesBriques = 8;
let nombreColonneDesBriques = 17;
let largeurBrique = 130;
let hateurBrique = 35;
let paddingBrique = 5;
let espaceHautEntreBrique = 30;
let espaceGaucheEntreBrique = 30;

let score = 0;
let nombreDeVies = 3;







// cette boucle parcourt les lignes et les colonnes et créer de nouvelles briques.
let brique = [];
for (let colonne = 0; colonne < nombreColonneDesBriques; colonne++) {
    brique[colonne] = [];
    for (let ligne = 0; ligne < nombreDeligneDesBriques; ligne++) {
        brique[colonne][ligne] = { x: 0, y: 0, status: 1 };
    }
}
// Ecouteurs des évenements pour être informé les appuis sur les touches bas et haut.

document.addEventListener("keydown", toucheEnfoncer, false);
document.addEventListener("keyup", toucheRelacher, false);

// Quand on presse une touche du clavier, l'information est stockée dans une variable. La variable concernée est mis sur true.

// Si la touche droite est enfoncé, la variable touchePresserDroite est mise à true, et lorsqu'elle est relâchée, la variable touchePresserDroite est mise à false. Le même principe s'applique à la touche gauche et à la variable .
function toucheEnfoncer(e) {
    if (e.key == "ArrowRight" || e.key == "Right") {
        touchePresserDroite = true;
    }
    else if (e.key == "ArrowLeft" || e.key == "Left") {
        touchePresserGauche = true;
    }
}

function toucheRelacher(e) {
    if (e.key == "ArrowRight" || e.key == "Right") {
        touchePresserDroite = false;
    }
    else if (e.key == "ArrowLeft" || e.key == "Left") {
        touchePresserGauche = false;
    }
}

function detectionDeCollisionBallBrique() {
    //  parcours toute les brique et compare les coordonnées de chaque brique avec les coordonné de la ball 
    for (let colonne = 0; colonne < nombreColonneDesBriques; colonne++) {
        for (let ligne = 0; ligne < nombreDeligneDesBriques; ligne++) {
            // b est la variable qui stock l'objet brique dans la boucle de la detection collision
            let b = brique[colonne][ligne];
            if (b.status == 1) {
                if (x > b.x && x < b.x + largeurBrique && y > b.y && y < b.y + hateurBrique) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score == nombreDeligneDesBriques * nombreColonneDesBriques) {
                        window.open("./index3.html", "_self");
                    }
                }
            }
        }
    }
}



function dessinerBall() {
    ctx.beginPath();
    ctx.arc(x, y, rayonDeLaBall, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
}

function dessinerRaquette() {
    ctx.beginPath();
    ctx.rect(pointDepartRaquetteAxeX, canvas.height - hauteurRaquette, largeurRaquette, hauteurRaquette);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
}


function dessinerBriques() {
    for (let colonne = 0; colonne < nombreColonneDesBriques; colonne++) {
        for (let ligne = 0; ligne < nombreDeligneDesBriques; ligne++) {
            if (brique[colonne][ligne].status == 1) {

                let positionBriqueX = (colonne * (largeurBrique + paddingBrique)) + espaceGaucheEntreBrique;
                let positionBriqueY = (ligne * (hateurBrique + paddingBrique)) + espaceHautEntreBrique;

                brique[colonne][ligne].x = positionBriqueX;
                brique[colonne][ligne].y = positionBriqueY;
                ctx.beginPath();
                ctx.rect(positionBriqueX, positionBriqueY, largeurBrique, hateurBrique);
                ctx.fillStyle = "black";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}


function dessinerScore() {
    ctx.font = "40px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 33, 500);
}

function dessinerNombreDeVies() {
    ctx.font = "40px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Nombre de vies: " + nombreDeVies, canvas.width - 1460, 550);

}


function vousAveGagnez() {
    ctx.font = "40px Arial";
    ctx.fillStyle = "rgb(180, 148, 180)";
    ctx.fillText("Vous avez gangez  Bravooooo!", 500, 500);
}



function dessiner() {

    //Methode qui efface le canvas, la balle est dessinée sur une position donnée et les valeurs x et y sont mises à jour.
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dessinerBall();
    dessinerRaquette();
    detectionDeCollisionBallBrique();
    dessinerBriques();
    dessinerScore();
    dessinerNombreDeVies();


    x = x + dx;
    y = y + dy;


    // Lorsque la distance entre le centre de la balle et le bord du mur est exactement la même que le rayon de la balle, cela change la direction du mouvement.

    // Condition pour que la ball se deplace de gauche à droite et de droite à gauche (collison).
    if (x + dx > canvas.width - rayonDeLaBall || x + dx < rayonDeLaBall) {
        dx = -dx;
    }
    // Soustraire le rayon de la largeur d'un bord et l'ajouter à l'autre nous donne l'impression d'une détection de collision correcte.
    // Condition pour que la ball se deplace du bas vers le haut et du haut vers le bas (collision).
    if (y + dy < rayonDeLaBall) {
        dy = -dy;
    } else if (y + dy > canvas.height - rayonDeLaBall) {
        // faire rebondir la balle si elle touche la raquette, si non afficher alert("Vous avez perdu")
        if (x > pointDepartRaquetteAxeX && x < pointDepartRaquetteAxeX + largeurRaquette) {
            dy = -dy;

        }
        else {
            nombreDeVies--;
            if (!nombreDeVies) {
                window.open("./index.html", "_self");
            }
            else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 3;
                dy = -3;
                pointDepartRaquetteAxeX = (canvas.width - largeurRaquette) / 2;
            }

        }

    }
    // si la touche droite est enfoncé, la raquette se déplacera de sept pixels vers la droite.
    if (touchePresserDroite) {
        pointDepartRaquetteAxeX = pointDepartRaquetteAxeX + 7;
        if (pointDepartRaquetteAxeX + largeurRaquette > canvas.width) {
            pointDepartRaquetteAxeX = canvas.width - largeurRaquette;
        }
    }
    // Si la touche gauche est enfoncée, la raquette se déplacera de sept pixels vers la gauche
    else if (touchePresserGauche) {
        pointDepartRaquetteAxeX = pointDepartRaquetteAxeX - 7;
        if (pointDepartRaquetteAxeX < 0) {
            pointDepartRaquetteAxeX = 0;
        }
    }
    //requestAnimationFrame(dessiner);
}
// dessiner();
function demarerJeux() {
    interval = setInterval(dessiner, 10);
}

demarerJeux();






