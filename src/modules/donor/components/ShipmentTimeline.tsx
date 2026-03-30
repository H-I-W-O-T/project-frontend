import type { ShipmentEvent } from '../types/donor.types';

interface ShipmentTimelineProps {
  events: any[]; // Accepting raw mapped events from the hook
}

export const ShipmentTimeline = ({ events }: ShipmentTimelineProps) => {
  // 1. Sort events chronologically (Stellar ledger timestamps are in seconds)
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'create': return '📦';
      case 'transfer': return '🚚';
      case 'damage': return '⚠️';
      case 'distribute': return '👥';
      default: return '📍';
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'create': return 'bg-teal-600';
      case 'transfer': return 'bg-blue-500';
      case 'damage': return 'bg-red-500';
      case 'distribute': return 'bg-green-600';
      default: return 'bg-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString([], {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <div className="relative pl-8 border-l-2 border-gray-100 ml-4 space-y-8">
      {sortedEvents.map((event, index) => (
        <div key={event.eventId || index} className="relative">
          {/* Timeline Dot */}
          <div className={`absolute -left-[2.65rem] top-1 w-5 h-5 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${getEventColor(event.eventType)}`}>
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{getEventIcon(event.eventType)}</span>
                <h4 className="font-bold text-gray-900 capitalize">
                  {event.eventType === 'create' ? 'Batch Initialized' : 
                   event.eventType === 'transfer' ? 'Custody Transfer' : 
                   event.eventType === 'damage' ? 'Damage Reported' : 'Distribution Event'}
                </h4>
              </div>
              <span className="text-xs font-medium text-gray-400">
                {formatDate(event.timestamp)}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex items-center gap-1 font-medium">
                <span className="opacity-70">📍 Location:</span> {event.location}
              </p>

              {event.eventType === 'transfer' && (
                <div className="bg-blue-50 p-2 rounded text-[10px] border border-blue-100 font-mono">
                  <p><span className="font-semibold text-blue-700 uppercase">From:</span> {event.from}</p>
                  <p><span className="font-semibold text-blue-700 uppercase">To:</span> {event.to}</p>
                </div>
              )}

              <p className={`${event.eventType === 'damage' ? 'text-red-600 font-bold' : ''}`}>
                {event.eventType === 'create' ? 'Initial Quantity' : 'Update'}: {event.quantity.toLocaleString()} units
              </p>

              {event.notes && (
                <p className="italic text-gray-500 bg-gray-50 p-2 rounded text-xs">
                  "{event.notes}"
                </p>
              )}

              {/* Stellar Ledger Verification Link */}
              <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                  🛡️ STELLAR VERIFIED
                </span>
                <a 
                  href={`https://stellar.expert/explorer/testnet/tx/${event.eventId}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-[10px] text-primary hover:underline font-mono"
                >
                  TX: {event.eventId.slice(0, 12)}...
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};