async function pesquisar() {
    let consulta = document.querySelector("#pesquisarp").value
    const tipo_consulta = document.querySelector('input[name="type-consulta"]:checked').value
    document.querySelectorAll("main div").forEach(function (nome) {
        nome.innerHTML = ""
    })
    if (tipo_consulta == 'cnpj'){
        await consultar(removerPontuacaoCNPJ(consulta));
    } else {
        find(formatarCPF(consulta));
    }
}


async function consultar(cnpj) {

    const response = await fetch(`https://villela-pro-6405962cedab.herokuapp.com/api/consultar/${cnpj}/`)

    const data = await response.json();

    parcelamentos(data);
    nao_prev(cnpj,data[0]['NomeDoOptante']);
    /*prev(data["id"], token,data["cnpj"],data["razao"],);*/

}

async function parcelamentos(data) {
    try {
        console.log(data)
        if (data.length==0){
            const modalContent = `
               <dialog id="modal" class="modal">
                   <div class="modal-content">
                       <p>Nenhum Parcelamento Encontrado</p>
                       <button id="closeButton">Fechar</button>
                   </div>
               </dialog>
           `;

            // Adicionar o modal ao corpo do documento
            document.body.insertAdjacentHTML('beforeend', modalContent);

            // Obter referências aos elementos do modal
            const modal = document.getElementById('modal');
            const closeButton = modal.querySelector('.close');
            const closeDialogButton = modal.querySelector('#closeButton');

            // Função para fechar o modal
            function fecharModal() {
                // Fechar o modal
                modal.close();
                modal.remove()
            }

            // Adicionar evento de clique ao botão de fechar
            closeDialogButton.addEventListener('click', fecharModal);

            // Exibir o modal
            modal.showModal();

        }else{

            for (lista of data)  {

                if ((lista["SituacaoDoParcelamento"] === "DEFERIDO E CONSOLIDADO" || lista["SituacaoDoParcelamento"] === "AGUARDANDO DEFERIMENTO") && lista["QtdeDeParcelasConcedidas"] > 12) {

                    let prima;
                    let primo;
                    let cnpj = lista['CpfCnpjDoOptante']
                    let data_parcelamento = lista['MesAnoDoRequerimentoDoParcelamento']
                    let ModalidadeDoParcelamento = lista['TipoDeParcelamento']
                    let nome_empresa = lista['NomeDoOptante']
                    let qnt_parcelas = lista['QtdeDeParcelasConcedidas']
                    let valor_consolidado = lista['ValorConsolidado']
                    let valor_principal = lista['ValorDoPrincipal']
                    let valor_parcelas;
                    let qnt_parcelas_reducao;
                    if (lista['TipoDeParcelamento'].indexOf("TRANSACAO EXCEPCIONAL") !== -1){
                        if(lista['TipoDeParcelamento'].indexOf("DEBITOS PREVIDENCIARIOS") !== -1) {
                            valor_parcelas = (valor_consolidado - (valor_consolidado*0.04))/48
                            prima = console.log('valor_parcelas = (valor_consolidado - (valor_consolidado*0.04))/48')
                        } else {
                            valor_parcelas = (valor_consolidado - (valor_consolidado*0.04))/(qnt_parcelas-12)
                            prima = console.log('valor_parcelas = (valor_consolidado - (valor_consolidado*0.04))/(qnt_parcelas-12)')
                        }

                    } else if (lista['ModalidadeDoParcelamento'].indexOf("TRANSACAO EXTRAORDINARIA") !== -1){
                        if (lista['TipoDeParcelamento'].indexOf("PREVIDENCIARIO") !== -1) {
                            valor_parcelas = (valor_consolidado - (valor_consolidado*0.01))/48
                            prima = console.log('valor_parcelas = (valor_consolidado - (valor_consolidado*0.01))/48')
                        } else {
                            valor_parcelas = (valor_consolidado - (valor_consolidado*0.01))/(qnt_parcelas-12)
                            prima = console.log('valor_parcelas = (valor_consolidado - (valor_consolidado*0.01))/(qnt_parcelas-12)')
                        }
                    } else if (lista['TipoDeParcelamento'].indexOf("EDITAL") !== -1){
                        if (lista['TipoDeParcelamento'].indexOf("PREVIDENCIARIO") !== -1) {
                            if (lista['ModalidadeDoParcelamento'].indexOf("PEQUENO PORTE") !== -1) {
                                valor_parcelas = (valor_consolidado - (valor_consolidado*0.06))/48
                                prima = console.log('valor_parcelas = (valor_consolidado - (valor_consolidado*0.06))/48')
                            } else {
                                valor_parcelas = (valor_consolidado - (valor_consolidado*0.06))/54
                                prima = console.log('valor_parcelas = (valor_consolidado - (valor_consolidado*0.06))/54')
                            }
                        } else {
                            if (lista['ModalidadeDoParcelamento'].indexOf("PEQUENO PORTE") !== -1) {
                                valor_parcelas = (valor_consolidado - (valor_consolidado*0.06))/(qnt_parcelas-12)
                                prima = console.log('valor_parcelas = (valor_consolidado - (valor_consolidado*0.06))/(qnt_parcelas-12)')
                            } else {
                                valor_parcelas = (valor_consolidado - (valor_consolidado*0.06))/(qnt_parcelas-6)
                                prima = console.log('valor_parcelas = (valor_consolidado - (valor_consolidado*0.06))/(qnt_parcelas-6)')
                            }
                        }
                    } else if (lista['TipoDeParcelamento'].indexOf("CONVENCIONAL") !== -1 || lista['TipoDeParcelamento'].indexOf("PARCELAMENTO DA RECUPERACAO JUDICIAL") !== -1){
                        if (lista['TipoDeParcelamento'].indexOf("NAO PREVIDENCIARIA") !== -1) {
                            valor_parcelas = valor_consolidado/qnt_parcelas
                            prima = console.log('valor_parcelas = valor_principal/qnt_parcelas')
                        } else {
                            valor_parcelas = valor_consolidado/60
                            prima = console.log('valor_parcelas = valor_principal/60')
                        }
                    } else if (lista['TipoDeParcelamento'].indexOf("PERT") !== -1) {
                        if (lista['TipoDeParcelamento'].indexOf("DEBITOS PREVIDENCIARIOS") !== -1) {
                            valor_parcelas = (valor_consolidado - (valor_consolidado*0.15))/60
                            prima = console.log('valor_parcelas = (valor_consolidado - (valor_consolidado*0.15))/60')
                        } else {
                            valor_parcelas = (valor_consolidado - (valor_consolidado*0.15))/qnt_parcelas
                            prima = console.log('valor_parcelas = (valor_consolidado - (valor_consolidado*0.15))/qnt_parcelas')
                        }
                    }



                    if (lista["TipoDeParcelamento"].indexOf("PREVIDENCIARIO") !== -1 || lista["ModalidadeDoParcelamento"].indexOf("PREVIDENCIARIO") !== -1) {
                        qnt_parcelas_reducao = 60
                    } else {
                        qnt_parcelas_reducao = 145
                    }

                    inserirTabelas(cnpj, data_parcelamento, ModalidadeDoParcelamento, nome_empresa, qnt_parcelas, valor_consolidado, valor_principal, valor_parcelas, qnt_parcelas_reducao)


                }
                if(verificaSituacaoDoParcelamentoParcelamento(data)) {
                    const modalContent = `
                       <dialog id="modal" class="modal">
                           <div class="modal-content">
                               <p>Nenhum Parcelamento Ativo</p>
                               <button id="closeButton">Fechar</button>
                           </div>
                       </dialog>
                   `;

                    // Adicionar o modal ao corpo do documento
                    document.body.insertAdjacentHTML('beforeend', modalContent);

                    // Obter referências aos elementos do modal
                    const modal = document.getElementById('modal');
                    const closeButton = modal.querySelector('.close');
                    const closeDialogButton = modal.querySelector('#closeButton');

                    // Função para fechar o modal
                    function fecharModal() {
                        // Fechar o modal
                        modal.close();
                        modal.remove()
                    }

                    // Adicionar evento de clique ao botão de fechar
                    closeDialogButton.addEventListener('click', fecharModal);

                    // Exibir o modal
                    modal.showModal();
                }



            }
        }

    } catch (error) {
        console.error('Erro ao buscar os dados:', error);
    }

}

