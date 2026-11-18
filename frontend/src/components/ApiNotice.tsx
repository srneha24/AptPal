export function ApiNotice({ message, tone = 'error' }: { message: string; tone?: 'error' | 'success' }) {
  const isSuccess = tone === 'success'
  return (
    <div role={isSuccess ? 'status' : 'alert'} className={`rounded-xl border px-4 py-3 text-sm ${isSuccess ? 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200' : 'border-red-300 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200'}`}>
      {message}
    </div>
  )
}
