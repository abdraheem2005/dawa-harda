import ProductForm from '@/components/ProductForm'

export default function NewProduct() {
  return (
    <main className="max-w-xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-green-900 mb-6">Add Product</h1>
      <ProductForm />
    </main>
  )
}