//parcelamentos();



function inserirTabelas(cnpj, data, ModalidadeDoParcelamento, nome_empresa, qnt_parcelas, valor_consolidado, valor_principal, valor_parcelas, qnt_parcelas_reducao) {
    let reducao = (valor_consolidado-valor_principal)*0.85
    let principal_assessoria = valor_consolidado-reducao
    let entrada = (principal_assessoria*0.06)
    let primeiro_ano =  entrada/12
    let parcelas_restantes = (principal_assessoria-entrada)/(qnt_parcelas_reducao-12)
    let fluxo_mensal = valor_parcelas - primeiro_ano
    let fluxo_anual = fluxo_mensal*12
    let html = `
    <table class="sem-villela" cellspacing="0" cellpadding="5">
        <thead>
            <tr>
                <th class="nome-empresa">${nome_empresa}</th>
                <th class="end cnpj">${formatarCNPJ(cnpj)}</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="tipo-parcelamento" colspan="2">${ModalidadeDoParcelamento}</td>
            </tr>
            <tr class="data-parcelamento">
                <td class="start">DATA PARCELAMENTO</td>
                <td class="end">${data}</td>
            </tr>
            <tr class="valor-consolidado">
                <td class="start">VALOR CONSOLIDADO</td>
                <td class="end">R$ ${formatarNumero(valor_consolidado)}</td>
            </tr>
            <tr class="valor-principal">
                <td class="start">VALOR PRINCIPAL</td>
                <td class="end">R$ ${formatarNumero(valor_principal)}</td>
            </tr>
            <tr class="num-parcelas">
                <td class="start">Nº PARCELAS TOTAL</td>
                <td class="end">${qnt_parcelas}</td>
            </tr>
            <tr class="valor-parcela">
                <td class="start">VALOR PARCELA APROX. APÓS O PEDÁGIO</td>
                <td class="end">R$ ${formatarNumero(valor_parcelas)}</td>
            </tr>
        </tbody>
    </table>

    <table class="com-villela" cellspacing="0" cellpadding="5">
        <thead>
            <tr>
                <th colspan="2">CONDIÇÕES APÓS ASSESSORIA DA VILLELA BRASIL BANK</th>
            </tr>
        </thead>
        <tbody>
            <tr class="valor-reducao">
                <td class="start">REDUÇÃO DE ATÉ</td>
                <td class="end">R$ ${formatarNumero(reducao)}</td>
            </tr>
            <tr class="valor-consolidado-villela">
                <td class="start">VALOR APROX. APÓS ASSESSORIA</td>
                <td class="end">R$ ${formatarNumero(principal_assessoria)}</td>
            </tr>
            <tr class="valor-parcela-villela">
                <td class="start">Nº PARCELAS ATÉ</td>
                <td class="end">${qnt_parcelas_reducao}</td>
            </tr>
            <tr class="primeiro-ano-villela">
                <td class="start">1ª a 12ª</td>
                <td class="end">R$ ${formatarNumero(primeiro_ano)}</td>
            </tr>
            <tr class="parcelas-restantes-villela">
                <td class="start">13ª a ${qnt_parcelas_reducao}ª</td>
                <td class="end">R$ ${formatarNumero(parcelas_restantes)}</td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <th>ECONOMIA MENSAL</th>
                <th class="end">R$ ${formatarNumero(fluxo_mensal)}</td>
            </tr>
            <tr>
                <th>ECONOMIA NO 1º ANO</th>
                <th class="end">R$ ${formatarNumero(fluxo_anual)}</td>
            </tr>
        </tfoot>
    </table>
    <img class="villela" src="https://villelaprime.github.io/PJ/fundo.png" alt="">
    `
    document.body.querySelector('#parcelamentos').innerHTML += html
}


