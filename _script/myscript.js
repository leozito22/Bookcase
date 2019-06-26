var edicao = 0, obj;

// Caso exista no Local Storage, recupera os dados salvos. Caso contrário, cria a partir do arquivo JSON
var dados = JSON.parse(localStorage.getItem('dados'));
var usuario_logado= JSON.parse(localStorage.getItem('usuario_logado'));
if (!dados) {
    dados = contas;
    localStorage.setItem('dados', JSON.stringify(dados));
};

// Abre janela para preenchimento de formulário de cadastro de app
function novo(valid) {

    // Se novo cadastro (valid=1), limpa formulário
    if (valid==1) {
        $("#form-anuncio")[0].reset();
        limpafotAn();
    }
    
    // Acende DIV branca-transparente em volta da janela de edição/visualização de dados
    embacar();
    
    // Insere classe que permite acender DIV do formulário
    let element, name, arr;
    element = document.getElementById("novoCad");
    name = "visible";
    arr = element.className.split(" ");
    if (arr.indexOf(name) == -1) {
        element.className += " " + name;
    }
}

// Abre janela de visualização de dados do app cadastrado, a partir de seu ID como parâmetro
function visualizar(id) {
    
    // Acender DIV branca-transparente em volta da janela de edição/visualização de dados
    embacar();

    // Insere classe que permite acender DIV com dados preenchidos
    let element, name, arr;
    element = document.getElementById("visualiza");
    name = "visible";
    arr = element.className.split(" ");
    if (arr.indexOf(name) == -1) {
        element.className += " " + name;
    }

    // carrega os dados do app nos campos input para visualização (parâmetro 1)
    carregaDados(id, 1);
}

// Acende DIV branca-transparente em volta da janela de edição/visualização de dados
function embacar() {
    var element, name, arr;
    element = document.getElementById("opaco");
    name = "opacoVisible";
    arr = element.className.split(" ");
    if (arr.indexOf(name) == -1) {
        element.className += " " + name;
    }
}

// Apaga DIV branca-transparente e as janelas de edição/visualização de dados, retornando para a tabela de anuncio cadastrados
function voltar() {
    var element = document.getElementById("opaco");
    element.classList.remove("opacoVisible");
    element = document.getElementById("novoCad");
    element.classList.remove("visible");
    element = document.getElementById("visualiza");
    element.classList.remove("visible");
}

// Limpa a fotAn do app carregada na DIV
function limpafotAn() {
    image = `<img src="/_imagens/img0.jpg" alt="fotAn_inicial">`;
    document.getElementById("fotAn").innerHTML = image;
}

/* Verifica se os campos obrigatórios estão preenchidos, ou se os campos estão corretamente preenchidos
function check() {
    $('#form-anuncio')[0].checkValidity();
}*/

// Executa a leitura dos dados armazenados e apresenta os anuncio cadastrados em forma de tabela
function exibeAnuncio() {

    // Remove todas as linhas do corpo da tabela
    $("#table-anuncio").html("");

    // Popula a tabela com os registros do banco de dados
    for (i = 0; i < dados.livros.length; i++) {
        let livros = dados.livros[i];
        $("#table-anuncio").append(`<tr><td><input type="button" class="btn btn-warning small edit" value="&#9998" 
        title="Editar" onclick="editar(${livros.id})"> &nbsp<input type="button" class="btn btn-danger small delete" 
        value="&#10006" title="Excluir" onclick="deleta(${livros.id})"></td><td onclick="visualizar(${livros.id})">${livros.titAn}</td><td 
        onclick="visualizar(${livros.id})">${livros.descAn}</td><td onclick="visualizar(${livros.id})">${livros.contAn}</td>
        </tr>`);
        }
    
}

// Exibe mensagem em um elemento de ID msg
function displayMessage(msg) {
    
    // Acrescenta classe à DIV para ficar à frente da DIV branca-transparente
    let element, name, arr;
    element = document.getElementById("msg");
    name = "frente";
    arr = element.className.split(" ");
    if (arr.indexOf(name) == -1) {
        element.className += " " + name;
    }
    
    // Insere os dados da mensagem de alerta na DIV e exibe a mensagem
    $('#msg').html('<div class="alert alert-danger">' + msg + '</div>');
}


// Insere no banco de dados o registro com dados do app
function insertAnuncio(anuncio) {

    // Calcula novo Id a partir do último código existente no array para novo cadastro. Se edição, retorna valor salvo
    if (edicao != 1) {
        novoId = (dados.livros.length)+1;
    }
    else {
        novoId = idAtual;
    }
    
    // Organiza os dados na forma do registro
    let novoAnuncio = {
        "user_id": usuario_logado,
        "id": novoId,
        "fotAn": anuncio.fotAn,
        "titAn": anuncio.titAn,
        "descAn": anuncio.descAn,
        "locAn": anuncio.locAn,
        "contAn": anuncio.contAn
    };

    // Insere o novo objeto no array para novos cadastros, ou atualiza em caso de edição
    if (edicao != 1) {
        dados.livros.push(novoAnuncio);
        displayMessage("Anuncio inserido com sucesso!");
    }
    else {
        dados.livros[novoId-1] = novoAnuncio;
        displayMessage("Anuncio atualizado com sucesso!");
    }

    // Atualiza os dados no Local Storage
    localStorage.setItem('dados', JSON.stringify(dados));

    // Altera "edicao" para diferente de 1, considerando que a próxima tarefa seja novo cadastro
    edicao = 0;
}

