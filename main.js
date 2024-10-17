function waitForElement(selector, callback) {
    const interval = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
            clearInterval(interval); // Para a verificação
            callback(element); // Executa o código passando o elemento
        }
    }, 100); // Verifica a cada 100ms
}

// Exemplo de uso
waitForElement("#consulta", (element) => {
    console.log('Elemento encontrado:', element);
    (function() {
        busca_produto()
        busca_usuarios()
        const produto = document.querySelectorAll('.produto')
        const SelectsDeEtapa = document.querySelectorAll('.etapa-funil');
        const etapas = document.querySelectorAll('.etapa')
        const sections = {
          'PROSPECÇÃO': 'prospect',
          'NEGOCIAÇÃO': 'deal',
          'EXECUÇÃO': 'execut',
          'REPESCAGEM':'repesca'
        };
        
        function handleEtapaChange(etapaSelect) { 
          if (etapaSelect instanceof Event) {
            etapaSelect = etapaSelect.currentTarget;
          }
          // Esconder todas as seções
          for (const sectionId of Object.values(sections)) {
            const section = document.getElementById(sectionId);
            if (section) section.classList.remove('visivel');
          }
          console.log(etapaSelect)
          // Obter o valor da opção selecionada
          const selectedValue = etapaSelect.value;
          const valorProduto = etapaSelect.parentElement.querySelector('.produto').value
          SelectsDeEtapa.forEach(etapaSelect => {
            etapaSelect.value = selectedValue;
            etapaSelect.parentElement.querySelector('.produto').value = valorProduto
          });
        
          // Mostrar a seção correspondente ao valor selecionado
          const sectionToShow = sections[selectedValue];
          if (sectionToShow) {
            document.getElementById(sectionToShow).classList.add('visivel');
          }
          if (selectedValue == 'PROSPECÇÃO'){
            showStep(10)
          } else if (selectedValue == 'NEGOCIAÇÃO') {
            showStep(15)
          } else if(selectedValue == 'EXECUÇÃO'){
            showStep(21)
          }
        }
        SelectsDeEtapa.forEach(etapaSelect => {
          etapaSelect.addEventListener('input', handleEtapaChange);
        });
        // Adiciona o event listener ao select
        function tamanhoPagina() {
          const viewportWidth = window.innerWidth;
          const sidebar = Math.round((150 / viewportWidth) * 100)
          const conteudo = 100 - sidebar
          etapas.forEach(etapa => {
            etapa.style.gridTemplateColumns = `${sidebar}vw ${conteudo}vw`
          })
        }
        window.addEventListener('resize', tamanhoPagina);
      
        async function fetchProductData(productNumber,etapa) {
          const isAuthenticated = true;
          const isAuthenticatedExpiration = localStorage.getItem('isAuthenticatedExpiration');
        
          if (!isAuthenticated || (isAuthenticatedExpiration && Date.now() >= parseInt(isAuthenticatedExpiration))) {
            window.location.href = '/login.html';
            return;
          }
        
          function adjustBodyHeight() {
            if (document.body.clientHeight <= 300) {
              document.body.style.height = '530px';
            } else {
              document.body.style.width = '100vw';
            }
          }
        
          // Adiciona o event listener ao resize
          window.addEventListener('resize', adjustBodyHeight);
        
          const myHeaders = new Headers();
          myHeaders.append("Accept", "application/json");
          myHeaders.append("Cookie", "__cf_bm=53xTQMNzJON7e57.ajQe4QtpGRX8qhWEI294.g0i19U-1705091606-1-AXDZgBWC0wYYJTVs/2CoTc873goN1Q9Br1gyIMJtAag5Qq9YT2faO8X/lgOhW96NiV5sVrGScT4PwMpQIA8ka4M=");
        
          var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
          };
        
          try {
            const response = await fetch(`https://api.pipedrive.com/v1/products/${productNumber}?api_token=6c7d502747be67acc199b483803a28a0c9b95c09`, requestOptions);
            const responseData = await response.json();
            const mapaResponse = await fetch('https://weriqui.github.io/extencaoscript/mapa.json');
            if (!mapaResponse.ok) {
              throw new Error('Falha ao obter o mapa');
            }
            const mapaData = await mapaResponse.json();
            const mapa = mapaData;
      
            const limpar = Object.values(mapa);
            for (let i = 0; i < limpar.length; i++) {
              const element = document.getElementById(limpar[i]);
              if(element){
                element.innerHTML = ''
              }
            }
            Object.entries(mapa).forEach(([key, value]) => {
              const scriptText = responseData.data[key];
              if (scriptText) {
                const formattedText = scriptText.replace(/\n\n/g, '\n').replace(/\n/g, '<br><br>').replace(/XXXXXXXXXX/g,'<strong>XXXXXXXXXX</strong>').replace(/XXXXXXXXX/g,'<strong>XXXXXXXXX</strong>').replace(/XXXXXXXX/g,'<strong>XXXXXXXX</strong>').replace(/XXXXXXX/g,'<strong>XXXXXXX</strong>').replace(/XXXXXX/g,'<strong>XXXXXX</strong>').replace(/XXXXX/g,'<strong>XXXXX</strong>').replace(/XXXX/g,'<strong>XXXX</strong>').replace(/XXX/g,'<strong>XXX</strong>');
                const element = document.getElementById(value);
                if (element) {
                  element.innerHTML = formattedText;
                }
              }
            });
      
            for (let i = 1; i <= totalSteps; i++) {
              const stepEl = document.getElementById('step' + i);
              if (stepEl) {
                stepEl.addEventListener('click', () => showStep(i));
              }
            }
      
            showStep(etapa);
          
          } catch (error) {
            console.log('error', error);
          }
        }
        fetchProductData(produto[0].value,10)
        produto.forEach(produto_clicado => {
          produto_clicado.addEventListener('input', function(event){
            numero_produto = event.currentTarget.value
            fetchProductData(numero_produto, parseInt(document.querySelectorAll('.step-content:not(.hidden)')[0].id.split('-')[1]))
          })
        })
        handleEtapaChange(document.querySelector('.etapa-funil'));
        tamanhoPagina()
    })();

    (function() {
        const redParagraphs = document.querySelectorAll('p.red');
      
        redParagraphs.forEach(p => {
          p.addEventListener('click', function() {
            // Criar elemento de confirmação se não existir
            let confirmation = p.querySelector('.copy-confirmation');
            if (!confirmation) {
              confirmation = document.createElement('span');
              confirmation.classList.add('copy-confirmation');
              confirmation.textContent = 'Copiado!';
              p.appendChild(confirmation);
            }
      
            // Copiar texto, excluindo o elemento de confirmação
            let textToCopy = p.innerHTML
              .replace(/<br>/g, '\n') // Substitui <br> por \n
              .replace(/<[^>]*>/g, '') // Remove outras tags HTML
              .replace('Copiado!', '') // Remove a palavra 'Copiado'
              .replace(/<strong>/g, '') // Remove a tag de abertura <strong>
              .replace(/<\/strong>/g, ''); // Remove a tag de fechamento </strong>
            navigator.clipboard.writeText(textToCopy)
              .then(() => {
                // Mostrar confirmação
                confirmation.classList.add('show-confirmation');
                // Ocultar após a animação
                setTimeout(() => {
                  confirmation.classList.remove('show-confirmation');
                }, 2000);
              })
              .catch(err => {
                console.error('Erro ao copiar texto:', err);
              });
          });
        });
      
        /*document.querySelector('#sidebar').addEventListener('mouseover', function() {
          document.querySelector('p.link').style.width = '250px';
        });
        
        document.querySelector('#sidebar').addEventListener('mouseout', function() {
          document.querySelector('p.link').style.width = 'auto'; // ou qualquer outro valor padrão
        });*/
        
    })();

    (function () {

        document.querySelector("#consulta_telefone").addEventListener('click', function(){
          let numero = document.querySelector("#pesquisa_telefone").value
          pesquisaTelefone(numero)
          if (document.querySelector("#Agente").value = ''){
            const modal = document.querySelector('dialog')
            modal.innerHTML = '<h1>Selecione o Assessor</h1> <button>OK</button>'
            const buttonClose = document.querySelector("dialog button")
            buttonClose.onclick = function () {
              modal.close()
              modal.innerHTML = ''
            }
            modal.showModal()
          }
          document.querySelector("#transfere_negocio").addEventListener('click',converter_lead_em_negocio);
        });
        
    })()

    document.querySelector("#consulta").addEventListener('click',function(){
        if(document.querySelector("#pesquisa").value.length <=14) {
          find(formatarCPF(document.querySelector("#pesquisa").value))
        } else{
          findpj(document.querySelector("#pesquisa").value)
        }
    })

    document.querySelector("#par").addEventListener('click',function(){
        copyPageContent()
    })
});
const totalSteps = 50;
async function showStep(stepNumber) {
  for (let i = 0; i <= totalSteps; i++) {
    const el = document.getElementById('etapa-' + i);
    if (el) {
      el.classList.add('hidden');
    }
  }

  const currentEl = document.getElementById('etapa-' + stepNumber);
  if (currentEl) {
    currentEl.classList.remove('hidden');
  }
}


