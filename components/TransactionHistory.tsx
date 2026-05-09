export function TransactionHistory() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">Transaction History</h2>

      <ul className="mt-4 space-y-2">
        <li className="w-full rounded-xl border border-cyan-500 bg-cyan-50 p-3 text-left">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">AC7C6B63-B772-4507-850F</p>
          <div className="mt-1 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">$1,565.00</p>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">Success</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">5/9/2026, 4:21:43 PM</p>
        </li>

        <li className="w-full rounded-xl border border-slate-200 bg-white p-3 text-left">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">C4C9DCDB-A14F-440B-843F</p>
          <div className="mt-1 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">$1,565.00</p>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">Success</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">5/9/2026, 4:21:48 PM</p>
        </li>
      </ul>

      <article className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700">Selected Transaction</h3>
        <dl className="mt-3 grid grid-cols-1 gap-2 text-sm text-slate-800">
          <div>
            <dt className="font-semibold">Transaction ID</dt>
            <dd>AC7C6B63-B772-4507-850F</dd>
          </div>
          <div>
            <dt className="font-semibold">Amount</dt>
            <dd>$1,565.00</dd>
          </div>
          <div>
            <dt className="font-semibold">Status</dt>
            <dd>Success</dd>
          </div>
          <div>
            <dt className="font-semibold">Attempts</dt>
            <dd>1</dd>
          </div>
          <div>
            <dt className="font-semibold">Timestamp</dt>
            <dd>5/9/2026, 4:21:43 PM</dd>
          </div>
          <div>
            <dt className="font-semibold">Reason</dt>
            <dd>Completed successfully.</dd>
          </div>
        </dl>
      </article>
    </section>
  );
}
