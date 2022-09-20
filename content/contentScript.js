// display lobby existe
var displayLobbyExists = false
// display roleta existe
var displayRoletaExists = false
//variaveis de configuração
var altosBaixosRep = 5
var ficha = 1
var stopGain = 5
var stopLoss = 1
var gale = 1
//contagem de acertos e erros
var contagemAcertos = 0
var contagemErros = 0
//altos e baixos da roleta
var numerosBaixos = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18']
var numerosAltos = ['19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36']

//variavel que indica inicio de aposta
var apostouAltosBaixos = false

//variavel de apostas automaticas
var ciclo = 0
var fichaPreparada = 0
var apostaFeita = 0
var sequenciaAtual = []
var cicloGale = 0

function inserirTextoDisplay(texto, tela) {
    if (tela == 1) {
        var textoDisplay = document.getElementById("displaybotlobby")
        textoDisplay.textContent = `${texto}`
    } else if (tela == 2) {
        var textoDisplay = document.getElementById("displaybotroleta")
        textoDisplay.textContent = `${texto}`
    }

}

function analisandoEstrategias() {
    // pegar a quantidade de roletas
    qtdRoletas = document.getElementsByClassName('lobby-tables__item').length
    //valida lobby
    if (qtdRoletas > 1) {
        apostouDuzia = false
        apostouColuna = false

        // inserir display no lobby
        if (!displayLobbyExists) {
            if (document.querySelector('.lobby-header__filterqDmLZJ0RC7XlyyjENEqe')) {
                painelLobby = document.querySelector('.lobby-header__filterqDmLZJ0RC7XlyyjENEqe')
            } else if (document.querySelector('.lobby__filter')) {
                painelLobby = document.querySelector('.lobby__filter')
            }
            painelLobby.insertAdjacentHTML('afterbegin', '<h1 id = "displaybotlobby" style="width: 90%;background-color: #56ef00;color: black;text-align: center; font-size: xx-large;font-weight: bolder;align-self: center;"></h1>')
            displayRoletaExists = false
            displayLobbyExists = true
        }

        inserirTextoDisplay(`Bot Auto - ${contagemAcertos} ACERTOS - ${contagemErros} ERROS - MONITORANDO`, 1)
        //listar as roletas do lobby
        var roletasLobby = listarRoletasLobby(qtdRoletas)
        //incrementr as roletas para buscar confirmação de estrategia
        for (let i = 0; i < roletasLobby.length; i++) {
            if (estrategiaAltosbaixos(roletasLobby[i].sequencia) == 1) {
                document.getElementsByClassName('lobby-table__game-logo')[i].click()
                break
            } else {
                inserirTextoDisplay(`Bot Auto - ${contagemAcertos} ACERTOS - ${contagemErros} ERROS - MONITORANDO`, 1)
            }
        }
    } else {
        var cargaRoleta = document.getElementsByClassName('table-info__nameWp_dByC6ZNXpXrcSPbRB').length
        if (cargaRoleta > 0) {
            //analisando apenas uma roleta
            prepararFicha()
            // inserir display no lobby
            if (!displayRoletaExists) {
                painelRoleta = document.querySelector('.account-panel');
                painelRoleta.insertAdjacentHTML('beforeend', '<span id = "displaybotroleta" style="margin: 10px;width: 90%;background-color: #000000;color: white;text-align: left;"></span>');
                displayRoletaExists = true
                displayLobbyExists = false
            }
            var nomeRoleta = document.getElementsByClassName('table-info__nameWp_dByC6ZNXpXrcSPbRB')[0].outerText
            //carregar roleta
            var roleta = carregarRoleta()

            if (JSON.stringify(sequenciaAtual) != JSON.stringify(roleta[0].sequencia) || apostaFeita == 0) {

                if (JSON.stringify(sequenciaAtual) != JSON.stringify(roleta[0].sequencia)) {
                    sequenciaAtual = roleta[0].sequencia
                    apostaFeita = 0
                }
                //buscar confirmação de estrategia

                var repeticaoAltosBaixos = estrategiaAltosBaixosSalaRoleta(roleta[0].sequencia)

                if (apostouAltosBaixos) {
                    if (repeticaoAltosBaixos > parseInt(altosBaixosRep) && repeticaoAltosBaixos <= (parseInt(altosBaixosRep) + parseInt(gale) + 1)) {
                        if (repeticaoAltosBaixos > parseInt(altosBaixosRep) + 1) {
                            if (numerosAltos.includes(roleta[0].sequencia[0])) {
                                inserirTextoDisplay(`GALE - NUMEROS BAIXOS`, 2)
                                if (document.getElementsByClassName('timer').length == 1) {
                                    apostaFeita = 1
                                    cicloGale++
                                    for (let i = 0; i < (2 * cicloGale); i++) {
                                        jogar('alto')
                                    }
                                }
                            } else if (numerosBaixos.includes(roleta[0].sequencia[0])) {
                                inserirTextoDisplay(`GALE - NUMEROS ALTOS`, 2)
                                if (document.getElementsByClassName('timer').length == 1) {
                                    apostaFeita = 1
                                    cicloGale++
                                    for (let i = 0; i < (2 * cicloGale); i++) {
                                        jogar('baixo')
                                    }
                                }
                            }
                        }
                    } else if (repeticaoAltosBaixos > (parseInt(altosBaixosRep) + parseInt(gale) + 1)) {
                        contagemErros++
                        apostouAltosBaixos = false
                        fichaPreparada = 0
                        apostaFeita = 0
                        cicloGale = 0
                        document.getElementsByClassName('close-button header__close-button')[0].click()
                    } else {
                        apostouAltosBaixos = false
                        contagemAcertos++
                        fichaPreparada = 0
                        apostaFeita = 0
                        cicloGale = 0
                        document.getElementsByClassName('close-button header__close-button')[0].click()
                    }
                } else if (repeticaoAltosBaixos > 1) {
                    if (repeticaoAltosBaixos == parseInt(altosBaixosRep)) {
                        inserirTextoDisplay(`ESTRATEGIA - ALTOS/BAIXOS - CONFIRMANDO`, 2)
                    } else if (repeticaoAltosBaixos > altosBaixosRep) {
                        if (repeticaoAltosBaixos <= (parseInt(altosBaixosRep) + parseInt(gale) + 1)) {

                            if (numerosAltos.includes(roleta[0].sequencia[0])) {
                                inserirTextoDisplay(`APOSTAR NUMEROS BAIXOS`, 2)
                                if (document.getElementsByClassName('timer').length == 1) {
                                    apostouAltosBaixos = true
                                    apostaFeita = 1
                                    jogar('alto')
                                }
                            } else if (numerosBaixos.includes(roleta[0].sequencia[0])) {
                                inserirTextoDisplay(`APOSTAR NUMEROS ALTOS`, 2)
                                if (document.getElementsByClassName('timer').length == 1) {
                                    apostouAltosBaixos = true
                                    apostaFeita = 1
                                    jogar('baixo')
                                }
                            }
                        } else if (repeticaoAltosBaixos > (parseInt(altosBaixosRep) + parseInt(gale) + 1)) {
                            fichaPreparada = 0
                            apostaFeita = 0
                            document.getElementsByClassName('close-button header__close-button')[0].click()
                        }
                    }
                } else {
                    fichaPreparada = 0
                    apostaFeita = 0
                    document.getElementsByClassName('close-button header__close-button')[0].click()
                }
            }


        }
    }

}