function createTableFromJson(jsonData) {
  var tableBody = document.getElementById('table-body');
  tableBody.innerHTML = ''; // Limpa o conteúdo existente
  const chavesSelecionadas = ["DATA_REQUERIMENTO","NUMERO_CONTA","TIPO_PARCELAMENTO","MODALIDADE","SITUACAO","QNT_PARCELAS","QNT_PARCELAS_ATRASADAS","VALOR_CONSOLIDADO","VALOR_PINCIPAL"];

  jsonData.forEach(function (item) {
      const novoObjeto = {};

      chavesSelecionadas.forEach(chave => {
          novoObjeto[chave] = item[chave];
      });

      var row = document.createElement('tr'); // Cria a linha da tabela

      // Itera sobre os valores do objeto JSON para cada célula
      for (var key in novoObjeto) {
          if (key !== '_id') { // Ignora a chave '_id'
              var cell = document.createElement('td');
              cell.setAttribute('data-label', key.toUpperCase());
              cell.textContent = novoObjeto[key];
              row.appendChild(cell); // Adiciona a célula na linha
          }
      }

      tableBody.appendChild(row); // Adiciona a linha no corpo da tabela
  });
}


// Função para obter o token de acesso
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
          'CPF': consulta
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
          createTableFromJson(data.documents)
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

