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

/* ------------------------------------------------
   MODAL
   ------------------------------------------------ */

function abrirModal(mensagem) {
    var modal = document.getElementById("modal-aviso");
    document.getElementById("modal-mensagem").textContent = mensagem;
    modal.setAttribute("aria-hidden", "false");
}

function fecharModal() {
    document.getElementById("modal-aviso").setAttribute("aria-hidden", "true");
}

/* ------------------------------------------------
   NAVEGAÇÃO
   ------------------------------------------------ */

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

function isMobileTablet() {
    return Math.max(window.innerWidth, window.innerHeight) <= 1023;
}

function isPortrait() {
    return window.innerHeight > window.innerWidth;
}

function ajustarBotoesLaterais() {
    if (!isMobileTablet()) return;
    var img = document.getElementById("paginaImg");
    var wrapper = document.querySelector(".book-wrapper");
    if (!img || !wrapper) return;
    var imgRect     = img.getBoundingClientRect();
    var wrapperRect = wrapper.getBoundingClientRect();
    var distLeft  = Math.max(imgRect.left  - wrapperRect.left  + 50, 50);
    var distRight = Math.max(wrapperRect.right - imgRect.right + 50, 50);
    wrapper.style.setProperty("--btn-lateral-left",  distLeft  + "px");
    wrapper.style.setProperty("--btn-lateral-right", distRight + "px");
}

function ajustarOrientacao() {
    var w = document.getElementById("cal-wrapper");
    if (isMobileTablet() && isPortrait()) {
        w.style.width           = "100vh";
        w.style.height          = "100vw";
        w.style.top             = "50%";
        w.style.left            = "50%";
        w.style.translate       = "-50% -50%";
        w.style.transform       = "rotate(90deg)";
        w.style.transformOrigin = "center";
    } else {
        w.style.width           = "100vw";
        w.style.height          = "100vh";
        w.style.top             = "0";
        w.style.left            = "0";
        w.style.translate       = "";
        w.style.transform       = "rotate(0deg)";
        w.style.transformOrigin = "center";
    }
}

function atualizarUI() {
    document.getElementById("paginaAtualSpan").textContent  = paginaAtual;
    document.getElementById("totalPaginasSpan").textContent = total;
    document.getElementById("paginaAtualSpan2").textContent  = paginaAtual;
    document.getElementById("totalPaginasSpan2").textContent = total;

    var atPrimeira = paginaAtual === 1;
    var atUltima   = paginaAtual === total;

    document.getElementById("btnAnterior").disabled        = atPrimeira;
    document.getElementById("btnProximo").disabled         = atUltima;
    document.getElementById("btnLateral-anterior").disabled = atPrimeira;
    document.getElementById("btnLateral-proximo").disabled  = atUltima;

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

/* ------------------------------------------------
   INIT
   ------------------------------------------------ */

document.addEventListener("DOMContentLoaded", function () {
    ajustarOrientacao();
    ajustarBotoesLaterais();
    window.addEventListener("resize", function () {
        ajustarOrientacao();
        ajustarBotoesLaterais();
    });
    window.addEventListener("orientationchange", function () {
        setTimeout(function () {
            ajustarOrientacao();
            ajustarBotoesLaterais();
        }, 80);
    });

    if (isMobileTablet() && isPortrait()) {
        abrirModal("Para uma melhor experiência, mantenha o bloqueio de rotação do seu dispositivo ativado.");
    }

    var img = document.getElementById("paginaImg");
    img.addEventListener("load", ajustarBotoesLaterais);
    img.src = paginas[0];
    atualizarUI();

    document.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight" || e.key === "ArrowDown") proximaPagina();
        if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   paginaAnterior();
    });

    var touchStartX = 0;
    var touchStartY = 0;
    var mouseStartX = 0;
    var mouseArrastando = false;

    img.addEventListener("touchstart", function (e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    img.addEventListener("touchend", function (e) {
        var diffX = touchStartX - e.changedTouches[0].clientX;
        var diffY = touchStartY - e.changedTouches[0].clientY;
        if (isMobileTablet() && isPortrait()) {
            if (Math.abs(diffY) > 40) {
                if (diffY > 0) proximaPagina();
                else paginaAnterior();
            }
        } else {
            if (Math.abs(diffX) > 40) {
                if (diffX > 0) proximaPagina();
                else paginaAnterior();
            }
        }
    }, { passive: true });

    img.addEventListener("mousedown", function (e) {
        mouseStartX = e.clientX;
        mouseArrastando = true;
        e.preventDefault();
    });
    img.addEventListener("mousemove", function (e) {
        if (mouseArrastando) e.preventDefault();
    });
    img.addEventListener("mouseup", function (e) {
        if (!mouseArrastando) return;
        mouseArrastando = false;
        var diff = mouseStartX - e.clientX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) proximaPagina();
            else paginaAnterior();
        }
    });
    img.addEventListener("mouseleave", function () {
        mouseArrastando = false;
    });

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