// Adiciona funções para tratar os eventos ao carregar da página
function init() {

    // Executa a leitura dos dados armazenados e apresenta os anuncio cadastrados em forma de tabela
    exibeAnuncio();

    // Intercepta o click do botão Salvar
    $("#btnInsert").click(function () {

        // Verfica se o formulário está preenchido corretamente
        if (!$('#form-anuncio')[0].checkValidity()) {
            displayMessage("Preencha o formulário corretamente.");
            return;
        }

        // Obtem os valores dos campos do formulário
        let campoFoto = $("#inputfotAn").val();
                let campoTitulo = $("#inputtitAn").val();
                let campoDesc = $("#inputdescAn").val();
                let campoLoc = $('#inputlocAn').val();
                let campoCont = $('#inputcontAn').val();
                let anuncio = { fotAn: campoFoto, titAn: campoTitulo, descAn: campoDesc, locAn: campoLoc, contAn: campoCont };

        // Insere no banco de dados o registro com dados do app
        insertAnuncio(anuncio);

        // Reexibe os anuncio
        exibeAnuncio();

        // Limpa o formulario e retorna à tela de exibição dos anuncio cadastrados
        $("#form-anuncio")[0].reset();
        limpafotAn();
        voltar();
    });

    // Intercepta o click do botão Carrega fotAn
    $("#btnImg").click(function () {
        endfotAn = document.getElementById("inputfotAn").value;
        if (endfotAn == "") {
            displayMessage("Forneça um endereço de imagem da WEB no campo indicado.");
            document.getElementById("inputfotAn").focus();
        }
        else {
            image = `<img id="thumbnail" src="${endfotAn}" alt="fotAn">`;
            document.getElementById("fotAn").innerHTML = image;
            displayMessage("Imagem atualizada com sucesso!");
        }
    });

    // Intercepta o click do botão Cancelar
    $("#btnCancelar").click(function () {
        
        // Retorna à visualização da tabela de anuncio cadastrados
        voltar();

        // Reexibe os anuncio
        exibeAnuncio();

        // Limpa o formulario e retorna à tela de exibição dos anuncio cadastrados
        $("#form-anuncio")[0].reset();
        limpafotAn()
    });

    // Intercepta o click do botão Limpar
    $("#btnClear").click(function () {
        $("#form-anuncio")[0].reset();
        limpafotAn();
    });

    // Oculta a mensagem de aviso após alguns segundos
    $('#msg').bind("DOMSubtreeModified", function () {
        window.setTimeout(function () {
            $(".alert").fadeTo(500, 0).slideUp(500, function () {
                $(this).remove();
                let element = document.getElementById("msg");
                element.classList.remove("frente");
            });
        }, 2500);
    });
}

// Carrega os dados do Local Storage nos campos input para edição (i=0) ou visualização (i=1), conforme parâmetro i

function carregaDados(id, i) {
    obj = dados.livros[id-1];
        document.getElementsByClassName('fieldId')[i].value = obj.id;
        document.getElementsByClassName('fieldtitAn')[i].value = obj.titAn;
        document.getElementsByClassName('fieldfotAn')[i].value = obj.fotAn;
        document.getElementsByClassName('fielddescAn')[i].value = obj.descAn;
        document.getElementsByClassName('fieldlocAn')[i].value = obj.locAn;
        document.getElementsByClassName('fieldcontAn')[i].value = obj.contAn;
        let img = `<img id="thumbnail" src="${obj.fotAn}" alt="fotAn">`
        document.getElementsByClassName("fieldImg")[i].innerHTML = img;
}

// Abre janela para edição de contato específico cadastrado, a partir de seu respectivo botão
function editar(id) {
    
    // Torna visível a tela de edição
    novo(0);

    // Carrega os dados armazenados para os inputs
    carregaDados(id, 0);
    
    // Identifica tratar-se de edicao, para salvar os dados no respectivo array
    edicao = 1;
    
    // Carrega o ID atual para mantê-lo na alteração, e não criar novo
    idAtual = id;
}

// Detela um contato cadastrado no Local Storage a partir de seu ID (recebido como parâmetro)
function deleta(id) {
    dados.livros.splice(id-1, 1);

    displayMessage("Anuncio removido com sucesso!");
    
    // Reordena os números ID dos anuncio cadastrados após a exclusão de um app
    reordenaId();

    // Atualiza os dados no Local Storage
    localStorage.setItem('dados', JSON.stringify(dados));

    // Reexibe os anuncio
    exibeAnuncio();
}

// Reordena os números ID dos anuncio cadastrados após a exclusão de um app
function reordenaId() {
    obj = dados.livros;
    for (i=0; i<obj.length; i++) {
        if (i != (obj[i].id+1)) {
            obj[i].id = i+1;
        }
    }
}