function findpj(consulta) {
  const findOneUrl = 'https://sa-east-1.aws.data.mongodb-api.com/app/data-jqjrc/endpoint/data/v1/action/find';
  const requestData = {
    "collection": "par-pj",
    "database": "base-parcelamentos",
    "dataSource": "password",
    "filter": {
      'CPFCNPJDOOPTANTE': consulta
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

  async function handleResponse(response) {
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        // Token might be invalid or expired, try refreshing it
        return getAccessToken(true).then(attemptFind);
      } else {
        // Some other error, rethrow it to be handled by the final catch
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } else {
      const pre_resposta = await response.json();
      
      if (!pre_resposta.documents || pre_resposta.documents.length === 0) {
        return []; // Retorna uma lista vazia se não houver documentos
      }

      // Mapeando as respostas
      const resposta = pre_resposta.documents.map((dict) => {
        const mappedPar = {};
        Object.keys(dict).forEach((key) => {
          if (mapa_par_pj[key]) {
            mappedPar[mapa_par_pj[key]] = dict[key]; // Mapeia o nome do campo no objeto
          }
        });
        return mappedPar; // Retorna o objeto mapeado
      });
      return resposta; // Retorna a lista de objetos mapeados
    }
  }

  getAccessToken()
    .then(attemptFind)
    .then(handleResponse)
    .then(data => {
      if (data.length === 0) {
        document.querySelector("#par").style.display = 'none';
      } else {
        createTableFromJson(data); // Passa a resposta mapeada diretamente
        document.querySelector("#par").style.display = 'block';
      }
    })
    .catch(error => {
      console.error('Failed to find', error);
    });
}




function formatarCPF(cpf) {
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



function copyPageContent() {
  let confirmation = document.querySelector('#card').querySelector('.copy-confirmation');
  if (!confirmation) { 
    confirmation = document.createElement('span'); 
    confirmation.classList.add('copy-confirmation'); 
    confirmation.textContent = 'Copiado!'; 
    document.querySelector('#card').appendChild(confirmation); 
  } 
  window.getSelection().selectAllChildren(document.querySelector('#card')); // Seleciona todo o texto
  
  try {
    // Tente executar o comando de cópia
    const success = document.execCommand('copy');
    if (success) {
      // Mostrar confirmação 
      confirmation.classList.add('show-confirmation'); 
      // Ocultar após a animação 
      setTimeout(() => { 
        confirmation.classList.remove('show-confirmation'); 
      }, 2000); 
    } else {
      // Se o comando de cópia não tiver sucesso
      console.error('Erro ao copiar texto');
    }
  } catch (err) {
    console.error('Erro ao copiar texto:', err);
  }
}

function filtrar_transferir_negocio(dado){ 
  return {
    "id":dado.data[0].id,
    "nome":dado.data[0].person_id.name,
    "telefone":dado.data[0].person_id.phone[0].value,
    "empresa":dado.data[0].org_id.name
  }
}







function arquiva(id){

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Cookie", "__cf_bm=9D7B6wsTsF9i7H6eeqmlwn8R7KX_A0hnLLxLXmasbQM-1707154920-1-AXCnDecJ3lY+x+6cPjocy9k3gX2+4mdYH/UVv+/FYcZSaD4nIOdkhZhisTbegUhKrsioZEQa1gMNGX32znv8HaY=");
    
    let raw = JSON.stringify({
      "is_archived": true
    });
    
    let requestOptions = {
      method: 'PATCH',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    fetch(`https://api.pipedrive.com/v1/leads/${id}?api_token=6c7d502747be67acc199b483803a28a0c9b95c09`, requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
}

async function pesquisar_leads(id){
    let myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Cookie", "__cf_bm=uZLXsan3EYIr0jXLITKQvw2diO7swzKAuu11ClJqL8Y-1707158030-1-ATQv7mQdA2TBU1bCrsLXh8Ggq/xnMpFiZ0nG3sCLUIe8wMEZvP/mUo25grW940UiyOM3V2gwLdB2QaFEKJ1wWag=");

    let requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };
    const response = await fetch(`https://api.pipedrive.com/v1/leads/${id}?api_token=6c7d502747be67acc199b483803a28a0c9b95c09`, requestOptions)
    const result = await response.json()
    const data = await result.data
    return data
}



async function criarNegocio(id,user_id){
  const dados_lead = await pesquisar_leads(id)
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Cookie", "__cf_bm=MapXknZ_t2DbDBgS8GDRVv3YcBaOwVyQrzjWVpVg9qU-1707161535-1-AdfywwTRx5Tm3Gb5oP3GJB4GTtYGoiCaZX5gGgN5jZ/toAk9Q6tq2pE5N6BtUokl7mw/2YtJuoMXMW21VxsxNTI=");
  let raw;
  if(dados_lead["5fca6336de210f847b78ce5fd7de950530e26e94"] == "292"){
    raw =  JSON.stringify({
      "title": dados_lead["title"],
      "value": null,
      "expected_close_date": null,
      "user_id":user_id,
      "person_id": dados_lead["person_id"],
      "org_id": dados_lead["organization_id"],
      "next_activity_id": null,
      "5fca6336de210f847b78ce5fd7de950530e26e94":dados_lead["5fca6336de210f847b78ce5fd7de950530e26e94"],
      "2d242d06151f4dab1bbebe3a6a1de1aa1ccee6cb":dados_lead["2d242d06151f4dab1bbebe3a6a1de1aa1ccee6cb"],
      "2d242d06151f4dab1bbebe3a6a1de1aa1ccee6cb_currency":dados_lead["2d242d06151f4dab1bbebe3a6a1de1aa1ccee6cb_currency"],
      "b79ea16ef66d21e71ab57e75398fc4413228cbbf":dados_lead["b79ea16ef66d21e71ab57e75398fc4413228cbbf"],
      "b79ea16ef66d21e71ab57e75398fc4413228cbbf_currency":dados_lead["b79ea16ef66d21e71ab57e75398fc4413228cbbf_currency"],
      "829d91cab91f6709555655e9e9a6289090407f0d":dados_lead["829d91cab91f6709555655e9e9a6289090407f0d"],
      "829d91cab91f6709555655e9e9a6289090407f0d_currency":dados_lead["829d91cab91f6709555655e9e9a6289090407f0d_currency"],
      "7f58a030551b0e72f14542f150980a167b77444a":dados_lead["7f58a030551b0e72f14542f150980a167b77444a"],
      "9774abceca413e202f5ae99db37af307340304cc":dados_lead["9774abceca413e202f5ae99db37af307340304cc"],
      "f9e21bf8524892128a27d0c7886a85edba97105c":dados_lead["f9e21bf8524892128a27d0c7886a85edba97105c"],
      "8f63351fb6d95b21438dfaf19c09995acabc2f09":dados_lead["8f63351fb6d95b21438dfaf19c09995acabc2f09"],
      "9a5d202668a2e507335baa51573d5b4c4f97ea64":dados_lead["9a5d202668a2e507335baa51573d5b4c4f97ea64"],
      "385630236c989d17c56ec59732b78d23b1f9b56a":dados_lead["385630236c989d17c56ec59732b78d23b1f9b56a"],
      "69b8e808073d8d63787d90385449dc48b00bc10d":user_id,
      "label": "165",
      "visible_to": "1",
      "status": "open",
      "active": true,
      "stage_id": 104
    });

  } else{
    raw =  JSON.stringify({
      "title": dados_lead["title"],
      "value": null,
      "expected_close_date": null,
      "user_id":user_id,
      "person_id": dados_lead["person_id"],
      "org_id": dados_lead["organization_id"],
      "next_activity_id": null,
      "5fca6336de210f847b78ce5fd7de950530e26e94":dados_lead["5fca6336de210f847b78ce5fd7de950530e26e94"],
      "2d242d06151f4dab1bbebe3a6a1de1aa1ccee6cb":dados_lead["2d242d06151f4dab1bbebe3a6a1de1aa1ccee6cb"],
      "2d242d06151f4dab1bbebe3a6a1de1aa1ccee6cb_currency":dados_lead["2d242d06151f4dab1bbebe3a6a1de1aa1ccee6cb_currency"],
      "b79ea16ef66d21e71ab57e75398fc4413228cbbf":dados_lead["b79ea16ef66d21e71ab57e75398fc4413228cbbf"],
      "b79ea16ef66d21e71ab57e75398fc4413228cbbf_currency":dados_lead["b79ea16ef66d21e71ab57e75398fc4413228cbbf_currency"],
      "829d91cab91f6709555655e9e9a6289090407f0d":dados_lead["829d91cab91f6709555655e9e9a6289090407f0d"],
      "829d91cab91f6709555655e9e9a6289090407f0d_currency":dados_lead["829d91cab91f6709555655e9e9a6289090407f0d_currency"],
      "7f58a030551b0e72f14542f150980a167b77444a":dados_lead["7f58a030551b0e72f14542f150980a167b77444a"],
      "9774abceca413e202f5ae99db37af307340304cc":dados_lead["9774abceca413e202f5ae99db37af307340304cc"],
      "f9e21bf8524892128a27d0c7886a85edba97105c":dados_lead["f9e21bf8524892128a27d0c7886a85edba97105c"],
      "8f63351fb6d95b21438dfaf19c09995acabc2f09":dados_lead["8f63351fb6d95b21438dfaf19c09995acabc2f09"],
      "9a5d202668a2e507335baa51573d5b4c4f97ea64":dados_lead["9a5d202668a2e507335baa51573d5b4c4f97ea64"],
      "385630236c989d17c56ec59732b78d23b1f9b56a":dados_lead["385630236c989d17c56ec59732b78d23b1f9b56a"],
      "69b8e808073d8d63787d90385449dc48b00bc10d":user_id,
      "label": "165",
      "visible_to": "1",
      "status": "open",
      "active": true,
      "stage_id": 98
    });
  }
  
  let requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  
  const response = await fetch("https://api.pipedrive.com/v1/deals?api_token=6c7d502747be67acc199b483803a28a0c9b95c09", requestOptions)
  return response.status
}




async function buscar_e_arquivar_leads(org_name){
  let myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Cookie", "__cf_bm=Jzh.42LRkMoQM.UUiIz35SNzbsslT9TBa0ZjuLd0zpc-1707230494-1-AVQzdKUtG3qQutE7enNfWRMTHlahBRHnoPz+38ESTqXrrGWmnf8UL2GnktVhG32tYVXrrqmqExI10y2UflZ7IJg=");
  
  let requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  
  const response = await fetch(`https://api.pipedrive.com/v1/leads/search?term=${org_name}&exact_match=1&api_token=6c7d502747be67acc199b483803a28a0c9b95c09`, requestOptions)
  const result = await response.json()
  console.log(result)
  const bl = await envia_python(result)
  console.log(bl)
  for (let i = 0; i < result.data.items.length; i++) {
    id = result.data.items[i].item.id
    arquiva(id)
  }
  return response.status

}

async function deletar_lead(id){
  let myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  
  let requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    redirect: 'follow'
  };
  
  const reponse = await fetch(`https://api.pipedrive.com/v1/leads/${id}?api_token=6c7d502747be67acc199b483803a28a0c9b95c09`, requestOptions)
  return reponse.status
}

async function converter_lead_em_negocio(){
  const modal = document.querySelector('dialog')
  modal.innerHTML = '<img src="https://usagif.com/wp-content/uploads/loading-63.gif" alt="">'
  modal.style.backgroundColor = 'transparent'
  modal.style.border = 'none'
  modal.showModal()
  document.querySelector('.conteudo').style.opacity = '30%'
  const id_lead = document.querySelector("#nome_da_pessoa").idpipe
  const titulo = document.querySelector("#empresa_da_pessoa").innerText
  const user_id = document.querySelector("#Agente").value
  const negocio_criado = await criarNegocio(id_lead,user_id)
  if (negocio_criado <= 299){
    const deletar_o_lead = await deletar_lead(id_lead)
    if (deletar_o_lead <= 299){
      const arquivar_leads = await buscar_e_arquivar_leads(titulo)
      if(arquivar_leads <= 299){
        modal.style.backgroundColor = 'white'
        modal.style.border = 'black 1px solid'
        modal.innerHTML = '<h1>Negócio Criado Com Sucesso</h1> <button>OK</button>'
        const buttonClose = document.querySelector("dialog button")
        buttonClose.onclick = function () {
          modal.close()
          modal.innerHTML = ''
          document.querySelector('.conteudo').style.opacity = '100%'
        }
      }else{
        alert("Erro ao arquivar os Leads")
      }
    }else{
      alert("Erro ao deletar o Lead")
    }
  }else{
    alert("Erro ao criar o negócio")
  }

}

async function buscar_o_lead(org_name,id_pessoa){
  let myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Cookie", "__cf_bm=Jzh.42LRkMoQM.UUiIz35SNzbsslT9TBa0ZjuLd0zpc-1707230494-1-AVQzdKUtG3qQutE7enNfWRMTHlahBRHnoPz+38ESTqXrrGWmnf8UL2GnktVhG32tYVXrrqmqExI10y2UflZ7IJg=");
  
  let requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  
  const response = await fetch(`https://api.pipedrive.com/v1/leads/search?term=${org_name}&person_id=${id_pessoa}&api_token=6c7d502747be67acc199b483803a28a0c9b95c09`, requestOptions)
  const result = await response.json()
  if (result.data.items.length ==0){
    return 0
  } else{
    const saida = result.data.items[0].item.id
    return saida
  }
  

}

async function pesquisaTelefone(telefone) {
  let apiToken = "6c7d502747be67acc199b483803a28a0c9b95c09"
  const myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Cookie", "__cf_bm=IR_fPRYXr0vB5pkysQR89pQAbg1nMYSvlSmha.IrvqM-1706648269-1-Afmo0+QrwNJkKacoFi92A2Xguux19IkP4gNVm/N9PD3aGyRIGh35VIBNLEkcOMYIjZSJ3JgaTDrAzUbQuM2fwzI=");  
  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };  
  try {
    const response = await fetch(`https://api.pipedrive.com/v1/persons/search?term=${telefone}&start=0&limit=1&api_token=${apiToken}`, requestOptions);
    const result = await response.json();
    if (result.data.items.length == 0){
      const modal = document.querySelector('dialog')
      modal.innerHTML = '<h1>Nenhum Lead encontrado com o telefone informado</h1> <button>OK</button>'
      modal.showModal()
      const buttonClose = document.querySelector("dialog button")
      buttonClose.onclick = function () {
        modal.close()
        modal.innerHTML = ''
      }
    } else {
      const id_lead = await buscar_o_lead(result.data.items[0].item.organization.name,result.data.items[0].item.id,)
      if (id_lead==0){
        const modal = document.querySelector('dialog')
        modal.innerHTML = '<h1>Nenhum Lead encontrado com o telefone informado</h1> <button>OK</button>'
        modal.showModal()
        const buttonClose = document.querySelector("dialog button")
        buttonClose.onclick = function () {
          modal.close()
          modal.innerHTML = ''
        }
      }else{
        const saida = {
          "org_name":result.data.items[0].item.organization.name,
          "nome_pessoa":result.data.items[0].item.name,
          "telefone":result.data.items[0].item.phones[0],
          "id_lead":id_lead
        }
        document.querySelector("#nome_da_pessoa").innerText = saida.nome_pessoa
        document.querySelector("#nome_da_pessoa").idpipe = saida.id_lead
        document.querySelector("#telefone_da_pessoa").innerText = saida.telefone
        document.querySelector("#empresa_da_pessoa").innerText = saida.org_name
        document.querySelector('#dados-deal').style.display = 'block'
        return console.log(saida)
      }
    }
  } catch (error) {
    console.log('error', error); 
  }
}


async function numeros_para_bloqueio(data){
  let lista_numeros = []
  for (let index = 0; index < data.data.items.length; index++) {
      console.log(data.data)
      if (data.data.items[index].item.person){
        const element = data.data.items[index].item.person.id;
        const telefone = await pesquisa_telefone(element)
        lista_numeros.push({"phone_number":formatarTelefone(telefone),"event":"bloqueado"})
      }
  }
  return lista_numeros
}

async function pesquisa_telefone(id){
  let myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Cookie", "__cf_bm=7Trl_n7W5SA5HizzEeSjkff3IRx5QASuILMwZlfDhbg-1707309088-1-AUI6k17jqKV+KNHHoix02+h2Sk6xzH7/CC1lDF7XEnraIZ80L5nJFQxtTJzXL8qnTyO3LoVSHv6NNGlnah+An1Q=");
  
  let requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  
  const response = await fetch(`https://api.pipedrive.com/v1/persons/${id}?api_token=6c7d502747be67acc199b483803a28a0c9b95c09`, requestOptions)
  const saida = await response.json()
  return saida.data.phone[0].value
}



  






async function envia_python(lista){
  // Dicionário de exemplo
  const exemplo = await numeros_para_bloqueio(lista)
  
  // Configurações da solicitação
  const requestOptions = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(exemplo) 
  };
  
  // Enviar solicitação para o servidor Flask
  fetch("https://calix-5d642828daaa.herokuapp.com/altera", requestOptions)
      .then(response => {
          if (!response.ok) {
              throw new Error('Erro ao enviar solicitação');
          }
          return response.json(); // Se o servidor responder com JSON
      })
      .then(data => {
          console.log('Resposta do servidor:', data); // Tratar a resposta do servidor
      })
      .catch(error => {
          console.error('Erro:', error);
      });

}