function formatarNumero(numero) {
    // Converte o número para string e arredonda para duas casas decimais
    const numeroFormatado = parseFloat(numero).toFixed(2);

    // Divide em parte inteira e decimal
    const partes = numeroFormatado.split('.');
    const parteInteira = partes[0];
    const parteDecimal = partes[1];

    // Formata a parte inteira adicionando um ponto a cada três dígitos da direita para a esquerda
    const parteInteiraFormatada = parteInteira.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Retorna a parte inteira e decimal formatadas
    return parteInteiraFormatada + ',' + parteDecimal;
}

function formatarCNPJ(cnpj) {
    // Remove caracteres não numéricos
    const numerosCNPJ = cnpj.replace(/\D/g, '');

    // Formata o CNPJ com máscara
    return numerosCNPJ.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      '$1.$2.$3/$4-$5'
    );
}

function removerPontuacaoCNPJ(cnpj) {
    // Remove caracteres não numéricos
    return cnpj.replace(/\D/g, '');
}


function validaCNPJ() {
    if (document.querySelector('input[name="type-consulta"]:checked').value ==='cnpj'){
        let cnpj = document.querySelector("#pesquisarp").value;
        var b = [ 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 ]
        var c = String(cnpj).replace(/[^\d]/g, '')
    
        if(c.length !== 14)
            return false
    
        if(/0{14}/.test(c))
            return false
    
        for (var i = 0, n = 0; i < 12; n += c[i] * b[++i]);
        if(c[12] != (((n %= 11) < 2) ? 0 : 11 - n))
            return false
    
        for (var i = 0, n = 0; i <= 12; n += c[i] * b[i++]);
        if(c[13] != (((n %= 11) < 2) ? 0 : 11 - n))
            return false
    
        return true
    }else{
        return true 
    }
}

