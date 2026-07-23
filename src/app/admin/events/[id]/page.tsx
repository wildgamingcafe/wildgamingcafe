import EventForm from "@/components/admin/EventForm";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <EventForm eventId={resolvedParams.id} />;
}
