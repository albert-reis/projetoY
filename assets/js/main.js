function serializeDataForm (add, formData) {
    let dataArray = {};

    // Se for opração de adição, obtem o valor do ID
    if (add) {
        let id = parseInt(localStorage.getItem("id_item"));

        if (id) {
            id += 1;
        } else {
            id = 1;
        }
        // O SetItem salva o valor da chave em LocalStorage
        localStorage.setItem("id_item", id);
    }

    $.map(formData, function(n, i){
        // Se for oeração adição, salva no array o valor do ID
        if (add) {
            if (i === 0) {
                // O GetItem obtém o valor da chave em LocalStorage
                dataArray['id'] = localStorage.getItem("id_item");
            }
        }
        // Salva no formato JSON todas as informações inseridas pelo usuário no formato chave/valor
        dataArray[n['name']] = n['value'];
    });
    return dataArray;
}

function loadItems () {
    let items = [];

    // Se o localstorage não estiver vazio
    if (localStorage.getItem("items") !== null) {
        // Obtém todos os registros salvas no localstorege (formato Json)
        items = JSON.parse(localStorage.getItem("items"));
    }
    return items;
}

// Função cadastrar item
$("#store").on("submit", function(e){
    // Bloqueia o envio de requisição
    e.preventDefault();

    // Serializa os dados do formulário
    let formData = $(this).serializeArray();

    // Executa função para converter no formato de JSON
    let dataArray = serializeDataForm(true, formData);

    // Chama função para carregar os itens que estão no LocalStorage
    let items = loadItems();

    // Adiociona o novo elemento
    items.push(dataArray);

    // Salva em formato JSON no LocalStorage
    localStorage.setItem("items", JSON.stringify(items));

    // Apresento uma mensagem para o usuário
    alert("Item Adicionado!");

    // Redireciono o usuário para a tela de listagem
    window.location.href = "listar.html";
});

function loadItemData (id) {
    // Chama função para carregar os itens que estão no LocalStorage
    let items = loadItems();

    // Procuro o ID salvo LocalStorage igual ao recebido no parâmetro GET da URL
    let item = items.find(c => c.id === id);

    // Verifica se existem dados do ID informado. Se não existir aparesenta uma mensagem e redireciona o usuário para o listar.html. Se existir preenche todas as informação do formulário com os dados salvos em LocalStorage.
    if (typeof item === "undefined") {
        alert("Item não encontrado");
        window.location.href = "listar.html";
    } else {
        $("#id").val(item.id);
        $("#nome").val(item.nome);
        $("#unidade").val(item.unidade);
        $("#quantidade").val(item.quantidade);
        $("#preco").val(item.preco);
        if (item.perecivel === "on") {
            $('#perecivel').prop('checked', true);
        }
        $("#data").val(item.data);
    }
}

$("#edit").on("submit", function(e){
    // Bloqueia o envio de requisição
    e.preventDefault();

    // Serializa os dados do formulário já com o ID, pois é uma edição
    let formData = $(this).serializeArray();

    // Executa função para converter no formato de JSON
    let dataArray = serializeDataForm(false, formData);

    // Chama função para carregar os itens que estão no LocalStorage
    let items = loadItems();

    // Procuro a posição do ID dentro do array, e subtituo os valores antigos pelos valores do array com as novas informações
    items[items.findIndex(c => c.id === dataArray.id)] = dataArray;

    // Salvo em LocalStorage as novas informações do produto adicionado
    localStorage.setItem("items", JSON.stringify(items));

    // Apresento uma mensagem para o usuário
    alert("Item Editado!");

    // Redireciono o usuário para a tela de listagem
    window.location.href = "listar.html";
});


// Função para excluir o item do localstorage
function deleteItem (id) {
    // Chama função para carregar os itens que estão no LocalStorage
    let items = loadItems();

    // Procuro o item pelo ID
    let item = items.findIndex(c => c.id === id);

    // Excluo ele do array items
    items.splice(item, 1);

    // Salva em localstorage o array sem o item excluído
    localStorage.setItem("items", JSON.stringify(items));
    alert("Item Excluído!");
    window.location.href = "listar.html";
}

// Função para imprimir todos os itens salvos no localstorage dentro do TBODY.
function loadItemsTable() {
    // Chama função para carregar os itens que estão no LocalStorage
    let items = loadItems();

    // Inicializa a variável
    let html = "";

    // Para cada item do Local Storage monta as linhas da tabela
    items.forEach(item => {
        let textoPerecivel = "Não";
        if (item.perecivel === "on") {
            textoPerecivel = "Sim";
        }
        html += `<tr>
                <td>${item.nome}</td>
                <td>${item.unidade}</td>
                <td>${item.quantidade}</td>
                <td>${item.preco}</td>
                <td>${textoPerecivel}</td>
                <td>${item.data}</td>
                <td><a href="editar.html?id=${item.id}">Editar</a> | <a href="#" onclick="deleteItem(${item.id})">Deletar</a></td>
            </tr>`;
    });

    // Funciona como uma impressãdo do HTML gerado no foreach acima na tag tbody da tabela
    $("#itemsBody").html(html);
}