function red(){
    const input = document.querySelector("#pesquisarp")
    let span = document.querySelector("span")
    if (input.value.length > 0){
        if (validaCNPJ()){
            input.style.borderColor = 'green'
            span.style.visibility = "hidden"
        } else{
            input.style.borderColor = 'red'
            span.style.visibility = "visible"
        }
    }
}

document.addEventListener('DOMContentLoaded', async function(){
    const inputElement = document.getElementById('pesquisa');
    const formElement = document.getElementById('myForm');
    const input = document.querySelector("#pesquisarp")
    let errou = false
    const tipo_consulta = document.querySelector('input[name="type-consulta"]:checked').value





    document.getElementById("simular").addEventListener("click", function(event) {

        if (tipo_consulta=='cnpj'){
            event.preventDefault(); // Impede o envio padrão do formulário
            // Coloque aqui sua lógica de verificação
            if (validaCNPJ()) {
                pesquisar(); // Envia o formulário se a verificação passar
            } else {
                errou = true
                red()
            }
        }
    });
    inputElement.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' & tipo_consulta=='cnpj') {
            event.preventDefault(); // Impede o envio padrão do formulário
            if (validaCNPJ()) {
                pesquisar(); // Envia o formulário se a verificação passar
            } else {
                errou = true
                red()
            }
        }
    });
})

function converterStringParaFloat(valor) {
    // Remove "R$" e espaços
    let valorFormatado = valor.replace("R$", "").trim();
    
    // Substitui o ponto usado para milhar por nada
    valorFormatado = valorFormatado.replace(/\./g, "");
    
    // Substitui a vírgula por ponto para converter para número decimal
    valorFormatado = valorFormatado.replace(",", ".");
  
    // Converte para float
    return parseFloat(valorFormatado);
  }

