/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetCourses } from "@/src/hooks/course/useCourses";
import { BookOpen, MoreHorizontalIcon, SearchIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/src/hooks/auth/use-auth";
import { useRouter } from "next/navigation";

const categoryConfig = {
  SNBT: { label: "SNBT", variant: "default" as const },
  SKD: { label: "SKD", variant: "secondary" as const },
  REGULER: { label: "Reguler", variant: "outline" as const },
};

const formatPrice = (price: number) => {
  if (price === 0) return "Gratis";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

const CoursesPage = () => {
  const router = useRouter();
    const { user, isAuthenticated } = useAuth();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filter, setFilter] = useState<{
    page: number;
    limit: number;
    search: string;
    category: "SNBT" | "SKD" | "REGULER" | undefined;
    isPublished: boolean | undefined
  }>({
    page: 1,
    limit: 10,
    search: "",
    category: undefined,
    isPublished: undefined
  });

  const { courses, isLoading, meta } = useGetCourses(filter);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilter((prev) => ({ ...prev, search: debouncedSearch, page: 1 }));
  }, [debouncedSearch]);

  useEffect(() => {
      if(isLoading) return;
      if (!isAuthenticated && user?.role !== "INSTRUCTOR") {
        toast.warning('Access Anda Ditolak!')
        router.push('/sign-in');
      }
    }, [user, router, isAuthenticated, isLoading]);

   if (user?.role !== "INSTRUCTOR") return null;
    if(!isAuthenticated) return null; 

  return (
    <div className="p-8 space-y-4">
      {/* Filter + Tambah Course */}
      <div className="flex flex-row gap-4 w-full">
        <InputGroup className="flex-1">
          <InputGroupInput
            placeholder="Search..."
            value={search}
            onChange={(e: any) => setSearch(e.target.value)}
          />
          <InputGroupAddon>
            <SearchIcon className="text-muted-foreground" size={16} />
          </InputGroupAddon>
        </InputGroup>

        <Select
          onValueChange={(value) =>
            setFilter((prev) => ({
              ...prev,
              category: value === "SEMUA" ? undefined : (value as typeof filter.category),
              page: 1,
            }))
          }
        >
          <SelectTrigger className="w-[180px] text-black">
            <SelectValue placeholder="Semua Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="SEMUA">Semua Kategori</SelectItem>
              <SelectItem value="SNBT">SNBT</SelectItem>
              <SelectItem value="SKD">SKD</SelectItem>
              <SelectItem value="REGULER">REGULER</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

         <Select
          onValueChange={(value) =>
            setFilter((prev) => ({
              ...prev,
              isPublished: value === "SEMUA" ? undefined : value === "true",
              page: 1,
            }))
          }
        >
          <SelectTrigger className="w-[180px] text-black">
            <SelectValue placeholder="Semua Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="SEMUA">Status</SelectItem>
              <SelectItem value="true">Published</SelectItem>
              <SelectItem value="false">Draft</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-black font-semibold">No</TableHead>
            <TableHead className="text-black font-semibold">Course</TableHead>
            <TableHead className="text-black font-semibold">Kategori</TableHead>
            <TableHead className="text-black font-semibold">Harga</TableHead>
            <TableHead className="text-black font-semibold">Siswa</TableHead>
            <TableHead className="text-black font-semibold">Status</TableHead>
            <TableHead className="text-black font-semibold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Loading */}
          {isLoading && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                Loading...
              </TableCell>
            </TableRow>
          )}

          {/* Empty */}
          {!isLoading && courses?.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                Belum ada course
              </TableCell>
            </TableRow>
          )}

          {/* Data */}
          {!isLoading &&
            courses?.map((course, index) => (
              <TableRow key={course.id}>
                <TableCell>
                  {(filter.page - 1) * filter.limit + index + 1}
                </TableCell>

                {/* Thumbnail + Title */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-16 rounded overflow-hidden bg-slate-100 flex-shrink-0">
                      {course.thumbnail ? (
                        <Image
                          src={course.thumbnail}
                          alt={course.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <BookOpen size={14} className="text-slate-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm line-clamp-1">{course.title}</p>
                      <p className="text-xs text-muted-foreground">{course.instructor?.name}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge className={categoryConfig[course.category as keyof typeof categoryConfig].variant !== 'outline' ? 'text-white' : 'text-black' } variant={categoryConfig[course.category as keyof typeof categoryConfig]?.variant ?? "outline"}>
                    {categoryConfig[course.category as keyof typeof categoryConfig]?.label ?? course.category}
                  </Badge>
                </TableCell>

                <TableCell className="font-medium">
                  {formatPrice(Number(course.price))}
                </TableCell>

                <TableCell>
                  {course._count?.enrollments ?? 0} siswa
                </TableCell>

                <TableCell>
                  <Badge className="text-white" variant={course.isPublished !== true ? 'destructive' : 'default'}>
                    {course.isPublished ? "Published" : "Draft"}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger >
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontalIcon size={16} />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem >
                        <Link href={`/course/update/${course.id}`}>Edit</Link>
                      </DropdownMenuItem>
                       <DropdownMenuItem >
                        <Link href={`/course/${course.id}/quiz/create`}>Buat Quiz</Link>
                      </DropdownMenuItem>
                       <DropdownMenuItem >
                        <Link href={`/course/${course.id}/videos/create`}>Buat Video Pembelajaran</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem >
                        <Link href={`/course/details/${course.slug}`}>
                          Preview
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive">
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Menampilkan {(filter.page - 1) * filter.limit + 1}–
            {Math.min(filter.page * filter.limit, meta.total)} dari {meta.total} course
          </p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setFilter((prev) => ({ ...prev, page: prev.page - 1 }))}
                  className={!meta.hasPrevPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              <PaginationItem>
                <span className="text-sm px-4">
                  {meta.page} / {meta.totalPages}
                </span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={() => setFilter((prev) => ({ ...prev, page: prev.page + 1 }))}
                  className={!meta.hasNextPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;