function formatarTelefone(numero) {
  // Remover quaisquer caracteres não numéricos
  let numeroLimpo = numero.replace(/[^0-9]/g, '');

  // Verificar se o número inclui o código do país do Brasil (55) e removê-lo
  if (numeroLimpo.length > 11 && numeroLimpo.startsWith('55')) {
      numeroLimpo = numeroLimpo.substring(2);
  }

  // Verificar se o número tem 10 dígitos (sem o nono dígito) e adicionar o nono dígito
  if (numeroLimpo.length === 10) {
      numeroLimpo = numeroLimpo.substring(0, 2) + '9' + numeroLimpo.substring(2);
  }

  // Verificar se o número tem 11 dígitos (com o nono dígito) e formatar
  if (numeroLimpo.length === 11) {
      return '(' + numeroLimpo.substring(0, 2) + ') ' + numeroLimpo.substring(2, 7) + '-' + numeroLimpo.substring(7);
  }
}








async function busca_usuarios(){
  let myHeaders = new Headers();
  const select = document.querySelector('#Agente')
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Cookie", "__cf_bm=uZLXsan3EYIr0jXLITKQvw2diO7swzKAuu11ClJqL8Y-1707158030-1-ATQv7mQdA2TBU1bCrsLXh8Ggq/xnMpFiZ0nG3sCLUIe8wMEZvP/mUo25grW940UiyOM3V2gwLdB2QaFEKJ1wWag=");

  let requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
  };
  const response = await fetch("https://api.pipedrive.com/v1/users?api_token=6c7d502747be67acc199b483803a28a0c9b95c09", requestOptions)
  const result = await response.json()
  const data = await result.data
  let option = '<option value="">Selecione</option>\n '
  for(usuario of data){
      if(usuario.active_flag){
          option+=`<option value="${usuario.id}">${usuario.name}</option>\n`
      }
  }
  select.innerHTML =  option
}