function inserirTabelasdiv(cnpj, nome_empresa, valor_consolidado, qnt_parcelas_reducao,titulo) {
    let reducao = (valor_consolidado-(valor_consolidado*0.7))
    let principal_assessoria = valor_consolidado-reducao
    let entrada = (principal_assessoria*0.06)
    let primeiro_ano =  entrada/12
    let parcelas_restantes = (principal_assessoria-entrada)/(qnt_parcelas_reducao-12)
    let html = `
    <table class="sem-villela" cellspacing="0" cellpadding="5">
        <thead>
            <tr>
                <th class="nome-empresa">${nome_empresa}</th>
                <th class="end cnpj">${formatarCNPJ(cnpj)}</th>
            </tr>
        </thead>
        <tbody>
            <tr class="valor-consolidado">
                <td class="start">${titulo}</td>
                <td class="end">R$ ${formatarNumero(valor_consolidado)}</td>
            </tr>
        </tbody>
    </table>

    <table class="com-villela" cellspacing="0" cellpadding="5">
        <thead>
            <tr>
                <th colspan="2">CONDIÇÕES APÓS ASSESSORIA DA VILLELA BRASIL BANK</th>
            </tr>
        </thead>
        <tbody>
            <tr class="valor-reducao">
                <td class="start">REDUÇÃO DE ATÉ</td>
                <td class="end">R$ ${formatarNumero(reducao)}</td>
            </tr>
            <tr class="valor-consolidado-villela">
                <td class="start">VALOR APROX. APÓS ASSESSORIA</td>
                <td class="end">R$ ${formatarNumero(principal_assessoria)}</td>
            </tr>
            <tr class="valor-parcela-villela">
                <td class="start">Nº PARCELAS ATÉ</td>
                <td class="end">${qnt_parcelas_reducao}</td>
            </tr>
            <tr class="primeiro-ano-villela">
                <td class="start">1ª a 12ª</td>
                <td class="end">R$ ${formatarNumero(primeiro_ano)}</td>
            </tr>
            <tr class="parcelas-restantes-villela">
                <td class="start">13ª a ${qnt_parcelas_reducao}ª</td>
                <td class="end">R$ ${formatarNumero(parcelas_restantes)}</td>
            </tr>
        </tbody>
    </table>
    <img src="fundo.png" alt="">
    `
    document.body.querySelector('#dividas').innerHTML += html
}

async function prev(id,token,cnpj,nome_empresa){
    const saida = await fetch(`https://back-ecac.aceleradorvillela.com/api/leaddetalhes/${id}/previdenciario`, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'Authorization': `Bearer ${token}`,
        'Connection': 'keep-alive',
        'Origin': 'https://portal.aceleradorvillela.com',
        'Referer': 'https://portal.aceleradorvillela.com/',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"'
      }
    });
    const retornar =  await saida.json()
    if (retornar.valorTotal > 0){
        inserirTabelasdiv(cnpj, nome_empresa, retornar.valorTotal, 145,"DIVIDA ATIVA - PREVIDENCIARIOS")
    }
}

async function nao_prev(cnpj,nome_empresa){
    const saida = await fetch(`https://villela-pro-6405962cedab.herokuapp.com/api/consultadiv/${cnpj}/`);
    const retornar =  await saida.json()

    if (converterStringParaFloat(retornar.divida) > 0){
        inserirTabelasdiv(cnpj, nome_empresa, converterStringParaFloat(retornar.divida), 60,"DIVIDA ATIVA")
    }
}


function verificaSituacaoDoParcelamentoParcelamento(listaDeDicionarios){
    for (i of listaDeDicionarios){
        if ((i.SituacaoDoParcelamento === "DEFERIDO E CONSOLIDADO")||(i.SituacaoDoParcelamento === "AGUARDANDO DEFERIMENTO")){
            return false
            break
        }
    }
    return true
}


