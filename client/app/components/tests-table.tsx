"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
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

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: userTimeZone,
    month: "short",
    day: "2-digit",
    year: "numeric",
  })

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
          {data.map(({ id, url, status, created_at }) => {
            console.log(created_at)
            console.log(dateFormatter.format(new Date(created_at)))
            return <TableRow key={id} className="text-left">
              <TableCell>{id}</TableCell>
              <TableCell>{url}</TableCell>
              <TableCell>{status}</TableCell>
              <TableCell>{dateFormatter.format(new Date(created_at))}</TableCell>
              {status === "failed" || status === "complete" ? (
                <TableCell>View</TableCell>
              ) : status === "pending" ? (
                <TableCell>Generating...</TableCell>
              ) : (
                <TableCell>-</TableCell>
              )}
            </TableRow>
          })}
        </TableBody>
      </Table>
    </div>
  );
}
