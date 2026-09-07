import { Spinner } from '@/components/ui/Spinner';

export default function AdminSectionLoading() {
  return (
    <div className="flex items-center justify-center py-24">
      <Spinner className="h-6 w-6 text-navy-400" />
    </div>
  );
}
