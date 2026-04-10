import Card from "./components/Card";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">
        📊 Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <Card>
          <h2 className="text-gray-500">Saldo</h2>
          <p className="text-2xl font-bold text-green-600">
            R$ 5.200
          </p>
        </Card>

        <Card>
          <h2 className="text-gray-500">Vendas</h2>
          <p className="text-2xl font-bold">
            32
          </p>
        </Card>

        <Card>
          <h2 className="text-gray-500">Produtos</h2>
          <p className="text-2xl font-bold">
            12
          </p>
        </Card>

      </div>
    </div>
  );
}