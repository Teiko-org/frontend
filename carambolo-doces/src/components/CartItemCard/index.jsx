import React from "react";

function StatusPill({ label = "Pendente", color = "bg-yellow-500" }) {
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm ${color}`}>
      <span className="w-2 h-2 rounded-full bg-white"></span>
      {label}
    </span>
  );
}

function getStatusColor(status) {
  const s = String(status || '').toUpperCase();
  if (s === 'PAGO') return 'bg-green-600';
  if (s === 'CONCLUIDO' || s === 'CONCLUÍDO') return 'bg-blue';
  if (s === 'CANCELADO') return 'bg-red-600';
  return 'bg-yellow-500';
}

export default function CartItemCard({
  image,
  title,
  subtitle,
  availableText = "Disponível",
  unitPrice = 0,
  quantity = 1,
  onDecrease,
  onIncrease,
  disableIncrease = false,
  statusLabel = "Pendente",
  statusColor,
  rightSuffix = "",
  totalText = "Valor Total Estimado:",
  disclaimer = "Esse valor não inclui o valor do frete.",
  className = "",
  selectable = false,
  selected = false,
  onSelectChange,
}) {
  const format = (v) => Number(v || 0).toFixed(2).replace(".", ",");
  const total = Number(unitPrice || 0) * Number(quantity || 0);
  const pillColor = statusColor || getStatusColor(statusLabel);

  return (
    <div className={`w-full bg-bgHome border-2 border-gold rounded-2xl p-4 md:p-5 transition-shadow hover:shadow-lg hover:border-darkGold ${className}`} style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <div className="flex gap-4 md:gap-6 items-start">
        <img
          src={image ?? "src/assets/image_card.png"}
          alt={title}
          className="w-28 h-28 md:w-36 md:h-36 object-cover rounded-lg border border-gold"
        />

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-4">
            <div className="min-w-0">
              <h3 className="text-black text-lg md:text-xl font-medium truncate" style={{ fontFamily: 'Montserrat, sans-serif' }}>{title}</h3>
              <button className="text-green-600 text-sm font-medium underline-offset-2 hover:underline">
                {availableText}
              </button>
              {subtitle && (
                <p className="text-black/80 text-sm mt-2 truncate">{subtitle}</p>
              )}
            </div>

            <div className="text-right whitespace-nowrap">
              <div className="text-black text-xs md:text-sm">Valor Unitário:</div>
              <div className="text-black font-semibold md:text-lg">R$ {format(unitPrice)}</div>
              {rightSuffix && (
                <div className="text-black/70 text-xs md:text-sm mt-1">{rightSuffix}</div>
              )}
            </div>
          </div>

          <div className="flex items-end justify-between gap-4 md:gap-6 mt-4">
            <div className="flex flex-col">
              <div className="text-black text-sm">Quantidade</div>
              <div className="mt-2 flex items-center bg-white rounded-full border-2 border-gold overflow-hidden">
                <button
                  onClick={onDecrease}
                  className="px-3 py-1 text-black hover:bg-black/5"
                >
                  –
                </button>
                <span className="px-4 py-1 text-black font-semibold">{quantity}</span>
                <button
                  onClick={onIncrease}
                  disabled={disableIncrease}
                  className={`px-3 py-1 text-black hover:bg-black/5 ${disableIncrease ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  +
                </button>
              </div>
            </div>

            <StatusPill label={statusLabel} color={pillColor} />
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-gold text-black">
        <div className="flex justify-end items-baseline">
          <span className="mr-2 md:mr-3 font-medium text-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>{totalText}</span>
          <span className="font-bold md:text-lg text-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>R$ {format(total)}</span>
        </div>
        <div className="text-right text-xs md:text-sm text-red-600 mt-1">{disclaimer}</div>
      </div>
    </div>
  );
}


