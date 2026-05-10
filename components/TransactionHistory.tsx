import type { Transaction } from "@/types/payment";

interface TransactionHistoryProps {
  history: Transaction[];
  selectedTransactionId: string | null;
  onSelectTransaction: (id: string) => void;
}

const currencyFormatter = (currency: Transaction["currency"], amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
};

const timestampFormatter = (value: string): string => {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
};

const statusLabel: Record<Transaction["status"], string> = {
  idle: "Idle",
  processing: "Processing",
  success: "Success",
  failed: "Failed",
  timeout: "Timeout",
};

export function TransactionHistory({
  history,
  selectedTransactionId,
  onSelectTransaction,
}: TransactionHistoryProps) {
  const selectedTransaction = history.find((item) => item.id === selectedTransactionId) ?? null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">Transaction History</h2>

      {history.length === 0 ? (
        <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">No transactions yet.</p>
      ) : (
        <ul className="mt-4 space-y-2 overflow-y-auto max-h-96">
          {history.map((transaction) => {
            const isSelected = selectedTransactionId === transaction.id;
            return (
              <li key={transaction.id}>
                <button
                  type="button"
                  onClick={() => onSelectTransaction(transaction.id)}
                  className={`w-full rounded-xl border p-3 text-left transition ${
                    isSelected
                      ? "border-cyan-500 bg-cyan-50"
                      : "border-slate-200 bg-white hover:border-cyan-300 hover:bg-slate-50"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{transaction.id}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">
                      {currencyFormatter(transaction.currency, transaction.amount)}
                    </p>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                      {statusLabel[transaction.status]}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{timestampFormatter(transaction.timestamp)}</p>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {selectedTransaction ? (
        <article className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700">Selected Transaction</h3>
          <dl className="mt-3 grid grid-cols-1 gap-2 text-sm text-slate-800">
            <div>
              <dt className="font-semibold">Transaction ID</dt>
              <dd>{selectedTransaction.id}</dd>
            </div>
            <div>
              <dt className="font-semibold">Amount</dt>
              <dd>{currencyFormatter(selectedTransaction.currency, selectedTransaction.amount)}</dd>
            </div>
            <div>
              <dt className="font-semibold">Status</dt>
              <dd>{statusLabel[selectedTransaction.status]}</dd>
            </div>
            <div>
              <dt className="font-semibold">Timestamp</dt>
              <dd>{timestampFormatter(selectedTransaction.timestamp)}</dd>
            </div>
            {selectedTransaction.reason ? (
              <div>
                <dt className="font-semibold">Reason</dt>
                <dd>{selectedTransaction.reason}</dd>
              </div>
            ) : null}
          </dl>
        </article>
      ) : null}
    </section>
  );
}
