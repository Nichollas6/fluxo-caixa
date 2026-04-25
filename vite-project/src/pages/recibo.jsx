function gerarRecibo(vendas) {
  const texto = `
MK IMPORTS

Cliente: ${vendas.cliente}
Produto: ${vendas.produto}
Qtd: ${vendas.quantidade}

Total: R$ ${vendas.valor}
  `;

  alert(texto);
}