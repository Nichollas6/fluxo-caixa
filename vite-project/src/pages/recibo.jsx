function gerarRecibo(venda) {
  const texto = `
MK IMPORTS

Cliente: ${venda.cliente}
Produto: ${venda.produto}
Qtd: ${venda.quantidade}

Total: R$ ${venda.valor}
  `;

  alert(texto);
}