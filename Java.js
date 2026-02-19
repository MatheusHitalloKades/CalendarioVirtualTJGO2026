var paginas = [
    "img/pagina1.png",
    "img/pagina2.png",
    "img/pagina3.png",
    "img/pagina4.png",
    "img/pagina5.png",
    "img/pagina6.png",
    "img/pagina7.png",
    "img/pagina8.png",
    "img/pagina9.png",
    "img/pagina10.png",
    "img/pagina11.png",
    "img/pagina12.png",
    "img/pagina13.png",
    "img/pagina14.png"
];

var paginaAtual = 1;
var total       = paginas.length;
var animando    = false;

function mostrarPagina(num, direcao) {
    if (animando) return;
    if (num < 1 || num > total) return;

    var img = document.getElementById("paginaImg");

    if (num === paginaAtual) {
        atualizarUI();
        return;
    }

    animando = true;

    var classeEntrada = direcao === "proximo" ? "entrar-direita" : "entrar-esquerda";
    var classeSaida   = direcao === "proximo" ? "sair-esquerda"  : "sair-direita";

    img.classList.add(classeSaida);

    setTimeout(function () {
        paginaAtual = num;
        img.src = paginas[paginaAtual - 1];
        img.classList.remove(classeSaida);
        img.classList.add(classeEntrada);

        setTimeout(function () {
            img.classList.remove(classeEntrada);
            animando = false;
            atualizarUI();
        }, 350);
    }, 300);
}

function atualizarUI() {
    document.getElementById("paginaAtualSpan").textContent = paginaAtual;
    document.getElementById("totalPaginasSpan").textContent = total;

    document.getElementById("btnAnterior").disabled = paginaAtual === 1;
    document.getElementById("btnProximo").disabled  = paginaAtual === total;

    var botoes = document.querySelectorAll(".mes");
    botoes.forEach(function (b) { b.classList.remove("ativo"); });
    var indice = paginaAtual - 3;
    if (indice >= 0 && indice < 12) {
        botoes[indice].classList.add("ativo");
        var container = document.getElementById("mesesContainer");
        var botaoAtivo = botoes[indice];
        container.scrollTo({
            left: botaoAtivo.offsetLeft - (container.offsetWidth / 2) + (botaoAtivo.offsetWidth / 2),
            behavior: "smooth"
        });
    }
}

function irParaMes(num) {
    var dir = num > paginaAtual ? "proximo" : "anterior";
    mostrarPagina(num, dir);
}

function proximaPagina() {
    mostrarPagina(paginaAtual + 1, "proximo");
}

function paginaAnterior() {
    mostrarPagina(paginaAtual - 1, "anterior");
}

document.addEventListener("DOMContentLoaded", function () {
    var img = document.getElementById("paginaImg");
    img.src = paginas[0];
    atualizarUI();

    document.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight" || e.key === "ArrowDown") proximaPagina();
        if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   paginaAnterior();
    });

    var touchStartX = 0;
    img.addEventListener("touchstart", function (e) {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });
    img.addEventListener("touchend", function (e) {
        var diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) {
            if (diff > 0) proximaPagina();
            else paginaAnterior();
        }
    }, { passive: true });

    document.querySelectorAll(".mes, .controles button").forEach(function (el) {
        function mover(x, y) {
            var rect = el.getBoundingClientRect();
            el.style.setProperty("--x", ((x - rect.left) / rect.width  * 100) + "%");
            el.style.setProperty("--y", ((y - rect.top)  / rect.height * 100) + "%");
        }
        el.addEventListener("mousemove",  function (e) { mover(e.clientX, e.clientY); });
        el.addEventListener("touchmove",  function (e) { if (e.touches[0]) mover(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
        el.addEventListener("touchstart", function (e) { if (e.touches[0]) mover(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
    });
});