function listarRoletasLobby(qtd) {
    roletasLobby = []
    // preencher a lista de roletas 
    for (let i = 0; i < qtd; i++) {
        if (document.getElementsByClassName('lobby-tables__item')[i].getElementsByClassName('lobby-table__name-container').length == 1) {
            nomeRoleta = document.getElementsByClassName('lobby-tables__item')[i].getElementsByClassName('lobby-table__name-container')[0].outerText
        } else {
            nomeRoleta = ''
        }
        if (document.getElementsByClassName('lobby-tables__item')[i].getElementsByClassName('roulette-historyfOmuwAaXbwHRa3HTIjFP').length == 1) {
            sequenciaRoleta = document.getElementsByClassName('lobby-tables__item')[i].getElementsByClassName('roulette-historyfOmuwAaXbwHRa3HTIjFP')[0].outerText
        } else {
            sequenciaRoleta = []
        }

        if (sequenciaRoleta.length != 0) {
            //transformar texto em lista
            var listaSequenciaOld = sequenciaRoleta.split("\n")
            //tamanho da lista
            var sizesequencia = listaSequenciaOld.length
            //nova lista para receber a sequencia sem multiplicadores
            var listaSequenciaNew = []
            //retirar multiplicadores
            for (let i = 0; i < sizesequencia; i++) {
                if (listaSequenciaOld[i].charAt(0) != "x") {
                    listaSequenciaNew.push(listaSequenciaOld[i])
                }
            }

            roletasLobby.push({ nome: nomeRoleta, sequencia: listaSequenciaNew })
        } else {
            roletasLobby.push({ nome: nomeRoleta, sequencia: sequenciaRoleta })
        }

    }

    return roletasLobby

}

