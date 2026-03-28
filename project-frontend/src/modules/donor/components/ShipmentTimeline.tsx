import type { ShipmentEvent } from '../types/donor.types';

interface ShipmentTimelineProps {
  events: ShipmentEvent[];
}

export const ShipmentTimeline = ({ events }: ShipmentTimelineProps) => {
  const getEventIcon = (type: ShipmentEvent['eventType']) => {
    switch (type) {
      case 'create':
        return '📦';
      case 'transfer':
        return '🚚';
      case 'damage':
        return '⚠️';
      case 'distribute':
        return '👥';
      default:
        return '📍';
    }
  };

  const getEventTitle = (event: ShipmentEvent) => {
    switch (event.eventType) {
      case 'create':
        return 'Shipment Created';
      case 'transfer':
        return `Transferred to ${event.to || 'Next Destination'}`;
      case 'damage':
        return `${event.quantity} Units Damaged`;
      case 'distribute':
        return `Distributed to Beneficiaries`;
      default:
        return 'Event';
    }
  };

  const getEventColor = (type: ShipmentEvent['eventType']) => {
    switch (type) {
      case 'create':
        return 'bg-primary';
      case 'transfer':
        return 'bg-primary-light';
      case 'damage':
        return 'bg-warning';
      case 'distribute':
        return 'bg-success';
      default:
        return 'bg-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="timeline">
      {events.map((event, index) => (
        <div key={event.eventId} className="timeline-item relative pb-6 last:pb-0">
          <div className={`timeline-dot absolute left-[-1.85rem] top-0 w-3 h-3 rounded-full ${getEventColor(event.eventType)} ring-4 ring-white`} />
          <div className="ml-6">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xl">{getEventIcon(event.eventType)}</span>
              <p className="font-semibold text-gray-900">
                {getEventTitle(event)}
              </p>
            </div>
            <p className="text-sm text-gray-500 mb-1">
              {formatDate(event.timestamp)}
            </p>
            {event.location && (
              <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                <span>📍</span> {event.location}
              </p>
            )}
            {event.from && event.to && event.eventType === 'transfer' && (
              <p className="text-xs text-gray-500 mb-1">
                From: {event.from} → To: {event.to}
              </p>
            )}
            {event.quantity > 0 && event.eventType !== 'transfer' && (
              <p className="text-xs text-gray-600 mb-1">
                Quantity: {event.quantity.toLocaleString()} units
              </p>
            )}
            {event.notes && (
              <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-2 rounded">
                📝 {event.notes}
              </p>
            )}
            {event.evidenceHash && (
              <p className="text-xs text-primary-500 mt-1">
                🔗 Evidence: {event.evidenceHash.slice(0, 20)}...
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};