document.addEventListener('DOMContentLoaded', async function() {
    const documentoInput = document.querySelector("#pesquisarp");
    const tipoConsultaRadios = document.querySelectorAll('input[name="type-consulta"]');
    formatarDocumento()
    documentoInput.addEventListener('input', formatarDocumento);
    tipoConsultaRadios.forEach(radio=>{
        radio.addEventListener('change', formatarDocumento);
    }
    );
    function formatarDocumento() {
        let documento = documentoInput.value.replace(/\D/g, '');
        // Remove todos os caracteres que não são dígitos
        const tipoConsulta = document.querySelector('input[name="type-consulta"]:checked').value;
        if (tipoConsulta === 'cpf') {
            if (documento.length > 3) {
                // Adiciona o primeiro ponto
                documento = documento.substring(0, 3) + '.' + documento.substring(3);
            }
            if (documento.length > 7) {
                // Adiciona o segundo ponto
                documento = documento.substring(0, 7) + '.' + documento.substring(7);
            }
            if (documento.length > 11) {
                // Adiciona o traço e os dois últimos dígitos
                documento = documento.substring(0, 11) + '-' + documento.substring(11,13);
            }
            // Atualiza o placeholder
            document.querySelector("#pesquisarp").placeholder = "000.000.000-00";
        }else if (tipoConsulta === 'cnpj') {
            document.querySelector("#pesquisarp").placeholder = "000.000.00/0000-00"
            // Formata o CNPJ conforme o padrão XX.000.000/0000-XX
            if (documento.length > 2 && documento.length < 5) {
                documento = documento.substring(0, 2) + '.' + documento.substring(2);
            } else if (documento.length > 5 && documento.length < 8) {
                documento = documento.substring(0, 2) + '.' + documento.substring(2, 5) + '.' + documento.substring(5);
            } else if (documento.length > 8 && documento.length < 12) {
                documento = documento.substring(0, 2) + '.' + documento.substring(2, 5) + '.' + documento.substring(5, 8) + '/' + documento.substring(8);
            } else if (documento.length > 12) {
                documento = documento.substring(0, 2) + '.' + documento.substring(2, 5) + '.' + documento.substring(5, 8) + '/' + documento.substring(8, 12) + '-' + documento.substring(12);
            }
        }
        documentoInput.value = documento;
        // Define o valor formatado no campo de entrada
    }
});


// Pessoa Fisica

function formatarCPF(cpf) {
    // Remove caracteres não numéricos do CPF
    let cpfLimpo;
    if(cpf.slice(0,3) === "XXX"){
        return cpf
    } else{
        // Adiciona os Xs à frente do CPF
        cpfLimpo = cpf.replace(/\D/g, '')
        const cpfFormatado = 'XXX.' + cpfLimpo.slice(3, 6)+'.'+cpfLimpo.slice(6, 9) + '-XX';
        console.log(cpfFormatado)
        return cpfFormatado;
    }
}


function getAccessToken(forceRenew = false) {
  const loginUrl = 'https://realm.mongodb.com/api/client/v2.0/app/data-jqjrc/auth/providers/local-userpass/login';
  const credentials = {
      username: "weriquetiao@gmail.com",
      password: "admin123"
  };

  // Verifica se já temos um token armazenado e não estamos forçando a renovação
  if (!forceRenew && localStorage.getItem('accessToken')) {
      return Promise.resolve(localStorage.getItem('accessToken'));
  }

  // Obtem um novo token
  return fetch(loginUrl, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
  })
  .then(response => response.json())
  .then(data => {
      // Armazena o novo token
      localStorage.setItem('accessToken', data.access_token);
      return data.access_token;
  })
  .catch(error => {
      console.error('Falha ao obter o token de acesso', error);
      throw error;  // Re-throw the error to be handled by the caller
  });
}