function prepararFicha() {
    // se tutorial estiver aberto
    if (document.getElementsByClassName('close-button game-tutorial__close-buttonvoI4pu9XqNQ2VHkfTWq7').length == 1) {
        document.getElementsByClassName('close-button game-tutorial__close-buttonvoI4pu9XqNQ2VHkfTWq7')[0].click()
    }
    //se ficha ainda n foi preparada
    if (fichaPreparada == 0 && document.getElementsByClassName('chip arrow-slider__element').length > 0) {
        document.getElementsByClassName('chip arrow-slider__element')[ficha].insertAdjacentHTML("afterbegin", "<div id='ficha'></div>")
        document.getElementById('ficha').click()
        fichaPreparada = 1
    }
    //abrir popup de aposta
    if (document.getElementsByClassName('roulette-statistics-info__row roulette-statistics-info__row_dozens-columns').length == 0) {
        document.getElementsByClassName('sidebar-buttons__item')[3].click()
    }

}

function carregarRoleta() {
    roleta = []
    // preencher a roleta 
    nomeRoleta = document.getElementsByClassName('table-info__nameWp_dByC6ZNXpXrcSPbRB')[0].outerText
    sequenciaRoleta = document.getElementsByClassName('roulette-historyfOmuwAaXbwHRa3HTIjFP')[0].outerText
    //transformar texto em lista
    var listaSequenciaOld = sequenciaRoleta.split("\n")
    //tamanho da lista
    var sizesequencia = listaSequenciaOld.length
    //nova lista para receber a sequencia sem multiplicadores
    var listaSequenciaNew = []
    //retirar multiplicadores
    for (let i = 0; i < sizesequencia; i++) {
        if (listaSequenciaOld[i].charAt(0) != "x") {
            listaSequenciaNew.push(listaSequenciaOld[i])
        }
    }

    roleta.push({ nome: nomeRoleta, sequencia: listaSequenciaNew })

    //retornar roleta
    return roleta

}

function estrategiaAltosbaixos(roleta) {
    // variaveis de repeticao
    repeticaoAlto = 0
    repeticaoBaixo = 0
    // inverter lista de sequencia da roleta
    roleta.reverse()
    // incrementa a repeticao 
    for (let i = 0; i < roleta.length; i++) {
        if (numerosAltos.includes(roleta[i])) {
            repeticaoAlto++
            repeticaoBaixo = 0
        } else if (numerosBaixos.includes(roleta[i])) {
            repeticaoAlto = 0
            repeticaoBaixo++
        } else {
            repeticaoAlto = 0
            repeticaoBaixo = 0
        }
    }
    // validar de houve repeticao
    if (parseInt(altosBaixosRep) == 0) {
        roleta.reverse()
        return 0
    } else if (repeticaoAlto == parseInt(altosBaixosRep)) {
        roleta.reverse()
        return 1
    } else if (repeticaoBaixo == parseInt(altosBaixosRep)) {
        roleta.reverse()
        return 1
    } else {
        roleta.reverse()
        return 0
    }
}

