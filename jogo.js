$().ready(function () {
    var canvas = $("#quadro")[0];
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext("2d");
    var colisao = 0;
    var contplayer = 0;
    var inimigos = [];
    var comecou = false;
    var contColuna = 0;
    var contLinha = 0;
    var corbarra;



    var bola = {

        "vx": gerarVx(),
        "vy": -10,
        "x": 5,
        "y": 10,
        "r": 10,
        "cor": "red",
        atualiza: function () {
            this.x += this.vx;
            this.y += this.vy;
        },
        desenharObjeto: function () {
            ctx.fillStyle = this.cor;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
            ctx.fill();

        }
    }
    var player1 = {
        "vx": 0,
        "vy": 0,
        "x": canvas.width / 2 - 200,
        "y": canvas.height - 5,
        "l": 200,
        "a": 50,
        "cor": "white",
        atualiza: function () {
            this.x += this.vx;

        },
        desenharObjeto: function () {
            ctx.fillStyle = this.cor;
            ctx.fillRect(this.x, this.y, this.l, this.a);

        }

    }


    function criainimigo(tempx, tempy, cor) {
        return {
            "x": tempx,
            "y": tempy,
            "l": 150,
            "a": 50,
            "cor": cor,
            desenharObjeto: function () {
                ctx.fillStyle = this.cor;
                ctx.fillRect(this.x, this.y, this.l, this.a);
            }
        }
    };
    function insereinimigo() {
        for (contLinha = 0; contLinha < 4; contLinha++) {
            for (contColuna = 0; contColuna < 12; contColuna++) {
                if (contLinha == 0) {
                    corbarra = "lightblue";
                } else if (contLinha == 1) {
                    corbarra = "blue";
                } else if (contLinha == 2) {
                    corbarra = "green";
                } else if (contLinha == 3) {
                    corbarra = "orange";
                }
                inimigos.push(criainimigo(160 * contColuna, contLinha * 60, corbarra));

            }
        }
    }
    insereinimigo();
    function gerarVx() {
        let vx;
        do {
            vx = Math.floor(Math.random() * 5) - 2; // de -2 a 2
        } while (vx === 0);
        return vx;
    }



    function detectaColisao(o1, o2) {
        var top1 = o1.y;
        var top2 = o2.y;
        var esq1 = o1.x;
        var esq2 = o2.x;
        var dir1 = o1.x + o1.l;
        var dir2 = o2.x + o2.r;
        var base1 = o1.y + o1.a;
        var base2 = o2.y + o2.r;
        return (base1 > top2 && dir1 > esq2 && base2 > top1 && dir2 > esq1);

    }

    function detectaRaqueta(o1, o2) {
        var top1 = o1.y;
        var top2 = o2.y;
        var esq1 = o1.x;
        var meio = o1.x + o1.l / 2;

        var dir2 = o2.x + o2.r;
        var base1 = o1.y + o1.a;
        var base2 = o2.y + o2.r;
        if (base1 > top2 && esq1 < dir2 && meio > dir2 && top1 < base2) {
            console.log("esquerda");
            colisao = 1;
        } else {
            colisao = 2;
            console.log("direita");
        }
    }
    function acompanhaBola(bola, player) {
        if (comecou === false) {
            bola.x = player.x + player.l / 2 - bola.r / 2;
            bola.y = player.y - bola.r;


        }
    }
    function desenharTela() {
        apagarTela();

        player1.atualiza();

        if (comecou === true) {
            bola.atualiza();
        }
        detectaLimitePlayer(player1);
        detectaLimiteObj(bola);

        if (detectaColisao(player1, bola)) {

            detectaRaqueta(player1, bola);
            if (colisao == 1) {
                bola.vx = -2
                bola.vy = -bola.vy;
            }
            else if (colisao == 2) {
                bola.vx = 2;
                bola.vy = -bola.vy;
            }

        }
        acompanhaBola(bola, player1);



        for (contLinha = 0; contLinha < 48; contLinha++) {

            if (detectaColisao(inimigos[contLinha], bola)) {
                bola.vy = -bola.vy;
                inimigos[contLinha].x = 100000;
                contplayer++;
                console.log(contplayer);
            }
            inimigos[contLinha].desenharObjeto();
        }

            if (contplayer == 48) {
                alert ("Você ganhou um bis e uma coxinha! Consulte o ADM");
                reseta();
            }

        player1.desenharObjeto();
        bola.desenharObjeto();

        requestAnimationFrame(desenharTela);
    }
    function apagarTela() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    function detectaLimitePlayer(obj) {
        if (obj.x < 0) {
            obj.x = 0;
            obj.vx = 0;
        }
        if (obj.x + obj.l > canvas.width) {
            obj.x = canvas.width - obj.l;
            obj.vx = 0;
        }
    }
    function detectaLimiteObj(obj) {
        if (obj.x - obj.r < 0) {
            obj.x = 0 + obj.r;
            obj.vx = -obj.vx;
        }
        if (obj.x + obj.r > canvas.width) {
            obj.x = canvas.width - obj.r;
            obj.vx = -obj.vx;
        }
        if (obj.y - obj.r < 0) {
            obj.y = 0 + obj.r;
            obj.vy = -obj.vy;
        }
        if (obj.y - obj.r > canvas.height) {
            comecou = false;
            alert("tu perdeu otario");
            reseta();
        }

        
        }

function reseta() {
                comecou = false;
                inimigos = [];
                insereinimigo();
                contplayer = 0;
            }
    
    desenharTela();
    $(window).keydown(function (event) {
        if (event.which == 65) { //cima
            player1.vx = -8;
        }
        if (event.which == 68) { //baixo
            player1.vx = 8;

        } if (event.which == 32) {
            comecou = true;

        }

    });

});






//A =  65, W = 87, S = 83, D = 68, espaço = 32;