function find(consulta) {
    const findOneUrl = 'https://sa-east-1.aws.data.mongodb-api.com/app/data-jqjrc/endpoint/data/v1/action/find';
    const requestData = {
        "collection": "par-pf",
            "database": "base-parcelamentos",
            "dataSource": "password",
            "filter": {
                "CPF": consulta,
            }
    };

    function attemptFind(accessToken) {
        return fetch(findOneUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(requestData)
        });
    }

    function handleResponse(response) {
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                // Token might be invalid or expired, try refreshing it
                return getAccessToken(true).then(attemptFind);
            } else {
                // Some other error, rethrow it to be handled by the final catch
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } else {
            return response.json();
        }
    }

    getAccessToken()
        .then(attemptFind)
        .then(handleResponse)
        .then(data => {
            parcelamentospf(data.documents)
            if(data.documents.length == 0){
                document.querySelector("#par").style.display = 'none'
            } else{
                document.querySelector("#par").style.display = 'block'
            }
        })
        .catch(error => {
            console.error('Failed to find', error);
        });
}

async function parcelamentospf(saida) {

    try {
        if(saida.length > 0){
            for (let i = 0; i < saida.length; i++) {
                const lista = saida[i];
        
                if ((lista["SITUACAO"] === "DEFERIDO E CONSOLIDADO" || lista["SITUACAO"] === "AGUARDANDO DEFERIMENTO") && lista["QNT_PARCELAS"] > 12) {
        
                    let prima;
                    let primo;
                    let cpf = lista['CPF']
                    let data_parcelamento = lista['DATA_REQUERIMENTO']
                    let MODALIDADE = lista['TIPO_PARCELAMENTO']
                    let nome_empresa = lista['NOME']
                    let qnt_parcelas = lista['QNT_PARCELAS']
                    let valor_consolidado =  parseFloat(lista['VALOR_CONSOLIDADO'].replace('.', '').replace(',','.').replace('R$ ',''));
                    let valor_principal = parseFloat(lista['VALOR_PINCIPAL'].replace('.', '').replace(',','.').replace('R$ ',''));
                    let valor_parcelas;
                    let qnt_parcelas_reducao;
                    if (lista['TIPO_PARCELAMENTO'].indexOf("TRANSACAO EXCEPCIONAL") !== -1){
                        if(lista['TIPO_PARCELAMENTO'].indexOf("DEBITOS PREVIDENCIARIOS") !== -1) {
                            valor_parcelas = (valor_consolidado - (valor_consolidado*0.04))/48
                            prima = console.log('valor_parcelas = (valor_consolidado - (valor_consolidado*0.04))/48')
                        } else {
                            valor_parcelas = (valor_consolidado - (valor_consolidado*0.04))/(qnt_parcelas-12)
                            prima = console.log('valor_parcelas = (valor_consolidado - (valor_consolidado*0.04))/(qnt_parcelas-12)')
                        }
                        
                    } else if (lista["MODALIDADE"].indexOf("TRANSACAO EXTRAORDINARIA") !== -1){
                        if (lista['TIPO_PARCELAMENTO'].indexOf("PREVIDENCIARIO") !== -1) {
                            valor_parcelas = (valor_consolidado - (valor_consolidado*0.01))/48
                            prima = console.log('valor_parcelas = (valor_consolidado - (valor_consolidado*0.01))/48')
                        } else {
                            valor_parcelas = (valor_consolidado - (valor_consolidado*0.01))/(qnt_parcelas-12)
                            prima = console.log('valor_parcelas = (valor_consolidado - (valor_consolidado*0.01))/(qnt_parcelas-12)')
                        }
                    } else if (lista['TIPO_PARCELAMENTO'].indexOf("EDITAL") !== -1){
                        if (lista['TIPO_PARCELAMENTO'].indexOf("PREVIDENCIARIO") !== -1) {
                            if (lista["MODALIDADE"].indexOf("PEQUENO PORTE") !== -1) {
                                valor_parcelas = (valor_consolidado - (valor_consolidado*0.06))/48
                                prima = console.log('valor_parcelas = (valor_consolidado - (valor_consolidado*0.06))/48')
                            } else {
                                valor_parcelas = (valor_consolidado - (valor_consolidado*0.06))/54
                                prima = console.log('valor_parcelas = (valor_consolidado - (valor_consolidado*0.06))/54')
                            }
                        } else {
                            if (lista["MODALIDADE"].indexOf("PEQUENO PORTE") !== -1) {
                                valor_parcelas = (valor_consolidado - (valor_consolidado*0.06))/(qnt_parcelas-12)
                                prima = console.log('valor_parcelas = (valor_consolidado - (valor_consolidado*0.06))/(qnt_parcelas-12)')
                            } else {
                                valor_parcelas = (valor_consolidado - (valor_consolidado*0.06))/(qnt_parcelas-6)
                                prima = console.log('valor_parcelas = (valor_consolidado - (valor_consolidado*0.06))/(qnt_parcelas-6)')
                            }
                        }
                    } else if (lista['TIPO_PARCELAMENTO'].indexOf("CONVENCIONAL") !== -1 || lista['TIPO_PARCELAMENTO'].indexOf("PARCELAMENTO DA RECUPERACAO JUDICIAL") !== -1){
                        if (lista['TIPO_PARCELAMENTO'].indexOf("NAO PREVIDENCIARIA") !== -1) {
                            valor_parcelas = valor_consolidado/qnt_parcelas
                            prima = console.log('valor_parcelas = valor_principal/qnt_parcelas')
                        } else {
                            valor_parcelas = valor_consolidado/60
                            prima = console.log('valor_parcelas = valor_principal/60')
                        }
                    } else if (lista['TIPO_PARCELAMENTO'].indexOf("PERT") !== -1) {
                        if (lista['TIPO_PARCELAMENTO'].indexOf("DEBITOS PREVIDENCIARIOS") !== -1) {
                            valor_parcelas = (valor_consolidado - (valor_consolidado*0.15))/60
                            prima = console.log('valor_parcelas = (valor_consolidado - (valor_consolidado*0.15))/60')
                        } else {
                            valor_parcelas = (valor_consolidado - (valor_consolidado*0.15))/qnt_parcelas
                            prima = console.log('valor_parcelas = (valor_consolidado - (valor_consolidado*0.15))/qnt_parcelas')
                        }
                    }
        
        
        
                    if (lista["TIPO_PARCELAMENTO"].indexOf("PREVIDENCIARIO") !== -1 || lista["MODALIDADE"].indexOf("PREVIDENCIARIO") !== -1) {
                        qnt_parcelas_reducao = 60
                    } else {
                        qnt_parcelas_reducao = 145
                    }
        
                    inserirTabelas(cpf, data_parcelamento, MODALIDADE, nome_empresa, qnt_parcelas, valor_consolidado, valor_principal, valor_parcelas, qnt_parcelas_reducao)
                    document.querySelector('.cnpj').innerText = cpf
                }
            
                
                
            }
        }else{
            const modalContent = `
                <dialog id="modal" class="modal">
                    <div class="modal-content">
                        <p>Nenhum Parcelamento Encontrado</p>
                        <button id="closeButton">Fechar</button>
                    </div>
                </dialog>
            `;

            // Adicionar o modal ao corpo do documento
            document.body.insertAdjacentHTML('beforeend', modalContent);

            // Obter referências aos elementos do modal
            const modal = document.getElementById('modal');
            const closeButton = modal.querySelector('.close');
            const closeDialogButton = modal.querySelector('#closeButton');

            // Função para fechar o modal
            function fecharModal() {
                // Fechar o modal
                modal.close();
                modal.remove()
            }

            // Adicionar evento de clique ao botão de fechar
            closeDialogButton.addEventListener('click', fecharModal);

            // Exibir o modal
            modal.showModal();
        }
    } catch (erro) {
        console.error('Erro ao filtrar por CPF:', erro);
        throw erro; // Rejogue o erro para que seja capturado externamente, se necessário
    }
    
}
