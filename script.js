document.addEventListener('DOMContentLoaded', () => {
    const produtos = [
        { id: 1, nome: 'Produto 1', descricao: 'Descrição do Produto 1.', preco: 25.99, imagem: 'produto1.jpg' },
        { id: 2, nome: 'Produto 2', descricao: 'Descrição do Produto 2.', preco: 49.50, imagem: 'produto1.jpg' },
        { id: 3, nome: 'Produto 3', descricao: 'Descrição do Produto 3.', preco: 12.75, imagem: 'produto1.jpg' },
        // Adicione mais produtos aqui
    ];

    const produtosGrid = document.querySelector('.produtos-grid');
    const carrinhoIconImagem = document.querySelector('.carrinho-icon img');
    const modalCarrinho = document.getElementById('modal-carrinho');
    const corpoTabelaCarrinho = document.getElementById('corpo-tabela-carrinho');
    const valorTotalElement = document.getElementById('valor-total');
    const fecharModal = document.querySelector('.fechar-modal');
    const carrinhoQuantidadeElement = document.getElementById('carrinho-quantidade');

    let carrinho = [];

    // Função para renderizar os produtos na página
    function renderizarProdutos() {
        produtos.forEach(produto => {
            const produtoDiv = document.createElement('div');
            produtoDiv.classList.add('produto');
            produtoDiv.innerHTML = `
                <img src="${produto.imagem}" alt="${produto.nome}">
                <h3>${produto.nome}</h3>
                <p>${produto.descricao}</p>
                <p class="preco">R$ ${produto.preco.toFixed(2)}</p>
                <div class="comprar">
                    <input type="number" value="1" min="1" id="quantidade-${produto.id}">
                    <button class="adicionar-carrinho" data-id="${produto.id}">Adicionar</button>
                </div>
            `;
            produtosGrid.appendChild(produtoDiv);
        });

        // Adicionar event listeners aos botões "Adicionar ao Carrinho"
        const botoesAdicionar = document.querySelectorAll('.adicionar-carrinho');
        botoesAdicionar.forEach(botao => {
            botao.addEventListener('click', adicionarAoCarrinho);
        });
    }

    // Função para adicionar um produto ao carrinho
    function adicionarAoCarrinho(event) {
        const produtoId = parseInt(event.target.dataset.id);
        const produtoSelecionado = produtos.find(produto => produto.id === produtoId);
        const quantidadeInput = document.getElementById(`quantidade-${produtoId}`);
        const quantidade = parseInt(quantidadeInput.value);

        if (produtoSelecionado && quantidade > 0) {
            const itemExistente = carrinho.find(item => item.id === produtoId);

            if (itemExistente) {
                itemExistente.quantidade += quantidade;
            } else {
                carrinho.push({ ...produtoSelecionado, quantidade });
            }

            atualizarCarrinho();
        }
    }

    // Função para remover um item do carrinho
    function removerDoCarrinho(id) {
        carrinho = carrinho.filter(item => item.id !== id);
        atualizarCarrinho();
    }

    // Função para atualizar a exibição do carrinho (agora em tabela)
    function atualizarCarrinho() {
        corpoTabelaCarrinho.innerHTML = '';
        let valorTotal = 0;

        carrinho.forEach(item => {
            const linha = corpoTabelaCarrinho.insertRow();

            const colunaNome = linha.insertCell();
            colunaNome.textContent = item.nome;

            const colunaQuantidade = linha.insertCell();
            colunaQuantidade.textContent = item.quantidade;

            const colunaPrecoUnitario = linha.insertCell();
            colunaPrecoUnitario.textContent = `R$ ${item.preco.toFixed(2)}`;

            const colunaPrecoTotal = linha.insertCell();
            colunaPrecoTotal.textContent = `R$ ${(item.preco * item.quantidade).toFixed(2)}`;

            const colunaAcoes = linha.insertCell();
            const botaoRemover = document.createElement('button');
            botaoRemover.textContent = 'Remover';
            botaoRemover.classList.add('remover-item');
            botaoRemover.dataset.id = item.id;
            botaoRemover.addEventListener('click', (event) => {
                const itemId = parseInt(event.target.dataset.id);
                removerDoCarrinho(itemId);
            });
            colunaAcoes.appendChild(botaoRemover);

            valorTotal += item.preco * item.quantidade;
        });

        valorTotalElement.textContent = valorTotal.toFixed(2);
        carrinhoQuantidadeElement.textContent = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
    }

    // Event listener para abrir o modal do carrinho (na imagem)
    carrinhoIconImagem.addEventListener('click', () => {
        console.log('Ícone do carrinho clicado!'); // Adicione esta linha
        atualizarCarrinho();
        modalCarrinho.classList.add('aberto');
    });

    // Event listener para fechar o modal do carrinho
    fecharModal.addEventListener('click', () => {
        modalCarrinho.classList.remove('aberto');
    });

    // Fechar o modal se o usuário clicar fora dele
    window.addEventListener('click', (event) => {
        if (event.target === modalCarrinho) {
            modalCarrinho.classList.remove('aberto');
        }
    });

    // Inicializar a página renderizando os produtos
    renderizarProdutos();
    atualizarCarrinho(); // Inicializa a contagem do carrinho
});