async function busca_produto(){
  let myHeaders = new Headers();
  const select = document.querySelectorAll('select.produto')
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Cookie", "__cf_bm=uZLXsan3EYIr0jXLITKQvw2diO7swzKAuu11ClJqL8Y-1707158030-1-ATQv7mQdA2TBU1bCrsLXh8Ggq/xnMpFiZ0nG3sCLUIe8wMEZvP/mUo25grW940UiyOM3V2gwLdB2QaFEKJ1wWag=");

  let requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
  };
  const response = await fetch("https://api.pipedrive.com/v1/products?filter_id=109&api_token=6c7d502747be67acc199b483803a28a0c9b95c09", requestOptions)
  const result = await response.json()
  const data = await result.data
  let option = '<option value="">Selecione</option>\n '
  for(produto of data){
      if(produto.active_flag){
          option+=`<option value="${produto.id}">${produto.name}</option>\n`
      }
  }
  select.forEach(function(sele){
	sele.innerHTML =  option
  })
  
}

const mapa_par_pj = {
  "MESANODOREQUERIMENTODOPARCELAMENTO":"DATA_REQUERIMENTO",
  "NUMERODACONTADOPARCELAMENTO":"NUMERO_CONTA",
  "TIPODEPARCELAMENTO":"TIPO_PARCELAMENTO",
  "MODALIDADEDOPARCELAMENTO":"MODALIDADE",
  "SITUACAODOPARCELAMENTO":"SITUACAO",
  "QTDEDEPARCELASCONCEDIDAS":"QNT_PARCELAS",
  "PARCELASATRASADAS":"QNT_PARCELAS_ATRASADAS",
  "VALORCONSOLIDADO":"VALOR_CONSOLIDADO",
  "VALORDOPRINCIPAL":"VALOR_PINCIPAL"
}


