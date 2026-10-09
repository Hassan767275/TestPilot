import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DataList } from "../lib/types";

export default function TestTable({ data }: { data: DataList }) {
  return (
    <div className="w-full max-w-3xl px-1">
      <Table>
        <TableCaption className="text-[#525252] text-left font-bold text-lg caption-top">
          TESTS
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>CREATED</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(({ id, url, status, created_at }) => (
            <TableRow key={id}>
              <TableHead>{id}</TableHead>
              <TableHead>{url}</TableHead>
              <TableHead>{status}</TableHead>
              <TableHead>{created_at}</TableHead>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
