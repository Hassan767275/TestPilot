"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DataList } from "../lib/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TestTable({ data }: { data: DataList }) {
  const router = useRouter();
  function pollData() {
    for (const url of data) {
      if (url.status === "pending") {
        router.refresh();
        break;
      }
    }
  }

  useEffect(() => {
    const timerId = setTimeout(pollData, 2000);

    return () => {
      clearTimeout(timerId);
    };
  }, [data]);

  return (
    <div className="w-full max-w-3xl px-1 mb-5">
      <Table>
        <TableCaption className="text-[#525252] text-left font-bold text-lg caption-top">
          TESTS
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>STATUS</TableHead>
            <TableHead>CREATED</TableHead>
            <TableHead>REPORT</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(({ id, url, status, created_at }) => (
            <TableRow key={id}>
              <TableHead>{id}</TableHead>
              <TableHead>{url}</TableHead>
              <TableHead>{status}</TableHead>
              <TableHead>{created_at}</TableHead>
              {status === "failed" || status === "complete" ? (
                <TableHead>View</TableHead>
              ) : status === "pending" ? (
                <TableHead>Generating...</TableHead>
              ) : (
                <TableHead>-</TableHead>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
