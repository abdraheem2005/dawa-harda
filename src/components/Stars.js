export default function Stars({ value, size = 'text-lg' }) {
  const rounded = Math.round(value)
  return (
    <span className={`text-amber-500 ${size}`} aria-label={`${value} out of 5 stars`}>
      {'★'.repeat(rounded)}
      {'☆'.repeat(5 - rounded)}
    </span>
  )
}