import { notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import ProductForm from '@/components/ProductForm'

export default async function EditProduct({ params }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: product } = await supabase.from('products').select().eq('id', id).single()

  if (!product) notFound()

  return (
    <main className="max-w-xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-green-900 mb-6">Edit Product</h1>
      <ProductForm product={product} />
    </main>
  )
}