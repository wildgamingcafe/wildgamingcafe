import EventForm from "@/components/admin/EventForm";

export default function EditEventPage({ params }: { params: { id: string } }) {
  return <EventForm eventId={params.id} />;
}
