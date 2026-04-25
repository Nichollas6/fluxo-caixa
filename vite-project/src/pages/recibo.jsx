function gerarRecibo(Vendas) {
  const win = window.open("", "_blank");

  win.document.write(`
    <html>
      <head>
        <title>Recibo</title>
        <style>
          body{
            font-family: Arial;
            text-align:center;
            padding:20px;
          }

          h2{
            margin-bottom:20px;
          }

          hr{
            margin:20px 0;
          }
        </style>
      </head>

      <body>

        <h2>🧾 MK IMPORTS</h2>

        <p><strong>Cliente:</strong> ${venda.cliente || "Balcão"}</p>

        <p><strong>Produto:</strong> ${venda.produto}</p>

        <p><strong>Quantidade:</strong> ${venda.quantidade}</p>

        <hr/>

        <h3>Total: R$ ${Number(venda.valor).toFixed(2)}</h3>

        <p>Obrigado pela preferência 🙏</p>

        <script>
          window.print();
        </script>

      </body>
    </html>
  `);

  win.document.close();
}