function estrategiaAltosBaixosSalaRoleta(roleta) {

    // variaveis de repeticao
    repeticaoAlto = 0
    repeticaoBaixo = 0
    // inverter lista de sequencia da roleta
    roleta.reverse()
    // incrementa a repeticao 
    for (let i = 0; i < roleta.length; i++) {
        if (apostouAltosBaixos && roleta[i] == '0') {
            repeticaoAlto++
            repeticaoBaixo++
        } else if (numerosAltos.includes(roleta[i])) {
            repeticaoAlto++
            repeticaoBaixo = 0
        } else if (numerosBaixos.includes(roleta[i])) {
            repeticaoAlto = 0
            repeticaoBaixo++
        } else {
            repeticaoAlto = 0
            repeticaoBaixo = 0
        }
    }
    // validar de houve repeticao
    if (parseInt(altosBaixosRep) == 0) {
        roleta.reverse()
        return 0
    } else if (repeticaoAlto >= parseInt(altosBaixosRep)) {
        roleta.reverse()
        return repeticaoAlto
    } else if (repeticaoBaixo >= parseInt(altosBaixosRep)) {
        roleta.reverse()
        return repeticaoBaixo
    } else {
        roleta.reverse()
        return 0
    }
}

function jogar(estrategia) {
    if (document.getElementsByClassName('timer').length == 1) {
        if (estrategia == 'alto') {
            document.getElementsByClassName('roulette-statistics-info__row roulette-statistics-info__row_even-odd-low-high')[0].getElementsByClassName('position-highlighter position-highlighter_hidden')[2].click()
        } else if (estrategia == 'baixo') {
            document.getElementsByClassName('roulette-statistics-info__row roulette-statistics-info__row_even-odd-low-high')[0].getElementsByClassName('position-highlighter position-highlighter_hidden')[3].click()
        }
    }
}

// Ciclo do bot
setInterval(() => {
    try {
        ciclo++
        if (stopGain == contagemAcertos || stopLoss == contagemErros) {
            //botão de erro de sessão
            if (document.getElementsByClassName('modal-footer-btn modal-footer-btn_resolve modal-footer-btn_full').length == 1) {
                document.getElementsByClassName('modal-footer-btn modal-footer-btn_resolve modal-footer-btn_full')[0].click()
            }
            if (document.getElementsByClassName('lobby-tables__item').length > 1) {
                if (!displayLobbyExists) {
                    if (document.querySelector('.lobby-header__filterqDmLZJ0RC7XlyyjENEqe')) {
                        painelLobby = document.querySelector('.lobby-header__filterqDmLZJ0RC7XlyyjENEqe')
                    } else if (document.querySelector('.lobby__filter')) {
                        painelLobby = document.querySelector('.lobby__filter')
                    }
                    painelLobby.insertAdjacentHTML('afterbegin', '<h1 id = "displaybotlobby" style="width: 90%;background-color: #56ef00;color: black;text-align: center; font-size: xx-large;font-weight: bolder;align-self: center;"></h1>')
                    displayRoletaExists = false
                    displayLobbyExists = true
                }
                inserirTextoDisplay(`Bot Auto- ${contagemAcertos} ACERTOS - ${contagemErros} ERROS`, 1)
            }
            if (ciclo > 200 && document.getElementsByClassName('lobby-tables__item').length > 1) {
                document.getElementsByClassName('lobby-table__game-logo')[14].click()
            }
            if (ciclo > 200 && document.getElementsByClassName('lobby-tables__item').length == 0) {
                document.getElementsByClassName('close-button header__close-button')[0].click()
                ciclo = 0
            }
        } else {
            //botão de erro de sessão
            if (document.getElementsByClassName('modal-footer-btn modal-footer-btn_resolve modal-footer-btn_full').length == 1) {
                document.getElementsByClassName('modal-footer-btn modal-footer-btn_resolve modal-footer-btn_full')[0].click()
            }

            if (ciclo > 200 && document.getElementsByClassName('lobby-tables__item').length > 1) {
                document.getElementsByClassName('lobby-table__game-logo')[14].click()
                ciclo = 0
            }
            //analisar estrategias
            analisandoEstrategias()
        }

    } catch (err) {
        console.log(err)
    }

}, 5000)
